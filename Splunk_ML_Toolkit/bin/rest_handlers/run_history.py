"""
A handler for exposing an equivalent to the mlspl "agent runhistory" command via a REST endpoint.

This module implements synchronous Splunk search job submission, polling, and result retrieval
with pagination support aligned to Splunk's REST API pagination.
"""

import json
import cexc


from util.searchinfo_util import searchinfo_from_request

from util.error_util import CustomMLTKError
from run_history.utils import RunHistoryUtils
from run_history.search_utils import HistorySearchUtils, SearchNotFoundError

# Configure logger
logger = cexc.get_logger(__name__)


class RunHistory(object):
    """Handler for AI agent run history retrieval via Splunk search REST API."""

    # Search job configuration
    MAX_POLL_ATTEMPTS = 120  # Maximum polling attempts (2 minutes at 1s intervals)
    POLL_INTERVAL = 1.0  # Seconds between status checks
    SEARCH_TIMEOUT = 600  # Search job timeout in seconds
    DEFAULT_PAGE_SIZE = 100  # Default number of results per page
    MAX_PAGE_SIZE = 50000  # Maximum results per page (Splunk limit)
    DEFAULT_COUNT = 500
    DEFAULT_OFFSET = 0

    @classmethod
    def handle_post(cls, request, path_parts):
        """
        Handles POST requests for AI agent run history.

        Submits a search job to Splunk, polls for completion, and returns paginated results.

        Args:
            request: A dictionary providing information about the request including:
                - query_params: Dictionary of query parameters (offset, count, agent_name, etc.)
                - ns: Namespace information (user, app)
                - session: Session information (authtoken)
                - server: Server information (rest_uri)
            path_parts: A list of strings describing the request path

        Returns:
            dict: Response dictionary with:
                - payload: Search results with pagination metadata
                - status: HTTP status code

        Query Parameters:
            - offset (int): Starting index for pagination (default: 0)
            - count (int): Number of results per page (default: 100, max: 50000)
            - agent_name (str or list): Filter by agent name(s). Can be single value or multiple values.
                                        User must have read permissions for all specified agents.
            - session_id (str): Filter by session ID
            - request_id (str): Filter by request ID
            - earliest (str): Earliest time for search (e.g., "-24h", "2024-01-01")
            - latest (str): Latest time for search (e.g., "now", "2024-12-31")
            - status (str): Filter by status (success, error)

        Authorization:
            - If agent_name is specified, user must have read access to those agents based on ACL/ownership
            - Returns 403 if user lacks permission for any specified agent
        """
        try:
            # Extract searchinfo from request
            searchinfo = searchinfo_from_request(request)

            system_auth_token = request.get("system_authtoken", None)

            # Using admin service account for operations
            searchinfo["session_key"] = system_auth_token

            search_util = HistorySearchUtils(searchinfo=searchinfo)

            # Extract query parameters
            query_params = json.loads(request.get('payload', {}))

            # Pagination params
            offset = (
                int(query_params.get('offset', [0])[0])
                if isinstance(query_params.get('offset'), list)
                else int(query_params.get('offset', 0))
            )

            count = (
                int(query_params.get('count', [search_util.DEFAULT_PAGE_SIZE])[0])
                if isinstance(query_params.get('count'), list)
                else int(query_params.get('count', search_util.DEFAULT_PAGE_SIZE))
            )

            # Sid params
            sid = query_params.get("sid", None)
            previous_sid = query_params.get("previous_sid", None)

            # Validate pagination parameters
            if offset < 0:
                return {'payload': {'error': 'offset must be non-negative'}, 'status': 400}

            if count < 1 or count > search_util.MAX_PAGE_SIZE:
                return {
                    'payload': {
                        'error': f'count must be between 1 and {search_util.MAX_PAGE_SIZE}'
                    },
                    'status': 400,
                }

            if sid is not None:

                logger.debug("SID field is not None, so attempting to hit existing search.")

                total_results = query_params.get("total_results", None)

                if total_results is None:

                    logger.debug(
                        "Parameter total_results is None in request, so attempting to get the total results from search job."
                    )

                    try:
                        job_status = search_util.poll_search_job_sync(sid=sid)

                        total_results = job_status.get("eventCount")
                    except SearchNotFoundError:
                        logger.error(f"Search job not found for SID: {sid}.")

                    except Exception as e:
                        logger.error(
                            f"Could not hit status endpoint of this SID for total_results parameter: {sid}"
                        )

                    if total_results is None:

                        logger.error("Total Results count is None, so returning back error.")

                        return {
                            'payload': {
                                'error': "SID is non-empty and total results is not available in request, but failed to get total results from search."
                            },
                            'status': 400,
                        }

                logger.debug(
                    "Total results is not none so proceeding with search results retrieval."
                )

                try:
                    cached_results = search_util.get_search_results_sync(
                        sid=sid, offset=offset, count=count, total_results=total_results
                    )

                    return {'payload': cached_results, 'status': 200}

                except SearchNotFoundError as e:
                    logger.debug(
                        "Search SID was not found, so proceeding for new search creation."
                    )
                    sid = None
                    count = search_util.DEFAULT_COUNT
                    offset = search_util.DEFAULT_OFFSET

                    return {
                        "payload": {"error": "Search with particular SID not found."},
                        "status": 500,
                    }
                except Exception as e:
                    return {"payload": {"error": "Internal Server Error"}, 'status': 500}
            else:

                if previous_sid is not None:
                    try:
                        _ = search_util.delete_search_job_sync(sid=previous_sid)

                        logger.debug(f"Deletion of job: {previous_sid} was success.")
                    except SearchNotFoundError as e:
                        logger.warning(
                            f"Attempting to delete search: {previous_sid}, but search already absent."
                        )

                    except Exception as e:
                        # Timeout will take care of job cleanup
                        logger.warning(
                            f"Error deleting previous search job: {previous_sid}, proceeding without deleting.",
                            exc_info=True,
                        )

            # Extract filter parameters
            agent_names = RunHistoryUtils._extract_param_list(query_params, 'agent_name')
            earliest = RunHistoryUtils._extract_param(query_params, 'earliest', '-24h')
            latest = RunHistoryUtils._extract_param(query_params, 'latest', 'now')
            owner = RunHistoryUtils._extract_param(query_params, 'owner')

            # Validate and authorize agent access if agent_name filter is provided
            authorized_agents = []
            if agent_names:
                try:

                    authorized_agents = RunHistoryUtils._validate_agent_access(
                        searchinfo, agent_names, owner_filter=owner
                    )
                except CustomMLTKError as e:
                    logger.error(f"Agent access validation failed: {str(e)}")
                    return {'payload': {'error': str(e)}, 'status': 403}
                except Exception as e:
                    logger.error(f"Error validating agent access: {str(e)}", exc_info=True)
                    return {
                        'payload': {'error': 'Failed to validate agent access'},
                        'status': 500,
                    }
            else:
                try:
                    authorized_agents = RunHistoryUtils.get_all_authorized_agents(
                        searchinfo, owner_filter=owner
                    )
                except Exception as e:
                    logger.error("Problem in fetching all authorized agents.")
                    return {"payload": {"error": "Internal Server Error"}, "status": 500}

            if len(authorized_agents) == 0:
                return {
                    "payload": {
                        "message": "No Authorized Agents available with these filters",
                        "history": [],
                    },
                    "status": 400,
                }

            # Build search query with authorized agents
            search_query = search_util.build_search_query(
                agent_names=authorized_agents if authorized_agents else None
            )

            logger.info(
                f"Executing search query: {search_query} with offset={offset}, count={count}"
            )

            # Execute search synchronously
            results = search_util.execute_search_sync(
                search_query=search_query,
                earliest=earliest,
                latest=latest,
                offset=offset,
                count=count,
            )

            return {'payload': results, 'status': 200}

        except ValueError as e:
            logger.error(f"Validation error: {str(e)}")
            return {'payload': {'error': 'Invalid parameter'}, 'status': 400}
        except Exception as e:
            logger.error(f"Error retrieving run history: {str(e)}", exc_info=True)
            return {
                'payload': {'error': 'Failed to retrieve run history'},
                'status': 500,
            }
