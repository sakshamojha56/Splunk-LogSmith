from collections import OrderedDict
from util.rest_url_util import make_splunk_url, make_kvstore_url
from util.rest_proxy import rest_proxy_from_searchinfo
from datetime import datetime, timedelta, timezone
import cexc, json
import base64
import secrets
import requests, time, traceback
import platform
from urllib.parse import urlparse
from typing import Optional

from util.py_executable_bouncer import exec_anaconda_bouncer
from util.base_util import get_system_paths, SUPPORTED_SYSTEMS
import os
import json
from ai_commander.constants import MLTK_APP_NAME, PROVIDERS

import sys

sa_path, system = get_system_paths()

system_path = os.path.join(sa_path, 'bin', '%s' % (SUPPORTED_SYSTEMS[system]))

APP_NAME = f"Splunk_SA_Scientific_Python_{SUPPORTED_SYSTEMS[system]}"
SPLUNK_HOME = os.environ.get('SPLUNK_HOME', '/opt/splunk')
APP_PATH = os.path.join(SPLUNK_HOME, 'etc', 'apps', APP_NAME)
APP_LIB_PATH = os.path.join(APP_PATH, "lib")
sys.path.append(APP_LIB_PATH)


from splunklib.client import Service
from splunklib.binding import HTTPError as SplunkHTTPError

PY_FILE = "psc_boto_funcs.py"
logger = cexc.get_logger(__name__)
messages = cexc.get_messages_logger()


def encode_model_key(name: str) -> str:
    encoded_bytes = name.encode('utf-8')
    hex_encoded = encoded_bytes.hex()
    return hex_encoded


def decode_model_key(encoded_name: str) -> str:
    try:
        decoded_hex = bytes.fromhex(encoded_name).decode('utf-8')
        try:
            decoded_base64 = base64.b64decode(decoded_hex).decode('utf-8')
            return decoded_base64
        except Exception as e:
            return decoded_hex
    except ValueError:
        DOT_REPLACEMENT = "__DOT__"
        return encoded_name.replace(DOT_REPLACEMENT, '.')


def reorder_dict(d: dict, preferred_keys: list) -> OrderedDict:
    ordered = OrderedDict()
    for key in preferred_keys:
        if key in d:
            ordered[key] = d[key]
    for key in d:
        if key not in ordered:
            ordered[key] = d[key]
    return ordered


def reorder_model_config(model_config: dict) -> OrderedDict:
    return reorder_dict(
        model_config,
        [
            "response_variability",
            "maximum_result_rows",
            "max_tokens",
            "set_as_default",
        ],
    )


def reorder_provider_keys(document: dict) -> OrderedDict:
    return reorder_dict(
        document,
        PROVIDERS,
    )


def reorder_bedrock_fields(provider_fields: dict) -> OrderedDict:
    return reorder_dict(
        provider_fields,
        [
            "region",
            "aws_access_key_id",
            "aws_access-token",
            "role_arn",
            "request_timeout",
            "is_saved",
            "models",
        ],
    )


def normalize_model_keys_for_storage(document: dict) -> dict:
    for provider in document:
        if isinstance(document[provider], dict):
            provider_fields = document[provider]
            reordered_fields = OrderedDict()
            encoded_models = None

            if 'models' in provider_fields:
                models = provider_fields['models']
                encoded_models = OrderedDict()
                for model_name, config in models.items():
                    encoded_models[encode_model_key(model_name)] = config

            for key, value in provider_fields.items():
                if key == 'models' and encoded_models is not None:
                    reordered_fields[key] = encoded_models
                else:
                    reordered_fields[key] = value

            document[provider] = reordered_fields
    return document


def denormalize_model_keys_for_ui(document: dict) -> dict:
    for provider in document:
        if isinstance(document[provider], dict):
            provider_fields = document[provider]
            decoded_models = None

            if 'models' in provider_fields:
                models = provider_fields['models']
                decoded_models = OrderedDict()
                for model_name, config in models.items():
                    decoded_key = decode_model_key(model_name)
                    decoded_models[decoded_key] = reorder_model_config(config)

            if provider == "Bedrock":
                reordered_provider = reorder_bedrock_fields(provider_fields)
                if decoded_models is not None:
                    reordered_provider['models'] = decoded_models
            else:
                reordered_provider = OrderedDict()
                for key, value in provider_fields.items():
                    if key == 'models' and decoded_models is not None:
                        reordered_provider[key] = decoded_models
                    else:
                        reordered_provider[key] = value

            document[provider] = reordered_provider

    return reorder_provider_keys(document)


# Create KV store collection
def create_kv_store_collection(searchinfo: dict, collection_name: str) -> bool:
    """
    Creates a KV store collection in Splunk.

    Args:
        searchinfo (dict):
            The search information containing authentication details.
        collection_name (str):
            The name of the KV store collection to create.

    Returns:
        bool:
            True if the collection was created or already exists, otherwise raises an exception.
    """
    rest_proxy = rest_proxy_from_searchinfo(searchinfo)
    url = make_splunk_url(
        rest_proxy, namespace="app", extra_url_parts=["storage", "collections", "config"]
    )

    data = {"name": collection_name}
    result = rest_proxy.make_rest_call('POST', url + "?output_mode=json", postargs=data)
    status_code = int(result["status"])
    if status_code == 201:
        logger.debug(
            "KV store collection created successfully in collection {}".format(collection_name)
        )
    elif status_code == 409:
        logger.debug("KV store collection '{}' already exists.".format(collection_name))
    else:
        logger.error(str(traceback.format_exc()))
        raise Exception(
            "Failed to create KV store collection: {}".format(result.get('error_type', ''))
        )

    return True


# Get KV store collection
def get_kv_store_collection(searchinfo: dict, collection_name: str) -> bool:
    """
    Retrieves information about a KV store collection.

    Args:
        searchinfo (dict):
            The search information containing authentication details.
        collection_name (str):
            The name of the KV store collection to retrieve.

    Returns:
        bool:
            True if the collection exists, False otherwise.
    """
    rest_proxy = rest_proxy_from_searchinfo(searchinfo)
    url = make_splunk_url(
        rest_proxy,
        namespace="app",
        extra_url_parts=["storage", "collections", "config", collection_name],
    )
    result = rest_proxy.make_rest_call('GET', url + "?output_mode=json")
    status_code = int(result["status"])
    if status_code == 200:
        logger.debug("KV store collection '{}' retrieved successfully.".format(collection_name))
        return True
    else:
        return False


# Get documents from KV store
def get_documents_from_kv_store(searchinfo: dict, collection_name: str) -> dict:
    """
    Retrieves documents from a KV store collection.

    Args:
        searchinfo (dict):
            The search information containing authentication details.
        collection_name (str):
            The name of the KV store collection.

    Returns:
    """
    providers = dict()
    searchinfo["app"] = MLTK_APP_NAME
    rest_proxy = rest_proxy_from_searchinfo(searchinfo)
    url = make_kvstore_url(rest_proxy, namespace="app", collection=collection_name)
    result = rest_proxy.make_rest_call('GET', url + "?output_mode=json")
    status_code = int(result["status"])
    logger.debug("The status_code from get_documents_from_kv_store is: {}".format(status_code))
    retrieved_documents = json.loads(result["content"], object_pairs_hook=OrderedDict)
    if len(retrieved_documents) > 0:
        document = retrieved_documents[0]
        document = denormalize_model_keys_for_ui(document)
        providers = document
    return providers


# Upsert documents into KV store
# @run_in_background
def upsert_documents_into_kv_store(
    searchinfo: dict, collection_name: str, documents: dict
) -> bool:
    """
    Inserts or updates a document in a KV store collection.

    Args:
        searchinfo (dict):
            The search information containing authentication details.
        collection_name (str):
            The name of the KV store collection.
        documents (dict):
            The document data to insert or update.

    Returns:
        bool:
            True if the document was successfully inserted or updated, False otherwise.
    """
    providers = get_documents_from_kv_store(searchinfo, collection_name)
    rest_proxy = rest_proxy_from_searchinfo(searchinfo)
    url = make_kvstore_url(rest_proxy, namespace="app", collection=collection_name)

    documents = normalize_model_keys_for_storage(documents)
    if providers:
        url = url + f"/{providers['_key']}"

    documents.pop("_key", None)
    documents.pop("_user", None)
    json_payload = json.dumps(documents)

    try:
        result = rest_proxy.make_rest_call(
            'POST', url + "?output_mode=json", jsonargs=json_payload
        )
    except Exception as e:
        logger.error(str(traceback.format_exc()))
        logger.error(f"Exception in upsert_documents_into_kv_store: {e}")
        return False

    status_code = int(result.get("status", 500))

    if status_code in (200, 201):
        logger.debug("Document inserted successfully")
        return True
    else:
        logger.debug(
            "Failed to insert document, Response: {}".format(
                result.get("content", "No content")
            )
        )
        return False


def get_current_user_roles(searchinfo: dict) -> list:
    """
    Retrieves the roles assigned to the current user.

    Args:
        searchinfo (dict):
            The search information containing authentication details.

    Returns:
        list:
            A list of roles assigned to the user.
    """
    roles = []
    rest_proxy = rest_proxy_from_searchinfo(searchinfo)
    url = rest_proxy.splunkd_uri + "/services/authentication/current-context"
    result = rest_proxy.make_rest_call('GET', url + "?output_mode=json")
    status_code = int(result["status"])
    if status_code == 200:
        roles = json.loads(result["content"])["entry"][0]["content"]["roles"]
    return roles


def get_timezone_from_current_context(searchinfo: dict) -> Optional[str]:
    """
    Return the IANA timezone name from ``tz`` in ``/services/authentication/current-context``.

    Returns None if the endpoint fails, has no entry, or ``tz`` is missing/empty.
    Does not run SPL.
    """
    if not searchinfo:
        return None
    splunkd_uri = searchinfo.get("splunkd_uri")
    session_key = searchinfo.get("session_key")
    if not splunkd_uri or not session_key:
        return None
    try:
        rest_proxy = rest_proxy_from_searchinfo(searchinfo)
        url = rest_proxy.splunkd_uri + "/services/authentication/current-context"
        result = rest_proxy.make_rest_call("GET", url + "?output_mode=json")
        status_code = int(result["status"])
        if status_code != 200:
            return None
        payload = json.loads(result["content"])
        entries = payload.get("entry") or []
        if not entries:
            return None
        tz_val = entries[0].get("content", {}).get("tz")
        if isinstance(tz_val, str) and tz_val.strip():
            return tz_val.strip()
    except Exception as e:
        logger.debug("get_timezone_from_current_context: %s", e)
    return None


def get_user_roles(searchinfo: dict, username: str, with_admin_token: bool = False) -> list:
    """
    Retrieves the roles assigned to a specific user using system token.

    Args:
        searchinfo (dict):
            The search information containing authentication details.
        username (str):
            The username to get roles for.
        with_admin_token (bool):
            If True, uses admin session key for system-level access. Defaults to True.

    Returns:
        list:
            A list of roles assigned to the user.
    """
    roles = []
    rest_proxy = rest_proxy_from_searchinfo(searchinfo, with_admin_token=with_admin_token)
    url = rest_proxy.splunkd_uri + f"/services/authentication/users/{username}"
    result = rest_proxy.make_rest_call('GET', url + "?output_mode=json")
    status_code = int(result["status"])
    if status_code == 200:
        roles = json.loads(result["content"])["entry"][0]["content"]["roles"]
    return roles


def handle_secrets(
    searchinfo: dict,
    provider: str,
    token: str = None,
    type: str = "SELECT",
    realm: str = "mltk_llm_tokens",
    with_admin_token: bool = False,
) -> dict:
    """
    Manages secrets for LLM providers in Splunk.

    Args:
        searchinfo (dict):
            The search information containing authentication details.
        provider (str):
            The LLM provider name.
        token (str, optional):
            The provider's access token. Required for CREATE and UPDATE operations.
        type (str, optional):
            The operation type (CREATE, SELECT, UPDATE, DELETE). Defaults to "SELECT".
        with_admin_token (bool, optional):
            If True, uses admin session key for system-level access. Defaults to False.

    Returns:
        dict:
            The response from the REST API containing the result of the operation.
    """
    payload = dict()
    response = None

    if type not in ["CREATE", "SELECT", "UPDATE", "DELETE"]:
        response = {"status": 500, "message": "Supported types are CREATE|SELECT|UPDATE|DELETE"}
    else:
        rest_proxy = rest_proxy_from_searchinfo(searchinfo, with_admin_token=with_admin_token)
        url = make_splunk_url(
            rest_proxy, namespace="app", extra_url_parts=["storage", "passwords"]
        )

        if type == "SELECT":
            request_type = "GET"
            url = url + "/" + realm + ":" + provider
        elif type == "CREATE":
            request_type = "POST"
            payload = {
                "name": provider,
                "password": token,
                "realm": realm,
            }
        elif type == "UPDATE":
            request_type = "POST"
            payload = {"password": token}
            url = url + "/" + realm + ":" + provider
        else:
            request_type = "DELETE"
            url = url + "/" + realm + ":" + provider

        try:
            result = rest_proxy.make_rest_call(
                request_type, url + "?output_mode=json", postargs=payload
            )
            status_code = int(result["status"])
            if status_code in (200, 201):
                data = json.loads(result["content"])
                entries = data["entry"]
                if len(entries) > 0:
                    response = entries[0]["content"]
                else:
                    response = {"status": status_code, "message": result.get("error_type", "")}
            else:
                response = {"status": status_code, "message": result.get("error_type", "")}
        except Exception as e:
            logger.error(traceback.format_exc())
            response = {
                "status": 500,
                "message": f"Exception during secret operation: {str(e)}",
            }

    return response


def execute_in_psc_compiler(data: dict) -> dict:
    """
    Executes a command in the PSC compiler.

    Args:
        data (dict):
            The data required for execution.

    Returns:
        dict:
            The output from the PSC compiler execution.
    """
    final_data = exec_anaconda_bouncer(
        script_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), PY_FILE),
        params=['update_aws_bedrock_config', json.dumps(data)],
    )
    return final_data


def get_tenant_and_hostname(service: Service):
    try:
        response = service.get("/services/server/scs/tenantinfo", output_mode="json")
        body = response["body"].read()
        json_res = json.loads(body)
        content = json_res.get("entry", [])[0].get("content", {})
        tenant = content.get("tenant")
        tenant_hostname = content.get("tenantHostname")

        if not tenant or not tenant_hostname:
            raise ValueError("Tenant or globalHostname missing in response")

        return tenant, tenant_hostname
    except Exception as e:
        raise RuntimeError(f"Failed to retrieve tenant info: {e}")


def generate_request_id() -> str:
    return secrets.token_hex(32)


def fetch_model_mapping(scs_token, url):
    request_id = generate_request_id()
    headers = {"Authorization": f"Bearer {scs_token}", "request_id": request_id}
    try:
        response = requests.request("GET", url, headers=headers, data='')
        response.raise_for_status()
        data = response.json()
        return {item["model_name"]: item["model_id"] for item in data}
    except Exception as e:
        logger.error(f"Failed to fetch model mapping: {e}")
        return {}


def read_splk_content(response):
    body = response["body"].read()
    try:
        json_res = json.loads(body)
        entries = json_res.get("entry", [])

        if not entries:
            raise RuntimeError(f"No entries found in response: {body}")

        entry = entries[0]
        return entry.get("content")

    except json.JSONDecodeError:
        raise RuntimeError(f"Unable to parse JSON entry: {body}")


def get_scs_token(system_scoped_service: Service):
    try:
        res = system_scoped_service.get(
            "/services/authorization/scs_tokens",
            principalId="slim",
            scope="tenant",
            output_mode="json",
        )
        content = read_splk_content(res)
        return content.get("scs_token")
    except SplunkHTTPError as e:
        raise RuntimeError(f"Failed to fetch SCS token: {e}")


def get_scs_token_from_session(searchinfo: dict) -> str:
    """
    Initializes a Splunk service from the session key and fetches the SCS token.

    Args:
        searchinfo (dict): Dictionary containing 'session_key' and other Splunk context.

    Returns:
        str: The retrieved SCS token.
    """
    session_key = searchinfo["session_key"]
    if not session_key:
        raise ValueError("Session key not found in searchinfo")

    splunkd_uri = searchinfo.get("splunkd_uri")
    if not splunkd_uri:
        raise ValueError("splunkd_uri not found in searchinfo")

    parsed_uri = urlparse(splunkd_uri)
    host = parsed_uri.hostname
    port = parsed_uri.port

    if not host or not port:
        raise ValueError(f"Invalid splunkd_uri format: {splunkd_uri}")

    service = Service(
        token=session_key,
        host=host,
        port=port,  # Default management port; adjust if needed
    )

    return get_scs_token(service)


def get_tentantinfo_from_session(searchinfo: dict):
    session_key = searchinfo["session_key"]
    if not session_key:
        raise ValueError("Session key not found in searchinfo")

    splunkd_uri = searchinfo.get("splunkd_uri")
    if not splunkd_uri:
        raise ValueError("splunkd_uri not found in searchinfo")

    # Parse the URL to extract host and port
    parsed_uri = urlparse(splunkd_uri)
    host = parsed_uri.hostname
    port = parsed_uri.port

    if not host or not port:
        raise ValueError(f"Invalid splunkd_uri format: {splunkd_uri}")

    service = Service(
        token=session_key,
        host=host,
        port=port,
    )
    return get_tenant_and_hostname(service)


def mask_sensitive_data(data: dict) -> dict:
    """
    Return a copy of the data with sensitive fields masked.
    """
    masked = dict(
        data
    )  # shallow copy is enough here; deeper nested masking can be added if needed

    # Mask known sensitive keys
    sensitive_keys = {"api_key", "Authorization", "authorization", "api_key", "key"}
    for key in sensitive_keys:
        if key in masked:
            masked[key] = "***MASKED***"

    # Mask nested keys in 'headers' or other nested dicts, if present
    if 'headers' in masked and isinstance(masked['headers'], dict):
        for hk in masked['headers']:
            if hk.lower() == 'authorization':
                masked['headers'][hk] = "***MASKED***"
    return masked


def get_scs_url(searchinfo):
    tenant, tenantHostName = get_tentantinfo_from_session(searchinfo)
    chat_models_url = (
        "https://" + tenantHostName + "/" + tenant + "/slim-api/v1alpha1/chat/models"
    )
    chat_completions_url = (
        "https://" + tenantHostName + "/" + tenant + "/slim-api/v1alpha1/chat/completions"
    )
    return chat_models_url, chat_completions_url


def get_scs_api_base_url(searchinfo) -> str:
    tenant, tenantHostName = get_tentantinfo_from_session(searchinfo)
    scs_api_url = "https://" + tenantHostName + "/" + tenant + "/slim-api/v1alpha1"
    return scs_api_url


def get_cached_scs_token(scs_token, scs_token_expiry, searchinfo) -> tuple:
    """
    Returns a cached SCS token if still valid, otherwise fetches a new one.
    Adds a 10-minute leeway before expiry to avoid edge cases.
    """
    now = datetime.now(timezone.utc)
    leeway = timedelta(minutes=20)

    if scs_token and scs_token_expiry and now < (scs_token_expiry - leeway):
        return scs_token, scs_token_expiry

    # Fetch new token and set expiry to 1 hour from now
    token = get_scs_token_from_session(searchinfo)
    scs_token = token
    scs_token_expiry = now + timedelta(hours=1)
    return token, scs_token_expiry


def get_raw_documents_from_kv_store(search_info: dict, collection_name: str) -> list:
    """
    Retrieves raw documents from a KV store collection.

    Args:
        search_info (dict):
            The search information containing authentication details.
        collection_name (str):
            The name of the KV store collection.

    Returns:
        dict:
            The raw documents retrieved from the collection.
    """
    search_info["app"] = MLTK_APP_NAME
    rest_proxy = rest_proxy_from_searchinfo(search_info)
    url = make_kvstore_url(rest_proxy, namespace="app", collection=collection_name)
    result = rest_proxy.make_rest_call('GET', url + "?output_mode=json")
    status_code = int(result["status"])
    if status_code != 200:
        logger.error(
            "Failed to retrieve documents from KV store collection '{}'. Status code: {}".format(
                collection_name, status_code
            )
        )
        raise RuntimeError(
            "Failed to retrieve documents from KV store collection '{}'. Status code: {}".format(
                collection_name, status_code
            )
        )
    retrieved_documents = json.loads(result["content"], object_pairs_hook=OrderedDict)
    return retrieved_documents


def get_raw_document_from_kv_store(
    search_info: dict,
    collection_name: str,
    document_key: Optional[str] = None,
    query: Optional[str] = None,
) -> dict:
    """
    Retrieves a specific document from a KV store collection by its key.

    Args:
        search_info (dict):
            The search information containing authentication details.
        collection_name (str):
            The name of the KV store collection.
        document_key (str):
            The key of the document to retrieve.
    Returns:
        dict:
            The document retrieved from the collection.
    """
    if query and document_key:
        raise Exception("Either of query or document_key is supported")
    search_info["app"] = MLTK_APP_NAME
    rest_proxy = rest_proxy_from_searchinfo(search_info)
    url_params = [("output_mode", "json")]
    if query:
        url_params.append(("query", query))
    url = make_kvstore_url(
        rest_proxy, namespace="app", collection=collection_name, extra_url_params=url_params
    )
    if document_key:
        url = url + f"/{document_key}"
    result = rest_proxy.make_rest_call('GET', url)
    status_code = int(result["status"])
    logger.debug("The status_code from get_document_from_kv_store is: {}".format(status_code))
    document = dict()
    if status_code == 200:
        document = json.loads(result["content"], object_pairs_hook=OrderedDict)
    return document


def upsert_single_document_into_kv_store(
    search_info: dict,
    collection_name: str,
    document: dict,
    document_key: Optional[str] = None,
    with_admin_token: bool = False,
) -> bool:
    """
    Inserts or updates a document in a KV store collection.

    Args:
        search_info (dict):
            The search information containing authentication details.
        collection_name (str):
            The name of the KV store collection.
        document (dict):
            The document data to insert or update.
        document_key (str, optional):
            The key of the document to update. If None, a new document will be created.

    Returns:
        bool:
            True if the document was successfully inserted or updated, False otherwise.
    """
    rest_proxy = rest_proxy_from_searchinfo(search_info, with_admin_token=with_admin_token)
    url = make_kvstore_url(rest_proxy, namespace="app", collection=collection_name)
    if document_key:
        url = url + f"/{document_key}"

    document.pop("_key", None)
    document.pop("_user", None)
    json_payload = json.dumps(document)

    try:
        result = rest_proxy.make_rest_call(
            'POST', url + "?output_mode=json", jsonargs=json_payload
        )
    except Exception as e:
        logger.error(str(traceback.format_exc()))
        logger.error(f"Exception in upsert_documents_into_kv_store: {e}")
        return False

    status_code = int(result.get("status", 500))

    if status_code in (200, 201):
        logger.debug("Document inserted successfully")
        return True
    else:
        logger.debug(
            "Failed to insert document, Response: {}".format(
                result.get("content", "No content")
            )
        )
        return False


def delete_document_from_kv_store(
    search_info: dict, collection_name: str, document_key: str, with_admin_token: bool = False
) -> bool:
    """
    Deletes a document from a KV store collection.

    Args:
        search_info (dict):
            The search information containing authentication details.
        collection_name (str):
            The name of the KV store collection.
        document_key (str):
            The key of the document to delete.
    """
    rest_proxy = rest_proxy_from_searchinfo(search_info, with_admin_token=with_admin_token)
    url = make_kvstore_url(rest_proxy, namespace="app", collection=collection_name)
    url = url + f"/{document_key}"

    try:
        result = rest_proxy.make_rest_call('DELETE', url + "?output_mode=json")
    except Exception as e:
        logger.error(str(traceback.format_exc()))
        logger.error(f"Exception in delete_document_from_kv_store: {e}")
        return False

    status_code = int(result.get("status", 500))

    if status_code == 200:
        logger.debug("Document deleted successfully")
        return True
    else:
        logger.debug(
            "Failed to delete document, Response: {}".format(
                result.get("content", "No content")
            )
        )
        return False


def delete_documents_from_kv_store_by_query(
    search_info: dict, collection_name: str, query: str, with_admin_token: bool = False
) -> bool:
    """
    Deletes all documents matching a query from a KV store collection in a single API call.

    Args:
        search_info (dict):
            The search information containing authentication details.
        collection_name (str):
            The name of the KV store collection.
        query (str):
            A JSON-formatted query string to match documents for deletion.
            Example: '{"name": "my_connection"}'
        with_admin_token (bool):
            Whether to use admin token for authentication.

    Returns:
        bool: True if deletion was successful, False otherwise.
    """
    rest_proxy = rest_proxy_from_searchinfo(search_info, with_admin_token=with_admin_token)
    url_params = [("output_mode", "json"), ("query", query)]
    url = make_kvstore_url(
        rest_proxy, namespace="app", collection=collection_name, extra_url_params=url_params
    )

    try:
        result = rest_proxy.make_rest_call('DELETE', url)
    except Exception as e:
        logger.error(str(traceback.format_exc()))
        logger.error(f"Exception in delete_documents_from_kv_store_by_query: {e}")
        return False

    status_code = int(result.get("status", 500))

    if status_code == 200:
        logger.debug(f"Documents matching query '{query}' deleted successfully")
        return True
    else:
        logger.debug(
            "Failed to delete documents by query, Response: {}".format(
                result.get("content", "No content")
            )
        )
        return False
