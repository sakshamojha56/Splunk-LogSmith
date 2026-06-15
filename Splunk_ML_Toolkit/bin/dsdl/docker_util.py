import cexc
import json
import os
import requests
import urllib3
from util.dsdl_container_loader import ContainerConf
from util.docker_util import update_docker_data

# from util.lookups_util import get_lookups_from_splunk, parse_model_reply
from util.constants import MODEL_EXTENSION, DEFAULT_LOOKUPS_DIR

# from models.listmodels import add_model_info_to_lookup_info
from models.deletemodels import delete_model_with_splunk_rest, delete_model_from_disk
from ai_commander.constants import DEFAULT_ACCESS_TOKEN
from util.rest_bouncer import make_rest_call
from dsdl.passwords import decode_passwords
import splunklib.client as client

logger = cexc.get_logger(__name__)


def get_connection_name(searchinfo, container_type):
    container_conf = ContainerConf(searchinfo, "container_connections")
    stanza_content = container_conf.get_stanza(container_type)
    return stanza_content.get("connection_name")


def read_connection_data(searchinfo, container_type: str, connection_name):
    container_conf = ContainerConf(searchinfo, "container_connections")
    stanza_content = container_conf.get_stanza(container_type)
    safe_content = dict(stanza_content)

    if stanza_content.get("connection_name") != connection_name:
        return {}
    # Remove api_token if present
    if "api_token" in safe_content:
        safe_content.pop("api_token")

    if container_type == "kubernetes":
        auth_mode = safe_content.get("auth_mode", "").strip()

        # Mapping of secret fields by auth_mode
        auth_mode_secrets = {
            "cert-key": ["client_cert", "client_key", "cluster_ca"],
            "user-token": ["user_token"],
            "user-login": ["cluster_ca", "user_password"],
            "aws-iam": [
                "aws_cluster_name",
                "aws_access_key_id",
                "aws_secret_access_key",
                "aws_region_name",
            ],
            "service-account": ["service_account_token"],
        }

        if auth_mode in auth_mode_secrets:
            for field in auth_mode_secrets[auth_mode]:
                if not safe_content.get(field):  # if missing or empty
                    safe_content[field] = DEFAULT_ACCESS_TOKEN
    return safe_content


def read_cluster_defaults(searchinfo, container_type: str):
    """
    Reads the container_connections stanza for the given container_type without
    requiring a specific connection_name match, and returns a sanitized dict
    focusing on CPU/Memory and HPA-replica defaults while also including the
    full sanitized stanza for flexibility.
    """
    container_conf = ContainerConf(searchinfo, "container_connections")
    stanza_content = container_conf.get_stanza(container_type)
    safe_content = dict(stanza_content)
    # Remove api_token if present
    if "api_token" in safe_content:
        safe_content.pop("api_token")

    # Normalize booleans that may be strings
    def to_bool(v):
        return True if v in [True, "1", 1, "true", "True"] else False

    result = {
        "min_cpu": safe_content.get("min_cpu", ""),
        "max_cpu": safe_content.get("max_cpu", ""),
        "min_memory": safe_content.get("min_memory", ""),
        "max_memory": safe_content.get("max_memory", ""),
        "hpa_enabled": to_bool(safe_content.get("hpa_enabled", False)),
        "min_replicas": safe_content.get("min_replicas", ""),
        "max_replicas": safe_content.get("max_replicas", ""),
        "_stanza": safe_content,
    }
    return result


def read_container_hpa_enabled(searchinfo, model_name):
    """Read hpa_enabled for a specific container model from dsdl_container.conf.

    Returns True if the stored hpa_enabled value is one of "1", "true", or "yes"
    (case-insensitive), otherwise False. If the stanza or key is missing, False
    is returned.
    """
    try:
        container_conf = ContainerConf(searchinfo, "dsdl_container")
        stanza = container_conf.get_stanza(model_name)
        # Fallback to __dev__ stanza when specific model stanza is not found
        if not stanza:
            stanza = container_conf.get_stanza("__dev__")
        if not stanza:
            return False
        raw_hpa = str(stanza.get("hpa_enabled", "")).lower()
        return raw_hpa in ("1", "true", "yes")
    except Exception as e:
        logger.debug(
            "Failed to read hpa_enabled from dsdl_container for model %s: %s", model_name, e
        )
        return False


def read_dev_prod_container_data(searchinfo):
    """
    Reads stanzas from dsdl_container.conf and groups them into DEV and PROD.

    Returns:
        dict:
            {
                "DEV": { stanza_name: stanza_data, ... },
                "PROD": { stanza_name: stanza_data, ... },
                "ACTIVE" : { stanza_name: stanza_data, ... },
                "INACTIVE": : { stanza_name: stanza_data, ... }
            }
    """
    try:
        container_conf = ContainerConf(searchinfo, "dsdl_container")
        stanza_mapping = container_conf.stanza_mapping or {}

        dev_containers = {}
        prod_containers = {}
        active_containers = {}
        inactive_containers = {}

        for stanza_name, stanza_data in stanza_mapping.items():
            mode = stanza_data.get("mode", "").strip().upper()
            api_url = stanza_data.get("api_url", "").strip().upper()
            if api_url:
                active_containers[stanza_name] = stanza_data
            elif not api_url:
                inactive_containers[stanza_name] = stanza_data
            if mode == "DEV":
                dev_containers[stanza_name] = stanza_data
            elif mode == "PROD":
                prod_containers[stanza_name] = stanza_data
            else:
                logger.warning(f"Stanza [{stanza_name}] has unknown or missing mode: '{mode}'")

        result = {
            "DEV": dev_containers,
            "PROD": prod_containers,
            "ACTIVE": active_containers,
            "INACTIVE": inactive_containers,
        }
        return result

    except Exception as e:
        logger.error(f"Error reading DEV/PROD container data: {e}")
        return {"DEV": {}, "PROD": {}, "error": str(e)}


def read_docker_images(searchinfo):
    """
    Reads stanzas from docker_images.conf and returns label (title) and image.

    Args:
        searchinfo (dict): Splunk connection info, used by ContainerConf.

    Returns:
        dict: {
            stanza_name: {
                "label": <title>,
                "image": <image>
            },
            ...
        }
    """
    try:
        docker_conf = ContainerConf(searchinfo, "docker_images")
        stanza_mapping = docker_conf.stanza_mapping or {}

        result = {}
        for stanza_name, stanza_data in stanza_mapping.items():
            label = stanza_data.get("title", stanza_name).strip()
            image = stanza_data.get("image", "").strip()
            result[stanza_name] = {"label": label, "image": image}
        return result

    except Exception as e:
        logger.error(f"Error reading docker_images.conf: {e}")
        return {}


def get_container_conf_data(searchinfo):
    """Return dsdl_container stanzas, enriching/refreshing their status.

    For each stanza we:
    - Look at its api_url (if present).
    - If status != "Active", probe the api_url and set status to either
      "Active" or "Waiting for Url to start" based on the response.
    - When we detect a transition to "Active", we also persist that
      status back to dsdl_container.conf via REST so subsequent reads do
      not need to re-check.
    """

    container_conf = ContainerConf(searchinfo, "dsdl_container")
    stanza_mapping = container_conf.stanza_mapping or {}

    updated_mapping = {}
    for stanza_name, stanza_data in stanza_mapping.items():
        # Copy so we do not mutate the original mapping in-place
        stanza = dict(stanza_data)

        # Prefer the direct api_url. Only fall back to api_url_external when there
        # is still an active container id. When the container has been stopped and
        # id is cleared (""), we treat it as inactive and do not probe the
        # external URL. This prevents us from synthesizing a transient status like
        # "Waiting for Url to start" after stop_container has deliberately cleared
        # the status in dsdl_container.conf.
        raw_api_url = (stanza.get("api_url") or "").strip()
        container_id = (stanza.get("id") or "").strip()
        if raw_api_url:
            api_url = raw_api_url
        elif container_id:
            api_url = (stanza.get("api_url_external") or "").strip()
        else:
            api_url = ""

        current_status = stanza.get("status", "").strip()

        if api_url and current_status != "Active":
            new_status = check_container_api_health(api_url, searchinfo=searchinfo)
            stanza["status"] = new_status

            # Persist status only when we have positively verified the URL
            if new_status == "Active":
                try:
                    update_dsdl_container_status(searchinfo, stanza_name, new_status)
                except Exception as e:
                    logger.warning(
                        "Failed to persist status '%s' for stanza [%s]: %s",
                        new_status,
                        stanza_name,
                        e,
                    )

        updated_mapping[stanza_name] = stanza

    return updated_mapping


def delete_connection_data(searchinfo, container_type: str):
    """
    Clears all fields for a stanza while preserving container_type during the update.
    After the update, container_type is removed from the returned result.
    """
    try:

        connection_name = get_connection_name(searchinfo, container_type)
        stanza_content = read_connection_data(searchinfo, container_type, connection_name)

        if not stanza_content:
            logger.warning(f"No stanza found for container_type={container_type}")
            return {"status": "failed", "message": f"No stanza found for [{container_type}]"}

        # Clear all keys except container_type and connection_name
        emptied_config = {k: "" for k in stanza_content.keys() if k not in ["container_type"]}

        # Must keep container_type (stanza name) for the update
        emptied_config["container_type"] = container_type

        # Perform the update
        result = update_docker_data(
            splunkd_uri=searchinfo["splunkd_uri"],
            app=searchinfo["app"],
            session_key=searchinfo["session_key"],
            config_payload=emptied_config,
        )

        logger.info(f"Cleared connection data for [{container_type}]")

        # Remove container_type from returned result for cleaner output
        if "container_type" in emptied_config:
            emptied_config.pop("container_type")

        return {
            "status": "success",
            "message": f"Stanza [{container_type}] cleared.",
            "cleared_data": emptied_config,
            "result": result,
        }

    except Exception as e:
        logger.error(f"Error clearing stanza [{container_type}]: {e}")
        return {"status": "error", "message": str(e)}


def read_container_data(searchinfo):
    """
    Reads all stanzas from dsdl_container.conf and classifies them into
    active and inactive containers based on presence of 'api_url'.

    Returns:
        dict with:
            - stanzas: dict of all stanza_name -> properties
            - counts: { "active": int, "inactive": int }
    """
    try:
        container_conf = ContainerConf(searchinfo, "dsdl_container")
        stanza_mapping = container_conf.stanza_mapping or {}
        active_count = 0
        inactive_count = 0
        mode_dev_count = 0
        mode_prod_count = 0

        for stanza_name, stanza_data in stanza_mapping.items():
            api_url = stanza_data.get("api_url", "").strip()
            mode = stanza_data.get("mode", "").strip()
            if api_url:
                active_count += 1
            else:
                inactive_count += 1
            if mode == "DEV":
                mode_dev_count += 1
            else:
                mode_prod_count += 1

        result = {
            "counts": {
                "active": active_count,
                "inactive": inactive_count,
                "mode_dev": mode_dev_count,
                "mode_prod": mode_prod_count,
            }
        }
        return result

    except Exception as e:
        logger.error(f"Error reading dsdl_container.conf: {e}")
        return {"counts": {"active": 0, "inactive": 0}, "error": str(e)}


def delete_container_model(
    model_name, searchinfo=None, namespace="app", model_dir=DEFAULT_LOOKUPS_DIR, tmp=False
):
    if not tmp:
        delete_model_with_splunk_rest(model_name, searchinfo, namespace)
        return {
            "status": "deleted",
            "container_id": model_name,  # Assuming container_id is model_name or similar
        }
    else:
        delete_model_from_disk(model_name, model_dir, tmp)
        return {"status": "deleted_from_disk", "container_id": model_name}


def check_container_api_health(api_url, timeout=5, searchinfo=None):
    """Probe a container api_url and return a human-readable status string.

    - When the URL responds with the expected JSON banner from the
      DSDL container, we treat it as "Active".
    - For DNS failures, connection errors, or unexpected payloads, we
      return "Waiting for Url to start".
    - Includes Authorization header with api_token from Splunk passwords.conf
      when searchinfo is provided.
    """

    if not api_url:
        return "Waiting for Url to start"

    expected_app_name = "Splunk App for Data Science and Deep Learning"

    # Build headers with API token if searchinfo is available
    headers = {}
    if searchinfo:
        try:
            session_key = searchinfo.get("session_key")
            if session_key:
                splunk_service = client.Service(
                    token=session_key, app='Splunk_ML_Toolkit', owner='nobody', sharing='app'
                )
                secret_settings = {}
                decode_passwords(splunk_service, secret_settings)
                api_token = secret_settings.get("api_token")
                if api_token:
                    headers["Authorization"] = api_token
        except Exception as e:
            logger.warning("Failed to retrieve api_token for health check: %s", e)

    try:
        # Determine SSL verification setting from environment or use certificate if available
        # For health probes against self-signed certs, verification may need to be disabled
        ssl_verify = os.environ.get('DSDL_SSL_VERIFY', '').lower() not in ('false', '0', 'no')
        cert_path = os.environ.get('DSDL_CA_CERT_PATH')

        if cert_path and os.path.exists(cert_path):
            verify_param = cert_path
        elif not ssl_verify:
            # Suppress InsecureRequestWarning when verification is intentionally disabled
            urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
            verify_param = False  # nosec B501 - intentionally disabled for health probe with self-signed certs
        else:
            verify_param = True

        resp = requests.get(api_url, timeout=timeout, verify=verify_param, headers=headers)
        text = resp.text or ""

        if resp.status_code == 200:
            # Prefer structured check: try to parse JSON and validate the 'app' field.
            try:
                data = resp.json()
            except ValueError:
                data = None

            if isinstance(data, dict) and data.get("app") == expected_app_name:
                return "Active"

            # Some deployments return the banner as a JSON-encoded *string* rather than
            # an object (e.g. "{\"app\": ...}"). In that case, fallback to a simple
            # substring check for the app name to avoid depending on exact escaping.
            if expected_app_name in text:
                return "Active"
    except requests.RequestException as e:
        logger.warning("Health check failed for api_url=%s: %s", api_url, e)
        return "Waiting for Url to start"

    return "Waiting for Url to start"


def update_dsdl_container_status(searchinfo, stanza_name, status):
    """Persist a status field for a dsdl_container stanza via Splunk REST."""

    splunkd_uri = searchinfo.get("splunkd_uri")
    app = searchinfo.get("app")
    session_key = searchinfo.get("session_key")

    if not (splunkd_uri and app and session_key):
        raise ValueError("Missing splunkd_uri, app, or session_key in searchinfo")

    base_url = (
        f"{splunkd_uri}/servicesNS/nobody/{app}/configs/conf-dsdl_container/{stanza_name}"
    )
    logger.debug(
        "Updating dsdl_container stanza [%s] status to '%s' via %s",
        stanza_name,
        status,
        base_url,
    )

    reply = make_rest_call(
        session_key=session_key,
        method="POST",
        url=base_url,
        postargs={"status": status},
        jsonargs=None,
        getargs=None,
        rawResult=False,
    )

    logger.debug("Status update reply for [%s]: %s", stanza_name, reply)
    return reply
