#!/usr/bin/env python
"""Pattern type definitions for SageMaker endpoint invocation."""

from enum import Enum
from typing import Dict
import re


class Pattern(Enum):
    """SageMaker endpoint request/response patterns."""

    BATCH_NAMED = 'batch_named'
    BATCH_POSITIONAL = 'batch_positional'
    BATCH_NESTED_OBJECT = 'batch_nested_obj'
    BATCH_NESTED_POSITIONAL = 'batch_nested_pos'
    SINGLE_POSITIONAL = 'single_positional'
    SINGLE_NESTED = 'single_nested'
    SIMPLE = 'simple'
    WILDCARD = 'wildcard'

    @property
    def is_batch(self) -> bool:
        return self in {
            Pattern.BATCH_NAMED,
            Pattern.BATCH_POSITIONAL,
            Pattern.BATCH_NESTED_OBJECT,
            Pattern.BATCH_NESTED_POSITIONAL,
        }

    @property
    def is_single_record(self) -> bool:
        return not self.is_batch

    @property
    def is_positional(self) -> bool:
        return self in {
            Pattern.BATCH_POSITIONAL,
            Pattern.BATCH_NESTED_POSITIONAL,
            Pattern.SINGLE_POSITIONAL,
        }

    @property
    def is_nested(self) -> bool:
        return self in {
            Pattern.BATCH_NESTED_OBJECT,
            Pattern.BATCH_NESTED_POSITIONAL,
            Pattern.SINGLE_NESTED,
        }


def detect_pattern(feature_map: Dict[str, str], is_output_map: bool = False) -> Pattern:
    """Detect pattern type from feature map."""
    if not feature_map:
        return Pattern.SIMPLE

    if '*' in feature_map:
        return Pattern.WILDCARD

    first_path = list(feature_map.keys())[0] if is_output_map else list(feature_map.values())[0]

    if '[*]' in first_path:
        if re.search(r'\[\*\].*?\[\d+\]', first_path):
            if '.' in first_path.split('[*]')[1]:
                return Pattern.BATCH_NESTED_POSITIONAL
            else:
                return (
                    Pattern.BATCH_NESTED_POSITIONAL
                    if is_output_map
                    else Pattern.BATCH_POSITIONAL
                )

        if first_path.count('.') > 1:
            return Pattern.BATCH_NESTED_OBJECT

        return Pattern.BATCH_NAMED

    if '.' in first_path and '[' not in first_path:
        return Pattern.SINGLE_NESTED

    if re.match(r'^([^.]+)?\[\d+\]$', first_path):
        return Pattern.SINGLE_POSITIONAL

    if re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', first_path):
        return Pattern.SIMPLE

    raise ValueError(
        f"Invalid or unrecognized pattern in path: '{first_path}'. "
        f"Valid patterns: batch ([*]), positional ([N]), nested (.), simple (identifier), wildcard (*)"
    )


def get_pattern_info(pattern: Pattern) -> Dict[str, any]:
    """Get information about a pattern."""
    return {
        'name': pattern.value,
        'is_batch': pattern.is_batch,
        'is_single_record': pattern.is_single_record,
        'is_positional': pattern.is_positional,
        'is_nested': pattern.is_nested,
        'description': _get_pattern_description(pattern),
    }


def _get_pattern_description(pattern: Pattern) -> str:
    """Get human-readable description of pattern."""
    descriptions = {
        Pattern.BATCH_NAMED: "Batch with named properties: instances[*].cpu",
        Pattern.BATCH_POSITIONAL: "Batch with 2D positional arrays: [*][0] or instances[*][0]",
        Pattern.BATCH_NESTED_OBJECT: "Batch with nested objects: instances[*].features.cpu",
        Pattern.BATCH_NESTED_POSITIONAL: "Batch with objects containing arrays: instances[*].metrics[0]",
        Pattern.SINGLE_POSITIONAL: "Single-record positional: instances[0]",
        Pattern.SINGLE_NESTED: "Single-record nested: data.transaction.amount",
        Pattern.SIMPLE: "Simple property: cpu",
        Pattern.WILDCARD: "Wildcard: all columns as array",
    }
    return descriptions.get(pattern, "Unknown pattern")
