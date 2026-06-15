#!/usr/bin/env python3
"""Vertex AI request payload building."""

import json
from typing import Any, Dict, List, Optional

import pandas as pd

from sagemaker_int.pattern_types import Pattern
from sagemaker_int.payload_builder import ConfigurationError, NumpyEncoder, PayloadBuilder


class VertexPayloadBuilder(PayloadBuilder):
    """Build Vertex request payloads from DataFrames."""

    def _to_json(self, df: pd.DataFrame) -> str:
        if not self.is_batch_mode and self.pattern.is_batch:
            return self._to_single_invocation_batch_json(df)
        return super()._to_json(df)

    def _to_single_invocation_batch_json(self, df: pd.DataFrame) -> str:
        if len(df) != 1:
            raise ValueError(
                "Model configuration mismatch. "
                "This model expects single records but received multiple rows."
            )

        instances = self._build_batch_instances(df)
        parent_key = self._get_batch_parent_key()

        if not parent_key:
            if self.schema.get('type') == 'array':
                return json.dumps(instances, cls=NumpyEncoder)
            raise ConfigurationError(
                f"Unable to determine parent key for {self.pattern.value} pattern."
            )

        return json.dumps({parent_key: instances}, cls=NumpyEncoder)

    def _build_batch_instances(self, df: pd.DataFrame) -> List[Any]:
        instances = []
        for _, row in df.iterrows():
            if self.pattern == Pattern.BATCH_POSITIONAL:
                instances.append(self._build_positional_array(row))
            elif self.pattern == Pattern.BATCH_NESTED_POSITIONAL:
                instances.append(self._build_nested_positional_object(row))
            elif self.pattern in [Pattern.BATCH_NAMED, Pattern.BATCH_NESTED_OBJECT]:
                instances.append(self._build_named_object(row))
            else:
                raise ConfigurationError(
                    f"Unsupported pattern type for Vertex single invocation: {self.pattern}."
                )
        return instances

    def _get_batch_parent_key(self) -> Optional[str]:
        if self.input_feature_map:
            first_path = list(self.input_feature_map.values())[0]
            if '[*]' in first_path:
                return first_path.split('[*]')[0]

        return self._get_first_array_schema_property()

    def _get_first_array_schema_property(self) -> Optional[str]:
        properties: Dict[str, Dict[str, Any]] = self.schema.get('properties', {})
        for key, prop in properties.items():
            if prop.get('type') == 'array':
                return key
        return None
