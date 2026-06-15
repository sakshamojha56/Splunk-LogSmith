"""Constants for SageMaker Integration with Splunk MLTK."""

import re

# Content types
CONTENT_TYPE_JSON = 'application/json'
CONTENT_TYPE_JSONLINES = 'application/jsonlines'
CONTENT_TYPE_CSV = 'text/csv'
CONTENT_TYPE_PLAIN = 'text/plain'
CONTENT_TYPE_NPY = 'application/x-npy'
CONTENT_TYPE_PARQUET = 'application/x-parquet'
CONTENT_TYPE_PARQUET_ALT = 'application/parquet'
CONTENT_TYPE_LIBSVM = 'text/libsvm'
CONTENT_TYPE_LIBSVM_ALT = 'text/x-libsvm'
CONTENT_TYPE_RECORDIO = 'application/x-recordio-protobuf'

JSON_CONTENT_TYPES = [CONTENT_TYPE_JSON, CONTENT_TYPE_JSONLINES]
BINARY_CONTENT_TYPES = [
    CONTENT_TYPE_NPY,
    CONTENT_TYPE_PARQUET,
    CONTENT_TYPE_PARQUET_ALT,
    CONTENT_TYPE_RECORDIO,
]
TEXT_CONTENT_TYPES = [
    CONTENT_TYPE_CSV,
    CONTENT_TYPE_PLAIN,
    CONTENT_TYPE_LIBSVM,
    CONTENT_TYPE_LIBSVM_ALT,
]

# Pattern types
PATTERN_POSITIONAL = 'positional'
PATTERN_NAMED = 'named'
PATTERN_NESTED = 'nested'
PATTERN_NESTED_OBJECT = 'nested_object'
PATTERN_NESTED_POSITIONAL = 'nested_positional'
PATTERN_DEFAULT = 'default'
PATTERN_SIMPLE = 'simple'

BATCH_INDICATOR = '[*]'
NESTED_DOT_INDICATOR = '.'
POSITIONAL_BRACKET_START = '['
POSITIONAL_BRACKET_END = ']'

# Regex patterns
REGEX_ROOT_ARRAY = re.compile(r'^\[\*\]')
REGEX_NESTED_POSITIONAL = re.compile(r'^(.+)\[(\d+)\]$')
REGEX_SINGLE_POSITIONAL = re.compile(r'^(\w+)\[(\d+)\]$')
REGEX_PURE_POSITIONAL = re.compile(r'^\[(\d+)\]$')

# AWS configuration
AWS_SESSION_NAME_PREFIX = "aitk_sagemaker_session"
AWS_REQUIRED_FIELDS = ['region', 'access_key_id', 'secret_access_key', 'role_arn']
AWS_CREDENTIALS_DURATION_SECONDS = 3600  # 1 hour
BOTO_CONNECT_TIMEOUT = 5
BOTO_READ_TIMEOUT = 600  # 10 minutes for long-running inference
BOTO_MAX_RETRIES = 3

# Model management
SAGEMAKER_LOOKUP_PREFIX = "__mlspl_sagemaker_"
SAGEMAKER_PROVIDER_PREFIX = "sagemaker_"
REQUIRED_PAYLOAD_FIELDS = [
    'endpoint_name',
    'model_name',
    'aws_credentials',
    'input_feature_map',
    'output_prediction_map',
    'openapi_spec',
]

MODEL_ALGO_NAME = 'sagemaker_custom_model'
MODEL_RUNTIME = 'sagemaker'
MODEL_TYPE = 'sagemaker_model'
MODEL_TYPE_CLASSES = ['sagemaker.SageMakerModel', 'SageMakerModel']
SAGEMAKER = [MODEL_RUNTIME]

# OpenAPI specification
OPENAPI_VERSION_PREFIX = '3.0'
SAGEMAKER_INVOCATIONS_PATH = '/invocations'
SAGEMAKER_HTTP_METHOD = 'post'
HTTP_STATUS_SUCCESS = '200'
HTTP_STATUS_CREATED = '201'
HTTP_STATUS_ACCEPTED = '202'
SUCCESS_STATUS_CODES = [HTTP_STATUS_SUCCESS, HTTP_STATUS_CREATED, HTTP_STATUS_ACCEPTED]

# DataFrame columns
MLTK_INTERNAL_COLUMN_PREFIX = "__mv_"
DEFAULT_PREDICTION_COLUMN = 'predictions'
DEFAULT_ERROR_COLUMN = 'error'

# Validation messages
ERROR_MISSING_FIELD = "Missing required field: '{}'"
ERROR_EMPTY_FIELD = "Field '{}' cannot be empty"
ERROR_INVALID_TYPE = "Field '{}' must be {}, got {}"
ERROR_INVALID_MODEL_NAME = "Invalid model name: '{}'. Must contain only alphanumeric characters, hyphens, and underscores"
ERROR_DUPLICATE_MODEL = (
    "SageMaker model '{}' already exists. Please use a different model name."
)
ERROR_COLUMN_CONFLICT = "Column name conflicts detected: {}. Input DataFrame column names cannot match output DataFrame column names"

CONTEXT_INPUT_FEATURE_MAP = "input_feature_map"
CONTEXT_OUTPUT_PREDICTION_MAP = "output_prediction_map"
CONTEXT_AWS_CREDENTIALS = "aws_credentials"
CONTEXT_OPENAPI_SPEC = "openapi_spec"

# Logging messages
LOG_BATCH_MODE = "Batch mode: received response from endpoint"
LOG_SINGLE_MODE = "Single-record mode: invoking endpoint {} times"
LOG_VALIDATOR_INIT = "Validator initialized from {} (mode: {})"

# File extensions
LOOKUP_FILE_EXTENSION = '.csv'
TEMP_FILE_SUFFIX = '.tmp'
JSON_FILE_EXTENSION = '.json'

# Lookup table format
LOOKUP_COLUMN_ALGO = 'algo'
LOOKUP_COLUMN_MODEL = 'model'
LOOKUP_COLUMN_OPTIONS = 'options'
LOOKUP_HEADERS = [LOOKUP_COLUMN_ALGO, LOOKUP_COLUMN_MODEL, LOOKUP_COLUMN_OPTIONS]

# Supported patterns
SUPPORTED_PATTERNS = [
    "1. parent[*].property - Batch named: instances[*].cpu_usage",
    "2. [*].property - Batch root named: [*].cpu_usage",
    "3. parent[*][N] - Batch positional: instances[*][0]",
    "4. [*][N] - Batch root positional: [*][0]",
    "5. parent[N] - Single-record positional: instances[0]",
    "6. nested.path.property - Single-record nested: data.transaction.amount",
    "7. parent[*].nested.path.property - Batch nested object: instances[*].features.cpu_usage",
    "8. parent[*].nested.path[N] - Batch nested positional: instances[*].features[0]",
]

PATTERN_EXAMPLES = {
    'batch_named': 'instances[*].cpu_usage',
    'batch_root': '[*].cpu_usage',
    'batch_positional': 'instances[*][0]',
    'single_positional': 'instances[0]',
    'single_nested': 'data.transaction.amount',
    'batch_nested_object': 'instances[*].features.cpu_usage',
    'batch_nested_positional': 'instances[*].features[0]',
}

# Limits and constraints
MODEL_NAME_MIN_LENGTH = 1
MODEL_NAME_MAX_LENGTH = 256
MIN_DATAFRAME_ROWS = 1
SAGEMAKER_MAX_PAYLOAD_SIZE_MB = 6
MAX_NESTED_PATH_DEPTH = 10

# Authorization & capabilities
SAGEMAKER_TEST_CONNECTION_CAPABILITIES = ['edit_endpoints']
SAGEMAKER_REGISTER_MODEL_CAPABILITIES = [
    'edit_endpoints',
    'edit_storage_passwords',
    'list_storage_passwords',
]
SAGEMAKER_APPLY_MODEL_CAPABILITIES = ['list_storage_passwords']
SAGEMAKER_ADMIN_ROLES = ['mltk_admin', 'sc_admin']

SAGEMAKER_SECRETS_REALM = "aitk_sagemaker_realm"
