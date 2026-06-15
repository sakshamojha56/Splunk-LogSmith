"""
REST Handler for MCP Connection Management
Provides CRUD APIs for MCP connections
"""

import json
import traceback
import cexc
from connection_config_manager.mcp.mcp_util import MCPConnectionManager
from ai_commander.ai_commander_util import AICommanderUtil
from connection_config_manager.mcp.constants import (
    DETAILS,
    TOKEN,
    CLIENT_ID,
    CLIENT_SECRET,
    REFRESH_TOKEN,
)
from ai_commander.constants import (
    AGENT_CONNECTION_CAPABILITIES,
    PAYLOAD,
    STATUS,
    DEFAULT_TOKEN,
    AGENT_RUN_CAPABILITIES,
)
from util.searchinfo_util import searchinfo_from_request

logger = cexc.get_logger(__name__)


class McpConnection:
    """
    REST Handler for MCP connection management

    Endpoints:
        POST   /services/mltk/mcp_connection - Create new MCP connection
        GET    /services/mltk/mcp_connection - List all MCP connections
        PUT    /services/mltk/mcp_connection - Update existing MCP connection
        DELETE /services/mltk/mcp_connection/<name> - Delete MCP connection
        POST   /services/mltk/mcp_connection/test - Test MCP connection
        POST   /services/mltk/mcp_connection/tools - List tools from MCP server
    """

    @classmethod
    def _remove_secrets(cls, config: dict) -> None:
        """Removes sensitive information from the configuration."""
        if DETAILS in config:
            if TOKEN in config[DETAILS]:
                config[DETAILS][TOKEN] = DEFAULT_TOKEN
            if CLIENT_ID in config[DETAILS]:
                config[DETAILS][CLIENT_ID] = DEFAULT_TOKEN
            if CLIENT_SECRET in config[DETAILS]:
                config[DETAILS][CLIENT_SECRET] = DEFAULT_TOKEN
            if REFRESH_TOKEN in config[DETAILS]:
                config[DETAILS][REFRESH_TOKEN] = DEFAULT_TOKEN

    @classmethod
    def handle_post(cls, request: dict, path_parts: list) -> dict:
        """
        Route POST requests based on path
        - /mcp_connection -> Create new connection
        - /mcp_connection/test -> Test connection (dual-mode: KV Store or Form)
        - /mcp_connection/tools -> List tools from MCP server
        """
        searchinfo = searchinfo_from_request(
            request, with_admin_token=True, validate_token=True
        )
        # Check if this is a special endpoint
        if len(path_parts) >= 2:
            action = path_parts[1]
            if action == 'test':
                return cls._handle_test_connection(request, path_parts, searchinfo)
            elif action == 'tools':
                return cls._handle_list_tools(request, path_parts, searchinfo)

        is_user_eligible = AICommanderUtil(
            searchinfo=searchinfo
        ).check_capabilities_eligibility_from_search_info(
            required_capabilities=AGENT_CONNECTION_CAPABILITIES
        )
        if not is_user_eligible:
            return {
                PAYLOAD: {
                    'error_message': 'User is not authorized to manage MCP connections. Missing required capabilities.'
                },
                STATUS: 403,
            }

        # Default: Create new MCP connection
        return cls._handle_create(request, path_parts, searchinfo)

    @classmethod
    def _handle_create(cls, request: dict, path_parts: list, searchinfo: dict) -> dict:
        """
        Create a new MCP connection
        """
        try:
            manager = MCPConnectionManager(searchinfo)
            request_payload = json.loads(request[PAYLOAD])
            is_created = manager.create_config(request_payload)
            if is_created:
                # Mask secrets before returning
                cls._remove_secrets(request_payload)
                return {
                    PAYLOAD: {
                        'message': f"MCP connection '{request_payload.get('name')}' created successfully",
                        'status': 'success',
                        'config': request_payload,
                    },
                    STATUS: 200,
                }
            return {
                PAYLOAD: {
                    'message': 'Failed to create MCP connection',
                    'status': 'error',
                },
                STATUS: 500,
            }
        except ValueError as e:
            error_msg = str(e)
            logger.error(f"Validation error: {error_msg}")
            # Return 409 Conflict for duplicate name, 400 for other validation errors
            if 'already exists' in error_msg:
                return {
                    PAYLOAD: {'error_message': 'MCP connection already exists'},
                    STATUS: 409,
                }
            return {
                PAYLOAD: {'error_message': 'Invalid MCP connection parameters'},
                STATUS: 400,
            }
        except Exception as e:
            logger.error("Error creating MCP connection.")
            logger.error(traceback.format_exc())
            return {PAYLOAD: {'error_message': 'Error in creating MCP Connection'}, STATUS: 500}

    @classmethod
    def handle_get(cls, request: dict, path_parts: list) -> dict:
        """
        List all MCP connections or get a specific one
        """
        searchinfo = searchinfo_from_request(request, validate_token=True)
        try:
            # Get query parameters (comes as dict with list values)
            query_params = request.get('query', {})
            name = query_params.get('name', [''])[0] if 'name' in query_params else ''
            include_tokens = False
            manager = MCPConnectionManager(searchinfo)

            if name:
                # Get specific MCP connection
                result = manager.get_mcp_connection(name, include_token=include_tokens)
                return {PAYLOAD: result, STATUS: 200}
            else:
                # List all MCP connections
                result = manager.list_mcp_connections(include_tokens=include_tokens)
                return {PAYLOAD: result, STATUS: 200}

        except ValueError as e:
            logger.error(f"MCP connection not found: {str(e)}")
            return {PAYLOAD: {'error_message': 'Error listing MCP connections'}, STATUS: 404}
        except Exception as e:
            logger.error(f"Error listing MCP connections: {str(e)}")
            logger.error(traceback.format_exc())
            return {
                PAYLOAD: {
                    'error_message': 'Internal server error while listing MCP connections'
                },
                STATUS: 500,
            }

    @classmethod
    def handle_put(cls, request: dict, path_parts: list) -> dict:
        """
        Update an existing MCP connection
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
                        'error_message': 'User is not authorized to manage MCP connections. Missing required capabilities.'
                    },
                    STATUS: 403,
                }
            manager = MCPConnectionManager(searchinfo)
            request_payload = json.loads(request[PAYLOAD])
            is_updated = manager.update_config(request_payload)
            if is_updated:
                # Mask secrets before returning
                cls._remove_secrets(request_payload)
                return {
                    PAYLOAD: {
                        'message': f"MCP connection '{request_payload.get('name')}' updated successfully",
                        'status': 'success',
                        'config': request_payload,
                    },
                    STATUS: 200,
                }
            return {
                PAYLOAD: {
                    'message': 'Failed to update MCP connection',
                    'status': 'error',
                },
                STATUS: 500,
            }
        except ValueError as e:
            logger.error(f"Validation error: {str(e)}")
            return {PAYLOAD: {'error_message': 'Error updating MCP connection'}, STATUS: 400}
        except Exception as e:
            logger.error(f"Error updating MCP connection: {str(e)}")
            logger.error(traceback.format_exc())
            return {
                PAYLOAD: {
                    'error_message': 'Internal server error while updating MCP connection'
                },
                STATUS: 500,
            }

    @classmethod
    def handle_delete(cls, request: dict, path_parts: list) -> dict:
        """
        Delete an MCP connection
        """
        searchinfo = searchinfo_from_request(
            request, with_admin_token=True, validate_token=True
        )
        try:
            # Extract name from path_parts
            # Expected path: /mcp_connection/<name>
            if len(path_parts) < 2:
                return {
                    PAYLOAD: {'error_message': 'Connection name is required in the path.'},
                    STATUS: 400,
                }

            name = path_parts[1]
            is_user_eligible = AICommanderUtil(
                searchinfo=searchinfo
            ).check_capabilities_eligibility_from_search_info(
                required_capabilities=AGENT_CONNECTION_CAPABILITIES
            )
            if not is_user_eligible:
                return {
                    PAYLOAD: {
                        'error_message': 'User is not authorized to manage MCP connections. Missing required capabilities.'
                    },
                    STATUS: 403,
                }
            manager = MCPConnectionManager(searchinfo)
            is_deleted = manager.delete_config(name)
            if is_deleted:
                return {
                    PAYLOAD: {
                        'message': f"MCP connection '{name}' deleted successfully",
                        'status': 'success',
                    },
                    STATUS: 200,
                }
            return {
                PAYLOAD: {
                    'message': 'Failed to delete MCP connection',
                    'status': 'error',
                },
                STATUS: 500,
            }

        except ValueError as e:
            logger.error("MCP connection not found.")
            return {PAYLOAD: {'error_message': 'MCP connection not found.'}, STATUS: 404}
        except Exception as e:
            logger.error(f"Error deleting MCP connection: {str(e)}")
            logger.error(traceback.format_exc())
            return {PAYLOAD: {'error_message': 'Error deleting MCP connection.'}, STATUS: 500}

    @classmethod
    def _handle_test_connection(cls, request: dict, path_parts: list, searchinfo: dict) -> dict:
        """
        Test MCP server connection with Bearer token (SPLUNK and ATLASSIAN only).

        Supports TWO modes:
        1. KV Store mode: {"name": "connection_name"}
        2. Form mode (before saving): {"url": "...", "token": "...", "type": "...", "name": "..."}

        If name is provided in form mode, will check for duplicates.
        """
        try:
            is_user_eligible = AICommanderUtil(
                searchinfo=searchinfo
            ).check_capabilities_eligibility_from_search_info(
                required_capabilities=AGENT_CONNECTION_CAPABILITIES
            )
            if not is_user_eligible:
                return {
                    PAYLOAD: {
                        'error_message': 'User is not authorized to manage MCP connections. Missing required capabilities.'
                    },
                    STATUS: 403,
                }
            manager = MCPConnectionManager(searchinfo)
            request_payload = json.loads(request[PAYLOAD])

            # Get parameters
            name = request_payload.get('name')
            url = request_payload.get('url')
            token = request_payload.get('token')
            mcp_type = request_payload.get('type')

            # Validate input
            if not name and not (url and token):
                return {
                    PAYLOAD: {
                        "success": False,
                        "status": "error",
                        "message": "Either provide 'name' (for saved connection) OR 'url' + 'token' (for form validation)",
                    },
                    STATUS: 400,
                }

            # Call test_connection with all parameters (name can be passed from form for duplicate check)
            result = manager.test_connection(name=name, url=url, token=token, mcp_type=mcp_type)

            # Check for duplicate name error
            if result.get("data", {}).get("name_exists"):
                return {PAYLOAD: result, STATUS: 409}  # Conflict

            # Check for not found error
            if (
                result.get("status") == "error"
                and "not found" in result.get("message", "").lower()
            ):
                return {PAYLOAD: result, STATUS: 404}

            # Return result with appropriate status
            status_code = 200 if result.get("success") else 500
            return {PAYLOAD: result, STATUS: status_code}

        except Exception as e:
            logger.error(f"Error testing MCP connection: {str(e)}")
            logger.error(traceback.format_exc())
            return {
                PAYLOAD: {
                    "success": False,
                    "status": "error",
                    "message": "Test connection failed",
                },
                STATUS: 500,
            }

    @classmethod
    def _handle_list_tools(cls, request: dict, path_parts: list, searchinfo: dict) -> dict:
        """
        List tools from MCP server (SPLUNK and ATLASSIAN only)
        Returns list of available tools with name and description

        Supports two modes:
        1. KV Store mode: {"name": "connection_name"}
        2. Direct mode: {"url": "...", "token": "..."}
        """
        try:
            is_user_eligible = AICommanderUtil(
                searchinfo=searchinfo
            ).check_capabilities_eligibility_from_search_info(
                required_capabilities=AGENT_CONNECTION_CAPABILITIES
            )
            is_user_eligible = is_user_eligible or AICommanderUtil(
                searchinfo=searchinfo
            ).check_capabilities_eligibility_from_search_info(
                required_capabilities=AGENT_RUN_CAPABILITIES
            )
            if not is_user_eligible:
                return {
                    PAYLOAD: {
                        'error_message': 'User is not authorized to manage MCP connections. Missing required capabilities.'
                    },
                    STATUS: 403,
                }
            manager = MCPConnectionManager(searchinfo)

            # Parse request body
            request_payload = json.loads(request[PAYLOAD])
            name = request_payload.get('name')
            url = request_payload.get('url')
            token = request_payload.get('token')

            # Validate: either name OR (url + token)
            if not name and not (url and token):
                return {
                    PAYLOAD: {
                        'error_message': "Either provide 'name' (for saved connection) OR 'url' + 'token' (for direct access)"
                    },
                    STATUS: 400,
                }

            # List tools
            result = manager.list_tools(name=name, url=url, token=token)

            # Return appropriate status code based on success
            status_code = 200 if result.get('success') else 500

            return {PAYLOAD: result, STATUS: status_code}

        except ValueError as e:
            logger.error("MCP connection not found.")
            return {PAYLOAD: {'error_message': 'MCP connection not found.'}, STATUS: 404}
        except Exception as e:
            logger.error(f"Error listing MCP tools: {str(e)}")
            logger.error(traceback.format_exc())
            return {PAYLOAD: {'error_message': "Error listing MCP tools."}, STATUS: 500}
