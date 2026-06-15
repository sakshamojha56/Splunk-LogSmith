import cexc

from typing import Dict, Any, List, Optional

from agent_manager.agent_manager import AgentManager
from util.error_util import CustomMLTKError

# Configure logger
logger = cexc.get_logger(__name__)


class RunHistoryUtils(object):
    """
    Utility class for AI agent run history operations.

    This class provides helper methods for validating agent access, retrieving
    authorized agents, and extracting query parameters. It works in conjunction
    with AgentManager to enforce ACL-based permissions.

    All methods are static and can be called without instantiating the class.
    """

    @staticmethod
    def _validate_agent_access(
        searchinfo: Dict[str, Any], agent_names: List[str], owner_filter: str = None
    ) -> List[str]:
        """
        Validate user has access to specified agents based on ACL and ownership.

        Checks each agent in the provided list to ensure the user has read access
        based on ACL permissions or ownership. Optionally filters by agent owner
        to restrict results to agents created by a specific user.

        Args:
            searchinfo (Dict[str, Any]): Dictionary containing Splunk connection info and user context:
                - splunkd_uri (str): Splunk management URI
                - session_key (str): Authentication session key
                - app (str): Splunk app context
                - username (str): Current user's username
            agent_names (List[str]): List of agent names to validate access for
            owner_filter (str, optional): Filter agents by owner username (case-insensitive).
                If provided, only agents created by this user are authorized.
                If None, all accessible agents are authorized.

        Returns:
            List[str]: List of authorized agent names that the user can access
                and match the owner filter (if specified)

        Raises:
            CustomMLTKError: If user doesn't have access to one or more agents,
                with a message listing all unauthorized agents

        Example:
            >>> searchinfo = {'username': 'alice', 'session_key': '...', ...}
            >>> agent_names = ['agent1', 'agent2', 'agent3']
            >>> authorized = RunHistoryUtils._validate_agent_access(searchinfo, agent_names)
            >>> print(authorized)
            ['agent1', 'agent2']  # agent3 was not authorized

            >>> # With owner filter
            >>> authorized = RunHistoryUtils._validate_agent_access(
            ...     searchinfo, agent_names, owner_filter='alice'
            ... )
            >>> print(authorized)
            ['agent1']  # Only agents created by alice

        Notes:
            - Uses AgentManager.get_agent() which performs ACL validation
            - Owner filter is case-insensitive
            - Returns empty list if all agents are unauthorized (then raises error)
            - Logs warnings for each unauthorized agent
        """
        agent_manager = AgentManager(searchinfo)
        authorized_agents = []
        unauthorized_agents = []

        # TODO: Should we fetch all agents and do string match?
        for agent_name in agent_names:
            try:
                # get_agent() already checks role-based eligibility
                agent_doc = agent_manager.get_agent(agent_name)
                if agent_doc:
                    if (
                        owner_filter is None
                        or agent_doc.get("details", {})
                        .get("versions", [{}])[-1]
                        .get("acl", {})
                        .get("owner", "")
                        .lower()
                        == owner_filter
                    ):
                        authorized_agents.append(agent_name)
                else:
                    logger.warning(f"Agent '{agent_name}' not found")
                    unauthorized_agents.append(f"{agent_name} (not found)")
            except CustomMLTKError as e:
                # User doesn't have access to this agent
                logger.warning(f"User not authorized for agent '{agent_name}': {str(e)}")
                unauthorized_agents.append(agent_name)
            except Exception as e:
                logger.error(f"Error checking access for agent '{agent_name}': {str(e)}")
                unauthorized_agents.append(f"{agent_name} (error: {str(e)})")

        # If any agents are unauthorized, return error
        if unauthorized_agents:
            raise CustomMLTKError(
                f"User is not authorized to access the following agent(s): {', '.join(unauthorized_agents)}"
            )

        return authorized_agents

    @staticmethod
    def get_all_authorized_agents(searchinfo, owner_filter=None):
        """
        Retrieve all agents that the user is authorized to access.

        Fetches the complete list of agents from AgentManager that the user has
        read access to based on ACL permissions. Optionally filters the results
        to only include agents created by a specific owner.

        Args:
            searchinfo (dict): Dictionary containing Splunk connection info and user context:
                - splunkd_uri (str): Splunk management URI
                - session_key (str): Authentication session key
                - app (str): Splunk app context
                - username (str): Current user's username
            owner_filter (str, optional): Filter agents by owner/creator username.
                If provided, only returns agents where created_by matches this value
                (case-insensitive comparison). If None, returns all authorized agents.

        Returns:
            List[str]: List of agent names that the user is authorized to access,
                optionally filtered by owner

        Example:
            >>> searchinfo = {'username': 'alice', ...}
            >>> # Get all agents user can access
            >>> all_agents = RunHistoryUtils.get_all_authorized_agents(searchinfo)
            >>> print(all_agents)
            ['agent1', 'agent2', 'agent3', 'agent4']

            >>> # Get only agents created by 'bob'
            >>> bob_agents = RunHistoryUtils.get_all_authorized_agents(
            ...     searchinfo, owner_filter='bob'
            ... )
            >>> print(bob_agents)
            ['agent3', 'agent4']  # Only agents where created_by='bob'

        Notes:
            - Uses AgentManager.list_agents() which already filters by ACL permissions
            - Owner filter performs case-insensitive comparison
            - Returns empty list if no agents match the criteria
            - Agent structure must have versions[-1].created_by for owner filtering
        """
        logger.info(f"Search info inside get all agents: {searchinfo}")
        agent_manager = AgentManager(searchinfo)
        authorized_agents = agent_manager.list_agents()

        if owner_filter is None:
            return [agent["agent_name"] for agent in authorized_agents]
        else:
            filtered_agents = []
            for agent in authorized_agents:

                if (
                    agent.get("versions", [{}])[-1].get("acl", {}).get("owner", "")
                    == owner_filter
                ):
                    filtered_agents.append(agent["agent_name"])
            return filtered_agents

    @staticmethod
    def _extract_param(
        query_params: Dict, key: str, default: Optional[str] = None
    ) -> Optional[str]:
        """
        Extract a parameter from query_params dictionary.

        Handles both list and string parameter formats.

        Args:
            query_params: Dictionary of query parameters
            key: Parameter key to extract
            default: Default value if not found

        Returns:
            Parameter value or default
        """
        value = query_params.get(key, default)
        if isinstance(value, list) and len(value) > 0:
            return value[0]
        return value if value else default

    @staticmethod
    def _extract_param_list(query_params: Dict, key: str) -> Optional[List[str]]:
        """
        Extract a parameter as a list from query_params dictionary.

        Handles both list and string parameter formats. If a single value is provided,
        it will be returned as a list with one element.

        Args:
            query_params: Dictionary of query parameters
            key: Parameter key to extract

        Returns:
            List of parameter values or None if not found
        """
        value = query_params.get(key)
        if value is None:
            return None
        if isinstance(value, list):
            return [v for v in value if v]  # Filter out empty strings
        if value:
            return [value]
        return None
