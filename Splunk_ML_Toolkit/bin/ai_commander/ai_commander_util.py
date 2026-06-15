import json, copy
import traceback
import cexc
import re
from datetime import datetime, timezone

from ai_commander.constants import (
    SET_AS_DEFAULT,
    ACCESS_TOKEN,
    VALUE,
    CLEAR_PASSWORD,
    ANTHROPIC,
    AZUREOPENAI,
    GEMINI,
    MODELS,
    COLLECTION_NAME,
    BEDROCK,
    GROQ,
    OLLAMA,
    OPENAI,
    REGION,
    BEDROCK_ACCESS_KEY,
    BEDROCK_ROLE,
    ACCESS_KEY_ID,
    REQUEST_TIMEOUT,
    ENDPOINT,
    SPLUNK_HOSTED_LLM,
    CONFIG_DATA,
    CONFIG_VERSION,
    CONNECTION_NAME,
    DEFAULT_ACCESS_TOKEN,
)
from ai_commander.update_config import (
    get_data,
    update_anthropic_models,
    update_azureopenai_models,
    update_bedrock_models,
    update_gemini_models,
    update_groq_models,
    update_openai_models,
    update_ollama_models,
    update_splunk_models,
    merge_metadata_with_kv,
)
from util.ai_commander_util import (
    upsert_documents_into_kv_store,
    handle_secrets,
    execute_in_psc_compiler,
    get_scs_token_from_session,
    get_tentantinfo_from_session,
    get_scs_url,
)

from util.rest_url_util import get_user_capabilities
from ai_commander.chat_models_check import is_hosted_llm_available

logger = cexc.get_logger(__name__)

REASONING_EFFORT_FIELD = {
    "label": "Reasoning Effort",
    "value": "NONE",
    "type": "select",
    "required": False,
    "description": "Controls the model reasoning effort level for supported providers.",
    "options": [
        {"label": "NONE", "value": "NONE"},
        {"label": "HIGH", "value": "HIGH"},
        {"label": "MEDIUM", "value": "MEDIUM"},
        {"label": "LOW", "value": "LOW"},
    ],
}


def _inject_reasoning_effort(config: dict) -> dict:
    for provider_cfg in config.values():
        if not isinstance(provider_cfg, dict):
            continue
        models = provider_cfg.get(MODELS, {})
        for model_cfg in models.values():
            if not isinstance(model_cfg, dict):
                continue
            if "reasoning_effort" in model_cfg:
                continue

            reordered_model_cfg = {}
            inserted = False
            for field_name, field_config in model_cfg.items():
                if field_name == SET_AS_DEFAULT and not inserted:
                    reordered_model_cfg["reasoning_effort"] = copy.deepcopy(
                        REASONING_EFFORT_FIELD
                    )
                    inserted = True
                reordered_model_cfg[field_name] = field_config

            if not inserted:
                reordered_model_cfg["reasoning_effort"] = copy.deepcopy(REASONING_EFFORT_FIELD)

            model_cfg.clear()
            model_cfg.update(reordered_model_cfg)
    return config


class AICommanderUtil:
    def __init__(self, searchinfo):
        self.searchinfo = searchinfo
        self.collection_name = COLLECTION_NAME
        self._last_seen_splunk_ids = {}

    def get_default_llm_config(self) -> dict:
        """
        Extracts the llm_connections section from CONFIG_DATA.
        Ensures a consistent entry point for all methods.
        """
        try:
            full_config = json.loads(CONFIG_DATA)
            return _inject_reasoning_effort(full_config.get("llm_connections", {}))
        except Exception as e:
            logger.error(f"Failed to parse CONFIG_DATA: {e}")
            return {"connection_type": "LLM", "metadata": {}}

    def _clean_splunk_models(self, config: dict) -> dict:
        """
        Removes 'id' from Splunk Hosted LLM models when exposing config to UI,
        but stores them in self._last_seen_ids so they can be restored later.
        """
        splunk_models = config.get(SPLUNK_HOSTED_LLM, {})
        models = splunk_models.get("models", {})

        for model_name, model_cfg in models.items():
            if isinstance(model_cfg, dict) and "id" in model_cfg:
                self._last_seen_splunk_ids[model_name] = model_cfg["id"]
                model_cfg.pop("id", None)  # strip for UI

        return config, copy.deepcopy(self._last_seen_splunk_ids)

    def _clean_provider_models(self, config: dict) -> dict:
        """
        Removes transient fields like 'is_model_saved' and 'Connection Name' when reading
        from KVStore, so the UI never sees them. Persists them internally in KVStore.
        """
        for provider_name, provider_cfg in config.items():
            if not isinstance(provider_cfg, dict):
                continue
            provider_cfg.pop("is_saved", None)
            models = provider_cfg.get("models", {})
            for model_name, model_cfg in models.items():
                if not isinstance(model_cfg, dict):
                    continue
                model_cfg.pop("is_model_saved", None)

        return config

    def read_file(self, is_token_required: bool = False, provider_name=None) -> dict:
        """
        Args:
            is_token_required (bool):
                If True, retrieves and injects access tokens or secrets into the provider details.

        Returns:
            dict:
                Final data containing provider details with or without tokens based on the flag.
        """
        try:
            final_data = get_data(self.searchinfo, self.collection_name)
            default_config = self.get_default_llm_config()
            final_data = merge_metadata_with_kv(default_config, final_data)
            final_data.pop("metadata", None)
            final_data.pop("connection_type", None)
            if provider_name:
                provider_name = provider_name.strip('"').strip("'")
                final_data = {provider_name: final_data.get(provider_name, "")}
            if is_token_required:
                for provider, provider_details in final_data.items():
                    if provider == SPLUNK_HOSTED_LLM:
                        continue
                    response = handle_secrets(searchinfo=self.searchinfo, provider=provider)
                    clear_password = response.get(CLEAR_PASSWORD, "")
                    if provider != BEDROCK:
                        if (
                            ACCESS_TOKEN in provider_details
                            and VALUE in provider_details[ACCESS_TOKEN]
                        ):
                            provider_details[ACCESS_TOKEN][VALUE] = clear_password
                    else:
                        if clear_password:
                            try:
                                clear_aws_keys = json.loads(clear_password)
                                provider_details[REGION][VALUE] = clear_aws_keys[
                                    "aws_region_name"
                                ]
                                provider_details[ACCESS_KEY_ID][VALUE] = clear_aws_keys[
                                    "aws_access_key_id"
                                ]
                                provider_details[BEDROCK_ACCESS_KEY][VALUE] = clear_aws_keys[
                                    "aws_secret_access_key"
                                ]
                                provider_details[BEDROCK_ROLE][VALUE] = clear_aws_keys[
                                    "aws_role_name"
                                ]
                            except json.JSONDecodeError as e:
                                logger.error(
                                    f"JSON decoding failed for provider {provider}: {e}"
                                )
                                provider_details[REGION][VALUE] = ""
                                provider_details[ACCESS_KEY_ID][VALUE] = ""
                                provider_details[BEDROCK_ACCESS_KEY][VALUE] = ""
                                provider_details[BEDROCK_ROLE][VALUE] = ""
                        else:
                            provider_details[REGION][VALUE] = ""
                            provider_details[ACCESS_KEY_ID][VALUE] = ""
                            provider_details[BEDROCK_ACCESS_KEY][VALUE] = ""
                            provider_details[BEDROCK_ROLE][VALUE] = ""
            return final_data
        except Exception:
            logger.error(str(traceback.format_exc()))
            return {}

    def read_meta_data(self, flag_name: str) -> dict:
        """
        Reads CONFIG_DATA, removes metadata initially, strips provider/model-level
        flags, and conditionally updates Splunk_Hosted_LLM models if the feature
        flag is enabled, or removes it if disabled.

        Args:
            flag_name (str): Name of the feature flag to check.

        Returns:
            dict: Updated CONFIG_DATA dictionary with transient fields removed.
        """
        try:
            config = self.get_default_llm_config()
            config.pop("metadata", None)
            config.pop("connection_type", None)
            config = self._clean_provider_models(config)

            def _strip_connection_name(cfg: dict) -> dict:
                for prov, prov_cfg in cfg.items():
                    if not isinstance(prov_cfg, dict):
                        continue
                    models = prov_cfg.get("models", {})
                    for mname, mcfg in models.items():
                        if isinstance(mcfg, dict):
                            mcfg.pop(CONNECTION_NAME, None)
                return cfg

            config = _strip_connection_name(config)
            flag_enabled = is_hosted_llm_available(self.searchinfo)
            if flag_enabled:
                gpt_4o_mini_settings = (
                    config.get("OpenAI", {}).get("models", {}).get("gpt-4o-mini", {})
                )
                scs_token = get_scs_token_from_session(self.searchinfo)
                chat_models_url, _ = get_scs_url(self.searchinfo)
                config = update_splunk_models(
                    config, gpt_4o_mini_settings, scs_token=scs_token, url=chat_models_url
                )
                config, _ = self._clean_splunk_models(config)
            else:
                logger.debug(
                    f"Feature flag '{flag_name}' is disabled. Removing Splunk Hosted Models from config."
                )
                config.pop(SPLUNK_HOSTED_LLM, None)
            return config
        except Exception as e:
            logger.error(f"Failed to read meta data: {e}")
            logger.error(str(traceback.format_exc()))
            fallback = self.get_default_llm_config()
            fallback.pop("metadata", None)
            fallback.pop("connection_type", None)
            fallback = self._clean_provider_models(fallback)
            for prov, prov_cfg in fallback.items():
                if isinstance(prov_cfg, dict):
                    models = prov_cfg.get("models", {})
                    for mcfg in models.values():
                        if isinstance(mcfg, dict):
                            mcfg.pop(CONNECTION_NAME, None)
            return fallback

    def check_user_role_eligibility(self, required_capabilities: list) -> bool:
        """
        Args:
            required_capabilities (list):
                A list of capabilities required for the user.

        Returns:
            bool:
                True if the user has all required capabilities, otherwise False.
        """
        splunkd_uri = self.searchinfo.get("splunkd_uri")
        token = self.searchinfo.get("session_key")
        user = self.searchinfo.get("username")
        capabilities = get_user_capabilities(splunkd_uri, token, username=user)
        return all(item in capabilities for item in required_capabilities)

    def check_capabilities_eligibility_from_search_info(
        self, required_capabilities: list
    ) -> bool:
        """
        Checks if the user associated with the provided searchinfo has the required capabilities.

        Args:
            required_capabilities (list): A list of capabilities to check against the user's capabilities.

        Returns:
            bool: True if the user has all required capabilities, otherwise False.
        """
        capabilities = self.searchinfo.get("capabilities", [])
        return all(item in capabilities for item in required_capabilities)

    def write_file(self, data: dict) -> None:
        """
        Args:
            data (dict):
            The provider details to be written to the KV store.
         Returns:
             None
        """
        try:
            existing_data = get_data(self.searchinfo, self.collection_name)
            default_config = self.get_default_llm_config()
            final_existing_data = merge_metadata_with_kv(default_config, existing_data)
            metadata = final_existing_data.get("metadata", {})
            now_str = str(datetime.now(timezone.utc))
            metadata["version"] = CONFIG_VERSION
            if metadata["created_at"] == '':
                metadata["created_at"] = now_str
            metadata["modified_at"] = now_str
            for provider, provider_details in data.items():
                if provider != BEDROCK:
                    if ACCESS_TOKEN in provider_details:
                        provider_details[ACCESS_TOKEN][VALUE] = ""
                else:
                    provider_details[REGION][VALUE] = ""
                    provider_details[ACCESS_KEY_ID][VALUE] = ""
                    provider_details[BEDROCK_ACCESS_KEY][VALUE] = ""
                    provider_details[BEDROCK_ROLE][VALUE] = ""

            data["metadata"] = metadata
            data["connection_type"] = "llm"
            upsert_documents_into_kv_store(self.searchinfo, self.collection_name, data)
        except Exception:
            logger.error(str(traceback.format_exc()))

    def merge_string(self, data: dict) -> str:
        """
        Args:
            data (dict):
                Dictionary with keys as digits and values as strings.

        Returns:
            str:
                Merged string based on sorted digit keys or the 'value' field.
        """
        if isinstance(data, dict):
            merged_str = ''.join([v for k, v in sorted(data.items()) if k.isdigit()])
            return merged_str if merged_str else data.get('value', '')
        return data

    def update_default(self, json_data: dict, provider_name: str, model_name: str) -> dict:
        """
        Args:
            json_data (dict):
                Configuration data containing providers and models.
            provider_name (str):
                The provider whose model should be updated.
            model_name (str):
                The model to be set as default.
        Returns:
            dict:
                Updated configuration data with the default model set.
        """
        for provider in json_data:
            for model in json_data[provider]['models']:
                json_data[provider]['models'][model][SET_AS_DEFAULT]['value'] = False
        if provider_name in json_data and model_name in json_data[provider_name]['models']:
            json_data[provider_name]['models'][model_name][SET_AS_DEFAULT]['value'] = True
        return json_data

    def update_settings(
        self,
        json_data: dict,
        service: str,
        model: str,
        modelsettings: dict,
        servicesettings: dict,
    ) -> dict:
        """
        Args:
            json_data (dict): Configuration data for providers and models.
            service (str): Name of the service provider.
            model (str): Model name to be updated.
            modelsettings (dict): Settings for the model.
            servicesettings (dict): Settings for the service provider.

        Returns:
            dict: Updated configuration data.
        """
        access_token = None
        if service not in json_data:
            json_data[service] = {"models": {}, "is_saved": {"value": False}}
        if MODELS not in json_data[service]:
            json_data[service][MODELS] = {}
        if model and model not in json_data[service][MODELS]:
            json_data[service][MODELS][model] = copy.deepcopy(modelsettings)
            json_data[service][MODELS][model]["is_model_saved"] = {"value": False}
            json_data[service][MODELS][model][CONNECTION_NAME] = {"value": ""}

        service_data = json_data[service]
        kv_data = self.read_file(is_token_required=False)
        is_saved_value = kv_data[service]["is_saved"][VALUE]
        response = handle_secrets(searchinfo=self.searchinfo, provider=service)
        if service == BEDROCK:
            aws_keys = {
                "aws_region_name": servicesettings[REGION][VALUE],
                "aws_access_key_id": servicesettings[ACCESS_KEY_ID][VALUE],
                "aws_secret_access_key": servicesettings[BEDROCK_ACCESS_KEY][VALUE],
                "aws_role_name": servicesettings[BEDROCK_ROLE][VALUE],
            }
            if any(aws_keys.values()) == DEFAULT_ACCESS_TOKEN and is_saved_value:
                access_response = handle_secrets(
                    searchinfo=self.searchinfo, provider=service, type="SELECT"
                )
                stored = access_response.get("clear_password")
                if stored:
                    aws_keys = json.loads(stored)
                access_token = json.dumps(aws_keys)
            access_token = json.dumps(aws_keys)
        elif service != SPLUNK_HOSTED_LLM:
            if servicesettings != None:
                access_token = servicesettings[ACCESS_TOKEN][VALUE]
                if access_token == DEFAULT_ACCESS_TOKEN and is_saved_value:
                    access_response = handle_secrets(
                        searchinfo=self.searchinfo, provider=service, type="SELECT"
                    )
                    stored = access_response.get("clear_password")
                    if stored:
                        access_token = stored
        if access_token:
            if not response.get(CLEAR_PASSWORD, ""):
                response = handle_secrets(
                    searchinfo=self.searchinfo,
                    provider=service,
                    token=access_token,
                    type="CREATE",
                )
            else:
                response = handle_secrets(
                    searchinfo=self.searchinfo,
                    provider=service,
                    token=access_token,
                    type="UPDATE",
                )
        for setting in service_data:
            if service == SPLUNK_HOSTED_LLM:
                if setting not in [MODELS] and setting != "is_saved":
                    json_data[service][setting][VALUE] = servicesettings[setting][VALUE]
            else:
                if setting not in [MODELS] and setting != "is_saved":
                    json_data[service][setting][VALUE] = servicesettings[setting][VALUE]
        if model:
            model_data = json_data[service][MODELS][model]
            for setting in model_data:
                if setting == "is_model_saved" or setting == CONNECTION_NAME or setting == "id":
                    continue
                if setting == "acl":
                    continue
                model_data[setting][VALUE] = modelsettings[setting][VALUE]
                if setting == SET_AS_DEFAULT and modelsettings[setting][VALUE]:
                    json_data = self.update_default(json_data, service, model)
            if isinstance(modelsettings.get("acl"), dict):
                model_data["acl"] = copy.deepcopy(modelsettings["acl"])
        return json_data

    def validate_url(self, url, service_name) -> bool:
        if url is None:
            return False
        https_pattern = re.compile(
            r'^(https:\/\/)(localhost|(\d{1,3}\.){3}\d{1,3}|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d+)?(\/\S*)?$'
        )
        http_or_https_pattern = re.compile(
            r'^(https?:\/\/)(localhost|(\d{1,3}\.){3}\d{1,3}|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d+)?(\/\S*)?$'
        )

        if service_name.lower() == 'ollama':
            return bool(http_or_https_pattern.match(url))  # Allow both http and https
        else:
            return bool(https_pattern.match(url))  # Only allow https

    def update_conf_file(self, data_to_update: str) -> dict:
        """
        Args:
            data_to_update (str): JSON string containing configuration updates.

        Returns:
            dict: Updated configuration data.
        """
        config = self.read_file()
        updated_config = dict()
        data_to_update = json.loads(data_to_update)
        is_upsert = data_to_update.get("is_upsert", False)
        default_config = self.get_default_llm_config()
        gpt_4o_mini_settings = (
            default_config.get("OpenAI", {}).get("models", {}).get("gpt-4o-mini", {})
        )
        model_name = data_to_update.get("model")
        connection_name = (
            data_to_update.get("modelsettings", {}).get(CONNECTION_NAME, {}).get("value", None)
        )
        if data_to_update["service"] == SPLUNK_HOSTED_LLM:
            self.read_meta_data("slim_mltk_hosted_llm_feature_enabled")
            _last_seen_splunk_ids = copy.deepcopy(self._last_seen_splunk_ids)
            splunk_models = config[SPLUNK_HOSTED_LLM]["models"]
            if model_name:
                if model_name not in splunk_models:
                    splunk_models[model_name] = copy.deepcopy(data_to_update["modelsettings"])
                    if model_name in _last_seen_splunk_ids:
                        splunk_models[model_name]["id"] = _last_seen_splunk_ids[model_name]
                    splunk_models[model_name]["is_model_saved"] = {"value": False}
                    splunk_models[model_name][CONNECTION_NAME] = {"value": ""}
                updated_config = self.update_settings(
                    config,
                    data_to_update["service"],
                    data_to_update["model"],
                    data_to_update["modelsettings"],
                    data_to_update["servicesettings"],  # Expected to be None
                )
                if model_name in self._last_seen_splunk_ids:
                    updated_config[SPLUNK_HOSTED_LLM]["models"][model_name][
                        "id"
                    ] = self._last_seen_splunk_ids[model_name]

                updated_config[SPLUNK_HOSTED_LLM]["models"][model_name]["is_model_saved"][
                    "value"
                ] = True
                model_entry = updated_config[SPLUNK_HOSTED_LLM]["models"][model_name]
                if CONNECTION_NAME not in model_entry:
                    model_entry[CONNECTION_NAME] = {"value": connection_name}
                else:
                    model_entry[CONNECTION_NAME]["value"] = connection_name
                updated_config[SPLUNK_HOSTED_LLM]["is_saved"]["value"] = True
            else:
                updated_config = copy.deepcopy(config)

            if is_upsert:
                self.write_file(updated_config)

            return updated_config

        if int(data_to_update["servicesettings"][REQUEST_TIMEOUT][VALUE]) > 600:
            raise RuntimeError("Maximum allowed LLM request timeout is 600 seconds.")
        if data_to_update["service"] != BEDROCK:
            endpoint_url = data_to_update["servicesettings"][ENDPOINT][VALUE]
            is_url_valid = self.validate_url(endpoint_url, data_to_update["service"])
            if not is_url_valid:
                raise RuntimeError("Invalid Endpoint URL.")
        if data_to_update["service"] == BEDROCK:
            secret_response = handle_secrets(searchinfo=self.searchinfo, provider=BEDROCK)
            if secret_response.get(CLEAR_PASSWORD, ""):
                try:
                    existing_keys = json.loads(secret_response[CLEAR_PASSWORD])
                except json.JSONDecodeError:
                    existing_keys = {}
            else:
                existing_keys = {}
            for field in [REGION, ACCESS_KEY_ID, BEDROCK_ACCESS_KEY, BEDROCK_ROLE]:
                current_value = data_to_update["servicesettings"][field][VALUE]
                if current_value == DEFAULT_ACCESS_TOKEN:
                    key_map = {
                        REGION: "aws_region_name",
                        ACCESS_KEY_ID: "aws_access_key_id",
                        BEDROCK_ACCESS_KEY: "aws_secret_access_key",
                        BEDROCK_ROLE: "aws_role_name",
                    }
                    data_to_update["servicesettings"][field][VALUE] = existing_keys.get(
                        key_map[field], ""
                    )
            psc_boto_config = {BEDROCK: data_to_update["servicesettings"]}
            psc_resp = execute_in_psc_compiler(psc_boto_config)
            if psc_resp:
                config = update_bedrock_models(config, psc_resp, gpt_4o_mini_settings)
                if data_to_update["model"]:
                    updated_config = self.update_settings(
                        config,
                        data_to_update["service"],
                        data_to_update["model"],
                        data_to_update["modelsettings"],
                        data_to_update["servicesettings"],
                    )
                    updated_config[BEDROCK]["models"][model_name]["is_model_saved"][
                        "value"
                    ] = True
                    model_entry = updated_config[BEDROCK]["models"][model_name]
                    if CONNECTION_NAME not in model_entry:
                        model_entry[CONNECTION_NAME] = {"value": connection_name}
                    else:
                        model_entry[CONNECTION_NAME]["value"] = connection_name

                    updated_config[BEDROCK]["is_saved"]["value"] = True
                else:
                    cleaned_config = copy.deepcopy(config)
                    for mname, mcfg in (
                        cleaned_config.get(BEDROCK, {}).get("models", {}).items()
                    ):
                        if isinstance(mcfg, dict):
                            mcfg.pop("is_model_saved", None)
                            mcfg.pop(CONNECTION_NAME, None)
                    cleaned_config.get(BEDROCK, {}).pop("is_saved", None)
                    updated_config = cleaned_config
        elif data_to_update["service"] == OLLAMA:
            config = update_ollama_models(config, data_to_update, gpt_4o_mini_settings)
            if data_to_update["model"]:
                updated_config = self.update_settings(
                    config,
                    data_to_update["service"],
                    data_to_update["model"],
                    data_to_update["modelsettings"],
                    data_to_update["servicesettings"],
                )
                updated_config[OLLAMA]["is_saved"]["value"] = True
                updated_config[OLLAMA]["models"][model_name]["is_model_saved"]["value"] = True
                model_entry = updated_config[OLLAMA]["models"][model_name]
                if CONNECTION_NAME not in model_entry:
                    model_entry[CONNECTION_NAME] = {"value": connection_name}
                else:
                    model_entry[CONNECTION_NAME]["value"] = connection_name

            else:
                cleaned_config = copy.deepcopy(config)
                for mname, mcfg in cleaned_config.get(OLLAMA, {}).get("models", {}).items():
                    if isinstance(mcfg, dict):
                        mcfg.pop("is_model_saved", None)
                        mcfg.pop(CONNECTION_NAME, None)
                cleaned_config.get(OLLAMA, {}).pop("is_saved", None)
                updated_config = cleaned_config
        elif data_to_update["service"] in [OPENAI, AZUREOPENAI, GEMINI, ANTHROPIC, GROQ]:
            dynamic_updater_map = {
                OPENAI: update_openai_models,
                AZUREOPENAI: update_azureopenai_models,
                GEMINI: update_gemini_models,
                ANTHROPIC: update_anthropic_models,
                GROQ: update_groq_models,
            }
            dynamic_updater = dynamic_updater_map[data_to_update["service"]]
            config = dynamic_updater(config, data_to_update, gpt_4o_mini_settings)
            if data_to_update["model"]:
                updated_config = self.update_settings(
                    config,
                    data_to_update["service"],
                    data_to_update["model"],
                    data_to_update["modelsettings"],
                    data_to_update["servicesettings"],
                )
                updated_config[data_to_update["service"]]["is_saved"]["value"] = True
                updated_config[data_to_update["service"]]["models"][model_name][
                    "is_model_saved"
                ]["value"] = True
                model_entry = updated_config[data_to_update["service"]]["models"][model_name]
                if CONNECTION_NAME not in model_entry:
                    model_entry[CONNECTION_NAME] = {"value": connection_name}
                else:
                    model_entry[CONNECTION_NAME]["value"] = connection_name
            else:
                cleaned_config = copy.deepcopy(config)
                for _, mcfg in (
                    cleaned_config.get(data_to_update["service"], {}).get("models", {}).items()
                ):
                    if isinstance(mcfg, dict):
                        mcfg.pop("is_model_saved", None)
                        mcfg.pop(CONNECTION_NAME, None)
                cleaned_config.get(data_to_update["service"], {}).pop("is_saved", None)
                updated_config = cleaned_config
        else:
            updated_config = self.update_settings(
                config,
                data_to_update["service"],
                data_to_update["model"],
                data_to_update["modelsettings"],
                data_to_update["servicesettings"],
            )
            service = data_to_update["service"]
            updated_config[service]["is_saved"]["value"] = True
            updated_config[service]["models"][model_name]["is_model_saved"]["value"] = True
            model_entry = updated_config[service]["models"][model_name]
            if CONNECTION_NAME not in model_entry:
                model_entry[CONNECTION_NAME] = {"value": connection_name}
            else:
                model_entry[CONNECTION_NAME]["value"] = connection_name

        if is_upsert:
            self.write_file(updated_config)
        return updated_config

    def get_edit_data(self, data_to_edit: str) -> dict:
        try:
            if not data_to_edit:
                return {}
            data_to_edit = json.loads(data_to_edit)
            service = data_to_edit.get("service")
            requested_conn_name = data_to_edit.get(CONNECTION_NAME)
            model_name_from_data = data_to_edit.get("model")

            if not service:
                logger.warning("get_edit_data called without a service name")
                return {}

            initial_config = self.read_file(is_token_required=False)
            cleaned_config, _ = self._clean_splunk_models(initial_config)
            config = self._clean_provider_models(cleaned_config)

            if service not in config:
                logger.warning(f"Service '{service}' not found in config.")
                return {}

            provider_cfg = config[service]
            provider_settings = {k: v for k, v in provider_cfg.items() if k != "models"}

            # Reset access tokens for UI (except for Ollama which doesn't require access token)
            if service == BEDROCK:
                # Fetch region from secret storage for Bedrock (region is not sensitive but stored with AWS creds)
                # Try to fetch secrets directly - if they exist we'll get them, otherwise empty response
                secret_response = handle_secrets(
                    searchinfo=self.searchinfo, provider=BEDROCK, type="SELECT"
                )
                clear_password = secret_response.get(CLEAR_PASSWORD, "")
                if clear_password:
                    try:
                        aws_creds = json.loads(clear_password)
                        if REGION in provider_settings and aws_creds.get("aws_region_name"):
                            provider_settings[REGION][VALUE] = aws_creds["aws_region_name"]
                    except json.JSONDecodeError:
                        pass
                # Mask secret fields
                for secret_field in [ACCESS_KEY_ID, BEDROCK_ACCESS_KEY, BEDROCK_ROLE]:
                    if secret_field in provider_settings:
                        provider_settings[secret_field][VALUE] = DEFAULT_ACCESS_TOKEN
            elif service != OLLAMA:
                if ACCESS_TOKEN in provider_settings:
                    provider_settings[ACCESS_TOKEN][VALUE] = DEFAULT_ACCESS_TOKEN

            response = {
                "provider": service,
                "provider_settings": provider_settings,
            }

            if requested_conn_name:
                matched_model = None
                matched_model_cfg = None

                # Check if it's an old model without saved connection_name
                # Handle both "old_configured_model" and auto-generated "llm_<provider>_<model>" format
                # Note: Spaces in provider names are replaced with underscores in connection names
                is_old_model = requested_conn_name == "old_configured_model"
                sanitized_service = service.replace(" ", "_")
                is_auto_generated = requested_conn_name.startswith(f"llm_{sanitized_service}_")

                if (is_old_model or is_auto_generated) and model_name_from_data:
                    matched_model = model_name_from_data
                    matched_model_cfg = provider_cfg.get("models", {}).get(matched_model)
                    if not matched_model_cfg:
                        error_msg = (
                            f"Model '{matched_model}' not found under service '{service}'"
                        )
                        logger.error(error_msg)
                        raise RuntimeError(error_msg)
                else:
                    # Use connection_name to find the model
                    for model_name, model_cfg in provider_cfg.get("models", {}).items():
                        conn_name = model_cfg.get(CONNECTION_NAME, {}).get("value")
                        if conn_name == requested_conn_name:
                            matched_model = model_name
                            matched_model_cfg = model_cfg
                            break
                    if not matched_model:
                        error_msg = f"No model found under service '{service}' with Connection Name '{requested_conn_name}'."
                        logger.error(error_msg)
                        raise RuntimeError(error_msg)

                response["model"] = matched_model
                safe_model_cfg = copy.deepcopy(matched_model_cfg)
                safe_model_cfg.pop("acl", None)
                response["model_settings"] = safe_model_cfg

            return response
        except Exception:
            logger.error("Failed to get edit data: %s", traceback.format_exc())
            return {}

    def get_delete_data(self, data_to_delete: str) -> dict:
        """
        Deletes a specific model for a given provider from the KVStore and also
        ensures it's removed from the default config to prevent reappearance.

        Args:
            data_to_delete (str):
                JSON string containing the service and connection_name to delete. Example:
                {
                    "service": "OpenAI",
                    CONNECTION_NAME: "gpt-4o-mini-OpenAI",
                    "model": "gpt-4o-mini"  # optional if connection_name == "old_configured_model"
                }

        Returns:
            dict: Deleted model data.
        """
        try:
            if not data_to_delete:
                return {}

            data_to_delete = json.loads(data_to_delete)
            service = data_to_delete.get("service")
            requested_conn_name = data_to_delete.get(CONNECTION_NAME)
            model_name_from_data = data_to_delete.get("model")  # for old_configured_model

            if not service or not requested_conn_name:
                logger.warning("get_delete_data called without a service or connection_name")
                return {}

            current_config = self.read_file(is_token_required=False)
            config = copy.deepcopy(current_config)

            if service not in config:
                logger.warning(f"Service '{service}' not found in config.")
                return {}

            models = config[service].get("models", {})
            matched_model = None
            matched_model_cfg = None

            # Check if it's an old model without saved connection_name
            # Handle both "old_configured_model" and auto-generated "llm_<provider>_<model>" format
            # Note: Spaces in provider names are replaced with underscores in connection names
            is_old_model = requested_conn_name == "old_configured_model"
            sanitized_service = service.replace(" ", "_")
            is_auto_generated = requested_conn_name.startswith(f"llm_{sanitized_service}_")

            if (is_old_model or is_auto_generated) and model_name_from_data:
                # Use model name from data
                matched_model = model_name_from_data
                matched_model_cfg = models.pop(matched_model, None)
                if not matched_model_cfg:
                    error_msg = f"Model '{matched_model}' not found under service '{service}'"
                    logger.error(error_msg)
                    raise RuntimeError(error_msg)
            else:
                # Use connection_name to find the model
                for model_name, model_cfg in list(models.items()):
                    conn_name = model_cfg.get(CONNECTION_NAME, {}).get("value")
                    if conn_name == requested_conn_name:
                        matched_model = model_name
                        matched_model_cfg = models.pop(model_name)
                        break
                if not matched_model:
                    error_msg = f"No model found under service '{service}' with Connection Name '{requested_conn_name}' to delete."
                    logger.error(error_msg)
                    raise RuntimeError(error_msg)

            # Remove model from default config as well
            default_config = self.get_default_llm_config()
            if service in default_config and "models" in default_config[service]:
                default_config[service]["models"].pop(matched_model, None)

            final_config = merge_metadata_with_kv(default_config, config)
            self.write_file(final_config)

            # Clean transient fields
            if matched_model_cfg:
                matched_model_cfg.pop("is_model_saved", None)
                matched_model_cfg.pop(CONNECTION_NAME, None)

            return {
                "provider": service,
                "model": matched_model,
                "model_settings": matched_model_cfg,
            }

        except Exception:
            logger.error("Failed to get delete data: %s", traceback.format_exc())
            return {}

    def get_conf(self, is_token_required: bool = True) -> dict:
        """
        Args:
            is_token_required (bool):
                Flag indicating whether a token is required for reading the configuration.

        Returns:
            dict:
                The configuration data.
        """
        config = self.read_file(is_token_required=is_token_required)
        cleaned_config, _ = self._clean_splunk_models(config)
        cleaned_config = self._clean_provider_models(cleaned_config)
        if not is_token_required:
            for provider, provider_cfg in cleaned_config.items():
                if not isinstance(provider_cfg, dict):
                    continue
                if provider != BEDROCK:
                    if ACCESS_TOKEN in provider_cfg:
                        provider_cfg[ACCESS_TOKEN][VALUE] = DEFAULT_ACCESS_TOKEN
                else:
                    # Note: REGION is not a secret, so don't mask it
                    for secret_field in [
                        ACCESS_KEY_ID,
                        BEDROCK_ACCESS_KEY,
                        BEDROCK_ROLE,
                    ]:
                        if secret_field in provider_cfg:
                            provider_cfg[secret_field][VALUE] = DEFAULT_ACCESS_TOKEN

        return cleaned_config

    def get_default_model(self) -> tuple:
        """
        Returns:
            tuple:
                A tuple containing the provider and model name of the default model.

        Raises:
            RuntimeError: If no default model is found.
        """
        config = self.read_file()
        for provider, provider_data in config.items():
            for model_name, model_data in provider_data['models'].items():
                if model_data.get(SET_AS_DEFAULT, {}).get('value') is True:
                    return provider, model_name
        raise RuntimeError("No default model was found.")

    def get_model_by_connection_name(self, connection_name: str) -> tuple:
        """
        Retrieves the provider and model name for a given connection name.

        Args:
            connection_name (str):
                The connection name to search for.

        Returns:
            tuple:
                A tuple containing (provider_name, model_name).

        Raises:
            RuntimeError: If no model is found with the given connection name.
        """
        config = self.read_file()

        # First, try to find by exact connection_name match
        for provider, provider_data in config.items():
            if not isinstance(provider_data, dict) or 'models' not in provider_data:
                continue
            for model_name, model_data in provider_data['models'].items():
                conn_name = model_data.get(CONNECTION_NAME, {}).get('value', '')
                if conn_name == connection_name:
                    return provider, model_name

        # If not found, check if it's an auto-generated name (llm_<provider>_<model>)
        # This handles old models that don't have connection_name saved in KVStore
        # Note: Spaces in provider/model names are replaced with underscores in connection names
        if connection_name.startswith("llm_"):
            # Remove the "llm_" prefix
            name_without_prefix = connection_name[4:]

            # Try to match against known providers (handling spaces replaced with underscores)
            for provider in config.keys():
                if not isinstance(config[provider], dict) or 'models' not in config[provider]:
                    continue

                # Create sanitized provider name (spaces -> underscores)
                sanitized_provider = provider.replace(" ", "_")

                # Check if connection name starts with this provider
                if name_without_prefix.startswith(f"{sanitized_provider}_"):
                    # Extract the model part
                    model_part = name_without_prefix[len(sanitized_provider) + 1 :]

                    # Try to find the model (handling spaces replaced with underscores)
                    for model_name in config[provider]['models'].keys():
                        sanitized_model = model_name.replace(" ", "_")
                        if sanitized_model == model_part:
                            return provider, model_name

        raise RuntimeError(f"No model found with connection name: {connection_name}")

    def is_fastapi_installed(self) -> bool:
        """
        Checks if FastAPI is installed in the current Python environment.

        Returns:
            bool:
                True if FastAPI is installed, False otherwise.
        """
        try:
            import fastapi  # noqa: F401

            return True
        except ImportError:
            return False

    def is_litellm_supported(self) -> bool:
        """
        Checks whether LiteLLM is installed and its version is >= 1.68.0.

        Returns:
            bool:
                True  LiteLLM is present and satisfies the minimum version.
                False LiteLLM is missing or its version is below 1.68.0.
        """
        try:
            # Import to confirm the package exists
            import litellm  # noqa: F401

            # Retrieve the installed version in a robust, PEP 440-aware way
            try:
                from importlib.metadata import version, PackageNotFoundError  # Py ≥3.8
            except ImportError:  # pragma: no cover – back-compat for Py <3.8
                from importlib_metadata import version, PackageNotFoundError  # type: ignore

            from packaging.version import Version  # Handles semantic version parsing

            installed_ver = Version(version("litellm"))
            return installed_ver >= Version("1.80.0")

        except (ImportError, PackageNotFoundError):
            # Either LiteLLM is not installed or its metadata is unavailable
            return False
