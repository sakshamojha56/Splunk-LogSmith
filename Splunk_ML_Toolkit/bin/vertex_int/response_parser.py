#!/usr/bin/env python3
"""Vertex AI response parsing."""

import re
from typing import Any, Dict, List, Union

import pandas as pd

from sagemaker_int.response_parser import ConfigurationError, ResponseParser


class VertexResponseParser(ResponseParser):
    """Parse Vertex endpoint responses into DataFrames."""

    def _parse_single_record(self, response_data: Union[Dict, List]) -> pd.DataFrame:
        """Parse a single Vertex response record."""
        if not self.output_prediction_map:
            raise ConfigurationError("output_prediction_map is required for response parsing.")

        record = {}
        for response_path, col_name in self.output_prediction_map.items():
            if (
                response_path.startswith('[')
                and response_path.endswith(']')
                and response_path[1:-1].isdigit()
            ):
                value = self._extract_top_level_index(response_data, int(response_path[1:-1]))
            elif (
                '[*]' not in response_path
                and '[' in response_path
                and response_path.endswith(']')
            ):
                value = self._extract_array_index(response_data, response_path)
            elif '[*]' in response_path:
                value = self._extract_first_batch_value(response_data, response_path)
            else:
                value = (
                    self._extract_nested_value(response_data, response_path.split('.'))
                    if isinstance(response_data, dict)
                    else None
                )

            record[col_name] = value

        return pd.DataFrame([record])

    def _parse_batch(self, response_data: Dict) -> pd.DataFrame:
        """Parse a Vertex batch response."""
        predictions = self._extract_predictions_array(response_data)

        if not isinstance(predictions, list):
            predictions = [predictions]

        if not self.output_prediction_map:
            if predictions and isinstance(predictions[0], dict):
                return pd.DataFrame(predictions)
            return pd.DataFrame({'prediction': predictions})

        if self.pattern.is_nested:
            return self._extract_nested(predictions)
        if self.pattern.is_positional:
            return self._extract_positional(predictions)
        return self._extract_named(predictions)

    def _extract_nested(self, predictions: List[Dict]) -> pd.DataFrame:
        """Extract values from Vertex prediction objects using nested paths."""
        records = []
        for pred_obj in predictions:
            record = {}
            for response_path, col_name in self.output_prediction_map.items():
                prop_path = self._path_after_batch_wildcard(response_path)
                value = self._extract_nested_value(pred_obj, prop_path)
                record[col_name] = value
            records.append(record)
        return pd.DataFrame(records)

    def _extract_top_level_index(self, response_data: Union[Dict, List], index: int) -> Any:
        if isinstance(response_data, list) and len(response_data) > index:
            return response_data[index]

        if isinstance(response_data, dict):
            for value in response_data.values():
                if isinstance(value, list) and len(value) > index:
                    return value[index]

        return None

    def _extract_array_index(self, response_data: Union[Dict, List], response_path: str) -> Any:
        match = re.match(r'^([^[]+)\[(\d+)\]$', response_path)
        if not match:
            return None

        parent_key = match.group(1)
        index = int(match.group(2))
        if not isinstance(response_data, dict) or parent_key not in response_data:
            return None

        array_value = response_data[parent_key]
        if isinstance(array_value, list) and len(array_value) > index:
            return array_value[index]
        return None

    def _extract_first_batch_value(
        self, response_data: Union[Dict, List], response_path: str
    ) -> Any:
        prop_name = response_path.split('[*]')[0]

        if not prop_name:
            first_prediction = (
                response_data[0]
                if isinstance(response_data, list) and len(response_data) > 0
                else None
            )
        else:
            array_value = (
                response_data.get(prop_name, []) if isinstance(response_data, dict) else []
            )
            first_prediction = (
                array_value[0]
                if isinstance(array_value, list) and len(array_value) > 0
                else None
            )

        relative_path = self._path_after_batch_wildcard(response_path)
        if not relative_path:
            return first_prediction
        return self._extract_nested_value(first_prediction, relative_path)

    def _path_after_batch_wildcard(self, response_path: str) -> List[str]:
        """Return the path relative to each batch prediction item."""
        if '[*]' not in response_path:
            return response_path.split('.') if response_path else []

        _, relative_path = response_path.split('[*]', 1)
        relative_path = relative_path.lstrip('.')
        if not relative_path:
            return []
        return relative_path.split('.')

    def _extract_nested_value(self, obj: Any, path: List[str]) -> Any:
        """Extract a nested value, including array-index path segments."""
        if not path or obj is None:
            return obj

        segment = path[0]
        key = segment
        index = None

        match = re.match(r'^([^\[\]]+)\[(\d+)\]$', segment)
        if match:
            key = match.group(1)
            index = int(match.group(2))
        elif re.match(r'^\[(\d+)\]$', segment):
            key = None
            index = int(segment[1:-1])

        if key is None:
            current = obj
        elif isinstance(obj, dict):
            if key not in obj:
                return None
            current = obj[key]
        else:
            return None

        if index is not None:
            if not isinstance(current, list) or index >= len(current):
                return None
            current = current[index]

        if len(path) == 1:
            return current
        return self._extract_nested_value(current, path[1:])
