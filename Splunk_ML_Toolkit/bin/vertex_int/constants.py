"""Constants for Vertex AI integration with Splunk MLTK."""

# Runtime metadata
VERTEX_MODEL_ALGO_NAME = 'vertex_custom_model'
VERTEX_MODEL_RUNTIME = 'vertex'
VERTEX_MODEL_TYPE = 'vertex_model'
VERTEX_MODEL_TYPE_CLASSES = ['vertex.VertexModel', 'VertexModel']
VERTEX = [VERTEX_MODEL_RUNTIME]

# Lookup / provider prefixes
VERTEX_LOOKUP_PREFIX = "__mlspl_vertex_"
VERTEX_PROVIDER_PREFIX = "vertex_"

# Credential storage
VERTEX_SECRETS_REALM = "aitk_vertex_realm"

# Required payload fields (will be validated during registration)
VERTEX_REQUIRED_PAYLOAD_FIELDS = [
    'model_name',
    'gcp_credentials',
    'input_feature_map',
    'output_prediction_map',
    'openapi_spec',
]

# GCP credential structure
VERTEX_REQUIRED_CREDENTIAL_FIELDS = [
    'project_id',
    'region',
    'endpoint_id',
    'service_account_json',
]

# Authorization / capabilities
VERTEX_TEST_CONNECTION_CAPABILITIES = ['edit_endpoints']
VERTEX_REGISTER_MODEL_CAPABILITIES = [
    'edit_endpoints',
    'edit_storage_passwords',
    'list_storage_passwords',
]
VERTEX_APPLY_MODEL_CAPABILITIES = ['list_storage_passwords']
VERTEX_ADMIN_ROLES = ['mltk_admin', 'sc_admin']

# Lookup table format
LOOKUP_COLUMN_ALGO = 'algo'
LOOKUP_COLUMN_MODEL = 'model'
LOOKUP_COLUMN_OPTIONS = 'options'
LOOKUP_HEADERS = [LOOKUP_COLUMN_ALGO, LOOKUP_COLUMN_MODEL, LOOKUP_COLUMN_OPTIONS]
