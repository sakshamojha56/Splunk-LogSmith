from ai_commander.constants import (
    VALUE,
    ENDPOINT,
    ACCESS_TOKEN,
    REQUEST_TIMEOUT,
    RESPONSE_VARIABILITY,
    MAX_TOKENS,
    OPENAI,
    OLLAMA,
    AZUREOPENAI,
    ANTHROPIC,
    GROQ,
    BEDROCK,
    ACCESS_KEY_ID,
    BEDROCK_ACCESS_KEY,
    REGION,
    GEMINI,
    BEDROCK_ROLE,
    AZURE_OPENEAI_VERSION,
    SYSTEM_PROMPT,
    DEFAULT_MAX_TOKENS,
    DEFAULT_TEMPERATURE,
    DEFAULT_TIMEOUT,
    SPLUNK_HOSTED_LLM,
    MAX_COMPLETION_TOKENS,
    LLM_INTEGRATION_CONFIG,
    MAX_RETRIES,
    BACKOFF_FACTOR,
)

from ai_commander.llm_base import LLM
from util.ai_commander_util import fetch_model_mapping
from connection_config_manager.utils.oidc_utils import exchange_oidc_token
import cexc

logger = cexc.get_logger(__name__)


# LLM Provider Builder Class to create any provider dynamically
class LLMBuilder:
    def __init__(
        self,
        provider,
        model,
        prompt,
        process_options,
        llm_config,
        scs_token=None,
        url=None,
    ):
        self.provider = provider
        self.model = model
        self.prompt = prompt
        self.process_options = process_options
        self.llm_config = llm_config
        self.scs_token = scs_token
        self.url = url

    def get_config_value(self, config, key, default, value_key=VALUE):
        value = config.get(key, {}).get(value_key)
        if value is None:
            logger.warning(
                f"Missing '{value_key}' for '{key}' in model configuration. Using default: {default}"
            )
            return default
        return value

    def build_data(self) -> tuple[dict, dict]:
        """
        Constructs the request data and AWS credentials for the specified provider.

        Returns:
            tuple:
                A tuple containing the request data dictionary and AWS keys dictionary.
        """
        request_data = dict()
        token = self.llm_config.get("connection_details", {}).get(ACCESS_TOKEN, "")
        access_token = token if token else None
        is_custom = self.llm_config.get("is_custom", False)
        if is_custom:
            if self.llm_config.get("connection_details", {}).get("auth_type", "") == "API_KEY":
                access_token = self.llm_config["connection_details"].get("access_token")
            elif self.llm_config.get("connection_details", {}).get("auth_type", "") == "OIDC":
                auth_connection_details = self.llm_config["connection_details"].get(
                    "auth_connection_details", {}
                )
                access_token = exchange_oidc_token(auth_connection_details)

        base_url_value = self.llm_config.get("connection_details", {}).get(ENDPOINT, "")
        api_base = base_url_value.removesuffix("/chat/completions") if base_url_value else None
        max_tokens = self.llm_config.get("llm_params", {}).get(MAX_TOKENS, DEFAULT_MAX_TOKENS)
        temperature = self.llm_config.get("llm_params", {}).get(
            RESPONSE_VARIABILITY, DEFAULT_TEMPERATURE
        )
        timeout = self.llm_config.get("connection_details", {}).get(
            REQUEST_TIMEOUT, DEFAULT_TIMEOUT
        )
        reasoning_effort = self.llm_config.get("llm_params", {}).get("reasoning_effort", "NONE")

        base_data = {
            "api_base": api_base,
            "api_key": access_token,
            "model": f"{self.provider.lower()}/{self.model}",
            "max_tokens": int(max_tokens),
            "temperature": float(temperature),
            "timeout": float(timeout),
            "reasoning_effort": reasoning_effort,
        }

        aws_keys = {}
        if self.provider == OPENAI or is_custom:
            base_data["messages"] = [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": self.prompt},
            ]
            base_data["model"] = f"{OPENAI.lower()}/{self.model}"
        elif self.provider == AZUREOPENAI:
            base_provider = self.provider[:5]
            base_data["api_base"] = base_url_value.rstrip("/") if base_url_value else None
            base_data["model"] = f"{base_provider.lower()}/{self.model}"
            api_version = self.llm_config.get("connection_details", {}).get(
                AZURE_OPENEAI_VERSION, ""
            )
            if not api_version:
                raise ValueError(
                    f"Missing '{VALUE}' for '{AZURE_OPENEAI_VERSION}' in provider_config"
                )
            base_data["api_version"] = api_version
            base_data["messages"] = [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": self.prompt},
            ]
        elif self.provider == GROQ:
            base_data["messages"] = [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": self.prompt},
            ]
        elif self.provider == GEMINI:
            base_data["model"] = self.model  # keep model separately for URL
            base_data[
                "api_base"
            ] = f"{base_url_value.rstrip('/') if base_url_value else ''}/{self.model}:generateContent"
            base_data["contents"] = [  # Gemini uses `contents` instead of `messages`
                {
                    "role": "user",
                    "parts": [{"text": self.prompt}],
                }
            ]
        elif self.provider == ANTHROPIC:
            anthropic_api_base = base_url_value.rstrip("/") if base_url_value else None
            base_data["api_base"] = anthropic_api_base
            base_data["messages"] = [
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "text",
                            "text": SYSTEM_PROMPT,
                        }
                    ],
                },
                {"role": "user", "content": self.prompt},
            ]
        elif self.provider == OLLAMA:
            base_data["api_base"] = base_url_value.rstrip("/") if base_url_value else None
            base_data["messages"] = [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": self.prompt},
            ]
        elif self.provider == BEDROCK:
            base_data.pop("api_base", None)
            base_data.pop("api_key", None)
            aws_keys = {
                "aws_region_name": self.llm_config["connection_details"]["aws_region_name"],
                "aws_access_key_id": self.llm_config["connection_details"]["aws_access_key_id"],
                "aws_secret_access_key": self.llm_config["connection_details"][
                    "aws_secret_access_key"
                ],
                "aws_role_name": self.llm_config["connection_details"]["aws_role_name"],
                "aws_session_name": "splunk-ai-commander-session-name",
            }
            base_data["messages"] = [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": self.prompt},
            ]
            if 'kb_id' in self.process_options['params']:
                base_data['vector_store_ids'] = [self.process_options['params']['kb_id']]
        elif self.provider == SPLUNK_HOSTED_LLM:
            access_token = self.scs_token
            base_data.pop("model", None)

            model_id = self.llm_config.get("connection_details", {}).get("model_id", "")
            logger.debug("The model_id we got is: {}".format(model_id))
            if not model_id:
                raise ValueError(f"Missing 'id' for model '{self.model}' in provider_config")
            base_data["api_base"] = self.url
            base_data["messages"] = [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": self.prompt},
            ]
            base_data["api_key"] = access_token
            base_data["model_id"] = model_id
            base_data["stream"] = False
            base_data["max_completion_tokens"] = MAX_COMPLETION_TOKENS
            base_data["extra_headers"] = {"additionalProp1": "string"}
        else:
            raise ValueError(f"Unknown provider: {self.provider}")

        request_data.setdefault("payload", base_data)

        return request_data, aws_keys


# Unified LLM Class with Dynamic Builder Usage
class LLMFactory(LLM):
    def __init__(self, ai_commander_util, llm_config: dict):
        super().__init__(ai_commander_util)
        self.llm_config = llm_config
        self.provider = self.llm_config.get("provider", "").strip(" '\"")

    def call(
        self,
        model: str,
        prompt: str,
        conf: dict,
        llm_config: dict,
        scs_token: str = None,
        url: str = None,
        request_id: str = None,
        searchinfo: str = None,
    ) -> str:
        """
        Calls the language model with the given parameters.

        Args:
            model (str):
                The model name to use.
            prompt (str):
                The input prompt to send to the model.
            conf (dict):
                Additional configuration settings.

        Returns:
            str:
                The response from the model.
        """
        builder = LLMBuilder(
            self.provider,
            model,
            prompt,
            conf,
            llm_config,
            scs_token=scs_token,
            url=url,
        )
        data, aws_keys = builder.build_data()
        is_custom = llm_config.get("is_custom", False)
        max_retries = int(conf[LLM_INTEGRATION_CONFIG].get(MAX_RETRIES, 3))
        backoff_factor = int(conf[LLM_INTEGRATION_CONFIG].get(BACKOFF_FACTOR, 2))
        if self.provider == GEMINI or self.provider == SPLUNK_HOSTED_LLM:
            return self.httpx_post(
                data,
                provider_name=self.provider,
                max_retries=max_retries,
                backoff_factor=backoff_factor,
                request_id=request_id,
                searchinfo=searchinfo,
                model_name=model,
            )
        else:
            provider = self.provider if not is_custom else OPENAI
            return self.litellm_post(provider, data, aws_keys, max_retries, backoff_factor)
