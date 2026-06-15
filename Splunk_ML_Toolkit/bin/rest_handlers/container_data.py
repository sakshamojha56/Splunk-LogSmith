import cexc
from dsdl.configure_handler import DockerConfigureService
from util.searchinfo_util import searchinfo_from_request
from ai_commander.constants import PAYLOAD, STATUS
from dsdl.docker_util import get_container_conf_data

logger = cexc.get_logger(__name__)


class ContainerData(object):
    @classmethod
    def handle_get(cls, request: dict, path_parts: list) -> dict:
        try:
            searchinfo = searchinfo_from_request(request)
            config_data = get_container_conf_data(searchinfo)

            # Return it in the REST response
            return {
                PAYLOAD: {
                    "message": "Fetched the container successfully",
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
