"""
A handler for exposing list connections API for LLM, MCP, KB, and container connections.
"""

import json
from operator import itemgetter
from util.searchinfo_util import searchinfo_from_request
from util.conf_loader import RestLoadingStrategy
import cexc
from util.rest_url_util import get_user_capabilities
from ai_commander.constants import (
    CONTAINER_CONNECTION_CAPABILITIES,
    DEFAULT_ACCESS_TOKEN,
    KB_CONNECTION_CAPABILITIES,
    LLM_CONNECTION_CAPABILITIES,
    MCP_CONNECTION_CAPABILITIES,
    SPLUNK_HOSTED_LLM,
)
from connection_config_manager.llm.config_manager import ConfigManager as LLMConfigManager
from connection_config_manager.vector_db.config_manager import (
    ConfigManager as VectorStoreConfigManager,
)

logger = cexc.get_logger(__name__)

DOCKER_DSDL_CAPABILITIES = CONTAINER_CONNECTION_CAPABILITIES
KUBERNETES_DSDL_CAPABILITIES = CONTAINER_CONNECTION_CAPABILITIES
LLM_CAPABILITIES = LLM_CONNECTION_CAPABILITIES
MCP_CAPABILITIES = MCP_CONNECTION_CAPABILITIES
KB_CAPABILITIES = KB_CONNECTION_CAPABILITIES

DSDL_CONNECTION_MANAGEMENT_FILE = "container_connections"
DOCKER_STANZA = "docker"
KUBERNETES_STANZA = "kubernetes"


class ListConnections(object):
    @staticmethod
    def has_container_connection(connection: dict) -> bool:
        if not isinstance(connection, dict):
            return False

        connection_name = connection.get("connection_name")
        return bool(str(connection_name).strip()) if connection_name is not None else False

    @classmethod
    def handle_get(cls, request, path_parts):
        """
        Handles GET requests

        Args:
            request: a dictionary providing information about the request
            path_parts: a list of strings describing the request path
        """

        try:
            searchinfo = searchinfo_from_request(request)

            splunkd_uri, token, user = itemgetter(*["splunkd_uri", "session_key", "username"])(
                searchinfo
            )

            try:
                capabilities = get_user_capabilities(splunkd_uri, token, username=user)
            except Exception as e:
                logger.error("Error getting user capabilities: {}".format(e))
                return ListConnections.get_failure_response(
                    500, message="Error in getting user capabilities."
                )

            some_capability_matched = False
            llm_success = mcp_success = kb_success = docker_success = kubernetes_success = True
            connections = []

            if len(LLM_CAPABILITIES) == 0 or all(
                item in capabilities for item in LLM_CAPABILITIES
            ):
                some_capability_matched = True
                try:
                    llm_configs = ListConnections.list_llm_configs(searchinfo)
                    connections.extend(llm_configs)

                except Exception as e:
                    llm_success = False
                    logger.error("Error getting LLM configurations: {}".format(e))

            if len(MCP_CAPABILITIES) == 0 or all(
                item in capabilities for item in MCP_CAPABILITIES
            ):
                some_capability_matched = True
                try:
                    from connection_config_manager.mcp.mcp_util import MCPConnectionManager

                    mcp_manager = MCPConnectionManager(searchinfo)
                    mcp_configs = mcp_manager.list_mcp_connections(include_tokens=False)
                    connections.extend(mcp_configs)
                except Exception as e:
                    mcp_success = False
                    logger.error("Error getting MCP connections: {}".format(e))

            if len(KB_CAPABILITIES) == 0 or all(
                item in capabilities for item in KB_CAPABILITIES
            ):
                some_capability_matched = True
                try:
                    kb_manager = VectorStoreConfigManager(searchinfo)
                    kb_configs = kb_manager.get_config()
                    for kb_config in kb_configs:
                        kb_config.pop("_key", None)
                        kb_config.pop("_user", None)
                        ListConnections.mask_kb_secrets(kb_config)
                    connections.extend(kb_configs)
                except Exception as e:
                    kb_success = False
                    logger.error("Error getting knowledge base connections: {}".format(e))

            conf_loader = None
            should_load_container_connections = any(
                [
                    len(DOCKER_DSDL_CAPABILITIES) == 0
                    or all(item in capabilities for item in DOCKER_DSDL_CAPABILITIES),
                    len(KUBERNETES_DSDL_CAPABILITIES) == 0
                    or all(item in capabilities for item in KUBERNETES_DSDL_CAPABILITIES),
                ]
            )

            if should_load_container_connections:
                try:
                    conf_loader = RestLoadingStrategy(
                        conf_name=DSDL_CONNECTION_MANAGEMENT_FILE, searchinfo=searchinfo
                    )
                except Exception as e:
                    docker_success = False
                    kubernetes_success = False
                    logger.error("Error initializing conf loader: {}".format(e))

            if len(DOCKER_DSDL_CAPABILITIES) == 0 or all(
                item in capabilities for item in DOCKER_DSDL_CAPABILITIES
            ):
                some_capability_matched = True
                try:
                    if conf_loader is None:
                        raise RuntimeError("Container configuration loader is not available.")

                    docker_info = ListConnections.load_container_connection(
                        conf_loader=conf_loader,
                        stanza_name=DOCKER_STANZA,
                        connection_type="docker",
                    )
                    if docker_info:
                        connections.append(docker_info)
                except Exception as e:
                    docker_success = False
                    logger.error("Error getting Docker info from configuration: {}".format(e))

            if len(KUBERNETES_DSDL_CAPABILITIES) == 0 or all(
                item in capabilities for item in KUBERNETES_DSDL_CAPABILITIES
            ):
                some_capability_matched = True
                try:
                    if conf_loader is None:
                        raise RuntimeError("Container configuration loader is not available.")

                    kubernetes_info = ListConnections.load_container_connection(
                        conf_loader=conf_loader,
                        stanza_name=KUBERNETES_STANZA,
                        connection_type="kubernetes",
                    )
                    if kubernetes_info:
                        connections.append(kubernetes_info)
                except Exception as e:
                    kubernetes_success = False
                    logger.error(
                        "Error getting Kubernetes info from configuration: {}".format(e)
                    )

            # User does not have any of the required capabilities
            if not some_capability_matched:
                return ListConnections.get_failure_response(
                    403, message="User does not have permissions to view any connections."
                )

            # User has some capability matched, but all fetches failed
            if not (
                llm_success or mcp_success or kb_success or docker_success or kubernetes_success
            ):
                return ListConnections.get_failure_response(
                    500, message="Error in fetching connection details."
                )

            # All checks pass
            return ListConnections.get_success_response(200, result=connections)

        except Exception as e:
            logger.error(f"Error processing request: {str(e)}")
            return ListConnections.get_failure_response(500, message=f"Internal Server Error")

    @staticmethod
    def get_saved_providers(provider_info):
        provider_config = provider_info[1]
        try:
            return provider_config.get('is_saved', {}).get("value", False)
        except Exception as e:
            logger.error("Error in fetching saved provider info: {}".format(e))
            return False

    @staticmethod
    def get_saved_models(models_info):
        model_config = models_info[1]
        try:
            return model_config.get('is_model_saved', {}).get("value", False)
        except Exception as e:
            logger.error("Error in fetching saved model info: {}".format(e))
            return False

    @staticmethod
    def get_success_response(status_code, **kwargs):
        return {'payload': {"status": "success", **kwargs}, 'status': status_code}

    @staticmethod
    def get_failure_response(status_code, **kwargs):
        return {'payload': {"status": "failure", **kwargs}, 'status': status_code}

    @staticmethod
    def remove_fields(connection):
        fields_to_remove = ["disabled", "eai:acl", "eai:appName", "eai:userName"]
        for field in fields_to_remove:
            connection.pop(field, None)
        return connection

    @staticmethod
    def list_llm_configs(searchinfo):
        llm_manager = LLMConfigManager(search_info=searchinfo)
        return llm_manager.list_llm_configs()

    @staticmethod
    def mask_kb_secrets(config):
        if config.get("type") != 'AWS_KB':
            return
        details = config.get("details", {})
        details["aws_access_key_id"] = DEFAULT_ACCESS_TOKEN
        details["aws_access_key_token"] = DEFAULT_ACCESS_TOKEN
        details["role_arn"] = DEFAULT_ACCESS_TOKEN
        details.pop("secrets", None)

    @staticmethod
    def load_container_connection(conf_loader, stanza_name, connection_type):
        response = conf_loader.load_container_conf(stanza_name=stanza_name)
        response_json = json.loads(response["content"])

        if len(response_json.get("entry", [])) == 0:
            return None

        container_entry = response_json["entry"][0]
        container_info = container_entry.get("content", {})
        container_info["acl"] = container_entry.get("acl", {})
        container_info = ListConnections.remove_fields(container_info)

        if not ListConnections.has_container_connection(container_info):
            return None

        container_info["connection_type"] = connection_type
        return container_info
