"""REST handler for Vertex AI model registration and updates."""

import json
import traceback
from typing import Any, Dict, List, Optional, Tuple

import cexc
from util.lookup_exceptions import ModelNotFoundException
from util.param_util import is_valid_identifier
from util.searchinfo_util import searchinfo_from_request
from util import telemetry_vertex_util
from util.sagemaker_util_extensions import (
    create_error_response,
    create_success_response,
    create_unauthorized_response,
    extract_update_fields,
    validate_update_keys,
)
from util.sagemaker_util_extensions import is_test_connection_request
from util.vertex_util_extensions import (
    check_user_has_vertex_capabilities,
    check_vertex_credentials_exist,
    check_vertex_model_exists,
    create_vertex_model_lookup_entry,
    delete_vertex_model_lookup_entry,
    delete_vertex_credentials,
    find_vertex_model_lookup_references,
    get_vertex_model_options_from_disk,
    load_vertex_credentials,
    restore_vertex_credentials,
    store_vertex_credentials,
    update_vertex_mapping_fields_only,
)
from util.vertex_validation_util import (
    _normalize_vertex_endpoint_path,
    test_vertex_endpoint_connection,
    validate_vertex_registration_payload,
    validate_vertex_test_connection_payload,
    validate_vertex_update_fields,
)
from vertex_int.constants import (
    VERTEX_REGISTER_MODEL_CAPABILITIES,
    VERTEX_TEST_CONNECTION_CAPABILITIES,
    VERTEX_MODEL_ALGO_NAME,
    VERTEX_MODEL_RUNTIME,
)

logger = cexc.get_logger(__name__)


def _extract_payload_from_request(
    request: Dict[str, Any],
) -> Tuple[Dict[str, Any], Optional[Dict[str, Any]]]:
    """Extract and parse JSON payload from request."""
    if 'payload' in request and isinstance(request['payload'], str):
        try:
            return json.loads(request['payload']), None
        except Exception as exc:
            return {}, create_error_response(
                400, 'Invalid JSON payload', f'Failed to parse JSON: {exc}'
            )
    if 'payload' in request and isinstance(request['payload'], dict):
        return request['payload'], None
    return {}, create_error_response(
        400,
        'Missing or invalid payload in request',
        'Request must contain a valid JSON payload with Vertex model configuration',
    )


def _extract_model_name_from_delete_request(
    request: Dict[str, Any], path_parts: list
) -> Tuple[Optional[str], Optional[Dict[str, Any]]]:
    """Extract model_name from DELETE payload, query params, or path parts."""
    payload = {}
    if 'payload' in request:
        if isinstance(request['payload'], str):
            try:
                payload = json.loads(request['payload'])
            except Exception as exc:
                return None, create_error_response(
                    400, 'Invalid JSON payload', f'Failed to parse JSON: {exc}'
                )
        elif isinstance(request['payload'], dict):
            payload = request['payload']

    model_name = payload.get('model_name')

    if not model_name and 'query' in request:
        for query_param in request['query']:
            if len(query_param) >= 2 and str(query_param[0]).lower() == 'model_name':
                model_name = str(query_param[1])
                break

    if not model_name and path_parts:
        for part in path_parts:
            if '=' in part:
                key, value = part.split('=', 1)
                if key == 'model_name':
                    model_name = value
                    break

    if not model_name:
        return None, create_error_response(
            400,
            'Missing required field',
            "'model_name' is required to delete a Vertex model",
        )

    return str(model_name), None


def _handle_vertex_test_connection(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Handle test_connection requests."""
    try:
        ok, errors = validate_vertex_test_connection_payload(payload)
        if not ok:
            primary = errors[0] if errors else 'Validation failed'
            logger.warning(f"Vertex connection test validation failed: {errors}")
            return create_error_response(
                400,
                'Connection test failed',
                primary,
                all_errors=errors,
            )

        gcp_credentials = payload.get('gcp_credentials', {})
        endpoint_name = _normalize_vertex_endpoint_path(
            payload.get('endpoint_name', ''),
            gcp_credentials.get('project_id', ''),
            gcp_credentials.get('region', ''),
            gcp_credentials.get('endpoint_id', ''),
        )
        ok, errors, endpoint_path, endpoint_url = test_vertex_endpoint_connection(
            endpoint_name, gcp_credentials
        )

        if ok:
            logger.info(f"Connection test successful for Vertex endpoint '{endpoint_name}'")
            return {
                'status': 200,
                'payload': {
                    'status': 'success',
                    'success': True,
                    'message': f"Successfully connected to the endpoint '{endpoint_name}'",
                    'endpoint_name': endpoint_name,
                    'endpoint_path': endpoint_path,
                    'endpoint_url': endpoint_url,
                    'test_type': 'connection_test',
                },
            }

        logger.warning(
            f"Connection test failed for Vertex endpoint '{endpoint_name}': {errors}"
        )
        return create_error_response(
            400,
            'Connection test failed',
            errors[0] if errors else 'Unknown connection error',
            all_errors=errors,
            endpoint_name=endpoint_name,
            endpoint_path=endpoint_path,
            endpoint_url=endpoint_url,
        )

    except Exception as exc:
        logger.error(f"Unexpected error during Vertex connection test: {exc}")
        logger.error(traceback.format_exc())
        return create_error_response(
            500,
            'Connection test error',
            'An unexpected error occurred while testing the connection',
        )


class RegisterVertexai(object):
    @classmethod
    def handle_post(cls, request: Dict[str, Any], path_parts: list) -> Dict[str, Any]:
        """POST: Register Vertex model or test connection (test_connection=1)."""
        model_name = 'unknown'
        try:
            searchinfo = searchinfo_from_request(request)
            test_connection = is_test_connection_request(request, path_parts)

            required_capabilities = (
                VERTEX_TEST_CONNECTION_CAPABILITIES
                if test_connection
                else VERTEX_REGISTER_MODEL_CAPABILITIES
            )
            operation = (
                "test Vertex endpoint connections"
                if test_connection
                else "register Vertex models"
            )

            if not check_user_has_vertex_capabilities(searchinfo, required_capabilities):
                logger.warning(f"Unauthorized: {searchinfo.get('username')} - {operation}")
                return create_unauthorized_response(operation, required_capabilities)

            payload, error = _extract_payload_from_request(request)
            if error:
                return error

            if test_connection:
                return _handle_vertex_test_connection(payload)

            is_valid, validation_errors, warnings = validate_vertex_registration_payload(
                payload
            )
            if not is_valid:
                primary = validation_errors[0] if validation_errors else 'Validation failed'
                return create_error_response(
                    400,
                    'Payload validation failed',
                    primary,
                    validation_errors=validation_errors,
                )

            model_name = payload['model_name']
            if check_vertex_model_exists(model_name, searchinfo):
                telemetry_vertex_util.log_uuid()
                telemetry_vertex_util.log_vertex_register(model_name, VERTEX_MODEL_ALGO_NAME, 0)
                return create_error_response(
                    409,
                    'Model name conflict',
                    f"Vertex model '{model_name}' already exists. Please use a different model name.",
                    suggestion='Use a different model name or delete the existing model',
                )

            if check_vertex_credentials_exist(model_name, searchinfo):
                telemetry_vertex_util.log_uuid()
                telemetry_vertex_util.log_vertex_register(model_name, VERTEX_MODEL_ALGO_NAME, 0)
                return create_error_response(
                    409,
                    'Model name conflict',
                    f"Vertex model name '{model_name}' is already taken by another user. "
                    "Please use a different model name.",
                    suggestion='Use a different model name',
                )

            gcp_credentials = payload['gcp_credentials']
            payload['endpoint_name'] = _normalize_vertex_endpoint_path(
                payload.get('endpoint_name', ''),
                gcp_credentials.get('project_id', ''),
                gcp_credentials.get('region', ''),
                gcp_credentials.get('endpoint_id', ''),
            )
            model_config = {k: v for k, v in payload.items() if k != 'gcp_credentials'}

            error = store_vertex_credentials(model_name, gcp_credentials, searchinfo)
            if error:
                telemetry_vertex_util.log_uuid()
                telemetry_vertex_util.log_vertex_register(model_name, VERTEX_MODEL_ALGO_NAME, 0)
                return error

            try:
                lookup_response = create_vertex_model_lookup_entry(
                    model_name=model_name,
                    model_config=model_config,
                    searchinfo=searchinfo,
                    namespace='user',
                    local=False,
                    tmp=False,
                )
            except Exception as exc:
                lookup_response = {'success': False, 'message': str(exc)}

            if not lookup_response.get('success'):
                try:
                    delete_vertex_credentials(model_name, searchinfo)
                except Exception:
                    logger.warning(
                        f"Failed to rollback credentials for '{model_name}' after lookup failure"
                    )
                telemetry_vertex_util.log_uuid()
                telemetry_vertex_util.log_vertex_register(model_name, VERTEX_MODEL_ALGO_NAME, 0)
                lookup_message = lookup_response.get(
                    'message', 'Unable to register model configuration'
                )
                is_name_conflict = 'already exists' in lookup_message.lower()
                return create_error_response(
                    409 if is_name_conflict else 500,
                    (
                        'Model name conflict'
                        if is_name_conflict
                        else 'Failed to create model lookup entry'
                    ),
                    lookup_message,
                    **(
                        {
                            'suggestion': 'Use a different model name or delete the existing model'
                        }
                        if is_name_conflict
                        else {}
                    ),
                )

            telemetry_vertex_util.log_uuid()
            telemetry_vertex_util.log_vertex_register(model_name, VERTEX_MODEL_ALGO_NAME, 1)
            return create_success_response(
                model_name,
                payload,
                message=f"Vertex model '{model_name}' registered successfully",
                warnings=warnings,
            )

        except RuntimeError as exc:
            telemetry_vertex_util.log_uuid()
            telemetry_vertex_util.log_vertex_register(model_name, VERTEX_MODEL_ALGO_NAME, 0)

            if 'already exists' in str(exc):
                return create_error_response(
                    409,
                    'Model name conflict',
                    str(exc),
                    suggestion='Use a different model name or delete the existing model',
                )

            logger.error(f"Runtime error: {exc}\n{traceback.format_exc()}")
            return create_error_response(500, 'Model registration failed', str(exc))

        except Exception as exc:
            telemetry_vertex_util.log_uuid()
            telemetry_vertex_util.log_vertex_register(model_name, VERTEX_MODEL_ALGO_NAME, 0)
            logger.error(f"Error: {exc}\n{traceback.format_exc()}")
            return create_error_response(
                500, 'Internal server error', 'An unexpected error occurred'
            )

    @classmethod
    def handle_put(cls, request: Dict[str, Any], path_parts: list) -> Dict[str, Any]:
        """PUT: Update Vertex model configuration."""
        model_name = 'unknown'
        try:
            searchinfo = searchinfo_from_request(request)

            if not check_user_has_vertex_capabilities(
                searchinfo, VERTEX_REGISTER_MODEL_CAPABILITIES
            ):
                logger.warning(f"Unauthorized update: {searchinfo.get('username')}")
                return create_unauthorized_response(
                    "update Vertex model configuration",
                    VERTEX_REGISTER_MODEL_CAPABILITIES,
                )

            payload, error = _extract_payload_from_request(request)
            if error:
                return error

            error = validate_update_keys(payload)
            if error:
                return error

            fields, error = extract_update_fields(payload)
            if error:
                return error
            model_name, input_map, output_map, spec, batch = fields

            if not is_valid_identifier(model_name):
                return create_error_response(
                    400,
                    'Invalid model name',
                    f"Model name '{model_name}' is invalid. "
                    "Model names must start with a letter or underscore, "
                    "and contain only letters, numbers, and underscores.",
                )

            exists = check_vertex_model_exists(model_name, searchinfo)
            if not exists:
                return create_error_response(
                    404,
                    'Model not found',
                    f"Model '{model_name}' does not exist",
                )

            _, _, model_options = get_vertex_model_options_from_disk(
                model_name, searchinfo, namespace='user'
            )

            ok, validation_errors = validate_vertex_update_fields(
                input_map, output_map, spec, batch, model_options
            )
            if not ok:
                primary = validation_errors[0] if validation_errors else 'Validation failed'
                return create_error_response(
                    400,
                    'Payload validation failed',
                    primary,
                    validation_errors=validation_errors,
                )

            error = update_vertex_mapping_fields_only(
                model_name,
                (
                    input_map
                    if input_map is not None
                    else model_options.get('input_feature_map', {})
                ),
                (
                    output_map
                    if output_map is not None
                    else model_options.get('output_prediction_map', {})
                ),
                spec if spec is not None else model_options.get('openapi_spec', {}),
                searchinfo,
                batch_size=batch if batch is not None else model_options.get('batch_size'),
            )
            if error:
                return error

            return {
                'status': 200,
                'payload': {
                    'success': True,
                    'message': f"Model '{model_name}' updated successfully",
                    'model_name': model_name,
                    'endpoint_name': model_options.get('endpoint_name', 'unknown'),
                },
            }

        except Exception as exc:
            logger.error(f"Update error for '{model_name}': {exc}\n{traceback.format_exc()}")
            return create_error_response(
                500, 'Model update failed', str(exc) or 'Unexpected error'
            )

    @classmethod
    def handle_get(cls, request: Dict[str, Any], path_parts: list) -> Dict[str, Any]:
        """GET: Retrieve Vertex model configuration (without credentials)."""
        try:
            searchinfo = searchinfo_from_request(request)

            if not check_user_has_vertex_capabilities(
                searchinfo, VERTEX_REGISTER_MODEL_CAPABILITIES
            ):
                logger.warning(f"Unauthorized retrieval: {searchinfo.get('username')}")
                return create_unauthorized_response(
                    "retrieve Vertex model configuration",
                    VERTEX_REGISTER_MODEL_CAPABILITIES,
                )

            model_name = None
            if 'query' in request:
                for query_param in request['query']:
                    if len(query_param) >= 2 and str(query_param[0]).lower() == 'model_name':
                        model_name = str(query_param[1])
                        break

            if not model_name and path_parts:
                for part in path_parts:
                    if '=' in part:
                        key, value = part.split('=', 1)
                        if key == 'model_name':
                            model_name = value
                            break

            if not model_name:
                return create_error_response(
                    400,
                    'Missing required parameter',
                    "'model_name' is required to retrieve model configuration",
                )

            algo_name, model_data, model_options = get_vertex_model_options_from_disk(
                model_name, searchinfo, namespace='user'
            )

            return {
                'status': 200,
                'payload': {
                    'success': True,
                    'model_name': model_name,
                    'algorithm': algo_name,
                    'configuration': model_options,
                },
            }

        except (FileNotFoundError, ModelNotFoundException):
            return create_error_response(
                404,
                'Model not found',
                f"Model '{model_name}' does not exist in the lookup table",
            )

        except Exception as exc:
            logger.error(
                f"Error retrieving model '{model_name}': {exc}\n{traceback.format_exc()}"
            )
            return create_error_response(
                500,
                'Failed to retrieve model configuration',
                str(exc) or 'An unexpected error occurred',
            )

    @classmethod
    def handle_delete(cls, request: Dict[str, Any], path_parts: list) -> Dict[str, Any]:
        """DELETE: Delete a Vertex model lookup and its stored credentials."""
        model_name = 'unknown'
        try:
            searchinfo = searchinfo_from_request(request)

            if not check_user_has_vertex_capabilities(
                searchinfo, VERTEX_REGISTER_MODEL_CAPABILITIES
            ):
                logger.warning(f"Unauthorized delete: {searchinfo.get('username')}")
                return create_unauthorized_response(
                    "delete Vertex models",
                    VERTEX_REGISTER_MODEL_CAPABILITIES,
                )

            model_name, error = _extract_model_name_from_delete_request(request, path_parts)
            if error:
                return error

            if not is_valid_identifier(model_name):
                return create_error_response(
                    400,
                    'Invalid model name',
                    f"Model name '{model_name}' is invalid. "
                    "Model names must start with a letter or underscore, "
                    "and contain only letters, numbers, and underscores.",
                )

            _, _, model_options = get_vertex_model_options_from_disk(
                model_name, searchinfo, namespace='user'
            )
            if model_options.get('runtime') != VERTEX_MODEL_RUNTIME:
                return create_error_response(
                    400,
                    'Invalid model runtime',
                    f"Model '{model_name}' is not a Vertex model",
                )

            credentials_deleted = True
            warning = None
            credential_snapshot = None
            remaining_references = find_vertex_model_lookup_references(
                model_name, searchinfo, exclude_current_user=True
            )
            if remaining_references:
                credentials_deleted = False
                warning = (
                    "Model lookup was deleted, but stored Vertex credentials were retained "
                    "because another Vertex model with the same name still exists."
                )
            else:
                try:
                    credential_snapshot = load_vertex_credentials(model_name, searchinfo)
                except Exception as exc:
                    logger.warning(
                        f"Failed to read Vertex credentials for '{model_name}' before deletion: {exc}"
                    )
                    return create_error_response(
                        500,
                        'Credential retrieval failed',
                        "Stored Vertex credentials could not be read. The model "
                        "was not deleted. Retry deletion or contact your Splunk "
                        "administrator.",
                        details=str(exc) or 'Unexpected credential retrieval failure',
                    )

            try:
                delete_vertex_model_lookup_entry(model_name, searchinfo, namespace='user')
            except Exception as exc:
                logger.warning(
                    f"Failed to delete Vertex lookup for '{model_name}'; credentials were retained: {exc}"
                )
                return create_error_response(
                    500,
                    'Model deletion failed',
                    f"Vertex model '{model_name}' could not be deleted because the "
                    "model lookup could not be removed. Stored credentials were not "
                    "deleted, so the existing model registration remains intact. "
                    "Retry deletion or contact your Splunk administrator.",
                    details=str(exc) or 'Unexpected lookup deletion failure',
                )

            if not remaining_references:
                try:
                    credentials_deleted = delete_vertex_credentials(model_name, searchinfo)
                    if not credentials_deleted:
                        raise RuntimeError("Stored Vertex credentials could not be removed")
                except Exception as exc:
                    rollback_errors = []
                    lookup_restored = False
                    credentials_restored = credential_snapshot is None
                    try:
                        create_vertex_model_lookup_entry(
                            model_name=model_name,
                            model_config=model_options,
                            searchinfo=searchinfo,
                            namespace='user',
                            local=False,
                            tmp=False,
                            allow_overwrite=True,
                        )
                        lookup_restored = True
                    except Exception as rollback_exc:
                        rollback_errors.append(f"lookup restore failed: {rollback_exc}")

                    if credential_snapshot is not None:
                        try:
                            credentials_restored = restore_vertex_credentials(
                                model_name, credential_snapshot, searchinfo
                            )
                        except Exception as rollback_exc:
                            rollback_errors.append(f"credential restore failed: {rollback_exc}")

                    logger.warning(
                        f"Failed to delete Vertex credentials for '{model_name}' after lookup deletion: {exc}"
                    )
                    if lookup_restored and credentials_restored:
                        return create_error_response(
                            500,
                            'Credential deletion failed',
                            f"Vertex model '{model_name}' could not be fully deleted "
                            "because stored credentials could not be removed. The "
                            "model lookup was restored, so the model remains "
                            "registered. Retry deletion or contact your Splunk "
                            "administrator.",
                            details=str(exc) or 'Unexpected credential deletion failure',
                        )

                    return create_error_response(
                        500,
                        'Credential deletion failed',
                        f"Vertex model '{model_name}' could not be fully deleted, "
                        "and rollback failed. The model registration may require "
                        "administrator cleanup in Splunk lookup storage and secure "
                        "storage.",
                        details='; '.join(rollback_errors)
                        or str(exc)
                        or 'Unexpected credential deletion failure',
                    )

            payload = {
                'success': True,
                'message': f"Vertex model '{model_name}' deleted successfully",
                'model_name': model_name,
                'credentials_deleted': credentials_deleted,
            }
            if warning:
                payload['warning'] = warning

            return {'status': 200, 'payload': payload}

        except (FileNotFoundError, ModelNotFoundException):
            return create_error_response(
                404,
                'Model not found',
                f"Vertex model '{model_name}' does not exist",
            )

        except Exception as exc:
            logger.error(f"Delete error for '{model_name}': {exc}\n{traceback.format_exc()}")
            return create_error_response(
                500, 'Model deletion failed', str(exc) or 'Unexpected error'
            )


# Backward-compatible alias for any direct imports using the old class name.
RegisterVertexAI = RegisterVertexai
