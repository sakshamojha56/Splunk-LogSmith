#!/usr/bin/env python3
"""Response Parser - SageMaker Endpoint Response to DataFrame Transformation."""

import json
from typing import Dict, Any, List, Union
from io import StringIO
import pandas as pd
import sys
import os
import cexc

from sagemaker_int.pattern_types import Pattern, detect_pattern

logger = cexc.get_logger(__name__)


class ConfigurationError(Exception):
    pass


class ResponseParser:
    """Parses endpoint responses into DataFrames based on schema and pattern."""

    def __init__(
        self,
        output_prediction_map: Dict[str, str],
        response_schema: Dict[str, Any],
        is_batch_mode: bool,
    ):
        self.output_prediction_map = output_prediction_map or {}
        self.schema = response_schema
        self.is_batch_mode = is_batch_mode
        self.pattern = detect_pattern(output_prediction_map, is_output_map=True)
        logger.debug(
            f"ResponseParser initialized: pattern={self.pattern.value}, batch={is_batch_mode}"
        )

    def parse(self, response_body: Union[str, bytes], content_type: str) -> pd.DataFrame:
        """Parse response into DataFrame."""
        base_content_type = content_type.split(';')[0].strip() if content_type else ''

        if base_content_type == 'text/csv':
            return self._parse_csv(response_body)
        elif base_content_type == 'application/jsonlines':
            return self._parse_jsonlines(response_body)
        elif base_content_type == 'application/json':
            return self._parse_json(response_body)
        else:
            logger.error(f"Unsupported response content type: {content_type}")
            raise ValueError(
                f"Response content type '{content_type}' is not supported. "
                f"The endpoint returned an unexpected format."
            )

    def _parse_csv(self, response_body: str) -> pd.DataFrame:
        """Parse CSV response (no headers)."""
        df = pd.read_csv(StringIO(response_body), header=None)

        if self.output_prediction_map:
            col_names = list(self.output_prediction_map.values())
            rename_dict = {i: col_names[i] for i in range(min(len(col_names), len(df.columns)))}
            df = df.rename(columns=rename_dict)
        else:
            df = df.rename(columns={i: f'predictions_{i}' for i in range(len(df.columns))})
        return df

    def _parse_jsonlines(self, response_body: str) -> pd.DataFrame:
        lines = response_body.strip().split('\n')
        records = [json.loads(line) for line in lines if line.strip()]
        return pd.DataFrame(records)

    def _parse_json(self, response_body: str) -> pd.DataFrame:
        """Parse JSON response using detected pattern."""
        response_data = json.loads(response_body)

        if not self.is_batch_mode:
            return self._parse_single_record(response_data)
        return self._parse_batch(response_data)

    def _parse_single_record(self, response_data: Union[Dict, List]) -> pd.DataFrame:
        """Parse single-record response."""
        if not self.output_prediction_map:
            raise ConfigurationError("output_prediction_map is required for response parsing.")

        record = {}

        for response_path, col_name in self.output_prediction_map.items():
            if (
                response_path.startswith('[')
                and response_path.endswith(']')
                and response_path[1:-1].isdigit()
            ):
                index = int(response_path[1:-1])

                if isinstance(response_data, list) and len(response_data) > index:
                    value = response_data[index]
                elif isinstance(response_data, dict):
                    array_found = None
                    for v in response_data.values():
                        if isinstance(v, list) and len(v) > index:
                            array_found = v
                            break
                    value = array_found[index] if array_found is not None else None
                else:
                    value = None

            elif '[' in response_path and response_path.endswith(']'):
                import re

                match = re.match(r'^([^[]+)\[(\d+)\]$', response_path)
                if match:
                    parent_key = match.group(1)
                    index = int(match.group(2))

                    if isinstance(response_data, dict) and parent_key in response_data:
                        array_value = response_data[parent_key]
                        if isinstance(array_value, list) and len(array_value) > index:
                            value = array_value[index]
                        else:
                            value = None
                    else:
                        value = None
                else:
                    value = None

            elif '[*]' in response_path:
                prop_name = response_path.split('[*]')[0]

                if not prop_name:
                    if isinstance(response_data, list) and len(response_data) > 0:
                        value = response_data[0]
                    else:
                        value = None
                else:
                    array_value = (
                        response_data.get(prop_name, [])
                        if isinstance(response_data, dict)
                        else []
                    )

                if isinstance(array_value, list) and len(array_value) > 0:
                    if '.' in response_path:
                        nested_prop = response_path.split('.')[-1]
                        if isinstance(array_value[0], dict):
                            value = array_value[0].get(nested_prop)
                        else:
                            value = array_value[0]
                    else:
                        value = array_value[0]
                else:
                    value = array_value

            else:
                if isinstance(response_data, dict):
                    value = self._extract_nested_value(response_data, response_path.split('.'))
                else:
                    value = None

            record[col_name] = value

        return pd.DataFrame([record])

    def _parse_batch(self, response_data: Dict) -> pd.DataFrame:
        """Parse batch response."""
        predictions = self._extract_predictions_array(response_data)

        if not isinstance(predictions, list):
            predictions = [predictions]

        if not self.output_prediction_map:
            if predictions and isinstance(predictions[0], dict):
                return pd.DataFrame(predictions)
            else:
                return pd.DataFrame({'prediction': predictions})

        if self.pattern.is_positional:
            return self._extract_positional(predictions)
        elif self.pattern.is_nested:
            return self._extract_nested(predictions)
        else:
            return self._extract_named(predictions)

    def _extract_predictions_array(self, response_data: Dict) -> List:
        """
        Extract predictions array from response using pattern-driven logic.

        Priority:
        1. output_prediction_map pattern (e.g., "results[*].score" → "results")
        2. Schema properties (first array property)
        3. First array found in response
        4. Response itself (if already an array)
        """
        # Step 1: Try parent key from output_prediction_map (pattern-driven)
        if self.output_prediction_map:
            first_path = list(self.output_prediction_map.keys())[0]
            parent_key = first_path.split('[')[0]

            if parent_key and parent_key in response_data:
                return response_data[parent_key]

        # Step 2: Try schema-defined response key (find first array property)
        properties = self.schema.get('properties', {})
        if properties:
            for key, prop in properties.items():
                if prop.get('type') == 'array' and key in response_data:
                    return response_data[key]

        # Step 3: Find first array in response dict (when no parent specified)
        if isinstance(response_data, dict):
            for value in response_data.values():
                if isinstance(value, list):
                    return value

        # Step 4: Return as-is (response itself might be the array)
        return response_data

    def _extract_positional(self, predictions: List) -> pd.DataFrame:
        """Extract predictions using positional indices."""
        records = []
        for pred_array in predictions:
            record = {}
            for response_path, col_name in self.output_prediction_map.items():
                import re

                match = re.search(r'\[(\d+)\]$', response_path)

                if match and isinstance(pred_array, list):
                    index = int(match.group(1))
                    if index < len(pred_array):
                        record[col_name] = pred_array[index]
                    else:
                        record[col_name] = None
                else:
                    record[col_name] = None
            records.append(record)
        return pd.DataFrame(records)

    def _extract_nested(self, predictions: List[Dict]) -> pd.DataFrame:
        """Extract predictions using nested paths."""
        records = []
        for pred_obj in predictions:
            record = {}
            for response_path, col_name in self.output_prediction_map.items():
                prop_path = response_path.replace('[*]', '').split('.')[1:]
                value = self._extract_nested_value(pred_obj, prop_path)
                record[col_name] = value
            records.append(record)
        return pd.DataFrame(records)

    def _extract_named(self, predictions: List[Dict]) -> pd.DataFrame:
        """Extract predictions using simple property names."""
        if not predictions or not isinstance(predictions[0], dict):
            if not self.output_prediction_map:
                raise ConfigurationError(
                    "output_prediction_map is required for extracting prediction values."
                )
            col_name = list(self.output_prediction_map.values())[0]
            return pd.DataFrame({col_name: predictions})

        df = pd.DataFrame(predictions)

        rename_map = {}
        for response_path, col_name in self.output_prediction_map.items():
            prop_name = response_path.split('.')[-1].replace('[*]', '')
            if prop_name in df.columns:
                rename_map[prop_name] = col_name

        if rename_map:
            df = df.rename(columns=rename_map)
        return df

    def _extract_nested_value(self, obj: Any, path: List[str]) -> Any:
        """Extract value from nested object using path (recursive)."""
        if not path or obj is None:
            return obj
        if not isinstance(obj, dict):
            return None

        key = path[0]
        if key not in obj:
            return None

        if len(path) == 1:
            return obj[key]
        else:
            return self._extract_nested_value(obj[key], path[1:])
