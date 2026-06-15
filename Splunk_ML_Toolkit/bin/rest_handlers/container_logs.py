import cexc
from dsdl.configure_handler import DockerConfigureService
from util.searchinfo_util import searchinfo_from_request
from ai_commander.constants import PAYLOAD, STATUS
from dsdl.docker_util import read_dev_prod_container_data

logger = cexc.get_logger(__name__)


class ContainerLogs(object):
    @classmethod
    def handle_post(cls, request: dict, path_parts: list) -> dict:
        try:
            # Parse out Splunk session & auth
            searchinfo = searchinfo_from_request(request)
            system_auth = request["system_authtoken"]
            session_key = searchinfo["session_key"]

            # Delegate to your service—this now returns the 'settings' dict
            docker_service = DockerConfigureService(session_key, system_auth)
            container_logs = docker_service.get_container_logs(request, searchinfo)

            # Return a structured REST response
            return {
                PAYLOAD: {
                    "message": "Fetched the logs of container successfully ",
                    "container_logs": container_logs,
                    "status": "success",
                },
                STATUS: 200,
            }

        except Exception as e:
            # Unexpected errors
            logger.error(f"Failed to fetch the logs: {str(e)}")
            return {
                PAYLOAD: {
                    "message": "Failed to fetch the logs.",
                    "status": "failure",
                },
                STATUS: 500,
            }

    @classmethod
    def handle_get(cls, request: dict, path_parts: list) -> dict:
        try:
            searchinfo = searchinfo_from_request(request)
            config_data = read_dev_prod_container_data(searchinfo)

            # Return it in the REST response
            return {
                PAYLOAD: {
                    "message": "Fetched the dev prod data successfully",
                    "config": config_data,
                    "status": "success",
                },
                STATUS: 200,
            }

        except Exception as e:
            logger.error(f"Error reading configuration: {str(e)}")
            return {
                PAYLOAD: {
                    "message": "Failed to read configuration.",
                    "status": "fail",
                },
                STATUS: 500,
            }
