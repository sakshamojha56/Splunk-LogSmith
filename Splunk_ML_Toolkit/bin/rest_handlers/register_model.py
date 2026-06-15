"""REST handler for SageMaker model registration and updates."""

import sys
import os
import traceback
from typing import Dict, Any

import cexc
from util.searchinfo_util import searchinfo_from_request
from util import telemetry_sagemaker_util
from util.param_util import is_valid_identifier
from util.sagemaker_util_extensions import (
    create_error_response,
    create_success_response,
    create_unauthorized_response,
    check_user_has_sagemaker_capabilities,
    extract_payload_from_request,
    validate_payload,
    validate_update_fields,
    validate_update_keys,
    extract_update_fields,
    load_and_merge_config,
    store_credentials,
    delete_credentials,
    create_lookup_entry,
    handle_test_connection,
    is_test_connection_request,
    check_model_exists,
    update_mapping_fields_only,
    get_sagemaker_model_options_from_disk,
)

from sagemaker_int.constants import (
    SAGEMAKER_REGISTER_MODEL_CAPABILITIES,
    SAGEMAKER_TEST_CONNECTION_CAPABILITIES,
    MODEL_ALGO_NAME,
)

logger = cexc.get_logger(__name__)


class RegisterModel(object):
    @classmethod
    def handle_post(cls, request: Dict[str, Any], path_parts: list) -> Dict[str, Any]:
        """POST: Register model or test connection (test_connection=1)."""
        model_name = 'unknown'
        try:
            searchinfo = searchinfo_from_request(request)
            test_connection = is_test_connection_request(request, path_parts)

            required_capabilities = (
                SAGEMAKER_TEST_CONNECTION_CAPABILITIES
                if test_connection
                else SAGEMAKER_REGISTER_MODEL_CAPABILITIES
            )
            operation = (
                "test SageMaker endpoint connections"
                if test_connection
                else "register SageMaker models"
            )

            if not check_user_has_sagemaker_capabilities(searchinfo, required_capabilities):
                logger.warning(f"Unauthorized: {searchinfo.get('username')} - {operation}")
                return create_unauthorized_response(operation, required_capabilities)

            payload, error = extract_payload_from_request(request)
            if error:
                return error

            if test_connection:
                return handle_test_connection(payload)

            error, warnings = validate_payload(payload)
            if error:
                return error

            model_name = payload['model_name']
            model_config = {k: v for k, v in payload.items() if k != 'aws_credentials'}

            # Store credentials first (more likely to fail, easier to rollback)
            error = store_credentials(model_name, payload['aws_credentials'], searchinfo)
            if error:
                telemetry_sagemaker_util.log_uuid()
                telemetry_sagemaker_util.log_sagemaker_register(model_name, MODEL_ALGO_NAME, 0)
                return error

            # Create lookup entry (if this fails, rollback credentials)
            error = create_lookup_entry(model_name, model_config, searchinfo)
            if error:
                # Rollback: Delete credentials since lookup creation failed
                try:
                    delete_credentials(model_name, searchinfo)
                    logger.warning(
                        f"Rolled back credentials for '{model_name}' after lookup creation failed"
                    )
                except Exception as rollback_error:
                    logger.error(
                        f"Failed to rollback credentials for '{model_name}': {rollback_error}"
                    )

                telemetry_sagemaker_util.log_uuid()
                telemetry_sagemaker_util.log_sagemaker_register(model_name, MODEL_ALGO_NAME, 0)
                return error

            logger.info(f"Model '{model_name}' registered successfully")
            telemetry_sagemaker_util.log_uuid()
            telemetry_sagemaker_util.log_sagemaker_register(model_name, MODEL_ALGO_NAME, 1)
            return create_success_response(model_name, payload, warnings=warnings)

        except RuntimeError as e:
            telemetry_sagemaker_util.log_uuid()
            telemetry_sagemaker_util.log_sagemaker_register(model_name, MODEL_ALGO_NAME, 0)

            if 'already exists' in str(e):
                return create_error_response(
                    409,
                    'Model name conflict',
                    str(e),
                    suggestion='Use a different model name or delete the existing model',
                )

            logger.error(f"Runtime error: {e}\n{traceback.format_exc()}")
            return create_error_response(500, 'Model registration failed', str(e))

        except Exception as e:
            telemetry_sagemaker_util.log_uuid()
            telemetry_sagemaker_util.log_sagemaker_register(model_name, MODEL_ALGO_NAME, 0)
            logger.error(f"Error: {e}\n{traceback.format_exc()}")
            return create_error_response(
                500, 'Internal server error', 'An unexpected error occurred'
            )

    @classmethod
    def handle_put(cls, request: Dict[str, Any], path_parts: list) -> Dict[str, Any]:
        """PUT: Update model configuration (mappings, openapi_spec, batch_size)."""
        model_name = 'unknown'
        try:
            searchinfo = searchinfo_from_request(request)

            if not check_user_has_sagemaker_capabilities(
                searchinfo, SAGEMAKER_REGISTER_MODEL_CAPABILITIES
            ):
                logger.warning(f"Unauthorized update: {searchinfo.get('username')}")
                return create_unauthorized_response(
                    "update SageMaker model configuration",
                    SAGEMAKER_REGISTER_MODEL_CAPABILITIES,
                )

            payload, error = extract_payload_from_request(request)
            if error:
                return error

            error = validate_update_keys(payload)
            if error:
                return error

            fields, error = extract_update_fields(payload)
            if error:
                return error
            model_name, input_map, output_map, spec, batch = fields

            # Validate model_name is a valid identifier (prevents directory traversal)
            if not is_valid_identifier(model_name):
                logger.warning(
                    f"Invalid model_name '{model_name}': must be a valid Python identifier"
                )
                return create_error_response(
                    400,
                    'Invalid model name',
                    f"Model name '{model_name}' is invalid. "
                    f"Model names must start with a letter or underscore, "
                    f"and contain only letters, numbers, and underscores.",
                )

            exists = check_model_exists(model_name, searchinfo)
            if not exists['exists']:
                logger.warning(f"Model not found: {model_name}")
                return create_error_response(
                    404,
                    'Model not found',
                    f"Model '{model_name}' does not exist",
                    details=exists['reason'],
                )

            model_options, final_config, error = load_and_merge_config(
                model_name, searchinfo, input_map, output_map, spec, batch
            )
            if error:
                return error

            error, warnings = validate_update_fields(
                input_map, output_map, spec, batch, model_options
            )
            if error:
                return error

            error = update_mapping_fields_only(
                model_name,
                final_config['input_feature_map'],
                final_config['output_prediction_map'],
                final_config['openapi_spec'],
                searchinfo,
                final_config['batch_size'],
            )
            if error:
                return error

            logger.info(f"Model '{model_name}' updated successfully")

            response = {
                'status': 200,
                'payload': {
                    'success': True,
                    'message': f"Model '{model_name}' updated successfully",
                    'model_name': model_name,
                    'endpoint_name': model_options.get('endpoint_name', 'unknown'),
                },
            }

            if warnings:
                response['payload']['warnings'] = warnings

            return response

        except Exception as e:
            logger.error(f"Update error for '{model_name}': {e}\n{traceback.format_exc()}")
            return create_error_response(500, 'Model update failed', 'Internal server error')

    @classmethod
    def handle_get(cls, request: Dict[str, Any], path_parts: list) -> Dict[str, Any]:
        """GET: Retrieve model configuration (without AWS credentials)."""
        try:
            searchinfo = searchinfo_from_request(request)

            if not check_user_has_sagemaker_capabilities(
                searchinfo, SAGEMAKER_REGISTER_MODEL_CAPABILITIES
            ):
                logger.warning(f"Unauthorized retrieval: {searchinfo.get('username')}")
                return create_unauthorized_response(
                    "retrieve SageMaker model configuration",
                    SAGEMAKER_REGISTER_MODEL_CAPABILITIES,
                )

            model_name = None

            if 'query' in request:
                for query_param in request['query']:
                    if len(query_param) >= 2:
                        param_name = (
                            query_param[0]
                            if isinstance(query_param[0], str)
                            else str(query_param[0])
                        )
                        if param_name == 'model_name':
                            model_name = (
                                query_param[1]
                                if isinstance(query_param[1], str)
                                else str(query_param[1])
                            )
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

            logger.info(f"Fetching configuration for model '{model_name}'")

            algo_name, model_data, model_options = get_sagemaker_model_options_from_disk(
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

        except FileNotFoundError:
            logger.warning(f"Model not found: {model_name}")
            return create_error_response(
                404,
                'Model not found',
                f"Model '{model_name}' does not exist in the lookup table",
            )

        except Exception as e:
            logger.error(
                f"Error retrieving model '{model_name}': {e}\n{traceback.format_exc()}"
            )
            return create_error_response(
                500,
                'Failed to retrieve model configuration',
                'Internal server error',
            )
