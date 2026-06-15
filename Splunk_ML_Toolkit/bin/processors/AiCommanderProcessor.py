import uuid
import httpx
import cexc
import itertools
import re
import json
import pandas as pd
from .BaseProcessor import BaseProcessor
from util.telemetry_util import log_ai_commander_info, Timer
from ai_commander.llm_base import LLM

from ai_commander.llm_factory import LLMFactory
from ai_commander.ai_commander_util import AICommanderUtil
from util.ai_commander_util import get_scs_url, get_cached_scs_token
from connection_config_manager.llm.llm_config_manager import LLMConfigManager, SecretsManager
from ai_commander.chat_models_check import is_hosted_llm_available
from ai_commander.constants import (
    PARAMS,
    PROVIDER,
    BEDROCK,
    KB_ID,
    SPLUNK_HOSTED_LLM,
    MAX_RESULT_ROWS,
    LLM_INTEGRATION_CONFIG,
)
from util.mlspl_loader import MLSPLConf

logger = cexc.get_logger(__name__)


class AiCommanderProcessor(BaseProcessor):
    def __init__(self, process_options: dict, searchinfo: dict) -> None:
        """
        Initializes the AiCommanderProcessor with the given process options and search information.

        Args:
            process_options (dict):
                Options related to processing, including parameters.
            searchinfo (dict):
                Information about the search context.
        """
        self.searchinfo = searchinfo
        self.process_options = process_options
        self.ai_commander_util = AICommanderUtil(searchinfo)
        self.llm_config_manager = LLMConfigManager(searchinfo)
        self.secrets_manager = SecretsManager(searchinfo)
        self.llm_config = self.get_llm_config()
        self.provider_name = self.llm_config.get("provider", "").strip(" '\"")
        http_client = httpx.Client(verify=True)
        ## if kb_id avaliable then provider should be bedrock , exception raise
        if KB_ID in self.process_options[PARAMS]:
            if self.provider_name != BEDROCK:
                raise RuntimeError(
                    "Provider should be 'Bedrock' when kb_id is provided, "
                    "but found: {}".format(self.provider_name)
                )
            else:
                ##if no fastapi installed then raise exception and also check the version of the litellm which shold be grater than 1.68 for using kb_id
                if not self.ai_commander_util.is_fastapi_installed():
                    raise RuntimeError(
                        "FastAPI is not installed, but required when kb_id is provided."
                    )
                if not self.ai_commander_util.is_litellm_supported():
                    raise RuntimeError("LiteLLM ≥ 1.80.0 is required when kb_id is provided.")

        self.llm = LLM(self.ai_commander_util, http_client=http_client)
        self.llm_factory = LLMFactory(self.ai_commander_util, self.llm_config)
        mlspl = MLSPLConf(searchinfo)
        self.process_options[LLM_INTEGRATION_CONFIG] = mlspl.get_stanza(LLM_INTEGRATION_CONFIG)

        self._scs_token = None
        self._scs_token_expiry = None
        self.total_processed_rows = 0

    def get_llm_config(self) -> dict:
        """
        Sets the llm connection configuration based on the provided process options.

        Args:
            connection_name (str): The name of the connection to be used.

        Raises:
            RuntimeError: If the connection configuration cannot be retrieved or set.
        """
        try:
            connection_config = None
            if 'connection' in self.process_options[PARAMS]:
                connection_name = self.process_options[PARAMS]['connection'].strip(" '\"")
                connection_configs = self.llm_config_manager.get_llm_config(connection_name)
                connection_config = connection_configs[0] if connection_configs else None
                if not connection_config:
                    raise RuntimeError(
                        f"No configuration found for llm connection: {connection_name}"
                    )
            elif (
                PROVIDER in self.process_options[PARAMS]
                and 'model' in self.process_options[PARAMS]
            ):
                connection_configs = self.llm_config_manager.get_llm_config(
                    provider=self.process_options[PARAMS][PROVIDER].strip(" '\""),
                    model=self.process_options[PARAMS]['model'].strip(" '\""),
                )
                if not connection_configs:
                    raise RuntimeError(
                        f"No configuration found for provider: {self.process_options[PARAMS][PROVIDER]} and model: {self.process_options[PARAMS]['model']}"
                    )
                elif len(connection_configs) > 1:
                    raise RuntimeError(
                        f"Multiple configurations found for provider: {self.process_options[PARAMS][PROVIDER]} and model: {self.process_options[PARAMS]['model']}. Provide connection name instead."
                    )
                connection_config = connection_configs[0]
            else:
                default_config = self.llm_config_manager.get_default_llm_config()
                if not default_config:
                    raise RuntimeError("No default LLM configuration found.")
                connection_config = default_config
            self._fill_secrets(connection_config)
            return connection_config
        except Exception as e:
            logger.error(f"Failed to set connection config : {str(e)}")
            raise

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

    def validate_params(self, prompt: str) -> list:
        """
        Validates that all placeholders in the prompt exist as columns in the dataframe.

        Args:
            prompt (str):
                The prompt string containing placeholders.

        Returns:
            list:
                A list of placeholder names.

        Raises:
            ValueError: If any placeholder does not exist in the dataframe columns.
        """
        # Extract placeholders using regex to handle all formats like {col1}, {col1}-{col2}, etc.
        placeholders = re.findall(r"{(.*?)}", prompt)

        # Check for missing columns
        missing_columns = [col for col in placeholders if col not in self.df.columns]
        if missing_columns:
            raise ValueError(f"Missing columns in CSV: {missing_columns}")

        return placeholders

    def substitute_values(self, template: str, row: dict) -> str:
        """
        Substitutes values into the given template based on row data.

        Args:
            template (str):
                The template string with placeholders.
            row (dict):
                The row data to be used for substitution.

        Returns:
            str:
                The formatted string.
        """
        return template.format(**row)

    def process(self) -> None:
        """
        Processes the AI command request by formatting the prompt and calling the AI model.

        Raises:
            RuntimeError: If the model is not available for the provider.
        """
        prompt = self.process_options['params']['prompt'].replace('"', '')
        self.model_name = self.llm_config.get("model", "").strip(" '\"")
        scs_token = None
        tenant = None
        tenantHostName = None
        chat_models_url = None
        chat_completions_url = None
        if self.provider_name == SPLUNK_HOSTED_LLM:
            try:
                if not is_hosted_llm_available(self.searchinfo):
                    raise RuntimeError("The order for Splunk is not yet placed")
            except RuntimeError:
                # Let intentional RuntimeError bubble up
                raise
            except Exception as e:
                logger.error(f"Failed to read feature flag: {str(e)}")
                raise RuntimeError("Unable to verify feature flag status") from str(e)

            with Timer() as get_scs_t:
                scs_token, scs_token_expiry = get_cached_scs_token(
                    self._scs_token, self._scs_token_expiry, self.searchinfo
                )
                self._scs_token_expiry = scs_token_expiry
                self._scs_token = scs_token
            logger.debug(
                f"command=ai, provider={self.provider_name},"
                f" get_scs_token_time={get_scs_t.interval}"
            )

            chat_models_url, chat_completions_url = get_scs_url(self.searchinfo)

            logger.debug(
                f"command=ai, provider={self.provider_name},"
                f" tenant={tenant}, tenant_host={tenantHostName}, "
                f"url={chat_completions_url} "
            )

        max_records = int(self.llm_config.get("llm_params", {}).get(MAX_RESULT_ROWS, 25))
        remaining = max_records - self.total_processed_rows

        logger.debug(
            f"command=ai, provider={self.provider_name},"
            f" model={self.model_name}, remaining={remaining},"
            f" total_processed_rows={self.total_processed_rows}"
        )

        def _generate_unique_column_name(base_name: str) -> str:
            """
            Generates a unique column name to avoid conflicts.

            Args:
                base_name (str):
                    The base name for the column.

            Returns:
                str:
                    A unique column name.
            """
            i = 1
            while f"{base_name}_{i}" in self.df.columns:
                i += 1
            return f"{base_name}_{i}"

        column_name = _generate_unique_column_name("ai_result")
        self.df[column_name] = None
        with Timer() as timer:
            results = []
            if remaining > 0:
                for _, row in itertools.islice(self.df.iterrows(), remaining):
                    request_id = str(uuid.uuid4())
                    try:
                        with Timer() as timed:
                            substituted_str = self.substitute_values(prompt, row)
                            result = self.llm_factory.call(
                                self.model_name,
                                substituted_str,
                                self.process_options,
                                self.llm_config,
                                scs_token=scs_token,
                                url=chat_completions_url,
                                request_id=request_id,
                                searchinfo=self.searchinfo,
                            )
                    except Exception as e:
                        logger.error(
                            f"command=ai, request_id={request_id}, provider={self.provider_name},"
                            f" model={self.model_name}, llm_completion_time={timed.interval}, is_success=0,"
                            f"error_message={str(e)}"
                        )
                        raise RuntimeError(e)

                    logger.debug(
                        f"command=ai, request_id={request_id}, provider={self.provider_name},"
                        f" model={self.model_name}, llm_completion_time={timed.interval}, is_success=1"
                    )
                    results.append(result)
                    self.total_processed_rows += 1
            self.df[column_name] = None
            self.df.loc[: len(results) - 1, column_name] = results

        log_ai_commander_info(
            self.provider_name,
            self.model_name,
            min(max_records, self.df.shape[0]),
            timer.interval,
        )

    def get_relevant_fields(self) -> list:
        """
        Returns a list of relevant fields for processing.

        Returns:
            list:
                An empty list (can be customized in future implementations).
        """
        return []
