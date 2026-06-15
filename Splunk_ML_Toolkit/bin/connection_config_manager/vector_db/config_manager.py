from util.ai_commander_util import (
    get_raw_documents_from_kv_store,
    get_raw_document_from_kv_store,
    handle_secrets,
    upsert_single_document_into_kv_store,
    delete_document_from_kv_store,
)
from util.error_util import CustomMLTKError
from util.base_util import get_system_paths, SUPPORTED_SYSTEMS
import time
import json
import cexc
from ai_commander.constants import DEFAULT_TOKEN

import sys
import os

sa_path, system = get_system_paths()

system_path = os.path.join(sa_path, 'bin', '%s' % (SUPPORTED_SYSTEMS[system]))

APP_NAME = f"Splunk_SA_Scientific_Python_{SUPPORTED_SYSTEMS[system]}"
SPLUNK_HOME = os.environ.get('SPLUNK_HOME', '/opt/splunk')
APP_PATH = os.path.join(SPLUNK_HOME, 'etc', 'apps', APP_NAME)

# Dynamically find PSC version with boto3
psc_bin_path = os.path.join(sa_path, 'bin', SUPPORTED_SYSTEMS[system])
psc_version = None
python_version = None

if os.path.exists(psc_bin_path):
    versions = sorted(
        [
            d
            for d in os.listdir(psc_bin_path)
            if os.path.isdir(os.path.join(psc_bin_path, d)) and '_' in d
        ],
        reverse=True,
    )
    for v in versions:
        lib_path = os.path.join(psc_bin_path, v, 'lib')
        if os.path.exists(lib_path):
            # Find any python3.x directory
            python_dirs = [d for d in os.listdir(lib_path) if d.startswith('python3.')]
            for py_dir in sorted(python_dirs, reverse=True):  # prefer newer versions
                test_path = os.path.join(lib_path, py_dir, 'site-packages', 'boto3')
                if os.path.exists(test_path):
                    psc_version = v
                    python_version = py_dir
                    break
            if psc_version:
                break

    # Fallback: use latest version and latest python even without boto3
    if not psc_version and versions:
        psc_version = versions[0]
        lib_path = os.path.join(psc_bin_path, psc_version, 'lib')
        if os.path.exists(lib_path):
            python_dirs = [d for d in os.listdir(lib_path) if d.startswith('python3.')]
            python_version = (
                sorted(python_dirs, reverse=True)[0] if python_dirs else 'python3.9'
            )

PSC_SITE_PACKAGES = (
    os.path.join(psc_bin_path, psc_version, 'lib', python_version, 'site-packages')
    if psc_version and python_version
    else None
)
# Insert PSC site-packages at the beginning to ensure we use PSC's boto3
if PSC_SITE_PACKAGES and os.path.exists(PSC_SITE_PACKAGES):
    sys.path.insert(0, PSC_SITE_PACKAGES)

import boto3
from botocore.exceptions import ClientError
from connection_config_manager.utils.common_utils import CommonUtils

logger = cexc.get_logger(__name__)


class ConfigManager:
    COLLECTION_NAME = "aitk_vector_store_collection"
    AITK_VECTOR_DB_CREDS = "aitk_vector_db_creds"
    AWS_ACCESS_KEY_ID = "aws_access_key_id"
    AWS_ACCESS_KEY_TOKEN = "aws_access_key_token"
    AWS_ROLE_ARN = "role_arn"
    AWS_REGION = "aws_region"
    KB_ID = "kb_id"

    def __init__(self, search_info: dict, common_utils: CommonUtils = None) -> None:
        self.search_info = search_info
        if not common_utils:
            self.common_utils = CommonUtils(search_info)
        else:
            self.common_utils = common_utils

    def _handle_secrets_for_aws(self, request: dict, action: str = "CREATE") -> None:
        name = request.get("name")
        conn_details = request.get("details", {})
        provider = name
        realm = ConfigManager.AITK_VECTOR_DB_CREDS

        if action in ["CREATE", "UPDATE"]:
            existing_secret = handle_secrets(
                self.search_info,
                provider=provider,
                type="SELECT",
                realm=realm,
                with_admin_token=True,
            )
            if not existing_secret or (
                "status" in existing_secret and existing_secret.get("status") not in [200, 201]
            ):
                existing_secret = None
            existing_secret = (
                json.loads(existing_secret.get("clear_password")) if existing_secret else None
            )
            access_key = conn_details.get(ConfigManager.AWS_ACCESS_KEY_ID)
            access_token = conn_details.get(ConfigManager.AWS_ACCESS_KEY_TOKEN)
            role_arn = conn_details.get(ConfigManager.AWS_ROLE_ARN)
            action = "CREATE"

            if existing_secret:
                action = "UPDATE"
                access_key = (
                    existing_secret.get(ConfigManager.AWS_ACCESS_KEY_ID)
                    if (access_key == DEFAULT_TOKEN or access_key is None)
                    else access_key
                )
                access_token = (
                    existing_secret.get(ConfigManager.AWS_ACCESS_KEY_TOKEN)
                    if (access_token == DEFAULT_TOKEN or access_token is None)
                    else access_token
                )
                role_arn = (
                    existing_secret.get(ConfigManager.AWS_ROLE_ARN)
                    if (role_arn == DEFAULT_TOKEN or role_arn is None)
                    else role_arn
                )

            secret = {
                ConfigManager.AWS_ACCESS_KEY_ID: access_key,
                ConfigManager.AWS_ACCESS_KEY_TOKEN: access_token,
                ConfigManager.AWS_ROLE_ARN: role_arn,
            }
            secret_str = json.dumps(secret)
            resp = handle_secrets(
                self.search_info,
                provider=provider,
                token=secret_str,
                type=action,
                realm=realm,
                with_admin_token=True,
            )
            if not resp or ("status" in resp and resp.get("status") not in [200, 201]):
                raise CustomMLTKError(
                    "Failed to upsert AWS KB secret. response: {}".format(resp)
                )
            conn_details["secrets"] = ConfigManager.AITK_VECTOR_DB_CREDS + ":" + name
            conn_details.pop(ConfigManager.AWS_ACCESS_KEY_ID, None)
            conn_details.pop(ConfigManager.AWS_ACCESS_KEY_TOKEN, None)
            conn_details.pop(ConfigManager.AWS_ROLE_ARN, None)
        elif action == "DELETE":
            resp = handle_secrets(
                self.search_info,
                provider=name,
                type=action,
                realm=ConfigManager.AITK_VECTOR_DB_CREDS,
                with_admin_token=True,
            )
            if not resp or ("status" in resp and resp.get("status") not in [200, 201]):
                if resp.get('status') == 404:
                    # If deleting and secret not found, ignore
                    pass
                else:
                    raise CustomMLTKError(
                        "Failed to delete AWS KB secret. response: {}".format(resp)
                    )

    @staticmethod
    def get_collection_name() -> str:
        return ConfigManager.COLLECTION_NAME

    def get_config(self, is_auth_bypass: bool = False) -> list:
        configs = []
        documents = get_raw_documents_from_kv_store(self.search_info, self.COLLECTION_NAME)
        for doc in documents:
            name = doc.get("name")
            if not is_auth_bypass:
                is_user_authorized = self.common_utils.is_user_eligible_by_role(
                    acl=doc.get("acl", {}),
                    action="read",
                )
                if not is_user_authorized:
                    continue
                configs.append(doc)
            else:
                configs.append(doc)
        return configs

    def create_config(self, request: dict) -> bool:
        name = request.get("name")
        query = json.dumps({"name": name})
        existing_record = get_raw_document_from_kv_store(
            search_info=self.search_info,
            collection_name=self.COLLECTION_NAME,
            query=query,
        )
        if existing_record:
            raise CustomMLTKError(f"Configuration with name '{name}' already exists.")

        # Handle secrets for AWS_KB type
        if request.get("type") == "AWS_KB":
            self._handle_secrets_for_aws(request)
        logger.debug(f"Creating vector store config: {request}")
        # Prepare document for KV store
        now = time.time()
        username = self.search_info.get("username", "system")
        document = {
            "name": request.get("name"),
            "description": request.get("description", ""),
            "type": request.get("type"),
            "details": request.get("details", {}),
            "created_at": now,
            "last_updated_at": now,
            "last_updated_by": username,
            "acl": {
                "sharing": "owner",
                "app": "SPLUNK_ML_TOOLKIT",
                "owner": username,
                "perms": {"read": [], "write": []},
            },
        }
        result = upsert_single_document_into_kv_store(
            search_info=self.search_info,
            collection_name=self.COLLECTION_NAME,
            document=document,
            with_admin_token=True,
        )
        return result

    def update_config(self, request: dict) -> bool:
        name = request.get("name")
        query = json.dumps({"name": name})
        existing_record = get_raw_document_from_kv_store(
            search_info=self.search_info,
            collection_name=self.COLLECTION_NAME,
            query=query,
        )
        if not existing_record:
            raise CustomMLTKError(f"Configuration with name '{name}' does not exist.")
        existing_record = existing_record[0]
        existing_key = existing_record.get("_key")
        is_user_authorized = self.common_utils.is_user_eligible_by_role(
            acl=existing_record.get("acl", {}),
            action="write",
        )
        if not is_user_authorized:
            raise CustomMLTKError(f"User is not authorized to update configuration '{name}'.")
        # Handle secrets for AWS_KB type
        if request.get("type") == "AWS_KB":
            self._handle_secrets_for_aws(request, action="UPDATE")

        # Prepare document for KV store
        now = time.time()
        document = {
            "name": request.get("name"),
            "description": request.get("description", existing_record.get("description", "")),
            "type": request.get("type"),
            "details": request.get("details", existing_record.get("details", {})),
            "created_at": existing_record.get("created_at"),
            "acl": request.get("acl", existing_record.get("acl", {})),
            "last_updated_at": now,
            "last_updated_by": self.search_info.get("username", "system"),
        }
        result = upsert_single_document_into_kv_store(
            search_info=self.search_info,
            collection_name=self.COLLECTION_NAME,
            document=document,
            document_key=existing_key,
            with_admin_token=True,
        )
        return result

    def delete_config(self, name: str) -> None:
        query = json.dumps({"name": name})
        existing_record = get_raw_document_from_kv_store(
            search_info=self.search_info,
            collection_name=self.COLLECTION_NAME,
            query=query,
        )
        if not existing_record:
            return True
        existing_record = existing_record[0]
        is_user_authorized = self.common_utils.is_user_eligible_by_role(
            acl=existing_record.get("acl", {}),
            action="write",
        )
        if not is_user_authorized:
            raise CustomMLTKError(f"User is not authorized to delete configuration '{name}'.")
        if existing_record.get("type") == "AWS_KB":
            self._handle_secrets_for_aws(request={"name": name}, action="DELETE")
        existing_key = existing_record.get("_key")
        result = delete_document_from_kv_store(
            search_info=self.search_info,
            collection_name=self.COLLECTION_NAME,
            document_key=existing_key,
            with_admin_token=True,
        )
        return result

    def test_kb_connection(self, request: dict) -> dict:
        """
        Test Knowledge Base connection with provided credentials

        Supports two modes:
        1. KV Store mode: Provide 'name' to test a saved connection (retrieves secrets from passwords.conf)
        2. Form mode: Provide raw credentials for direct testing (DEFAULT_TOKEN not allowed)

        Args:
            request: dict with structure:
                {
                    "name": "kb-name"  # For testing saved connection (mode 1)
                    OR
                    "type": "AWS_KB",  # For testing form inputs (mode 2)
                    "details": {
                        "aws_access_key_id": "AKIAZSSZM6CB...",
                        "aws_access_key_token": "8/pXqKsWNJ...",
                        "role_arn": "arn:aws:iam::123456789012:role/...",
                        "aws_region": "us-west-2",
                        "kb_id": "EJGJR4SKJL"
                    }
                }

        Returns:
            dict: {
                "connected": bool,
                "status": "success" | "error",
                "message": str,
                "details": {...}
            }
        """
        try:
            # Extract parameters
            name = request.get("name")
            details = request.get("details", {})

            # Check if any field has DEFAULT_TOKEN (indicates editing saved connection)
            has_default_token = (
                details.get(self.AWS_ACCESS_KEY_ID) == DEFAULT_TOKEN
                or details.get(self.AWS_ACCESS_KEY_TOKEN) == DEFAULT_TOKEN
                or details.get(self.AWS_ROLE_ARN) == DEFAULT_TOKEN
            )

            # Determine mode and retrieve credentials
            if name and has_default_token:
                # Mode 3: Hybrid mode - editing saved connection with some fields as DEFAULT_TOKEN
                # Need to retrieve saved secrets from KVStore for DEFAULT_TOKEN fields,
                # and use provided values for other fields
                query = json.dumps({"name": name})
                existing_record = get_raw_document_from_kv_store(
                    search_info=self.search_info,
                    collection_name=self.COLLECTION_NAME,
                    query=query,
                )
                if not existing_record:
                    return {
                        "connected": False,
                        "status": "error",
                        "error_message": f"Configuration with name '{name}' does not exist. Cannot test with DEFAULT_TOKEN for unsaved connection.",
                    }

                kb_doc = existing_record[0]
                saved_details = kb_doc.get("details", {})
                creds_identifier = saved_details.get("secrets", "")
                creds_name = (
                    creds_identifier.split(":", 1)[1] if ":" in creds_identifier else ""
                )
                creds_str = handle_secrets(
                    self.search_info,
                    provider=creds_name,
                    type="SELECT",
                    realm=self.AITK_VECTOR_DB_CREDS,
                )
                creds = json.loads(creds_str.get("clear_password")) if creds_str else {}

                # For each field: use provided value if not DEFAULT_TOKEN, else retrieve from KVStore
                # AWS Access Key ID
                aws_access_key_id = (
                    creds.get(self.AWS_ACCESS_KEY_ID)
                    if details.get(self.AWS_ACCESS_KEY_ID) == DEFAULT_TOKEN
                    else details.get(self.AWS_ACCESS_KEY_ID)
                )
                aws_secret_access_key = (
                    creds.get(self.AWS_ACCESS_KEY_TOKEN)
                    if details.get(self.AWS_ACCESS_KEY_TOKEN) == DEFAULT_TOKEN
                    else details.get(self.AWS_ACCESS_KEY_TOKEN)
                )
                role_arn = (
                    creds.get(self.AWS_ROLE_ARN)
                    if details.get(self.AWS_ROLE_ARN) == DEFAULT_TOKEN
                    else details.get(self.AWS_ROLE_ARN)
                )

                # Non-secret fields: use provided value or fallback to saved
                aws_region = details.get(self.AWS_REGION) or saved_details.get(self.AWS_REGION)
                kb_id = details.get(self.KB_ID) or saved_details.get(self.KB_ID)
                source = "hybrid"

            else:
                # Mode 2: Pure form mode - new connection with actual credentials
                aws_access_key_id = details.get(self.AWS_ACCESS_KEY_ID)
                aws_secret_access_key = details.get(self.AWS_ACCESS_KEY_TOKEN)
                role_arn = details.get(self.AWS_ROLE_ARN)
                aws_region = details.get(self.AWS_REGION)
                kb_id = details.get(self.KB_ID)
                source = "form"

                # Check if DEFAULT_TOKEN was sent WITHOUT name (not allowed - no saved connection to retrieve from)
                if (
                    aws_access_key_id == DEFAULT_TOKEN
                    or aws_secret_access_key == DEFAULT_TOKEN
                    or role_arn == DEFAULT_TOKEN
                ):
                    return {
                        "connected": False,
                        "status": "error",
                        "error_message": "Cannot test connection with DEFAULT_TOKEN for new connection. Please provide actual credentials or specify connection name.",
                    }

            # Step 2: Validate required fields
            missing_fields = []
            if not aws_access_key_id:
                missing_fields.append("AWS Access Key ID")
            if not aws_secret_access_key:
                missing_fields.append("AWS Secret Access Key")
            if not role_arn:
                missing_fields.append("IAM Role ARN")
            if not aws_region:
                missing_fields.append("AWS Region")
            if not kb_id:
                missing_fields.append("Knowledge Base ID")

            if missing_fields:
                return {
                    "connected": False,
                    "status": "error",
                    "error_message": f"Missing required fields: {', '.join(missing_fields)}",
                }

            # Step 3: Create boto3 client and test KB connection
            try:
                # Create Bedrock Agent Runtime client
                client = boto3.client(
                    "bedrock-agent-runtime",
                    region_name=aws_region,
                    aws_access_key_id=aws_access_key_id,
                    aws_secret_access_key=aws_secret_access_key,
                )

                # Test KB with a retrieve query
                response = client.retrieve(
                    knowledgeBaseId=kb_id,
                    retrievalQuery={"text": "connectivity test"},
                    retrievalConfiguration={
                        "vectorSearchConfiguration": {"numberOfResults": 2}
                    },
                )

                # Successfully connected and retrieved results
                num_results = len(response.get("retrievalResults", []))

                return {
                    "connected": True,
                    "status": "success",
                    "message": f"Successfully connected to Knowledge Base {kb_id} in {aws_region}",
                    "details": {
                        "kb_id": kb_id,
                        "region": aws_region,
                        "role_arn": role_arn,
                        "test_results": num_results,
                        "validation": "Full KB retrieve test passed",
                    },
                }

            except ClientError as e:
                error_code = e.response.get('Error', {}).get('Code', 'Unknown')
                error_message = e.response.get('Error', {}).get('Message', str(e))

                # Handle only specific error cases we care about
                if error_code == 'ResourceNotFoundException':
                    return {
                        "connected": False,
                        "status": "error",
                        "error_message": f"Knowledge Base {kb_id} not found in {aws_region}. Please verify the KB ID and region.",
                        "details": {
                            "kb_id": kb_id,
                            "region": aws_region,
                            "error_code": error_code,
                        },
                    }
                elif error_code == 'AccessDeniedException':
                    return {
                        "connected": False,
                        "status": "error",
                        "error_message": f"Access denied to Knowledge Base. Please verify IAM role has Bedrock permissions.",
                        "details": {
                            "kb_id": kb_id,
                            "region": aws_region,
                            "role_arn": role_arn,
                            "error_code": error_code,
                        },
                    }
                else:
                    # All other AWS errors - pass through the AWS error message
                    return {
                        "connected": False,
                        "status": "error",
                        "error_message": error_message,
                        "details": {"error_code": error_code},
                    }

            except Exception as bedrock_error:
                error_msg = str(bedrock_error)

                # Check if boto3 doesn't support bedrock-agent-runtime
                if "Unknown service" in error_msg or "bedrock" in error_msg.lower():
                    return {
                        "connected": False,
                        "status": "error",
                        "error_message": "boto3 version doesn't support Bedrock services. Please upgrade boto3/botocore.",
                        "details": {
                            "kb_id": kb_id,
                            "region": aws_region,
                            "note": "This Splunk environment needs boto3 upgrade to test Bedrock KBs",
                        },
                    }
                else:
                    # Unexpected error
                    return {
                        "connected": False,
                        "status": "error",
                        "error_message": f"Unexpected error during KB test: {error_msg}",
                    }

        except Exception as e:
            logger.error(f"KB connection test failed: {str(e)}")
            import traceback

            logger.error(traceback.format_exc())
            return {
                "connected": False,
                "status": "error",
                "error_message": "Connection test failed.",
            }
