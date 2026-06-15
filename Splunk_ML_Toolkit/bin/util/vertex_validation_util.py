"""
Validation helpers for Vertex AI registration and test-connection flows.
"""

import json
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Tuple

import cexc
from util.param_util import is_valid_identifier
from vertex_int.constants import (
    VERTEX_REQUIRED_CREDENTIAL_FIELDS,
    VERTEX_REQUIRED_PAYLOAD_FIELDS,
)

logger = cexc.get_logger(__name__)

VERTEX_INVOCATIONS_PATH = '/invocations'
VERTEX_SUCCESS_STATUS_CODES = ['200', '201', '202']


def validate_vertex_registration_payload(
    payload: Dict[str, Any],
) -> Tuple[bool, List[str], List[str]]:
    """Validate Vertex registration payload and return (ok, errors, warnings)."""
    errors: List[str] = []
    warnings: List[str] = []

    supports_csv = _supports_csv_content_type(payload.get('openapi_spec', {}))

    required_fields = VERTEX_REQUIRED_PAYLOAD_FIELDS.copy()
    if supports_csv:
        required_fields = [
            field
            for field in required_fields
            if field not in ['input_feature_map', 'output_prediction_map']
        ]

    errors.extend(_validate_required_fields(payload, required_fields))
    if errors:
        return False, errors, warnings

    errors.extend(_validate_feature_map_types(payload))
    errors.extend(_validate_gcp_credentials(payload.get('gcp_credentials', {})))
    errors.extend(_validate_model_name(payload.get('model_name', '')))
    errors.extend(_validate_batch_size(payload.get('batch_size')))
    errors.extend(_validate_openapi_spec(payload.get('openapi_spec', {})))
    if not errors:
        errors.extend(_validate_feature_maps(payload, supports_csv))
    endpoint_name = payload.get('endpoint_name', '')
    if not errors:
        errors.extend(
            _validate_vertex_endpoint_exists(endpoint_name, payload.get('gcp_credentials', {}))
        )

    return len(errors) == 0, errors, warnings


def validate_vertex_test_connection_payload(payload: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """Validate minimal fields required for test-connection."""
    errors: List[str] = []

    gcp_credentials = payload.get('gcp_credentials')
    if not gcp_credentials:
        errors.append("'gcp_credentials' is required for connection testing")
    else:
        errors.extend(_validate_gcp_credentials(gcp_credentials))

    if errors:
        return False, errors

    return True, errors


def validate_vertex_update_fields(
    input_feature_map: Any,
    output_prediction_map: Any,
    openapi_spec: Any,
    batch_size: Any,
    existing_model_options: Dict[str, Any],
) -> Tuple[bool, List[str]]:
    """Validate fields for partial update (merged against existing config)."""
    errors: List[str] = []

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

    if openapi_spec is not None:
        errors.extend(_validate_openapi_spec(openapi_spec))

    if batch_size is not None:
        errors.extend(_validate_batch_size(batch_size))

    if input_feature_map is not None and not isinstance(input_feature_map, dict):
        errors.append("'input_feature_map' must be a dictionary")

    if output_prediction_map is not None and not isinstance(output_prediction_map, dict):
        errors.append("'output_prediction_map' must be a dictionary")

    if (final_input_map or final_output_map) and not final_spec:
        errors.append(
            "Cannot validate feature maps without an OpenAPI specification. "
            "OpenAPI spec is missing from both update and existing configuration."
        )

    if final_batch_size is None:
        errors.extend(_validate_batch_size(final_batch_size))

    if not errors and final_spec:
        supports_csv = _supports_csv_content_type(final_spec)
        validation_payload = {
            'input_feature_map': final_input_map,
            'output_prediction_map': final_output_map,
            'openapi_spec': final_spec,
        }
        errors.extend(_validate_feature_maps(validation_payload, supports_csv))

    return len(errors) == 0, errors


def _validate_required_fields(payload: Dict[str, Any], required_fields: List[str]) -> List[str]:
    """Validate required fields are present and non-empty."""
    errors = []
    for field in required_fields:
        if field not in payload:
            errors.append(f"Missing required field: '{field}'")
        elif not payload[field]:
            errors.append(f"Field '{field}' cannot be empty")
    return errors


def _validate_feature_map_types(payload: Dict[str, Any]) -> List[str]:
    """Validate that feature maps are dictionaries."""
    errors = []
    input_feature_map = payload.get('input_feature_map')
    output_prediction_map = payload.get('output_prediction_map')

    if 'input_feature_map' in payload and not isinstance(input_feature_map, dict):
        errors.append("'input_feature_map' must be a dictionary")
    if 'output_prediction_map' in payload and not isinstance(output_prediction_map, dict):
        errors.append("'output_prediction_map' must be a dictionary")

    return errors


def _validate_feature_maps(payload: Dict[str, Any], supports_csv: bool = False) -> List[str]:
    """Validate Vertex feature map requirements and path syntax."""
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


def _validate_gcp_credentials(gcp_credentials: Dict[str, Any]) -> List[str]:
    """Validate Vertex credentials structure and required fields."""
    errors = []
    if not isinstance(gcp_credentials, dict):
        return ["'gcp_credentials' must be an object"]

    for field in VERTEX_REQUIRED_CREDENTIAL_FIELDS:
        if field not in gcp_credentials:
            errors.append(f"Missing required field: 'gcp_credentials.{field}'")
        elif not gcp_credentials[field]:
            errors.append(f"'gcp_credentials.{field}' cannot be empty")

    service_account_json = gcp_credentials.get('service_account_json')
    if service_account_json and isinstance(service_account_json, str):
        try:
            json.loads(service_account_json)
        except json.JSONDecodeError:
            errors.append("'gcp_credentials.service_account_json' must be valid JSON")
    elif service_account_json and not isinstance(service_account_json, dict):
        errors.append("'gcp_credentials.service_account_json' must be a JSON string or object")

    return errors


def _validate_model_name(model_name: str) -> List[str]:
    """Validate model name format and constraints."""
    errors = []
    if not model_name or not isinstance(model_name, str):
        errors.append(f"Invalid model name: '{model_name}'")
    elif not is_valid_identifier(model_name):
        errors.append(
            f"Invalid model name '{model_name}'. "
            "Model name must contain only letters, numbers, and underscore."
        )
    return errors


def _validate_batch_size(batch_size: Any) -> List[str]:
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


def _validate_openapi_spec(openapi_spec: Dict[str, Any]) -> List[str]:
    """Validate minimal OpenAPI spec requirements."""
    errors = []
    if not isinstance(openapi_spec, dict):
        return ["'openapi_spec' must be a dictionary"]

    if 'openapi' not in openapi_spec:
        errors.append("OpenAPI spec missing 'openapi' version field")
    elif not str(openapi_spec.get('openapi', '')).startswith('3.0'):
        errors.append(
            f"Unsupported OpenAPI version '{openapi_spec.get('openapi')}'. "
            "Only OpenAPI 3.0.x is supported."
        )

    paths = openapi_spec.get('paths', {})
    if '/invocations' not in paths:
        errors.append("OpenAPI spec missing '/invocations' endpoint")
    else:
        invocations = paths.get('/invocations', {})
        if not isinstance(invocations, dict) or 'post' not in invocations:
            errors.append("OpenAPI spec '/invocations' endpoint missing POST method")

    return errors


def _validate_input_feature_map_paths(
    input_feature_map: Dict[str, str], openapi_spec: Dict[str, Any]
) -> List[str]:
    """Validate input feature map paths against the request schema."""
    errors = []

    if '*' in input_feature_map:
        return errors

    try:
        paths = openapi_spec.get('paths', {})
        invocations = paths.get(VERTEX_INVOCATIONS_PATH, {})
        post_method = invocations.get('post', {})
        request_body = post_method.get('requestBody', {})
        content = request_body.get('content', {})

        request_schema = content.get('application/json', {}).get('schema')
        if not request_schema:
            for content_spec in content.values():
                if 'schema' in content_spec:
                    request_schema = content_spec['schema']
                    break

        if not request_schema:
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

            errors.extend(
                _validate_schema_path(
                    schema_path, request_schema, f"input_feature_map['{column_name}']"
                )
            )

    except Exception as exc:
        errors.append(f"Error validating input feature map paths: {str(exc)}")

    return errors


def _validate_output_prediction_map_paths(
    output_prediction_map: Dict[str, str], openapi_spec: Dict[str, Any]
) -> List[str]:
    """Validate output prediction map paths against the response schema."""
    errors = []

    try:
        paths = openapi_spec.get('paths', {})
        invocations = paths.get(VERTEX_INVOCATIONS_PATH, {})
        post_method = invocations.get('post', {})
        responses = post_method.get('responses', {})

        response_schema = None
        for status_code in VERTEX_SUCCESS_STATUS_CODES:
            if status_code in responses:
                response_spec = responses[status_code]
                content = response_spec.get('content', {})

                json_schema = content.get('application/json', {}).get('schema')
                if not json_schema:
                    for content_spec in content.values():
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

            errors.extend(
                _validate_schema_path(
                    response_property,
                    response_schema,
                    f"output_prediction_map['{response_property}']",
                )
            )

    except Exception as exc:
        errors.append(f"Error validating output prediction map paths: {str(exc)}")

    return errors


def _validate_schema_path(schema_path: str, schema: Dict[str, Any], context: str) -> List[str]:
    """Validate basic path syntax."""
    errors = []

    if not schema_path or not isinstance(schema_path, str):
        errors.append(f"{context}: path must be a non-empty string")
        return errors

    import re

    if not re.match(r'^[\w\.\[\]\*\-]+$', schema_path):
        errors.append(f"{context}: path '{schema_path}' contains invalid characters")

    return errors


def _validate_column_name_conflicts(
    input_feature_map: Dict[str, str], output_prediction_map: Dict[str, str]
) -> List[str]:
    """Validate that input and output DataFrame column names do not conflict."""
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

    except Exception as exc:
        errors.append(f"Error validating column name conflicts: {str(exc)}")

    return errors


def _supports_csv_content_type(openapi_spec: Dict[str, Any]) -> bool:
    """Return True if OpenAPI spec supports text/csv."""
    try:
        paths = openapi_spec.get('paths', {})
        invocations = paths.get('/invocations', {})
        post_method = invocations.get('post', {})
        request_body = post_method.get('requestBody', {})
        content = request_body.get('content', {})
        return 'text/csv' in content
    except (TypeError, AttributeError):
        return False


def _validate_vertex_endpoint_exists(
    endpoint_name: str, gcp_credentials: Dict[str, Any]
) -> List[str]:
    """Validate that Vertex endpoint exists and is accessible."""
    _, errors, _, _ = test_vertex_endpoint_connection(endpoint_name, gcp_credentials)
    return errors


def test_vertex_endpoint_connection(
    endpoint_name: str, gcp_credentials: Dict[str, Any]
) -> Tuple[bool, List[str], str, str]:
    """Test Vertex endpoint connectivity and return (ok, errors, path, url)."""
    errors: List[str] = []

    project_id = gcp_credentials.get('project_id')
    region = gcp_credentials.get('region')
    endpoint_id = gcp_credentials.get('endpoint_id')

    if not project_id or not region or not endpoint_id:
        errors.append(
            "Missing required fields to validate endpoint: "
            "'project_id', 'region', and 'endpoint_id' are required."
        )
        return False, errors, '', ''

    service_account_json = gcp_credentials.get('service_account_json')
    if not service_account_json:
        errors.append("'gcp_credentials.service_account_json' is required to validate endpoint")
        return False, errors, '', ''

    try:
        if isinstance(service_account_json, str):
            service_account_info = json.loads(service_account_json)
        else:
            service_account_info = service_account_json
    except json.JSONDecodeError:
        errors.append("'gcp_credentials.service_account_json' must be valid JSON")
        return False, errors, '', ''

    try:
        from google.oauth2 import service_account
    except Exception:
        errors.append(
            "Google authentication libraries are not installed. "
            "Install google-auth to enable Vertex endpoint validation."
        )
        return False, errors, '', ''

    try:
        credentials = service_account.Credentials.from_service_account_info(
            service_account_info,
            scopes=['https://www.googleapis.com/auth/cloud-platform'],
        )
    except Exception as exc:
        logger.error(f"Failed to authenticate with Vertex credentials: {exc}")
        errors.append(
            "Authentication failed while validating Vertex endpoint. "
            "Verify your service account JSON and permissions."
        )
        return False, errors, '', ''

    endpoint_path = _normalize_vertex_endpoint_path(
        endpoint_name, project_id, region, endpoint_id
    )
    endpoint_url = f"https://{region}-aiplatform.googleapis.com/v1/{endpoint_path}"

    # Prefer Vertex SDK endpoint validation; fallback to direct REST for compatibility.
    try:
        from google.cloud import aiplatform_v1
        from google.api_core import exceptions as gax_exceptions

        client_options = {'api_endpoint': f"{region}-aiplatform.googleapis.com"}
        endpoint_client = aiplatform_v1.EndpointServiceClient(
            credentials=credentials,
            client_options=client_options,
        )
        endpoint_client.get_endpoint(name=endpoint_path)
    except ImportError as exc:
        logger.warning(
            "google-cloud-aiplatform is not available; "
            f"falling back to direct REST endpoint validation. Details: {exc}"
        )
        try:
            from google.auth.transport.requests import Request
        except Exception:
            errors.append(
                "Google authentication libraries are not installed. "
                "Install google-auth to enable Vertex endpoint validation."
            )
            return False, errors, endpoint_path, endpoint_url

        try:
            credentials.refresh(Request())
        except Exception as refresh_exc:
            logger.error(f"Failed to refresh Vertex access token: {refresh_exc}")
            errors.append(
                "Authentication failed while validating Vertex endpoint. "
                "Verify your service account JSON and permissions."
            )
            return False, errors, endpoint_path, endpoint_url

        request = urllib.request.Request(
            endpoint_url,
            headers={'Authorization': f"Bearer {credentials.token}"},
            method='GET',
        )

        try:
            with urllib.request.urlopen(request, timeout=10) as response:
                if response.status != 200:
                    errors.append(
                        f"Vertex endpoint validation failed with status {response.status}"
                    )
        except urllib.error.HTTPError as http_exc:
            if http_exc.code == 404:
                errors.append(
                    "Vertex endpoint not found. Verify project, region, and endpoint ID."
                )
            elif http_exc.code == 403:
                errors.append(
                    "Access denied to Vertex endpoint. Verify service account permissions."
                )
            else:
                errors.append(f"Vertex endpoint validation failed with status {http_exc.code}")
        except urllib.error.URLError as url_exc:
            logger.error(f"Network error during Vertex endpoint validation: {url_exc}")
            errors.append(
                "Connection timed out while validating Vertex endpoint. Please try again later."
            )
        except Exception as unexpected_exc:
            logger.error(
                f"Unexpected error during Vertex endpoint validation: {unexpected_exc}"
            )
            errors.append("Unexpected error while validating Vertex endpoint.")
    except gax_exceptions.NotFound:
        errors.append("Vertex endpoint not found. Verify project, region, and endpoint ID.")
    except gax_exceptions.PermissionDenied:
        errors.append("Access denied to Vertex endpoint. Verify service account permissions.")
    except gax_exceptions.Unauthenticated:
        errors.append(
            "Authentication failed while validating Vertex endpoint. Verify your service account JSON and permissions."
        )
    except (gax_exceptions.DeadlineExceeded, gax_exceptions.ServiceUnavailable):
        errors.append(
            "Connection timed out while validating Vertex endpoint. Please try again later."
        )
    except gax_exceptions.GoogleAPICallError as exc:
        logger.error(f"Vertex endpoint validation API error: {exc}")
        errors.append("Unexpected error while validating Vertex endpoint.")
    except Exception as exc:
        logger.error(f"Unexpected error during Vertex endpoint validation: {exc}")
        errors.append("Unexpected error while validating Vertex endpoint.")

    return len(errors) == 0, errors, endpoint_path, endpoint_url


def _normalize_vertex_endpoint_path(
    endpoint_name: str, project_id: str, region: str, endpoint_id: str
) -> str:
    """Return a Vertex endpoint resource path."""
    if endpoint_name:
        if endpoint_name.startswith('projects/'):
            return endpoint_name
        if endpoint_name.startswith('https://'):
            parsed = urllib.parse.urlparse(endpoint_name)
            if '/v1/' in parsed.path:
                return parsed.path.split('/v1/', 1)[1].lstrip('/')

    return f"projects/{project_id}/locations/{region}/endpoints/{endpoint_id}"
