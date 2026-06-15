import cexc
from dsdl.configure_handler import DockerConfigureService
from dsdl.exceptions import ApplicationError
from util.searchinfo_util import searchinfo_from_request
from ai_commander.constants import PAYLOAD, STATUS

logger = cexc.get_logger(__name__)


class TestContainerConnection(object):
    @classmethod
    def handle_post(cls, request: dict, path_parts: list) -> dict:
        try:
            # Parse out Splunk session & auth
            searchinfo = searchinfo_from_request(request)
            system_auth = request["system_authtoken"]
            session_key = searchinfo["session_key"]

            # Delegate to your service—this now returns the 'settings' dict
            docker_service = DockerConfigureService(session_key, system_auth)
            validated_settings = docker_service.configure_details(request, path_parts)

            # Return a structured REST response
            return {
                PAYLOAD: {
                    "message": "Container configurations validated successfully",
                    "updated_config": validated_settings,
                    "status": "success",
                },
                STATUS: 200,
            }
        except ApplicationError as e:
            logger.error(
                "Application error during container configuration validation: %s", str(e)
            )
            return {
                PAYLOAD: {
                    "message": str(e),
                    "status": "fail",
                },
                STATUS: 400,
            }
        except Exception as e:
            logger.error("Failed to validate container configuration: %s", str(e))
            return {
                PAYLOAD: {
                    "message": "Failed to validate container configuration.",
                    "status": "fail",
                },
                STATUS: 500,
            }

    @classmethod
    def handle_get(cls, request: dict, path_parts: list) -> dict:
        try:
            # Extract session & auth
            searchinfo = searchinfo_from_request(request)
            system_auth = request["system_authtoken"]
            session_key = searchinfo["session_key"]

            # Get current config via your service
            docker_service = DockerConfigureService(session_key, system_auth)
            config_data = docker_service.get_configure_details()

            # Return it in the REST response
            return {
                PAYLOAD: {
                    "message": "Fetched the data successfully",
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
