"""
Vertex AI model registration and management helpers.

Provides credential storage utilities and lookup-table helpers so that
Vertex endpoints can be registered in the same fashion as SageMaker models.
"""

import csv
import errno
import glob
import json
import os
from typing import Any, Dict, List, Optional, Tuple

import cexc
from ai_commander.constants import CLEAR_PASSWORD
from util import models_util
from util.ai_commander_util import handle_secrets
from util.base_util import get_etc_path, get_staging_area_path
from util.constants import MODEL_EXTENSION
from util.lookups_util import (
    file_name_to_path,
    get_lookup_file_from_searchinfo,
    lookup_name_to_path_from_splunk,
    parse_model_reply,
)
from util.param_util import is_valid_identifier
from util.rest_proxy import rest_proxy_from_searchinfo
from util.rest_url_util import get_user_capabilities, make_get_lookup_url, make_splunk_url
from util.sagemaker_util_extensions import create_error_response

from vertex_int.constants import (
    LOOKUP_HEADERS,
    VERTEX_LOOKUP_PREFIX,
    VERTEX_MODEL_ALGO_NAME,
    VERTEX_MODEL_RUNTIME,
    VERTEX_MODEL_TYPE,
    VERTEX_MODEL_TYPE_CLASSES,
    VERTEX_PROVIDER_PREFIX,
    VERTEX_SECRETS_REALM,
)

logger = cexc.get_logger(__name__)


def _response_status_code(response: Dict[str, Any], default: Optional[int] = 200):
    status = response.get('status', default)
    try:
        return int(status)
    except (TypeError, ValueError):
        return status


def _is_successful_secret_response(response: Dict[str, Any]) -> bool:
    return 'username' in response or _response_status_code(response) in [200, 201]


def _vertex_credentials_storage_error_message(reason: str) -> str:
    if reason.startswith('Failed to store GCP credentials'):
        return reason
    return f'Failed to store GCP credentials: {reason}'


def check_user_has_vertex_capabilities(
    searchinfo: Dict[str, Any], required_capabilities: List[str]
) -> bool:
    """Check if user has required capabilities for Vertex operations."""
    splunkd_uri = searchinfo.get('splunkd_uri')
    token = searchinfo.get('session_key')
    username = searchinfo.get('username')

    if not all([splunkd_uri, token, username]):
        logger.warning(
            "Incomplete searchinfo for capability check: "
            f"user={username}, has_uri={bool(splunkd_uri)}, has_token={bool(token)}"
        )
        return False

    try:
        user_capabilities = get_user_capabilities(splunkd_uri, token, username=username)
    except Exception as exc:
        logger.error(f"Error checking user capabilities: {exc}")
        return False

    has_all = all(cap in user_capabilities for cap in required_capabilities)
    if not has_all:
        missing = [cap for cap in required_capabilities if cap not in user_capabilities]
        logger.info(
            f"User '{username}' missing Vertex capabilities: {missing}. "
            f"Required: {required_capabilities}"
        )
    return has_all


def store_vertex_credentials(
    model_name: str, gcp_credentials: Dict[str, Any], searchinfo: Dict[str, Any]
) -> Optional[Dict[str, Any]]:
    """Persist GCP credentials for a Vertex model."""
    try:
        credentials_response = create_vertex_credentials_entry(
            model_name=model_name,
            gcp_credentials=gcp_credentials,
            searchinfo=searchinfo,
        )

        if _is_successful_secret_response(credentials_response):
            return None

        details = credentials_response.get('message') or 'Unknown error'
        return create_error_response(
            500,
            'Failed to store GCP credentials',
            _vertex_credentials_storage_error_message(details),
            details=details,
        )

    except Exception as exc:
        logger.error(f"Unable to store Vertex credentials for '{model_name}': {exc}")
        details = str(exc) or 'Unexpected error storing credentials'
        return create_error_response(
            500,
            'Failed to store GCP credentials',
            _vertex_credentials_storage_error_message(details),
            details=details,
        )


def delete_vertex_credentials(model_name: str, searchinfo: Dict[str, Any]) -> bool:
    """Delete stored Vertex credentials."""
    provider_name = f"{VERTEX_PROVIDER_PREFIX}{model_name}"
    try:
        response = handle_secrets(
            searchinfo=searchinfo,
            provider=provider_name,
            type="DELETE",
            realm=VERTEX_SECRETS_REALM,
        )
        status_code = _response_status_code(response)
        if status_code not in [200, 204, 404]:
            logger.warning(
                f"Failed to delete Vertex credentials for '{model_name}': status {response.get('status')}"
            )
            return False
        return True
    except Exception as exc:
        logger.error(f"Error deleting Vertex credentials for '{model_name}': {exc}")
        raise


def load_vertex_credentials(
    model_name: str, searchinfo: Dict[str, Any]
) -> Optional[Dict[str, Any]]:
    """Load stored Vertex credentials for rollback; return None when missing."""
    provider_name = f"{VERTEX_PROVIDER_PREFIX}{model_name}"
    response = handle_secrets(
        searchinfo=searchinfo,
        provider=provider_name,
        type="SELECT",
        realm=VERTEX_SECRETS_REALM,
    )

    if response is None:
        raise RuntimeError("Credential storage returned None")

    status_code = _response_status_code(response, default=None)
    if status_code == 404:
        return None
    if status_code and status_code not in [200, 201]:
        raise RuntimeError(response.get('message') or 'Unable to retrieve Vertex credentials')

    clear_password = response.get(CLEAR_PASSWORD, "")
    if not clear_password:
        raise RuntimeError("Stored Vertex credentials could not be read")

    try:
        return json.loads(clear_password)
    except ValueError as exc:
        raise RuntimeError("Stored Vertex credentials are not valid JSON") from exc


def restore_vertex_credentials(
    model_name: str, gcp_credentials: Dict[str, Any], searchinfo: Dict[str, Any]
) -> bool:
    """Restore Vertex credentials after a failed delete rollback."""
    provider_name = f"{VERTEX_PROVIDER_PREFIX}{model_name}"
    credentials_json = json.dumps(gcp_credentials)

    response = handle_secrets(
        searchinfo=searchinfo,
        provider=provider_name,
        token=credentials_json,
        type="UPDATE",
        realm=VERTEX_SECRETS_REALM,
    )

    if response is None:
        raise RuntimeError("Credential restore returned None")

    status_code = _response_status_code(response, default=None)
    if status_code == 404:
        response = handle_secrets(
            searchinfo=searchinfo,
            provider=provider_name,
            token=credentials_json,
            type="CREATE",
            realm=VERTEX_SECRETS_REALM,
        )
        if response is None:
            raise RuntimeError("Credential restore returned None")

    if _is_successful_secret_response(response):
        return True

    raise RuntimeError(response.get('message') or 'Unable to restore Vertex credentials')


def create_vertex_credentials_entry(
    model_name: str, gcp_credentials: Dict[str, Any], searchinfo: Dict[str, Any]
) -> Dict[str, Any]:
    """Create/update secure storage entry for Vertex credentials."""
    provider_name = f"{VERTEX_PROVIDER_PREFIX}{model_name}"
    credentials_json = json.dumps(gcp_credentials)

    response = handle_secrets(
        searchinfo=searchinfo,
        provider=provider_name,
        token=credentials_json,
        type="CREATE",
        realm=VERTEX_SECRETS_REALM,
    )

    if response is None:
        raise RuntimeError("Credential storage returned None")

    return response


def list_all_vertex_passwords(searchinfo: Dict[str, Any]) -> List[str]:
    """List all Vertex passwords stored in Splunk."""
    try:
        rest_proxy = rest_proxy_from_searchinfo(searchinfo)
        url = (
            make_splunk_url(
                rest_proxy, namespace="app", extra_url_parts=["storage", "passwords"]
            )
            + "?output_mode=json&count=0"
        )

        result = rest_proxy.make_rest_call("GET", url)
        if int(result["status"]) != 200:
            logger.warning(f"Failed to list Vertex passwords: status {result['status']}")
            return []

        data = json.loads(result["content"])
        model_names = [
            entry["content"]["username"][len(VERTEX_PROVIDER_PREFIX) :]
            for entry in data.get("entry", [])
            if entry.get("content", {}).get("realm") == VERTEX_SECRETS_REALM
            and entry.get("content", {}).get("username", "").startswith(VERTEX_PROVIDER_PREFIX)
        ]

        return model_names

    except Exception as exc:
        logger.error(f"Error listing Vertex passwords: {exc}")
        return []


def check_vertex_credentials_exist(model_name: str, searchinfo: Dict[str, Any]) -> bool:
    """Return True if secure storage already has credentials for a Vertex model."""
    provider_name = f"{VERTEX_PROVIDER_PREFIX}{model_name}"
    response = handle_secrets(
        searchinfo=searchinfo,
        provider=provider_name,
        type="SELECT",
        realm=VERTEX_SECRETS_REALM,
    )

    if response is None:
        raise RuntimeError(
            "Unable to verify whether Vertex credentials already exist: empty response"
        )

    status = response.get('status')
    try:
        status_code = int(status) if status is not None else None
    except (TypeError, ValueError):
        status_code = None
    if status_code == 404:
        return False
    if status_code and status_code not in [200, 201]:
        raise RuntimeError(
            "Unable to verify whether Vertex credentials already exist: "
            f"{response.get('message', 'Unknown error')}"
        )

    return (
        response.get('username') == provider_name
        and response.get('realm') == VERTEX_SECRETS_REALM
    ) or 'clear_password' in response


def cleanup_orphaned_vertex_passwords(
    searchinfo: Dict[str, Any], existing_model_names: List[str]
) -> Dict[str, Any]:
    """Clean up orphaned Vertex passwords without corresponding lookup files."""
    results = {"deleted_count": 0, "deleted_models": [], "failed_models": []}

    try:
        all_passwords = list_all_vertex_passwords(searchinfo)
        orphaned = set(all_passwords) - set(existing_model_names)

        if not orphaned:
            return results

        for model_name in orphaned:
            try:
                response = handle_secrets(
                    searchinfo=searchinfo,
                    provider=f"{VERTEX_PROVIDER_PREFIX}{model_name}",
                    type="DELETE",
                    realm=VERTEX_SECRETS_REALM,
                )

                if response.get('status', 200) in [200, 204]:
                    results["deleted_count"] += 1
                    results["deleted_models"].append(model_name)
                else:
                    results["failed_models"].append(model_name)
                    logger.warning(
                        f"Failed to delete orphaned Vertex credential '{model_name}': status {response.get('status')}"
                    )

            except Exception as exc:
                results["failed_models"].append(model_name)
                logger.error(f"Error deleting orphaned Vertex credential '{model_name}': {exc}")

        if results["deleted_count"] > 0 or results["failed_models"]:
            logger.info(
                f"Orphaned Vertex credentials cleanup: {results['deleted_count']} deleted, "
                f"{len(results['failed_models'])} failed ({len(all_passwords)} total, {len(orphaned)} orphaned)"
            )

    except Exception as exc:
        logger.error(f"Orphaned Vertex credential cleanup failed: {exc}")

    return results


def vertex_model_name_to_lookup(name: str, tmp: bool = False) -> str:
    """Convert a model name into the lookup filename used on disk."""
    if not isinstance(name, str):
        raise AssertionError(f"Model name must be string, got {type(name)}")

    safe_name = name.replace('-', '_').replace('.', '_')
    if not is_valid_identifier(safe_name):
        raise AssertionError(f"Invalid model name: {name}")

    suffix = '.tmp' if tmp else ''
    return f'{VERTEX_LOOKUP_PREFIX}{safe_name}{MODEL_EXTENSION}{suffix}'


def get_vertex_model_options_from_disk(
    model_name: str, searchinfo: Dict[str, Any], namespace: Optional[str] = None
) -> Tuple[str, str, Dict[str, Any]]:
    """Load Vertex model options from lookup."""
    lookup_name = vertex_model_name_to_lookup(model_name)
    file_path = lookup_name_to_path_from_splunk(
        lookup_name=model_name,
        file_name=lookup_name,
        searchinfo=searchinfo,
        namespace=namespace or 'user',
        lookup_type='model',
    )

    algo_name, model_data, model_options = models_util.load_algo_options_from_disk(
        file_path=file_path
    )
    return algo_name, model_data, model_options


def create_vertex_model_lookup_entry(
    model_name: str,
    model_config: Dict[str, Any],
    searchinfo: Optional[Dict[str, Any]] = None,
    namespace: Optional[str] = None,
    local: bool = False,
    tmp: bool = False,
    allow_overwrite: bool = False,
) -> Dict[str, Any]:
    """Create lookup entry for Vertex model configuration."""
    if not (tmp or local or allow_overwrite) and searchinfo:
        existing = check_vertex_model_exists(model_name, searchinfo, namespace=namespace)
        if existing:
            raise RuntimeError(
                f"Vertex model '{model_name}' already exists. Please use a different model name."
            )

    staging_dir = _ensure_staging_directory(model_name)
    lookup_name = vertex_model_name_to_lookup(model_name, tmp=tmp)
    lookup_file_path = file_name_to_path(lookup_name, staging_dir)

    _write_lookup_csv(lookup_file_path, model_config, searchinfo)

    if not (tmp or local):
        reply = models_util.move_model_file_from_staging(
            lookup_name, searchinfo, namespace or 'user', lookup_file_path
        )
        if not reply.get('success'):
            parse_model_reply(reply)
        return reply

    return {'success': True, 'message': f"Vertex model {model_name} registered successfully"}


def update_vertex_lookup_entry(
    model_name: str, model_config: Dict[str, Any], searchinfo: Dict[str, Any]
) -> Optional[Dict[str, Any]]:
    """Update Vertex model lookup entry by recreating it with new configuration."""
    lookup_response = create_vertex_model_lookup_entry(
        model_name=model_name,
        model_config=model_config,
        searchinfo=searchinfo,
        namespace='user',
        local=False,
        tmp=False,
        allow_overwrite=True,
    )

    if not lookup_response.get('success'):
        return create_error_response(
            500,
            'Failed to update model lookup entry',
            'Unable to update model configuration',
            details=lookup_response.get('message') or 'Unknown error',
        )
    return None


def delete_vertex_model_lookup_entry(
    model_name: str, searchinfo: Dict[str, Any], namespace: str = 'user'
) -> Dict[str, Any]:
    """Delete a Vertex model lookup entry from Splunk."""
    lookup_name = vertex_model_name_to_lookup(model_name)
    rest_proxy = rest_proxy_from_searchinfo(searchinfo)
    url = make_get_lookup_url(rest_proxy, namespace=namespace, lookup_file=lookup_name)
    reply = rest_proxy.make_rest_call('DELETE', url)
    return parse_model_reply(reply)


def find_vertex_model_lookup_references(
    model_name: str,
    searchinfo: Dict[str, Any],
    exclude_current_user: bool = False,
) -> List[str]:
    """Find local Vertex lookup files that still reference a model name."""
    lookup_name = vertex_model_name_to_lookup(model_name)
    app_name = searchinfo.get('app') or 'Splunk_ML_Toolkit'
    etc_path = get_etc_path()
    patterns = [
        os.path.join(etc_path, 'users', '*', app_name, 'lookups', lookup_name),
        os.path.join(etc_path, 'apps', app_name, 'lookups', lookup_name),
    ]

    references: List[str] = []
    for pattern in patterns:
        references.extend(glob.glob(pattern))

    if exclude_current_user:
        username = searchinfo.get('username')
        if username:
            current_user_lookup = os.path.normpath(
                os.path.join(etc_path, 'users', username, app_name, 'lookups', lookup_name)
            )
            references = [
                reference
                for reference in references
                if os.path.normpath(reference) != current_user_lookup
            ]

    return sorted(set(references))


def update_vertex_mapping_fields_only(
    model_name: str,
    input_feature_map: Dict[str, Any],
    output_prediction_map: Dict[str, Any],
    openapi_spec: Dict[str, Any],
    searchinfo: Dict[str, Any],
    batch_size: Optional[int] = None,
) -> Optional[Dict[str, Any]]:
    """Update mapping fields and batch size for a Vertex model."""
    try:
        _, _, model_options = get_vertex_model_options_from_disk(
            model_name=model_name, searchinfo=searchinfo, namespace='user'
        )

        model_options['input_feature_map'] = input_feature_map
        model_options['output_prediction_map'] = output_prediction_map
        model_options['openapi_spec'] = openapi_spec

        if batch_size is not None:
            model_options['batch_size'] = batch_size

        feature_variables = list(input_feature_map.keys()) if input_feature_map else []
        target_variables = list(output_prediction_map.values()) if output_prediction_map else []
        model_options['feature_variables'] = feature_variables
        model_options['target_variable'] = target_variables

        model_config = {
            'model_name': model_options.get('model_name'),
            'endpoint_name': model_options.get('endpoint_name'),
            'description': model_options.get('description'),
            'input_feature_map': input_feature_map,
            'output_prediction_map': output_prediction_map,
            'openapi_spec': openapi_spec,
            'batch_size': model_options.get('batch_size'),
        }

        return update_vertex_lookup_entry(model_name, model_config, searchinfo)

    except Exception as exc:
        logger.error(
            f"Failed to update configuration fields for Vertex model '{model_name}': {exc}"
        )
        return create_error_response(
            500,
            'Failed to update configuration fields',
            f"Unable to update model '{model_name}'",
            details=str(exc),
        )


def check_vertex_model_exists(
    model_name: str, searchinfo: Dict[str, Any], namespace: Optional[str] = None
) -> bool:
    """Return True if a lookup already exists for the Vertex model."""
    try:
        lookup_name = vertex_model_name_to_lookup(model_name)
        reply = get_lookup_file_from_searchinfo(
            file_name=lookup_name, searchinfo=searchinfo, namespace=namespace or 'user'
        )
        return reply.get('success', False)
    except Exception:
        return False


def _ensure_staging_directory(model_name: str) -> str:
    """Ensure the staging directory exists and return absolute path."""
    try:
        staging_dir = get_staging_area_path()
        if not os.path.isdir(staging_dir):
            os.makedirs(staging_dir)
        return staging_dir
    except OSError as exc:
        if exc.errno == errno.EEXIST and os.path.isdir(staging_dir):
            return staging_dir
        raise Exception(
            f"Error creating staging directory for Vertex model: {model_name}, {exc}"
        )


def _write_lookup_csv(
    file_path: str, model_config: Dict[str, Any], searchinfo: Optional[Dict[str, Any]]
) -> None:
    """Write lookup CSV containing Vertex model metadata."""
    input_feature_map = model_config.get('input_feature_map', {})
    output_prediction_map = model_config.get('output_prediction_map', {})

    feature_variables = list(input_feature_map.keys()) if input_feature_map else ""
    target_variables = list(output_prediction_map.values()) if output_prediction_map else ""

    metadata = {
        'searchinfo': {
            'app': searchinfo.get('app') if searchinfo else None,
            'username': searchinfo.get('username') if searchinfo else None,
        }
    }

    options = {
        'model_name': model_config.get('model_name'),
        'endpoint_name': model_config.get('endpoint_name'),
        'description': model_config.get('description'),
        'algo_name': VERTEX_MODEL_ALGO_NAME,
        'runtime': VERTEX_MODEL_RUNTIME,
        'feature_variables': feature_variables,
        'target_variable': target_variables,
        'input_feature_map': input_feature_map,
        'output_prediction_map': output_prediction_map,
        'openapi_spec': model_config.get('openapi_spec', {}),
        'batch_size': model_config.get('batch_size'),
        'metadata': metadata,
    }

    model_data = {
        'model_name': model_config.get('model_name'),
        'endpoint_name': model_config.get('endpoint_name'),
        'type': VERTEX_MODEL_TYPE,
        '__mlspl_type': VERTEX_MODEL_TYPE_CLASSES,
    }

    row_data = [
        VERTEX_MODEL_ALGO_NAME,
        json.dumps(model_data),
        json.dumps(options),
    ]

    with open(file_path, mode='w', newline='') as handle:
        writer = csv.writer(handle)
        writer.writerow(LOOKUP_HEADERS)
        writer.writerow(row_data)
