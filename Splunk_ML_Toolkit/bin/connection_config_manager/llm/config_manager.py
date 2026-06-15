import time
import traceback

import cexc

from .llm_config_manager import LLMConfigManager
from .secrets_manager import SecretsManager
from util import telemetry_agent_util
from ai_commander.constants import (
    DEFAULT_ACCESS_TOKEN,
    SPLUNK_HOSTED_LLM,
    TOKEN_BASED_PROVIDERS,
    BEDROCK,
)
from util.ai_commander_util import get_scs_url, get_cached_scs_token, fetch_model_mapping
import json
import uuid

logger = cexc.get_logger(__name__)


class ConfigManager:
    def __init__(self, search_info: dict):
        self.search_info = search_info
        self.config_manager = LLMConfigManager(search_info)
        self.secrets_manager = SecretsManager(search_info)

    def create_llm_config(self, config: dict) -> bool:
        """
        Creates a new LLM connection.

        Args:
            config (dict): The LLM configuration payload.

        Returns:
            bool: True if the configuration was created successfully.

        Raises:
            ValueError: If required fields are missing or a duplicate name exists.
            RuntimeError: If the connection test or persistence fails.
        """
        logger.debug("create_llm_config called")
        required_fields = ["name", "provider", "model", "connection_details"]
        for field in required_fields:
            if not config.get(field):
                raise ValueError(f"Missing required field: '{field}'.")

        provider = config.get("provider", "")
        model = config.get("model", "")
        if provider.lower() == SPLUNK_HOSTED_LLM.lower():
            scs_token, _ = get_cached_scs_token(None, None, self.search_info)
            chat_models_url, _ = get_scs_url(self.search_info)
            model_mapping = fetch_model_mapping(scs_token, chat_models_url)
            model_id = model_mapping[model]
            config["connection_details"]["model_id"] = model_id

        result = self.config_manager.create_llm_config(config)

        if config.get("is_custom", False):
            telemetry_agent_util.log_ai_command_details(
                uuid=str(uuid.uuid4()),
                provider=config.get("provider", ""),
                model=config.get("model", ""),
                execution_status="success" if result else "error",
                trigger="create",
                auth_type=config["connection_details"].get("auth_type", ""),
            )

        return result

    def get_llm_config(
        self,
        connection_name: str = None,
        provider: str = None,
        model: str = None,
        is_auth_bypass: bool = False,
    ) -> dict:
        """
        Retrieves the LLM configuration for the specified connection name.
        Also retrieves the associated secrets and fills them in the configuration.

        Args:
            connection_name (str): The name of the connection to retrieve.
            provider (str): The provider of the LLM.
            model (str): The model of the LLM.
            is_auth_bypass (bool): Whether to bypass authentication.

        Returns:
            dict: The LLM configuration for the specified connection name.
        """
        logger.debug("get_llm_config called for connection_name=%s", connection_name)
        try:
            configs = self.config_manager.get_llm_config(
                connection_name=connection_name,
                provider=provider,
                model=model,
                is_auth_bypass=is_auth_bypass,
            )
            if configs:
                if len(configs) > 1:
                    raise RuntimeError(
                        f"Multiple LLM configurations found for provider='{provider}' and model='{model}'. Please specify a unique connection name by editing agent."
                    )
                config = configs[0]
                self._fill_secrets(config)
                return config
            else:
                raise RuntimeError(
                    f"LLM configuration with connection name '{connection_name}' does not exist."
                )
        except Exception as e:
            logger.error(f"Error retrieving LLM configuration: {str(traceback.format_exc())}")
            raise

    def test_llm_connection(
        self,
        provider: str,
        model: str,
        connection_details: dict,
        llm_params: dict,
        is_custom: bool = False,
        connection_name: str = "",
    ) -> dict:
        """
        Test LLM connection using the new API data format.

        Reuses the same _make_llm_request pipeline and result handling
        as the legacy _test_llm_connection in AicommanderMetadata.

        Returns:
            dict: Result with 'status', 'message', 'provider', 'model',
                  'response_time', 'response_content', etc.
        """
        logger.debug("test_llm_connection called for provider=%s, model=%s", provider, model)
        from rest_handlers.aicommander_metadata import AicommanderMetadata

        try:
            if not provider or not model:
                logger.warning("test_llm_connection called with missing provider or model")
                return {
                    "status": "error",
                    "message": AicommanderMetadata._get_user_friendly_error(
                        provider=provider or "unknown",
                        error_message="Provider and model information are required. Please check your configuration.",
                    ),
                    "provider": provider,
                    "model": model,
                }

            existing_configs = self.config_manager.get_llm_config(
                connection_name=connection_name
            )
            config = {
                'endpoint': connection_details.get("endpoint", ""),
                'api_key': connection_details.get("access_token", ""),
                'timeout': connection_details.get("request_timeout", 200),
                'api_version': connection_details.get(
                    "azure_api_version", "2024-02-15-preview"
                ),
                'region': connection_details.get("region", "us-east-1"),
                'access_key_id': connection_details.get("aws_access_key_id", ""),
                'secret_key': connection_details.get("aws_access_token", ""),
                'role_arn': connection_details.get("role_arn", ""),
                'max_tokens': llm_params.get("max_tokens", 100),
                'temperature': float(llm_params.get("response_variability", 0.1)),
                'reasoning_effort': llm_params.get("reasoning_effort", "NONE"),
            }

            if existing_configs:
                existing_config = existing_configs[0]
                self._fill_secrets(existing_config)
                if config.get('api_key') == DEFAULT_ACCESS_TOKEN:
                    config['api_key'] = existing_config.get('connection_details', {}).get(
                        'access_token'
                    )
                if config.get('region') == DEFAULT_ACCESS_TOKEN:
                    config['region'] = existing_config.get('connection_details', {}).get(
                        'aws_region_name'
                    )
                if config.get('access_key_id') == DEFAULT_ACCESS_TOKEN:
                    config['access_key_id'] = existing_config.get('connection_details', {}).get(
                        'aws_access_key_id'
                    )
                if config.get('role_arn') == DEFAULT_ACCESS_TOKEN:
                    config['role_arn'] = existing_config.get('connection_details', {}).get(
                        'aws_role_name'
                    )
                if config.get('secret_key') == DEFAULT_ACCESS_TOKEN:
                    config["secret_key"] = existing_config.get('connection_details', {}).get(
                        'aws_secret_access_key'
                    )

            if provider.lower() == SPLUNK_HOSTED_LLM.lower():
                scs_token, _ = get_cached_scs_token(None, None, self.search_info)
                config['api_key'] = scs_token
                config['chat_models_url'], config['endpoint'] = get_scs_url(self.search_info)

            effective_provider = provider.lower()
            if is_custom:
                effective_provider = "openai"
                config["endpoint"] = connection_details.get("endpoint", "")

                auth_type = connection_details.get("auth_type", "").upper()
                if auth_type == "OIDC":
                    from connection_config_manager.utils.oidc_utils import exchange_oidc_token

                    auth_conn = connection_details.get("auth_connection_details", {})
                    if auth_conn.get('client_secret') == DEFAULT_ACCESS_TOKEN:
                        auth_conn['client_secret'] = (
                            existing_config.get('connection_details', {})
                            .get("auth_connection_details", {})
                            .get('client_secret')
                        )
                    oidc_token = exchange_oidc_token(auth_conn)
                    config["api_key"] = oidc_token

            test_prompt = (
                "Hello, this is a connection test. Please respond with 'Connection successful'."
            )
            reasoning_effort = llm_params.get("reasoning_effort", None)

            start_time = time.time()
            result = AicommanderMetadata._make_llm_request(
                effective_provider,
                config,
                model,
                test_prompt,
                config['max_tokens'],
                config['temperature'],
                config['timeout'],
                reasoning_effort=reasoning_effort,
            )
            response_time = round(time.time() - start_time, 2)

            if isinstance(result, dict):
                if 'response_time' not in result:
                    result['response_time'] = response_time
                if 'provider' not in result:
                    result['provider'] = provider
                if 'model' not in result:
                    result['model'] = model

                if 'status' not in result:
                    result['status'] = 'error'
                    result['message'] = AicommanderMetadata._get_user_friendly_error(
                        provider=provider,
                        error_message="Unknown error - missing STATUS from connection test",
                    )

                if result.get("status") != "success":
                    logger.error(
                        f"Connection test failed for connection='{connection_name}', "
                        f"provider='{provider}', model='{model}': {result.get('message')}"
                    )
                else:
                    logger.info(
                        f"Connection test succeeded for connection='{connection_name}', "
                        f"provider='{provider}', model='{model}'."
                    )

                return result
            else:
                return {
                    "status": "error",
                    "message": AicommanderMetadata._get_user_friendly_error(
                        provider=provider,
                        error_message="Invalid response format from connection test",
                    ),
                    "response_time": response_time,
                    "provider": provider,
                    "model": model,
                }

        except Exception as e:
            logger.error(
                f"Failed to test LLM connection for connection='{connection_name}', "
                f"provider='{provider}', model='{model}': {traceback.format_exc()}"
            )
            return {
                "status": "error",
                "message": AicommanderMetadata._get_user_friendly_error(
                    provider=provider or "unknown",
                    error_message="Connection test failed due to a configuration error. Please verify your settings and try again.",
                ),
                "provider": provider,
                "model": model,
            }

    def list_llm_configs(self) -> list:
        """
        Lists all LLM configurations.

        Returns:
            list: A list of LLM configurations.
        """
        logger.debug("list_llm_configs called")
        try:
            configs = self.config_manager.get_llm_config()
            for config in configs:
                self._mask_secret_ids(config)
            return configs
        except Exception as e:
            logger.error(f"Error listing LLM configurations: {str(traceback.format_exc())}")
            return []

    def delete_llm_config(self, connection_name: str) -> bool:
        """
        Deletes the specified LLM configuration.

        Args:
            connection_name (str): The name of the connection to delete.

        Returns:
            dict: A dictionary containing the status and message of the deletion operation.
        """
        logger.debug("delete_llm_config called for connection_name=%s", connection_name)
        try:
            return self.config_manager.delete_llm_config(connection_name)
        except Exception as e:
            logger.error(f"Error deleting LLM configuration: {str(traceback.format_exc())}")
            return False

    def update_llm_config(self, config: dict) -> bool:
        """
        Updates the specified LLM configuration.

        Args:
            config (dict): The LLM configuration to update.

        Returns:
            dict: A dictionary containing the status and message of the update operation.
        """
        logger.debug("update_llm_config called for connection_name=%s", config.get("name"))
        try:
            current_config = self.config_manager.get_llm_config(config.get("name"))
            if not current_config:
                logger.error(
                    f"LLM configuration with connection name '{config.get('name')}' does not exist or not allowed for user."
                )
                return False
            current_config = current_config[0]
            secrets_update = self._is_secrets_updated(config)
            if not secrets_update:
                return self.config_manager.update_llm_config(config)
            else:
                logger.debug(
                    "Secrets have been updated, proceeding to update secrets store before updating config."
                )
                is_updated = self.secrets_manager.update_secrets(current_config, config)
                if is_updated:
                    return self.config_manager.update_llm_config(config)
                else:
                    logger.error(
                        "Failed to update secrets for connection_name=%s", config.get("name")
                    )
                    return False
        except Exception as e:
            logger.error(f"Error updating LLM configuration: {str(traceback.format_exc())}")
            return False

    def _is_secrets_updated(self, config: dict) -> bool:
        """
        Checks if the secrets in the LLM configuration have been updated.

        Args:
            config (dict): The LLM configuration to check.
        Returns:
            bool: True if the secrets have been updated, False otherwise.
        """

        is_custom = config.get("is_custom", False)
        provider = config.get("provider")
        connection_details = config.get("connection_details", {})

        if is_custom:
            auth_type = connection_details.get("auth_type", "")
            if auth_type == "API_KEY":
                return connection_details.get("access_token") != DEFAULT_ACCESS_TOKEN
            elif auth_type == "OIDC":
                return (
                    connection_details.get("auth_connection_details", {}).get("client_secret")
                    != DEFAULT_ACCESS_TOKEN
                )
            else:
                return False

        if (provider or "").lower() == "splunk hosted models":
            return False

        if (provider or "").lower() in TOKEN_BASED_PROVIDERS:
            return connection_details.get("access_token") != DEFAULT_ACCESS_TOKEN

        if (provider or "").lower() == "bedrock":
            bedrock_secret_fields = [
                "aws_access_key_id",
                "aws_access_token",
                "region",
                "role_arn",
            ]
            return any(
                connection_details.get(field) != DEFAULT_ACCESS_TOKEN
                for field in bedrock_secret_fields
            )

        return False

    def _mask_secret_ids(self, config: dict) -> None:
        """
        Masks the secrets_id in the LLM configuration to prevent exposure of sensitive information.

        Args:
            config (dict): The LLM configuration to mask.
        """
        provider = config.get("provider")
        connection_details = config.get("connection_details", {})

        is_custom = config.get("is_custom", False)

        if (provider or "").lower() == "splunk hosted models":
            return

        connection_details.pop("secrets_id", None)

        if (provider or "").lower() in TOKEN_BASED_PROVIDERS:
            connection_details["access_token"] = DEFAULT_ACCESS_TOKEN
            return

        if (provider or "").lower() == "bedrock":
            bedrock_secret_fields = [
                "aws_access_key_id",
                "aws_access_token",
                "region",
                "role_arn",
            ]
            for field in bedrock_secret_fields:
                if connection_details.get(field) != DEFAULT_ACCESS_TOKEN:
                    connection_details[field] = DEFAULT_ACCESS_TOKEN
            return

        if is_custom:
            if connection_details.get("auth_type", "") == "API_KEY":
                connection_details["access_token"] = DEFAULT_ACCESS_TOKEN
            elif connection_details.get("auth_type", "") == "OIDC":
                connection_details["auth_connection_details"][
                    "client_secret"
                ] = DEFAULT_ACCESS_TOKEN

    def _fill_secrets(self, connection_config: dict) -> None:
        """
        Fills the secrets in the connection configuration.

        Args:
            connection_config (dict): The connection configuration dictionary to be filled with secrets.
        """
        provider = connection_config.get("provider", "")
        is_custom = connection_config.get("is_custom", False)
        if provider == SPLUNK_HOSTED_LLM:
            return  # No secrets needed for Splunk Hosted LLM
        secrets_id = connection_config.get("connection_details", {}).get("secrets_id", "")
        if not secrets_id:
            logger.warning(
                f"No secrets_id found in connection details for provider {provider}. Skipping secrets filling."
            )
            return
        secret_str = self.secrets_manager.get_secret(secrets_id)
        if provider == BEDROCK:
            secret = json.loads(secret_str)
            for key in secret.keys():
                connection_config["connection_details"][key] = secret[key]
        elif is_custom:
            auth_type = connection_config["connection_details"].get("auth_type", "")
            if auth_type == "API_KEY":
                connection_config["connection_details"]["access_token"] = secret_str
            elif auth_type == "OIDC":
                connection_config["connection_details"]["auth_connection_details"][
                    "client_secret"
                ] = secret_str
        else:
            connection_config["connection_details"]["access_token"] = secret_str
        connection_config["connection_details"].pop("secrets_id", None)
