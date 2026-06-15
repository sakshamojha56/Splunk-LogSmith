import cexc
import json

from .param_util import missing_keys_in_dict, object_to_dict, unicode_to_str_in_dict

logger = cexc.get_logger(__name__)


def validate_and_add_user_info(searchinfo):
    """
    Validate that the session_key (token) is valid for the given splunkd_uri
    and belongs to the same user specified in searchinfo.

    Makes a lightweight REST call to verify the token belongs to the server
    and the authenticated user matches.
    Skips validation for 'nobody' user.

    Args:
        searchinfo (dict): Dictionary containing splunkd_uri, session_key, and username

    Raises:
        RuntimeError: If token is not valid for the given splunkd_uri or user mismatch
    """
    username = searchinfo.get('username', '')
    if username == 'nobody':
        logger.debug('Skipping token validation for nobody user')
        return

    splunkd_uri = searchinfo.get('splunkd_uri')
    session_key = searchinfo.get('session_key')

    if not splunkd_uri or not session_key:
        logger.debug('Missing splunkd_uri or session_key, skipping validation')
        return

    try:
        # Import here to avoid circular import (rest_proxy imports from searchinfo_util)
        from .rest_proxy import SplunkRestProxy

        url = f"{splunkd_uri}/services/authentication/current-context"
        rest_proxy = SplunkRestProxy.from_searchinfo(searchinfo)
        reply = rest_proxy.make_rest_call(
            'GET',
            url,
            getargs={'output_mode': 'json'},
        )

        if not reply or not reply.get('success'):
            raise RuntimeError(
                f"Token validation failed: session_key is not valid for splunkd_uri '{splunkd_uri}'"
            )

        # Verify the authenticated user matches the username in searchinfo
        response_data = json.loads(reply['content'])
        token_username = (
            response_data.get('entry', [{}])[0].get('content', {}).get('username', '')
        )
        roles = response_data.get('entry', [{}])[0].get('content', {}).get('roles', [])
        searchinfo['roles'] = roles
        capabilities = (
            response_data.get('entry', [{}])[0].get('content', {}).get('capabilities', [])
        )
        searchinfo['capabilities'] = capabilities

        if not token_username:
            raise RuntimeError(
                "Token validation failed: could not determine username from token"
            )

        if token_username != username:
            raise RuntimeError(
                f"Token validation failed: token belongs to user '{token_username}' "
                f"but searchinfo specifies user '{username}'"
            )

        logger.debug('Token validated successfully for splunkd_uri and user')
    except RuntimeError:
        raise
    except Exception as e:
        raise RuntimeError(
            f"Token validation failed: unable to connect to splunkd_uri '{splunkd_uri}': {e}"
        )


def searchinfo_from_request(request, with_admin_token=False, validate_token=False):
    """Generates a searchinfo-style object needed by listmodels.list_models()

    :param request: the base request object from PersistentServerConnectionApplication
    :param with_admin_token: whether to include admin session key
    :param validate_token: whether to validate token matches splunkd_uri and user (default False)
    :return: searchinfo: dict with search information
    """

    user = request.get('ns').get('user')

    if user is None:
        user = 'nobody'

    searchinfo = {
        'splunkd_uri': request.get('server').get('rest_uri'),
        'session_key': request.get('session').get('authtoken'),
        'admin_session_key': (
            request.get('system_authtoken') if with_admin_token is not False else None
        ),
        'app': request.get('ns').get('app'),
        'username': user,
    }

    if validate_token:
        validate_and_add_user_info(searchinfo)

    return searchinfo


def searchinfo_from_object(searchinfo_obj):
    """Generates a searchinfo-style object needed by listmodels.list_models()

    :param: request: searchinfo object from splunklib
    :return: searchinfo: dict with search information
    """

    searchinfo = {
        'splunkd_uri': searchinfo_obj.splunkd_uri,
        'session_key': searchinfo_obj.session_key,
        'app': searchinfo_obj.app,
        'username': searchinfo_obj.username,
    }

    return searchinfo


def searchinfo_from_cexc(cexc_searchinfo, extra_fields=None):
    """
    Generate a dict containing selected values from the corresponding Chunked EXternal Command (CEXC) protocol message.

    Args:
        cexc_searchinfo (dict or object): searchinfo dict or object from the CEXC message
        extra_fields: any additional fields required beside the minimum required
                                - splunkd_uri
                                - session_key
                                - app
                                - username

    Returns:
        (dict): an internal searchinfo dict with selected fields from the original CEXC message.

    """
    if not isinstance(cexc_searchinfo, dict):
        # Maybe it's an ObjectView instance (internal Splunk object)?
        cexc_searchinfo = unicode_to_str_in_dict(object_to_dict(cexc_searchinfo))

    # Check required searchinfo fields
    if extra_fields is None:
        extra_fields = []

    required_fields = ['splunkd_uri', 'session_key', 'app', 'username'] + extra_fields

    missing_keys = missing_keys_in_dict(required_fields, cexc_searchinfo)
    if missing_keys:
        logger.debug(
            'searchinfo in getinfo missing the following keys: %s', ', '.join(missing_keys)
        )
        raise RuntimeError('Protocol error has occurred while instantiating the controller')

    # Create our own searchinfo context with the information we need to pass to subsequent functions.
    return {k: cexc_searchinfo[k] for k in required_fields}


def get_user_and_roles_from_searchinfo(searchinfo):
    """
    Generate a list containing user and all the roles the user has.

    Roles might not be present in searchinfo, also, btool is not able to differentiate user vs. roles on
    the indexer. Which means we need to iterate through user and all the roles to get the correct list
    of configurations.

    Args:
        searchinfo (dict): searchinfo dict

    Returns:
        (list): a list containing user and all the roles the user has.

    """
    user = searchinfo.get('username', '')
    user_and_roles = searchinfo.get('roles', [])

    if user != '':
        user_and_roles.append(user)
    return user_and_roles


def is_parsetmp(searchinfo):
    """
    Check if this search is a parsetmp.

    Args:
        searchinfo (dict): information required for search
    """
    return searchinfo.get('sid', 'nosid').startswith('searchparsetmp_')


def is_remote(searchinfo):
    """
    Check if this search is remote.

    Args:
        searchinfo (dict): information required for search
    """
    return searchinfo.get('is_remote', False)


def should_use_btool(searchinfo):
    """
    Check if btool should be used for loading information, for more info refer to MLA-1989

    Args:
        searchinfo (dict): searchinfo
    """
    return is_remote(searchinfo) or is_parsetmp(searchinfo)


def validate_searchinfo_for_btool(searchinfo):
    """
    Validate if searchinfo contains required information for using Btool

    Args:
        searchinfo (dict): searchinfo

    Returns:
        result (tuple2):
        (<True| False>, <ERROR_MESSAGE>)
    """
    result = (True, '')
    # bundle_path is required if running on remote Splunk for using btool
    if is_remote(searchinfo):
        if searchinfo.get('bundle_path') is None:
            result = (False, '"bundle_path" is missing')
    return result
