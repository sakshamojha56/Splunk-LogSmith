import time
from connection_config_manager.utils.common_utils import CommonUtils
import cexc
import pandas as pd
from .BaseProcessor import BaseProcessor
from agent_manager.agent_manager import AgentManager
from ai_commander.constants import PARAMS
from util.mlspl_loader import MLSPLConf
from util.ai_commander_util import (
    get_raw_documents_from_kv_store,
    get_scs_api_base_url,
    get_cached_scs_token,
    delete_document_from_kv_store,
)
import uuid
import httpx

logger = cexc.get_logger(__name__)


class AgentStatusProcessor(BaseProcessor):
    def __init__(self, process_options: dict, searchinfo: dict) -> None:
        self.process_options = process_options
        self.searchinfo = searchinfo
        self.searchinfo['username'] = process_options.get(PARAMS, {}).get('user_name', 'admin')
        self.agent_manager = AgentManager(searchinfo)
        mlspl_conf = MLSPLConf(searchinfo)
        stanza = mlspl_conf.get_stanza("ai:AgentIntegrations")
        self.max_polls = int(stanza.get("max_polls", 60))
        self.poll_interval_secs = int(stanza.get("poll_interval_secs", 10))
        self.common_utils = CommonUtils(searchinfo, is_mlspl_load=False)
        self.scs_token = None
        self.scs_token_expiry = None

    def process(self) -> None:
        # Implement the logic to check and return the status of agents
        request_id = str(uuid.uuid4())
        logger.info(
            "Starting Agent Status Processing - {}, request_id = {}".format(
                self.process_options[PARAMS], request_id
            )
        )
        agent_name = self.process_options.get(PARAMS, {}).get("agent_name")
        action = self.process_options.get(PARAMS, {}).get("action")
        if not agent_name or not action:
            raise RuntimeError("Both 'agent_name' and 'action' parameters are required.")

        # Retry logic to handle KV store replication lag in SHC environments
        # The agent may have been created on a different search head (KV captain)
        # and replication to the local replica may not be complete yet
        max_retry_duration = 120  # 2 minutes maximum retry window
        retry_delay = 1  # Start with 1 second
        max_retry_delay = 30  # Cap at 30 seconds to avoid long waits
        agent = None
        start_time = time.time()
        attempt = 0

        while True:
            attempt += 1
            agent = self.agent_manager.get_agent(agent_name, is_auth_by_pass=True)
            if agent:
                if attempt > 1:
                    elapsed = time.time() - start_time
                    logger.info(
                        f"Agent '{agent_name}' found after {attempt} attempts "
                        f"({elapsed:.1f}s elapsed, KV store replication lag)"
                    )
                break

            elapsed = time.time() - start_time
            remaining_time = max_retry_duration - elapsed

            # Exit if no time left for another retry
            if remaining_time <= 0:
                break

            # Cap sleep to remaining time to avoid exceeding max_retry_duration
            actual_delay = min(retry_delay, remaining_time)

            logger.debug(
                f"Agent '{agent_name}' not found, retrying in {actual_delay:.1f}s "
                f"(attempt {attempt}, {elapsed:.1f}s elapsed)"
            )
            time.sleep(actual_delay)
            retry_delay = min(retry_delay * 2, max_retry_delay)  # Exponential backoff with cap

        if not agent:
            total_elapsed = time.time() - start_time
            raise RuntimeError(
                f"Agent '{agent_name}' not found after {attempt} attempts over {total_elapsed:.1f}s. "
                f"This may indicate KV store replication issues in SHC."
            )

        result = None
        if action == "create":
            result = self.handle_create_agent(agent, request_id)
        elif action == "delete":
            result = self.handle_delete_agent(agent, request_id)
        else:
            raise RuntimeError(f"Unknown action '{action}' specified.")
        logger.info("Completed Agent Status Processing")

        # Add result to the dataframe
        if self.df is None or self.df.empty:
            self.df = pd.DataFrame([result])
        else:
            # Add the result as a new column to existing rows
            self.df['agent_status'] = result.get('status')
            self.df['agent_name'] = agent_name
            self.df['action'] = action

    def _get_agent_state(self, agent: dict, request_id: str) -> str:
        scs_token, scs_token_expiry = get_cached_scs_token(
            self.scs_token, self.scs_token_expiry, self.searchinfo
        )
        self.scs_token = scs_token
        self.scs_token_expiry = scs_token_expiry
        scs_url_base = get_scs_api_base_url(self.searchinfo)
        runtime_id = agent['details']['versions'][0].get('runtime_params', {}).get('runtime_id')
        scs_url = f"{scs_url_base}/agent/aws_agentcore?runtime_ids={runtime_id}"
        headers = {
            "Authorization": f"Bearer {self.scs_token}",
            "Content-Type": "application/json",
            "request_id": request_id,
        }
        try:
            response = httpx.get(scs_url, headers=headers, timeout=600)
            response.raise_for_status()
            data = response.json()
            agent_state = data['agents'][0].get('status', 'unknown')
            logger.debug(f"Agent status from SCS: {data}")
            return agent_state
        except Exception as e:
            logger.error(f"Failed to get agent status from SCS: {str(e)}")
            return "unknown"

    def handle_create_agent(self, agent: dict, request_id: str) -> dict:
        # Logic to create an agent
        agent_name = agent.get("name")
        is_created = False
        polls = 0
        mcps = agent.get("details", {}).get("versions")[0].get("tools").get("mcps", [])
        knowledge_bases = (
            agent.get("details", {}).get("versions")[0].get("tools").get("knowledge_bases", [])
        )
        if not self._check_read_access(mcps, knowledge_bases):
            logger.error(
                f"Read access check failed for MCPs or Vector DBs while creating agent: {agent.get('name')}"
            )
            self.agent_manager.delete_agent(
                agent_name, is_auth_by_pass=True, with_admin_token=False
            )
            return {"status": "deleted", "agent_name": agent_name, "action": "delete"}

        while not is_created and polls < self.max_polls:
            is_created = self._get_agent_state(agent, request_id).lower() == "ready"
            if is_created:
                break
            polls += 1
            time.sleep(self.poll_interval_secs)  # Wait before next poll
        if is_created:
            agent["details"]["versions"][0]['state'] = "Available"
            self.agent_manager.update_agent(agent, is_auth_by_pass=True, with_admin_token=False)
            return {"status": "created", "agent_name": agent_name, "action": "create"}
        else:
            logger.info(f"Agent '{agent_name}' creation not confirmed after polling.")
            return {"status": "creation_failed", "agent_name": agent_name, "action": "create"}

    def handle_delete_agent(self, agent: dict, request_id: str) -> dict:
        # Logic to delete an agent
        agent_name = agent.get("name")
        is_deleted = False
        polls = 0
        while not is_deleted and polls < self.max_polls:
            is_deleted = self._get_agent_state(agent, request_id).lower() == "not_found"
            if is_deleted:
                break
            polls += 1
            time.sleep(self.poll_interval_secs)  # Wait before next poll
        if is_deleted:
            self.agent_manager.delete_agent(
                agent_name, is_auth_by_pass=True, with_admin_token=False
            )
            return {"status": "deleted", "agent_name": agent_name, "action": "delete"}
        else:
            logger.info(f"Agent '{agent_name}' deletion not confirmed after polling.")
            return {"status": "deletion_failed", "agent_name": agent_name, "action": "delete"}

    def get_relevant_fields(self) -> list:
        """
        Returns a list of relevant fields for processing.

        Returns:
            list:
                An empty list (can be customized in future implementations).
        """
        return []

    def _check_read_access(self, mcps: list, vector_dbs: list) -> bool:
        """
        Check if user has read access to the specified MCPs and Vector DBs.
        Fetches directly from KV store and uses common_utils for ACL checks.
        """
        MCP_COLLECTION = "aitk_mcp_collection"
        VDB_COLLECTION = "aitk_vector_store_collection"

        # Fetch all MCPs and VectorDBs from KV store
        all_mcps = get_raw_documents_from_kv_store(
            search_info=self.searchinfo, collection_name=MCP_COLLECTION
        )
        all_vdbs = get_raw_documents_from_kv_store(
            search_info=self.searchinfo, collection_name=VDB_COLLECTION
        )

        # Build name -> doc map for quick lookup, filtering by read access
        accessible_mcp_names = set()
        for doc in all_mcps:
            if self.common_utils.is_user_eligible_by_role(
                acl=doc.get("acl", {}), action="read"
            ):
                accessible_mcp_names.add(doc.get("name"))

        accessible_vdb_names = set()
        for doc in all_vdbs:
            if self.common_utils.is_user_eligible_by_role(
                acl=doc.get("acl", {}), action="read"
            ):
                accessible_vdb_names.add(doc.get("name"))

        # Check if all requested MCPs are accessible
        for mcp in mcps:
            mcp_name = mcp.get("name")
            if not mcp_name or mcp_name not in accessible_mcp_names:
                logger.error(f"MCP '{mcp_name}' not found or inaccessible.")
                return False

        # Check if all requested Vector DBs are accessible
        for vdb in vector_dbs:
            vdb_name = vdb.get("name")
            if not vdb_name or vdb_name not in accessible_vdb_names:
                logger.error(f"Vector DB '{vdb_name}' not found or inaccessible.")
                return False

        return True
