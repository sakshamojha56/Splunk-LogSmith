import traceback
import requests
import time
import json

from ai_commander.constants import AGENT_INTEGRATION_CONFIG
import cexc

from typing import Optional, List, Dict, Any
from util.rest_proxy import rest_proxy_from_searchinfo
from util.mlspl_loader import MLSPLConf

logger = cexc.get_logger(__name__)


class DefaultSearchConfig(object):
    """
    Default configuration constants for AI agent run history search operations.

    This class contains all the default settings used for Splunk search operations
    including polling intervals, timeouts, pagination limits, index names, and field definitions.

    Attributes:
        MAX_POLL_ATTEMPTS (int): Maximum polling attempts (2 minutes at 1s intervals)
        POLL_INTERVAL (float): Seconds between status checks
        SEARCH_TIMEOUT (int): Search job timeout in seconds (30 minutes)
        DEFAULT_PAGE_SIZE (int): Default number of results per page
        MAX_PAGE_SIZE (int): Maximum results per page (Splunk limit)
        DEFAULT_COUNT (int): Default count for result retrieval
        DEFAULT_OFFSET (int): Default offset for pagination
        TOKEN_NAME (str): Name of the token used for search authentication
        INDEX (str): Splunk index name for AI agent run history
        SOURCETYPE (str): Sourcetype for AI agent response events
        SOURCE (str): Source identifier for agent processor events
        SEARCH_FIELDS (List[str]): List of fields to retrieve in search results
        ASC_SORTING_ORDER (List[str]): Sort order for search results
        PRIMARY_KEY_FOR_SEARCH_RESULT (str): Primary key for deduplication
        TIME_FIELD (str): Field name for timestamp
        AGENT_NAME_FIELD (str): Field name for agent name
    """

    MAX_POLL_ATTEMPTS = 120  # Maximum polling attempts (2 minutes at 1s intervals)
    POLL_INTERVAL = 1.0  # Seconds between status checks
    SEARCH_TIMEOUT = 1800  # Search job timeout in seconds
    DEFAULT_PAGE_SIZE = 100  # Default number of results per page
    MAX_PAGE_SIZE = 50000  # Maximum results per page (Splunk limit)
    DEFAULT_COUNT = 500
    DEFAULT_OFFSET = 0
    TOKEN_NAME = "ai_agent_run_history_token"
    INDEX = "ai_agent_run_history_index"
    SOURCETYPE = "ai_agent:response"
    SOURCE = "aiagent_processor"
    SEARCH_FIELDS = [
        "_time",
        "request_id",
        "session_id",
        "agent_name",
        "prompt",
        "response",
        "type",
        "processing_time",
        "status",
        "row_index",
        "search_id",
    ]
    ASC_SORTING_ORDER = ["session_id", "-_time"]
    PRIMARY_KEY_FOR_SEARCH_RESULT = "session_id"
    TIME_FIELD = "_time"
    AGENT_NAME_FIELD = "agent_name"

    @staticmethod
    def get_search_fields_str(separator=" ") -> str:
        """
        Get search fields as a delimited string.

        Args:
            separator (str): Delimiter to use between field names. Defaults to space.

        Returns:
            str: Space-separated (or custom-separated) string of search field names.

        Example:
            >>> DefaultSearchConfig.get_search_fields_str()
            "_time request_id session_id agent_name ..."
            >>> DefaultSearchConfig.get_search_fields_str(separator=",")
            "_time,request_id,session_id,agent_name,..."
        """
        return separator.join(DefaultSearchConfig.SEARCH_FIELDS)

    @staticmethod
    def get_sort_str(separator=" ") -> str:
        """
        Get sorting order as a delimited string.

        Args:
            separator (str): Delimiter to use between sort fields. Defaults to space.

        Returns:
            str: Space-separated (or custom-separated) string of sort fields.

        Example:
            >>> DefaultSearchConfig.get_sort_str()
            "session_id -_time"
        """
        return separator.join(DefaultSearchConfig.ASC_SORTING_ORDER)


class SearchProcessing(object):
    """
    SPL (Search Processing Language) query components for search result processing.

    This class defines the various processing steps that are applied to search results
    including sorting, deduplication, field selection, and ordering. These components
    are combined to create the final search query pipeline.

    Attributes:
        sort_order (str): SPL command to sort results by session_id and descending time
        drop_duplicates (str): SPL command to deduplicate results by primary key
        field_selection (str): SPL command to select specific fields from results
        generic_sort (str): SPL command to sort by time field
        processing_order (List[str]): Ordered list of processing steps to apply
    """

    sort_order = f"| sort {DefaultSearchConfig.get_sort_str()}"
    drop_duplicates = f'| dedup {DefaultSearchConfig.PRIMARY_KEY_FOR_SEARCH_RESULT}'
    field_selection = f'| table {DefaultSearchConfig.get_search_fields_str()}'
    generic_sort = f'| sort {DefaultSearchConfig.TIME_FIELD}'

    processing_order = [sort_order, drop_duplicates, field_selection, generic_sort]


class SearchNotFoundError(Exception):
    """
    Custom exception raised when a Splunk search job is not found.

    This exception is raised when attempting to access a search job (SID)
    that does not exist or has been deleted from the Splunk system.
    """

    pass


class HistorySearchUtils(object):
    """
    Utility class for executing Splunk searches to retrieve AI agent run history.

    This class provides methods to create, poll, and retrieve results from Splunk
    search jobs. It handles the complete search lifecycle including job creation,
    status polling, result retrieval, and cleanup operations.

    The class supports synchronous operations using the requests library and provides
    pagination support for large result sets.

    Attributes:
        MAX_POLL_ATTEMPTS (int): Maximum number of polling attempts before timeout
        POLL_INTERVAL (float): Time in seconds between poll attempts
        SEARCH_TIMEOUT (int): Maximum time in seconds for search execution
        DEFAULT_PAGE_SIZE (int): Default number of results per page
        MAX_PAGE_SIZE (int): Maximum allowed results per page
        DEFAULT_COUNT (int): Default count for result retrieval
        DEFAULT_OFFSET (int): Default starting offset for pagination
        event_index (str): Splunk index containing agent events
        sourcetype (str): Event sourcetype for filtering
        agent_name_field (str): Field name for agent identification
        searchinfo (dict): Splunk connection and authentication information
        splunkd_uri (str): Splunk management URI
        session_key (str): Authentication session key
        app (str): Splunk app context
        username (str): Username for namespace
        search_base_url (str): Base URL for search job operations

    Example:
        ```python
        searchinfo = {
            'splunkd_uri': 'https://localhost:8089',
            'session_key': 'auth_token',
            'app': 'mltk',
            'username': 'admin'
        }

        search_utils = HistorySearchUtils(searchinfo)
        query = search_utils.build_search_query(agent_names=['my_agent'])
        results = search_utils.execute_search_sync(
            search_query=query,
            earliest='-24h',
            latest='now',
            offset=0,
            count=100
        )
        ```
    """

    def __init__(
        self,
        searchinfo: dict,
        max_poll_attempts=None,
        poll_interval=None,
        search_timeout=None,
        default_page_size=None,
        max_page_size=None,
        default_count=None,
        default_offset=None,
    ):
        """
        Initialize HistorySearchUtils with Splunk connection info and configuration.

        Args:
            searchinfo (dict): Dictionary containing Splunk connection information:
                - splunkd_uri (str): Splunk management URI
                - session_key (str): Authentication session key
                - app (str): Splunk app context
                - username (str): Username for namespace
            max_poll_attempts (int, optional): Override default maximum poll attempts
            poll_interval (float, optional): Override default poll interval in seconds
            search_timeout (int, optional): Override default search timeout in seconds
            default_page_size (int, optional): Override default page size
            max_page_size (int, optional): Override maximum page size
            default_count (int, optional): Override default result count
            default_offset (int, optional): Override default pagination offset
        """

        self.MAX_POLL_ATTEMPTS = max_poll_attempts or DefaultSearchConfig.MAX_POLL_ATTEMPTS
        self.POLL_INTERVAL = poll_interval or DefaultSearchConfig.POLL_INTERVAL
        self.SEARCH_TIMEOUT = search_timeout or DefaultSearchConfig.SEARCH_TIMEOUT
        self.DEFAULT_PAGE_SIZE = default_page_size or DefaultSearchConfig.DEFAULT_PAGE_SIZE
        self.MAX_PAGE_SIZE = max_page_size or DefaultSearchConfig.MAX_PAGE_SIZE
        self.DEFAULT_COUNT = default_count or DefaultSearchConfig.DEFAULT_COUNT
        self.DEFAULT_OFFSET = default_offset or DefaultSearchConfig.DEFAULT_OFFSET
        mlspl_conf = MLSPLConf(searchinfo)
        agent_run_index = mlspl_conf.get_mlspl_prop(
            'agent_run_index',
            stanza=AGENT_INTEGRATION_CONFIG,
            default='ai_agent_run_history_index',
        )
        self.event_index = agent_run_index
        self.sourcetype = DefaultSearchConfig.SOURCETYPE
        self.agent_name_field = DefaultSearchConfig.AGENT_NAME_FIELD
        self.searchinfo = searchinfo
        self.splunkd_uri = searchinfo['splunkd_uri']
        self.session_key = searchinfo['session_key']
        self.app = searchinfo['app']
        self.username = searchinfo['username']
        self.search_base_url = (
            f"{self.splunkd_uri}/servicesNS/{self.username}/{self.app}/search/jobs"
        )
        self.rest_proxy = rest_proxy_from_searchinfo(searchinfo=searchinfo)

    def build_search_query(self, agent_names: Optional[List[str]] = None) -> str:
        """
        Build Splunk search query for AI agent run history.

        Constructs a complete SPL (Search Processing Language) query to retrieve
        AI agent run history from the configured Splunk index. The query includes
        filtering by agent names (if specified), deduplication, field selection,
        and sorting.

        Args:
            agent_names (Optional[List[str]]): List of agent names to filter by.
                If None, retrieves history for all agents (subject to ACL).
                If a single agent is provided, uses simple equality filter.
                If multiple agents are provided, uses OR filter.

        Returns:
            str: Complete Splunk search query ready for execution.

        Example:
            Single agent:
            >>> utils.build_search_query(agent_names=['my_agent'])
            'search index="_ai_agent_run_history_index" sourcetype="ai_agent:response"
             agent_name="my_agent" | sort session_id -_time | dedup session_id
             | table _time request_id ... | sort _time'

            Multiple agents:
            >>> utils.build_search_query(agent_names=['agent1', 'agent2'])
            'search index="_ai_agent_run_history_index" sourcetype="ai_agent:response"
             (agent_name="agent1" OR agent_name="agent2") | sort session_id -_time ...'

            All agents:
            >>> utils.build_search_query()
            'search index="_ai_agent_run_history_index" sourcetype="ai_agent:response"
             | sort session_id -_time | dedup session_id ...'
        """
        # Base search for AI agent events

        query_parts = [f'search index="{self.event_index}"', f'sourcetype="{self.sourcetype}"']

        # Add filters
        if agent_names:
            if len(agent_names) == 1:
                # Single agent filter
                query_parts.append(f'{self.agent_name_field}="{agent_names[0]}"')
            else:
                # Multiple agent filter using OR
                agent_filters = ' OR '.join(
                    [f'{self.agent_name_field}="{name}"' for name in agent_names]
                )
                query_parts.append(f'({agent_filters})')

        # Deduplication and Recent Entries at top.
        query_parts.extend(SearchProcessing.processing_order)

        return ' '.join(query_parts)

    def execute_search_sync(
        self, search_query: str, earliest: str, latest: str, offset: int, count: int
    ) -> Dict[str, Any]:
        """
        Execute Splunk search synchronously using requests library.

        Orchestrates the complete search lifecycle: creates a search job, polls for
        completion, retrieves paginated results, and returns the formatted response.
        This is a synchronous/blocking operation that waits for search completion.

        Args:
            search_query (str): SPL search query to execute
            earliest (str): Earliest time bound for search (e.g., '-24h', '2024-01-01T00:00:00')
            latest (str): Latest time bound for search (e.g., 'now', '2024-12-31T23:59:59')
            offset (int): Starting index for pagination (0-based)
            count (int): Number of results to retrieve per page

        Returns:
            Dict[str, Any]: Dictionary containing:
                - history (List[dict]): List of search result events
                - pagination (dict): Pagination metadata:
                    - offset (int): Current offset
                    - count (int): Requested count
                    - total (int): Total available results
                    - returned (int): Number of results in this response
                    - has_more (bool): Whether more results are available
                    - next_offset (int): Offset for next page (if has_more is True)
                - sid (str): Search job ID

        Raises:
            RuntimeError: If search job creation, polling, or result retrieval fails
            SearchNotFoundError: If search job is not found during polling or retrieval

        Example:
            >>> utils = HistorySearchUtils(searchinfo)
            >>> query = utils.build_search_query(agent_names=['my_agent'])
            >>> results = utils.execute_search_sync(
            ...     search_query=query,
            ...     earliest='-7d',
            ...     latest='now',
            ...     offset=0,
            ...     count=50
            ... )
            >>> print(f"Retrieved {results['pagination']['returned']} of {results['pagination']['total']} results")
        """
        from requests.packages.urllib3.exceptions import InsecureRequestWarning

        requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

        # Step 1: Create search job
        sid = self.create_search_job_sync(
            search_query=search_query, earliest=earliest, latest=latest
        )

        logger.info(f"Created search job with SID: {sid}")

        # Step 2: Poll for completion
        job_status = self.poll_search_job_sync(sid=sid)

        # Step 3: Get results
        results = self.get_search_results_sync(
            sid=sid, offset=offset, count=count, total_results=job_status.get('eventCount', 0)
        )

        logger.info("Search Executed Successfully.")

        return results

    def create_search_job_sync(self, search_query: str, earliest: str, latest: str) -> str:
        """
        Create a Splunk search job synchronously.

        Submits a search job to Splunk via REST API and returns the search ID (SID).
        The search job runs asynchronously on the Splunk server after creation.

        Args:
            search_query (str): SPL (Search Processing Language) query to execute
            earliest (str): Earliest time bound for the search (e.g., '-24h', '2024-01-01T00:00:00')
            latest (str): Latest time bound for the search (e.g., 'now', '2024-12-31T23:59:59')

        Returns:
            str: Search ID (SID) - unique identifier for the created search job

        Raises:
            RuntimeError: If search job creation fails due to HTTP error or missing SID
            requests.HTTPError: If the HTTP request fails

        Example:
            >>> sid = utils.create_search_job_sync(
            ...     search_query='search index=main | head 10',
            ...     earliest='-1h',
            ...     latest='now'
            ... )
            >>> print(f"Search job created with SID: {sid}")
        """

        url = f"{self.search_base_url}"

        data = {
            'search': search_query,
            'earliest_time': earliest,
            'latest_time': latest,
            'exec_mode': 'normal',
            'timeout': self.SEARCH_TIMEOUT,
        }

        logger.info(f"Search job parameters: {data}")

        try:

            response = self.rest_proxy.make_rest_call(
                method="POST", url=url + "?output_mode=json", postargs=data
            )

            if response.get("status", 500) not in [200, 201]:
                logger.error(f"Error Response content: {response.get('content', {})}")
                raise RuntimeError(
                    f"Failed to create search job, status code: {response.get('status')}"
                )

            result = json.loads(response.get("content", {}))

            logger.debug(f"Response json: {result}")
            sid = result.get('sid')

            if not sid:
                raise Exception("No SID returned from search job creation")

            return sid
        except Exception as e:
            logger.error(
                f"Error creating search job: {str(e)}, traceback: {traceback.format_exc()}"
            )
            raise RuntimeError(f"Failed to create search job: {str(e)}")

    def poll_search_job_sync(self, sid: str) -> Dict[str, Any]:
        """
        Poll search job status until completion, failure, or timeout.

        Continuously checks the status of a Splunk search job at regular intervals
        until it completes successfully, fails, or reaches maximum poll attempts.

        Args:
            sid (str): Search ID (SID) of the job to poll

        Returns:
            Dict[str, Any]: Job status information containing:
                - isDone (bool): Whether the job has completed
                - isFailed (bool): Whether the job has failed
                - isFinalized (bool): Whether the job is finalized
                - dispatchState (str): Current dispatch state
                - eventCount (int): Number of events found
                - resultCount (int): Number of results available
                - And other job metadata fields

        Raises:
            RuntimeError: If job fails or times out after maximum poll attempts
            SearchNotFoundError: If search job (SID) is not found (404)

        Example:
            >>> sid = utils.create_search_job_sync(query, '-1h', 'now')
            >>> job_status = utils.poll_search_job_sync(sid)
            >>> print(f"Search completed with {job_status['eventCount']} events")

        Notes:
            - Polls every POLL_INTERVAL seconds (default: 1.0s)
            - Maximum attempts: MAX_POLL_ATTEMPTS (default: 120)
            - Total max wait time: MAX_POLL_ATTEMPTS * POLL_INTERVAL (default: 2 minutes)
        """

        url = f"{self.search_base_url}/{sid}"

        for attempt in range(self.MAX_POLL_ATTEMPTS):
            try:

                response = self.rest_proxy.make_rest_call(
                    method="GET", url=url + "?output_mode=json"
                )

                if response.get("status", 500) not in [200, 201]:
                    logger.error(f"Error Response content: {response.get('content', {})}")
                    raise RuntimeError(
                        f"Failed to poll search job, status code: {response.get('status')}"
                    )

                job_info = json.loads(response.get("content", {}))  # response.json()
                entry = job_info.get('entry', [{}])[0]
                content = entry.get('content', {})

                is_done = content.get('isDone', False)
                is_failed = content.get('isFailed', False)
                is_finalized = content.get('isFinalized', False)
                dispatch_state = content.get('dispatchState', 'UNKNOWN')

                logger.debug(
                    f"Poll attempt {attempt + 1}/{self.MAX_POLL_ATTEMPTS}: "
                    f"isDone={is_done}, isFailed={is_failed}, dispatchState={dispatch_state}"
                )

                if is_failed:
                    messages = content.get('messages', [])
                    error_msg = (
                        '; '.join([msg.get('text', '') for msg in messages]) or 'Unknown error'
                    )
                    raise RuntimeError(f"Search job failed: {error_msg}")

                if is_done or (is_finalized and dispatch_state == 'DONE'):
                    return content

                time.sleep(self.POLL_INTERVAL)

            except RuntimeError:
                raise
            except Exception as e:
                logger.error(f"Error polling search job: {str(e)}")
                raise RuntimeError(f"Failed to poll search job: {str(e)}")

        raise RuntimeError(
            f"Search job {sid} timed out after {self.MAX_POLL_ATTEMPTS * self.POLL_INTERVAL} seconds"
        )

    def get_search_results_sync(
        self, sid: str, offset: int, count: int, total_results: int
    ) -> Dict[str, Any]:
        """
        Retrieve paginated search results from a completed search job.

        Fetches results from a Splunk search job using pagination parameters.
        This method should be called after the search job has completed (verified
        via poll_search_job_sync).

        Args:
            sid (str): Search ID (SID) of the completed job
            offset (int): Starting index for results (0-based)
            count (int): Maximum number of results to retrieve
            total_results (int): Total number of results available (from job status)

        Returns:
            Dict[str, Any]: Dictionary containing:
                - history (List[dict]): List of result events/rows
                - pagination (dict): Pagination metadata:
                    - offset (int): Current starting offset
                    - count (int): Requested count
                    - total (int): Total available results
                    - returned (int): Actual number of results in this response
                    - has_more (bool): Whether more results exist beyond this page
                    - next_offset (Optional[int]): Offset for next page (None if no more)
                - sid (str): Search job ID

        Raises:
            RuntimeError: If result retrieval fails
            SearchNotFoundError: If search job (SID) is not found (404)

        Example:
            >>> results = utils.get_search_results_sync(
            ...     sid='1234567890.123',
            ...     offset=0,
            ...     count=100,
            ...     total_results=250
            ... )
            >>> print(f"Retrieved {results['pagination']['returned']} results")
            >>> print(f"Has more: {results['pagination']['has_more']}")
            >>> if results['pagination']['has_more']:
            ...     next_page = utils.get_search_results_sync(
            ...         sid=sid,
            ...         offset=results['pagination']['next_offset'],
            ...         count=100,
            ...         total_results=250
            ...     )
        """

        url = f"{self.search_base_url}/{sid}/results"

        params = {'output_mode': 'json', 'offset': offset, 'count': count}

        try:

            response = self.rest_proxy.make_rest_call(method="GET", url=url, getargs=params)

            if response.get("status", 500) not in [200, 201]:
                logger.error(f"Error Response content: {response.get('content', {})}")
                raise RuntimeError(
                    f"Failed to get search results, status code: {response.get('status')}"
                )

            result_data = json.loads(response.get("content", {}))
            results = result_data.get('results', [])

            has_more = (offset + len(results)) < total_results
            next_offset = offset + len(results) if has_more else None

            return {
                'history': results,
                'pagination': {
                    'offset': offset,
                    'count': count,
                    'total': total_results,
                    'returned': len(results),
                    'has_more': has_more,
                    'next_offset': next_offset,
                },
                'sid': sid,
            }
        except Exception as e:
            logger.error(
                f"Error retrieving search results: {str(e)}, traceback: {traceback.format_exc()}"
            )
            raise RuntimeError(f"Failed to retrieve results: {str(e)}")

    def delete_search_job_sync(self, sid: str) -> None:
        """
        Delete a Splunk search job to free server resources.

        Removes a search job from the Splunk system. This is useful for cleanup
        after retrieving results, though search jobs will also auto-expire based
        on Splunk's configured TTL settings.

        Args:
            sid (str): Search ID (SID) of the job to delete

        Returns:
            None

        Raises:
            SearchNotFoundError: If search job (SID) is not found (404)
            Exception: If deletion fails for other reasons

        Example:
            >>> utils.delete_search_job_sync('1234567890.123')
            >>> # Job is now deleted and resources freed

        Notes:
            - This method logs warnings instead of raising exceptions for most errors
            - A 404 error (job not found) will raise SearchNotFoundError
            - Successful deletion is logged at debug level
        """

        url = f"{self.search_base_url}/{sid}"

        headers = {'Authorization': f'Splunk {self.session_key}'}

        try:

            response = self.rest_proxy.make_rest_call(method="DELETE", url=url)

            if response.get("status", 500) not in [200, 201]:
                logger.error(f"Error Response content: {response.get('content', {})}")
                raise Exception(
                    f"Failed to delete search job, status code: {response.get('status')}"
                )
            # response.raise_for_status()
            logger.debug(f"Successfully deleted search job {sid}")
        except Exception as e:
            logger.warning(f"Could not delete search job {sid}: {str(e)}")
