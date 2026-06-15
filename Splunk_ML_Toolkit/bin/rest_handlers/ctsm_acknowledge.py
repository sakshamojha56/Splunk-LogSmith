"""
REST handler for CTSM (Cisco Time Series Model) acknowledge feature
"""

import traceback

import cexc
from util.searchinfo_util import searchinfo_from_request
from util.ctsm_conf_util import CTSMConfUtil

logger = cexc.get_logger(__name__)

PAYLOAD = 'payload'
STATUS = 'status'


class CtsmAcknowledge(object):
    @classmethod
    def handle_post(cls, request: dict, path_parts: list) -> dict:
        """
        Handles the POST request to update CTSM acknowledge setting to true.

        Args:
            request (dict):
                The HTTP request containing the payload.
            path_parts (list):
                The list of path parts from the request URL.

        Returns:
            dict:
                A response dictionary containing:
                - 'payload': A message indicating success or failure.
                - 'status': HTTP status code (200 for success, 500 for errors).
        """
        try:
            searchinfo = searchinfo_from_request(request)

            # Update the ctsm_acknowledge value to true in mlspl.conf
            ctsm_util = CTSMConfUtil(searchinfo)
            result = ctsm_util.update_ctsm_acknowledge(True)
            logger.info(f"[CTSM] update_ctsm_acknowledge result: {result}")

            response = {
                PAYLOAD: {
                    'message': 'CTSM acknowledge successful',
                    'ctsm_acknowledge': True,
                    'status': 'success',
                },
                STATUS: 200,
            }
            return response

        except Exception as e:
            logger.error(
                f"[CTSM] Error updating CTSM acknowledge: {str(traceback.format_exc())}"
            )
            return {
                PAYLOAD: {'error_message': "Failed to update CTSM acknowledge."},
                STATUS: 500,
            }
