from util.base_util import get_system_paths, SUPPORTED_SYSTEMS
import os
import sys

sa_path, system = get_system_paths()

system_path = os.path.join(sa_path, 'bin', '%s' % (SUPPORTED_SYSTEMS[system]))

APP_NAME = f"Splunk_SA_Scientific_Python_{SUPPORTED_SYSTEMS[system]}"
SPLUNK_HOME = os.environ.get('SPLUNK_HOME', '/opt/splunk')
APP_PATH = os.path.join(SPLUNK_HOME, 'etc', 'apps', APP_NAME)

# Dynamically find PSC version with boto3
psc_bin_path = os.path.join(sa_path, 'bin', SUPPORTED_SYSTEMS[system])
psc_version = None
python_version = None

if os.path.exists(psc_bin_path):
    versions = sorted(
        [
            d
            for d in os.listdir(psc_bin_path)
            if os.path.isdir(os.path.join(psc_bin_path, d)) and '_' in d
        ],
        reverse=True,
    )
    for v in versions:
        lib_path = os.path.join(psc_bin_path, v, 'lib')
        if os.path.exists(lib_path):
            # Find any python3.x directory
            python_dirs = [d for d in os.listdir(lib_path) if d.startswith('python3.')]
            for py_dir in sorted(python_dirs, reverse=True):  # prefer newer versions
                test_path = os.path.join(lib_path, py_dir, 'site-packages', 'httpx')
                if os.path.exists(test_path):
                    psc_version = v
                    python_version = py_dir
                    break
            if psc_version:
                break

    # Fallback: use latest version and latest python even without boto3
    if not psc_version and versions:
        psc_version = versions[0]
        lib_path = os.path.join(psc_bin_path, psc_version, 'lib')
        if os.path.exists(lib_path):
            python_dirs = [d for d in os.listdir(lib_path) if d.startswith('python3.')]
            python_version = (
                sorted(python_dirs, reverse=True)[0] if python_dirs else 'python3.9'
            )

PSC_SITE_PACKAGES = (
    os.path.join(psc_bin_path, psc_version, 'lib', python_version, 'site-packages')
    if psc_version and python_version
    else None
)
# Insert PSC site-packages at the beginning to ensure we use PSC's boto3
if PSC_SITE_PACKAGES and os.path.exists(PSC_SITE_PACKAGES):
    sys.path.insert(0, PSC_SITE_PACKAGES)


from util.ai_commander_util import (
    get_scs_api_base_url,
    get_raw_document_from_kv_store,
    get_raw_documents_from_kv_store,
    get_cached_scs_token,
    upsert_single_document_into_kv_store,
    delete_document_from_kv_store,
)

from util.error_util import CustomMLTKError
from typing import Optional
import traceback
import time
import json
import cexc
import uuid
import httpx
import http.client as http_client
from connection_config_manager.utils.common_utils import CommonUtils
from agent_manager.common_utils import get_total_tools_count
from util.telemetry_agent_util import log_agent_action_details
from util.sagemaker_util_extensions import get_aitk_app_version

logger = cexc.get_logger(__name__)
http_client.HTTPConnection.debuglevel = 1
ssl_cert_file = os.environ.get("SSL_CERT_FILE")
if ssl_cert_file and not os.path.exists(ssl_cert_file):
    logger.warning(
        f"Environment variable SSL_CERT_FILE is set to a non-existent path: {ssl_cert_file}. "
        "Removing it to prevent SSL errors."
    )
    os.environ.pop("SSL_CERT_FILE")


class AgentManager:
    COLLECTION_NAME = "aitk_agent_collection"

    def __init__(self, search_info: dict) -> None:
        self.search_info = search_info
        self.common_utils = CommonUtils(search_info, is_mlspl_load=False)

    @staticmethod
    def get_collection_name() -> str:
        return AgentManager.COLLECTION_NAME

    def get_agent(self, agent_name: str, is_auth_by_pass=False) -> Optional[dict]:
        query = {"name": agent_name}
        document = get_raw_document_from_kv_store(
            search_info=self.search_info,
            collection_name=self.COLLECTION_NAME,
            query=json.dumps(query),
        )
        if not document:
            return None
        is_user_authorized = self.common_utils.is_user_eligible_by_role(
            acl=document[0].get("details", {}).get("versions", [])[0].get("acl", {}),
            action="read",
        )
        if not is_auth_by_pass and not is_user_authorized:
            raise CustomMLTKError(f"User is not authorized to access agent '{agent_name}'.")
        return document[0]

    def create_agent(self, request: dict) -> bool:
        """
        Creates a new agent in the KV store.

        Args:
            request (dict): The agent data to create. Must contain 'name' field.
                Expected format:
                {
                    "name": "agent_name",
                    "system_prompt": "...",
                    "description": "...",
                    "mcps": [...],
                    "knowledge_bases": [...],
                    "llm": {"provider": "...", "model": "..."}
                }

        Returns:
            bool: True if the agent was successfully created, False otherwise.

        Raises:
            CustomMLTKError: If an agent with the same name already exists.
        """
        name = request.get("name")
        logger.info(f"[CREATE_AGENT] Starting agent creation for: {name}")

        # Step 1: Check if agent already exists
        query = json.dumps({"name": name})
        existing_record = get_raw_document_from_kv_store(
            search_info=self.search_info,
            collection_name=self.COLLECTION_NAME,
            query=query,
        )

        if existing_record:
            raise CustomMLTKError(f"Agent with name '{name}' already exists.")

        now = time.time()
        username = self.search_info.get("username", "system")
        request_id = str(uuid.uuid4())
        app_version = get_aitk_app_version()
        document = {
            "name": name,
            "description": request.get("description", ""),
            "runtime_type": request.get("runtime_type", "AWS_AGENT_CORE"),
            "details": {
                "versions": [
                    {
                        "version": 0,
                        "state": "Creating",
                        "created_at": now,
                        "last_updated_at": now,
                        "created_by": username,
                        "last_updated_by": username,
                        "app_version": app_version,
                        "system_prompt": (
                            request.get("system_prompt")
                            if request.get("system_prompt")
                            else "You are a helpful assistant."
                        ),
                        "task_prompt": request.get("task_prompt"),
                        "description": request.get("description", ""),
                        "is_enabled": True,
                        "runtime_params": {"runtime_id": "", "version": ""},
                        "tools": {
                            "mcps": request.get("mcps", []),
                            "knowledge_bases": request.get("knowledge_bases", []),
                        },
                        "llm": request.get("llm", {}),
                        "acl": {
                            "sharing": "owner",
                            "app": "SPLUNK_ML_TOOLKIT",
                            "owner": username,
                            "perms": {"read": [], "write": []},
                        },
                        "agent_timeout": request.get("agent_timeout", 450),
                    }
                ],
            },
        }

        logger.debug(f"Creating agent: {name}")

        scs_token, scs_token_expiry = get_cached_scs_token(None, None, self.search_info)
        scs_url_base = get_scs_api_base_url(self.search_info)
        scs_url = f"{scs_url_base}/agent/aws_agentcore"

        headers = {
            "Authorization": f"Bearer {scs_token}",
            "Content-Type": "application/json",
            "request_id": request_id,
        }

        request_payload = {
            "agent_name": name,
            "app_version": app_version,
        }

        try:
            # Step 3: Notify SCS to create runtime
            logger.debug(f"Notifying SCS with url: {scs_url}")
            response = httpx.post(scs_url, headers=headers, json=request_payload, timeout=600)
            logger.debug(f"response from scs: {response}")

            result = response.json()
            if response.status_code not in [200, 201]:
                logger.warning(
                    f"Status code {response.status_code} detected, deleting agent: {name}"
                )
                logger.error(f"Failed to notify SCS for agent creation: {result}")
                return False
            logger.info(f"Successfully notified SCS for agent creation: {result}")
            document["details"]["versions"][0]["runtime_params"]["runtime_id"] = result.get(
                "runtime_id"
            )
            document["details"]["versions"][0]["runtime_params"]["version"] = result.get(
                "version"
            )

            # Step 4: Insert agent into KV store
            upsert_single_document_into_kv_store(
                search_info=self.search_info,
                collection_name=self.COLLECTION_NAME,
                document=document,
                with_admin_token=True,
            )

            log_agent_action_details(
                str(uuid.uuid4()),
                "create",
                name,
                get_total_tools_count(document["details"]["versions"][0]),
                "success",
            )

        except httpx.TimeoutException as e:
            logger.error(f"[CREATE_AGENT] Timeout while notifying SCS: {str(e)}")
            return False
        except Exception as e:
            traceback_str = traceback.format_exc()
            logger.error(
                f"[CREATE_AGENT] Agent creation failed for {name}: {str(e)}\n{traceback_str}"
            )
            return False

        return True

    def update_agent(self, agent: dict, is_auth_by_pass=False, with_admin_token=True) -> bool:
        """
        Updates an existing agent in the KV store.

        Args:
            agent (dict): The agent data to update. Must contain 'name' field.

        Returns:
            bool: True if the agent was successfully updated, False otherwise.

        Raises:
            CustomMLTKError: If the agent does not exist.
        """
        name = agent.get("name")
        query = json.dumps({"name": name})
        existing_record = get_raw_document_from_kv_store(
            search_info=self.search_info,
            collection_name=self.COLLECTION_NAME,
            query=query,
        )
        if not existing_record:
            raise CustomMLTKError(f"Agent with name '{name}' does not exist.")

        is_user_authorized = self.common_utils.is_user_eligible_by_role(
            acl=existing_record[0].get("details", {}).get("versions", [])[0].get("acl", {}),
            action="write",
        )
        if not is_auth_by_pass and not is_user_authorized:
            raise CustomMLTKError(f"User is not authorized to update agent '{name}'.")

        existing_record = existing_record[0]
        existing_key = existing_record.get("_key")

        # Prepare document for KV store update
        document = {
            "name": agent.get("name"),
            "description": agent.get("description", existing_record.get("description", "")),
            "runtime_type": agent.get("runtime_type", existing_record.get("runtime_type", "")),
            "details": agent.get("details", existing_record.get("details", {})),
        }

        result = upsert_single_document_into_kv_store(
            search_info=self.search_info,
            collection_name=self.COLLECTION_NAME,
            document=document,
            document_key=existing_key,
            with_admin_token=with_admin_token,
        )
        return result

    def delete_agent(
        self,
        agent_name: str,
        notify_runtime: bool = False,
        is_auth_by_pass=False,
        with_admin_token=True,
    ) -> bool:
        """
        Deletes an agent. Optionally notifies SCS to delete the runtime.

        Args:
            agent_name (str): The name of the agent to delete.
            notify_runtime (bool): Whether to call SCS to delete runtime before KV removal.

        Returns:
            bool or tuple:
                - If notify_runtime is False: True if KV deletion succeeded/record absent, else False.
                - If notify_runtime is True: (is_ok: bool, status_text: str)
        """
        query = json.dumps({"name": agent_name})
        existing_record = get_raw_document_from_kv_store(
            search_info=self.search_info,
            collection_name=self.COLLECTION_NAME,
            query=query,
        )
        if not existing_record:
            logger.error(f"Delete failed: agent '{agent_name}' not found in KV store.")
            return False if not notify_runtime else (False, "NOT_FOUND")
        is_user_authorized = (
            self.common_utils.is_user_eligible_by_role(
                acl=existing_record[0].get("details", {}).get("versions", [])[0].get("acl", {}),
                action="write",
            )
            if not is_auth_by_pass
            else True
        )
        if not is_auth_by_pass and not is_user_authorized:
            raise CustomMLTKError(f"User is not authorized to delete agent '{agent_name}'.")

        existing_record = existing_record[0]
        existing_key = existing_record.get("_key")

        if notify_runtime:
            versions = (existing_record.get("details", {}) or {}).get("versions", [])
            runtime_params = versions[0].get("runtime_params", {}) if versions else {}
            runtime_id = runtime_params.get("runtime_id")
            if not runtime_id:
                # No runtime to notify; delete KV and short-circuit as success/NOT_FOUND.
                result = delete_document_from_kv_store(
                    search_info=self.search_info,
                    collection_name=self.COLLECTION_NAME,
                    document_key=existing_key,
                    with_admin_token=True,
                )
                if not result:
                    logger.error(
                        f"Delete failed: unable to remove agent '{agent_name}' from KV store."
                    )
                return (result, "NOT_FOUND" if result else "ERROR")

            try:
                scs_token, scs_token_expiry = get_cached_scs_token(None, None, self.search_info)
                scs_url_base = get_scs_api_base_url(self.search_info)
                scs_url = f"{scs_url_base}/agent/aws_agentcore/{runtime_id}"
                headers = {
                    "Authorization": f"Bearer {scs_token}",
                    "Content-Type": "application/json",
                    "request_id": str(uuid.uuid4()),
                }
                response = httpx.delete(scs_url, headers=headers, timeout=600)
                try:
                    response_body = response.json()
                    status_text = response_body.get("status", response.reason_phrase)
                except Exception:
                    status_text = response.reason_phrase

                if response.status_code in (200, 202, 204):
                    logger.info(f"Successfully notified SCS for agent deletion: {status_text}")
                    existing_record["details"]["versions"][0]["state"] = "Deleting"
                    upsert_single_document_into_kv_store(
                        search_info=self.search_info,
                        collection_name=self.COLLECTION_NAME,
                        document=existing_record,
                        document_key=existing_key,
                        with_admin_token=True,
                    )
                    # Do not delete from KV here; caller handles async cleanup
                    return True, status_text

                logger.error(
                    f"Failed to notify SCS for agent deletion (status={response.status_code}): {response.text}"
                )
                return False, status_text
            except httpx.TimeoutException as e:
                logger.error(f"Timeout while notifying SCS for agent deletion: {str(e)}")
                return False, "TIMEOUT"
            except Exception as e:
                traceback_str = traceback.format_exc()
                logger.error(
                    f"Failed to notify SCS for agent deletion: {str(e)}\n{traceback_str}"
                )
                return False, "ERROR"

        result = delete_document_from_kv_store(
            search_info=self.search_info,
            collection_name=self.COLLECTION_NAME,
            document_key=existing_key,
            with_admin_token=with_admin_token,
        )
        if not result:
            logger.error(f"Delete failed: unable to remove agent '{agent_name}' from KV store.")
        return result

    def list_agents(self) -> list:
        """
        Retrieves all agents from the KV store in the same format as create_agent response.

        Returns:
            list: List of agents with structure matching create_agent response format:
                [
                    {
                        "agent_name": "...",
                        "runtime_type": "AWS_AGENT_CORE",
                        "versions": [
                            {
                                "version": 0,
                                "state": "...",
                                "system_prompt": "...",
                                "description": "...",
                                "is_enabled": True,
                                "runtime_params": {"runtime_id": "", "version": ""},
                                "tools": {
                                    "mcps": [...],
                                    "knowledge_bases": [...]
                                },
                                "llm": {...}
                            }
                        ]
                    },
                    ...
                ]
        """
        list_agents_start = time.time()
        documents = get_raw_documents_from_kv_store(
            search_info=self.search_info, collection_name=self.COLLECTION_NAME
        )
        # Transform KV store documents to match create_agent response format
        agents = []
        for doc in documents:
            agent_name = doc.get("name", "")
            details = doc.get("details", {})

            is_user_authorized = self.common_utils.is_user_eligible_by_role(
                acl=details.get("versions", [])[0].get("acl", {}),
                action="read",
            )
            if not is_user_authorized:
                continue

            agent_response = {
                "agent_name": agent_name,
                "runtime_type": details.get("runtime_type", "AWS_AGENT_CORE"),
                "tracking_job_id": None,  # Only available during creation
                "versions": details.get("versions", []),
            }

            agents.append(agent_response)

        logger.info(f"[list_agents] Total time: {time.time() - list_agents_start:.3f}s")
        return agents
