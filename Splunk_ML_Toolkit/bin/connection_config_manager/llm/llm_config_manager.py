import json
import time
import cexc

from util.ai_commander_util import (
    get_raw_document_from_kv_store,
    get_raw_documents_from_kv_store,
    upsert_single_document_into_kv_store,
    delete_document_from_kv_store,
    delete_documents_from_kv_store_by_query,
    encode_model_key,
    get_cached_scs_token,
    get_scs_url,
)
from ai_commander.ai_commander_util import AICommanderUtil
from connection_config_manager.utils.common_utils import CommonUtils
from connection_config_manager.llm.secrets_manager import SecretsManager
from ai_commander.constants import (
    AITK_LLM_CONNECTION_COLLECTION,
    COLLECTION_NAME,
    SPLUNK_HOSTED_LLM,
    SPLUNK_HOSTED_LLM_TIMEOUT,
    AITK_DEFAULT_LLM_CONNECTION_MAPPING_COLLECTION,
    AITK_LLM_SECRETS_REALM,
    DEFAULT_ACCESS_TOKEN,
)

logger = cexc.get_logger(__name__)


class LLMConfigManager:
    def __init__(self, search_info: dict):
        self.search_info = search_info
        self.common_utils = CommonUtils(search_info)
        self.secrets_manager = SecretsManager(search_info)

    def get_default_llm_config_name(self) -> str:
        """Get the default LLM configuration."""
        logger.debug("get_default_llm_config_name called")
        try:
            search_string = json.dumps({"user": self.search_info.get("username", "system")})
            default_configs = get_raw_document_from_kv_store(
                search_info=self.search_info,
                collection_name=AITK_DEFAULT_LLM_CONNECTION_MAPPING_COLLECTION,
                query=search_string,
            )
            if default_configs:
                default_config = default_configs[0]
                return default_config["name"]
            return None
        except Exception as e:
            logger.error(f"Error fetching default LLM configuration: {e}")
            return None

    def get_default_llm_config(self) -> dict:
        """Get the default LLM configuration."""
        logger.debug("get_default_llm_config called")
        try:
            default_config_name = self.get_default_llm_config_name()
            configs = []
            if default_config_name:
                if default_config_name == 'N/A':
                    return {}
                configs = self._get_new_llm_config(connection_name=default_config_name)
            else:
                old_configs = self._get_old_llm_config()
                for config in old_configs:
                    if config.get("default_users", []) == ['*']:
                        configs.append(config)
                        break
            if configs and self.common_utils.is_user_eligible_by_role(
                configs[0].get("acl", {}), "read"
            ):
                return configs[0]
            return {}
        except Exception as e:
            logger.error(f"Error fetching default LLM configuration: {e}")
            return {}

    def save_llm_config(self, config: dict) -> bool:
        """Save LLM configuration to KV store."""
        logger.debug("save_llm_config called for connection_name=%s", config.get("name"))
        try:
            config_name = config.get("name")
            if not config_name:
                raise ValueError("Config name is required to save the LLM configuration.")
            existing_configs = self._get_old_llm_config(connection_name=config_name)
            if existing_configs:
                raise RuntimeError(
                    f"LLM configuration with the name '{config_name}' already exists."
                )
            existing_configs = self._get_new_llm_config(connection_name=config_name)
            if existing_configs:
                raise RuntimeError(
                    f"LLM configuration with the name '{config_name}' already exists."
                )
            is_default = config.get("is_default", False)
            config.pop("is_default", None)
            # Save the new configuration to KV store
            result = upsert_single_document_into_kv_store(
                self.search_info,
                AITK_LLM_CONNECTION_COLLECTION,
                config,
                with_admin_token=True,
            )
            if result and is_default:
                logger.debug(f"Setting the LLM configuration '{config_name}' as default.")
                result = self._update_default_connection_mapping(config_name, True)
            return result
        except Exception as e:
            logger.error(f"Error saving LLM configuration: {e}")
            raise

    def delete_llm_config(self, connection_name: str) -> bool:
        """Delete LLM configuration from KV store."""
        logger.debug("delete_llm_config called for connection_name=%s", connection_name)
        try:
            if not connection_name:
                raise ValueError("Connection name is required to delete the LLM configuration.")
            existing_old_configs = self._get_old_llm_config(connection_name=connection_name)
            existing_old_config = existing_old_configs[0] if existing_old_configs else None
            # If the existing config is in the old format, delete it.
            # All the users with required capabilities can delete the old config.
            if existing_old_config:
                current_old_stored_configs = get_raw_document_from_kv_store(
                    search_info=self.search_info, collection_name=COLLECTION_NAME
                )
                current_old_stored_config = current_old_stored_configs[0]
                collection_key = current_old_stored_config.get("_key")
                current_old_stored_config.get(existing_old_config.get("provider"), {}).get(
                    "models", {}
                ).pop(encode_model_key(existing_old_config.get("model")), None)
                secrets_id = existing_old_config.get("connection_details", {}).get(
                    "secrets_id", ""
                )
                if secrets_id:
                    realm, secret_name = self.secrets_manager.parse_secrets_id(secrets_id)
                    result = self.secrets_manager.delete_secret(
                        realm=realm,
                        secret_name=secret_name,
                    )
                    if not result:
                        raise RuntimeError(
                            f"Failed to delete the secret for the LLM configuration '{connection_name}'."
                        )

                result = upsert_single_document_into_kv_store(
                    self.search_info,
                    COLLECTION_NAME,
                    current_old_stored_config,
                    document_key=collection_key,
                    with_admin_token=True,
                )
                if result:
                    result = self._delete_default_connection_mapping(connection_name)
                if not result:
                    raise RuntimeError(
                        f"Failed to delete the LLM configuration '{connection_name}'."
                    )
                return True

            # For new config format, only users with write capability can delete the config.
            else:
                search_string = json.dumps({"name": connection_name})
                existing_new_configs = get_raw_document_from_kv_store(
                    search_info=self.search_info,
                    collection_name=AITK_LLM_CONNECTION_COLLECTION,
                    query=search_string,
                )
                existing_new_config = existing_new_configs[0] if existing_new_configs else None
                if not existing_new_config:
                    raise RuntimeError(
                        f"No LLM configuration found with the name '{connection_name}' to delete."
                    )
                if not self.common_utils.is_user_eligible_by_role(
                    existing_new_config.get("acl", {}), "write"
                ):
                    raise RuntimeError(
                        f"User does not have permission to delete the LLM configuration '{connection_name}'."
                    )
                secrets_id = existing_new_config.get("connection_details", {}).get(
                    "secrets_id", ""
                )
                if secrets_id:
                    realm, secret_name = self.secrets_manager.parse_secrets_id(secrets_id)
                    result = self.secrets_manager.delete_secret(
                        realm=realm,
                        secret_name=secret_name,
                    )
                    if not result:
                        raise RuntimeError(
                            f"Failed to delete the secret for the LLM configuration '{connection_name}'."
                        )
                result = delete_document_from_kv_store(
                    search_info=self.search_info,
                    collection_name=AITK_LLM_CONNECTION_COLLECTION,
                    document_key=existing_new_config.get("_key"),
                    with_admin_token=True,
                )
                if result:
                    result = self._delete_default_connection_mapping(connection_name)
                if not result:
                    raise RuntimeError(
                        f"Failed to delete the LLM configuration '{connection_name}'."
                    )
                return True

        except Exception as e:
            # Log the exception and return False to indicate failure
            logger.error(f"Error deleting LLM configuration: {e}")
            return False

    def update_llm_config(self, config: dict) -> bool:
        """Update LLM configuration in KV store."""
        logger.debug("update_llm_config called for connection_name=%s", config.get("name"))
        try:
            connection_name = config.get("name")
            if not connection_name:
                raise ValueError("Config name is required to update the LLM configuration.")
            is_default = config.get("is_default", False)
            existing_old_configs = self._get_old_llm_config(connection_name=connection_name)
            existing_old_config = existing_old_configs[0] if existing_old_configs else None
            # If the existing config is in the old format, delete it from the old config and save the updated config in the new format. Otherwise, just update the existing config in the new format.
            if existing_old_config:
                logger.info(
                    f"LLM configuration with the name '{connection_name}' exists in the old format. It will be deleted from the old config and the updated config will be saved in the new format."
                )
                config = self._get_updated_config(existing_old_config, config)
                current_old_stored_configs = get_raw_document_from_kv_store(
                    search_info=self.search_info, collection_name=COLLECTION_NAME
                )
                current_old_stored_config = current_old_stored_configs[0]
                collection_key = current_old_stored_config.get("_key")
                current_old_stored_config.get(config.get("provider"), {}).get("models", {}).pop(
                    encode_model_key(existing_old_config.get("model")), None
                )
                result1 = upsert_single_document_into_kv_store(
                    self.search_info,
                    COLLECTION_NAME,
                    current_old_stored_config,
                    document_key=collection_key,
                    with_admin_token=True,
                )
                if not result1:
                    raise RuntimeError(
                        f"Failed to update the old LLM configuration '{connection_name}'."
                    )
                result2 = upsert_single_document_into_kv_store(
                    self.search_info,
                    AITK_LLM_CONNECTION_COLLECTION,
                    config,
                    with_admin_token=True,
                )
                if result2:
                    self._update_default_connection_mapping(connection_name, is_default)
                    logger.debug(
                        f"Default connection mapping update result for connection '{connection_name}' is: {result2}"
                    )
                else:
                    logger.error(
                        "Failed to upsert new LLM configuration for connection_name=%s",
                        connection_name,
                    )
                return result2
            else:
                search_string = json.dumps({"name": connection_name})
                existing_new_configs = get_raw_document_from_kv_store(
                    search_info=self.search_info,
                    collection_name=AITK_LLM_CONNECTION_COLLECTION,
                    query=search_string,
                )
                existing_new_config = existing_new_configs[0] if existing_new_configs else None
                if not existing_new_config:
                    raise RuntimeError(
                        f"No LLM configuration found with the name '{connection_name}' to update."
                    )
                if not self.common_utils.is_user_eligible_by_role(
                    existing_new_config.get("acl", {}), "write"
                ):
                    raise RuntimeError(
                        f"User does not have permission to update the LLM configuration '{connection_name}'."
                    )
                config = self._get_updated_config(existing_new_config, config)
                result = upsert_single_document_into_kv_store(
                    self.search_info,
                    AITK_LLM_CONNECTION_COLLECTION,
                    config,
                    document_key=existing_new_config.get("_key"),
                    with_admin_token=True,
                )

                if result:
                    result = self._update_default_connection_mapping(
                        connection_name, is_default
                    )
                    logger.debug(
                        f"Default connection mapping update result for connection '{connection_name}' is: {result}"
                    )
                else:
                    logger.error(
                        "Failed to upsert LLM configuration for connection_name=%s",
                        connection_name,
                    )
                return result

        except Exception as e:
            # Log the exception and return False to indicate failure
            logger.error(f"Error updating LLM configuration: {e}")
            return False

    def get_llm_config(
        self,
        connection_name: str = None,
        provider: str = None,
        model: str = None,
        is_auth_bypass: bool = False,
    ) -> list:
        """Get LLM configuration based on connection name or provider/model."""
        logger.debug(
            "get_llm_config called for connection_name=%s, provider=%s, model=%s",
            connection_name,
            provider,
            model,
        )
        llm_configs = []
        configs = []
        if connection_name or (provider and model):
            if connection_name:
                configs = self._get_old_llm_config(connection_name=connection_name)
                if not configs:
                    configs = self._get_new_llm_config(connection_name=connection_name)
            else:
                old_configs = self._get_old_llm_config(provider=provider, model=model)
                new_configs = self._get_new_llm_config(provider=provider, model=model)
                configs = old_configs + new_configs
        else:
            old_configs = self._get_old_llm_config()
            new_configs = self._get_new_llm_config()
            configs = old_configs + new_configs

        default_config_name = self.get_default_llm_config_name()
        for config in configs:
            if is_auth_bypass:
                llm_configs.append(config)
            elif self.common_utils.is_user_eligible_by_role(config.get("acl", {}), "read"):
                config["is_default"] = False
                if default_config_name:
                    if config.get("name") == default_config_name:
                        config["is_default"] = True
                else:
                    if config.get("default_users", []) == ['*']:
                        config["is_default"] = True
                llm_configs.append(config)
        return llm_configs

    def _get_new_llm_config(
        self, connection_name: str = None, provider: str = None, model: str = None
    ) -> list:
        """Fetch LLM configuration based on connection name or provider/model."""
        if connection_name or (provider and model):
            if connection_name:
                query = json.dumps({"name": connection_name})
            else:
                query = json.dumps({"provider": provider, "model": model})
            documents = get_raw_document_from_kv_store(
                search_info=self.search_info,
                collection_name=AITK_LLM_CONNECTION_COLLECTION,
                query=query,
            )
            return documents
        else:
            documents = get_raw_documents_from_kv_store(
                search_info=self.search_info,
                collection_name=AITK_LLM_CONNECTION_COLLECTION,
            )
            return documents

    def _get_old_llm_config(
        self,
        connection_name: str = None,
        provider: str = None,
        model: str = None,
    ) -> list:
        """Fetch LLM configuration based on connection name if provided, otherwise return all the configurations."""
        ai_commander_util = AICommanderUtil(self.search_info)
        raw_config = ai_commander_util.read_file()
        old_configs = []
        for key in raw_config.keys():
            if key in ['metadata', 'connection_type']:
                continue
            created_at = raw_config[key].get("metadata", {}).get("created_at")
            modified_at = raw_config[key].get("metadata", {}).get("modified_at")
            for cur_model in raw_config[key].get("models", {}).keys():
                if (
                    raw_config[key]
                    .get("models", {})
                    .get(cur_model, {})
                    .get("is_model_saved", {})
                    .get("value", False)
                ):
                    old_configs.append(
                        self._transform_to_new_config_format(
                            raw_config[key], cur_model, key, created_at, modified_at
                        )
                    )
        if connection_name:
            for config in old_configs:
                if config.get("name") == connection_name:
                    return [config]
            return []  # Return empty to allow fallback to new configs
        if provider and model:
            for config in old_configs:
                if config.get("provider") == provider and config.get("model") == model:
                    return [config]
            return []  # Return empty to allow fallback to new configs
        return old_configs

    def _transform_to_new_config_format(
        self, old_config: dict, model: str, provider: str, created_at: str, modified_at: str
    ) -> dict:
        """Transform old LLM config format to new format."""
        model_config = old_config.get("models", {}).get(model, {})
        connection_name = model_config.get("connection_name", {}).get("value", "")
        name = connection_name if connection_name else f"llm_{provider}_{model}"

        connection_details = {}

        if (provider or "").lower() == "azureopenai":
            connection_details = {
                "endpoint": old_config.get("endpoint", {}).get("value", ""),
                "secrets_id": f"mltk_llm_tokens:{provider}",
                "request_timeout": old_config.get("request_timeout", {}).get("value", 600),
                "azure_api_version": old_config.get("azure_api_version", {}).get("value", ""),
            }
        elif (provider or "").lower() == "bedrock":
            connection_details = {
                "secrets_id": f"mltk_llm_tokens:{provider}",
                "request_timeout": old_config.get("request_timeout", {}).get("value", 600),
            }
        elif (provider or "").lower() == SPLUNK_HOSTED_LLM.lower():
            connection_details = {
                "model_id": model_config.get("id", {}).get("value", ""),
                "request_timeout": old_config.get("request_timeout", {}).get(
                    "value", SPLUNK_HOSTED_LLM_TIMEOUT
                ),
            }
        elif (provider or "").lower() == "ollama":
            connection_details = {
                "endpoint": old_config.get("endpoint", {}).get("value", ""),
                "request_timeout": old_config.get("request_timeout", {}).get("value", 600),
            }
        else:
            connection_details = {
                "endpoint": old_config.get("endpoint", {}).get("value", ""),
                "secrets_id": f"mltk_llm_tokens:{provider}",
                "request_timeout": old_config.get("request_timeout", {}).get("value", 600),
            }

        return {
            "name": name,
            "provider": provider,
            "model": model,
            "description": "",
            "is_custom": False,
            "connection_details": connection_details,
            "default_users": (
                ['*'] if model_config.get("set_as_default", {}).get("value") else []
            ),
            "llm_params": {
                "response_variability": model_config.get("response_variability", {}).get(
                    "value", 0.1
                ),
                "max_tokens": model_config.get("max_tokens", {}).get("value", 2000),
                "maximum_result_rows": model_config.get("maximum_result_rows", {}).get(
                    "value", 10
                ),
                "reasoning_effort": "NONE",
            },
            "acl": {
                "sharing": "app",
                "app": "SPLUNK_ML_TOOLKIT",
                "owner": "admin",
                "perms": {"read": ['*'], "write": ['*']},
            },
            "created_at": created_at,
            "updated_by": "",
            "updated_at": modified_at,
            "created_by": "",
        }

    def _get_updated_config(self, old_config: dict, new_config: dict) -> dict:
        """Get the updated config by comparing the old and new config."""
        updated_config = old_config.copy()
        updated_config["default_users"] = new_config.get(
            "default_users", old_config.get("default_users")
        )
        updated_config["llm_params"] = new_config.get(
            "llm_params", old_config.get("llm_params")
        )
        updated_config["description"] = new_config.get(
            "description", old_config.get("description", "")
        )
        updated_config["acl"] = new_config.get("acl", old_config.get("acl"))
        if old_config.get("connection_details", {}).get("endpoint", ""):
            updated_config["connection_details"]["endpoint"] = new_config.get(
                "connection_details", {}
            ).get("endpoint", "")
        updated_config["connection_details"]["request_timeout"] = new_config.get(
            "connection_details", {}
        ).get(
            "request_timeout",
            old_config.get("connection_details", {}).get("request_timeout", 200),
        )
        is_custom = new_config.get("is_custom", old_config.get("is_custom", False))
        if is_custom:
            auth_type = old_config.get("connection_details", {}).get("auth_type", "")
            if auth_type == 'OIDC':
                updated_config["connection_details"]["auth_connection_details"]["client_id"] = (
                    new_config.get("connection_details", {})
                    .get("auth_connection_details", {})
                    .get("client_id", "")
                )
                updated_config["connection_details"]["auth_connection_details"]["token_url"] = (
                    new_config.get("connection_details", {})
                    .get("auth_connection_details", {})
                    .get("token_url", "")
                )

        updated_config["updated_by"] = self.search_info.get("username", "system")
        updated_config["updated_at"] = time.time()
        return updated_config

    def _update_default_connection_mapping(
        self, connection_name: str, is_default: bool
    ) -> bool:
        """Update the default connection mapping with the given connection name."""
        try:
            search_string = json.dumps({"user": self.search_info.get("username", "system")})
            existing_mappings = get_raw_document_from_kv_store(
                search_info=self.search_info,
                collection_name=AITK_DEFAULT_LLM_CONNECTION_MAPPING_COLLECTION,
                query=search_string,
            )
            if existing_mappings:
                existing_mapping = existing_mappings[0]
                existing_mapping["name"] = connection_name if is_default else 'N/A'
                result = upsert_single_document_into_kv_store(
                    self.search_info,
                    AITK_DEFAULT_LLM_CONNECTION_MAPPING_COLLECTION,
                    existing_mapping,
                    document_key=existing_mapping.get("_key"),
                    with_admin_token=True,
                )
                return result
            else:
                new_mapping = {
                    "name": connection_name if is_default else 'N/A',
                    "user": self.search_info.get("username", "system"),
                }
                return upsert_single_document_into_kv_store(
                    self.search_info,
                    AITK_DEFAULT_LLM_CONNECTION_MAPPING_COLLECTION,
                    new_mapping,
                    with_admin_token=True,
                )
        except Exception as e:
            logger.error(f"Error updating default connection mapping: {e}")
            return False

    def _delete_default_connection_mapping(self, connection_name: str) -> bool:
        """Delete all default connection mappings for the given connection name."""
        try:
            query = json.dumps({"name": connection_name})
            return delete_documents_from_kv_store_by_query(
                search_info=self.search_info,
                collection_name=AITK_DEFAULT_LLM_CONNECTION_MAPPING_COLLECTION,
                query=query,
                with_admin_token=True,
            )
        except Exception as e:
            logger.error(f"Error deleting default connection mapping: {e}")
            return False

    def create_llm_config(self, config: dict) -> bool:
        """
        Core create logic: saves secrets and persists into KV store.

        Connection testing should be done separately via the
        test_connection API before calling this method.

        Args:
            config (dict): The pre-validated LLM configuration payload.

        Returns:
            bool: True if the configuration was created successfully.

        Raises:
            ValueError: If a duplicate name exists (from save_llm_config).
            RuntimeError: If persistence fails.
        """
        logger.debug("create_llm_config called for connection_name=%s", config.get("name"))
        is_custom = config.get("is_custom", False)
        connection_details = config["connection_details"]
        try:
            secrets_id = f"{AITK_LLM_SECRETS_REALM}:{config.get('name', '')}"
            record = self._build_create_record(
                config, secrets_id, connection_details, is_custom
            )
            result = self.save_llm_config(record)
            provider = config.get("provider", "")
            if result:
                if (
                    provider.lower() == "ollama"
                    and connection_details.get("access_token", "") == ""
                ):
                    connection_details["access_token"] = DEFAULT_ACCESS_TOKEN
                secrets_id = (
                    self.secrets_manager.save_secrets(config)
                    if provider.lower() != SPLUNK_HOSTED_LLM.lower()
                    else 'N/A'
                )
                if secrets_id:
                    return True
                else:
                    logger.error(
                        "Failed to save secrets for connection_name=%s", config.get("name")
                    )
                    raise RuntimeError(
                        f"Failed to save secrets for connection '{config.get('name', '')}'."
                    )
            else:
                logger.error(
                    "Failed to save LLM configuration for connection_name=%s",
                    config.get("name"),
                )
                raise RuntimeError(
                    f"Failed to save LLM configuration for connection '{config.get('name', '')}'."
                )
        except Exception:
            raise

    def _build_create_record(
        self,
        config: dict,
        secrets_id: str,
        connection_details: dict,
        is_custom: bool,
    ) -> dict:
        """Builds the KV store document for a new LLM connection."""
        username = self.search_info.get("username", "system")
        now = time.time()

        persisted_details = {
            "secrets_id": secrets_id,
            "request_timeout": connection_details.get("request_timeout", 200),
        }

        if is_custom:
            persisted_details["endpoint"] = connection_details.get("endpoint", "")
            persisted_details["auth_type"] = connection_details.get("auth_type", "")
            auth_conn = connection_details.get("auth_connection_details", {})
            if auth_conn:
                persisted_details["auth_connection_details"] = {
                    k: v for k, v in auth_conn.items() if k not in ("client_secret",)
                }
        elif config.get("provider", "").lower() == SPLUNK_HOSTED_LLM.lower():
            persisted_details["model_id"] = connection_details.get("model_id", "")
            persisted_details.pop("secrets_id", None)
        else:
            persisted_details["endpoint"] = connection_details.get("endpoint", "")
            azure_ver = connection_details.get("azure_api_version", "")
            if azure_ver:
                persisted_details["azure_api_version"] = azure_ver

        return {
            "name": config["name"],
            "description": config.get("description", ""),
            "provider": config["provider"],
            "model": config["model"],
            "is_custom": is_custom,
            "connection_details": persisted_details,
            "default_users": config.get("default_users", []),
            "llm_params": config.get("llm_params", {}),
            "acl": {
                "sharing": "private",
                "app": "SPLUNK_ML_TOOLKIT",
                "owner": username,
                "perms": {"read": [], "write": []},
            },
            "is_default": config.get("is_default", False),
            "created_at": now,
            "created_by": username,
            "updated_at": now,
            "updated_by": username,
        }
