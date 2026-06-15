"""
REST handler for `aicommander` command
"""

import traceback
import json, copy, uuid
import requests
import time
import os

import cexc
from ai_commander.ai_commander_util import AICommanderUtil
from ai_commander.constants import (
    PAYLOAD,
    STATUS,
    AI_COMMANDER_EDIT_CONFIG_CAPABILITIES,
    AI_COMMANDER_READ_CONFIG_CAPABILITIES,
    SPLUNK_HOSTED_LLM,
    DEFAULT_ACCESS_TOKEN,
)
from util.searchinfo_util import searchinfo_from_request
from util.ai_commander_util import (
    get_scs_url,
    get_cached_scs_token,
    fetch_model_mapping,
    handle_secrets,
)
from util.py_executable_bouncer import exec_anaconda_bouncer

logger = cexc.get_logger(__name__)


class AicommanderMetadata(object):

    # Provider configurations - data-driven approach
    PROVIDER_CONFIGS = {
        'openai': {
            'default_endpoint': 'https://api.openai.com/v1/chat/completions',
            'auth_header': 'Authorization',
            'auth_format': 'Bearer {api_key}',
            'payload_format': 'openai_chat',
            'response_path': ['choices', 0, 'message', 'content'],
        },
        'groq': {
            'default_endpoint': 'https://api.groq.com/openai/v1/chat/completions',
            'auth_header': 'Authorization',
            'auth_format': 'Bearer {api_key}',
            'payload_format': 'openai_chat',
            'response_path': ['choices', 0, 'message', 'content'],
        },
        'azureopenai': {
            'default_endpoint': None,  # Must be provided
            'auth_header': 'api-key',
            'auth_format': '{api_key}',
            'payload_format': 'openai_chat',
            'response_path': ['choices', 0, 'message', 'content'],
            'url_format': '{endpoint}openai/deployments/{model}/chat/completions?api-version={api_version}',
        },
        'anthropic': {
            'default_endpoint': 'https://api.anthropic.com/v1/messages',
            'auth_header': 'x-api-key',
            'auth_format': '{api_key}',
            'extra_headers': {'anthropic-version': '2023-06-01'},
            'payload_format': 'anthropic',
            'response_path': ['content', 0, 'text'],
        },
        'gemini': {
            'default_endpoint': 'https://generativelanguage.googleapis.com/v1beta/models',
            'auth_header': None,  # Uses query param
            'payload_format': 'gemini',
            'response_path': ['candidates', 0, 'content', 'parts', 0, 'text'],
            'url_format': '{endpoint}/{model}:generateContent?key={api_key}',
        },
        'ollama': {
            'default_endpoint': 'http://localhost:11434',
            'auth_header': None,
            'payload_format': 'ollama',
            'response_path': ['response'],
            'url_format': '{endpoint}/api/generate',
        },
        'splunk hosted models': {
            'auth_header': 'Authorization',
            'auth_format': 'Bearer {api_key}',
            'extra_headers': {'additionalProp1': 'string'},
            'payload_format': 'splunk_hosted',
            'response_path': None,  # Special handling
        },
        'bedrock': {'special_handler': True},  # Needs custom logic
    }

    @classmethod
    def _get_nested_value(cls, data: dict, path: list, default: str = ""):
        """Get nested value from dict using path list"""
        try:
            for key in path:
                data = data[key] if isinstance(key, str) else data[key]
            return str(data).strip()[:200] if data else default
        except (KeyError, IndexError, TypeError):
            return default

    @classmethod
    def _validate_connection_config(
        cls, provider: str, config: dict, model: str, connection_name: str, searchinfo
    ) -> dict:
        """
        Validate LLM connection configuration before making actual LLM request.

        Args:
            provider (str): LLM provider name
            config (dict): Configuration dict with endpoint, api_key, temperature, etc.
            model (str): Model name
            connection_name (str): Connection name provided by user
            searchinfo: Splunk searchinfo object (used to check KV store)

        Returns:
            dict: { "status": "success" } if valid, otherwise { "status": "error", "message": <error> }
        """
        try:
            ai_util = AICommanderUtil(searchinfo=searchinfo)

            # 1. Validate endpoint URL
            endpoint = config.get("endpoint", "")
            if endpoint:
                if not ai_util.validate_url(endpoint, provider):
                    return {
                        "status": "error",
                        "message": f"Invalid endpoint URL '{endpoint}' for provider {provider}.",
                    }

            if connection_name:
                existing_data = ai_util.read_file(
                    is_token_required=False
                )  # fetch from KV store
                provider_data = existing_data.get(provider, {})
                is_saved = existing_data[provider]["is_saved"]["value"]
                is_model_saved = False
                models = provider_data.get("models", {})
                model_data = models.get(model, {})
                is_model_saved = model_data.get("is_model_saved", {}).get("value", False)
                for prov, prov_cfg in existing_data.items():
                    if not isinstance(prov_cfg, dict):
                        continue
                    models = prov_cfg.get("models", {})
                    for _, model_cfg in models.items():
                        if isinstance(model_cfg, dict):
                            existing_name = model_cfg.get("connection_name", {}).get(
                                "value", ""
                            )
                            if (
                                existing_name
                                and existing_name.lower() == connection_name.lower()
                                and not is_model_saved
                            ):
                                return {
                                    "status": "error",
                                    "message": f"connection_name '{connection_name}' already exists in KV store. Please choose another one.",
                                }

            temperature = config.get("temperature")
            if not isinstance(temperature, float):
                return {
                    "status": "error",
                    "message": f"Response Variability must be a float, got {type(temperature).__name__} instead.",
                }

            return {"status": "success"}

        except Exception as e:
            logger.error(f"Validation error: {traceback.format_exc()}")
            return {
                "status": "error",
                "message": "Validation failed. Please check your configuration.",
            }

    @classmethod
    def _get_user_friendly_error(
        cls, provider: str, STATUS_CODE_code: int = None, error_message: str = ""
    ) -> str:
        """Convert technical errors to user-friendly messages"""
        provider_display = provider.replace('_', ' ').title()
        # Handle authentication errors
        if (
            STATUS_CODE_code == 401
            or "unauthorized" in error_message.lower()
            or "api key" in error_message.lower()
        ):
            return f"Authentication failed. Please check your {provider_display} API key and ensure it's valid."

        # Handle quota/rate limit errors
        if (
            STATUS_CODE_code == 429
            or "quota" in error_message.lower()
            or "rate limit" in error_message.lower()
        ):
            return f"Rate limit exceeded for {provider_display}. Please try again later or check your usage limits."

        # Handle model not found errors
        if (
            STATUS_CODE_code == 404
            or "not found" in error_message.lower()
            or "model" in error_message.lower()
        ):
            return f"The specified model is not available or accessible in {provider_display}. Please verify the model name."

        # Handle network/connectivity errors
        if (
            "connection" in error_message.lower()
            or "timeout" in error_message.lower()
            or "unreachable" in error_message.lower()
        ):
            return f"Unable to connect to {provider_display}. Please check your internet connection and endpoint URL."

        # Handle permission errors
        if (
            STATUS_CODE_code == 403
            or "forbidden" in error_message.lower()
            or "permission" in error_message.lower()
        ):
            return f"Access denied to {provider_display}. Please check your credentials and account permissions."

        # Handle server errors
        if STATUS_CODE_code and STATUS_CODE_code >= 500:
            return f"{provider_display} service is temporarily unavailable. Please try again later."

        # Handle invalid request format
        if STATUS_CODE_code == 400 or "bad request" in error_message.lower():
            return f"Invalid request format for {provider_display}. Please check your configuration settings."

        # Generic fallback
        if provider.lower() == 'bedrock':
            return f"Unable to connect to {provider_display}. Please verify your AWS credentials, region, and network connectivity."
        return f"Unable to connect to {provider_display}. Please verify your configuration and try again."

    @classmethod
    def _build_payload(
        cls,
        format_type: str,
        model: str,
        prompt: str,
        max_tokens: int,
        temperature: float,
        **kwargs,
    ) -> dict:
        """Build request payload based on format type"""
        payloads = {
            'openai_chat': {
                "model": model,
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant"},
                    {"role": "user", "content": prompt},
                ],
                "max_tokens": int(max_tokens),
                "temperature": temperature,
            },
            'anthropic': {
                "model": model,
                "max_tokens": int(max_tokens),
                "messages": [{"role": "user", "content": prompt}],
            },
            'gemini': {
                "contents": [{"role": "user", "parts": [{"text": prompt}]}],
                "generationConfig": {
                    "maxOutputTokens": int(max_tokens),
                    "temperature": temperature,
                },
            },
            'ollama': {"model": model, "prompt": prompt, "stream": False},
            'splunk_hosted': {
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant"},
                    {"role": "user", "content": prompt},
                ],
                "model_id": kwargs.get('model_id', ''),
                "stream": False,
                "max_completion_tokens": int(max_tokens),
            },
        }
        return payloads.get(format_type, {})

    @classmethod
    def _make_llm_request(
        cls,
        provider: str,
        config: dict,
        model: str,
        prompt: str,
        max_tokens: int,
        temperature: float,
        timeout: int,
        **kwargs,
    ) -> dict:
        """Generic LLM request handler"""
        provider_config = cls.PROVIDER_CONFIGS.get(provider)
        if not provider_config:
            return {
                "status": "error",
                "message": cls._get_user_friendly_error(
                    provider=provider,
                    error_message="Provider is not supported. Please select a supported LLM provider.",
                ),
            }

        # Add reasoning_effort from kwargs to config if provided (for backward compatibility)
        if 'reasoning_effort' in kwargs and 'reasoning_effort' not in config:
            config['reasoning_effort'] = kwargs.get('reasoning_effort', 'NONE')

        # Handle Gemini and Splunk Hosted with requests, all others use litellm via psc_boto_funcs.py
        if provider in ['gemini', 'splunk hosted models']:
            return cls._test_provider_with_requests(provider, model, config, provider_config)
        else:
            return cls._test_litellm_connection(provider, model, config)

    @classmethod
    def _test_litellm_connection(cls, provider: str, model: str, config: dict) -> dict:
        """Test LLM connection using exec_anaconda_bouncer to call psc_boto_funcs.py with litellm"""
        try:
            script_path = os.path.join(
                os.path.dirname(os.path.abspath(__file__)), '..', 'util', 'psc_boto_funcs.py'
            )

            # Prepare configuration data for LiteLLM
            test_config = {'provider': provider, 'model': model, 'config': config}

            params = ['litellm_connection_check', json.dumps(test_config)]

            result = exec_anaconda_bouncer(script_path=script_path, params=params)

            # Handle the result
            if isinstance(result, dict):
                return result
            else:
                return {
                    "status": "error",
                    "message": "Invalid response from LiteLLM connection test",
                    "provider": provider,
                    "model": model,
                }

        except Exception as e:
            return {
                "status": "error",
                "message": cls._get_user_friendly_error(
                    provider=provider, error_message="LiteLLM connection test failed"
                ),
                "provider": provider,
                "model": model,
            }

    @classmethod
    def _test_provider_with_requests(
        cls, provider: str, model: str, config: dict, provider_config: dict
    ) -> dict:
        """Test LLM connection using requests module for Gemini and Splunk Hosted providers"""
        import requests
        import time

        timeout = config.get('timeout', 100)
        api_key = config.get('api_key', '')
        endpoint = config.get('endpoint', '')

        try:
            # Handle provider-specific URL formatting
            if provider == 'gemini':
                if endpoint:
                    url = endpoint
                else:
                    url = provider_config.get('default_endpoint')
                    if not url:
                        return {
                            "status": "error",
                            "message": cls._get_user_friendly_error(
                                provider=provider, error_message="Requires an endpoint URL"
                            ),
                            "provider": provider,
                            "model": model,
                        }
                url = f"{url}/{model}:generateContent?key={api_key}"
            else:
                url = config["endpoint"]

            # Prepare headers and payload based on provider
            if provider == 'gemini':
                # Gemini uses query parameter for API key
                headers = {
                    "Content-Type": "application/json",
                    "User-Agent": "AITK-Connection-Test/1.0",
                }
                # Build generationConfig with reasoning_effort support
                generation_config = {
                    "maxOutputTokens": config.get('max_tokens', 100),
                    "temperature": config.get('temperature', 0.1),
                }
                # Add thinkingConfig if reasoning_effort is not NONE (similar to httpx_post in llm_base.py)
                reasoning_effort = config.get('reasoning_effort', 'NONE')
                if reasoning_effort != 'NONE':
                    generation_config["thinkingConfig"] = {
                        "thinkingLevel": reasoning_effort.lower()
                    }
                test_payload = {
                    "contents": [
                        {
                            "role": "user",
                            "parts": [
                                {
                                    "text": "Hello, this is a connection test. Please respond with 'Connection successful'."
                                }
                            ],
                        }
                    ],
                    "generationConfig": generation_config,
                }
            else:
                # Splunk Hosted Models specific headers and payload
                request_id = str(uuid.uuid4())
                headers = {
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                    "request_id": request_id,
                }
                model_dict = fetch_model_mapping(api_key, config["chat_models_url"])
                model_id = model_dict[model]
                test_payload = {
                    "model_id": model_id,
                    "messages": [
                        {
                            "role": "user",
                            "content": "Hello, this is a connection test. Please respond with 'Connection successful'.",
                        }
                    ],
                    "temperature": config.get('temperature', 1),
                    "stream": False,
                    "max_completion_tokens": config.get('max_completion_tokens', 1000),
                    "max_tokens": config.get('max_tokens', 100),
                    "reasoning_effort": config.get('reasoning_effort', 'NONE')
                    if config.get('reasoning_effort', 'NONE') != 'NONE'
                    else None,
                    "extra_headers": config.get('extra_headers', {"additionalProp1": "string"}),
                }

            # Validate API key requirement
            if not api_key:
                return {
                    "status": "error",
                    "message": cls._get_user_friendly_error(
                        provider=provider, error_message="API key is required"
                    ),
                    "provider": provider,
                    "model": model,
                }

            # Make the HTTP request
            start_time = time.time()
            response = requests.post(
                url=url, headers=headers, json=test_payload, timeout=timeout
            )
            response_time = time.time() - start_time
            # Check HTTP STATUS
            if response.status_code != 200:
                error_msg = f"HTTP {response.status_code}: {response.text[:200]}"

                # Provide provider-specific error guidance
                if provider == 'gemini':
                    if response.status_code == 400:
                        error_msg = f"Bad request to Gemini. Check your model name and API key. {error_msg}"
                    elif response.status_code == 403:
                        error_msg = f"Gemini API access forbidden. Verify your API key and enable the Generative Language API. {error_msg}"
                    else:
                        error_msg = f"Gemini request failed. {error_msg}"

                return {
                    "status": "error",
                    "message": cls._get_user_friendly_error(
                        provider=provider, error_message=f"Request failed: {error_msg}"
                    ),
                    "provider": provider,
                    "model": model,
                    "http_STATUS_CODE": response.status_code,
                    "response_time": round(response_time, 2),
                    "request_url": (
                        url.split('?')[0] if '?' in url else url
                    ),  # Hide API key from URL
                }

            # Parse JSON response
            try:
                response_data = response.json()
            except ValueError as e:
                return {
                    "status": "error",
                    "message": cls._get_user_friendly_error(
                        provider=provider,
                        error_message=f"Invalid JSON response: {str(e)}. Response: {response.text[:200]}",
                    ),
                    "provider": provider,
                    "model": model,
                    "response_time": round(response_time, 2),
                    "http_STATUS_CODE": response.status_code,
                }

            # Extract content based on provider response format
            content = None
            content_extraction_error = None

            try:
                if provider == 'gemini':
                    candidates = response_data.get('candidates', [])
                    if (
                        candidates
                        and isinstance(candidates[0], dict)
                        and 'content' in candidates[0]
                    ):
                        parts = candidates[0]['content'].get('parts', [])
                        if parts and isinstance(parts[0], dict) and 'text' in parts[0]:
                            content = parts[0]['text']
                        else:
                            content_extraction_error = f"No text found in parts: {parts}"
                    else:
                        content_extraction_error = f"No candidates or content found in response: {list(response_data.keys())}"
                elif provider in ['splunk hosted models']:
                    # Splunk Hosted Models use OpenAI-compatible format
                    choices = response_data.get('choices', [])
                    if choices and isinstance(choices[0], dict) and 'message' in choices[0]:
                        content = choices[0]['message'].get('content')
                        if not content:
                            content_extraction_error = f"No content in message: {choices[0]['message'].keys() if isinstance(choices[0]['message'], dict) else 'message not dict'}"
                    else:
                        content_extraction_error = (
                            f"No choices/message found: {list(response_data.keys())}"
                        )

            except Exception as e:
                content_extraction_error = f"Exception during content extraction: {str(e)}"

            # Validate content
            if not content or not isinstance(content, str):
                debug_info = {
                    "provider": provider,
                    "model": model,
                    "response_keys": (
                        list(response_data.keys())
                        if isinstance(response_data, dict)
                        else str(type(response_data))
                    ),
                    "extraction_error": content_extraction_error,
                    "content_type": str(type(content)),
                    "content_value": str(content)[:100] if content else "None",
                }

                return {
                    "status": "error",
                    "message": cls._get_user_friendly_error(
                        provider=provider,
                        error_message=f"Empty or invalid response content. {content_extraction_error or 'No content extracted'}",
                    ),
                    "provider": provider,
                    "model": model,
                    "response_time": round(response_time, 2),
                    "debug_info": debug_info,
                }

            content = content.strip()
            if len(content) < 3:
                return {
                    "status": "error",
                    "message": cls._get_user_friendly_error(
                        provider=provider,
                        error_message=f"Suspiciously short response: '{content}'",
                    ),
                    "provider": provider,
                    "model": model,
                    "response_time": round(response_time, 2),
                }

            # Success response
            return {
                "status": "success",
                "message": f"Successfully connected to {provider.replace('_', ' ').title()}. Model '{model}' is accessible.",
                "provider": provider,
                "model": model,
                "response_content": content[:200],
                "response_time": round(response_time, 2),
                "http_STATUS_CODE": response.status_code,
            }

        except requests.exceptions.Timeout:
            return {
                "status": "error",
                "message": cls._get_user_friendly_error(
                    provider=provider,
                    error_message="Request timeout. Please check your network connection.",
                ),
                "provider": provider,
                "model": model,
                "error_type": "TimeoutError",
            }

        except requests.exceptions.ConnectionError as e:
            return {
                "status": "error",
                "message": cls._get_user_friendly_error(
                    provider=provider,
                    error_message="Connection error. Please check your network connectivity.",
                ),
                "provider": provider,
                "model": model,
                "error_type": "ConnectionError",
            }

        except requests.exceptions.RequestException as e:
            return {
                "status": "error",
                "message": cls._get_user_friendly_error(
                    provider=provider, error_message=f"Request failed: {str(e)[:200]}"
                ),
                "provider": provider,
                "model": model,
                "error_type": type(e).__name__,
            }

        except Exception as e:
            logger.error(f"Exception during content extraction: {str(traceback.format_exc())}")
            return {
                "status": "error",
                "message": cls._get_user_friendly_error(
                    provider=provider, error_message=f"Unexpected error: {str(e)[:100]}"
                ),
                "provider": provider,
                "model": model,
                "error_type": type(e).__name__,
            }

    @classmethod
    def _test_llm_connection(cls, data_to_test: str, searchinfo) -> dict:
        """Main LLM connection test method"""
        try:
            if not data_to_test:
                return {
                    "status": "error",
                    "message": cls._get_user_friendly_error(
                        provider="unknown",
                        error_message="No configuration data provided. Please provide valid connection settings.",
                    ),
                }

            data = json.loads(data_to_test)
            provider_name = data.get("service", "").lower()
            model = data.get("model")

            # Use normalized provider name directly
            provider = provider_name

            if not provider or not model:
                return {
                    "status": "error",
                    "message": cls._get_user_friendly_error(
                        provider=provider or "unknown",
                        error_message="Provider and model information are required. Please check your configuration.",
                    ),
                }

            # Extract configuration
            service_settings = data.get("servicesettings", {})
            model_settings = data.get("modelsettings", {})

            config = {
                'endpoint': service_settings.get("endpoint", {}).get("value", ""),
                'api_key': service_settings.get("access_token", {}).get("value", ""),
                'timeout': service_settings.get("request_timeout", {}).get("value", 30),
                'api_version': service_settings.get("azure_api_version", {}).get(
                    "value", "2024-02-15-preview"
                ),
                'region': service_settings.get("region", {}).get("value", "us-east-1"),
                'access_key_id': service_settings.get("aws_access_key_id", {}).get("value", ""),
                'secret_key': service_settings.get("aws_access_token", {}).get("value", ""),
                'role_arn': service_settings.get("role_arn", {}).get("value", ""),
                'max_tokens': model_settings.get("max_tokens", {}).get("value", 100),
                'temperature': float(
                    model_settings.get("response_variability", {}).get("value", 0)
                ),
                'connection_name': model_settings.get("connection_name", {}).get("value", ""),
                'model_id': model_settings.get("id", {}).get("value", ""),
                'reasoning_effort': model_settings.get("reasoning_effort", {}).get(
                    "value", "NONE"
                ),
            }

            ai_commander_util = AICommanderUtil(searchinfo=searchinfo)
            kv_data = ai_commander_util.read_file(is_token_required=False)
            is_saved_value = kv_data[data.get("service", "")]["is_saved"]["value"]

            try:
                if provider == "bedrock":
                    # If any AWS field is missing but is_saved=True, fetch from secrets
                    if (
                        config["region"] == DEFAULT_ACCESS_TOKEN
                        or config["access_key_id"] == DEFAULT_ACCESS_TOKEN
                        or config["secret_key"] == DEFAULT_ACCESS_TOKEN
                        or config["role_arn"] == DEFAULT_ACCESS_TOKEN
                    ) and is_saved_value:
                        response = handle_secrets(
                            searchinfo=searchinfo,
                            provider=data.get("service", ""),
                            type="SELECT",
                        )
                        clear_password = response.get("clear_password", "")
                        if clear_password:
                            creds = json.loads(clear_password)
                            config["region"] = creds.get("aws_region_name", config["region"])
                            config["access_key_id"] = creds.get(
                                "aws_access_key_id", config["access_key_id"]
                            )
                            config["secret_key"] = creds.get(
                                "aws_secret_access_key", config["secret_key"]
                            )
                            config["role_arn"] = creds.get("aws_role_name", config["role_arn"])
                        else:
                            return {
                                "status": "error",
                                "message": cls._get_user_friendly_error(
                                    provider=provider,
                                    error_message="AWS credentials not provided and no saved secret found.",
                                ),
                                "provider": provider,
                                "model": model,
                            }
                else:
                    # Non-Bedrock providers: restore api_key if missing
                    if config["api_key"] == DEFAULT_ACCESS_TOKEN and is_saved_value:
                        response = handle_secrets(
                            searchinfo=searchinfo,
                            provider=data.get("service", ""),
                            type="SELECT",
                        )
                        clear_password = response.get("clear_password", "")
                        if clear_password:
                            config["api_key"] = clear_password
                        else:
                            return {
                                "status": "error",
                                "message": cls._get_user_friendly_error(
                                    provider=provider,
                                    error_message=f"API key not provided and no saved secret found for provider '{provider}'.",
                                ),
                                "provider": provider,
                                "model": model,
                            }
            except Exception as e:
                logger.error(
                    f"Failed to retrieve saved secret for provider {provider}: {traceback.format_exc()}"
                )
                return {
                    "status": "error",
                    "message": cls._get_user_friendly_error(
                        provider=provider,
                        error_message=f"Error retrieving saved secret for provider '{provider}': {str(e)}",
                    ),
                    "provider": provider,
                    "model": model,
                }

            # Handle Splunk Hosted Models special case
            if provider == 'splunk hosted models':
                scs_token, _ = get_cached_scs_token(None, None, searchinfo)
                config['api_key'] = scs_token
                config['chat_models_url'], config['endpoint'] = get_scs_url(searchinfo)

            connection_name = config['connection_name']
            validation_result = cls._validate_connection_config(
                provider=data.get("service", ""),
                config=config,
                model=model,
                connection_name=connection_name,
                searchinfo=searchinfo,
            )
            if validation_result["status"] == "error":
                return validation_result

            test_prompt = (
                "Hello, this is a connection test. Please respond with 'Connection successful'."
            )
            start_time = time.time()
            result = cls._make_llm_request(
                provider,
                config,
                model,
                test_prompt,
                config['max_tokens'],
                config['temperature'],
                config['timeout'],
            )

            # Preserve STATUS and message from the universal test, but add metadata
            response_time = round(time.time() - start_time, 2)
            provider_display = data.get("service")

            # Ensure we preserve the essential fields from the universal test
            if isinstance(result, dict):
                # Add metadata without overwriting STATUS/message fields
                if 'response_time' not in result:
                    result['response_time'] = response_time
                if 'provider' not in result:
                    result['provider'] = provider_display
                if 'model' not in result:
                    result['model'] = model

                # Ensure STATUS field exists
                if 'status' not in result:
                    result['status'] = 'error'
                    result['message'] = cls._get_user_friendly_error(
                        provider=provider,
                        error_message="Unknown error - missing STATUS from connection test",
                    )

                return result
            else:
                # Fallback if result is not a dict
                return {
                    "status": "error",
                    "message": cls._get_user_friendly_error(
                        provider=provider,
                        error_message="Invalid response format from connection test",
                    ),
                    "response_time": response_time,
                    "provider": provider_display,
                    "model": model,
                }

        except json.JSONDecodeError as e:
            logger.error("JSON parsing error in _test_llm_connection: %s", str(e))
            return {
                "status": "error",
                "message": cls._get_user_friendly_error(
                    provider="unknown",
                    error_message="Invalid configuration format. Please check your settings and try again.",
                ),
            }
        except Exception as e:
            logger.error("Failed to test LLM connection: %s", traceback.format_exc())
            return {
                "status": "error",
                "message": cls._get_user_friendly_error(
                    provider="unknown",
                    error_message="Connection test failed due to a configuration error. Please verify your settings and try again.",
                ),
            }

    @classmethod
    def handle_post(cls, request: dict, path_parts: list) -> dict:
        """
        Handles the POST request to update AICommander service settings.

        Args:
            request (dict):
                The HTTP request containing the payload with updated configuration.
            path_parts (list):
                The list of path parts from the request URL.

        Returns:
            dict:
                A response dictionary containing:
                - 'payload': A message indicating success or failure.
                - 'status': HTTP STATUS code (200 for success, 403 for unauthorized access, 500 for errors).
        """
        searchinfo = searchinfo_from_request(request)
        ai_commander_util = AICommanderUtil(searchinfo=searchinfo)
        is_user_eligible = ai_commander_util.check_user_role_eligibility(
            required_capabilities=AI_COMMANDER_EDIT_CONFIG_CAPABILITIES
        )
        if not is_user_eligible:
            return {
                PAYLOAD: {
                    'error_message': 'User is not eligible to update the AICommander Connection Management Settings',
                    "status": "failure",
                },
                STATUS: 403,
            }

        try:
            # Test the LLM connection using the request payload
            llm_conn = cls._test_llm_connection(request[PAYLOAD], searchinfo)
            if llm_conn.get("status") == "error":
                return {
                    PAYLOAD: {
                        'message': f"LLM Connection Test Failed: {llm_conn.get('message', 'Unknown error')}",
                        'provider': llm_conn.get('provider'),
                        'model': llm_conn.get('model'),
                        "status": "fail",
                    },
                    STATUS: 500,
                }
            else:
                return {
                    PAYLOAD: {
                        'message': 'LLM Connection Test is successful',
                        "status": "success",
                        'provider': llm_conn.get('provider'),
                        'model': llm_conn.get('model'),
                        'response_time': llm_conn.get('response_time'),
                        'response_preview': llm_conn.get('response_content', '')[:100],
                    },
                    STATUS: 200,
                }

        except Exception as e:
            logger.error(f"Error in LLM connection test: {str(traceback.format_exc())}")
            return {
                PAYLOAD: {'message': "LLM Connection Test Failed", "status": 'fail'},
                STATUS: 500,
            }

    @classmethod
    def handle_get(cls, request: dict, path_parts: list) -> dict:
        """
        Handles the GET request to retrieve AICommander service settings.

        Args:
            request (dict):
                The HTTP request object.
            path_parts (list):
                The list of path parts from the request URL.

        Returns:
            dict:
                A response dictionary containing:
                - 'payload': The AICommander configuration or an error message.
                - 'status': HTTP STATUS code (200 for success, 403 for unauthorized access).
        """
        try:
            searchinfo = searchinfo_from_request(request)
            is_user_eligible = AICommanderUtil(
                searchinfo=searchinfo
            ).check_user_role_eligibility(
                required_capabilities=AI_COMMANDER_EDIT_CONFIG_CAPABILITIES
            )
            if is_user_eligible:
                metadata = AICommanderUtil(searchinfo).read_meta_data(
                    "slim_mltk_hosted_llm_feature_enabled"
                )
                return {PAYLOAD: {"metadata": metadata, "status": "success"}, STATUS: 200}

            elif AICommanderUtil(searchinfo=searchinfo).check_user_role_eligibility(
                required_capabilities=AI_COMMANDER_READ_CONFIG_CAPABILITIES
            ):
                metadata = AICommanderUtil(searchinfo).read_meta_data(
                    "slim_mltk_hosted_llm_feature_enabled"
                )
                return {
                    PAYLOAD: {"metadata": metadata, "status": "success"},
                    STATUS: 200,
                }
            else:
                return {
                    PAYLOAD: {
                        'message': 'User is not eligible to view the AICommander Connection Management Settings',
                        "status": "fail",
                    },
                    STATUS: 403,
                }
        except Exception as e:
            logger.error(f"Error retrieving configuration: {str(traceback.format_exc())}")
            return {
                PAYLOAD: {
                    'message': "Failed to retrieve service settings",
                    "status": "success",
                },
                STATUS: 500,
            }
