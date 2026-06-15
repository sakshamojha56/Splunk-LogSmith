from util.ai_commander_util import handle_secrets
from util.error_util import CustomMLTKError
import json
import cexc
import traceback
from ai_commander.constants import (
    DEFAULT_ACCESS_TOKEN,
    CLEAR_PASSWORD,
    TOKEN_BASED_PROVIDERS,
    AITK_LLM_SECRETS_REALM,
)


logger = cexc.get_logger(__name__)


class SecretsManager:
    def __init__(self, search_info: dict) -> None:
        self.search_info = search_info

    def parse_secrets_id(self, secrets_id: str) -> tuple:
        """
        Parses the secrets_id string into realm and name components.

        Args:
            secrets_id (str): The secrets_id string in format "realm:name".

        Returns:
            tuple: A tuple of (realm, name).

        Raises:
            ValueError: If secrets_id is missing or malformed.
        """
        if not secrets_id or ":" not in secrets_id:
            raise ValueError(
                f"Invalid secrets_id: '{secrets_id}'. Expected format 'realm:name'."
            )
        parts = secrets_id.split(":", 1)
        return parts[0], parts[1]

    def save_secrets(self, config: dict) -> str:
        """
        Creates a new secret in Splunk's storage/passwords for an LLM connection.

        Args:
            config (dict): The LLM configuration containing provider, name,
                and connection_details with secret fields.

        Returns:
            str: The secrets_id in format "realm:name".

        Raises:
            RuntimeError: If the secret creation fails.
        """
        try:
            connection_name = config.get("name", "")
            provider = (config.get("provider") or "").lower()
            connection_details = config.get("connection_details", {})
            is_custom = config.get("is_custom", False)
            realm = AITK_LLM_SECRETS_REALM

            if is_custom:
                auth_type = connection_details.get("auth_type", "").upper()
                if auth_type == "OIDC":
                    auth_details = connection_details.get("auth_connection_details", {})
                    secret_payload = auth_details.get("client_secret", "")
                else:
                    secret_payload = connection_details.get("access_token", "")

            elif provider == "bedrock":
                bedrock_secrets = {
                    "aws_region_name": connection_details.get("region", ""),
                    "aws_access_key_id": connection_details.get("aws_access_key_id", ""),
                    "aws_secret_access_key": connection_details.get("aws_access_token", ""),
                    "aws_role_name": connection_details.get("role_arn", ""),
                }
                secret_payload = json.dumps(bedrock_secrets)

            elif provider in TOKEN_BASED_PROVIDERS:
                secret_payload = connection_details.get("access_token", "")

            else:
                secret_payload = connection_details.get("access_token", "")
            resp = handle_secrets(
                self.search_info,
                provider=connection_name,
                token=secret_payload,
                type="CREATE",
                realm=realm,
                with_admin_token=True,
            )
            if not resp or ("status" in resp and resp.get("status") not in [200, 201]):
                raise RuntimeError(
                    f"Failed to create secret for connection '{connection_name}'. "
                    f"Response: {resp}"
                )

            return f"{realm}:{connection_name}"

        except RuntimeError:
            raise
        except Exception as e:
            logger.error(f"Error saving secrets: {str(traceback.format_exc())}")
            raise RuntimeError(
                f"Failed to save secrets for connection '{config.get('name', '')}': {str(e)}"
            )

    def update_secrets(self, old_config: dict, new_config: dict) -> bool:
        """
        Updates the secrets in the secrets manager.

        Args:
            old_config (dict): The old LLM configuration.
            new_config (dict): The new LLM configuration.

        Returns:
            bool: True if the secrets were successfully updated, False otherwise.
        """
        try:
            is_custom = old_config.get("is_custom", False)
            provider = old_config.get("provider")
            secrets_id = old_config.get("connection_details", {}).get("secrets_id", "")
            realm, name = self.parse_secrets_id(secrets_id)

            if is_custom:
                auth_type = (
                    old_config.get("connection_details", {}).get("auth_type", "").upper()
                )
                secret = ""
                if auth_type == "OIDC":
                    secret = (
                        new_config.get("connection_details", {})
                        .get("auth_connection_details", {})
                        .get("client_secret", "")
                    )
                elif auth_type == "API_KEY":
                    secret = new_config.get("connection_details", {}).get("access_token", "")
                resp = handle_secrets(
                    self.search_info,
                    name,
                    secret,
                    type="UPDATE",
                    realm=realm,
                    with_admin_token=True,
                )
                if not resp or ("status" in resp and resp.get("status") not in [200, 201]):
                    raise CustomMLTKError(
                        "Failed to upsert custom LLM secret. response: {}".format(resp)
                    )
                return True

            elif (provider or "").lower() in TOKEN_BASED_PROVIDERS:
                new_token = new_config.get("connection_details", {}).get("access_token")
                resp = handle_secrets(
                    self.search_info,
                    name,
                    new_token,
                    type="UPDATE",
                    realm=realm,
                    with_admin_token=True,
                )
                if not resp or ("status" in resp and resp.get("status") not in [200, 201]):
                    raise CustomMLTKError(
                        "Failed to upsert LLM secret. response: {}".format(resp)
                    )
                return True
            elif (provider or "").lower() == "bedrock":
                old_secrets = handle_secrets(
                    self.search_info,
                    name,
                    type="SELECT",
                    realm=realm,
                    with_admin_token=True,
                )
                if not old_secrets or (
                    "status" in old_secrets and old_secrets.get("status") not in [200, 201]
                ):
                    raise CustomMLTKError(
                        "Failed to fetch existing Bedrock secrets. response: {}".format(
                            old_secrets
                        )
                    )
                cur_secrets = json.loads(old_secrets.get(CLEAR_PASSWORD, "{}"))
                new_connection_details = new_config.get("connection_details", {})
                if new_connection_details.get("region") != DEFAULT_ACCESS_TOKEN:
                    cur_secrets["aws_region_name"] = new_connection_details.get("region")
                if new_connection_details.get("aws_access_key_id") != DEFAULT_ACCESS_TOKEN:
                    cur_secrets["aws_access_key_id"] = new_connection_details.get(
                        "aws_access_key_id"
                    )
                if new_connection_details.get("aws_access_token") != DEFAULT_ACCESS_TOKEN:
                    cur_secrets["aws_secret_access_key"] = new_connection_details.get(
                        "aws_access_token"
                    )
                if new_connection_details.get("role_arn") != DEFAULT_ACCESS_TOKEN:
                    cur_secrets["aws_role_name"] = new_connection_details.get("role_arn")
                resp = handle_secrets(
                    self.search_info,
                    name,
                    json.dumps(cur_secrets),
                    type="UPDATE",
                    realm=realm,
                    with_admin_token=True,
                )
                if not resp or ("status" in resp and resp.get("status") not in [200, 201]):
                    raise CustomMLTKError(
                        "Failed to upsert AWS KB secret. response: {}".format(resp)
                    )
                return True
            else:
                logger.error(f"Provider '{provider}' is not supported for secrets update.")
                return False
        except Exception as e:
            logger.error(f"Error updating secrets: {str(traceback.format_exc())}")
            return False

    def delete_secret(self, realm: str, secret_name: str) -> bool:
        """Delete the secret with the given name from the specified realm."""
        resp = handle_secrets(
            self.search_info,
            provider=secret_name,
            type="DELETE",
            realm=realm,
            with_admin_token=True,
        )
        if not resp or ("status" in resp and resp.get("status") not in [200, 201]):
            if resp and resp.get('status') == 404:
                # If deleting and secret not found, ignore
                pass
            else:
                raise CustomMLTKError("Failed to delete secret. response: {}".format(resp))
        return True

    def get_secret(self, secrets_id: str, with_admin_token=False) -> str:
        """Fetch the secret with the given secrets_id."""
        realm, name = self.parse_secrets_id(secrets_id)
        resp = handle_secrets(
            self.search_info,
            provider=name,
            type="SELECT",
            realm=realm,
            with_admin_token=with_admin_token,
        )
        if not resp or ("status" in resp and resp.get("status") not in [200, 201]):
            raise CustomMLTKError("Failed to fetch secret. response: {}".format(resp))
        return resp.get(CLEAR_PASSWORD, "")
