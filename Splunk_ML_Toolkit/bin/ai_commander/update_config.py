import json
import copy
import traceback
import cexc
import os
import requests

from util.ai_commander_util import get_documents_from_kv_store
from ai_commander.constants import (
    AZUREOPENAI,
    AZURE_OPENEAI_VERSION,
    CONFIG_DATA,
    ANTHROPIC,
    ANTHROPIC_API_VERSION,
    BEDROCK,
    GEMINI,
    GROQ,
    MODELS,
    OLLAMA,
    OPENAI,
    ENDPOINT,
    ACCESS_TOKEN,
    VALUE,
    SPLUNK_HOSTED_LLM,
)
from util.ai_commander_util import fetch_model_mapping
import re

logger = cexc.get_logger(__name__)

ssl_cert_file = os.environ.get("SSL_CERT_FILE")
if ssl_cert_file and not os.path.exists(ssl_cert_file):
    logger.warning(
        "Environment variable SSL_CERT_FILE is set to a non-existent path: %s. Removing it to prevent SSL errors.",
        ssl_cert_file,
    )
    os.environ.pop("SSL_CERT_FILE")


def get_data(searchinfo: dict, collection_name: str) -> dict:
    """
    Retrieves configuration data from a KV store or defaults to CONFIG_DATA.

    Args:
        searchinfo (dict):
            Search-related metadata.
        collection_name (str):
            The name of the collection in the KV store.

    Returns:
        dict:
            The retrieved or default configuration data.
    """
    final_data = get_documents_from_kv_store(searchinfo, collection_name)
    if not final_data:
        config = json.loads(CONFIG_DATA)
        final_data = config.get("llm_connections", {})
    final_data.pop("_user", None)
    final_data.pop("_key", None)
    return final_data


def deep_merge_ordered(default: dict, kvstore: dict) -> dict:
    """
    Merge default config into kvstore config:
    - If key exists in default but not kvstore → add it.
    - If key exists in both → recurse/merge.
    - If key exists only in kvstore → keep it.
    """
    merged = copy.deepcopy(kvstore)  # start with kvstore so we never drop its keys

    for key, default_val in default.items():
        if key not in kvstore:
            # Key only in default → add it
            merged[key] = copy.deepcopy(default_val)
        else:
            kv_val = kvstore[key]

            if isinstance(default_val, dict) and isinstance(kv_val, dict):
                # Special case: leaf dict with only {"value": ...}
                if set(default_val.keys()) == {"value"}:
                    # Prefer kvstore value if it exists, otherwise fallback to default
                    merged[key] = (
                        copy.deepcopy(kv_val)
                        if kv_val is not None
                        else copy.deepcopy(default_val)
                    )
                else:
                    # Recurse to merge deeper dicts
                    merged[key] = deep_merge_ordered(default_val, kv_val)
            else:
                # Type mismatch or simple value → keep kvstore’s version
                merged[key] = copy.deepcopy(kv_val)

    return merged


def normalize_key(key: str) -> str:
    """Normalize key by lowercasing and replacing spaces with underscores."""
    return re.sub(r'\s+', '_', key.strip().lower())


def to_label(key: str) -> str:
    """Convert normalized key (snake_case) to human-readable Camel Case label."""
    return " ".join(word.capitalize() for word in key.split('_'))


def merge_provider(meta_dict, kv_dict):
    if not isinstance(meta_dict, dict):
        return meta_dict

    merged = {}
    kv_map = {normalize_key(k): k for k in kv_dict} if isinstance(kv_dict, dict) else {}

    for m_key, m_val in meta_dict.items():
        m_key_norm = normalize_key(m_key)
        kv_val = kv_dict[kv_map[m_key_norm]] if m_key_norm in kv_map else {}

        if isinstance(m_val, dict):
            # Case 1: Leaf node with 'value'
            if "value" in m_val:
                merged_leaf = copy.deepcopy(m_val)

                # Pull in KV 'value' if present
                if isinstance(kv_val, dict) and "value" in kv_val:
                    merged_leaf["value"] = kv_val["value"]

                # ✅ Add label if missing
                if "label" not in merged_leaf:
                    merged_leaf["label"] = to_label(m_key_norm)

                merged[m_key_norm] = merged_leaf

            # Case 2: 'models' key — merge each model
            elif m_key_norm == "models":
                merged[m_key_norm] = {}
                if isinstance(m_val, dict):
                    for model_name, model_meta in m_val.items():
                        kv_model = (
                            kv_val.get(model_name, {}) if isinstance(kv_val, dict) else {}
                        )
                        merged[m_key_norm][model_name] = merge_provider(model_meta, kv_model)
                if isinstance(kv_val, dict):
                    for model_name, model_data in kv_val.items():
                        if model_name not in merged[m_key_norm]:
                            merged[m_key_norm][model_name] = merge_provider(model_data, {})

            # Case 3: Nested dict (not leaf)
            else:
                merged[m_key_norm] = merge_provider(
                    m_val, kv_val if isinstance(kv_val, dict) else {}
                )

        else:
            merged[m_key_norm] = kv_val if kv_val not in (None, {}) else m_val

    # Add extra KV keys not in metadata
    for kv_key, kv_val in kv_dict.items():
        kv_key_norm = normalize_key(kv_key)
        if kv_key_norm not in merged:
            merged[kv_key_norm] = merge_provider(kv_val, {})
            # ✅ Add label if missing
            if (
                isinstance(merged[kv_key_norm], dict)
                and "label" not in merged[kv_key_norm]
                and "value" in merged[kv_key_norm]
            ):
                merged[kv_key_norm]["label"] = to_label(kv_key_norm)

    return merged


def merge_metadata_with_kv(meta_root, kv_root):
    merged = {}
    for provider_name, provider_meta in meta_root.items():
        kv_provider = kv_root.get(provider_name, {})
        merged[provider_name] = merge_provider(provider_meta, kv_provider)
    return merged


def _get_json_response(url: str, headers: dict, timeout: int = 30, params: dict = None):
    """
    Fetch JSON via requests GET.
    """
    try:
        response = requests.get(
            url,
            headers=headers,
            params=params,
            timeout=timeout,
        )
        response.raise_for_status()
        try:
            return response.json()
        except ValueError:
            logger.error("Requests GET returned a non-JSON response for %s", url)
            logger.error(str(traceback.format_exc()))
            return None
    except Exception:
        logger.warning("HTTP GET failed for %s", url)
        logger.error(str(traceback.format_exc()))
        return None


def are_models_available(endpoint: str) -> list:
    """
    Checks if models are available at the given Ollama service endpoint.

    Args:
        endpoint (str):
            The API endpoint for checking available models.

    Returns:
        list:
            A list of available models.
    """
    models = []
    try:
        ollama_status_url = endpoint.split('/v1')[0].rstrip('/')
        endpoint_url = f"{ollama_status_url}/api/tags"
        response = requests.get(endpoint_url, timeout=30)
        response.raise_for_status()  # Raise an exception for HTTP errors
        data = response.json()
        models = data.get("models", [])
    except Exception:
        logger.error(str(traceback.format_exc()))
    return models


def _derive_models_endpoint(endpoint: str, provider: str) -> str:
    """Build the models endpoint from the configured inference endpoint."""
    endpoint = (endpoint or "").strip()

    if provider == OPENAI:
        default_endpoint = "https://api.openai.com/v1/models"
        if not endpoint:
            return default_endpoint
        normalized_endpoint = endpoint.rstrip("/")
        if normalized_endpoint.endswith("/v1/models"):
            return normalized_endpoint
        if "/v1/" in normalized_endpoint:
            return f"{normalized_endpoint.split('/v1/')[0].rstrip('/')}/v1/models"
        return default_endpoint

    if provider == ANTHROPIC:
        default_endpoint = "https://api.anthropic.com/v1/models"
        if not endpoint:
            return default_endpoint
        normalized_endpoint = endpoint.rstrip("/")
        if normalized_endpoint.endswith("/v1/models"):
            return normalized_endpoint
        if "/v1/" in normalized_endpoint:
            return f"{normalized_endpoint.split('/v1/')[0].rstrip('/')}/v1/models"
        return default_endpoint

    if provider == GROQ:
        default_endpoint = "https://api.groq.com/openai/v1/models"
        if not endpoint:
            return default_endpoint
        normalized_endpoint = endpoint.rstrip("/")
        if normalized_endpoint.endswith("/openai/v1/models"):
            return normalized_endpoint
        if "/openai/v1/" in normalized_endpoint:
            return f"{normalized_endpoint.split('/openai/v1/')[0].rstrip('/')}/openai/v1/models"
        return default_endpoint

    if provider == AZUREOPENAI:
        if not endpoint:
            return ""
        normalized_endpoint = endpoint.rstrip("/")
        if "/openai/" in normalized_endpoint:
            normalized_endpoint = normalized_endpoint.split("/openai/")[0].rstrip("/")
        return f"{normalized_endpoint}/openai/models"

    if provider == GEMINI:
        default_endpoint = "https://generativelanguage.googleapis.com/v1beta/models"
        if not endpoint:
            return default_endpoint
        normalized_endpoint = endpoint.rstrip("/")
        if normalized_endpoint.endswith("/v1beta/models"):
            return normalized_endpoint
        if "/v1beta/" in normalized_endpoint:
            return f"{normalized_endpoint.split('/v1beta/')[0].rstrip('/')}/v1beta/models"
        return default_endpoint

    return endpoint


def _strip_gemini_model_prefix(model_name: str) -> str:
    if not model_name:
        return model_name
    return model_name.split("models/", 1)[-1]


def _update_provider_models(
    config: dict, provider: str, fetched_models: list, model_template: dict
) -> dict:
    """Replace provider models with the fetched list while preserving saved field structure."""
    if not fetched_models:
        logger.warning(
            f"No live models fetched for provider {provider}; keeping fallback config."
        )
        return copy.deepcopy(config)

    provider_models = config[provider][MODELS]
    fetched_model_names = {model_info["name"] for model_info in fetched_models}

    for model_name in list(provider_models.keys()):
        if model_name not in fetched_model_names:
            del provider_models[model_name]

    for model_info in fetched_models:
        model_name = model_info["name"]

        if model_name not in provider_models:
            provider_models[model_name] = copy.deepcopy(model_template)

    config[provider][MODELS] = provider_models
    return copy.deepcopy(config)


def fetch_anthropic_models(endpoint: str, api_key: str, timeout: int = 30) -> list:
    """Fetch all Anthropic model ids from GET /v1/models."""
    if not api_key:
        return []

    models_endpoint = _derive_models_endpoint(endpoint, ANTHROPIC)
    headers = {
        "x-api-key": api_key,
        "anthropic-version": ANTHROPIC_API_VERSION,
    }

    fetched_models = []
    after_id = None

    while True:
        params = {"limit": 1000}
        if after_id:
            params["after_id"] = after_id

        payload = _get_json_response(
            models_endpoint,
            headers=headers,
            params=params,
            timeout=timeout,
        )
        if not payload:
            return []
        data = payload.get("data", [])
        fetched_models.extend([{"name": model["id"]} for model in data if model.get("id")])

        if not payload.get("has_more"):
            break

        after_id = payload.get("last_id")
        if not after_id:
            break

    return fetched_models


def fetch_openai_models(endpoint: str, api_key: str, timeout: int = 30) -> list:
    """Fetch OpenAI model ids from GET /v1/models."""
    if not api_key:
        return []

    models_endpoint = _derive_models_endpoint(endpoint, OPENAI)
    headers = {"Authorization": f"Bearer {api_key}"}

    payload = _get_json_response(
        models_endpoint,
        headers=headers,
        timeout=timeout,
    )
    if not payload:
        return []

    return [{"name": model["id"]} for model in payload.get("data", []) if model.get("id")]


def fetch_groq_models(endpoint: str, api_key: str, timeout: int = 30) -> list:
    """Fetch Groq model ids from GET /openai/v1/models."""
    if not api_key:
        return []

    models_endpoint = _derive_models_endpoint(endpoint, GROQ)
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    payload = _get_json_response(
        models_endpoint,
        headers=headers,
        timeout=timeout,
    )
    if not payload:
        return []

    return [{"name": model["id"]} for model in payload.get("data", []) if model.get("id")]


def fetch_azureopenai_models(
    endpoint: str, api_key: str, api_version: str, timeout: int = 30
) -> list:
    """Fetch Azure OpenAI deployment names when exposed by the endpoint.

    The rest of the Azure flow uses the selected value as a deployment name
    (for example /openai/deployments/{model}/...), so base model ids returned
    by GET /openai/models are not safe dropdown values. If the endpoint does
    not expose deployment-specific names, return [] and let the static config
    remain in place as the fallback.
    """
    if not api_key or not endpoint:
        return []

    models_endpoint = _derive_models_endpoint(endpoint, AZUREOPENAI)
    headers = {"api-key": api_key}
    params = {"api-version": api_version or "2024-10-21"}

    payload = _get_json_response(
        models_endpoint,
        headers=headers,
        params=params,
        timeout=timeout,
    )
    if not payload:
        return []

    model_items = payload.get("data", [])
    fetched_models = []
    for model in model_items:
        model_id = model.get("id")
        capabilities = model.get("capabilities", {})
        supports_inference = capabilities.get("inference", True)
        deployment_name = (
            model.get("deployment_name")
            or model.get("deploymentName")
            or model.get("deployment")
        )
        if not deployment_name:
            candidate_name = model.get("name")
            if candidate_name and (not model_id or candidate_name != model_id):
                deployment_name = candidate_name

        if deployment_name and supports_inference:
            fetched_models.append({"name": deployment_name})
    return fetched_models


def fetch_gemini_models(endpoint: str, api_key: str, timeout: int = 30) -> list:
    """Fetch Gemini model ids from GET /v1beta/models."""
    if not api_key:
        return []

    models_endpoint = _derive_models_endpoint(endpoint, GEMINI)
    fetched_models = []
    page_token = None

    while True:
        params = {"key": api_key, "pageSize": 1000}
        if page_token:
            params["pageToken"] = page_token

        payload = _get_json_response(
            models_endpoint,
            headers={},
            params=params,
            timeout=timeout,
        )
        if not payload:
            return []

        for model in payload.get("models", []):
            model_name = _strip_gemini_model_prefix(model.get("name", ""))
            supported_methods = model.get("supportedGenerationMethods")
            if supported_methods is None:
                supported_methods = model.get("supportedActions", [])
            if model_name and "generateContent" in supported_methods:
                fetched_models.append({"name": model_name})

        page_token = payload.get("nextPageToken")
        if not page_token:
            break

    return fetched_models


def update_bedrock_models(config: dict, psc_resp: dict, gpt_4o_mini_settings: dict) -> dict:
    """
    Updates the Bedrock models in the configuration based on the PSC response.

    Args:
        config (dict):
            The current configuration.
        psc_resp (dict):
            The response from the PSC compiler.
        gpt_4o_mini_settings (dict):
            The default settings for the "gpt-4o-mini" model.

    Returns:
        dict:
            The updated configuration.
    """
    bedrock_section_models = config[BEDROCK][MODELS]
    model_names = set(psc_resp[BEDROCK][MODELS].keys())
    models_to_remove = set(bedrock_section_models.keys()) - model_names
    for model_name in models_to_remove:
        del bedrock_section_models[model_name]

    for model_name in model_names:
        if model_name not in bedrock_section_models:
            bedrock_section_models[model_name] = copy.deepcopy(gpt_4o_mini_settings)

    config[BEDROCK][MODELS] = bedrock_section_models
    return config


def update_ollama_models(
    config: dict, data_to_update: dict, gpt_4o_mini_settings: dict
) -> dict:
    """
    Updates the Ollama models in the configuration based on available models.

    Args:
        config (dict):
            The current configuration.
        data_to_update (dict):
            Data containing the service settings and endpoint.
        gpt_4o_mini_settings (dict):
            The default settings for the "gpt-4o-mini" model.

    Returns:
        dict:
            The updated configuration.
    """
    endpoint = data_to_update["servicesettings"][ENDPOINT][VALUE]
    ollama_models = are_models_available(endpoint)

    if len(ollama_models) > 0:
        ollama_section_models = config[OLLAMA][MODELS]
        for model in ollama_models:
            model_name = model["name"]
            if model_name not in ollama_section_models:
                ollama_section_models[model_name] = copy.deepcopy(gpt_4o_mini_settings)
        config[OLLAMA][MODELS] = ollama_section_models
        return copy.deepcopy(config)
    else:
        logger.warning(f"No models available for Ollama service at {endpoint}")
        config[OLLAMA][ENDPOINT][VALUE] = data_to_update["servicesettings"][ENDPOINT][VALUE]
        config[OLLAMA][MODELS] = {}
        return copy.deepcopy(config)


def update_anthropic_models(
    config: dict, data_to_update: dict, gpt_4o_mini_settings: dict
) -> dict:
    """Update Anthropic models using GET /v1/models and fallback to static config on failure."""
    service_settings = data_to_update.get("servicesettings", {})
    endpoint = service_settings.get(ENDPOINT, {}).get(VALUE, "")
    api_key = service_settings.get(ACCESS_TOKEN, {}).get(VALUE, "")
    timeout = int(service_settings.get("request_timeout", {}).get(VALUE, 30))

    fetched_models = fetch_anthropic_models(endpoint, api_key, timeout=timeout)
    return _update_provider_models(config, ANTHROPIC, fetched_models, gpt_4o_mini_settings)


def update_openai_models(
    config: dict, data_to_update: dict, gpt_4o_mini_settings: dict
) -> dict:
    """Update OpenAI models using GET /v1/models and fallback to static config on failure."""
    service_settings = data_to_update.get("servicesettings", {})
    endpoint = service_settings.get(ENDPOINT, {}).get(VALUE, "")
    api_key = service_settings.get(ACCESS_TOKEN, {}).get(VALUE, "")
    timeout = int(service_settings.get("request_timeout", {}).get(VALUE, 30))

    fetched_models = fetch_openai_models(endpoint, api_key, timeout=timeout)
    return _update_provider_models(config, OPENAI, fetched_models, gpt_4o_mini_settings)


def update_groq_models(config: dict, data_to_update: dict, gpt_4o_mini_settings: dict) -> dict:
    """Update Groq models using GET /openai/v1/models and fallback to static config on failure."""
    service_settings = data_to_update.get("servicesettings", {})
    endpoint = service_settings.get(ENDPOINT, {}).get(VALUE, "")
    api_key = service_settings.get(ACCESS_TOKEN, {}).get(VALUE, "")
    timeout = int(service_settings.get("request_timeout", {}).get(VALUE, 30))

    fetched_models = fetch_groq_models(endpoint, api_key, timeout=timeout)
    return _update_provider_models(config, GROQ, fetched_models, gpt_4o_mini_settings)


def update_azureopenai_models(
    config: dict, data_to_update: dict, gpt_4o_mini_settings: dict
) -> dict:
    """Update Azure OpenAI models using GET /openai/models and fallback to static config on failure."""
    service_settings = data_to_update.get("servicesettings", {})
    endpoint = service_settings.get(ENDPOINT, {}).get(VALUE, "")
    api_key = service_settings.get(ACCESS_TOKEN, {}).get(VALUE, "")
    api_version = service_settings.get(AZURE_OPENEAI_VERSION, {}).get(VALUE, "")
    timeout = int(service_settings.get("request_timeout", {}).get(VALUE, 30))

    fetched_models = fetch_azureopenai_models(
        endpoint,
        api_key,
        api_version,
        timeout=timeout,
    )
    return _update_provider_models(config, AZUREOPENAI, fetched_models, gpt_4o_mini_settings)


def update_gemini_models(
    config: dict, data_to_update: dict, gpt_4o_mini_settings: dict
) -> dict:
    """Update Gemini models using GET /v1beta/models and fallback to static config on failure."""
    service_settings = data_to_update.get("servicesettings", {})
    endpoint = service_settings.get(ENDPOINT, {}).get(VALUE, "")
    api_key = service_settings.get(ACCESS_TOKEN, {}).get(VALUE, "")
    timeout = int(service_settings.get("request_timeout", {}).get(VALUE, 30))

    fetched_models = fetch_gemini_models(endpoint, api_key, timeout=timeout)
    return _update_provider_models(config, GEMINI, fetched_models, gpt_4o_mini_settings)


def update_splunk_models(
    config: dict, gpt_4o_mini_settings: dict, scs_token: str = None, url: str = None
) -> dict:
    """
    Updates the Splunk-hosted LLM models in the config using dynamic model mapping.

    Args:
        config (dict): Current config dict.
        gpt_4o_mini_settings (dict): Template settings to apply per model.
        scs_token (str, optional): Auth token for fetching models.
        url (str, optional): Endpoint for fetching models.

    Returns:
        dict: Updated configuration dictionary with Splunk-hosted LLM models.
              If no models are fetched, returns the original config unchanged.

    """
    model_mapping = fetch_model_mapping(scs_token=scs_token, url=url)
    if not model_mapping:
        logger.warning("No Splunk models fetched; skipping update.")
        return config

    if SPLUNK_HOSTED_LLM not in config:
        config[SPLUNK_HOSTED_LLM] = {}
    if MODELS not in config[SPLUNK_HOSTED_LLM]:
        config[SPLUNK_HOSTED_LLM][MODELS] = {}

    splunk_section_models = config[SPLUNK_HOSTED_LLM][MODELS]

    for model_name, model_id in model_mapping.items():
        if model_name not in splunk_section_models:
            settings = copy.deepcopy(gpt_4o_mini_settings)
        else:
            settings = splunk_section_models[model_name]

        # always update/overwrite the "id" field
        settings["id"] = {
            "value": model_id,
            "type": "string",
            "required": True,
            "description": "Unique identifier for the model",
        }

        splunk_section_models[model_name] = settings

    config[SPLUNK_HOSTED_LLM][MODELS] = splunk_section_models
    return copy.deepcopy(config)
