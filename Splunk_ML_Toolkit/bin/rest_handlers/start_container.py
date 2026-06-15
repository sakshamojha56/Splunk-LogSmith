import cexc
from dsdl.configure_handler import DockerConfigureService
from util.searchinfo_util import searchinfo_from_request
from ai_commander.constants import PAYLOAD, STATUS
import traceback
from dsdl.docker_util import read_container_data, delete_container_model
from util.telemetry_util import log_uuid, log_container_start

logger = cexc.get_logger(__name__)


class StartContainer(object):
    @classmethod
    def handle_post(cls, request: dict, path_parts: list) -> dict:
        try:
            # Parse out Splunk session & auth
            searchinfo = searchinfo_from_request(request)
            system_auth = request["system_authtoken"]
            session_key = searchinfo["session_key"]

            # Delegate to your service—this now returns the 'settings' dict
            docker_service = DockerConfigureService(session_key, system_auth)
            updated_settings = docker_service.start_container(searchinfo, request, path_parts)

            container_id = None
            try:
                container_id = (
                    updated_settings.get("container_id")
                    if isinstance(updated_settings, dict)
                    else None
                )
            except Exception:
                container_id = None
            log_uuid()
            log_container_start(container_id, "success")

            # Return a structured REST response
            return {
                PAYLOAD: {
                    "message": "The container started successfully",
                    "updated_config": updated_settings,
                    "status": "success",
                },
                STATUS: 200,
            }

        except Exception as e:
            # Unexpected errors
            logger.error("Failed to update configuration")
            log_uuid()
            log_container_start(None, "failure")
            return {
                PAYLOAD: {
                    "message": f"Failed to start the container: {str(e)}",
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

            # Get active/inactive container counts
            searchinfo = searchinfo_from_request(request)
            for i, part in enumerate(path_parts):
                if part.lower() == "start_container":
                    startConatiner_index = i
                    break

            if startConatiner_index is None:
                return {
                    PAYLOAD: {
                        "message": "'startConatiner' not found in the path",
                        "status": "success",
                    },
                    STATUS: 400,
                }
            if path_parts[-1].lower() == "start_container":
                container_status = read_container_data(searchinfo)
                return {
                    PAYLOAD: {
                        "message": "Fetched the container status stanzas successfully",
                        "container_status": container_status,
                        "status": "success",
                    },
                    STATUS: 200,
                }
            # elif path_parts[-1] != "start_container":
            #     container_model = path_parts[-1]
            #     edit_data = get_container_edit_data(searchinfo, container_model)
            #     return {
            #         PAYLOAD: {
            #             "message": "Received the container edit data successfully",
            #             "container_status": edit_data,
            #             "status": "success",
            #         },
            #         STATUS: 200,
            #     }

        except Exception as e:
            logger.error(f"Error handling GET in DsdlContainerstatus: {e}")
            return {
                PAYLOAD: {"message": "Failed to get the data.", "status": "failure"},
                STATUS: 500,
            }

    @classmethod
    def handle_delete(cls, request: dict, path_parts: list) -> dict:
        try:
            searchinfo = searchinfo_from_request(request)
            if path_parts[-1].lower() == "start_container":
                return {
                    PAYLOAD: {
                        'message': "Service name and model name required to delete a model.",
                        "status": "fail",
                    },
                    STATUS: 400,
                }
            elif path_parts[-1].lower() != "start_container":
                model_name = path_parts[-1]
                delete_data = delete_container_model(model_name, searchinfo=searchinfo)
                return {
                    PAYLOAD: {
                        'message': 'Model deleted successfully',
                        'delete_data': delete_data,
                        "status": "success",
                    },
                    STATUS: 200,
                }

        except Exception as e:
            logger.error(
                f"Error deleting model from configuration: {str(traceback.format_exc())}"
            )
            return {
                PAYLOAD: {'message': "Failed to delete model.", "status": "fail"},
                STATUS: 500,
            }
