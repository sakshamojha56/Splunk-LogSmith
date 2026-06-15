"""
REST handler for Docker configuration
"""

import cexc
import json
from util.searchinfo_util import searchinfo_from_request
from util import docker_util
from dsdl.docker_util import read_connection_data, delete_connection_data, read_cluster_defaults
from util.dsdl_container_loader import ContainerConf
from ai_commander.constants import PAYLOAD, STATUS

logger = cexc.get_logger(__name__)


class ContainerConnection(object):
    @classmethod
    def handle_post(cls, request, path_parts):
        """
        Handles POST requests from frontend Docker page
        """
        try:

            # Extract Splunk info
            searchinfo = searchinfo_from_request(request)
            splunkd_uri = searchinfo.get("splunkd_uri")
            app = searchinfo.get("app")
            session_key = searchinfo.get("session_key")

            # Frontend sends payload as a JSON string. It may be wrapped or flat.
            raw_payload = request.get("payload", "{}")
            payload_dict = json.loads(raw_payload)

            # Support both flat and nested payload formats
            config_payload = payload_dict.get("payload", payload_dict)

            # Validate that the connection_name is not already used for this container_type
            container_type = config_payload.get("container_type")
            new_connection_name = (config_payload.get("connection_name") or "").strip()

            # Check if this is an edit (is_edit flag) or if we should skip duplicate check
            is_edit = config_payload.get("is_edit", False)

            if container_type and new_connection_name and not is_edit:
                try:
                    container_conf = ContainerConf(searchinfo, "container_connections")
                    existing_stanza = container_conf.get_stanza(container_type)
                    existing_connection_name = (
                        (existing_stanza.get("connection_name") or "").strip()
                        if existing_stanza
                        else ""
                    )
                    if (
                        existing_connection_name
                        and existing_connection_name == new_connection_name
                    ):
                        # Duplicate connection name for this container_type; surface as REST error
                        return {
                            PAYLOAD: {
                                'message': f"Connection name '{new_connection_name}' already exists for cluster '{container_type}'",
                                'status': 'fail',
                            },
                            STATUS: 400,
                        }
                except Exception:
                    # If validation fails, fall back to normal save behavior
                    logger.debug(
                        "Unable to validate duplicate connection_name for container_type=%s",
                        container_type,
                    )

            # Update docker.conf
            result = docker_util.update_docker_data(
                splunkd_uri=splunkd_uri,
                app=app,
                session_key=session_key,
                config_payload=config_payload,
            )

            # Ensure we return a flat dict with "status" and "message"
            return {
                PAYLOAD: {
                    'message': 'Container configurations updated successfully',
                    'result': result,  # Return updated config
                    "status": 'success',
                },
                STATUS: 200,
            }

        except Exception as e:
            logger.exception("Error saving configuration")
            return {
                PAYLOAD: {
                    'message': 'Failed to save settings',
                    "status": 'fail',
                },
                STATUS: 500,
            }

    @classmethod
    def handle_get(cls, request: dict, path_parts: list) -> dict:
        try:
            # Read the config (no path needed anymore)
            searchinfo = searchinfo_from_request(request)
            docker_index = None

            # Find the index of 'aicommander' in the path
            for i, part in enumerate(path_parts):
                if part.lower() == "container_connection":
                    docker_index = i
                    break

            if docker_index is None:
                return {
                    PAYLOAD: {
                        "message": "'container connection' not found in the path",
                        "status": "fail",
                    },
                    STATUS: 400,
                }

            # Support two forms:
            # 1) defaults by cluster: .../container_connection/<container_type>
            # 2) specific connection: .../container_connection/<container_type>/<connection_name>
            if path_parts[-1] != "container_connection":
                container_type = path_parts[-1]
                # If there are two trailing parts, treat the last as connection_name
                if len(path_parts) > 2 and path_parts[-2] not in ["container_connection"]:
                    container_type = path_parts[-2]
                    connection_name = path_parts[-1]
                    edit_data = read_connection_data(
                        searchinfo, container_type, connection_name
                    )
                    if not edit_data:
                        return {
                            PAYLOAD: {
                                "message": f"Connection Name '{connection_name}' not present in container_type '{container_type}'",
                                "status": "fail",
                            },
                            STATUS: 400,
                        }
                    return {
                        PAYLOAD: {
                            'mesage': "Container configuration fetched successfully",
                            'config': edit_data,
                            "status": 'success',
                        },
                        'status': 200,
                    }
                else:
                    # Only container_type provided → return cluster defaults for that type
                    cluster_defaults = read_cluster_defaults(searchinfo, container_type)
                    return {
                        PAYLOAD: {
                            'mesage': "Cluster defaults fetched successfully",
                            'config': cluster_defaults,
                            "status": 'success',
                        },
                        'status': 200,
                    }

        except Exception as e:
            logger.error(f"Error reading configuration: {str(e)}")
            return {
                PAYLOAD: {
                    'message': "Failed to read configuration.",
                    "status": 'fail',
                },
                STATUS: 500,
            }

    @classmethod
    def handle_put(cls, request, path_parts):
        """
        Handles PUT requests for updating existing container connections
        """
        try:
            # Extract Splunk info
            searchinfo = searchinfo_from_request(request)
            splunkd_uri = searchinfo.get("splunkd_uri")
            app = searchinfo.get("app")
            session_key = searchinfo.get("session_key")

            # Frontend sends payload as a JSON string. It may be wrapped or flat.
            raw_payload = request.get("payload", "{}")
            payload_dict = json.loads(raw_payload)

            # Support both flat and nested payload formats
            config_payload = payload_dict.get("payload", payload_dict)

            # Update docker.conf
            result = docker_util.update_docker_data(
                splunkd_uri=splunkd_uri,
                app=app,
                session_key=session_key,
                config_payload=config_payload,
            )

            # Ensure we return a flat dict with "status" and "message"
            return {
                PAYLOAD: {
                    'message': 'Container configurations updated successfully',
                    'result': result,
                    "status": 'success',
                },
                STATUS: 200,
            }

        except Exception as e:
            logger.exception("Error updating configuration")
            return {
                PAYLOAD: {
                    'message': 'Failed to update settings',
                    "status": 'fail',
                },
                STATUS: 500,
            }

    @classmethod
    def handle_delete(cls, request: dict, path_parts: list) -> dict:
        try:
            # Read the config (no path needed anymore)
            searchinfo = searchinfo_from_request(request)
            docker_index = None

            # Find the index of 'aicommander' in the path
            for i, part in enumerate(path_parts):
                if part.lower() == "container_connection":
                    docker_index = i
                    break

            if docker_index is None:
                return {
                    "payload": {
                        "message": "'container connection' not found in the path",
                        "status": "fail",
                    },
                    STATUS: 400,
                }

            container_type = path_parts[-2]
            delete_data = delete_connection_data(searchinfo, container_type)
            return {
                'payload': {
                    'message': 'Container configuration deleted successfully',
                    'config': delete_data,
                    "status": 'success',
                },
                STATUS: 200,
            }

        except Exception as e:
            logger.error(f"Error reading configuration: {str(e)}")
            return {
                'payload': {
                    'message': "Failed to delete configuration.",
                    "status": 'fail',
                },
                STATUS: 500,
            }
