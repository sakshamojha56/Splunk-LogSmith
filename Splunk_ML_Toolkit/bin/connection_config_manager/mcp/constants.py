"""
Constants and configuration for MCP (Model Context Protocol) connection management.
"""

# Collection name in KVStore
MCP_COLLECTION_NAME = 'aitk_mcp_collection'

# Configuration version
MCP_CONFIG_VERSION = 'v1'

# MCP Types (MVP: ATLASSIAN and SPLUNK only)
MCP_TYPES = ['ATLASSIAN', 'SPLUNK']

# MCP field keys
NAME = 'name'
DESCRIPTION = 'description'
TYPE = 'type'
TOKEN = 'token'
URL = 'url'
DETAILS = 'details'
CONNECTION_DETAILS = 'details'
MCP_SERVER_URL = 'mcp_server_url'
MCPS = 'mcps'
VERSION = 'version'
CREATED_AT = 'created_at'
LAST_UPDATED_AT = 'last_updated_at'
LAST_UPDATED_BY = 'last_updated_by'
CLIENT_ID = 'client_id'
CLIENT_SECRET = 'client_secret'
REFRESH_TOKEN = 'refresh_token'
AUTO_REFRESH_ENABLED = 'is_auto_refresh_enabled'
LAST_REFRESH_AT = 'last_refresh_at'
SECRETS = 'secrets'

# Default MCP connection document schema (for individual documents)
DEFAULT_MCP_DOCUMENT = {
    NAME: "",
    DESCRIPTION: "",  # Optional description field
    TYPE: "",
    DETAILS: {TOKEN: "", URL: ""},
    CREATED_AT: "",
    LAST_UPDATED_AT: "",
    LAST_UPDATED_BY: "",
}

# Password realm prefix for MCP tokens
MCP_PASSWORD_REALM_PREFIX = 'mcp_token'

# Error messages
ERROR_DUPLICATE_NAME = "MCP connection with name '{}' already exists"
ERROR_NOT_FOUND = "MCP connection with name '{}' not found"
ERROR_INVALID_TYPE = "Invalid MCP type '{}'. Allowed types: {}"
ERROR_MISSING_FIELD = "Missing required field: '{}'"
ERROR_INVALID_URL = "Invalid MCP server URL: '{}'"
ERROR_EMPTY_NAME = "MCP connection name cannot be empty"

# Success messages
SUCCESS_CREATED = "MCP connection '{}' created successfully"
SUCCESS_UPDATED = "MCP connection '{}' updated successfully"
SUCCESS_DELETED = "MCP connection '{}' deleted successfully"
