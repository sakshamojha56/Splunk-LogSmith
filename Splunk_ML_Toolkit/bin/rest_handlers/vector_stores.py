"""
REST handler for `vector_stores` command
"""

import traceback
import json
import cexc
from util.searchinfo_util import searchinfo_from_request
from ai_commander.constants import PAYLOAD, STATUS
from connection_config_manager.vector_db.config_manager import ConfigManager
from util.error_util import CustomMLTKError
from ai_commander.constants import (
    DEFAULT_TOKEN,
    AGENT_CONNECTION_CAPABILITIES,
)
from ai_commander.ai_commander_util import AICommanderUtil

logger = cexc.get_logger(__name__)


class VectorStores(object):
    @classmethod
    def _remove_secrets(cls, config: dict) -> None:
        """Removes sensitive information from the configuration."""
        if config.get("type") == 'AWS_KB':
            config["details"][ConfigManager.AWS_ACCESS_KEY_ID] = DEFAULT_TOKEN
            config["details"][ConfigManager.AWS_ACCESS_KEY_TOKEN] = DEFAULT_TOKEN
            config["details"][ConfigManager.AWS_ROLE_ARN] = DEFAULT_TOKEN
            config["details"].pop("secrets", None)

    @classmethod
    def handle_get(cls, request: dict, path_parts: list) -> dict:
        """Handles the GET request for vector stores."""
        searchinfo = searchinfo_from_request(request, validate_token=True)
        try:
            config_manager = ConfigManager(searchinfo)
            configs = config_manager.get_config()
            for config in configs:
                config.pop("_key", None)
                config.pop("_user", None)
                cls._remove_secrets(config)
            return {
                PAYLOAD: configs,
                STATUS: 200,
            }
        except Exception as e:
            logger.error(
                f"Error retrieving vector store configurations: {str(traceback.format_exc())}"
            )
            return {
                PAYLOAD: {'error_message': "Failed to retrieve vector store configurations."},
                STATUS: 500,
            }

    @classmethod
    def handle_post(cls, request: dict, path_parts: list) -> dict:
        """
        Handles the POST request for vector stores

        Routes:
        - POST /vector_stores - Create new configuration
        - POST /vector_stores/test - Test connection
        """
        searchinfo = searchinfo_from_request(
            request, with_admin_token=True, validate_token=True
        )
        try:
            is_user_eligible = AICommanderUtil(
                searchinfo=searchinfo
            ).check_capabilities_eligibility_from_search_info(
                required_capabilities=AGENT_CONNECTION_CAPABILITIES
            )
            if not is_user_eligible:
                return {
                    PAYLOAD: {
                        'error_message': 'User is not authorized to manage vector store configurations. Missing required capabilities.'
                    },
                    STATUS: 403,
                }

            # Check if this is a test connection request
            if len(path_parts) >= 2 and path_parts[1] == 'test':
                return cls._handle_test_connection(request, searchinfo)

            # Otherwise, handle create configuration
            config_manager = ConfigManager(searchinfo)
            request_payload = json.loads(request[PAYLOAD])
            is_created = config_manager.create_config(request_payload)
            if is_created:
                cls._remove_secrets(request_payload)
                return {
                    PAYLOAD: {
                        'message': 'Vector store configuration created successfully',
                        'status': 'success',
                        'config': request_payload,
                    },
                    STATUS: 200,
                }
            return {
                PAYLOAD: {
                    'message': 'Failed to create vector store configuration',
                    'status': 'error',
                },
                STATUS: 500,
            }
        except CustomMLTKError as e:
            logger.error(f"Error during vector store configuration creation: {str(e)}")
            return {
                PAYLOAD: {'error_message': str(e)},
                STATUS: 400,
            }
        except Exception as e:
            logger.error(
                f"Error creating vector store configuration: {str(traceback.format_exc())}"
            )
            return {
                PAYLOAD: {'error_message': 'Error creating vector store configuration.'},
                STATUS: 500,
            }

    @classmethod
    def handle_delete(cls, request: dict, path_parts: list) -> dict:
        """Handles the DELETE request for vector stores."""
        searchinfo = searchinfo_from_request(
            request, with_admin_token=True, validate_token=True
        )
        try:
            # Extract connection_name from path_parts
            # Expected path: /vector_stores/<connection_name>
            if len(path_parts) < 2:
                return {
                    PAYLOAD: {'error_message': 'Connection name is required in the path.'},
                    STATUS: 400,
                }
            connection_name = path_parts[1]
            is_user_eligible = AICommanderUtil(
                searchinfo=searchinfo
            ).check_capabilities_eligibility_from_search_info(
                required_capabilities=AGENT_CONNECTION_CAPABILITIES
            )
            if not is_user_eligible:
                return {
                    PAYLOAD: {
                        'error_message': 'User is not authorized to manage vector store configurations. Missing required capabilities.'
                    },
                    STATUS: 403,
                }
            config_manager = ConfigManager(searchinfo)
            is_deleted = config_manager.delete_config(connection_name)
            if is_deleted:
                return {
                    PAYLOAD: {
                        'message': f'Vector store configuration "{connection_name}" deleted successfully',
                        'status': 'success',
                    },
                    STATUS: 200,
                }
            return {
                PAYLOAD: {
                    'message': 'Failed to delete vector store configuration',
                    'status': 'error',
                },
                STATUS: 500,
            }
        except CustomMLTKError as e:
            logger.error(f"Error during vector store configuration deletion: {str(e)}")
            return {
                PAYLOAD: {'error_message': str(e)},
                STATUS: 400,
            }
        except Exception as e:
            logger.error(
                f"Error deleting vector store configuration: {str(traceback.format_exc())}"
            )
            return {
                PAYLOAD: {'error_message': 'Error deleting vector store configuration.'},
                STATUS: 500,
            }

    @classmethod
    def handle_put(cls, request: dict, path_parts: list) -> dict:
        """Handles the PUT request for vector stores."""

        searchinfo = searchinfo_from_request(
            request, with_admin_token=True, validate_token=True
        )
        try:
            is_user_eligible = AICommanderUtil(
                searchinfo=searchinfo
            ).check_capabilities_eligibility_from_search_info(
                required_capabilities=AGENT_CONNECTION_CAPABILITIES
            )
            if not is_user_eligible:
                return {
                    PAYLOAD: {
                        'error_message': 'User is not authorized to manage vector store configurations. Missing required capabilities.'
                    },
                    STATUS: 403,
                }
            config_manager = ConfigManager(searchinfo)
            request_payload = json.loads(request[PAYLOAD])
            is_updated = config_manager.update_config(request_payload)
            if is_updated:
                cls._remove_secrets(request_payload)
                return {
                    PAYLOAD: {
                        'message': 'Vector store configuration updated successfully',
                        'status': 'success',
                        'config': request_payload,
                    },
                    STATUS: 200,
                }
            return {
                PAYLOAD: {
                    'message': 'Failed to update vector store configuration',
                    'status': 'error',
                },
                STATUS: 500,
            }
        except CustomMLTKError as e:
            logger.error(f"Error during vector store configuration update: {str(e)}")
            return {
                PAYLOAD: {'error_message': str(e)},
                STATUS: 400,
            }
        except Exception as e:
            logger.error(
                f"Error updating vector store configuration: {str(traceback.format_exc())}"
            )
            return {
                PAYLOAD: {'error_message': 'Error updating vector store configuration.'},
                STATUS: 500,
            }

    @classmethod
    def _handle_test_connection(cls, request: dict, search_info: dict) -> dict:
        """
        Test vector store connection endpoint

        Endpoint: POST /vector_stores/test

        Request body:
        {
            "name": "kb-name"  # For testing saved connection with DEFAULT_TOKEN
            OR
            "type": "AWS_KB",  # For testing form with actual credentials
            "details": {
                "aws_access_key_id": "AKIAZSSZM6CB...",
                "aws_access_key_token": "8/pXqKsWNJ...",
                "role_arn": "arn:aws:iam::123456789012:role/...",
                "aws_region": "us-west-2",
                "kb_id": "EJGJR4SKJL"
            }
        }

        Returns:
            Success: {payload: {connected: true, status: "success", ...}, status: 200}
            Error: {payload: {connected: false, status: "error", ...}, status: 400}
        """
        try:
            config_manager = ConfigManager(search_info)
            request_payload = json.loads(request[PAYLOAD])

            # Call the test method
            result = config_manager.test_kb_connection(request_payload)

            # Return appropriate HTTP status based on connection result
            http_status = 200 if result.get('connected') else 400

            return {
                PAYLOAD: result,
                STATUS: http_status,
            }

        except Exception as e:
            logger.error(
                f"Error testing vector store connection: {str(traceback.format_exc())}"
            )
            return {
                PAYLOAD: {
                    'connected': False,
                    'status': 'error',
                    'error_message': 'Connection test failed.',
                },
                STATUS: 500,
            }
