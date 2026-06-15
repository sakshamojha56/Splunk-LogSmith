import cexc
import requests

from util.ai_commander_util import get_scs_url, get_scs_token_from_session, generate_request_id

logger = cexc.get_logger(__name__)


def check_chat_models_available(scs_token: str, url: str) -> bool:
    """
    Calls the chat/models endpoint and returns True if models are available,
    False otherwise.

    Args:
        scs_token: The SCS authentication token
        url: The chat/models endpoint URL

    Returns:
        bool: True if models are present in the response, False otherwise
    """
    request_id = generate_request_id()
    headers = {"Authorization": f"Bearer {scs_token}", "request_id": request_id}
    try:
        response = requests.request("GET", url, headers=headers, data='')
        response.raise_for_status()
        data = response.json()

        # Check if the response contains models
        # Response format: list of models or object with model info
        if isinstance(data, list) and len(data) > 0:
            logger.info(f"Chat models available: found {len(data)} models")
            return True
        elif isinstance(data, dict):
            # Check for model field or choices field indicating models exist
            if data.get("model") or data.get("choices"):
                logger.info("Chat models available: found model in response")
                return True
        logger.info("No chat models found in response")
        return False
    except Exception as e:
        logger.error(f"Failed to check chat models availability: {e}")
        return False


def is_hosted_llm_available(searchinfo: dict) -> bool:
    """
    Checks if hosted LLM is available by calling the chat/models endpoint.

    Args:
        searchinfo: Dictionary containing session_key and splunkd_uri

    Returns:
        bool: True if hosted LLM models are available, False otherwise
    """
    try:
        logger.debug("Starting hosted LLM availability check")

        # Get chat models URL using get_scs_url
        chat_models_url, _ = get_scs_url(searchinfo)

        # Get SCS token using searchinfo
        scs_token = get_scs_token_from_session(searchinfo)

        # Check if models are available
        result = check_chat_models_available(scs_token, chat_models_url)
        logger.info(f"Hosted LLM availability check result: {result}")
        return result

    except Exception as e:
        logger.error(f"Error checking hosted LLM availability: {e}")
        return False
