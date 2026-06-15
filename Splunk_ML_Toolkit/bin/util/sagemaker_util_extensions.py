"""
SageMaker model registration and management utilities for MLTK.

Provides validation, storage, and management for AWS SageMaker models,
including OpenAPI spec validation, feature map validation, credential
management, and lookup table operations.
"""

import configparser
import csv
import errno
import json
import os
import traceback
from typing import Dict, List, Tuple, Optional, Any

import boto3
from botocore.exceptions import ClientError, BotoCoreError, UnknownServiceError

import cexc
from util.base_util import get_staging_area_path
from util.param_util import is_valid_identifier
from util.constants import MODEL_EXTENSION
from util.lookups_util import (
    file_name_to_path,
    get_lookup_file_from_searchinfo,
    parse_model_reply,
    lookup_name_to_path_from_splunk,
)
from util import models_util
from util.ai_commander_util import handle_secrets
from util.base_util import make_splunkhome_path
from util.rest_url_util import get_user_capabilities, make_splunk_url
from util.rest_proxy import rest_proxy_from_searchinfo

# Import constants from sagemaker_int package
# sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), 'sagemaker_int'))
from sagemaker_int.constants import (
    # Model management
    SAGEMAKER_PROVIDER_PREFIX,
    REQUIRED_PAYLOAD_FIELDS,
    MODEL_ALGO_NAME,
    MODEL_RUNTIME,
    MODEL_TYPE,
    MODEL_TYPE_CLASSES,
    # AWS configuration
    AWS_REQUIRED_FIELDS,
    # Lookup table
    LOOKUP_HEADERS,
    LOOKUP_COLUMN_ALGO,
    LOOKUP_COLUMN_MODEL,
    LOOKUP_COLUMN_OPTIONS,
    # Content types
    CONTENT_TYPE_JSON,
    CONTENT_TYPE_CSV,
    # OpenAPI
    SAGEMAKER_INVOCATIONS_PATH,
    SUCCESS_STATUS_CODES,
    # Error messages
    ERROR_MISSING_FIELD,
    ERROR_EMPTY_FIELD,
    ERROR_INVALID_TYPE,
    ERROR_INVALID_MODEL_NAME,
    ERROR_DUPLICATE_MODEL,
    ERROR_COLUMN_CONFLICT,
    # Validation contexts
    CONTEXT_INPUT_FEATURE_MAP,
    CONTEXT_OUTPUT_PREDICTION_MAP,
    # Pattern documentation
    SUPPORTED_PATTERNS,
    # Authorization
    SAGEMAKER_REGISTER_MODEL_CAPABILITIES,
    SAGEMAKER_ADMIN_ROLES,
    SAGEMAKER_SECRETS_REALM,
)

REQUIRED_AWS_FIELDS_LOCAL = AWS_REQUIRED_FIELDS

logger = cexc.get_logger(__name__)


def test_sagemaker_connection(payload: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """Test SageMaker endpoint connectivity without full registration."""
    errors = []

    # Validate required fields for connection test
    if 'endpoint_name' not in payload or not payload['endpoint_name']:
        errors.append("'endpoint_name' is required for connection testing")

    if 'aws_credentials' not in payload or not payload['aws_credentials']:
        errors.append("'aws_credentials' is required for connection testing")
    else:
        # Validate AWS credential fields
        aws_creds = payload['aws_credentials']
        for field in AWS_REQUIRED_FIELDS:
            if field not in aws_creds or not aws_creds[field]:
                errors.append(f"AWS credentials missing required field: '{field}'")

    # Return early if basic validation fails
    if errors:
        return False, errors

    endpoint_name = payload['endpoint_name']
    aws_credentials = payload['aws_credentials']

    logger.info(f"Testing SageMaker connection to endpoint '{endpoint_name}'")
    endpoint_errors = _validate_endpoint_exists(endpoint_name, aws_credentials)

    if endpoint_errors:
        errors.extend(endpoint_errors)
        return False, errors

    logger.info(f"SageMaker connection test successful for endpoint '{endpoint_name}'")
    return True, []


def validate_sagemaker_registration_payload(
    payload: Dict[str, Any],
) -> Tuple[bool, List[str], List[str]]:
    """Validate SageMaker registration payload comprehensively."""
    errors: List[str] = []
    warnings: List[str] = []

    supports_csv = _supports_csv_content_type(payload.get('openapi_spec', {}))

    required_fields = REQUIRED_PAYLOAD_FIELDS.copy()
    if supports_csv:
        required_fields = [
            f
            for f in required_fields
            if f not in ['input_feature_map', 'output_prediction_map']
        ]

    errors.extend(_validate_required_fields(payload, required_fields))
    if errors:
        return False, errors, warnings

    errors.extend(_validate_feature_map_types(payload))
    errors.extend(_validate_aws_credentials(payload.get('aws_credentials', {})))
    errors.extend(_validate_model_name(payload.get('model_name', '')))
    errors.extend(_validate_batch_size(payload.get('batch_size'), payload))

    warnings.extend(_validate_mode_pattern_consistency(payload))

    errors.extend(_validate_openapi_spec(payload.get('openapi_spec', {})))

    errors.extend(
        _validate_endpoint_exists(
            payload.get('endpoint_name', ''), payload.get('aws_credentials', {})
        )
    )

    errors.extend(_validate_feature_maps(payload, supports_csv))

    return len(errors) == 0, errors, warnings


def _validate_required_fields(payload: Dict[str, Any], required_fields: List[str]) -> List[str]:
    """Validate required fields are present and non-empty."""
    errors = []
    for field in required_fields:
        if field not in payload:
            errors.append(f"Missing required field: '{field}'")
        elif not payload[field]:
            errors.append(f"Field '{field}' cannot be empty")
    return errors


def _supports_csv_content_type(openapi_spec: Dict[str, Any]) -> bool:
    """Check if OpenAPI spec supports text/csv."""
    try:
        paths = openapi_spec.get('paths', {})
        invocations = paths.get(SAGEMAKER_INVOCATIONS_PATH, {})
        post_method = invocations.get('post', {})
        request_body = post_method.get('requestBody', {})
        content = request_body.get('content', {})

        return CONTENT_TYPE_CSV in content

    except (TypeError, AttributeError):
        return False


def _validate_feature_map_types(payload: Dict[str, Any]) -> List[str]:
    """Validate that feature maps are dictionaries."""
    errors = []

    input_feature_map = payload.get('input_feature_map')
    output_prediction_map = payload.get('output_prediction_map')

    if 'input_feature_map' not in payload:
        errors.append("Missing required field: 'input_feature_map'")
    elif not isinstance(input_feature_map, dict):
        errors.append("'input_feature_map' must be a dictionary")

    if 'output_prediction_map' not in payload:
        errors.append("Missing required field: 'output_prediction_map'")
    elif not isinstance(output_prediction_map, dict):
        errors.append("'output_prediction_map' must be a dictionary")

    return errors


def _validate_field_type(
    field_name: str, field_value: Any, expected_type: type
) -> Optional[str]:
    """Validate a single field's type."""
    if not isinstance(field_value, expected_type):
        return f"'{field_name}' must be a {expected_type.__name__}, got {type(field_value).__name__}"
    return None


def _validate_aws_credentials(aws_creds: Dict[str, Any]) -> List[str]:
    """Validate AWS credentials structure and required fields."""
    errors = []
    for field in REQUIRED_AWS_FIELDS_LOCAL:
        if field not in aws_creds:
            errors.append(ERROR_MISSING_FIELD.format(f'AWS credential field: {field}'))
        elif not aws_creds[field]:
            errors.append(ERROR_EMPTY_FIELD.format(f'AWS credential field: {field}'))
    return errors


def _validate_endpoint_exists(endpoint_name: str, aws_credentials: Dict[str, Any]) -> List[str]:
    """Validate that SageMaker endpoint exists and is in 'InService' state."""
    errors = []

    try:
        session = boto3.Session(
            aws_access_key_id=aws_credentials.get('access_key_id'),
            aws_secret_access_key=aws_credentials.get('secret_access_key'),
        )

        role_arn = aws_credentials.get('role_arn')
        region = aws_credentials.get('region')

        if not role_arn:
            errors.append("AWS role ARN is required for SageMaker access")
            return errors

        try:
            sts = session.client("sts", region_name=region)
            response = sts.assume_role(
                RoleArn=role_arn, RoleSessionName="aitk_sagemaker_test_connection"
            )
            creds = response['Credentials']

            sm_client = boto3.client(
                'sagemaker',
                aws_access_key_id=creds['AccessKeyId'],
                aws_secret_access_key=creds['SecretAccessKey'],
                aws_session_token=creds['SessionToken'],
                region_name=region,
            )
        except UnknownServiceError:
            logger.warning(
                f"STS service not available (Windows limitation). "
                f"Falling back to direct credentials for endpoint validation."
            )
            sm_client = boto3.client(
                'sagemaker',
                aws_access_key_id=aws_credentials.get('access_key_id'),
                aws_secret_access_key=aws_credentials.get('secret_access_key'),
                region_name=region,
            )

        logger.info(f"Validating SageMaker endpoint '{endpoint_name}' in region {region}")
        response = sm_client.describe_endpoint(EndpointName=endpoint_name)

        status = response.get('EndpointStatus')
        logger.info(f"Endpoint '{endpoint_name}' status: {status}")

        if status != 'InService':
            errors.append(
                f"SageMaker endpoint '{endpoint_name}' exists but is not ready for invocations. "
                f"Current status: {status}. Please wait for endpoint to reach 'InService' state."
            )
        else:
            logger.info(f"Endpoint '{endpoint_name}' validated successfully - InService")

    except ClientError as e:
        error_code = e.response.get('Error', {}).get('Code', 'Unknown')
        error_message = e.response.get('Error', {}).get('Message', str(e))

        logger.error(
            f"AWS ClientError during endpoint validation: [{error_code}] {error_message}"
        )

        if error_code == 'ValidationException':
            errors.append(
                f"SageMaker endpoint '{endpoint_name}' does not exist. "
                f"Please verify the endpoint name and AWS region are correct."
            )
        elif error_code in ['UnrecognizedClientException', 'InvalidClientTokenId']:
            errors.append(
                "AWS credentials are invalid or expired. Please verify your AWS access keys."
            )
        elif error_code == 'AccessDenied':
            errors.append(
                "Access denied when assuming AWS role. "
                "Please verify the role ARN and ensure the access keys have permission to assume this role."
            )
        elif error_code == 'AccessDeniedException':
            errors.append(
                f"AWS credentials do not have permission to access endpoint '{endpoint_name}'. "
                f"Please contact your AWS administrator to grant sagemaker:DescribeEndpoint permission."
            )
        else:
            errors.append(
                f"Unable to validate endpoint '{endpoint_name}'. "
                f"Please check your AWS configuration or contact your administrator."
            )

        logger.error(
            f"Failed to validate endpoint '{endpoint_name}': {error_code} - {error_message}"
        )

    except BotoCoreError as e:
        logger.error(f"BotoCore error validating endpoint '{endpoint_name}': {str(e)}")
        errors.append(
            "Unable to connect to AWS. "
            "Please check your network connection and AWS region configuration."
        )

    except ImportError:
        logger.error("boto3 library not installed - cannot validate endpoint")
        errors.append(
            "AWS SDK is not available. "
            "Please contact your administrator to install required dependencies."
        )

    except Exception as e:
        logger.error(f"Unexpected error during endpoint validation: {str(e)}")
        cexc.log_traceback() if 'cexc' in dir() else None
        errors.append(
            f"Unable to validate endpoint '{endpoint_name}'. "
            "Please contact your administrator."
        )

    return errors


def _validate_model_name(model_name: str) -> List[str]:
    """Validate model name format and constraints (prevents directory traversal)."""
    errors = []
    if not model_name or not isinstance(model_name, str):
        errors.append(ERROR_INVALID_MODEL_NAME.format(model_name))
    elif not is_valid_identifier(model_name):
        errors.append(
            f"Invalid model name '{model_name}'. "
            f"Model name must contain only letters, numbers, and underscore."
        )
    return errors


def _validate_batch_size(batch_size: Any, payload: Dict[str, Any] = None) -> List[str]:
    """Validate batch_size parameter (valid range: 1-10,000)."""
    errors = []

    if batch_size is None:
        errors.append(
            "'batch_size' is required. Specify batch_size=1 for single-record mode "
            "(one API call per row), or batch_size>=2 for batch mode (multiple rows per call). "
            "Valid range: 1-10,000."
        )
        return errors

    if not isinstance(batch_size, int):
        errors.append(
            f"'batch_size' must be an integer between 1 and 10,000. Got type: {type(batch_size).__name__}"
        )
        return errors

    if batch_size < 1 or batch_size > 10000:
        errors.append(
            f"'batch_size' must be between 1 and 10,000 (inclusive). Got: {batch_size}"
        )

    return errors


def _validate_mode_pattern_consistency(payload: Dict[str, Any]) -> List[str]:
    """Validate consistency between batch_size and feature map patterns for efficiency."""
    warnings = []

    batch_size = payload.get('batch_size')
    input_feature_map = payload.get('input_feature_map', {})

    if batch_size != 1 or not input_feature_map:
        return warnings

    batch_patterns = []
    for column_name, schema_path in input_feature_map.items():
        if isinstance(schema_path, str) and '[*]' in schema_path:
            batch_patterns.append(f"'{column_name}': '{schema_path}'")

    if batch_patterns:
        example_pattern = list(input_feature_map.values())[0]
        suggested_pattern = example_pattern.replace('[*]', '')

        warnings.append(
            f"Inefficient config: batch_size=1 with '[*]' pattern causes single-item arrays. "
            f"Use '{suggested_pattern}' or increase batch_size."
        )

    return warnings


def _validate_feature_maps(payload: Dict[str, Any], supports_csv: bool = False) -> List[str]:
    """Validate input and output feature mapping structures and paths against OpenAPI spec."""
    errors = []

    input_feature_map = payload.get('input_feature_map', {})
    output_prediction_map = payload.get('output_prediction_map', {})
    openapi_spec = payload.get('openapi_spec', {})

    if not isinstance(openapi_spec, dict):
        return errors

    if supports_csv and not input_feature_map and not output_prediction_map:
        return errors

    if not supports_csv:
        if not input_feature_map:
            errors.append(
                "'input_feature_map' cannot be empty for non-CSV models. "
                "Please specify column-to-path mappings for your JSON/JSONLINES endpoint. "
                "Example: {\"cpu_usage\": \"instances[*].cpu\", \"memory\": \"instances[*].memory\"}"
            )
        if not output_prediction_map:
            errors.append(
                "'output_prediction_map' cannot be empty for non-CSV models. "
                "Please specify response-path-to-column mappings for your JSON/JSONLINES endpoint. "
                "Example: {\"predictions[*]\": \"result\", \"scores[*]\": \"confidence\"}"
            )

        if not input_feature_map or not output_prediction_map:
            return errors

    if input_feature_map:
        errors.extend(_validate_input_feature_map_paths(input_feature_map, openapi_spec))

    if output_prediction_map:
        errors.extend(
            _validate_output_prediction_map_paths(output_prediction_map, openapi_spec)
        )

    if input_feature_map and output_prediction_map:
        errors.extend(_validate_column_name_conflicts(input_feature_map, output_prediction_map))

    return errors


def _validate_input_feature_map_paths(
    input_feature_map: Dict[str, str], openapi_spec: Dict[str, Any]
) -> List[str]:
    """Validate that all input_feature_map paths exist in the OpenAPI request schema."""
    errors = []

    if '*' in input_feature_map:
        return errors

    try:
        paths = openapi_spec.get('paths', {})
        invocations = paths.get(SAGEMAKER_INVOCATIONS_PATH, {})
        post_method = invocations.get('post', {})
        request_body = post_method.get('requestBody', {})
        content = request_body.get('content', {})

        json_schema = content.get('application/json', {}).get('schema')
        if not json_schema:
            for content_type, content_spec in content.items():
                if 'schema' in content_spec:
                    json_schema = content_spec['schema']
                    break

        if not json_schema:
            errors.append(
                "No request schema found in OpenAPI spec for input feature map validation"
            )
            return errors

        for column_name, schema_path in input_feature_map.items():
            if not isinstance(schema_path, str):
                errors.append(
                    f"input_feature_map['{column_name}']: path must be a string, got {type(schema_path).__name__}"
                )
                continue

            path_errors = _validate_schema_path(
                schema_path, json_schema, f"input_feature_map['{column_name}']"
            )
            errors.extend(path_errors)

    except Exception as e:
        errors.append(f"Error validating input feature map paths: {str(e)}")

    return errors


def _validate_output_prediction_map_paths(
    output_prediction_map: Dict[str, str], openapi_spec: Dict[str, Any]
) -> List[str]:
    """Validate that all output_prediction_map paths exist in the OpenAPI response schema."""
    errors = []

    try:
        paths = openapi_spec.get('paths', {})
        invocations = paths.get(SAGEMAKER_INVOCATIONS_PATH, {})
        post_method = invocations.get('post', {})
        responses = post_method.get('responses', {})

        response_schema = None
        for status_code in SUCCESS_STATUS_CODES:
            if status_code in responses:
                response_spec = responses[status_code]
                content = response_spec.get('content', {})

                json_schema = content.get('application/json', {}).get('schema')
                if not json_schema:
                    for content_type, content_spec in content.items():
                        if 'schema' in content_spec:
                            json_schema = content_spec['schema']
                            break

                if json_schema:
                    response_schema = json_schema
                    break

        if not response_schema:
            errors.append(
                "No response schema found in OpenAPI spec for output prediction map validation"
            )
            return errors

        for response_property, column_name in output_prediction_map.items():
            if not isinstance(response_property, str):
                errors.append(
                    f"output_prediction_map key '{response_property}': must be a string"
                )
                continue
            if not isinstance(column_name, str):
                errors.append(
                    f"output_prediction_map['{response_property}']: column name must be a string, got {type(column_name).__name__}"
                )
                continue

            path_errors = _validate_schema_path(
                response_property,
                response_schema,
                f"output_prediction_map['{response_property}']",
            )
            errors.extend(path_errors)

    except Exception as e:
        errors.append(f"Error validating output prediction map paths: {str(e)}")

    return errors


def _validate_schema_path(schema_path: str, schema: Dict[str, Any], context: str) -> List[str]:
    """Validate basic path syntax (detailed validation happens at runtime in SchemaValidator)."""
    errors = []

    if not schema_path or not isinstance(schema_path, str):
        errors.append(f"{context}: path must be a non-empty string")
        return errors

    import re

    if not re.match(r'^[\w\.\[\]\*\-]+$', schema_path):
        errors.append(f"{context}: path '{schema_path}' contains invalid characters")
        return errors

    return errors


def _validate_column_name_conflicts(
    input_feature_map: Dict[str, str], output_prediction_map: Dict[str, str]
) -> List[str]:
    """Validate that input DataFrame column names don't conflict with output DataFrame column names."""
    errors = []

    try:
        input_columns = set(input_feature_map.keys())
        output_columns = set(output_prediction_map.values())
        conflicts = input_columns.intersection(output_columns)

        if conflicts:
            conflict_list = sorted(list(conflicts))
            errors.append(
                f"Column name conflicts detected: {conflict_list}. "
                f"Input DataFrame column names (input_feature_map keys) cannot match "
                f"output DataFrame column names (output_prediction_map values)"
            )

            for conflict in conflict_list:
                conflicting_outputs = [
                    k for k, v in output_prediction_map.items() if v == conflict
                ]
                errors.append(
                    f"  Conflict: input column '{conflict}' conflicts with output column '{conflict}' "
                    f"(mapped from response property: {conflicting_outputs})"
                )

    except Exception as e:
        errors.append(f"Error validating column name conflicts: {str(e)}")

    return errors


def _validate_openapi_spec(openapi_spec: Dict[str, Any]) -> List[str]:
    """Validate OpenAPI specification structure."""
    errors = []

    if not isinstance(openapi_spec, dict):
        errors.append("'openapi_spec' must be a dictionary")
        return errors

    if 'openapi' not in openapi_spec:
        errors.append("OpenAPI spec missing 'openapi' version field")

    if 'paths' not in openapi_spec:
        errors.append("OpenAPI spec missing 'paths' field")
    elif SAGEMAKER_INVOCATIONS_PATH not in openapi_spec.get('paths', {}):
        errors.append(f"OpenAPI spec missing '{SAGEMAKER_INVOCATIONS_PATH}' endpoint")
    else:
        invocations = openapi_spec['paths'][SAGEMAKER_INVOCATIONS_PATH]
        if not isinstance(invocations, dict) or 'post' not in invocations:
            errors.append("OpenAPI spec '/invocations' endpoint missing POST method")

    return errors


def sagemaker_model_name_to_lookup(name: str, tmp: bool = False) -> str:
    """Convert SageMaker model name to lookup table name format (__mlspl_{model_name}.mlmodel)."""
    if not isinstance(name, str):
        raise AssertionError(f"Model name must be string, got {type(name)}")

    suffix = '.tmp' if tmp else ''
    safe_name = name.replace('-', '_').replace('.', '_')

    if not safe_name.isidentifier():
        raise AssertionError(f"Invalid model name: {name}")

    return f'__mlspl_{safe_name}{MODEL_EXTENSION}{suffix}'


def get_sagemaker_model_options_from_disk(
    model_name: str, searchinfo: Dict[str, Any], namespace: Optional[str] = None
) -> Tuple[str, str, Dict[str, Any]]:
    """Load SageMaker model options from disk lookup file."""

    lookup_name = sagemaker_model_name_to_lookup(model_name)

    file_path = lookup_name_to_path_from_splunk(
        lookup_name=model_name,
        file_name=lookup_name,
        searchinfo=searchinfo,
        namespace=namespace,
        lookup_type='model',
    )

    algo_name, model_data, model_options = models_util.load_algo_options_from_disk(
        file_path=file_path
    )

    return algo_name, model_data, model_options


def check_sagemaker_model_exists(
    model_name: str, searchinfo: Dict[str, Any], namespace: Optional[str] = None
) -> bool:
    """Check if a SageMaker model with the given name already exists."""
    try:
        lookup_name = sagemaker_model_name_to_lookup(model_name)
        reply = get_lookup_file_from_searchinfo(
            file_name=lookup_name, searchinfo=searchinfo, namespace=namespace or 'user'
        )

        exists = reply.get('success', False)
        return exists

    except Exception:
        return False


def create_sagemaker_model_lookup_entry(
    model_name: str,
    model_config: Dict[str, Any],
    searchinfo: Optional[Dict[str, Any]] = None,
    namespace: Optional[str] = None,
    local: bool = False,
    tmp: bool = False,
    allow_overwrite: bool = False,
) -> Dict[str, Any]:
    """Create a lookup entry for SageMaker model configuration."""
    if not (tmp or local or allow_overwrite) and searchinfo:
        if check_sagemaker_model_exists(model_name, searchinfo, namespace):
            raise RuntimeError(
                f"SageMaker model '{model_name}' already exists. "
                "Please use a different model name."
            )

    model_staging_dir = _ensure_staging_directory(model_name)

    model_lookup_name = sagemaker_model_name_to_lookup(model_name, tmp=tmp)
    lookup_file_path = file_name_to_path(model_lookup_name, model_staging_dir)

    _write_lookup_csv(lookup_file_path, model_config, searchinfo)

    if not (tmp or local):
        reply = models_util.move_model_file_from_staging(
            model_lookup_name, searchinfo, namespace or 'user', lookup_file_path
        )
        if not reply.get('success'):
            parse_model_reply(reply)
        return reply

    return {'success': True, 'message': f'SageMaker model {model_name} registered successfully'}


def _ensure_staging_directory(model_name: str) -> str:
    """Ensure staging directory exists and return path."""
    try:
        staging_dir = get_staging_area_path()
        if not os.path.isdir(staging_dir):
            os.makedirs(staging_dir)
        return staging_dir
    except OSError as e:
        if e.errno == errno.EEXIST and os.path.isdir(staging_dir):
            return staging_dir
        raise Exception(
            f"Error creating staging directory for SageMaker model: {model_name}, {e}"
        )


def get_aitk_app_version() -> str:
    """Auto-detect AITK app version from Splunk app installation."""
    aitk_app_name = 'Splunk_ML_Toolkit'

    # Try app.manifest first
    try:
        manifest_path = make_splunkhome_path(["etc", "apps", aitk_app_name, "app.manifest"])

        if os.path.isfile(manifest_path):
            with open(manifest_path, "r", encoding="utf-8") as f:
                manifest_data = json.load(f)

            version = manifest_data.get("info", {}).get("id", {}).get("version")
            if version:
                logger.info(f"Retrieved AITK app version from manifest: {version}")
                return version

        logger.warning(f"app.manifest not found at {manifest_path}, falling back to app.conf")

    except Exception as e:
        logger.warning(
            f"Failed to read AITK app version from manifest: {str(e)}, falling back to app.conf"
        )

    # Fallback to app.conf
    try:
        app_conf_path = make_splunkhome_path(
            ["etc", "apps", aitk_app_name, "default", "app.conf"]
        )

        if os.path.isfile(app_conf_path):
            config = configparser.ConfigParser()
            config.read(app_conf_path, encoding="utf-8")

            if config.has_section("launcher") and config.has_option("launcher", "version"):
                version = config.get("launcher", "version")
                if version:
                    logger.info(f"Retrieved AITK app version from app.conf: {version}")
                    return version

        logger.warning(
            f"app.conf not found or version not available at {app_conf_path}, using default version"
        )

    except Exception as e:
        logger.warning(
            f"Failed to read AITK app version from app.conf: {str(e)}, using default version"
        )

    return "1.0"


def _generate_metadata(
    model_config: Dict[str, Any],
    searchinfo: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Generate metadata for model registration or update.

    If model_config contains '_existing_metadata', treats as update and preserves
    original creation info while adding modification timestamp.

    Args:
        model_config: Model configuration dictionary (may contain '_existing_metadata' for updates)
        searchinfo: Splunk search context

    Returns:
        Metadata dictionary with version, timestamps, and user information
    """
    from datetime import datetime

    username = 'unknown'
    if searchinfo:
        username = searchinfo.get('username', searchinfo.get('owner', 'unknown'))

    version = model_config.get('version')
    if not version:
        version = get_aitk_app_version()

    timestamp = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.%fZ')

    # Check if this is an update (existing metadata passed via model_config)
    existing_metadata = model_config.get('_existing_metadata')

    if existing_metadata:
        # Update: preserve original creation info, add modification info
        metadata = {
            'version': version,
            'created_at': existing_metadata['created_at'],
            'created_by': existing_metadata['created_by'],
            'modified_at': timestamp,
            'modified_by': username,
        }
        logger.info(
            f"Generated metadata for model update: version={version}, modified_by={username}"
        )
    else:
        # New registration
        metadata = {'version': version, 'created_at': timestamp, 'created_by': username}
        logger.info(
            f"Generated metadata for model registration: version={version}, created_by={username}"
        )

    return metadata


def _write_lookup_csv(
    file_path: str,
    model_config: Dict[str, Any],
    searchinfo: Optional[Dict[str, Any]] = None,
) -> None:
    """Write model configuration to CSV lookup file in MLTK-compatible format."""
    input_feature_map = model_config.get('input_feature_map', {})
    output_prediction_map = model_config.get('output_prediction_map', {})

    feature_variables = list(input_feature_map.keys()) if input_feature_map else ""
    target_variables = list(output_prediction_map.values()) if output_prediction_map else ""

    metadata = _generate_metadata(model_config, searchinfo)

    options = {
        'model_name': model_config.get('model_name'),
        'endpoint_name': model_config.get('endpoint_name'),
        'description': model_config.get('description'),
        'algo_name': MODEL_ALGO_NAME,
        'runtime': MODEL_RUNTIME,
        'feature_variables': feature_variables,
        'target_variable': target_variables,
        'input_feature_map': input_feature_map,
        'output_prediction_map': output_prediction_map,
        'openapi_spec': model_config.get('openapi_spec', {}),
        'batch_size': model_config.get('batch_size'),
        'metadata': metadata,
    }

    model_data = {
        'model_name': model_config.get('model_name'),
        'endpoint_name': model_config.get('endpoint_name'),
        'type': MODEL_TYPE,
        '__mlspl_type': MODEL_TYPE_CLASSES,
    }

    headers = LOOKUP_HEADERS

    row_data = [
        MODEL_ALGO_NAME,
        json.dumps(model_data),
        json.dumps(options),
    ]

    with open(file_path, mode='w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerow(row_data)


def check_user_has_sagemaker_capabilities(
    searchinfo: Dict[str, Any], required_capabilities: List[str]
) -> bool:
    """Check if the user has all required capabilities for SageMaker operations."""
    try:
        splunkd_uri = searchinfo.get('splunkd_uri')
        token = searchinfo.get('session_key')
        username = searchinfo.get('username')

        if not all([splunkd_uri, token, username]):
            logger.warning(
                "Incomplete searchinfo for capability check: "
                f"user={username}, has_uri={bool(splunkd_uri)}, has_token={bool(token)}"
            )
            return False

        user_capabilities = get_user_capabilities(splunkd_uri, token, username=username)

        has_all = all(cap in user_capabilities for cap in required_capabilities)

        if not has_all:
            missing = [cap for cap in required_capabilities if cap not in user_capabilities]
            logger.info(
                f"User '{username}' missing SageMaker capabilities: {missing}. "
                f"Required: {required_capabilities}"
            )

        return has_all

    except Exception as e:
        logger.error(f"Error checking user capabilities: {str(e)}")
        cexc.log_traceback()
        return False


def create_unauthorized_response(
    operation: str, required_capabilities: List[str]
) -> Dict[str, Any]:
    """Create a standardized 403 Forbidden response for authorization failures."""
    return {
        'status': 403,
        'payload': {
            'error': 'Insufficient permissions',
            'message': f'You do not have permission to {operation}.',
            'action': 'Please contact your Splunk administrator for access.',
        },
    }


ALLOWED_UPDATE_FIELDS = {
    'model_name',
    'input_feature_map',
    'output_prediction_map',
    'openapi_spec',
    'batch_size',
}


def validate_update_keys(payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Validate that only allowed keys are present in update payload."""
    unknown_keys = set(payload.keys()) - ALLOWED_UPDATE_FIELDS
    if unknown_keys:
        return create_error_response(
            400,
            'Invalid fields in request',
            f"Unknown fields: {', '.join(sorted(unknown_keys))}. "
            f"Allowed: {', '.join(sorted(ALLOWED_UPDATE_FIELDS))}",
        )
    return None


def extract_update_fields(
    payload: Dict[str, Any],
) -> Tuple[Optional[Tuple], Optional[Dict[str, Any]]]:
    """Extract and validate update fields from payload."""
    model_name = payload.get('model_name')
    if not model_name:
        return None, create_error_response(
            400, 'Missing required field', "'model_name' is required"
        )

    input_map = payload.get('input_feature_map')
    output_map = payload.get('output_prediction_map')
    spec = payload.get('openapi_spec')
    batch = payload.get('batch_size')

    # At least one field must be provided
    if all(x is None for x in [input_map, output_map, spec, batch]):
        return None, create_error_response(
            400,
            'No fields to update',
            'At least one of input_feature_map, output_prediction_map, openapi_spec, or batch_size required',
        )

    return (model_name, input_map, output_map, spec, batch), None


def load_and_merge_config(
    model_name: str,
    searchinfo: Dict[str, Any],
    input_map: Optional[Dict],
    output_map: Optional[Dict],
    spec: Optional[Dict],
    batch: Optional[int],
) -> Tuple[Optional[Dict], Optional[Dict], Optional[Dict[str, Any]]]:
    """
    Load existing config and merge with provided updates.

    Returns:
        Tuple of (model_options, final_config, error_response)
        - model_options: Complete existing model configuration
        - final_config: Merged configuration (new + existing)
        - error_response: Error dict if failed, None if successful
    """
    try:
        _, _, model_options = get_sagemaker_model_options_from_disk(
            model_name, searchinfo, namespace='user'
        )
    except Exception as e:
        return (
            None,
            None,
            create_error_response(500, 'Failed to load model configuration', str(e)),
        )

    # Merge: use new values if provided, otherwise keep existing
    final_config = {
        'input_feature_map': (
            input_map if input_map is not None else model_options.get('input_feature_map', {})
        ),
        'output_prediction_map': (
            output_map
            if output_map is not None
            else model_options.get('output_prediction_map', {})
        ),
        'openapi_spec': spec if spec is not None else model_options.get('openapi_spec', {}),
        'batch_size': batch if batch is not None else model_options.get('batch_size'),
    }

    return model_options, final_config, None


def create_error_response(status: int, error: str, message: str, **kwargs) -> Dict[str, Any]:
    """Create standardized error response for REST API."""
    payload = {'error': error, 'message': message, **kwargs}
    return {'status': status, 'payload': payload}


def create_success_response(
    model_name: str,
    payload_data: Dict[str, Any],
    message: str = None,
    warnings: List[str] = None,
) -> Dict[str, Any]:
    """Create standardized success response for model registration/update."""
    if message is None:
        message = f"SageMaker model '{model_name}' registered successfully"

    response = {
        'status': 200,
        'payload': {
            'success': True,
            'message': message,
            'model_name': model_name,
            'endpoint_name': payload_data['endpoint_name'],
            'credentials_stored': True,
            'lookup_created': True,
        },
    }

    # Include warnings if present
    if warnings:
        response['payload']['warnings'] = warnings

    return response


def extract_payload_from_request(
    request: Dict[str, Any],
) -> Tuple[Dict[str, Any], Optional[Dict[str, Any]]]:
    """
    Extract and parse payload from request.

    Returns:
        Tuple of (payload_dict, error_response or None)
    """
    if 'payload' in request and isinstance(request['payload'], str):
        try:
            return json.loads(request['payload']), None
        except json.JSONDecodeError as e:
            return {}, create_error_response(
                400, 'Invalid JSON payload', f'Failed to parse JSON: {str(e)}'
            )
    elif 'payload' in request and isinstance(request['payload'], dict):
        return request['payload'], None
    else:
        return {}, create_error_response(
            400,
            'Missing or invalid payload in request',
            'Request must contain a valid JSON payload with SageMaker model configuration',
        )


def validate_payload(payload: Dict[str, Any]) -> Tuple[Optional[Dict[str, Any]], List[str]]:
    """
    Validate payload structure using comprehensive SageMaker validation.

    Returns:
        Tuple of (error_response_dict or None, warnings_list)
    """
    is_valid, validation_errors, warnings = validate_sagemaker_registration_payload(payload)
    if not is_valid:
        # Create user-friendly message from first error
        primary_message = validation_errors[0] if validation_errors else 'Validation failed'

        # If multiple errors, indicate there are more
        if len(validation_errors) > 1:
            primary_message = f"{primary_message} (and {len(validation_errors) - 1} more error{'s' if len(validation_errors) > 2 else ''})"

        error_response = create_error_response(
            400,
            'Payload validation failed',
            primary_message,
            validation_errors=validation_errors,
        )
        return error_response, warnings
    return None, warnings


def validate_update_fields(
    input_feature_map: Optional[Dict[str, Any]],
    output_prediction_map: Optional[Dict[str, Any]],
    openapi_spec: Optional[Dict[str, Any]],
    batch_size: Optional[int],
    existing_model_options: Dict[str, Any],
) -> Tuple[Optional[Dict[str, Any]], List[str]]:
    """Validate fields for partial update (validates final merged configuration)."""
    errors: List[str] = []
    warnings: List[str] = []

    final_input_map = (
        input_feature_map
        if input_feature_map is not None
        else existing_model_options.get('input_feature_map', {})
    )
    final_output_map = (
        output_prediction_map
        if output_prediction_map is not None
        else existing_model_options.get('output_prediction_map', {})
    )
    final_spec = (
        openapi_spec
        if openapi_spec is not None
        else existing_model_options.get('openapi_spec', {})
    )
    final_batch_size = (
        batch_size if batch_size is not None else existing_model_options.get('batch_size')
    )

    validation_spec = final_spec

    if openapi_spec is not None:
        errors.extend(_validate_openapi_spec(openapi_spec))

    if batch_size is not None:
        errors.extend(_validate_batch_size(batch_size, None))

    if input_feature_map is not None:
        error = _validate_field_type('input_feature_map', input_feature_map, dict)
        if error:
            errors.append(error)

    if output_prediction_map is not None:
        error = _validate_field_type('output_prediction_map', output_prediction_map, dict)
        if error:
            errors.append(error)

    if final_input_map or final_output_map:
        if not validation_spec:
            errors.append(
                "Cannot validate feature maps without an OpenAPI specification. "
                "OpenAPI spec is missing from both update and existing configuration."
            )
        else:
            supports_csv = _supports_csv_content_type(validation_spec)

            validation_payload = {
                'input_feature_map': final_input_map,
                'output_prediction_map': final_output_map,
                'openapi_spec': validation_spec,
            }

            errors.extend(_validate_feature_maps(validation_payload, supports_csv))

            if final_batch_size is not None:
                validation_payload['batch_size'] = final_batch_size
                warnings.extend(_validate_mode_pattern_consistency(validation_payload))

    if errors:
        # Create user-friendly message from first error
        primary_message = errors[0] if errors else 'Validation failed'

        # If multiple errors, indicate there are more
        if len(errors) > 1:
            primary_message = f"{primary_message} (and {len(errors) - 1} more error{'s' if len(errors) > 2 else ''})"

        error_response = create_error_response(
            400,
            'Validation failed',
            primary_message,
            validation_errors=errors,
        )
        return error_response, warnings

    return None, warnings


def store_credentials(
    model_name: str, aws_credentials: Dict[str, Any], searchinfo: Dict[str, Any]
) -> Optional[Dict[str, Any]]:
    """Store AWS credentials and return error response if failed."""
    try:
        credentials_response = create_sagemaker_credentials_entry(
            model_name=model_name, aws_credentials=aws_credentials, searchinfo=searchinfo
        )

        if 'username' in credentials_response or credentials_response.get('status') in [
            200,
            201,
        ]:
            return None
        else:
            return create_error_response(
                500,
                'Failed to store AWS credentials',
                'Unable to securely store AWS credentials',
                details=credentials_response.get('message', 'Unknown error'),
            )

    except Exception as e:
        raise


def delete_credentials(model_name: str, searchinfo: Dict[str, Any]) -> None:
    """Delete AWS credentials for a model (used for rollback)."""
    provider_name = f"{SAGEMAKER_PROVIDER_PREFIX}{model_name}"
    try:
        response = handle_secrets(
            searchinfo=searchinfo,
            provider=provider_name,
            type="DELETE",
            realm=SAGEMAKER_SECRETS_REALM,
        )
        if response.get('status', 200) not in [200, 204]:
            logger.warning(
                f"Failed to delete credentials for '{model_name}': status {response.get('status')}"
            )
    except Exception as e:
        logger.error(f"Error deleting credentials for '{model_name}': {e}")
        raise


def create_lookup_entry(
    model_name: str, model_config: Dict[str, Any], searchinfo: Dict[str, Any]
) -> Optional[Dict[str, Any]]:
    """Create model lookup entry and return error response if failed."""
    lookup_response = create_sagemaker_model_lookup_entry(
        model_name=model_name,
        model_config=model_config,
        searchinfo=searchinfo,
        namespace='user',
        local=False,
        tmp=False,
    )

    if not lookup_response.get('success'):
        return create_error_response(
            500,
            'Failed to create model lookup entry',
            'Unable to register model configuration',
            details=lookup_response.get('message', 'Unknown error'),
        )
    return None


def create_sagemaker_credentials_entry(
    model_name: str, aws_credentials: Dict[str, Any], searchinfo: Dict[str, Any]
) -> Dict[str, Any]:
    """Store AWS credentials for SageMaker model using secure Splunk storage."""
    provider_name = f"{SAGEMAKER_PROVIDER_PREFIX}{model_name}"
    credentials_json = json.dumps(aws_credentials)

    try:
        response = handle_secrets(
            searchinfo=searchinfo,
            provider=provider_name,
            token=credentials_json,
            type="CREATE",
            realm=SAGEMAKER_SECRETS_REALM,
        )

        if response is None:
            raise RuntimeError("Credentials storage returned None")

        if 'username' in response or response.get('status') in [200, 201]:
            return response
        else:
            error_msg = response.get('message', 'Unknown error')
            if 'already exists' in str(error_msg).lower() or response.get('status') == 409:
                raise RuntimeError(
                    "Model Name or AWS credentials already exist. "
                    "Please use a different model name or delete the existing credentials first."
                )
            else:
                raise RuntimeError(f"Failed to store AWS credentials: {error_msg}")

    except Exception as e:
        if isinstance(e, RuntimeError):
            raise
        raise RuntimeError(f"Failed to store AWS credentials: {str(e)}")


def list_all_sagemaker_passwords(searchinfo: Dict[str, Any]) -> List[str]:
    """List all SageMaker passwords stored in Splunk."""

    try:
        rest_proxy = rest_proxy_from_searchinfo(searchinfo)
        url = (
            make_splunk_url(
                rest_proxy, namespace="app", extra_url_parts=["storage", "passwords"]
            )
            + "?output_mode=json&count=0"
        )

        result = rest_proxy.make_rest_call("GET", url)
        if int(result["status"]) != 200:
            logger.warning(f"Failed to list passwords: status {result['status']}")
            return []

        data = json.loads(result["content"])

        model_names = [
            entry["content"]["username"][len(SAGEMAKER_PROVIDER_PREFIX) :]
            for entry in data.get("entry", [])
            if entry.get("content", {}).get("realm") == SAGEMAKER_SECRETS_REALM
            and entry.get("content", {})
            .get("username", "")
            .startswith(SAGEMAKER_PROVIDER_PREFIX)
        ]

        return model_names

    except Exception as e:
        logger.error(f"Error listing SageMaker passwords: {e}")
        return []


def cleanup_orphaned_sagemaker_passwords(
    searchinfo: Dict[str, Any], existing_model_names: List[str]
) -> Dict[str, Any]:
    """Clean up orphaned SageMaker passwords (passwords without corresponding lookup files)."""
    results = {"deleted_count": 0, "deleted_models": [], "failed_models": []}

    try:
        all_passwords = list_all_sagemaker_passwords(searchinfo)
        orphaned = set(all_passwords) - set(existing_model_names)

        if not orphaned:
            return results

        for model_name in orphaned:
            try:
                response = handle_secrets(
                    searchinfo=searchinfo,
                    provider=f"{SAGEMAKER_PROVIDER_PREFIX}{model_name}",
                    type="DELETE",
                    realm=SAGEMAKER_SECRETS_REALM,
                )

                if response.get('status', 200) in [200, 204]:
                    results["deleted_count"] += 1
                    results["deleted_models"].append(model_name)
                else:
                    results["failed_models"].append(model_name)
                    logger.warning(
                        f"Failed to delete orphaned credential '{model_name}': status {response.get('status')}"
                    )

            except Exception as e:
                results["failed_models"].append(model_name)
                logger.error(f"Error deleting orphaned credential '{model_name}': {e}")

        # Single consolidated log message
        if results["deleted_count"] > 0 or results["failed_models"]:
            logger.info(
                f"Orphaned credentials cleanup: {results['deleted_count']} deleted, "
                f"{len(results['failed_models'])} failed ({len(all_passwords)} total, {len(orphaned)} orphaned)"
            )

    except Exception as e:
        logger.error(f"Orphaned credential cleanup failed: {e}")

    return results


def handle_test_connection(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Handle connection test requests (test SageMaker endpoint connectivity)."""
    try:
        success, errors = test_sagemaker_connection(payload)

        if success:
            endpoint_name = payload.get('endpoint_name', 'unknown')
            logger.info(f"Connection test successful for endpoint '{endpoint_name}'")

            return {
                'status': 200,
                'payload': {
                    'status': 'success',
                    'message': f"Successfully connected to the endpoint '{endpoint_name}'",
                    'endpoint_name': endpoint_name,
                    'endpoint_status': 'InService',
                    'test_type': 'connection_test',
                },
            }
        else:
            endpoint_name = payload.get('endpoint_name', 'unknown')
            logger.warning(f"Connection test failed for endpoint '{endpoint_name}': {errors}")

            return create_error_response(
                400,
                'Connection test failed',
                errors[0] if errors else 'Unknown connection error',
                all_errors=errors,
            )

    except Exception as e:
        logger.error(f"Unexpected error during connection test: {str(e)}")
        logger.error(traceback.format_exc())
        return create_error_response(
            500,
            'Connection test error',
            'An unexpected error occurred while testing the connection',
        )


def is_test_connection_request(request: Dict[str, Any], path_parts: list) -> bool:
    """Detect if this is a test_connection request (checks path_parts and query parameters)."""
    if any(
        part.lower() == 'test_connection=1' or part.lower() == 'test_connection=true'
        for part in path_parts
        if '=' in part
    ):
        return True

    if 'query' in request:
        for query_param in request['query']:
            if len(query_param) >= 2:
                param_name = (
                    query_param[0].lower()
                    if isinstance(query_param[0], str)
                    else str(query_param[0]).lower()
                )
                param_value = (
                    query_param[1].lower()
                    if isinstance(query_param[1], str)
                    else str(query_param[1]).lower()
                )
                if param_name == 'test_connection' and param_value in ['1', 'true']:
                    return True

    return False


def check_model_exists(model_name: str, searchinfo: Dict[str, Any]) -> Dict[str, Any]:
    """Check if both lookup file and credentials exist for the model."""
    lookup_exists = check_sagemaker_model_exists(model_name, searchinfo, namespace='user')

    if not lookup_exists:
        return {
            'exists': False,
            'reason': f"Lookup file for model '{model_name}' not found",
        }

    provider_name = f"{SAGEMAKER_PROVIDER_PREFIX}{model_name}"
    try:
        credentials_response = handle_secrets(
            searchinfo=searchinfo,
            provider=provider_name,
            type="SELECT",
            realm=SAGEMAKER_SECRETS_REALM,
        )

        if 'username' in credentials_response or credentials_response.get('status') == 200:
            return {'exists': True, 'reason': 'Model exists'}
        else:
            return {
                'exists': False,
                'reason': f"Credentials for model '{model_name}' not found",
            }

    except Exception as e:
        return {
            'exists': False,
            'reason': f"Failed to check credentials: {str(e)}",
        }


def update_lookup_entry(
    model_name: str,
    model_config: Dict[str, Any],
    searchinfo: Dict[str, Any],
) -> Optional[Dict[str, Any]]:
    """Update model lookup entry by recreating it with new configuration."""
    lookup_response = create_sagemaker_model_lookup_entry(
        model_name=model_name,
        model_config=model_config,
        searchinfo=searchinfo,
        namespace='user',
        local=False,
        tmp=False,
        allow_overwrite=True,
    )

    if not lookup_response.get('success'):
        return create_error_response(
            500,
            'Failed to update model lookup entry',
            'Unable to update model configuration',
            details=lookup_response.get('message', 'Unknown error'),
        )
    return None


def update_mapping_fields_only(
    model_name: str,
    input_feature_map: Dict[str, Any],
    output_prediction_map: Dict[str, Any],
    openapi_spec: Dict[str, Any],
    searchinfo: Dict[str, Any],
    batch_size: Optional[int] = None,
) -> Optional[Dict[str, Any]]:
    """Update mapping fields and batch_size for existing SageMaker model (preserves other config)."""
    try:
        algo_name, model_data, model_options = get_sagemaker_model_options_from_disk(
            model_name=model_name, searchinfo=searchinfo, namespace='user'
        )

        # Preserve existing metadata for update tracking
        existing_metadata = model_options.get('metadata', {})

        model_options['input_feature_map'] = input_feature_map
        model_options['output_prediction_map'] = output_prediction_map
        model_options['openapi_spec'] = openapi_spec

        if batch_size is not None:
            model_options['batch_size'] = batch_size

        feature_variables = list(input_feature_map.keys()) if input_feature_map else []
        target_variables = list(output_prediction_map.values()) if output_prediction_map else []
        model_options['feature_variables'] = feature_variables
        model_options['target_variable'] = target_variables

        model_config = {
            'model_name': model_options.get('model_name'),
            'endpoint_name': model_options.get('endpoint_name'),
            'description': model_options.get('description'),
            'input_feature_map': input_feature_map,
            'output_prediction_map': output_prediction_map,
            'openapi_spec': openapi_spec,
            'batch_size': model_options.get('batch_size'),
            '_existing_metadata': existing_metadata,  # Pass metadata via config dict
        }

        return update_lookup_entry(model_name, model_config, searchinfo)

    except Exception as e:
        logger.error(
            f"Failed to update configuration fields for model '{model_name}': {str(e)}"
        )
        return create_error_response(
            500,
            'Failed to update configuration fields',
            f"Unable to update model '{model_name}'",
            details=str(e),
        )


def update_credentials(
    model_name: str, aws_credentials: Dict[str, Any], searchinfo: Dict[str, Any]
) -> Optional[Dict[str, Any]]:
    """Update AWS credentials for the model using Splunk's UPDATE operation."""
    provider_name = f"{SAGEMAKER_PROVIDER_PREFIX}{model_name}"
    credentials_json = json.dumps(aws_credentials)

    try:
        response = handle_secrets(
            searchinfo=searchinfo,
            provider=provider_name,
            token=credentials_json,
            type="UPDATE",
            realm=SAGEMAKER_SECRETS_REALM,
        )

        if response.get('status') in [200, 201] or 'username' in response:
            logger.info(f"Successfully updated credentials for model '{model_name}'")
            return None
        else:
            error_msg = response.get('message', 'Unknown error during credential update')
            logger.error(f"Failed to update credentials for '{model_name}': {error_msg}")
            return create_error_response(
                500,
                'Failed to update credentials',
                f"Unable to update AWS credentials for model '{model_name}'",
                details=error_msg,
            )

    except Exception as e:
        logger.error(f"Exception updating credentials for '{model_name}': {str(e)}")
        logger.error(traceback.format_exc())
        return create_error_response(
            500,
            'Failed to update credentials',
            f"Unexpected error updating credentials for model '{model_name}'",
            details=str(e),
        )
