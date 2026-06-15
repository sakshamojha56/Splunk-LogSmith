#!/usr/bin/env python3
"""
Core Schema Validator for SageMaker Endpoints - Orchestration & Validation.

Provides comprehensive schema validation, pattern detection, and transformation
orchestration for AWS SageMaker endpoint invocations in MLTK.

Key Features:
- OpenAPI 3.0 specification validation
- Pre-invocation payload structure validation
- Recursive nested object validation (up to 3 levels deep)
- Type compatibility checking (integer vs number JSON types)
- Batch vs single-record mode detection
- Pattern detection (9 patterns across JSON/CSV/JSONLINES)
- Conflict detection (batch_size vs input_feature_map pattern)
- In-memory configuration (no temp files via from_dict())

Modular Architecture:
- Core orchestration: SchemaValidator (this file)
- Payload construction: PayloadBuilder (lazy-loaded)
- Response parsing: ResponseParser (lazy-loaded)
- Pattern detection: pattern_types module
- Lazy initialization prevents circular dependencies

Validation Flow:
1. Configuration validation (OpenAPI spec, feature maps)
2. Mode detection (batch_size → pattern → schema → content-type)
3. Pattern consistency checking (warns on conflicts)
4. DataFrame validation (row count, columns, types)
5. Pre-invocation payload validation against OpenAPI schema
6. Recursive property validation for nested objects
"""

import json
from pathlib import Path
from typing import Dict, Any, List, Union, Optional
import pandas as pd

# Import MLTK logger
import cexc

from sagemaker_int.pattern_types import Pattern, detect_pattern
from sagemaker_int.payload_builder import PayloadBuilder
from sagemaker_int.response_parser import ResponseParser

# Use MLTK logger instead of standard Python logger
logger = cexc.get_logger(__name__)


# Exception classes
class ValidationError(Exception):
    """Base validation error."""

    pass


class ConfigurationError(ValidationError):
    """Configuration is invalid."""

    pass


class SchemaPathError(ValidationError):
    """Feature map path is invalid."""

    pass


class EndpointError(ValidationError):
    """Endpoint invocation error."""

    pass


# User-friendly type descriptions for error messages (avoid duplication)
USER_FRIENDLY_TYPES = {
    'array': 'a list of values',
    'object': 'an object with fields',
    'string': 'text',
    'integer': 'a whole number',
    'number': 'a number',
    'boolean': 'true/false',
}


class SchemaValidator:
    """
    Schema validator and transformation orchestrator for SageMaker endpoints.

    Comprehensive validation and transformation engine that:
    - Validates OpenAPI 3.0 specifications
    - Maps DataFrame columns to OpenAPI schema paths (input_feature_map)
    - Maps response properties to DataFrame columns (output_prediction_map)
    - Detects batch vs single-record mode (with configurable batch_size)
    - Validates payloads against OpenAPI schema before invocation
    - Supports recursive validation of nested objects (3 levels deep)
    - Handles type compatibility (integer/number JSON types)
    - Warns on batch_size vs pattern conflicts

    Supported Patterns (9 total):
    - JSON: Batch Named, Batch Array, Single-Record Nested, Wildcard
    - CSV: Order-based mapping with automatic header handling
    - JSONLINES: Streaming JSON with newline delimiters

    Lazy Architecture:
    - PayloadBuilder: Loaded on first dataframe_to_payload() call
    - ResponseParser: Loaded on first parse_response() call
    - Prevents circular import issues in Splunk environment

    Attributes:
        openapi_spec (dict): OpenAPI 3.0 specification
        input_feature_map (dict): Column → schema path mapping
        output_prediction_map (dict): Response path → column mapping
        batch_size (int, optional): Explicit batch size for mode override
        is_batch_mode (bool): Detected invocation mode
        content_types (list): Supported request content types
    """

    def __init__(self, config_path: Union[str, Path], validate_endpoint: bool = False):
        """
        Initialize from config file.

        Args:
            config_path: Path to JSON config file
            validate_endpoint: Whether to validate endpoint availability
        """
        self.config_path = Path(config_path)
        self.config = self._load_config(self.config_path)
        self._initialize_from_config(validate_endpoint)

    @classmethod
    def from_dict(
        cls, config: Dict[str, Any], validate_endpoint: bool = False
    ) -> 'SchemaValidator':
        """
        Create validator from configuration dictionary.

        Configuration includes:
        - openapi_spec: OpenAPI 3.0 specification dict
        - input_feature_map: Column to schema path mapping
        - output_prediction_map: Response property to column mapping
        - batch_size (optional): Explicit batch size for mode detection

        Args:
            config (dict): Configuration dictionary with OpenAPI spec and feature maps
            validate_endpoint (bool): Whether to validate endpoint availability (default: False)

        Returns:
            SchemaValidator: Initialized validator instance ready for use
        """
        instance = cls.__new__(cls)
        instance.config_path = None
        instance.config = config
        instance._initialize_from_config(validate_endpoint)
        return instance

    def _initialize_from_config(self, validate_endpoint: bool = False):
        """Initialize validator from config dict."""
        # Validate config structure
        self._validate_config_structure(self.config)

        # Extract configuration
        self.openapi_spec = self.config['openapi_spec']
        self.input_feature_map = self.config.get('input_feature_map', {})
        self.output_prediction_map = self.config.get('output_prediction_map', {})
        self.endpoint_name = self.config.get('endpoint_name')
        self.aws_credentials = self.config.get('aws_credentials', {})
        self.batch_size = self.config.get('batch_size')  # Extract batch_size for mode detection

        # Validate OpenAPI spec
        self._validate_openapi_spec()

        # Extract schemas
        self.invocations_spec = self.openapi_spec['paths']['/invocations']['post']
        self.request_schemas = self._extract_request_schemas()
        self.response_schemas = self._extract_response_schemas()

        # Validate feature maps
        self._validate_feature_maps()

        # Detect mode
        self.is_batch_mode = self._detect_batch_mode()

        # Validate mode consistency with feature map pattern
        self._validate_mode_pattern_consistency()

        # Initialize builders (lazy - will be created on first use)
        self._payload_builder = None
        self._response_parser = None

    def _get_payload_builder(self):
        """Lazy initialization of payload builder."""
        if self._payload_builder is None:
            json_request_schema = self.request_schemas.get('application/json', {})
            self._payload_builder = PayloadBuilder(
                self.input_feature_map, json_request_schema, self.is_batch_mode
            )
        return self._payload_builder

    def _get_response_parser(self):
        """Lazy initialization of response parser."""
        if self._response_parser is None:
            json_response_schema = self.response_schemas.get('application/json', {})
            self._response_parser = ResponseParser(
                self.output_prediction_map, json_response_schema, self.is_batch_mode
            )
        return self._response_parser

    def _load_config(self, config_path: Path) -> Dict[str, Any]:
        """Load configuration from file."""
        if not config_path.exists():
            raise FileNotFoundError(f"Config file not found: {config_path}")

        try:
            with open(config_path, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            raise ConfigurationError(f"Invalid JSON: {e}")

    def _validate_config_structure(self, config: Dict[str, Any]):
        """Validate configuration structure."""
        if not isinstance(config, dict):
            raise ConfigurationError("Config must be a JSON object")

        if 'openapi_spec' not in config:
            raise ConfigurationError("Missing required field: 'openapi_spec'")

        if not isinstance(config['openapi_spec'], dict):
            raise ConfigurationError("'openapi_spec' must be an object")

        # Validate optional fields
        if 'input_feature_map' in config and not isinstance(config['input_feature_map'], dict):
            raise ConfigurationError("'input_feature_map' must be an object")

        if 'output_prediction_map' in config and not isinstance(
            config['output_prediction_map'], dict
        ):
            raise ConfigurationError("'output_prediction_map' must be an object")

    def _validate_openapi_spec(self):
        """Validate OpenAPI specification."""
        spec = self.openapi_spec

        # Check required fields
        if 'openapi' not in spec:
            raise ValidationError(
                "Invalid OpenAPI specification: missing 'openapi' version field. "
                "Please register the model with a valid OpenAPI 3.0 specification using: | registersagemakermodel"
            )

        if not spec['openapi'].startswith('3.0'):
            raise ValidationError(
                f"Unsupported OpenAPI version '{spec.get('openapi')}'. "
                f"Only OpenAPI 3.0.x is supported. Please register the model using: | registersagemakermodel"
            )

        if 'paths' not in spec:
            raise ValidationError(
                "Invalid OpenAPI specification: missing 'paths' field. "
                "Please ensure your OpenAPI spec defines the '/invocations' endpoint."
            )

        if '/invocations' not in spec['paths']:
            raise ValidationError(
                "Invalid OpenAPI specification: missing '/invocations' endpoint definition. "
                "SageMaker endpoints must define a POST /invocations path. "
                "Please register the model with correct 'openapi_spec' using: | registersagemakermodel"
            )

        if 'post' not in spec['paths']['/invocations']:
            raise ValidationError(
                "Invalid OpenAPI specification: '/invocations' must support POST method. "
                "Please register the model with correct OpenAPI spec using: | registersagemakermodel"
            )

        post = spec['paths']['/invocations']['post']

        if 'requestBody' not in post:
            raise ValidationError(
                "Invalid OpenAPI specification: missing 'requestBody' in POST /invocations. "
                "Please register the model with correct OpenAPI spec using: | registersagemakermodel"
            )

        if 'responses' not in post:
            raise ValidationError(
                "Invalid OpenAPI specification: missing 'responses' in POST /invocations. "
                "Please register the model with correct OpenAPI spec using: | registersagemakermodel"
            )

    def _extract_request_schemas(self) -> Dict[str, Dict]:
        """Extract request schemas for all content types."""
        schemas = {}
        content = self.invocations_spec['requestBody'].get('content', {})

        for content_type, spec in content.items():
            if 'schema' in spec:
                schemas[content_type] = spec['schema']

        return schemas

    def _extract_response_schemas(self) -> Dict[str, Dict]:
        """Extract response schemas for all success status codes."""
        schemas = {}
        responses = self.invocations_spec.get('responses', {})

        for status_code, response_spec in responses.items():
            if status_code.startswith('2'):  # 2xx success codes
                content = response_spec.get('content', {})
                for content_type, spec in content.items():
                    if 'schema' in spec:
                        schemas[content_type] = spec['schema']

        return schemas

    def _validate_feature_maps(self):
        """Validate feature maps against schemas (basic validation)."""
        # Skip for CSV (order-based)
        if list(self.request_schemas.keys()) == ['text/csv']:
            return

        # Skip for wildcard pattern
        if '*' in self.input_feature_map:
            return

        # Basic validation: ensure paths are well-formed
        for col, path in self.input_feature_map.items():
            if not path or not isinstance(path, str):
                raise SchemaPathError(f"Invalid path for column '{col}': {path}")

        for path, col in self.output_prediction_map.items():
            if not path or not isinstance(path, str):
                raise SchemaPathError(f"Invalid path '{path}' for column '{col}'")

    def _detect_batch_mode(self) -> bool:
        """
        Determine batch mode from explicit batch_size configuration.

        Batch mode is explicitly controlled by the batch_size parameter:
        - batch_size = 1: Single-record mode (one API call per record)
        - batch_size >= 2: Batch mode (multiple records per API call)

        Returns:
            True for batch mode (batch_size >= 2)
            False for single-record mode (batch_size == 1)

        Raises:
            ConfigurationError: If batch_size is missing or invalid
        """
        # batch_size is required for all SageMaker models
        if self.batch_size is None:
            raise ConfigurationError(
                "'batch_size' is REQUIRED for all SageMaker models. "
                "Please ensure your model was registered with explicit 'batch_size' parameter."
            )

        # Determine mode from batch_size
        if self.batch_size >= 2:
            return True
        elif self.batch_size == 1:
            return False
        else:
            # Should never reach here (validated at registration)
            raise ConfigurationError(
                f"Invalid batch_size: {self.batch_size}. Must be between 1 and 10,000."
            )

    def _validate_mode_pattern_consistency(self):
        """Validate batch_size is consistent with input_feature_map pattern."""
        if not self.input_feature_map or self.batch_size is None:
            return

        pattern = detect_pattern(self.input_feature_map)
        first_path = list(self.input_feature_map.values())[0]

        # Conflict: batch_size >= 2 but single-record pattern
        if self.batch_size >= 2 and pattern.is_single_record:
            parts = first_path.split('.')
            suggested = (
                f"{parts[0]}[*].{'.'.join(parts[1:])}" if len(parts) > 1 else f"{first_path}[*]"
            )
            logger.warning(
                f"batch_size={self.batch_size} conflicts with single-record pattern '{first_path}'. "
                f"Solution: Use '{suggested}' or set batch_size=1. Endpoint may fail with incorrect payload!"
            )

        # Conflict: batch_size == 1 but batch pattern
        elif self.batch_size == 1 and pattern.is_batch:
            suggested = first_path.replace('[*]', '')
            logger.warning(
                f"batch_size=1 conflicts with batch pattern '{first_path}'. "
                f"Solution: Use '{suggested}' or increase batch_size. This causes inefficient processing."
            )

    def is_single_record_mode(self) -> bool:
        """Check if validator is in single-record mode."""
        return not self.is_batch_mode

    def get_supported_content_types(self) -> List[str]:
        """Get list of supported request content types."""
        return list(self.request_schemas.keys())

    def validate_dataframe(self, df: pd.DataFrame, content_type: str = 'application/json'):
        """
        Validate DataFrame against schema.

        Args:
            df: DataFrame to validate
            content_type: Target content type

        Raises:
            ValidationError: If validation fails
        """
        # Check for required features from input_feature_map
        if self.input_feature_map:
            required_cols = list(self.input_feature_map.keys())
            if '*' not in required_cols:  # Skip wildcard
                missing_cols = set(required_cols) - set(df.columns)
                if missing_cols:
                    logger.error(f"Missing required columns: {list(missing_cols)}")
                    logger.error(f"Available columns: {list(df.columns)}")
                    raise ValidationError(
                        f"Your search results are missing required fields: {', '.join(missing_cols)}. "
                        f"Please ensure your SPL query includes all necessary columns."
                    )

        if df.empty:
            logger.error("DataFrame is empty")
            raise ValidationError(
                "No data to process. Your search returned no results. "
                "Please check your SPL query filters."
            )

    def validate_payload_structure(
        self, df: pd.DataFrame, content_type: str = 'application/json'
    ):
        """
        Validate payload structure against OpenAPI schema before invocation.

        This performs early validation to catch schema mismatches before making
        expensive API calls to SageMaker.

        Args:
            df: Sample DataFrame (typically first row or first batch)
            content_type: Target content type

        Raises:
            ValidationError: If payload structure doesn't match schema
            ConfigurationError: If schema validation cannot be performed
        """
        # Basic validation
        self.validate_dataframe(df, content_type)

        # Get request schema for this content type
        if content_type not in self.request_schemas:
            raise ConfigurationError(
                f"Content type '{content_type}' not supported. "
                f"Available: {list(self.request_schemas.keys())}"
            )

        schema = self.request_schemas[content_type]

        # CSV validation is positional, skip detailed structure validation
        if content_type == 'text/csv':
            return

        # For JSON, validate the structure will match schema expectations
        import json

        try:
            # Step 1: Validate DataFrame column data types BEFORE building payload
            # This catches type mismatches (e.g., strings in numeric fields) before conversion
            self._validate_dataframe_types(df, schema)

            logger.info(
                f"Building sample payload for validation (mode={'batch' if self.is_batch_mode else 'single'})"
            )

            # Step 2: Build a sample payload from first row/batch
            sample_df = df.head(1) if not self.is_batch_mode else df.head(min(2, len(df)))
            logger.info(
                f"Sample DataFrame shape: {sample_df.shape}, columns: {list(sample_df.columns)}"
            )

            # Build payload using PayloadBuilder
            payload_builder = self._get_payload_builder()
            payload_str = payload_builder.build(sample_df, content_type)
            logger.info(f"Sample payload built: {len(payload_str)} bytes/chars")

            # Parse as JSON to validate structure
            if isinstance(payload_str, bytes):
                payload_str = payload_str.decode('utf-8')

            payload_obj = json.loads(payload_str)
            logger.info(f"Payload parsed as JSON, root keys: {list(payload_obj.keys())}")

            # Validate root structure matches schema expectations
            logger.info("Starting detailed payload validation against OpenAPI schema...")
            self._validate_payload_against_schema(payload_obj, schema)

            logger.info(
                f"[PASS] Payload validation passed: content_type={content_type}, "
                f"mode={'batch' if self.is_batch_mode else 'single-record'}"
            )

        except json.JSONDecodeError as e:
            # Log technical details
            logger.error(f"JSON encoding error: {str(e)}")
            raise ValidationError(
                "Unable to format the data for the model. "
                "This may be due to unsupported data types in your search results. "
                "Please ensure all values are valid numbers, text, or booleans."
            )
        except Exception as e:
            if isinstance(e, (ValidationError, ConfigurationError)):
                raise
            logger.warning(f"Payload structure validation skipped: {str(e)}")

    def _validate_dataframe_types(self, df: pd.DataFrame, schema: Dict[str, Any]):
        """
        Validate DataFrame column data types against OpenAPI schema types.

        This catches type mismatches (e.g., strings in numeric fields) BEFORE
        pandas converts them to NaN during payload building.

        Args:
            df: DataFrame with original data
            schema: OpenAPI request schema

        Raises:
            ValidationError: If data types don't match schema expectations
        """
        if not self.input_feature_map:
            return  # No validation possible without feature map

        # Build schema path to type mapping from input_feature_map
        errors = []

        for col_name, schema_path in self.input_feature_map.items():
            if col_name not in df.columns:
                continue  # Will be caught by validate_dataframe

            # Get expected type from schema
            expected_type = self._get_schema_type_for_path(schema, schema_path)

            if not expected_type:
                continue  # Can't validate if schema doesn't specify type

            # Check actual data type in DataFrame
            actual_dtype = str(df[col_name].dtype)

            # Get raw values (including NaN) to detect if strings were converted
            raw_values = df[col_name].head(10).tolist()  # Check up to 10 values
            sample_values_non_nan = [v for v in raw_values if pd.notna(v)][
                :5
            ]  # Get first 5 non-NaN

            # Validate numeric fields (integer or number)
            if expected_type in ('integer', 'number'):
                # Check for NaN values in numeric columns (could indicate string→NaN conversion)
                nan_count = df[col_name].isna().sum()
                total_count = len(df[col_name])

                # If column has dtype=float64/int64 but ALL values are NaN, suspect string conversion
                if (
                    actual_dtype in ('float64', 'int64')
                    and nan_count == total_count
                    and total_count > 0
                ):
                    errors.append(
                        f"Column '{col_name}' requires type '{expected_type}' per OpenAPI spec, but received non-numeric values"
                    )
                    continue

                # Check ALL non-NaN values in the column
                # because Splunk might create 'object' dtype columns with mixed types
                if sample_values_non_nan:
                    # Try to identify non-numeric values
                    non_numeric = []
                    for val in sample_values_non_nan:
                        # Skip if already numeric type
                        if isinstance(val, (int, float)) and not pd.isna(val):
                            continue
                        # Try to convert string to numeric
                        try:
                            float(val)
                        except (ValueError, TypeError):
                            non_numeric.append(repr(val))  # Use repr to show quotes

                    if non_numeric:
                        errors.append(
                            f"Column '{col_name}' requires type '{expected_type}' per OpenAPI spec, but received invalid values"
                        )

        if errors:
            # Log technical details
            logger.error(f"Data type validation failed:")
            for error in errors:
                logger.error(f"  - {error}")

            # Raise concise user-friendly error
            if len(errors) == 1:
                error_msg = f"OpenAPI validation failed: {errors[0]}"
            else:
                error_msg = (
                    f"OpenAPI validation failed for {len(errors)} column(s): "
                    + "; ".join(errors)
                )
            raise ValidationError(error_msg)

    def _get_schema_type_for_path(self, schema: Dict[str, Any], path: str) -> Optional[str]:
        """
        Extract expected type from schema for a given path.

        Args:
            schema: OpenAPI request schema
            path: Schema path (e.g., "data.metrics.cpu_spike_percent")

        Returns:
            Expected type string ('integer', 'number', 'string', etc.) or None
        """
        # Remove array notation and wildcards
        clean_path = (
            path.replace('[*]', '').replace('[0]', '').replace('[1]', '').replace('[2]', '')
        )
        parts = [p for p in clean_path.split('.') if p]

        # Navigate through schema
        current = schema
        for part in parts:
            if not isinstance(current, dict):
                return None

            # Navigate through properties
            if 'properties' in current:
                current = current['properties'].get(part)
                if not current:
                    return None
            elif 'items' in current:
                # Array schema
                current = current['items']
                if isinstance(current, dict) and 'properties' in current:
                    current = current['properties'].get(part)
                    if not current:
                        return None
            else:
                return None

        # Extract type
        if isinstance(current, dict):
            return current.get('type')

        return None

    def _types_compatible(self, expected: str, actual: str) -> bool:
        """
        Check if actual type is compatible with expected type.

        JSON/pandas often represent integers as floats (number type),
        so we treat integer and number as compatible.

        Args:
            expected: Expected JSON type from schema
            actual: Actual JSON type from payload

        Returns:
            True if types are compatible
        """
        if expected == actual:
            return True

        # integer and number are compatible (pandas converts int to float)
        if expected in ('integer', 'number') and actual in ('integer', 'number'):
            return True

        return False

    def _validate_payload_against_schema(self, payload: Dict[str, Any], schema: Dict[str, Any]):
        """
        Validate payload structure matches OpenAPI schema (with recursive validation).

        Performs comprehensive validation including:
        1. Root property presence check
        2. Required property validation
        3. Property type validation (with integer/number compatibility)
        4. Array items structure validation
        5. Nested object properties validation (recursive, 3 levels deep)

        Type Compatibility:
        - Treats 'integer' and 'number' as compatible JSON types
        - Accounts for pandas converting integers to floats

        Detailed logging at each validation step for debugging.

        Args:
            payload (dict): Generated payload object from dataframe_to_payload
            schema (dict): OpenAPI request schema from specification

        Raises:
            ValidationError: If payload structure doesn't match schema requirements
        """
        # Check root properties exist
        schema_props = schema.get('properties', {})
        payload_keys = set(payload.keys())

        # Get required properties (if specified)
        required_props = set(schema.get('required', []))

        # Check required properties are present
        missing_required = required_props - payload_keys
        if missing_required:
            logger.error(f"Missing required properties: {list(missing_required)}")
            logger.error(f"Expected: {list(required_props)}, Got: {list(payload_keys)}")
            raise ValidationError(
                f"Input data is missing required fields: {', '.join(missing_required)}. "
                f"Please ensure your DataFrame contains all required columns."
            )

        # Check for unexpected properties (warn only, don't fail)
        if schema_props:
            expected_props = set(schema_props.keys())
            unexpected_props = payload_keys - expected_props
            if unexpected_props:
                logger.warning(
                    f"  [WARN] Payload contains properties not in schema: {list(unexpected_props)}. "
                    f"Expected: {list(expected_props)}"
                )

        # Validate each property type matches schema expectations
        validated_props = []

        for prop_name, prop_value in payload.items():
            if prop_name not in schema_props:
                continue

            prop_schema = schema_props[prop_name]
            expected_type = prop_schema.get('type')

            # Type checking
            if expected_type:
                actual_type = type(prop_value).__name__
                type_map = {
                    'list': 'array',
                    'dict': 'object',
                    'str': 'string',
                    'int': 'integer',
                    'float': 'number',
                    'bool': 'boolean',
                }
                actual_type_json = type_map.get(actual_type, actual_type)

                if not self._types_compatible(expected_type, actual_type_json):
                    logger.error(
                        f"Property '{prop_name}' type mismatch: "
                        f"expected='{expected_type}', got='{actual_type_json}' (python_type={actual_type})"
                    )

                    # Use global constant for user-friendly type descriptions
                    expected_desc = USER_FRIENDLY_TYPES.get(expected_type, expected_type)
                    actual_desc = USER_FRIENDLY_TYPES.get(actual_type_json, actual_type_json)

                    raise ValidationError(
                        f"Data type mismatch for '{prop_name}'. "
                        f"The model expects {expected_desc}, but your data contains {actual_desc}. "
                        f"Please check your SPL query and ensure the column has the correct format."
                    )

                validated_props.append(prop_name)

                # For arrays, validate items structure
                if (
                    expected_type == 'array'
                    and isinstance(prop_value, list)
                    and len(prop_value) > 0
                ):
                    items_schema = prop_schema.get('items', {})
                    items_type = items_schema.get('type')

                    if items_type:
                        first_item = prop_value[0]
                        first_item_type = type(first_item).__name__
                        first_item_type_json = type_map.get(first_item_type, first_item_type)

                        if not self._types_compatible(items_type, first_item_type_json):
                            logger.error(
                                f"Array items type mismatch in '{prop_name}': "
                                f"expected='{items_type}', got='{first_item_type_json}' (python_type={first_item_type})"
                            )

                            # Use global constant for user-friendly type descriptions
                            expected_desc = USER_FRIENDLY_TYPES.get(items_type, items_type)
                            actual_desc = USER_FRIENDLY_TYPES.get(
                                first_item_type_json, first_item_type_json
                            )

                            raise ValidationError(
                                f"Data structure mismatch for '{prop_name}'. "
                                f"The model expects each item to be {expected_desc}, but your data contains {actual_desc}. "
                                f"Please verify your 'input_feature_map' was configured correctly when registering the model using: | registersagemakermodel"
                            )

                        # Validate nested object properties if items are objects
                        if items_type == 'object' and isinstance(first_item, dict):
                            items_props = items_schema.get('properties', {})

                            # Validate nested property types
                            for nested_prop, nested_value in first_item.items():
                                if nested_prop in items_props:
                                    nested_expected_type = items_props[nested_prop].get('type')
                                    nested_actual_type = type(nested_value).__name__
                                    nested_actual_type_json = type_map.get(
                                        nested_actual_type, nested_actual_type
                                    )

                                    if nested_expected_type and not self._types_compatible(
                                        nested_expected_type, nested_actual_type_json
                                    ):
                                        logger.warning(
                                            f"Nested property '{nested_prop}' type mismatch: "
                                            f"expected={nested_expected_type}, got={nested_actual_type_json}"
                                        )

                # For objects, validate nested structure (single-record nested patterns)
                elif expected_type == 'object' and isinstance(prop_value, dict):
                    obj_props = prop_schema.get('properties', {})
                    obj_required = set(prop_schema.get('required', []))

                    if obj_props:
                        # Check required nested properties
                        if obj_required:
                            missing_nested = obj_required - set(prop_value.keys())
                            if missing_nested:
                                logger.error(
                                    f"Missing required nested properties in '{prop_name}': {list(missing_nested)}"
                                )
                                raise ValidationError(
                                    f"Property '{prop_name}' missing required nested properties: {list(missing_nested)}. "
                                    f"Expected: {list(obj_required)}"
                                )

                        # Validate nested property types
                        for nested_prop, nested_value in prop_value.items():
                            if nested_prop in obj_props:
                                nested_expected_type = obj_props[nested_prop].get('type')
                                nested_actual_type = type(nested_value).__name__
                                nested_actual_type_json = type_map.get(
                                    nested_actual_type, nested_actual_type
                                )

                                if nested_expected_type and not self._types_compatible(
                                    nested_expected_type, nested_actual_type_json
                                ):
                                    logger.error(
                                        f"Nested field '{nested_prop}' type mismatch: "
                                        f"expected={nested_expected_type}, got={nested_actual_type_json}"
                                    )

                                    # Use global constant for user-friendly type descriptions
                                    expected_desc = USER_FRIENDLY_TYPES.get(
                                        nested_expected_type, nested_expected_type
                                    )
                                    actual_desc = USER_FRIENDLY_TYPES.get(
                                        nested_actual_type_json, nested_actual_type_json
                                    )

                                    raise ValidationError(
                                        f"Data type mismatch for nested field '{prop_name}.{nested_prop}'. "
                                        f"The model expects {expected_desc}, but your data contains {actual_desc}. "
                                        f"Please check your 'input_feature_map' configuration."
                                    )

                                # Recursively validate deeper nesting (e.g., instances.user.profile.details)
                                if nested_expected_type == 'object' and isinstance(
                                    nested_value, dict
                                ):
                                    nested_obj_props = obj_props[nested_prop].get(
                                        'properties', {}
                                    )
                                    nested_obj_required = set(
                                        obj_props[nested_prop].get('required', [])
                                    )

                                    if nested_obj_props:
                                        # Check deeper required properties
                                        if nested_obj_required:
                                            missing_deeper = nested_obj_required - set(
                                                nested_value.keys()
                                            )
                                            if missing_deeper:
                                                logger.error(
                                                    f"Missing required properties in '{prop_name}.{nested_prop}': {list(missing_deeper)}"
                                                )
                                                raise ValidationError(
                                                    f"Property '{prop_name}.{nested_prop}' missing required properties: {list(missing_deeper)}. "
                                                    f"Expected: {list(nested_obj_required)}"
                                                )

                                        # Validate deeper property types
                                        for deeper_prop, deeper_value in nested_value.items():
                                            if deeper_prop in nested_obj_props:
                                                deeper_expected_type = nested_obj_props[
                                                    deeper_prop
                                                ].get('type')
                                                deeper_actual_type = type(deeper_value).__name__
                                                deeper_actual_type_json = type_map.get(
                                                    deeper_actual_type, deeper_actual_type
                                                )

                                                if (
                                                    deeper_expected_type
                                                    and not self._types_compatible(
                                                        deeper_expected_type,
                                                        deeper_actual_type_json,
                                                    )
                                                ):
                                                    logger.error(
                                                        f"Deep nested field '{deeper_prop}' type mismatch: "
                                                        f"expected={deeper_expected_type}, got={deeper_actual_type_json}"
                                                    )

                                                    # Use global constant for user-friendly type descriptions
                                                    expected_desc = USER_FRIENDLY_TYPES.get(
                                                        deeper_expected_type,
                                                        deeper_expected_type,
                                                    )
                                                    actual_desc = USER_FRIENDLY_TYPES.get(
                                                        deeper_actual_type_json,
                                                        deeper_actual_type_json,
                                                    )

                                                    raise ValidationError(
                                                        f"Data type mismatch for deeply nested field '{prop_name}.{nested_prop}.{deeper_prop}'. "
                                                        f"The model expects {expected_desc}, but your data contains {actual_desc}. "
                                                        f"Please check your 'input_feature_map' configuration."
                                                    )

    def dataframe_to_payload(
        self, df: pd.DataFrame, content_type: str = 'application/json'
    ) -> Union[str, bytes]:
        """
        Convert DataFrame to request payload.

        Delegates to PayloadBuilder.

        Note: Validation is done separately during validate_payload_structure().
        This method focuses only on payload construction to avoid redundant validations
        during batch processing.

        Args:
            df: Input DataFrame
            content_type: Target content type

        Returns:
            Serialized payload
        """
        # Apply feature mapping (filter columns)
        if self.input_feature_map and '*' not in self.input_feature_map:
            missing = set(self.input_feature_map.keys()) - set(df.columns)
            if missing:
                logger.error(f"Missing required columns: {list(missing)}")
                logger.error(f"Available columns: {list(df.columns)}")
                raise ValidationError(
                    f"Your data is missing required columns: {', '.join(missing)}. "
                    f"Please ensure all required fields are present in your search results."
                )

            # Reorder columns per feature map
            df = df[list(self.input_feature_map.keys())].copy()

        # Build payload (lazy initialization)
        return self._get_payload_builder().build(df, content_type)

    def response_to_dataframe(
        self, response_body: Union[str, bytes], content_type: str = 'application/json'
    ) -> pd.DataFrame:
        """
        Parse response into DataFrame.

        Delegates to ResponseParser.

        Args:
            response_body: Raw response
            content_type: Response content type

        Returns:
            DataFrame with predictions
        """
        # Lazy initialization
        return self._get_response_parser().parse(response_body, content_type)

    def get_schema_summary(self) -> Dict[str, Any]:
        """Get summary of validator configuration."""
        return {
            'mode': 'batch' if self.is_batch_mode else 'single-record',
            'input_pattern': (
                self._get_payload_builder().pattern.value
                if self._payload_builder or self.input_feature_map
                else 'none'
            ),
            'output_pattern': (
                self._get_response_parser().pattern.value
                if self._response_parser or self.output_prediction_map
                else 'none'
            ),
            'request_content_types': list(self.request_schemas.keys()),
            'response_content_types': list(self.response_schemas.keys()),
            'input_features': len(self.input_feature_map),
            'output_columns': len(self.output_prediction_map),
            'openapi_version': self.openapi_spec.get('openapi'),
        }
