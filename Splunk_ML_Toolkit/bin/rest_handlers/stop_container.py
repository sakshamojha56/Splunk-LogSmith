import cexc
from dsdl.configure_handler import DockerConfigureService
from dsdl.docker_util import read_docker_images
from util.searchinfo_util import searchinfo_from_request
from models import listmodels
from ai_commander.constants import PAYLOAD, STATUS
from util.telemetry_util import log_uuid, log_container_stop

logger = cexc.get_logger(__name__)


class StopContainer(object):
    @classmethod
    def handle_post(cls, request: dict, path_parts: list) -> dict:
        try:
            # Parse out Splunk session & auth
            searchinfo = searchinfo_from_request(request)
            system_auth = request["system_authtoken"]
            session_key = searchinfo["session_key"]

            # Delegate to your service—this now returns the 'settings' dict
            docker_service = DockerConfigureService(session_key, system_auth)
            stopped_container = docker_service.stop_container(request, path_parts, searchinfo)

            container_id = None
            try:
                container_id = (
                    stopped_container.get("container_id")
                    if isinstance(stopped_container, dict)
                    else None
                )
            except Exception:
                container_id = None
            log_uuid()
            log_container_stop(container_id, "success")

            # Return a structured REST response
            return {
                STATUS: 200,
                PAYLOAD: {
                    "status": "success",
                    "messages": [
                        {
                            "type": "INFO",
                            "text": f"Container {stopped_container.get('container_id')} stopped successfully",
                        }
                    ],
                    "stopped_container": stopped_container,
                },
            }

        except Exception as e:
            # Unexpected errors
            logger.error("Failed to stop the container: %s", str(e))
            log_uuid()
            log_container_stop(None, "failure")
            return {
                PAYLOAD: {
                    "message": "Failed to stop the container.",
                    "status": "failure",
                },
                STATUS: 500,
            }

    @classmethod
    def handle_get(cls, request, path_parts):
        """
        Handles GET requests

        Args:
            request: a dictionary providing information about the request
            path_parts: a list of strings describing the request path
        """
        try:
            # Extract Splunk search info
            searchinfo = searchinfo_from_request(request)

            # Read docker images
            docker_images = read_docker_images(searchinfo)
            if not docker_images:
                msg = "No Docker images found in docker_images.conf"
                logger.warning(msg)
                return {PAYLOAD: {"error_message": msg, "status": "failure"}, STATUS: 404}

            # Return the docker images in payload
            return {
                PAYLOAD: {
                    "message": "Retrieved Docker images successfully",
                    "docker_images": docker_images,
                    "status": "success",
                },
                STATUS: 200,
            }

        except Exception as e:
            logger.error("Failed to retrieve Docker images: %s", str(e))
            return {
                PAYLOAD: {
                    "message": "Failed to retrieve Docker images.",
                    "status": "failure",
                },
                STATUS: 500,
            }
