"""
REST handler for `agents` command
"""

import traceback
import json
import cexc
from util.searchinfo_util import searchinfo_from_request
from ai_commander.constants import (
    PAYLOAD,
    STATUS,
    AGENT_RUN_CAPABILITIES,
)
from ai_commander.ai_commander_util import AICommanderUtil
from agent_manager.agent_manager import AgentManager
from splunklib.client import Service
from urllib.parse import urlparse
import time

logger = cexc.get_logger(__name__)


class Agents(object):
    @classmethod
    def _create_splunk_service(cls, searchinfo: dict) -> Service:
        """Creates a Splunk Service instance from searchinfo."""
        session_key = searchinfo.get("admin_session_key")
        splunkd_uri = searchinfo.get("splunkd_uri")

        if not session_key or not splunkd_uri:
            raise ValueError("session_key and splunkd_uri are required in searchinfo")

        parsed_uri = urlparse(splunkd_uri)
        host = parsed_uri.hostname
        port = parsed_uri.port

        if not host or not port:
            raise ValueError(f"Invalid splunkd_uri format: {splunkd_uri}")

        service = Service(
            token=session_key,
            host=host,
            port=port,
        )
        return service

    @classmethod
    def _dispatch_agent_status_job(cls, searchinfo: dict, agent_name: str, action: str) -> str:
        """
        Dispatches a search job with the agent_status command.

        Args:
            searchinfo (dict): Search information containing credentials.
            agent_name (str): The name of the agent.
            action (str): The action to perform ('create' or 'delete').

        Returns:
            str: The search job ID (sid).
        """
        service = cls._create_splunk_service(searchinfo)
        user_name = searchinfo.get("username", "admin")

        # Build the search query - need to provide input data for chunked command
        # Using makeresults to create a single dummy event
        search_query = f'| makeresults | agentstatus agent_name={agent_name} action={action} user_name={user_name}'

        # Dispatch the search job with lower priority to reduce search head overhead
        # exec_mode="normal" ensures the job runs in normal mode (asynchronous)
        # priority=3 sets lower priority (default is 5) so user searches take precedence
        # auto_cancel=0 prevents automatic cancellation
        # auto_pause=0 prevents automatic pausing
        # auto_finalize_ec=0 prevents early job finalization
        kwargs = {
            "exec_mode": "normal",  # Run in normal mode (asynchronous)
            "priority": 3,  # Lower priority to reduce immediate search head load
            "auto_cancel": 0,  # Don't auto-cancel the job
            "auto_pause": 0,  # Don't auto-pause the job
            "auto_finalize_ec": 0,  # Don't finalize early event count
        }

        job = service.jobs.create(search_query, **kwargs)

        logger.info(
            f"Dispatched agent_status job: {job.sid} for agent: {agent_name}, action: {action}"
        )

        return job.sid

    @classmethod
    def handle_post(cls, request: dict, path_parts: list) -> dict:
        """Handles the POST request for creating agents."""
        start_time = time.time()
        searchinfo = searchinfo_from_request(
            request, with_admin_token=True, validate_token=True
        )
        try:
            is_user_eligible = AICommanderUtil(
                searchinfo=searchinfo
            ).check_capabilities_eligibility_from_search_info(
                required_capabilities=AGENT_RUN_CAPABILITIES
            )
            if not is_user_eligible:
                return {
                    PAYLOAD: {
                        'error_message': 'User is not authorized to manage agents. Missing required capabilities.'
                    },
                    STATUS: 403,
                }
            agent_manager = AgentManager(searchinfo)
            request_payload = json.loads(request[PAYLOAD])

            # Create agent in KV store
            is_created = agent_manager.create_agent(request_payload)

            if not is_created:
                return {
                    PAYLOAD: {
                        'message': 'Failed to create agent',
                        'status': 'error',
                    },
                    STATUS: 500,
                }

            agent_name = request_payload.get("name")

            # Dispatch the agent_status search job
            try:
                job_id = cls._dispatch_agent_status_job(searchinfo, agent_name, "create")
            except Exception as e:
                logger.error(f"Failed to dispatch agent_status job: {str(e)}")
                # Agent is created but job dispatch failed
                return {
                    PAYLOAD: {
                        'message': 'Agent created but failed to dispatch status job',
                        'status': 'partial_success',
                        'agent_name': agent_name,
                        'error': 'Failed to dispatch agent_status job. Agent runtime status will not be tracked.',
                    },
                    STATUS: 500,
                }

            response_data = {
                "agent_name": agent_name,
                "runtime_type": request_payload.get("runtime_type", "AWS_AGENT_CORE"),
                "tracking_job_id": job_id,
            }
            end_time = time.time()
            total_request_time = end_time - start_time
            logger.info(
                f"Agent creation request for '{agent_name}' processed in {total_request_time:.3f}s"
            )
            return {
                PAYLOAD: response_data,
                STATUS: 200,
            }

        except Exception as e:
            logger.error(f"Error creating agent: {str(traceback.format_exc())}")
            return {
                PAYLOAD: {
                    'error_message': 'Error creating agent. Internal Server Error occurred.'
                },
                STATUS: 500,
            }

    @classmethod
    def handle_get(cls, request: dict, path_parts: list) -> dict:
        """
        Handles GET requests for listing agents or retrieving a specific agent.

        Endpoints:
            GET /services/mltk/agents - List all agents
            GET /services/mltk/agents?name=<agent_name> - Get specific agent

        Query Parameters:
            - name (str, optional): Agent name to retrieve specific agent

        Returns:
            200: Success with agent(s) data in format matching create_agent response
            404: Agent not found (when name specified)
            500: Internal server error
        """
        import time

        handle_get_start = time.time()
        searchinfo = searchinfo_from_request(request, validate_token=True)

        try:
            if len(path_parts) > 1:
                name = path_parts[1]
                logger.info(f"[handle_get] Got name from path: '{name}'")
            else:
                # Parse query parameters safely
                query_params = request.get('query', {}) or {}
                logger.info(f"[handle_get] request.query: {query_params}")

                name = ''
                if query_params and 'name' in query_params:
                    name_value = query_params.get('name')
                    if isinstance(name_value, list):
                        name = name_value[0] if name_value else ''
                    else:
                        name = str(name_value) if name_value else ''

                logger.info(f"[handle_get] extracted name from query: '{name}'")
            agent_manager_init_start = time.time()
            agent_manager = AgentManager(searchinfo)
            logger.info(
                f"[handle_get] AgentManager init took {time.time() - agent_manager_init_start:.3f}s"
            )

            if name:
                # Get specific agent by name
                get_agent_start = time.time()
                agent_doc = agent_manager.get_agent(name)
                logger.info(f"[handle_get] get_agent took {time.time() - get_agent_start:.3f}s")
                if not agent_doc:
                    return {
                        PAYLOAD: {'error_message': f"Agent '{name}' not found"},
                        STATUS: 404,
                    }

                # Transform to match create_agent response format
                details = agent_doc.get("details", {}) or {}
                agent_response = {
                    "agent_name": agent_doc.get("name", ""),
                    "runtime_type": details.get("runtime_type", "AWS_AGENT_CORE"),
                    "tracking_job_id": None,  # Only available during creation
                    "versions": details.get("versions", []),
                }

                logger.info(
                    f"[handle_get] Total time for single agent: {time.time() - handle_get_start:.3f}s"
                )
                return {PAYLOAD: agent_response, STATUS: 200}
            else:
                # List all agents
                list_agents_start = time.time()
                agents = agent_manager.list_agents()
                logger.info(
                    f"[handle_get] list_agents took {time.time() - list_agents_start:.3f}s"
                )
                logger.info(
                    f"[handle_get] Total time for listing agents: {time.time() - handle_get_start:.3f}s"
                )
                return {PAYLOAD: {"agents": agents, "count": len(agents)}, STATUS: 200}

        except Exception as e:
            logger.error(f"Error listing agents: {str(traceback.format_exc())}")
            return {
                PAYLOAD: {
                    'error_message': 'Error listing agents. Internal Server Error occurred.'
                },
                STATUS: 500,
            }

    @classmethod
    def handle_delete(cls, request: dict, path_parts: list) -> dict:
        """Handles the DELETE request for agents."""

        try:
            searchinfo = searchinfo_from_request(
                request, with_admin_token=True, validate_token=True
            )
            # Extract agent_name from path_parts
            # Expected path: /agents/<agent_name>
            if len(path_parts) < 2:
                return {
                    PAYLOAD: {'error_message': 'Agent name is required in the path.'},
                    STATUS: 400,
                }
            agent_name = path_parts[1]

            is_user_eligible = AICommanderUtil(
                searchinfo=searchinfo
            ).check_capabilities_eligibility_from_search_info(
                required_capabilities=AGENT_RUN_CAPABILITIES
            )
            if not is_user_eligible:
                return {
                    PAYLOAD: {
                        'error_message': 'User is not authorized to manage agents. Missing required capabilities.'
                    },
                    STATUS: 403,
                }
            agent_manager = AgentManager(searchinfo)
            runtime_ok, runtime_status = agent_manager.delete_agent(
                agent_name, notify_runtime=True
            )
            if not runtime_ok:
                return {
                    PAYLOAD: {
                        'message': 'Failed to delete agent runtime',
                        'status': 'error',
                    },
                    STATUS: 500,
                }

            tracking_job_id = cls._dispatch_agent_status_job(searchinfo, agent_name, "delete")
            return {
                PAYLOAD: {
                    'message': f'Agent {agent_name} deletion initiated',
                    'status': 'DELETING',
                    'tracking_job_id': tracking_job_id,
                },
                STATUS: 200,
            }
        except Exception as e:
            logger.error(f"Error deleting agent: {str(traceback.format_exc())}")
            return {
                PAYLOAD: {
                    'error_message': 'Error deleting agent. Internal Server Error occurred.'
                },
                STATUS: 500,
            }

    @classmethod
    def handle_put(cls, request: dict, path_parts: list) -> dict:
        """Handles the PUT request for updating agents."""
        searchinfo = searchinfo_from_request(
            request, with_admin_token=True, validate_token=True
        )

        try:
            # Extract agent_name from path_parts
            is_user_eligible = AICommanderUtil(
                searchinfo=searchinfo
            ).check_capabilities_eligibility_from_search_info(
                required_capabilities=AGENT_RUN_CAPABILITIES
            )
            if not is_user_eligible:
                return {
                    PAYLOAD: {
                        'error_message': 'User is not authorized to manage agents. Missing required capabilities.'
                    },
                    STATUS: 403,
                }
            agent_manager = AgentManager(searchinfo)
            request_payload = json.loads(request[PAYLOAD])
            agent_name = request_payload.get("name")
            current_agent = agent_manager.get_agent(agent_name)
            if not current_agent:
                return {
                    PAYLOAD: {'error_message': f"Agent '{agent_name}' not found"},
                    STATUS: 404,
                }
            username = searchinfo.get("username", "system")
            now = time.time()
            current_agent["description"] = request_payload.get(
                "description", current_agent.get("description")
            )
            current_agent["details"]["versions"][0]["description"] = request_payload.get(
                "description", current_agent["details"]["versions"][0].get("description", "")
            )
            current_agent["details"]["versions"][0]["is_enabled"] = request_payload.get(
                "is_enabled", current_agent["details"]["versions"][0].get("is_enabled", True)
            )
            current_agent["details"]["versions"][0]["last_updated_by"] = username
            current_agent["details"]["versions"][0]["last_updated_at"] = now
            current_agent["details"]["versions"][0]["llm"] = request_payload.get(
                "llm", current_agent["details"]["versions"][0].get("llm", {})
            )
            current_agent["details"]["versions"][0]["system_prompt"] = request_payload.get(
                "system_prompt",
                current_agent["details"]["versions"][0].get("system_prompt", None),
            )
            current_agent["details"]["versions"][0]["tools"]["mcps"] = request_payload.get(
                "mcps", current_agent["details"]["versions"][0]["tools"].get("mcps", [])
            )
            current_agent["details"]["versions"][0]["tools"][
                "knowledge_bases"
            ] = request_payload.get(
                "knowledge_bases",
                current_agent["details"]["versions"][0]["tools"].get("knowledge_bases", []),
            )
            current_agent["details"]["versions"][0]["acl"]["sharing"] = request_payload[
                "acl"
            ].get(
                "sharing", current_agent["details"]["versions"][0]["acl"].get("sharing", "app")
            )
            current_agent["details"]["versions"][0]["acl"]["perms"]["read"] = (
                request_payload["acl"]
                .get("perms", {})
                .get(
                    "read",
                    current_agent["details"]["versions"][0]["acl"]
                    .get("perms", {})
                    .get("read", []),
                )
            )
            current_agent["details"]["versions"][0]["acl"]["perms"]["write"] = (
                request_payload["acl"]
                .get("perms", {})
                .get(
                    "write",
                    current_agent["details"]["versions"][0]["acl"]
                    .get("perms", {})
                    .get("write", []),
                )
            )
            current_agent["details"]["versions"][0]["task_prompt"] = request_payload.get(
                "task_prompt",
                current_agent["details"]["versions"][0].get("task_prompt", ""),
            )
            current_agent["details"]["versions"][0]["agent_timeout"] = request_payload.get(
                "agent_timeout",
                current_agent["details"]["versions"][0].get("agent_timeout", 300),
            )
            is_updated = agent_manager.update_agent(current_agent)
            if is_updated:
                return {
                    PAYLOAD: {
                        'message': f'Agent "{agent_name}" updated successfully',
                        'status': 'success',
                    },
                    STATUS: 200,
                }
            return {
                PAYLOAD: {
                    'message': 'Failed to update agent',
                    'status': 'error',
                },
                STATUS: 500,
            }
        except Exception as e:
            logger.error(f"Error updating agent: {str(traceback.format_exc())}")
            return {
                PAYLOAD: {
                    'error_message': "Error updating agent. Internal Server Error occurred."
                },
                STATUS: 500,
            }
