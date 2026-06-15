import cexc
import json
from util.rest_bouncer import make_rest_call

logger = cexc.get_logger(__name__)


def update_docker_data(splunkd_uri, app, session_key, config_payload):
    """Update container_connections.conf via REST.

    - Uses container_type as the stanza name (e.g., 'docker', 'kubernetes').
    - Clears keys that existed previously but are omitted from the new payload
      by sending them as empty strings in the POST.
    """
    try:

        if isinstance(config_payload, str):
            config_payload = json.loads(config_payload)

        cleaned_config = dict(config_payload)
        stanza_name = cleaned_config.get("container_type", "default")

        # Remove container_type (not stored as INI key, only used for stanza)
        cleaned_config.pop("container_type", None)

        # Base URL for this stanza
        base_url = f"{splunkd_uri}/servicesNS/nobody/{app}/configs/conf-container_connections/{stanza_name}"

        # Fetch existing stanza to identify keys that should be cleared
        try:
            get_url = base_url + "?output_mode=json"
            existing_reply = make_rest_call(
                session_key=session_key,
                method="GET",
                url=get_url,
                postargs=None,
                jsonargs=None,
                getargs=None,
                rawResult=False,
            )
            existing_content = {}
            # existing_reply is a dict with a 'content' string from Splunk REST
            if isinstance(existing_reply, dict) and "content" in existing_reply:
                try:
                    parsed = json.loads(existing_reply["content"])
                    if (
                        isinstance(parsed, dict)
                        and parsed.get("entry")
                        and "content" in parsed["entry"][0]
                    ):
                        existing_content = parsed["entry"][0]["content"] or {}
                except Exception as parse_err:
                    logger.warning(
                        f"Failed to parse existing stanza content for [{stanza_name}]: {parse_err}"
                    )
        except Exception as e:
            logger.warning(f"Failed to read existing stanza [{stanza_name}] before update: {e}")
            existing_content = {}

        # For any key that exists in the stanza but is missing from the new payload,
        # explicitly clear it by sending an empty string. This ensures that options
        # like container_enable_https are removed when omitted from the payload.
        for key in existing_content.keys():
            if key not in cleaned_config:
                cleaned_config[key] = ""

        reply = make_rest_call(
            session_key=session_key,
            method="POST",
            url=base_url,
            postargs=cleaned_config,
            jsonargs=None,
            getargs=None,
            rawResult=False,
        )

        logger.debug(f"REST call reply: {reply}")
        return f"Docker configuration saved successfully under stanza [{stanza_name}]."

    except Exception as e:
        logger.error(f"Error updating docker.conf: {e}")
        raise
