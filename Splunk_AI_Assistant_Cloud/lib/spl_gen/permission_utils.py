import json
import logging
from typing import List
from splunklib.client import Service
from splunklib.results import JSONResultsReader, Message
import concurrent.futures
import time
from threading import Thread

from .utils import read_splk_content

# I also see that | dbinspect index=* index=_* | dedup index | fields index might be another option
# Under the hood maybe eventcount uses dbinspect... not super sure
INDEXES_SEARCH = "| eventcount summarize=false `saias_field_summary_indexes` | dedup index | fields index"
# On PT, this takes 2.4 seconds to run, for last 7 days timeframe
SOURCETYPES_SEARCH = "| metadata type=sourcetypes `saias_field_summary_indexes` | dedup sourcetype | fields sourcetype"
TTL = 3600 # 1 hour before permissions obj needs re-fetching
# Not if TTL should be more or less often (could use up search quota)
MCP_TOKEN_COLLECTION = "saia_mcp_token_collection"
MCP_TOKEN_AUDIENCE = "mcp"

def build_allowed_array(service, search, field_name):
    job = service.search(
        query=search,
        earliest_time="-7d",
        latest_time="now"
    )

    while not job.is_done():
        time.sleep(.1)
    results = JSONResultsReader(job.results(output_mode='json'))

    res = []
    for result in results:
        if isinstance(result, dict):
            res.append(result[field_name])
        elif isinstance(result, Message):
            pass # TODO: Log informational Messages?

    return res

def get_user_capabilities(service) -> List[str]:
    """
    Retrieve the capabilities associated with the current authenticated user.

    This function queries the Splunk authentication service to get the current
    context and extracts the user's capabilities from the response.

    Args:
        service: A Splunk service object that provides access to the Splunk REST API.
                 Must have a get() method to perform HTTP GET requests.

    Returns:
        list: A list of capability names (strings) assigned to the current user.
              Returns None if the 'capabilities' key is not present in the response.
    """
    capabilities_res = service.get("/services/authentication/current-context", output_mode="json")
    parsed_result = read_splk_content(capabilities_res)
    return parsed_result.get('capabilities')

def get_user_roles(service) -> List[str]:
    """
    Retrieve the roles associated with the current authenticated user.

    This function queries the Splunk authentication service to get the current
    context and extracts the user's roles from the response.

    Args:
        service: A Splunk service object that provides access to the Splunk REST API.
                 Must have a get() method to perform HTTP GET requests.

    Returns:
        list: A list of role names (strings) assigned to the current user.
              Returns None if the 'roles' key is not present in the response.
    """
    roles_res = service.get("/services/authentication/current-context", output_mode="json")
    parsed_result = read_splk_content(roles_res)
    return parsed_result.get('roles')

def user_has_role(service, role_name: str) -> bool:
    """
    Returns True if the current user (based on the provided service) has the given role.
    """
    try:
        roles = get_user_roles(service) or []
        return role_name in roles
    except Exception:
        return False

def is_token_valid(service, token_id: str) -> bool:
    """
    Check if a given token is valid.

    1) Does the token exist?
    2) Has the token expired?

    Args:
        service: A Splunk service object that provides access to the Splunk REST API.
        token_id: The ID of the token to check.
    """
    try:
        token_res = service.get(
            f"/services/authorization/tokens/{token_id}",
            output_mode="json",
        )
        content = read_splk_content(token_res)
        expires_on = content.get("claims").get("exp")
        if expires_on is None:
            return False
        expiry_time = float(expires_on)
        return time.time() < expiry_time
    except Exception:
        return False

def run_permission_searches(service):
    indexes = build_allowed_array(service, INDEXES_SEARCH, "index")
    sourcetypes = build_allowed_array(service, SOURCETYPES_SEARCH, "sourcetype")

    roles = get_user_roles(service)
    perms_obj = {
        "indexes": indexes,
        "roles": roles,
        "sourcetypes": sourcetypes,
        "created": time.time()
    }
    return perms_obj

def update_perms_obj_async(key, username, collection, service):
    perms_obj = run_permission_searches(service)
    collection.data.update(key, {
        "saia_user": username, "allowed_obj": perms_obj
    })

def create_perms_obj_async(username, collection, service):
    perms_obj = run_permission_searches(service)
    collection.data.insert(
        {"saia_user": username, "allowed_obj": perms_obj}
    )

def build_permissions_obj(service, username, logger):
    collection =  service.kvstore["saia_allowed_data"]

    results = collection.data.query(
                query={"saia_user": username}
            )

    if len(results) == 0:
        logger.warning("Warning: No permissions found... ")
        # Run search, insert perms object
        perms_obj = {
            "indexes": [],
            "roles": [],
            "sourcetypes": [],
            "created": time.time(),
            "user_id": username
        }
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future = executor.submit(run_permission_searches, service)
            try:
                # Wait for the result within the timeout
                perms_obj = future.result(timeout=3)
            except concurrent.futures.TimeoutError:
                # Return an empty perms_obj, trigger async perms_obj creation
                logger.warning("Warning: Permissions search timed out after 10s, returning empty obj and trigggering async update")
                perms_obj = {
                    "indexes": [],
                    "roles": [],
                    "sourcetypes": [],
                    "created": time.time(),
                    "user_id": username
                }
                
                kwargs = {
                    "username": username,
                    "collection": collection,
                    "service": service
                }
                logger.info("Starting async thread to create permissions object")
                thread = Thread(target=create_perms_obj_async, kwargs=kwargs)
                thread.start()
                logger.info("Started async thread to create permissions object")
                return perms_obj

        collection.data.insert(
            {"saia_user": username, "allowed_obj": perms_obj}
        )
        perms_obj["user_id"] = username
        return perms_obj
    else:
        now = time.time()
        # Check expiry, if past expiry fetch again else return cached
        created = results[0]["allowed_obj"]["created"]
        current_obj = results[0]["allowed_obj"]
        if (now - created) > TTL:

            current_obj["created"] = time.time() # Set time to prevent subsequent
            # expired calls from fetching as well
            collection.data.update(results[0]["_key"], {
                "saia_user": username,
                "allowed_obj": current_obj
            })
            kwargs = {
                "key": results[0]["_key"],
                "username": username,
                "service": service,
                "collection": collection
            }
            logger.info("Starting async thread to update permissions object")
            thread = Thread(target=update_perms_obj_async, kwargs=kwargs)
            thread.start()
            logger.info("Started async thread to update permissions object")
        current_obj["user_id"] = username
        return current_obj

def get_ec_mcp_token(service: Service, system_scoped_service: Service, username: str) -> str:
    """
    Retrieve the EC token for the current user.

    If the user is not a member of the `mcp_user` role or the token can't be generated, this function will return an empty string.

    Look to see if a token is stored in secrets storage. If not (or if the token is expired or deleted), generate a new one.

    When generating a new token, this will generate it for the current user with the audience field set to `mcp` (it must match this exactly to interact with the MCP server).

    Args:
        service: A Splunk service object that provides access to the Splunk REST API.
        system_scoped_service: A Splunk service object with system-scoped permissions for interacting with secrets storage.
        username: The username of the current authenticated user.
    """
    logger = logging.getLogger("permission_utils")

    if not user_has_role(service, "mcp_user"):
        logger.info(
            f"User {username} is not in mcp_user role; skipping EC MCP token retrieval"
        )
        return ""

    secrets = None
    try:
        secret_json = system_scoped_service.storage_passwords[
            f"{MCP_TOKEN_COLLECTION}:{username}"
        ].clear_password
        secrets = json.loads(secret_json)
        if is_token_valid(service, secrets.get("id")):
            return secrets.get("token")
    except KeyError:
        logger.info("ec token not found or invalid, generating new token")

    try:
        token_res = service.post(
            "/services/authorization/tokens",
            name=username,
            audience=MCP_TOKEN_AUDIENCE,
            output_mode="json",
        )
        content = read_splk_content(token_res)
        token_id = content.get("id")
        token = content.get("token")
    except Exception as e:
        logger.error("Failed to generate EC MCP token", exc_info=e)
        return ""

    if token is None:
        return ""

    if secrets:
        try:
            system_scoped_service.storage_passwords.delete(
                f"{MCP_TOKEN_COLLECTION}:{username}"
            )
        except Exception as e:
            logger.warning("Failed to delete old MCP token secret", exc_info=e)

    try:
        cache_entry_str = json.dumps({"token": token, "id": token_id})
        system_scoped_service.storage_passwords.create(
            cache_entry_str,
            username=username,
            realm=MCP_TOKEN_COLLECTION,
        )
    except Exception as e:
        logger.warning("Failed to cache EC MCP token in KV Store", exc_info=e)

    return token
