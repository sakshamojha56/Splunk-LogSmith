"""
REST handler for CTSM (Cisco Time Series Model) feature opt-in/opt-out and acknowledge
"""

from exec_anaconda import exec_anaconda_or_die

exec_anaconda_or_die()

import traceback

import cexc
from util.searchinfo_util import searchinfo_from_request
from util.ctsm_conf_util import CTSMConfUtil

logger = cexc.get_logger(__name__)

PAYLOAD = 'payload'
STATUS = 'status'


class CtsmFeature(object):
    @classmethod
    def handle_post(cls, request: dict, path_parts: list) -> dict:
        """
        Handles the POST request to update CTSM opt-out setting to true (opt-out).

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

            # Update the ctsm_opt_out value to true in mlspl.conf
            ctsm_util = CTSMConfUtil(searchinfo)
            result = ctsm_util.update_ctsm_opt_out(True)
            logger.info(f"[CTSM] update_ctsm_opt_out result: {result}")

            response = {
                PAYLOAD: {
                    'message': 'CTSM opt-out successful',
                    'ctsm_opt_out': True,
                    'status': 'success',
                },
                STATUS: 200,
            }
            return response

        except Exception as e:
            logger.error(
                f"[CTSM] Error updating CTSM configuration: {str(traceback.format_exc())}"
            )
            return {
                PAYLOAD: {'error_message': "Failed to update CTSM settings."},
                STATUS: 500,
            }

    @classmethod
    def handle_get(cls, request: dict, path_parts: list) -> dict:
        """
        Handles the GET request to retrieve CTSM opt-out status.

        Args:
            request (dict):
                The HTTP request object.
            path_parts (list):
                The list of path parts from the request URL.

        Returns:
            dict:
                A response dictionary containing:
                - 'payload': The CTSM opt-out status or an error message.
                - 'status': HTTP status code (200 for success, 500 for errors).
        """
        try:
            searchinfo = searchinfo_from_request(request)

            ctsm_util = CTSMConfUtil(searchinfo)
            is_opted_out = ctsm_util.get_ctsm_opt_out()
            is_acknowledged = ctsm_util.get_ctsm_acknowledge()

            response = {
                PAYLOAD: {
                    'ctsm_opt_out': is_opted_out,
                    'ctsm_acknowledge': is_acknowledged,
                    'status': 'success',
                },
                STATUS: 200,
            }
            return response

        except Exception as e:
            logger.error(
                f"[CTSM] Error retrieving CTSM configuration: {str(traceback.format_exc())}"
            )
            return {
                PAYLOAD: {'error_message': "Failed to retrieve CTSM settings"},
                STATUS: 500,
            }
