import time, os, traceback, cexc
import http.client as http_client
import httpx
from abc import abstractmethod
from util.telemetry_agent_util import log_ai_command_details
import json

logger = cexc.get_logger(__name__)

http_client.HTTPConnection.debuglevel = 0

ssl_cert_file = os.environ.get("SSL_CERT_FILE")
if ssl_cert_file and not os.path.exists(ssl_cert_file):
    logger.warning(
        f"Environment variable SSL_CERT_FILE is set to a non-existent path: {ssl_cert_file}. "
        "Removing it to prevent SSL errors."
    )
    os.environ.pop("SSL_CERT_FILE")

import litellm

from util.ai_commander_util import get_cached_scs_token
from util.telemetry_util import log_kb_usage
from ai_commander.constants import (
    OPENAI,
    OLLAMA,
    AZUREOPENAI,
    ANTHROPIC,
    GROQ,
    BEDROCK,
    ERROR_MESSAGE,
    LLM_EXCEPTION_LIST,
    SPLUNK_HOSTED_LLM_TIMEOUT,
    TIMEOUT,
    TEMPERATURE,
    AUTHORIZATION,
    MAX_OUTPUT_TOKENS,
    SPLUNK_HOSTED_LLM,
)
from util.error_util import RateLimitError, CustomMLTKError

logger = cexc.get_logger(__name__)


class LLM:
    def __init__(self, ai_commander_util=None, http_client=None):
        self.ai_commander_util = ai_commander_util
        self.http_client = http_client

    @abstractmethod
    def call(self):
        pass

    def litellm_post(
        self,
        provider_name: str,
        data: dict,
        aws_keys: dict = None,
        max_retries: int = 3,
        backoff_factor: int = 2,
    ) -> str:
        """
        Sends a request to the specified provider with retry logic.

        Args:
            provider_name (str):
                The name of the provider to send the request to.
        data (dict):
            The data payload for the request.
        aws_keys (dict, optional):
            AWS credentials if required.
        max_retries (int, optional):
            Maximum number of retry attempts. Default is 3.
        backoff_factor (int, optional):
            Exponential backoff factor for retries. Default is 2.

        Returns:
        str:
            The response message content or an error message.
        """

        payload = data.get("payload", {})
        retries = 0
        litellm.client_session = self.http_client
        litellm.drop_params = True
        return_message = ""

        # Extract reasoning_effort and convert to lowercase if not NONE
        reasoning_effort = payload.pop("reasoning_effort", "NONE")
        extra_params = {}
        if reasoning_effort != "NONE":
            extra_params["reasoning_effort"] = reasoning_effort.lower()

        while retries <= max_retries:
            try:
                logger.debug(f"Attempt {retries + 1}: Sending request to {provider_name}")

                # Call litellm.completion
                if provider_name in [OPENAI, AZUREOPENAI, OLLAMA, GROQ, ANTHROPIC]:
                    response = litellm.completion(**payload, **extra_params)
                elif provider_name == BEDROCK:
                    ## if payload of vectot_store_ids is in payload
                    if "vector_store_ids" in payload and len(payload["vector_store_ids"]) > 0:
                        import asyncio
                        from litellm.vector_stores.vector_store_registry import (
                            VectorStoreRegistry,
                            LiteLLM_ManagedVectorStore,
                        )

                        litellm.vector_store_registry = VectorStoreRegistry(
                            vector_stores=[
                                LiteLLM_ManagedVectorStore(
                                    vector_store_id=payload["vector_store_ids"][
                                        0
                                    ],  # Get the first vector store ID
                                    custom_llm_provider=BEDROCK.lower(),
                                    litellm_params={
                                        "aws_access_key_id": aws_keys.get("aws_access_key_id"),
                                        "aws_secret_access_key": aws_keys.get(
                                            "aws_secret_access_key"
                                        ),
                                        "aws_region_name": aws_keys.get("aws_region_name"),
                                        "aws_role_name": aws_keys.get("aws_role_name"),
                                        "aws_session_name": aws_keys.get("aws_session_name"),
                                    },
                                )
                            ]
                        )
                        response = asyncio.run(
                            litellm.acompletion(**payload, **aws_keys, **extra_params)
                        )
                        # get true if kb is used from response else false in logger.debug
                        log_kb_usage(True)
                    else:
                        response = litellm.completion(**payload, **aws_keys, **extra_params)
                        log_kb_usage(False)
                # Handle empty responses
                if not response.choices or not response.choices[0].message:
                    return "Empty response received from the server."

                message_content = response.choices[0].message.content
                if not message_content:
                    return "Empty response content received from the server."

                if "Please reduce the length of the messages" in message_content:
                    raise CustomMLTKError(
                        "Prompt length too long. Please reduce the length of the prompt"
                    )

                return message_content

            except CustomMLTKError as e:
                logger.error(f"Error in LLM post call: {str(e)}")
                raise RuntimeError(str(e))
            except litellm.BadRequestError as e:
                logger.error(f"Error in LLM post call: {str(traceback.format_exc())}")
                error_message = str(e)
                if (
                    "Invocation of model ID" in error_message
                    and "with on-demand throughput" in error_message
                ):
                    raise RuntimeError(
                        "On-demand usage isn't supported for the selected model. Please choose a supported model."
                    )
                elif "Invalid API Key" in error_message:
                    raise RuntimeError(
                        "Authentication failed: Incorrect API key provided. Please check your API key."
                    )
                else:
                    raise RuntimeError(ERROR_MESSAGE)

            except litellm.AuthenticationError as e:
                logger.error(f"Error in LLM post call: {str(e)}")
                error_message = str(e)
                raise RuntimeError(
                    "Authentication failed: Incorrect API key provided. Please check your API key."
                )

            except litellm.APIConnectionError as e:
                logger.error(f"Error in LLM post call: {str(traceback.format_exc())}")
                error_message = str(e)
                if (
                    "You don't have access to the model with the specified model ID."
                    in error_message
                ):
                    raise RuntimeError(
                        "The provided model is not accessible by the bedrock account"
                    )
                else:
                    raise RuntimeError(ERROR_MESSAGE)
            except litellm.exceptions.Timeout as e:
                logger.error(f"Error in LLM post call: {str(e)}")
                raise RuntimeError("TimeoutError - Request timed out")
            except litellm.RateLimitError as e:
                retries += 1
                if retries > max_retries:
                    logger.error(f"Error in LLM post call: {str(e)}")
                    raise RuntimeError(
                        "You exceeded your current quota, please check your plan and billing details."
                    )
                else:
                    logger.info(
                        f"Rate limit exceeded, retrying in {backoff_factor**retries} seconds..."
                    )
                    time.sleep(backoff_factor**retries)
            except Exception as e:
                logger.error(f"Error in LLM post call: {str(traceback.format_exc())}")
                raise RuntimeError(ERROR_MESSAGE)

        return "Retry limit exceeded or server is unavailable."

    def httpx_post(
        self,
        data,
        provider_name,
        max_retries=3,
        backoff_factor=2,
        request_id=None,
        searchinfo=None,
        model_name=None,
    ):
        payload = data["payload"]
        api_key = payload["api_key"]
        api_base = payload["api_base"]

        is_gemini = "gemini" in api_base.lower()
        url = f"{api_base}?key={api_key}" if is_gemini else api_base

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "request_id": request_id,
        }

        if is_gemini:
            timeout = payload.get(TIMEOUT, 600)
            generation_config = {
                TEMPERATURE: payload["temperature"],
                MAX_OUTPUT_TOKENS: payload["max_tokens"],
            }
            reasoning_effort = payload.get("reasoning_effort", "NONE")
            if reasoning_effort != "NONE":
                generation_config["thinkingConfig"] = {
                    "thinkingLevel": reasoning_effort.lower()
                }
            request_body = {
                "contents": payload["contents"],
                "generationConfig": generation_config,
            }
            headers.pop(AUTHORIZATION)
        else:
            timeout = SPLUNK_HOSTED_LLM_TIMEOUT
            request_body = {
                "model_id": payload.get(
                    "model_id", "create_chat_completion_v1_chat_completions_post"
                ),
                "messages": payload["messages"],
                "temperature": payload.get("temperature", 1),
                "stream": False,
                "max_tokens": payload.get("max_tokens", 2000),
                "reasoning_effort": (
                    payload.get("reasoning_effort", "NONE")
                    if payload.get("reasoning_effort", "NONE") != "NONE"
                    else None
                ),
                "extra_headers": payload.get("extra_headers", {"additionalProp1": "string"}),
            }

        retries = 0

        while retries <= max_retries:
            try:
                logger.debug(f"Attempt {retries + 1}: Sending POST request  {provider_name}")
                start_call_time = time.time()
                response = httpx.post(url, headers=headers, json=request_body, timeout=timeout)
                end_call_time = time.time()
                elapsed_time = end_call_time - start_call_time
                logger.debug(f"HTTP call took {elapsed_time:.3f} seconds")
                try:
                    result = response.json()
                except Exception:
                    raise CustomMLTKError("Invalid JSON received from server.")

                if not response.text:
                    raise CustomMLTKError("Empty response received from the server.")

                if response.status_code == 200:
                    try:
                        if is_gemini:
                            candidates = result.get("candidates", [])
                            if not candidates:
                                raise CustomMLTKError("Empty response received.")

                            message_content = candidates[0]["content"]["parts"][0].get(
                                "text", ""
                            )
                            if not message_content:
                                raise CustomMLTKError(
                                    "Empty response content received from the server."
                                )
                            message_content = candidates[0]["content"]["parts"][0].get(
                                "text", ""
                            )
                            if not message_content:
                                raise CustomMLTKError(
                                    "Empty response content received from the server."
                                )

                            if "Please reduce the length of the messages" in message_content:
                                raise CustomMLTKError(
                                    "Prompt length too long. Please reduce the length of the prompt."
                                )

                            return message_content
                        else:
                            # The following 'else' block is very specific to Splunk response structure
                            log_ai_command_details(
                                uuid=request_id,
                                provider=provider_name,
                                model=model_name or payload.get("model_id", ""),
                                execution_status="success",
                                input_token=result.get("usage", {}).get("prompt_tokens", 0),
                                output_token=result.get("usage", {}).get(
                                    "completion_tokens", 0
                                ),
                                total_token=result.get("usage", {}).get("total_tokens", 0),
                                time_processing=elapsed_time,
                            )
                            message_content = result["choices"][0]["message"]["content"]
                            return message_content
                    except (ValueError, KeyError):
                        logger.error(f"Error parsing response: {str(traceback.format_exc())}")
                        raise CustomMLTKError(ERROR_MESSAGE)

                elif response.status_code == 429:
                    if is_gemini:
                        error_message = result.get("error", {}).get("message", "")
                    else:
                        error_message = result.get("error_message", "")
                        log_ai_command_details(
                            uuid=request_id,
                            provider=provider_name,
                            model=model_name or payload.get("model_id", ""),
                            execution_status="failure",
                            error_type=str(response.status_code),
                            time_processing=elapsed_time,
                        )
                    logger.error("The error message is: {}".format(error_message))
                    raise RateLimitError("Rate limit exceeded. Please try again later.")

                else:
                    if is_gemini:
                        error_message = result.get("error", {}).get("message", "")
                    elif provider_name == SPLUNK_HOSTED_LLM and response.status_code in [
                        401,
                        498,
                    ]:
                        scs_token = None
                        scs_token_expiry = None
                        new_token, scs_token_expiry = get_cached_scs_token(
                            scs_token, scs_token_expiry, searchinfo
                        )
                        payload["api_key"] = new_token
                        headers["Authorization"] = f"Bearer {new_token}"
                        retries += 1
                        continue
                    else:
                        error_message = result.get("error_message", "")
                        if "Token Expired" in error_message:
                            if self.token_refresher:
                                new_token = self.token_refresher()
                                payload["api_key"] = new_token
                                headers["Authorization"] = f"Bearer {new_token}"
                                retries += 1
                                continue
                        if provider_name == SPLUNK_HOSTED_LLM:
                            log_ai_command_details(
                                uuid=request_id,
                                provider=provider_name,
                                model=model_name or payload.get("model_id", ""),
                                execution_status="failure",
                                error_type=str(response.status_code),
                                time_processing=elapsed_time,
                            )
                        raise CustomMLTKError(error_message)

                    logger.error("The error message is: {}".format(error_message))
                    if (
                        "API key not valid" in error_message
                        or "invalid_api_key" in error_message
                    ):
                        raise CustomMLTKError(
                            "Authentication failed: Incorrect API key provided. Please check your API key."
                        )
                    elif "Prompt length too long" in error_message:
                        raise CustomMLTKError(
                            "Prompt length too long. Please reduce the length of the prompt."
                        )
                    elif (
                        "not supported for generateContent" in error_message
                        or "The specified model is either unavailable" in error_message
                    ):
                        raise CustomMLTKError(
                            "The specified model is either unavailable or not supported for the selected API version or method. Please verify the model name and your API version."
                        )
                    else:
                        raise CustomMLTKError(ERROR_MESSAGE)
            except CustomMLTKError as e:
                logger.error(f"Error in LLM post call: {str(e)}")
                raise RuntimeError(str(e))
            except httpx.TimeoutException as e:
                elapsed_time = time.time() - start_call_time
                if provider_name == SPLUNK_HOSTED_LLM:
                    log_ai_command_details(
                        uuid=request_id,
                        provider=provider_name,
                        model=model_name or payload.get("model_id", ""),
                        execution_status="failure",
                        error_type="Timeout",
                        time_processing=elapsed_time,
                    )
                logger.error(f"Error in LLM post call: {str(e)}")
                raise RuntimeError("TimeoutError - Request timed out")
            except RateLimitError as e:
                retries += 1
                if retries > max_retries:
                    logger.error(f"Error in LLM post call: {str(e)}")
                    raise RuntimeError("Rate limit exceeded. Please try again later.")
                else:
                    logger.info(
                        f"Rate limit exceeded, retrying in {backoff_factor**retries} seconds..."
                    )
                    time.sleep(backoff_factor**retries)
            except Exception as e:
                logger.error(f"Error in LLM post call: {str(traceback.format_exc())}")
                raise RuntimeError(ERROR_MESSAGE)

        return "Retry limit exceeded or server is unavailable."

    def read_file(self, provider_name=None) -> dict:
        """
        Reads the configuration file with token requirements.

        Returns:
            dict:
                The configuration data.
        """
        return self.ai_commander_util.read_file(
            is_token_required=True, provider_name=provider_name
        )

    def get_config(self, provider: str) -> dict:
        """
        Retrieves the configuration for a specific provider.

        Args:
            provider (str):
                The name of the provider whose configuration is required.

        Returns:
            dict:
                The configuration data for the specified provider.

        Raises:
            RuntimeError: If the provider is not found in the configuration.
        """
        conf = self.read_file(provider_name=provider)
        if provider not in conf:
            raise RuntimeError(
                f"The provider: '{provider}' is invalid. Please check the configuration"
            )
        return conf[provider]
