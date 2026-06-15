"""
REST handler for event indexing operations.

This module provides REST endpoints for submitting events
to Splunk via the receivers/simple endpoint.
"""

import cexc
import json
from util.searchinfo_util import searchinfo_from_request
from util.rest_proxy import rest_proxy_from_searchinfo
from ai_commander.constants import AGENT_INTEGRATION_CONFIG
from run_history.search_utils import DefaultSearchConfig
from util.mlspl_loader import MLSPLConf

logger = cexc.get_logger(__name__)

APP_NAME = "Splunk_ML_Toolkit"


class HecOperations(object):
    """
    REST handler class for event indexing operations.

    Provides endpoints for:
    - PUT: Submitting events to Splunk via receivers/simple endpoint
    """

    @classmethod
    def _get_run_history_index(cls, searchinfo: dict) -> str:
        """
        Retrieve the index for storing AI Agent run history from configuration.

        Args:
            searchinfo (dict): Search information dictionary
        Returns:
            str: The index name for AI Agent run history
        """
        mlspl_conf = MLSPLConf(searchinfo)
        agent_run_index = mlspl_conf.get_mlspl_prop(
            'agent_run_index',
            stanza=AGENT_INTEGRATION_CONFIG,
            default='ai_agent_run_history_index',
        )
        return agent_run_index

    @classmethod
    def handle_put(cls, request, path_parts):
        """
        Submit events to Splunk via /services/receivers/simple endpoint.

        Args:
            request: Dict with 'payload' (JSON with 'index' and 'events' list) and 'system_authtoken'
            path_parts: URL path components

        Returns:
            Dict with 'payload' and 'status' (201=success, 207=partial, 500=failure)
        """

        logger.info("Received request to submit event via receivers/simple endpoint.")

        searchinfo = searchinfo_from_request(request, with_admin_token=True)
        payload = json.loads(request.get('payload', '{}'))

        index = cls._get_run_history_index(searchinfo)

        logger.debug(f"For pushing event, targeting index: {index}")

        system_auth_token = request.get("system_authtoken", None)

        if system_auth_token is None:
            return {
                'payload': {
                    "error": "Did not receive appropriate Headers. Internal Server Error."
                },
                'status': 500,
            }

        try:
            rest_proxy = rest_proxy_from_searchinfo(searchinfo, with_admin_token=True)
        except Exception as e:
            logger.error(f"Unable to initialize rest proxy: {str(e)}", exc_info=True)
            return {
                "payload": {"error": "Internal Server Error: Unable to initialize rest proxy."},
                "status": 500,
            }

        # Build the receivers/simple endpoint URL
        receivers_simple_url = f"{rest_proxy.splunkd_uri}/services/receivers/simple"

        events = payload.get("events", [])

        logger.info(f"Number of events received for push: {len(events)}")

        errors = []

        for event in events:

            try:
                # Build the event data with app_name
                event_data = event.get("event", {})
                event_data["app_name"] = APP_NAME

                # Make POST request to receivers/simple endpoint
                result = rest_proxy.make_rest_call(
                    method="POST",
                    url=receivers_simple_url,
                    getargs={
                        "index": index,
                        "sourcetype": DefaultSearchConfig.SOURCETYPE,
                        "source": DefaultSearchConfig.SOURCE,
                    },
                    jsonargs=json.dumps(event_data),
                )

                if not result or not result.get('success', False):
                    error_content = (
                        result.get('content', 'Unknown error') if result else 'No response'
                    )
                    raise Exception(f"Failed to push event: {error_content}")

            except Exception as e:
                logger.error(f"Error pushing event to index: {str(e)}, suppressing the error.")
                errors.append("Error pushing event to index")

        if errors:
            if len(errors) == len(events):
                return {
                    "payload": {
                        "message": f"Error in pushing events to index, pushed 0, failed: {len(errors)}",
                        "errors": str(list(set(errors))),
                    },
                    "status": 500,
                }
            else:
                return {
                    "payload": {
                        "message": f"Error in pushing events to index, pushed {len(events) - len(errors)}, failed: {len(errors)}",
                        "errors": str(list(set(errors))),
                    },
                    "status": 207,
                }

        return {
            'payload': {"message": f"Successfully pushed events to index: {len(events)}"},
            'status': 201,
        }
