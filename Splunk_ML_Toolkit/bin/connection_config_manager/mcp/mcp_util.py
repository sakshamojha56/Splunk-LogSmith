"""
MCP Utility Module
Core business logic for MCP connection management using shared utilities
"""

import json
import re
import traceback
import time
import sys
import requests
from datetime import datetime, timezone
import cexc

# Import shared utility functions from ai_commander_util
from util.ai_commander_util import (
    get_raw_documents_from_kv_store,
    get_raw_document_from_kv_store,
    handle_secrets,
    upsert_single_document_into_kv_store,
    delete_document_from_kv_store,
)

# Import SSE connection handler for ATLASSIAN MCP
from connection_config_manager.mcp.sse_connection_mcp import (
    test_atlassian_connection,
    list_atlassian_tools,
    refresh_token,
)

from connection_config_manager.utils.common_utils import CommonUtils

# Import DEFAULT_TOKEN for masking secrets
from ai_commander.constants import DEFAULT_TOKEN

from connection_config_manager.mcp.constants import (
    MCP_COLLECTION_NAME,
    MCP_CONFIG_VERSION,
    MCP_TYPES,
    NAME,
    DESCRIPTION,
    TYPE,
    TOKEN,
    URL,
    DETAILS,
    CONNECTION_DETAILS,
    CREATED_AT,
    LAST_UPDATED_AT,
    LAST_UPDATED_BY,
    DEFAULT_MCP_DOCUMENT,
    MCP_PASSWORD_REALM_PREFIX,
    ERROR_DUPLICATE_NAME,
    ERROR_NOT_FOUND,
    ERROR_INVALID_TYPE,
    ERROR_MISSING_FIELD,
    ERROR_INVALID_URL,
    ERROR_EMPTY_NAME,
    SUCCESS_CREATED,
    SUCCESS_UPDATED,
    SUCCESS_DELETED,
    AUTO_REFRESH_ENABLED,
    CLIENT_ID,
    CLIENT_SECRET,
    REFRESH_TOKEN,
    SECRETS,
    LAST_REFRESH_AT,
)

logger = cexc.get_logger(__name__)


class MCPConnectionManager:
    """
    Manager class for MCP connections in KVStore
    Uses shared utility functions from ai_commander_util for consistency
    """

    def __init__(self, search_info: dict, common_utils: CommonUtils = None) -> None:
        """
        Initialize the MCP Connection Manager

        Args:
            search_info (dict): Splunk search context containing:
                - session_key: User's Splunk session key
                - splunkd_uri: Splunk management URI
                - username: Current user
                - app: Application name (defaults to Splunk_ML_Toolkit)
        """
        self.search_info = search_info
        self.collection_name = MCP_COLLECTION_NAME
        self.username = search_info.get('username', 'admin')
        if not common_utils:
            self.common_utils = CommonUtils(search_info)
        else:
            self.common_utils = common_utils

        # Ensure app is set to MLTK
        if 'app' not in self.search_info:
            self.search_info['app'] = 'Splunk_ML_Toolkit'

    def _get_mcp_server_type(self, url: str) -> str:
        """
        Detect MCP server type based on URL.
        Returns 'on_deployment' if '/services/mcp' in URL,
        'on_cloud' if 'scs' in URL,
        else 'unknown'.
        """
        if "/services/mcp" in url:
            return "on_deployment"
        if "scs" in url:
            return "on_cloud"
        return "unknown"

    def _parse_on_deployment_response(self, response):
        """
        Parse response from On-Deployment MCP server (plain JSON).
        Returns parsed JSON dict or empty dict on error.
        """
        try:
            return response.json()
        except Exception:
            return {}

    def _parse_on_cloud_response(self, response):
        """
        Parse response from On-Cloud MCP server (SSE-style, JSON in 'data:' line).
        Returns parsed JSON dict or empty dict on error.
        """
        try:
            text = response.text
            if text.startswith("event: message"):
                for line in text.splitlines():
                    if line.startswith("data:"):
                        json_str = line[len("data:") :].strip()
                        return json.loads(json_str)
            return response.json()
        except Exception:
            return {}

    def _get_mcp_by_name(self, name: str) -> tuple:
        """
        Get MCP connection document by name using shared utility

        Args:
            name (str): MCP connection name

        Returns:
            tuple: (document_dict, document_key) or (None, None) if not found
        """
        try:
            query = json.dumps({NAME: name})
            results = get_raw_document_from_kv_store(
                search_info=self.search_info, collection_name=self.collection_name, query=query
            )

            if results and len(results) > 0:
                doc = results[0]
                doc_key = doc.get('_key')
                return (doc, doc_key)
            return (None, None)

        except Exception as e:
            logger.error(f"Failed to get MCP connection by name '{name}': {str(e)}")
            logger.error(traceback.format_exc())
            return (None, None)

    def _list_all_mcps(self) -> list:
        """
        List all MCP connection documents using shared utility

        Returns:
            list: List of all MCP connection documents
        """
        try:
            data = get_raw_documents_from_kv_store(
                search_info=self.search_info, collection_name=self.collection_name
            )
            return data if data else []

        except Exception as e:
            logger.error(f"Failed to list MCP connections: {str(e)}")
            logger.error(traceback.format_exc())
            return []

    def _validate_url(self, url: str) -> bool:
        """
        Validate MCP server URL

        Args:
            url (str): URL to validate

        Returns:
            bool: True if valid, False otherwise
        """
        if not url:
            return False

        # Validate URL against allowed domains
        if not self.common_utils.is_url_whitelisted(url):
            raise ValueError(
                f"URL '{url}' is not allowed. Please check your allowed domains configuration in mlspl.conf."
            )

        # URL pattern: https://... or http://localhost...
        https_pattern = re.compile(
            r'^(https:\/\/)(localhost|(\d{1,3}\.){3}\d{1,3}|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d+)?(\/\S*)?$'
        )
        http_localhost_pattern = re.compile(r'^(http:\/\/)(localhost)(:\d+)?(\/\S*)?$')

        return bool(https_pattern.match(url) or http_localhost_pattern.match(url))

    def _validate_mcp_data(self, name: str, mcp_type: str, url: str) -> None:
        """
        Validate MCP connection data

        Args:
            name (str): MCP connection name
            mcp_type (str): MCP type
            url (str): MCP server URL

        Raises:
            ValueError: If validation fails
        """
        # Validate name
        if not name or not name.strip():
            raise ValueError(ERROR_EMPTY_NAME)

        # Validate type
        if mcp_type not in MCP_TYPES:
            raise ValueError(ERROR_INVALID_TYPE.format(mcp_type, ', '.join(MCP_TYPES)))

        # Validate URL
        if not self._validate_url(url):
            raise ValueError(ERROR_INVALID_URL.format(url))

    def _check_duplicate_name(self, name: str) -> bool:
        """
        Check if MCP connection name already exists

        Args:
            name (str): Name to check

        Returns:
            bool: True if duplicate exists, False otherwise
        """
        doc, _ = self._get_mcp_by_name(name)
        return doc is not None

    def _store_token(self, name: str, token: str) -> str:
        """
        Store MCP token using shared handle_secrets utility

        Args:
            name (str): MCP connection name
            token (str): Token to store

        Returns:
            str: Reference string in format "realm:username"
        """
        try:
            existing_secret = self._retrieve_token(name)
            type = "CREATE"
            if existing_secret:
                type = "UPDATE"
            result = handle_secrets(
                searchinfo=self.search_info,
                provider=name,
                token=token,
                type=type,
                realm=MCP_PASSWORD_REALM_PREFIX,
                with_admin_token=True,
            )

            # handle_secrets returns the password object content on success,
            # or a dict with 'status' and 'message' on error
            if result and result.get('status') and result.get('status') >= 400:
                raise Exception(
                    f"Failed to store token: {result.get('message', 'Unknown error')}"
                )

            return f"{MCP_PASSWORD_REALM_PREFIX}:{name}"

        except Exception as e:
            logger.error(f"Failed to store MCP token for {name}: {str(e)}")
            raise

    def _retrieve_token(self, name: str) -> str:
        """
        Retrieve MCP token using shared handle_secrets utility

        Args:
            name (str): MCP connection name

        Returns:
            str: The decrypted token or empty string
        """
        try:
            result = handle_secrets(
                searchinfo=self.search_info,
                provider=name,
                type="SELECT",
                realm=MCP_PASSWORD_REALM_PREFIX,
            )

            if result and 'clear_password' in result:
                return result['clear_password']
            return ""

        except Exception as e:
            logger.error(f"Failed to retrieve MCP token for {name}: {str(e)}")
            return ""

    def _delete_token(self, name: str) -> bool:
        """
        Delete MCP token using shared handle_secrets utility

        Args:
            name (str): MCP connection name

        Returns:
            bool: True if deleted successfully
        """
        try:
            result = handle_secrets(
                searchinfo=self.search_info,
                provider=name,
                type="DELETE",
                realm=MCP_PASSWORD_REALM_PREFIX,
                with_admin_token=True,
            )

            # DELETE returns 200 on success
            return result and result.get('status') in {200, 404}
        except Exception as e:
            logger.error(f"Failed to delete MCP token for {name}: {str(e)}")
            return False

    def create_config(self, request_payload: dict) -> bool:
        """
        Create a new MCP connection from request payload

        Input:
            {
                "name": "connection_name",
                "type": "SPLUNK",
                "details": {
                    "url": "https://...",
                    "token": "..."
                },
                "description": "optional"
            }

        Args:
            request_payload (dict): Request payload with name, type, details

        Returns:
            bool: True if created successfully

        Raises:
            ValueError: If validation fails or duplicate name exists
        """
        # Extract required fields
        name = request_payload.get('name')
        mcp_type = request_payload.get('type')
        connection_details = request_payload.get('details')
        description = request_payload.get('description', '')

        if not name or not name.strip():
            raise ValueError("Missing required field: 'name'")

        if not mcp_type:
            raise ValueError("Missing required field: 'type'")

        if not connection_details:
            raise ValueError("Missing required field: 'details'")

        # Delegate to existing method and return its result
        return self.create_mcp_connection(name, mcp_type, connection_details, description)

    def update_config(self, request_payload: dict) -> bool:
        """
        Update an existing MCP connection

        Args:
            request_payload (dict): Request payload containing name, details, description

        Returns:
            bool: True if updated successfully

        Raises:
            ValueError: If validation fails or connection not found
        """
        name = request_payload.get('name')
        connection_details = request_payload.get('details')
        description = request_payload.get('description')
        acls = request_payload.get('acl')

        if not name or not name.strip():
            raise ValueError("Missing required field: 'name'")

        if not connection_details:
            raise ValueError("Missing required field: 'details'")

        return self.update_mcp_connection(name, connection_details, description, acls)

    def delete_config(self, connection_name: str) -> bool:
        """
        Delete an MCP connection by name

        Args:
            connection_name (str): Name of the MCP connection to delete

        Returns:
            bool: True if deleted successfully

        Raises:
            ValueError: If connection not found
        """
        self.delete_mcp_connection(connection_name)
        return True

    def get_config(self) -> list:
        """
        Get all MCP connections

        Returns:
            list: List of all MCP connection documents
        """
        return self.list_mcp_connections(include_tokens=False)

    def create_mcp_connection(
        self, name: str, mcp_type: str, connection_details: dict, description: str = ""
    ) -> bool:
        """
        Create a new MCP connection

        """
        try:
            # Extract connection details
            url = connection_details.get(URL, '')
            token = connection_details.get(TOKEN, '')
            is_auto_refresh = connection_details.get(AUTO_REFRESH_ENABLED, False)
            client_id = connection_details.get(CLIENT_ID, '')
            client_secret = connection_details.get(CLIENT_SECRET, '')
            refresh_token = connection_details.get(REFRESH_TOKEN, '')
            secrets = {TOKEN: token}
            if mcp_type == 'ATLASSIAN':
                secrets[CLIENT_ID] = client_id
                secrets[CLIENT_SECRET] = client_secret
                secrets[REFRESH_TOKEN] = refresh_token
                secrets[LAST_REFRESH_AT] = None

            secrets_string = json.dumps(secrets)

            # Validate input
            self._validate_mcp_data(name, mcp_type, url)

            # Check for duplicate name
            if self._check_duplicate_name(name):
                raise ValueError(ERROR_DUPLICATE_NAME.format(name))

            # Store secrets in passwords.conf using shared utility
            realm_username = self._store_token(name, secrets_string)

            # Create timestamp (use time.time() like vector store does)
            now = time.time()

            # Create new MCP document
            mcp_document = {
                NAME: name,
                DESCRIPTION: description,
                TYPE: mcp_type,
                DETAILS: {
                    SECRETS: realm_username,
                    URL: url,
                    AUTO_REFRESH_ENABLED: is_auto_refresh,
                },
                CREATED_AT: now,
                LAST_UPDATED_AT: now,
                LAST_UPDATED_BY: self.username,
                "acl": {
                    "sharing": "owner",
                    "app": "SPLUNK_ML_TOOLKIT",
                    "owner": self.username,
                    "perms": {"read": [], "write": []},
                },
            }

            # Insert document into KVStore using shared utility
            result = upsert_single_document_into_kv_store(
                search_info=self.search_info,
                collection_name=self.collection_name,
                document=mcp_document,
                with_admin_token=True,
            )

            if not result:
                raise Exception("Failed to insert document into KVStore")

            logger.info(SUCCESS_CREATED.format(name))

            # Return response
            return True
        except Exception as e:
            logger.error(f"Failed to create MCP connection '{name}': {str(e)}")
            logger.error(traceback.format_exc())
            raise

    def list_mcp_connections(self, include_tokens: bool = False) -> list:
        """
        List all MCP connections

        Args:
            include_tokens (bool): If True, retrieve actual decrypted tokens.
                                   If False (default), mask tokens with DEFAULT_TOKEN.

        Returns:
            list: List of MCP connections with tokens masked or revealed based on include_tokens
        """
        try:
            mcps = self._list_all_mcps()

            # Remove KVStore metadata
            clean_mcps = []
            for mcp in mcps:
                # Create clean copy without metadata
                clean_mcp = {k: v for k, v in mcp.items() if not k.startswith('_')}
                is_user_authorized = self.common_utils.is_user_eligible_by_role(
                    acl=mcp.get("acl", {}),
                    action="read",
                )
                if not is_user_authorized:
                    continue

                # Handle token based on include_tokens flag
                if include_tokens:
                    # Retrieve actual decrypted token
                    mcp_name = clean_mcp.get(NAME, '')

                    actual_token = self._retrieve_token(mcp_name)
                    if actual_token:
                        actual_secrets = json.loads(actual_token)
                        if DETAILS not in clean_mcp:
                            clean_mcp[DETAILS] = {}
                        clean_mcp[DETAILS][TOKEN] = actual_secrets.get(TOKEN, '')
                        if clean_mcp.get(TYPE) == 'ATLASSIAN':
                            clean_mcp[DETAILS][CLIENT_ID] = actual_secrets.get(CLIENT_ID, '')
                            clean_mcp[DETAILS][CLIENT_SECRET] = actual_secrets.get(
                                CLIENT_SECRET, ''
                            )
                            clean_mcp[DETAILS][REFRESH_TOKEN] = actual_secrets.get(
                                REFRESH_TOKEN, ''
                            )
                            clean_mcp[DETAILS][LAST_REFRESH_AT] = actual_secrets.get(
                                LAST_REFRESH_AT, None
                            )

                else:
                    # Mask token with DEFAULT_TOKEN (security: don't expose realm references)
                    if DETAILS in clean_mcp:
                        clean_mcp[DETAILS][TOKEN] = DEFAULT_TOKEN
                        if clean_mcp.get(TYPE) == 'ATLASSIAN':
                            clean_mcp[DETAILS][CLIENT_ID] = DEFAULT_TOKEN
                            clean_mcp[DETAILS][CLIENT_SECRET] = DEFAULT_TOKEN
                            clean_mcp[DETAILS][REFRESH_TOKEN] = DEFAULT_TOKEN
                            clean_mcp[DETAILS][LAST_REFRESH_AT] = None

                clean_mcp[DETAILS].pop(SECRETS, None)  # Remove secrets reference
                clean_mcps.append(clean_mcp)

            return clean_mcps

        except Exception as e:
            logger.error(f"Failed to list MCP connections: {str(e)}")
            logger.error(traceback.format_exc())
            raise

    def update_mcp_connection(
        self,
        name: str,
        connection_details: dict,
        description: str = None,
        acls: dict = None,
        is_auth_bypass: bool = False,
    ) -> bool:
        """
        Update an existing MCP connection

        Args:
            name (str): MCP connection name to update
            connection_details (dict): New connection details
            description (str): Optional new description

        Returns:
            bool: True if updated successfully
        Raises:
            ValueError: If MCP connection not found or validation fails
        """
        try:
            # Get existing document
            mcp_doc, doc_key = self._get_mcp_by_name(name)
            if not mcp_doc:
                raise ValueError(ERROR_NOT_FOUND.format(name))

            if not is_auth_bypass:
                is_user_authorized = self.common_utils.is_user_eligible_by_role(
                    acl=mcp_doc.get("acl", {}),
                    action="write",
                )

                if not is_user_authorized:
                    raise ValueError(
                        f"User is not authorized to update configuration '{name}'."
                    )

            # Extract new details
            new_url = connection_details.get(URL)
            new_token = connection_details.get(TOKEN)
            new_client_id = connection_details.get(CLIENT_ID)
            new_client_secret = connection_details.get(CLIENT_SECRET)
            new_refresh_token = connection_details.get(REFRESH_TOKEN)
            auto_refresh_enabled = connection_details.get(AUTO_REFRESH_ENABLED)

            is_secrets_updated = any(
                [
                    new_token and new_token != DEFAULT_TOKEN,
                    new_client_id and new_client_id != DEFAULT_TOKEN,
                    new_client_secret and new_client_secret != DEFAULT_TOKEN,
                    new_refresh_token and new_refresh_token != DEFAULT_TOKEN,
                ]
            )

            if is_secrets_updated:
                existing_secrets = json.loads(self._retrieve_token(name))
                existing_secrets[TOKEN] = (
                    new_token
                    if new_token and new_token != DEFAULT_TOKEN
                    else existing_secrets.get(TOKEN, '')
                )
                existing_secrets[CLIENT_ID] = (
                    new_client_id
                    if new_client_id and new_client_id != DEFAULT_TOKEN
                    else existing_secrets.get(CLIENT_ID, '')
                )
                existing_secrets[CLIENT_SECRET] = (
                    new_client_secret
                    if new_client_secret and new_client_secret != DEFAULT_TOKEN
                    else existing_secrets.get(CLIENT_SECRET, '')
                )
                existing_secrets[REFRESH_TOKEN] = (
                    new_refresh_token
                    if new_refresh_token and new_refresh_token != DEFAULT_TOKEN
                    else existing_secrets.get(REFRESH_TOKEN, '')
                )
                secrets_string = json.dumps(existing_secrets)
                # Update secrets in passwords.conf using shared utility
                self.common_utils.update_token(
                    MCP_PASSWORD_REALM_PREFIX, name, secrets_string, with_admin_token=True
                )

            mcp_doc[DETAILS][AUTO_REFRESH_ENABLED] = auto_refresh_enabled
            mcp_doc[DETAILS][LAST_REFRESH_AT] = None
            if acls:
                mcp_doc["acl"] = acls
            # Update URL if provided
            if new_url:
                if not self._validate_url(new_url):
                    raise ValueError(ERROR_INVALID_URL.format(new_url))
                if DETAILS not in mcp_doc:
                    mcp_doc[DETAILS] = {}
                mcp_doc[DETAILS][URL] = new_url

            # Update description if provided
            if description is not None:
                mcp_doc[DESCRIPTION] = description

            # Update metadata
            mcp_doc[LAST_UPDATED_AT] = time.time()
            mcp_doc[LAST_UPDATED_BY] = self.username

            # Update document in KVStore using shared utility
            result = upsert_single_document_into_kv_store(
                search_info=self.search_info,
                collection_name=self.collection_name,
                document=mcp_doc,
                document_key=doc_key,
                with_admin_token=True,
            )

            if not result:
                raise Exception("Failed to update document in KVStore")

            logger.info(SUCCESS_UPDATED.format(name))

            # Return response
            return True

        except Exception as e:
            logger.error(f"Failed to update MCP connection '{name}': {str(e)}")
            logger.error(traceback.format_exc())
            raise

    def delete_mcp_connection(self, name: str) -> dict:
        """
        Delete an MCP connection

        Args:
            name (str): MCP connection name to delete

        Returns:
            dict: Deleted MCP connection details

        Raises:
            ValueError: If MCP connection not found
        """
        try:
            # Get existing document
            mcp_doc, doc_key = self._get_mcp_by_name(name)

            if not mcp_doc:
                raise ValueError(ERROR_NOT_FOUND.format(name))

            is_user_authorized = self.common_utils.is_user_eligible_by_role(
                acl=mcp_doc.get("acl", {}),
                action="write",
            )

            if not is_user_authorized:
                raise ValueError(f"User is not authorized to delete configuration '{name}'.")

            # Delete token from passwords.conf using shared utility
            self._delete_token(name)

            # Delete document from KVStore using shared utility
            result = delete_document_from_kv_store(
                search_info=self.search_info,
                collection_name=self.collection_name,
                document_key=doc_key,
                with_admin_token=True,
            )

            if not result:
                logger.warning(f"Failed to delete document from KVStore for '{name}'")

            logger.info(SUCCESS_DELETED.format(name))

            # Return deleted connection info
            return {
                NAME: name,
                TYPE: mcp_doc.get(TYPE),
                DETAILS: {
                    URL: mcp_doc.get(DETAILS, {}).get(URL),
                    TOKEN: mcp_doc.get(DETAILS, {}).get(TOKEN),
                },
            }

        except Exception as e:
            logger.error(f"Failed to delete MCP connection '{name}': {str(e)}")
            logger.error(traceback.format_exc())
            raise

    def get_mcp_connection(
        self,
        name: str,
        include_token: bool = False,
        is_meta_data: bool = False,
        is_auth_bypass: bool = False,
    ) -> dict:
        """
        Get a specific MCP connection by name

        Args:
            name (str): MCP connection name
            include_token (bool): If True, retrieve actual decrypted token.
                                  If False (default), mask token with DEFAULT_TOKEN.

        Returns:
            dict: MCP connection details with token masked or revealed
        """
        try:
            mcp_doc, _ = self._get_mcp_by_name(name)

            if not mcp_doc:
                raise ValueError(ERROR_NOT_FOUND.format(name))

            if not is_auth_bypass:
                is_user_authorized = self.common_utils.is_user_eligible_by_role(
                    acl=mcp_doc.get("acl", {}),
                    action="read",
                )

                if not is_user_authorized:
                    raise ValueError(f"User is not authorized to read configuration '{name}'.")

            # Remove KVStore metadata
            if not is_meta_data:
                response = {k: v for k, v in mcp_doc.items() if not k.startswith('_')}
            else:
                response = mcp_doc.copy()

            # Handle token based on include_token flag
            if include_token:
                # Retrieve actual decrypted token
                actual_token = self._retrieve_token(name)
                if actual_token:
                    actual_secrets = json.loads(actual_token)
                    if DETAILS not in response:
                        response[DETAILS] = {}
                    response[DETAILS][TOKEN] = actual_secrets.get(TOKEN, '')
                    if response.get(TYPE) == 'ATLASSIAN':
                        response[DETAILS][CLIENT_ID] = actual_secrets.get(CLIENT_ID, '')
                        response[DETAILS][CLIENT_SECRET] = actual_secrets.get(CLIENT_SECRET, '')
                        response[DETAILS][REFRESH_TOKEN] = actual_secrets.get(REFRESH_TOKEN, '')
                        response[DETAILS][LAST_REFRESH_AT] = actual_secrets.get(
                            LAST_REFRESH_AT, None
                        )
            else:
                # Mask token with DEFAULT_TOKEN (security: don't expose realm references)
                if DETAILS in response:
                    response[DETAILS][TOKEN] = DEFAULT_TOKEN
                    if response.get(TYPE) == 'ATLASSIAN':
                        response[DETAILS][CLIENT_ID] = DEFAULT_TOKEN
                        response[DETAILS][CLIENT_SECRET] = DEFAULT_TOKEN
                        response[DETAILS][REFRESH_TOKEN] = DEFAULT_TOKEN
                        response[DETAILS][LAST_REFRESH_AT] = actual_secrets.get(
                            LAST_REFRESH_AT, None
                        )

            response[DETAILS].pop(SECRETS, None)  # Remove secrets reference
            return response

        except Exception as e:
            logger.error(f"Failed to get MCP connection '{name}': {str(e)}")
            logger.error(traceback.format_exc())
            raise

    def test_connection(self, name=None, url=None, token=None, mcp_type=None) -> dict:
        """
        Test MCP server connectivity with Bearer token authentication (SPLUNK and ATLASSIAN).
        Routes to appropriate handler based on connection type.

        Supports two modes:
        1. KV Store mode: Provide 'name' to test a saved connection
        2. Form mode: Provide 'url', 'token', and optionally 'mcp_type' for direct testing
           (name should NOT be provided in form mode - it's not editable)
        """
        try:
            self._validate_mcp_data(
                name, mcp_type, url
            )  # Validate input format (will raise ValueError if invalid)
            if token == DEFAULT_TOKEN:
                secrets = json.loads(self._retrieve_token(name))
                token = secrets.get(TOKEN, '')

            # Mode 1: Get from KV Store (saved connection)
            if name and not url and not token:
                mcp_doc, _ = self._get_mcp_by_name(name)
                if not mcp_doc:
                    raise ValueError(ERROR_NOT_FOUND.format(name))

                # Extract connection details
                mcp_type = mcp_doc.get(TYPE, '')
                details = mcp_doc.get(DETAILS, {})
                url = details.get(URL, '')

                # Retrieve token
                secrets = json.loads(self._retrieve_token(name))
                token = secrets.get(TOKEN, '')
                source = "kvstore"
                check_duplicate = False  # Already exists, no need to check

            # Mode 2: Get from form (direct test before saving)
            elif url and token:
                # Default to SPLUNK type if not provided (form testing)
                if not mcp_type:
                    # Simple heuristic: check if URL contains splunk or port 8089
                    if 'splunk' in url.lower() or ':8089' in url:
                        mcp_type = "SPLUNK"
                    elif (
                        'atlassian' in url.lower()
                        or 'jira' in url.lower()
                        or 'confluence' in url.lower()
                    ):
                        mcp_type = "ATLASSIAN"
                    else:
                        mcp_type = "SPLUNK"  # Default to SPLUNK for form testing
                source = "form"
                check_duplicate = False  # Name not provided in form testing

            else:
                return {
                    "success": False,
                    "status": "error",
                    "message": "Either provide 'name' (for saved connection) OR 'url' + 'token' (for form validation)",
                    "data": {},
                }

            # Only support SPLUNK and ATLASSIAN
            if mcp_type not in ['SPLUNK', 'ATLASSIAN']:
                return {
                    "success": False,
                    "status": "error",
                    "message": f"Test connection only supports SPLUNK and ATLASSIAN types, got: {mcp_type}",
                    "data": {"mcp_type": mcp_type, "source": source},
                }

            # Validate URL
            if not url:
                return {
                    "success": False,
                    "status": "error",
                    "message": "MCP server URL is missing",
                    "data": {"mcp_type": mcp_type, "source": source},
                }
            elif not self._validate_url(url):
                return {
                    "success": False,
                    "status": "error",
                    "message": f"MCP server URL is invalid or not allowed: {url}",
                    "data": {"mcp_type": mcp_type, "mcp_server_url": url, "source": source},
                }

            # Validate token
            if not token:
                return {
                    "success": False,
                    "status": "error",
                    "message": "Bearer token is missing or could not be retrieved",
                    "data": {
                        "mcp_name": name,
                        "mcp_type": mcp_type,
                        "url": url,
                        "source": source,
                    },
                }

            # ============================================================
            # Route to appropriate handler based on connection type
            # ============================================================

            if mcp_type == "ATLASSIAN":
                # Use SSE-based connection for ATLASSIAN
                logger.info(f"Testing ATLASSIAN connection via SSE: {url}")
                result = test_atlassian_connection(url, token, cloud_id=None, verify_ssl=False)
                # Add name to result only if testing from KV Store (name exists)
                if name and source == "kvstore":
                    result['data']['mcp_name'] = name
                return result

            # SPLUNK: Use existing JSON-RPC POST method
            start_time = time.time()
            try:
                headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json,text/event-stream',
                    'Authorization': f'Bearer {token}',
                    'MCP-Protocol-Version': '2025-03-26',
                }

                # Use JSON-RPC 2.0 tools/list method to validate token
                import uuid

                payload = {
                    "jsonrpc": "2.0",
                    "id": str(uuid.uuid4()),
                    "method": "tools/list",
                    "params": {},
                }

                # Force HTTP/1.1
                from requests.adapters import HTTPAdapter

                session = requests.Session()
                session.mount('https://', HTTPAdapter())

                response = session.post(
                    url,
                    headers=headers,
                    json=payload,
                    timeout=60,
                    verify=False,
                    allow_redirects=False,
                )

                response_time_ms = int((time.time() - start_time) * 1000)

                # Modular response parsing based on server type
                server_type = self._get_mcp_server_type(url)
                if response.status_code == 200:
                    try:
                        if server_type == "on_deployment":
                            result = self._parse_on_deployment_response(response)
                        elif server_type == "on_cloud":
                            result = self._parse_on_cloud_response(response)
                        else:
                            result = response.json()
                        # Check for JSON-RPC error
                        if "error" in result:
                            return {
                                "success": False,
                                "status": "error",
                                "message": f"MCP server returned error: {result['error'].get('message', 'Unknown error')}",
                                "data": {
                                    "mcp_name": name,
                                    "mcp_type": mcp_type,
                                    "mcp_server_url": url,
                                    "response_time_ms": response_time_ms,
                                    "error_code": result['error'].get('code'),
                                    "authenticated": False,
                                },
                            }
                        # Success - server responded to ping
                        return {
                            "success": True,
                            "status": "success",
                            "message": "MCP server is reachable and Bearer token is valid",
                            "data": {
                                "mcp_name": name,
                                "mcp_type": mcp_type,
                                "mcp_server_url": url,
                                "response_time_ms": response_time_ms,
                                "http_status": response.status_code,
                                "authenticated": True,
                                "reachable": True,
                            },
                        }
                    except Exception as e:
                        # Response was 200 but not valid JSON
                        return {
                            "success": True,
                            "status": "success",
                            "message": f"MCP server is reachable (HTTP 200) but response parsing failed: {str(e)}",
                            "data": {
                                "mcp_name": name,
                                "mcp_type": mcp_type,
                                "mcp_server_url": url,
                                "response_time_ms": response_time_ms,
                                "http_status": 200,
                                "reachable": True,
                            },
                        }
                elif response.status_code == 401 or response.status_code == 403:
                    return {
                        "success": False,
                        "status": "error",
                        "message": f"Authentication failed: Bearer token is invalid or expired (HTTP {response.status_code})",
                        "data": {
                            "mcp_name": name,
                            "mcp_type": mcp_type,
                            "mcp_server_url": url,
                            "response_time_ms": response_time_ms,
                            "http_status": response.status_code,
                            "authenticated": False,
                            "reachable": True,
                        },
                    }
                else:
                    return {
                        "success": False,
                        "status": "error",
                        "message": f"MCP server returned status: HTTP {response.status_code}",
                        "data": {
                            "mcp_name": name,
                            "mcp_type": mcp_type,
                            "mcp_server_url": url,
                            "response_time_ms": response_time_ms,
                            "http_status": response.status_code,
                            "reachable": True,
                        },
                    }

            except requests.exceptions.Timeout:
                return {
                    "success": False,
                    "status": "error",
                    "message": "Request timeout - MCP server did not respond within 60 seconds",
                    "data": {"mcp_name": name, "mcp_type": mcp_type, "mcp_server_url": url},
                }
            except requests.exceptions.ConnectionError as e:
                return {
                    "success": False,
                    "status": "error",
                    "message": f"Failed to connect to MCP server: {str(e)}",
                    "data": {"mcp_name": name, "mcp_type": mcp_type, "mcp_server_url": url},
                }
            except Exception as e:
                return {
                    "success": False,
                    "status": "error",
                    "message": f"Unexpected error: {str(e)}",
                    "data": {"mcp_name": name, "mcp_type": mcp_type, "mcp_server_url": url},
                }
        except Exception as e:
            return {
                "success": False,
                "status": "error",
                "message": f"Internal error: {str(e)}",
                "data": {"mcp_name": name},
            }

    def list_tools(self, name=None, url=None, token=None) -> dict:
        """
        List available tools from MCP server (SPLUNK and ATLASSIAN).
        Routes to appropriate handler based on connection type.

        Supports two modes:
        1. KV Store mode: Provide 'name' to list tools from a saved connection
        2. Direct mode: Provide 'url' and 'token' for direct access

        Returns:
            dict: List of tools with name and description
        """
        try:
            mcp_type = None  # Will be determined from KV Store or URL
            mcp_doc, doc_key = self._get_mcp_by_name(name)
            if not mcp_doc:
                raise ValueError(ERROR_NOT_FOUND.format(name))

            # Extract connection details
            mcp_type = mcp_doc.get(TYPE, '')
            details = mcp_doc.get(DETAILS, {})
            url = details.get(URL, '')
            secrets = json.loads(self._retrieve_token(name))
            token = secrets.get(TOKEN, '')

            # ============================================================
            # Route to appropriate handler based on connection type
            # ============================================================

            if mcp_type == "ATLASSIAN":
                # Use SSE-based connection for ATLASSIAN
                logger.info(f"Listing tools from ATLASSIAN via SSE: {url}")
                is_auto_refresh = details.get(AUTO_REFRESH_ENABLED, False)
                last_refresh_at = secrets.get(LAST_REFRESH_AT, None)
                # Check if token refresh is needed
                is_token_refresh_required = self.common_utils.is_token_refresh_required(
                    last_refresh_at, is_auto_refresh
                )
                if is_token_refresh_required:
                    logger.info(f"Refreshing ATLASSIAN token for MCP connection: {name}")
                    token, new_refresh_token = refresh_token(
                        url,
                        {
                            CLIENT_ID: secrets.get(CLIENT_ID, ''),
                            CLIENT_SECRET: secrets.get(CLIENT_SECRET, ''),
                            REFRESH_TOKEN: secrets.get(REFRESH_TOKEN, ''),
                        },
                        'ATLASSIAN',
                    )
                    # Update stored token
                    new_secrets = {
                        TOKEN: token,
                        CLIENT_ID: secrets.get(CLIENT_ID, ''),
                        CLIENT_SECRET: secrets.get(CLIENT_SECRET, ''),
                        REFRESH_TOKEN: new_refresh_token,
                        LAST_REFRESH_AT: time.time(),
                    }
                    self.common_utils.update_token(
                        MCP_PASSWORD_REALM_PREFIX,
                        name,
                        json.dumps(new_secrets),
                        with_admin_token=True,
                    )
                result = list_atlassian_tools(url, token, cloud_id=None, verify_ssl=False)
                # Add name to result if provided
                if name:
                    result['data']['mcp_name'] = name
                return result

            # SPLUNK: Use existing JSON-RPC POST method
            start_time = time.time()
            try:
                headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/event-stream',
                    'Authorization': f'Bearer {token}',
                    'MCP-Protocol-Version': '2025-03-26',
                }

                # JSON-RPC 2.0 tools/list
                import uuid

                payload = {
                    "jsonrpc": "2.0",
                    "id": str(uuid.uuid4()),
                    "method": "tools/list",
                    "params": {},
                }

                # Force HTTP/1.1
                from requests.adapters import HTTPAdapter

                session = requests.Session()
                session.mount('https://', HTTPAdapter())

                response = session.post(
                    url,
                    headers=headers,
                    json=payload,
                    timeout=60,
                    verify=False,
                    allow_redirects=False,
                )

                response_time_ms = int((time.time() - start_time) * 1000)

                # Modular response parsing based on server type
                server_type = self._get_mcp_server_type(url)
                if response.status_code == 200:
                    try:
                        if server_type == "on_deployment":
                            result = self._parse_on_deployment_response(response)
                        elif server_type == "on_cloud":
                            result = self._parse_on_cloud_response(response)
                        else:
                            result = response.json()

                        # Check for JSON-RPC error
                        if "error" in result:
                            return {
                                "success": False,
                                "status": "error",
                                "message": f"MCP server returned error: {result['error'].get('message', 'Unknown error')}",
                                "data": {
                                    "mcp_name": name,
                                    "mcp_type": mcp_type,
                                    "mcp_server_url": url,
                                    "response_time_ms": response_time_ms,
                                    "error_code": result['error'].get('code'),
                                },
                            }

                        # Extract tools from result
                        tools_data = result.get('result', {})
                        tools_list = tools_data.get('tools', [])

                        # Simplify tools list to only name and description
                        simplified_tools = [
                            {
                                "name": tool.get("name", ""),
                                "description": tool.get("description", ""),
                            }
                            for tool in tools_list
                        ]

                        return {
                            "success": True,
                            "status": "success",
                            "message": f"Retrieved {len(simplified_tools)} tool(s) from MCP server",
                            "data": {
                                "mcp_name": name,
                                "mcp_type": mcp_type,
                                "mcp_server_url": url,
                                "response_time_ms": response_time_ms,
                                "tool_count": len(simplified_tools),
                                "tools": simplified_tools,
                            },
                        }

                    except Exception as e:
                        return {
                            "success": False,
                            "status": "error",
                            "message": f"Failed to parse tools response: {str(e)}",
                            "data": {
                                "mcp_name": name,
                                "mcp_type": mcp_type,
                                "mcp_server_url": url,
                                "response_time_ms": response_time_ms,
                            },
                        }
                elif response.status_code == 401 or response.status_code == 403:
                    return {
                        "success": False,
                        "status": "error",
                        "message": f"Authentication failed: Bearer token is invalid (HTTP {response.status_code})",
                        "data": {
                            "mcp_name": name,
                            "mcp_type": mcp_type,
                            "mcp_server_url": url,
                            "response_time_ms": response_time_ms,
                            "http_status": response.status_code,
                        },
                    }
                else:
                    return {
                        "success": False,
                        "status": "error",
                        "message": f"MCP server returned status: HTTP {response.status_code}",
                        "data": {
                            "mcp_name": name,
                            "mcp_type": mcp_type,
                            "mcp_server_url": url,
                            "response_time_ms": response_time_ms,
                            "http_status": response.status_code,
                        },
                    }

            except requests.exceptions.Timeout:
                return {
                    "success": False,
                    "status": "error",
                    "message": "Request timeout - MCP server did not respond within 60 seconds",
                    "data": {"mcp_name": name, "mcp_type": mcp_type, "mcp_server_url": url},
                }
            except requests.exceptions.ConnectionError as e:
                return {
                    "success": False,
                    "status": "error",
                    "message": f"Failed to connect to MCP server: {str(e)}",
                    "data": {"mcp_name": name, "mcp_type": mcp_type, "mcp_server_url": url},
                }
            except Exception as e:
                return {
                    "success": False,
                    "status": "error",
                    "message": f"Unexpected error: {str(e)}",
                    "data": {"mcp_name": name, "mcp_type": mcp_type, "mcp_server_url": url},
                }
        except Exception as e:
            return {
                "success": False,
                "status": "error",
                "message": f"Internal error: {str(e)}",
                "data": {"mcp_name": name},
            }
