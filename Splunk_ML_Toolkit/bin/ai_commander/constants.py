PAYLOAD = 'payload'
DEFAULT_MAX_TOKENS = 2000
DEFAULT_TEMPERATURE = 0.5
DEFAULT_TIMEOUT = 600
DEFAULT_ACCESS_TOKEN = "default_token"
STATUS = 'status'
STATUS_CODE = 'status_code'
SYSTEM_PROMPT = 'You are a helpful assistant'
RESPONSE_VARIABILITY = 'response_variability'
REQUEST_TIMEOUT = 'request_timeout'
VALUE = 'value'
MAX_RESULT_ROWS = 'maximum_result_rows'
ENDPOINT = 'endpoint'
SAVED = 'is_saved'
MODEL_SAVED = 'is_model_saved'
REGION = 'region'
ACCESS_KEY_ID = 'aws_access_key_id'
AZURE_OPENEAI_VERSION = 'azure_api_version'
BEDROCK_ACCESS_KEY = 'aws_access_token'
BEDROCK_ROLE = 'role_arn'
AWS_KEYS = 'aws_keys'
ACCESS_TOKEN = 'access_token'
PARAMS = 'params'
PROVIDER = 'provider'
GROQ = 'Groq'
GEMINI = 'Gemini'
OPENAI = 'OpenAI'
OLLAMA = 'Ollama'
CONNECTION_NAME = 'connection_name'
AZUREOPENAI = 'AzureOpenAI'
ANTHROPIC = 'Anthropic'
ANTHROPIC_API_VERSION = '2023-06-01'
MISTRALAI = 'MistralAI'
BEDROCK = 'Bedrock'
KB_ID = 'kb_id'
MAX_TOKENS = 'max_tokens'
SET_AS_DEFAULT = 'set_as_default'
CLEAR_PASSWORD = 'clear_password'
MODELS = 'models'
SPLUNK_HOSTED_LLM_TIMEOUT = 600
MAX_COMPLETION_TOKENS = 1000
TEMPERATURE = "temperature"
TIMEOUT = "timeout"
AUTHORIZATION = "Authorization"
MAX_OUTPUT_TOKENS = "maxOutputTokens"
PROVIDERS = [
    "Splunk Hosted Models",
    "OpenAI",
    "Anthropic",
    "AzureOpenAI",
    "Groq",
    "Gemini",
    "Bedrock",
    "Ollama",
]
MLTK_APP_NAME = 'Splunk_ML_Toolkit'
SPLUNK_HOSTED_LLM = 'Splunk Hosted Models'
COLLECTION_NAME = 'mltk_ai_commander_collection'
ERROR_MESSAGE = 'Request to the LLM has failed. Please check the provided Connection Management configuration settings.'
LLM_EXCEPTION_LIST = [
    "Authentication failed: Incorrect API key provided. Please check your API key.",
    "The specified model is either unavailable or not supported for the selected API version or method. Please verify the model name and your API version.",
    "Prompt length too long. Please reduce the length of the prompt.",
    "Empty response content received from the server.",
    "The provided model is not accessible by the bedrock account",
    "On-demand usage isn't supported for the selected model. Please choose a supported model.",
    "You exceeded your current quota, please check your plan and billing details.",
    "TimeoutError - Request timed out",
    ERROR_MESSAGE,
]
AI_COMMANDER_ROLES = ['mltk_admin']
AI_COMMANDER_COMMAND_CAPABILITIES = ['apply_ai_commander_command']
AI_COMMANDER_EDIT_CONFIG_CAPABILITIES = ['edit_ai_commander_config', 'list_ai_commander_config']
AI_COMMANDER_READ_CONFIG_CAPABILITIES = ['list_ai_commander_config']
CONTAINER_CONNECTION_CAPABILITIES = ['list_container_connections']
LLM_INTEGRATION_CONFIG = 'ai:LLMIntegrations'
AGENT_INTEGRATION_CONFIG = 'ai:AgentIntegrations'
ALLOWED_DOMAINS = 'ai:AllowedDomains'
MAX_RETRIES = 'max_retries'
BACKOFF_FACTOR = 'backoff_factor'
CONFIG_VERSION = '1.0'
DEFAULT_TOKEN = 'default_token'
AGENT_RUN_CAPABILITIES = ['run_agents']
AGENT_CONNECTION_CAPABILITIES = ['edit_agent_connections']
MCP_CONNECTION_CAPABILITIES = AGENT_CONNECTION_CAPABILITIES
KB_CONNECTION_CAPABILITIES = AGENT_CONNECTION_CAPABILITIES
LLM_CONNECTION_CAPABILITIES = AI_COMMANDER_READ_CONFIG_CAPABILITIES
AGENT_BUILDER_FEATURE_FLAG = 'aitk_agent_builder_feature_enabled'
AITK_LLM_CONNECTION_COLLECTION = "aitk_llm_connection"
AITK_DEFAULT_LLM_CONNECTION_MAPPING_COLLECTION = "aitk_llm_default_mappings"
AITK_LLM_SECRETS_REALM = "aitk_llm_secrets"
MAX_REQUEST_TIMEOUT = 600
DEFAULT_TOKENS_AGENTS = 5000
DEFAULT_RESPONSE_VARIABILITY = 0.7
MAXIMUM_RESULT_ROWS = 10
TOKEN_BASED_PROVIDERS = {
    "azureopenai",
    "openai",
    "anthropic",
    "groq",
    "gemini",
    "ollama",
}
CONFIG_DATA = '''{
  "llm_connections" : {
    "connection_type" : "LLM", 
    "metadata": { 
        "version": "",
        "created_at" : "",
        "modified_at": ""
    },
    "Splunk Hosted Models": {
      "is_saved": {
        "label": "is_saved",
        "value": false,
        "type": "boolean",
        "required": false,
        "description": "Is Provider details stored"
      },
      "models": {
      }
    },
    "OpenAI": {
      "endpoint": {
        "label": "Endpoint",
        "value": "https://api.openai.com/v1/chat/completions",
        "type": "string",
        "required": false,
        "description": "The URL endpoint to access the OpenAI API for processing chat completions."
      },
      "access_token": {
        "label": "Access Token",
        "value": "",
        "type": "string",
        "required": true,
        "hidden": true,
        "description": "The token used for authentication when accessing the OpenAI API."
      },
      "request_timeout": {
        "label": "Request Timeout",
        "value": 200,
        "type": "number",
        "required": true,
        "description": "The timeout duration for the request to the OpenAI."
      },
      "is_saved": {
        "label": "is_saved",
        "value": false,
        "type": "boolean",
        "required": false,
        "description": "Is Provider details stored"
      },
      "models": {
        "gpt-5": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-5-mini": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-5-nano": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-5-chat": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-5-chat-latest": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-5-2025-08-07": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-5-mini-2025-08-07": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-5-nano-2025-08-07": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-5-pro": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-5.2": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-5.2-2025-12-11": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-5.2-chat-latest": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-5.2-pro": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-5.2-pro-2025-12-11": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-5.1": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-5.1-codex": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-5.1-codex-mini": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-5.1-codex-max": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4.1": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4.1-mini": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4.1-nano": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "o4-mini": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "o3-mini": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "o3": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4o-mini": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4o": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-3.5-turbo": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "o1-mini": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "o1-preview": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4o-mini-2024-07-18": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4o-2024-08-06": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4o-2024-05-13": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4-turbo": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4-turbo-preview": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4-0125-preview": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4-1106-preview": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-3.5-turbo-1106": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-3.5-turbo-0301": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-3.5-turbo-0613": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-3.5-turbo-16k": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-3.5-turbo-16k-0613": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4-0314": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4-0613": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4-32k": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4-32k-0314": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4-32k-0613": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        }
      }
    },
    "Anthropic": {
      "endpoint": {
        "label": "Endpoint",
        "value": "https://api.anthropic.com/v1/messages",
        "type": "url",
        "required": false,
        "description": "The URL endpoint to access the OpenAI API for processing chat completions."
      },
      "access_token": {
        "label": "Access Token",
        "value": "",
        "type": "string",
        "required": true,
        "hidden": true,
        "description": "The token used for authentication when accessing the OpenAI API."
      },
      "request_timeout": {
        "label": "Request Timeout",
        "value": 200,
        "type": "number",
        "required": true,
        "description": "The timeout duration for the request to the OpenAI."
      },
      "is_saved": {
        "label": "is_saved",
        "value": false,
        "type": "boolean",
        "required": false,
        "description": "Is Provider details stored"
      },
      "models": {
        "claude-sonnet-4-5-20250929": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "claude-opus-4-20250514": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "claude-sonnet-4-20250514": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "claude-3-haiku-20240307": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "claude-2.1": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "claude-2": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "claude-instant-1.2": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "claude-instant-1": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        }
      }
    },
    "AzureOpenAI": {
      "endpoint": {
        "label": "Endpoint",
        "value": "https://openai-gpt-4-test-v-1.openai.azure.com/",
        "type": "url",
        "required": true,
        "description": "The API endpoint URL for accessing the Azure OpenAI service for generating chat completions."
      },
      "azure_api_version": {
        "label": "Azure Api Version",
        "value": "",
        "type": "string",
        "required": true,
        "hidden": false,
        "description": "The authentication token required to access Azure OpenAI services."
      },
      "access_token": {
        "label": "Access Token",
        "value": "",
        "type": "string",
        "required": true,
        "hidden": true,
        "description": "The authentication token required to access Azure OpenAI services."
      },
      "request_timeout": {
        "label": "Request Timeout",
        "value": 200,
        "type": "number",
        "required": true,
        "description": "The maximum duration (in seconds) before a request to Azure OpenAI times out."
      },
      "is_saved": {
        "label": "is_saved",
        "value": false,
        "type": "boolean",
        "required": false,
        "description": "Is Provider details stored"
      },
      "models": {
        "o1-mini": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "o1-preview": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-5": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4o-mini": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4o": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4-0314": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4-0613": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4-32k": {
         "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4-32k-0314": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4-32k-0613": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4-1106-preview": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-4-0125-preview": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-3.5-turbo": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-3.5-turbo-0301": {
         "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-3.5-turbo-0613": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-3.5-turbo-16k-0613": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gpt-3.5-turbo-16k": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        }
      }
    },
    "Groq": {
      "endpoint": {
        "label": "Endpoint",
        "value": "https://api.groq.com/openai/v1/chat/completions",
        "type": "url",
        "required": false,
        "description": "The API endpoint for sending chat completion requests to Groq's language models."
      },
      "access_token": {
        "label": "Access token",
        "value": "",
        "type": "string",
        "required": true,
        "hidden": true,
        "description": "The authentication token required to access Groq's API services."
      },
      "request_timeout": {
        "label": "Request Timeout",
        "value": 200,
        "type": "number",
        "required": false,
        "description": "The maximum duration (in seconds) before a request to Groq's API times out."
      },
      "is_saved": {
        "name": "is_saved",
        "value": false,
        "type": "boolean",
        "required": false,
        "description": "Is Provider details stored"
      },
      "models": {
        "llama3-8b-8192": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "llama3-70b-8192": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "mixtral-8x7b-32768": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemma2-9b-it": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "llama-3.1-8b-instant": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "llama-3.3-70b-versatile": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "llama2-70b-4096": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        }
      }
    },
    "Gemini": {
      "endpoint": {
        "label": "Endpoint",
        "value": "https://generativelanguage.googleapis.com/v1beta/models",
        "type": "url",
        "required": false,
        "description": "The API endpoint for sending chat completion requests to Google's Gemini language model."
      },
      "access_token": {
        "label": "Access Token",
        "value": "",
        "type": "string",
        "required": true,
        "hidden": true,
        "description": "The authentication token required to access the Gemini API."
      },
      "request_timeout": {
        "label": "Request Timeout",
        "value": 200,
        "type": "number",
        "required": false,
        "description": "The maximum duration (in seconds) before a request to the Gemini API times out."
      },
      "is_saved": {
        "label": "is_saved",
        "value": false,
        "type": "boolean",
        "required": false,
        "description": "Is Provider details stored"
      },
      "models": {
        "gemini-pro": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemini-2.5-flash": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemini-2.5-pro": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemini-2.0-flash-001": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemini-2.0-flash-lite-001": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemini-2.0-flash-lite": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemini-flash-lite-latest": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemini-pro-latest": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemini-2.5-flash-lite": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemini-2.5-flash-lite-preview-09-2025": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemini-3-flash-preview": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemini-1.5-pro-latest": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemini-2.0-flash": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemini-2.0-flash-exp": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemini-2.0-flash-lite-preview-02-05": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemini-exp-1206": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemini-flash-latest": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemini-2.5-flash-preview-09-2025": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemini-3-pro-preview": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemma-3-1b-it": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemma-3-4b-it": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemma-3-12b-it": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemma-3-27b-it": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemma-3n-e4b-it": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        },
        "gemma-3n-e2b-it": {
          "response_variability": {
            "label": "Response Variability",
            "value": 0,
            "type": "number",
            "required": true,
            "description": "Controls the randomness of responses, affecting creativity versus consistency."
          },
          "maximum_result_rows": {
            "label": "Maximum Result Rows",
            "value": 10,
            "type": "number",
            "required": false,
            "description": "The maximum number of result entries to retrieve in a response."
          },
          "max_tokens": {
            "label": "Max Tokens",
            "value": 2000,
            "type": "number",
            "required": false,
            "description": "The limit on the number of tokens that can be generated in a response."
          },
          "set_as_default": {
            "label": "Set as default",
            "value": false,
            "type": "checkbox",
            "required": false
          },
          "is_model_saved": {
            "label": "is_model_saved",
            "value": false,
            "type": "boolean",
            "required": false,
            "description": "Is Provider details stored"
          },
          "connection_name": {
            "label": "Connection Name",
            "value": "",
            "type": "string",
            "required": false,
            "description": "Is Provider details stored"
          }
        }
      }
    },
    "Bedrock": {
      "region": {
        "label": "region",
        "value": "",
        "type": "string",
        "required": true,
        "description": "The AWS region where Amazon Bedrock services are hosted."
      },
      "aws_access_key_id": {
        "label": "AWS Access Key Id",
        "value": "",
        "type": "string",
        "required": true,
        "hidden": true,
        "description": "The AWS access key ID used for authenticating requests to Amazon Bedrock."
      },
      "aws_access_token": {
        "label": "AWS Access Token",
        "value": "",
        "type": "string",
        "required": true,
        "hidden": true,
        "description": "The temporary AWS session token used for authentication with Amazon Bedrock."
      },
      "role_arn": {
        "label": "Role Arn",
        "value": "",
        "type": "string",
        "required": true,
        "hidden": true,
        "description": "The Amazon Resource Name (ARN) of the IAM role used for accessing Amazon Bedrock services."
      },
      "request_timeout": {
        "label": "Request Timeout",
        "value": 200,
        "type": "string",
        "required": false,
        "description": "The maximum duration (in seconds) before a request to Amazon Bedrock times out."
      },
      "is_saved": {
        "label": "is_saved",
        "value": false,
        "type": "boolean",
        "required": false,
        "description": "Is Provider details stored"
      },
      "models": {
      }
    },
    "Ollama": {
      "endpoint":  {
        "label": "Endpoint",
        "value": "http://localhost:11434/",
        "type": "url",
        "required": false,
        "description": "The API endpoint URL for connecting to the Ollama server."
      },
      "access_token": {
        "label": "Access Token",
        "value": "",
        "type": "string",
        "required": false,
        "hidden": true,
        "description": "The authentication token required for accessing the Ollama API."
      },
      "request_timeout": {
        "label": "Request Timeout",
        "value": 200,
        "type": "string",
        "required": false,
        "description": "The maximum duration (in seconds) before a request to the Ollama API times out."
      },
      "is_saved": {
        "label": "is_saved",
        "value": false,
        "type": "boolean",
        "required": false,
        "description": "Is Provider details stored"
      },
      "models": {
        
      }
    }
  }
}'''
