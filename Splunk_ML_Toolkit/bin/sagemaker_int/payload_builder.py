#!/usr/bin/env python3
"""Payload Builder - DataFrame to SageMaker Endpoint Request Payload Transformation."""

import json
from typing import Dict, Any, List, Union
import pandas as pd
import numpy as np
import sys
import os
import cexc

from sagemaker_int.pattern_types import Pattern, detect_pattern
from sagemaker_int.constants import CONTENT_TYPE_JSON, CONTENT_TYPE_JSONLINES, CONTENT_TYPE_CSV

logger = cexc.get_logger(__name__)


class ConfigurationError(Exception):
    pass


class NumpyEncoder(json.JSONEncoder):
    """JSON encoder that handles numpy types."""

    def default(self, obj):
        if isinstance(obj, (np.integer, np.int64, np.int32)):
            return int(obj)
        elif isinstance(obj, (np.floating, np.float64, np.float32)):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, pd.Series):
            return obj.tolist()
        return super().default(obj)


class PayloadBuilder:
    """Builds request payloads from DataFrames based on schema and pattern."""

    def __init__(
        self,
        input_feature_map: Dict[str, str],
        request_schema: Dict[str, Any],
        is_batch_mode: bool,
    ):
        self.input_feature_map = input_feature_map or {}
        self.schema = request_schema
        self.is_batch_mode = is_batch_mode
        self.pattern = detect_pattern(input_feature_map)
        logger.debug(
            f"PayloadBuilder initialized: pattern={self.pattern.value}, batch={is_batch_mode}"
        )

    def build(self, df: pd.DataFrame, content_type: str) -> Union[str, bytes]:
        """Build payload from DataFrame."""
        if content_type == CONTENT_TYPE_CSV:
            return self._to_csv(df)
        elif content_type == CONTENT_TYPE_JSON:
            return self._to_json(df)
        elif content_type == CONTENT_TYPE_JSONLINES:
            return self._to_jsonlines(df)
        else:
            logger.error(f"Unsupported content type requested: {content_type}")
            raise ValueError(
                f"Content type '{content_type}' is not supported. "
                f"Supported formats: application/json, text/csv, application/jsonlines."
            )

    def _to_csv(self, df: pd.DataFrame) -> str:
        return df.to_csv(index=False, header=False)

    def _to_json(self, df: pd.DataFrame) -> str:
        """
        Convert DataFrame to JSON payload using detected pattern.

        Steps:
        1. Detect schema structure (root array, simple object, etc.)
        2. Extract parent key from input_feature_map or schema
        3. Route to single-record or batch mode handler
        4. Build nested structures based on pattern
        """
        # Step 1: Detect schema structure
        is_root_array = self.schema.get('type') == 'array'
        is_simple_object = False

        if (
            self.schema.get('type') == 'object'
            and 'properties' in self.schema
            and not is_root_array
        ):
            props = self.schema.get('properties', {})
            is_simple_object = not any(prop.get('type') == 'array' for prop in props.values())

        # Step 2: Extract parent key from input_feature_map pattern
        parent_key = None
        if self.input_feature_map and not is_simple_object:
            first_path = list(self.input_feature_map.values())[0]
            if '[*]' in first_path:
                parent_key = first_path.split('[*]')[0]

        # Step 3: If no parent key from feature map, try to detect from schema
        if not parent_key and not is_simple_object:
            properties = self.schema.get('properties', {})
            if properties:
                for key, prop in properties.items():
                    if prop.get('type') == 'array':
                        parent_key = key
                        break

        if not self.is_batch_mode:
            if len(df) != 1:
                logger.error(f"Single-record mode invoked with {len(df)} rows (expected 1)")
                raise ValueError(
                    f"Model configuration mismatch. "
                    f"This model expects single records but received multiple rows."
                )

            row = df.iloc[0]

            if self.pattern == Pattern.WILDCARD:
                wildcard_value = self.input_feature_map['*']
                key = (
                    wildcard_value.replace('[*]', '').replace('[', '').replace(']', '').strip()
                )
                return json.dumps({key: [row.tolist()]}, cls=NumpyEncoder)

            if self.pattern == Pattern.SINGLE_POSITIONAL:
                value_array = self._build_positional_array(row)
                if is_root_array:
                    return json.dumps(value_array, cls=NumpyEncoder)
                else:
                    if not parent_key:
                        raise ConfigurationError(
                            "Unable to determine parent key for SINGLE_POSITIONAL pattern."
                        )
                    return json.dumps({parent_key: value_array}, cls=NumpyEncoder)

            if self.pattern == Pattern.SINGLE_NESTED:
                nested_obj = self._build_nested_object(row)
                return json.dumps(nested_obj, cls=NumpyEncoder)

            obj = self._row_to_dict(row)

            if is_simple_object and self.pattern == Pattern.SIMPLE:
                return json.dumps(obj, cls=NumpyEncoder)

            if not parent_key:
                raise ConfigurationError(
                    f"Unable to determine parent key for {self.pattern.value} pattern."
                )
            return json.dumps({parent_key: [obj]}, cls=NumpyEncoder)

        instances = []

        if self.pattern == Pattern.BATCH_POSITIONAL:
            for _, row in df.iterrows():
                instances.append(self._build_positional_array(row))
        elif self.pattern == Pattern.BATCH_NESTED_POSITIONAL:
            for _, row in df.iterrows():
                instances.append(self._build_nested_positional_object(row))
        elif self.pattern in [Pattern.BATCH_NAMED, Pattern.BATCH_NESTED_OBJECT]:
            for _, row in df.iterrows():
                instances.append(self._build_named_object(row))
        elif self.pattern == Pattern.WILDCARD:
            for _, row in df.iterrows():
                instances.append(row.tolist())
        else:
            raise ConfigurationError(
                f"Unsupported pattern type for batch mode: {self.pattern}."
            )

        if not parent_key or parent_key == '':
            if is_root_array:
                return json.dumps(instances, cls=NumpyEncoder)
            else:
                raise ConfigurationError(
                    f"Unable to determine parent key for batch mode with pattern {self.pattern.value}."
                )

        return json.dumps({parent_key: instances}, cls=NumpyEncoder)

    def _to_jsonlines(self, df: pd.DataFrame) -> str:
        """Convert DataFrame to JSONLINES payload."""
        lines = []
        for _, row in df.iterrows():
            if self.pattern == Pattern.WILDCARD:
                wildcard_value = self.input_feature_map['*']
                key = (
                    wildcard_value.replace('[*]', '').replace('[', '').replace(']', '').strip()
                )
                obj = {key: row.tolist()}
            elif self.pattern.is_nested:
                obj = self._build_nested_object(row)
            elif self.pattern.is_positional:
                obj = row.tolist()
            else:
                obj = self._row_to_dict(row)
            lines.append(json.dumps(obj, cls=NumpyEncoder))
        return '\n'.join(lines)

    def _build_positional_array(self, row: pd.Series) -> List:
        """Build positional array from row based on feature map indices."""
        if not self.input_feature_map:
            return row.tolist()

        import re

        index_map = {}
        for col_name, path in self.input_feature_map.items():
            match = re.search(r'\[(\d+)\]', path)
            if match and col_name in row.index:
                index = int(match.group(1))
                index_map[index] = row[col_name]

        if not index_map:
            return row.tolist()

        max_index = max(index_map.keys())
        result = [None] * (max_index + 1)
        for idx, value in index_map.items():
            result[idx] = value
        return result

    def _build_nested_positional_object(self, row: pd.Series) -> Dict[str, Any]:
        """Build nested object with positional arrays inside."""
        if not self.input_feature_map:
            return row.to_dict()

        import re

        property_arrays = {}

        for col_name, path in self.input_feature_map.items():
            if col_name not in row.index:
                continue

            path_after_star = re.sub(r'^[^[]+\[\*\]\.', '', path)
            index_match = re.search(r'\[(\d+)\]$', path_after_star)
            if not index_match:
                continue

            index = int(index_match.group(1))
            property_path = re.sub(r'\[\d+\]$', '', path_after_star)

            if property_path not in property_arrays:
                property_arrays[property_path] = {}
            property_arrays[property_path][index] = row[col_name]

        result = {}
        for property_path, index_map in property_arrays.items():
            if index_map:
                max_index = max(index_map.keys())
                array = [None] * (max_index + 1)
                for idx, value in index_map.items():
                    array[idx] = value

                if '.' in property_path:
                    parts = property_path.split('.')
                    self._set_nested_value(result, parts, array)
                else:
                    result[property_path] = array
        return result

    def _build_named_object(self, row: pd.Series) -> Dict[str, Any]:
        """Build named object from row with nested structure support."""
        if not self.input_feature_map:
            return row.to_dict()

        obj = {}
        for col_name, path in self.input_feature_map.items():
            if col_name not in row.index:
                continue
            value = row[col_name]
            prop_path = path.replace('[*]', '').split('.')
            if len(prop_path) > 1:
                prop_path = prop_path[1:]
            self._set_nested_value(obj, prop_path, value)
        return obj

    def _build_nested_object(self, row: pd.Series) -> Dict[str, Any]:
        """Build nested object recursively from row."""
        if not self.input_feature_map:
            return row.to_dict()

        obj = {}
        for col_name, path in self.input_feature_map.items():
            if col_name not in row.index:
                continue
            value = row[col_name]
            parts = path.split('.')
            self._set_nested_value(obj, parts, value)
        return obj

    def _set_nested_value(self, obj: Dict, path: List[str], value: Any) -> None:
        """Set value at nested path in object (recursive)."""
        if not path:
            return
        if len(path) == 1:
            obj[path[0]] = value
        else:
            if path[0] not in obj:
                obj[path[0]] = {}
            self._set_nested_value(obj[path[0]], path[1:], value)

    def _row_to_dict(self, row: pd.Series) -> Dict[str, Any]:
        """Convert row to dictionary using feature map."""
        if not self.input_feature_map:
            return row.to_dict()

        result = {}
        for col_name, path in self.input_feature_map.items():
            if col_name in row.index:
                prop_name = path.split('.')[-1].replace('[*]', '').replace('[0]', '')
                result[prop_name] = row[col_name]
        return result
