"""
REST handler for `aicommander` command
"""

import traceback
import json
from urllib.parse import unquote

import cexc
from ai_commander.ai_commander_util import AICommanderUtil
from ai_commander.constants import (
    PAYLOAD,
    STATUS,
    AI_COMMANDER_EDIT_CONFIG_CAPABILITIES,
    AI_COMMANDER_READ_CONFIG_CAPABILITIES,
)
from util.searchinfo_util import searchinfo_from_request
from connection_config_manager.llm.config_manager import ConfigManager

logger = cexc.get_logger(__name__)


class Aicommander(object):
    @classmethod
    def handle_post(cls, request: dict, path_parts: list) -> dict:
        """
        Handles POST requests for LLM connection operations.

        Supports actions via the "action" field in the JSON payload:
          - "refresh_models": Refreshes provider models using legacy service/settings
            payload shape and returns updated_config without persisting.
          - "test_connection": Tests connectivity without persisting anything.
          - "create" (default): Tests connectivity, saves secrets, and persists
            the configuration to the KV store.

        Args:
            request (dict):
                The HTTP request containing the JSON payload.
            path_parts (list):
                The list of path parts from the request URL.

        Returns:
            dict:
                A response dictionary containing:
                - 'payload': A message indicating success or failure.
                - 'status': HTTP status code (200, 400, 403, 409, or 500).
        """
        logger.debug("handle_post called")
        try:
            searchinfo = searchinfo_from_request(
                request, with_admin_token=True, validate_token=True
            )
            is_user_eligible = AICommanderUtil(
                searchinfo=searchinfo
            ).check_capabilities_eligibility_from_search_info(
                required_capabilities=AI_COMMANDER_EDIT_CONFIG_CAPABILITIES
            )
            if not is_user_eligible:
                return {
                    PAYLOAD: {
                        'message': 'User is not eligible to create LLM connections',
                        "status": "fail",
                    },
                    STATUS: 403,
                }

            config = json.loads(request[PAYLOAD])
            action = config.pop("action", "create")
            config_manager = ConfigManager(search_info=searchinfo)

            if action == "refresh_models":
                for field in ["service", "servicesettings"]:
                    if field not in config:
                        return {
                            PAYLOAD: {
                                'message': f"Missing required field: '{field}'.",
                                "status": "fail",
                            },
                            STATUS: 400,
                        }

                config.setdefault("modelsettings", {})
                config.setdefault("model", None)
                config.setdefault("is_upsert", False)

                updated_config = AICommanderUtil(searchinfo=searchinfo).update_conf_file(
                    json.dumps(config)
                )
                return {
                    PAYLOAD: {
                        'message': 'Models refreshed successfully',
                        'updated_config': updated_config,
                        "status": "success",
                    },
                    STATUS: 200,
                }

            if action == "test_connection":
                for field in ["provider", "model", "connection_details"]:
                    if not config.get(field):
                        return {
                            PAYLOAD: {
                                'message': f"Missing required field: '{field}'.",
                                "status": "fail",
                            },
                            STATUS: 400,
                        }

                llm_conn = config_manager.test_llm_connection(
                    provider=config["provider"],
                    model=config["model"],
                    connection_details=config["connection_details"],
                    llm_params=config.get("llm_params", {}),
                    is_custom=config.get("is_custom", False),
                    connection_name=config.get("name", ""),
                )
                if llm_conn.get("status") == "error":
                    return {
                        PAYLOAD: {
                            'message': f"LLM Connection Test Failed: {llm_conn.get('message', 'Unknown error')}",
                            'provider': llm_conn.get('provider'),
                            'model': llm_conn.get('model'),
                            "status": "fail",
                        },
                        STATUS: 500,
                    }
                else:
                    return {
                        PAYLOAD: {
                            'message': 'LLM Connection Test is successful',
                            "status": "success",
                            'provider': llm_conn.get('provider'),
                            'model': llm_conn.get('model'),
                            'response_time': llm_conn.get('response_time'),
                            'response_preview': llm_conn.get('response_content', '')[:100],
                        },
                        STATUS: 200,
                    }

            if config_manager.create_llm_config(config=config):
                return {
                    PAYLOAD: {
                        'message': 'LLM configuration created successfully',
                        "status": "success",
                    },
                    STATUS: 200,
                }
            else:
                return {
                    PAYLOAD: {
                        'message': 'Failed to create LLM configuration',
                        "status": "fail",
                    },
                    STATUS: 500,
                }
        except json.JSONDecodeError:
            return {
                PAYLOAD: {'message': 'Invalid JSON payload.', "status": "fail"},
                STATUS: 400,
            }
        except ValueError as e:
            error_msg = str(e)
            status_code = 409 if 'already exists' in error_msg else 400
            return {
                PAYLOAD: {'message': error_msg, "status": "fail"},
                STATUS: status_code,
            }
        except RuntimeError as e:
            return {
                PAYLOAD: {'message': str(e), "status": "fail"},
                STATUS: 500,
            }
        except Exception as e:
            logger.error(f"Error creating LLM configuration: {str(traceback.format_exc())}")
            return {
                PAYLOAD: {
                    'message': "Failed to create LLM configuration.",
                    "status": "fail",
                },
                STATUS: 500,
            }

    @classmethod
    def handle_get(cls, request: dict, path_parts: list) -> dict:
        """
        Handles the GET request to retrieve AICommander service settings.

        Args:
            request (dict):
                The HTTP request object.
            path_parts (list):
                The list of path parts from the request URL.

        Returns:
            dict:
                A response dictionary containing:
                - 'payload': The AICommander configuration or an error message.
                - 'STATUS': HTTP STATUS code (200 for success, 403 for unauthorized access).
        """
        logger.debug("handle_get called")
        try:
            searchinfo = searchinfo_from_request(
                request, with_admin_token=True, validate_token=True
            )

            is_user_eligible = AICommanderUtil(
                searchinfo=searchinfo
            ).check_capabilities_eligibility_from_search_info(
                AI_COMMANDER_READ_CONFIG_CAPABILITIES
            )

            if not is_user_eligible:
                return {
                    PAYLOAD: {
                        'message': 'User is not eligible to view the AICommander Connection Management Settings',
                        "status": "fail",
                    },
                    STATUS: 403,
                }
            config_manager = ConfigManager(search_info=searchinfo)
            configs = config_manager.list_llm_configs()
            return {
                PAYLOAD: {"data": configs, "status": "success"},
                STATUS: 200,
            }
        except Exception as e:
            logger.error(f"Error retrieving configuration: {str(traceback.format_exc())}")
            return {
                PAYLOAD: {
                    'message': "Failed to retrieve llm configuration.",
                    "status": "fail",
                },
                STATUS: 500,
            }

    @classmethod
    def handle_delete(cls, request: dict, path_parts: list) -> dict:
        """
        Handles the DELETE request to delete a model from AICommander service settings.

        Args:
            request (dict):
                The HTTP request object.
            path_parts (list):
                The list of path parts from the request URL.

        Returns:
            dict:
                A response dictionary containing:
                - 'payload': A message indicating success or failure.
                - 'STATUS': HTTP STATUS code (200 for success, 403 for unauthorized access, 500 for errors).
        """
        logger.debug("handle_delete called")
        try:
            searchinfo = searchinfo_from_request(
                request, with_admin_token=True, validate_token=True
            )
            is_user_eligible = AICommanderUtil(
                searchinfo=searchinfo
            ).check_capabilities_eligibility_from_search_info(
                AI_COMMANDER_EDIT_CONFIG_CAPABILITIES
            )
            if not is_user_eligible:
                return {
                    PAYLOAD: {
                        'message': 'User is not eligible to update the AICommander Connection Management Settings',
                        "status": "fail",
                    },
                    STATUS: 403,
                }
            if len(path_parts) < 2:
                return {
                    PAYLOAD: {
                        'message': "connection name is required to delete.",
                        "status": "fail",
                    },
                    STATUS: 400,
                }
            connection_name = path_parts[1]
            config_manager = ConfigManager(search_info=searchinfo)
            delete_result = config_manager.delete_llm_config(connection_name=connection_name)
            if not delete_result:
                return {
                    PAYLOAD: {
                        'message': 'Failed to delete model',
                        "status": "fail",
                    },
                    STATUS: 500,
                }
            return {
                PAYLOAD: {
                    'message': 'Model deleted successfully',
                    "status": "success",
                },
                STATUS: 200,
            }

        except Exception as e:
            logger.error(
                f"Error deleting model from configuration: {str(traceback.format_exc())}"
            )
            return {
                PAYLOAD: {
                    'message': "Failed to delete model from service settings.",
                    "status": "fail",
                },
                STATUS: 500,
            }

    @classmethod
    def handle_put(cls, request: dict, path_parts: list) -> dict:
        """
        Handles the PUT request to update an existing LLM configuration.

        Args:
            request (dict):
                The HTTP request containing the payload with updated configuration.
            path_parts (list):
                The list of path parts from the request URL.

        Returns:
            dict:
                A response dictionary containing:
                - 'payload': A message indicating success or failure.
                - 'STATUS': HTTP STATUS code (200 for success, 403 for unauthorized access, 500 for errors).
        """
        logger.debug("handle_put called")
        try:
            searchinfo = searchinfo_from_request(
                request, with_admin_token=True, validate_token=True
            )
            is_user_eligible = AICommanderUtil(
                searchinfo=searchinfo
            ).check_capabilities_eligibility_from_search_info(
                AI_COMMANDER_EDIT_CONFIG_CAPABILITIES
            )
            if not is_user_eligible:
                return {
                    PAYLOAD: {
                        'message': 'User is not eligible to update the AICommander Connection Management Settings',
                        "status": "fail",
                    },
                    STATUS: 403,
                }

            config = json.loads(request[PAYLOAD])
            config_manager = ConfigManager(search_info=searchinfo)
            update_result = config_manager.update_llm_config(config=config)

            if not update_result:
                return {
                    PAYLOAD: {
                        'message': 'Failed to update LLM configuration',
                        "status": "fail",
                    },
                    STATUS: 500,
                }

            return {
                PAYLOAD: {
                    'message': 'LLM configuration updated successfully',
                    "status": "success",
                },
                STATUS: 200,
            }

        except Exception as e:
            logger.error(f"Error updating LLM configuration: {str(traceback.format_exc())}")
            return {
                PAYLOAD: {
                    'message': "Failed to update LLM configuration.",
                    "status": "fail",
                },
                STATUS: 500,
            }
