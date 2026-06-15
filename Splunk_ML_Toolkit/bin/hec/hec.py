import json
import requests
import traceback


import cexc

from util.rest_url_util import make_splunk_url
from util.rest_proxy import rest_proxy_from_searchinfo

logger = cexc.get_logger(__name__)


class TokenDoesNotExist(Exception):
    """
    Custom exception raised when a requested HEC token does not exist.

    This exception is raised when attempting to access or retrieve an HEC
    (HTTP Event Collector) token that has not been created yet.
    """

    pass


class HECUtil(object):
    """
    Utility class to support HTTP Event Collector (HEC) enablement and token management.

    This class provides comprehensive functionality for managing Splunk HTTP Event Collector
    including enabling HEC, creating/updating/deleting tokens, managing token ACLs, and
    pushing events to Splunk via HEC.

    Attributes:
        splunkd_session_key (str): Splunk daemon session key for authentication
        searchinfo (dict): Search information containing connection details
        base_uri (list): Base URI components for HEC REST endpoints
        rest_proxy: REST proxy for making Splunk API calls
        _hec_port (int): Port number for HEC service
    """

    def __init__(self, splunkd_session_key, searchinfo, app='Splunk_ML_Toolkit', user='nobody'):
        """
        Initialize HECUtil with authentication and connection details.

        Args:
            splunkd_session_key (str): Splunk daemon session key for authentication.
                Cannot be None or empty string.
            searchinfo (dict): Dictionary containing Splunk connection information
            user (str, optional): Username for HEC operations. Defaults to 'nobody'.

        Raises:
            RuntimeError: If splunkd_session_key is None or empty
            RuntimeError: If user is None or empty
        """

        if splunkd_session_key is None or splunkd_session_key == "":
            raise RuntimeError("Invalid splunkd session key")

        self.splunkd_session_key = splunkd_session_key

        if not user:
            raise RuntimeError("Invalid Username ")

        self.base_uri = ["data", "inputs", "http"]

        self.searchinfo = searchinfo

        self.app = app

        self.rest_proxy = rest_proxy_from_searchinfo(searchinfo=searchinfo)

        self.update_proxy_with_token(splunkd_session_key)

        self._hec_port = self.get_hec_port_from_rest()

    def update_proxy_with_token(self, token):
        """
        Update the REST proxy with a new authentication token.

        Replaces the current session key in searchinfo with the provided token
        and recreates the REST proxy with the new authentication.

        Args:
            token (str): New authentication token to use for REST calls

        Returns:
            None
        """

        self.searchinfo["session_key"] = token

        self.rest_proxy = rest_proxy_from_searchinfo(searchinfo=self.searchinfo)

    def get_hec_port_from_rest(self):
        """
        Retrieve the HEC port number from Splunk configuration via REST API.

        Queries the Splunk configuration to determine which port the HTTP Event
        Collector is listening on. Falls back to default port 8088 if retrieval fails.

        Returns:
            int: HEC port number (from config or default 8088)

        Example:
            >>> hec_util = HECUtil(session_key, searchinfo)
            >>> port = hec_util.get_hec_port_from_rest()
            >>> print(port)
            8088
        """

        DEFAULT_HEC_PORT = 8088

        hec_info_url = (
            f"{self.searchinfo.get('splunkd_uri')}/servicesNS/nobody/splunk_httpinput/configs/conf-inputs/http"
            + "?output_mode=json"
        )

        try:

            response = self.rest_proxy.make_rest_call(method="GET", url=hec_info_url)

            if not response.get("status", 500) in [200, 201]:
                raise Exception(
                    f"Failed to get HEC port, status code: {response.get('status')}"
                )

            response_json = json.loads(response.get("content", {}))

            port = (
                response_json.get("entry", [{}])[0]
                .get("content", {})
                .get("port", DEFAULT_HEC_PORT)
            )

            logger.debug(f"Using hec port: {port}")

            return port

        except Exception as e:

            logger.error(
                f"Failed to get response for hec port.: {str(e)}, using default port:: {DEFAULT_HEC_PORT}, traceback: {traceback.format_exc()}"
            )

            return DEFAULT_HEC_PORT

    def get_hec_port(self):
        """
        Get the cached HEC port number.

        Returns the HEC port that was retrieved during initialization.

        Returns:
            int: HEC port number
        """

        return self._hec_port

    @staticmethod
    def _strip_token_field(content):
        """
        Recursively remove sensitive token/auth fields from content for secure logging.

        Sanitizes content by removing fields with keys 'token', 'authorization', or 'auth'
        to prevent sensitive information from appearing in logs. Handles dicts, lists,
        JSON strings, and bytes.

        Args:
            content: Content to sanitize. Can be dict, list, str (JSON), bytes, or None

        Returns:
            Sanitized content with sensitive fields removed. Type matches input type.

        Example:
            >>> data = {"token": "secret123", "user": "admin", "nested": {"auth": "key"}}
            >>> clean = HECUtil._strip_token_field(data)
            >>> print(clean)
            {"user": "admin", "nested": {}}
        """
        if content is None:
            return content

        # If it's already a dict
        if isinstance(content, dict):

            def scrub(obj):
                if isinstance(obj, dict):
                    return {
                        k: scrub(v)
                        for k, v in obj.items()
                        if k.lower() not in {"token", "authorization", "auth"}
                    }
                if isinstance(obj, list):
                    return [scrub(i) for i in obj]
                return obj

            return scrub(content)

        # If it's bytes, decode to str
        if isinstance(content, (bytes, bytearray)):
            try:
                content = content.decode("utf-8", "replace")
            except Exception:
                return content  # leave raw if can't decode

        # If it's a JSON string
        try:
            data = json.loads(content)
            sanitized = HECUtil._strip_token_field(data)
            return json.dumps(sanitized)
        except Exception:
            # If not valid JSON, return as-is
            return content

    def setup_hec_token(
        self,
        session_key,
        token_name,
        app='splunk_httpinput',
        index=None,
        sourcetype=None,
        source=None,
        host=None,
        is_use_ack=False,
    ):
        """
        Create and configure an HEC token with proper ownership and permissions.

        Creates an HEC token and sets ownership to 'nobody' so all roles can acquire
        and use it to index events to Splunk. An HEC token is a session_key equivalent
        that allows users to write events to Splunk via REST.

        This is a high-level setup method that:
        1. Creates a new HECUtil instance
        2. Enables the HTTP listener if disabled
        3. Acquires/creates the token with specified settings

        Args:
            session_key (str): Splunk daemon authentication key. Required.
            token_name (str): User-identifiable name for the HEC token. Required.
            app (str, optional): Splunk app context. Defaults to 'splunk_httpinput'.
            index (str, optional): Index where events will be written. Defaults to None.
            sourcetype (str, optional): Sourcetype associated with events that will be written.
                Defaults to None.
            source (str, optional): Source associated with events that will be written.
                Defaults to None.
            host (str, optional): Host associated with events that will be written.
                Defaults to None.
            is_use_ack (bool, optional): If True, creates a synchronous/acknowledged token.
                Defaults to False.

        Returns:
            None

        Raises:
            Exception: If HEC enablement fails with "Could not enabled HEC."
            Exception: If token acquisition returns None with "Aquiring token returned empty response."

        Example:
            >>> hec_util.setup_hec_token(
            ...     session_key='abc123',
            ...     token_name='my_app_token',
            ...     index='main',
            ...     sourcetype='my_app:events',
            ...     source='my_application'
            ... )

        Notes:
            - Creates a new HECUtil instance internally (doesn't use self)
            - Suppresses HEC enablement errors as HEC might already be enabled
            - Logs error if HEC enablement fails but continues with token creation
            - Token creation may still succeed even if enablement check fails
        """
        util = HECUtil(session_key, app=app, searchinfo=self.searchinfo)

        try:
            response = util.enable_http_listener()

            if response is None:
                logger.error("Failed to enable HEC, empty response. ")
                raise Exception("Could not enabled HEC.")

            if response.get("disabled", True):
                logger.debug(
                    "Did not receive disabled=False response from HEC global settings."
                )
                raise Exception("Could not enabled HEC.")

        except Exception as e:
            # Suppress it as request to enable HEC might have failed, but HEC might already be enabled prior
            # In such a case, token creation might succeed but events wont be pushed to HEC, so will have to debug from push event, so we dont restrict flow here.
            logger.error(f"Problem with enabling HEC: {str(e)}")

        response = util.acquire_token(
            token_name,
            index,
            sourcetype=sourcetype,
            source=source,
            host=host,
            is_use_ack=is_use_ack,
        )

        if response is None:
            raise Exception("Aquiring token returned empty response. ")

    def update_global_settings(self, enableSSL=True, port=8088, **kwargs):
        """
        Update global HTTP Event Collector settings.

        Modifies global HEC configuration settings that apply to all tokens,
        such as SSL enablement, port number, and other advanced settings.

        Args:
            enableSSL (bool, optional): Enable or disable SSL for HEC connections.
                Defaults to True.
            port (int, optional): Port number for HEC listener. Defaults to 8088.
            **kwargs: Additional advanced settings to configure. Common options include:
                - disabled (bool): Disable/enable HEC globally
                - dedicatedIoThreads (int): Number of IO threads
                - maxSockets (int): Maximum number of simultaneous connections
                - maxThreads (int): Maximum number of processing threads
                - useDeploymentServer (bool): Use deployment server settings

        Returns:
            dict: JSON response containing updated global settings with structure:
                - entry: List containing global settings entry
                - Each entry has 'content' with all HEC configuration

        Raises:
            RuntimeError: If update fails (non-200/201 status code)

        Example:
            >>> # Enable SSL and set custom port
            >>> settings = hec_util.update_global_settings(
            ...     enableSSL=True,
            ...     port=8088
            ... )

            >>> # Advanced configuration
            >>> settings = hec_util.update_global_settings(
            ...     enableSSL=True,
            ...     port=8088,
            ...     maxThreads=10,
            ...     maxSockets=500
            ... )

        Notes:
            - Automatically sets output_mode='json' if not provided
            - Only includes enableSSL in request if not None
            - Only includes port in request if not None
            - Logs error with full response if update fails
            - Raises exception on decode errors
        """

        # global_uri = self.base_uri.rstrip('/') + '/http'

        if 'output_mode' not in kwargs:
            kwargs['output_mode'] = 'json'

        if enableSSL is not None:
            kwargs['enableSSL'] = enableSSL

        if port is not None:
            kwargs['port'] = port

        global_hec_url = (
            make_splunk_url(
                self.rest_proxy, namespace="app", extra_url_parts=self.base_uri + ["http"]
            )
            + "?output_mode=json"
        )

        result = self.rest_proxy.make_rest_call(
            method="POST", url=global_hec_url, postargs=kwargs
        )

        if result["status"] not in (200, 201):
            # msg = 'Failed to update HTTP event listener global settings, response=`%s`.' % response
            logger.error(
                f"Failed to update HTTP event listener global settings, response=`{result}`."
            )
            raise RuntimeError

        try:
            response_json = json.loads(result["content"])
        except Exception as e:
            logger.debug(f"Error in decoding json. {str(e)}: {result.get('content', {})}")
            raise Exception("Problem in getting HEC global settings.")

        return response_json

    def get_hec_url_for_app_namespace(self, extra_parts=[], output_json=True):
        """
        Construct HEC REST API URL with app namespace.

        Builds the complete URL for HEC REST endpoints in the app namespace,
        optionally including additional path components and JSON output mode.

        Args:
            extra_parts (list or str, optional): Additional URL path components to append.
                Can be a single string or list of strings. Defaults to empty list.
            output_json (bool, optional): Whether to append output_mode=json parameter.
                Defaults to True.

        Returns:
            str: Complete REST API URL for HEC operations

        Raises:
            Exception: If extra_parts is not a string or list

        Example:
            >>> url = hec_util.get_hec_url_for_app_namespace(['http', 'enable'])
            >>> print(url)
            'https://localhost:8089/servicesNS/nobody/splunk_httpinput/data/inputs/http/http/enable?output_mode=json'
        """

        if isinstance(extra_parts, str):
            extra_parts = [extra_parts]

        elif not isinstance(extra_parts, list):
            raise Exception("Invalid Params")

        if output_json:
            global_hec_url = (
                make_splunk_url(
                    self.rest_proxy,
                    namespace="app",
                    extra_url_parts=self.base_uri + extra_parts,
                )
                + "?output_mode=json"
            )
        else:
            global_hec_url = make_splunk_url(
                self.rest_proxy, namespace="app", extra_url_parts=self.base_uri + extra_parts
            )

        return global_hec_url

    def get_global_settings(self):
        """
        Retrieve global HTTP Event Collector settings.

        Fetches the global HEC configuration including SSL settings, port number,
        and other system-wide HEC parameters that apply to all tokens.

        Returns:
            dict: JSON response containing global HEC settings with structure:
                - entry: List containing one entry with global settings
                - content: Dict with settings including:
                    - disabled (bool): Whether HEC is globally disabled
                    - port (int): HEC port number
                    - enableSSL (bool): Whether SSL is enabled
                    - And other HEC configuration parameters

        Raises:
            Exception: If retrieval fails with message including status code and content
            Exception: If JSON decoding fails with "Problem in getting HEC global settings."

        Example:
            >>> settings = hec_util.get_global_settings()
            >>> entry = settings['entry'][0]
            >>> content = entry['content']
            >>> print(f"HEC Port: {content['port']}")
            >>> print(f"SSL Enabled: {content['enableSSL']}")
            >>> print(f"Disabled: {content['disabled']}")

        Notes:
            - Logs info on successful retrieval (status 200)
            - Logs debug on successful JSON parsing
            - Logs error with status and content if non-200 status
            - Raises exception if response JSON is empty
        """

        global_hec_url = self.get_hec_url_for_app_namespace(extra_parts=["http"])

        result = self.rest_proxy.make_rest_call(method="GET", url=global_hec_url)

        if result["status"] == 200:
            logger.info('Successfully collected Http event listener global settings')
            try:
                response_json = json.loads(result.get("content", {}))

                if not response_json:
                    raise Exception("Response Empty")

                logger.debug("Successfully collected Http event listener global settings")
            except Exception as e:
                logger.error(
                    f"Problem with getting response json with status code 200: {str(e)}"
                )
                raise Exception("Problem in getting HEC global settings.")

            return response_json
        else:
            msg = (
                'Failed to collect HTTP event listener global settings, response={0},'
                ' content={1}.'.format(result["status"], result.get('content'))
            )
            logger.error(msg)
            raise Exception(msg)

    def toggle_http_listener(self, is_enable=True):
        """
        Enable or disable the HTTP Event Collector listener globally.

        Toggles the global HEC listener on or off. When disabled, no HEC tokens
        can accept events until re-enabled.

        Args:
            is_enable (bool, optional): If True, enables the HTTP listener.
                If False, disables it. Defaults to True.

        Returns:
            bool: True if toggle operation succeeded, False otherwise.

        Example:
            >>> # Enable HEC listener
            >>> success = hec_util.toggle_http_listener(is_enable=True)
            >>> print(f"Enabled: {success}")

            >>> # Disable HEC listener
            >>> success = hec_util.toggle_http_listener(is_enable=False)
            >>> print(f"Disabled: {success}")

        Notes:
            - Logs info on successful enable/disable (status 200 or 201)
            - Logs error with response details on failure
            - Strips sensitive token fields from logged content
            - Returns boolean status rather than raising exceptions
        """
        extra = []

        if is_enable:
            extra = ["http", "enable"]
        else:
            extra = ["http", "disable"]

        hec_toggle_url = self.get_hec_url_for_app_namespace(extra_parts=extra)

        result = self.rest_proxy.make_rest_call(method="POST", url=hec_toggle_url)

        operation_type = 'enabled' if is_enable else 'disabled'
        if result["status"] == 200 or result["status"] == 201:
            logger.info('Successfully %s Http event listener', operation_type)
            return True
        else:
            logger.error(
                'Failed to %s Http event listener, response=%s, content=%s',
                operation_type,
                result,
                self._strip_token_field(result.get('content', {})),
            )
            return False

    def create_token(
        self, token_name, index, sourcetype='stash', disabled=False, is_use_ack=False, **kwargs
    ):
        """
        Create or update an HEC token with specified settings.

        Creates a new HEC token if it doesn't exist, or updates an existing token
        with new settings. Tokens allow authenticated event submission to Splunk via HEC.

        Args:
            token_name (str): Name identifier for the token. Cannot be None.
            index (str): Splunk index where events will be sent. Cannot be None.
            sourcetype (str, optional): Default sourcetype for events sent with this token.
                Defaults to 'stash'.
            disabled (bool, optional): Whether the token should be created in disabled state.
                Defaults to False.
            is_use_ack (bool, optional): If True, creates synchronous/acknowledged token
                that waits for indexing confirmation. Defaults to False.
            **kwargs: Additional token settings including:
                - host (str): Default host value for events
                - source (str): Default source value for events
                - indexes (str): Comma-separated list of allowed indexes
                - And other HEC token configuration parameters

        Returns:
            dict: JSON response containing token details with structure:
                - entry: List containing token entry
                - content: Dict with token settings including the token string

        Raises:
            ValueError: If token_name is None
            ValueError: If index is None
            RuntimeError: If token creation fails (non-200/201 status)
            Exception: If token update/creation response JSON is invalid
            Exception: If any other error occurs during token operations

        Example:
            >>> # Create basic token
            >>> response = hec_util.create_token(
            ...     token_name='my_token',
            ...     index='main',
            ...     sourcetype='my_app:events'
            ... )
            >>> token = response['entry'][0]['content']['token']

            >>> # Create acknowledged token with custom settings
            >>> response = hec_util.create_token(
            ...     token_name='critical_token',
            ...     index='security',
            ...     sourcetype='security:alert',
            ...     is_use_ack=True,
            ...     host='myhost',
            ...     source='security_app'
            ... )

        Notes:
            - Automatically adds index to 'indexes' allowed list
            - Sets useACK='1' if is_use_ack=True
            - If token exists, updates it instead of creating new one
            - Removes 'name' field from kwargs when updating existing token
            - Logs info when token already exists and will be updated
            - Logs info on successful token creation
            - Logs error with full response details on failure
            - Strips sensitive token fields from logs
        """
        if token_name is not None:
            kwargs['name'] = token_name
        else:
            raise ValueError('Value token_name cannot be None.')

        if index is not None:
            kwargs['index'] = index
        else:
            raise ValueError('Value index cannot be None.')

        if sourcetype is not None:
            kwargs['sourcetype'] = sourcetype

        if disabled is not None:
            kwargs['disabled'] = disabled

        if is_use_ack:
            kwargs['useACK'] = '1'

        # Check for allowed indexes
        if 'indexes' in kwargs:
            kwargs['indexes'] = kwargs['indexes'] + ',' + index
        else:
            kwargs['indexes'] = index

        # default output mode is json
        if 'output_mode' not in kwargs:
            kwargs['output_mode'] = 'json'

        # Try to get existing
        try:
            # Check token is already existed
            self.get_token(token_name)
            logger.info(
                'We have found already existed token, hence we will update existing token with new settings'
            )
            logger.debug("Updated Token settings are=%s", kwargs)
            # Token is already exists then remove name field from params
            del kwargs['name']
            response_json = self.update_token(token_name, **kwargs)
            return response_json
        except TokenDoesNotExist as re:
            logger.exception(re)
            logger.info("Token=`%s` not found. Creating new token.", token_name)
            logger.debug("Token settings=`%s`", kwargs)

            # Create it

            url = self.get_hec_url_for_app_namespace()
            result = self.rest_proxy.make_rest_call(method='POST', url=url, postargs=kwargs)
            if result.get("status", 500) not in (200, 201):
                msg = 'Failed to create token=`%s`, response=%s, content=%s.' % (
                    token_name,
                    result,
                    self._strip_token_field(result.get('content', {})),
                )
                logger.error(msg)
                raise RuntimeError(msg)

            msg = 'Successfully created token=`%s`.' % (token_name)
            logger.info(msg)

            try:
                response_json = json.loads(result.get("content", {}))

                if not response_json:
                    raise Exception("Empty Response")
                logger.debug("Successfully collected Http event listener global settings")

            except Exception as e:
                logger.debug(
                    f"Problem in getting response from create operation: {str(e)}, : {result.get('content', {})}"
                )
                raise Exception("Failed to create token.")

            return response_json
        except Exception as e:
            logger.error(
                f"Problem in creating token: {str(e)}, traceback: {traceback.format_exc()}"
            )

            raise Exception("Problem in creating token.")

    def _get_token_uri(self, token_name, extra_parts=[], output_json=True):
        """
        Construct REST API URL for a specific HEC token.

        Builds the complete URL for token-specific operations by prepending
        the token name to the base HEC URL.

        Args:
            token_name (str): Name of the HEC token
            extra_parts (list, optional): Additional URL path components. Defaults to empty list.
            output_json (bool, optional): Whether to append output_mode=json. Defaults to True.

        Returns:
            str: Complete REST API URL for the specified token

        Example:
            >>> url = hec_util._get_token_uri('my_token', extra_parts=['acl'])
            >>> print(url)
            'https://localhost:8089/.../data/inputs/http/my_token/acl?output_mode=json'
        """
        return self.get_hec_url_for_app_namespace(
            extra_parts=[token_name] + extra_parts, output_json=output_json
        )

    def toggle_token(self, token_name, is_enable=True):
        """
        Enable or disable a specific HEC token.

        Toggles the enabled/disabled state of an individual HEC token. Disabled
        tokens cannot be used to submit events until re-enabled.

        Args:
            token_name (str): Name of the HEC token to toggle. Cannot be None.
            is_enable (bool, optional): If True, enables the token. If False, disables it.
                Defaults to True.

        Returns:
            bool: True if toggle operation succeeded, False otherwise.

        Raises:
            RuntimeError: If token_name is None

        Example:
            >>> # Enable a token
            >>> success = hec_util.toggle_token('my_token', is_enable=True)
            >>> print(f"Token enabled: {success}")

            >>> # Disable a token
            >>> success = hec_util.toggle_token('my_token', is_enable=False)
            >>> print(f"Token disabled: {success}")

        Notes:
            - Logs info on successful enable/disable (status 200 or 201)
            - Logs error on failure
            - Returns boolean status rather than raising exceptions
        """
        if token_name is None:
            raise RuntimeError('Token name cannot be None.')

        uri = self.get_hec_url_for_app_namespace(extra_parts=[token_name])

        if is_enable:
            uri += ['enable']
        else:
            uri += ['disable']

        result = self.rest_proxy.make_rest_call(
            method='POST', url=uri, postargs={'output_mode': 'json'}
        )
        operation_type = 'enabled' if is_enable else 'disabled'

        if result["status"] == 200 or result["status"] == 201:
            logger.info('Successfully %s %s token', operation_type, token_name)
            return True
        else:
            logger.error('Failed to %s %s', operation_type, token_name)
            return False

    def delete_token(self, token_name):
        """
        Delete a specific HEC token.

        Permanently removes an HEC token from the system. Once deleted, the token
        can no longer be used to submit events and must be recreated if needed again.

        Args:
            token_name (str): Name of the HEC token to delete. Cannot be None.

        Returns:
            bool: True if deletion succeeded, False otherwise.

        Raises:
            RuntimeError: If token_name is None

        Example:
            >>> # Delete a token
            >>> success = hec_util.delete_token('old_token')
            >>> if success:
            ...     print("Token deleted successfully")
            ... else:
            ...     print("Failed to delete token")

        Notes:
            - Logs info on successful deletion (status 200)
            - Logs error with full response details on failure
            - Strips sensitive token fields from logged content
            - Returns boolean status rather than raising exceptions
        """
        if token_name is None:
            raise RuntimeError("Token cannot be None for delete operation. ")
        uri = self._get_token_uri(token_name)

        result = self.rest_proxy.make_rest_call(url=uri, method="DELETE")
        if result.get("status", 500) == 200:
            logger.info('Successfully deleted token=%s', token_name)
            return True
        else:
            logger.error(
                'Failed to delete token=%s, response=%s, content=%s',
                token_name,
                result,
                self._strip_token_field(result.get("content", {})),
            )
            return False

    def update_token(self, token_name, **kwargs):
        """
        Update settings for an existing HEC token.

        Modifies configuration of an existing HEC token such as index, sourcetype,
        enabled status, and other token-specific settings.

        Args:
            token_name (str): Name of the HEC token to update. Cannot be None.
            **kwargs: Token settings to update. Common parameters include:
                - index (str): Default index for events
                - indexes (str): Comma-separated list of allowed indexes
                - sourcetype (str): Default sourcetype for events
                - source (str): Default source for events
                - host (str): Default host for events
                - disabled (bool): Enable/disable the token
                - useACK (str): '1' for acknowledged token, '0' for non-acknowledged
                - output_mode (str): Response format (automatically set to 'json')

        Returns:
            dict: JSON response containing updated token settings with structure:
                - entry: List containing token entry
                - content: Dict with updated token configuration

        Raises:
            RuntimeError: If update fails (non-200/201 status code)
            RuntimeError: If JSON decoding fails

        Example:
            >>> # Update index and sourcetype
            >>> response = hec_util.update_token(
            ...     token_name='my_token',
            ...     index='security',
            ...     sourcetype='security:events'
            ... )

            >>> # Disable a token
            >>> response = hec_util.update_token(
            ...     token_name='my_token',
            ...     disabled=True
            ... )

        Notes:
            - Logs info on successful update (status 200 or 201)
            - Logs error with token name on failure
            - Returns parsed JSON response
        """
        uri = self._get_token_uri(token_name)

        # if 'output_mode' not in kwargs:
        #     kwargs['output_mode'] = 'json'

        result = self.rest_proxy.make_rest_call(method='POST', url=uri, postargs=kwargs)

        if result.get("status", 500) in [200, 201]:
            logger.info('Successfully updated token setting=%s', token_name)

            try:
                response_json = json.loads(result.get("content", "{}"))
            except Exception as e:
                logger.error("Error decoding JSON.")
                raise RuntimeError

            return response_json
        else:
            msg = 'Failed to update token={0} settings.'.format(token_name)
            logger.error(msg)
            raise RuntimeError(msg)

    def _get_event_submission_url(self):
        """
        Get the URL for submitting events to HEC.

        Constructs the HEC event collector endpoint URL using localhost
        and the configured HEC port.

        Returns:
            str: HEC event submission URL

        Example:
            >>> url = hec_util._get_event_submission_url()
            >>> print(url)
            'https://localhost:8088/services/collector/event'
        """
        return f"https://localhost:{self._hec_port}/services/collector/event"

    def get_token(self, token_name, token_setting=False, **kwargs):
        """
        Retrieve an HEC token or its complete settings from Splunk.

        Fetches either just the token string or the full token configuration
        including all settings like index, sourcetype, enabled status, etc.

        Args:
            token_name (str): Name of the HEC token to retrieve. Cannot be None.
            token_setting (bool, optional): If True, returns complete token settings
                as a dictionary. If False, returns only the token string. Defaults to False.
            **kwargs: Additional query parameters to pass to the REST API call.

        Returns:
            str or dict: If token_setting=False, returns the token string (or None if not found).
                If token_setting=True, returns dict with complete token configuration including:
                - entry: List of token entries with metadata
                - Each entry contains 'content' with token settings
                Returns empty dict {} if token_setting=True and JSON decode fails.

        Raises:
            TokenDoesNotExist: If the token is not found (404 or 400 status)
            Exception: If retrieval fails with other status codes

        Example:
            >>> # Get just the token string
            >>> token = hec_util.get_token('my_token')
            >>> print(token)
            'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

            >>> # Get complete token settings
            >>> settings = hec_util.get_token('my_token', token_setting=True)
            >>> print(settings['entry'][0]['content']['index'])
            'main'

        Notes:
            - Returns None for token string if the token field is not in the response
            - Logs info on successful retrieval
            - Logs error with traceback if JSON decoding fails
        """
        url = self._get_token_uri(token_name)

        result = self.rest_proxy.make_rest_call(method="GET", url=url, getargs=kwargs)

        if result.get("status", 500) in [200, 201]:
            logger.info('Successfully got token setting=%s', token_name)

            try:
                response_json = json.loads(result.get("content", "{}"))
            except Exception as e:
                logger.error(
                    f"Error in decoding JSON: {str(e)}, traceback: {traceback.format_exc()}"
                )
                if token_setting:
                    return {}

            if token_setting:
                return response_json

            token_entry = response_json.get("entry", [{"token": None}])[0]

            return token_entry.get("content", {}).get("token")

        elif result.get("status", 500) in [404, 400]:
            logger.debug("Token does not exist yet.")
            raise TokenDoesNotExist
        else:
            msg = 'Failed to get token={0} settings'.format(token_name)
            logger.error(msg)
            raise Exception(msg)

    def update_token_acl(
        self, token_name, perms_read='*', perms_write='*', sharing='global', owner='nobody'
    ):
        """
        Update access control list (ACL) permissions for an HEC token.

        Modifies the ACL settings of an existing HEC token to control which users
        and roles can read or write to the token. This is essential for managing
        multi-user access to HEC tokens.

        Args:
            token_name (str): Name of the HEC token to update ACL for. Cannot be None.
            perms_read (str, optional): Read permissions specification. Use '*' for all users/roles,
                or comma-separated list of roles/users. Defaults to '*'.
            perms_write (str, optional): Write permissions specification. Use '*' for all users/roles,
                or comma-separated list of roles/users. Defaults to '*'.
            sharing (str, optional): Sharing level for the token. Options include:
                - 'global': Available to all apps
                - 'app': Available within the app context
                - 'user': Private to the user
                Defaults to 'global'.
            owner (str, optional): Owner username for the token. Defaults to 'nobody'.

        Returns:
            dict: Response JSON containing updated ACL settings including:
                - entry: List with ACL entry details
                - ACL configuration in entry content

        Raises:
            RuntimeError: If ACL update fails (non-200/201 status code)

        Example:
            >>> # Make token globally accessible
            >>> response = hec_util.update_token_acl(
            ...     token_name='my_token',
            ...     perms_read='*',
            ...     perms_write='admin',
            ...     sharing='global',
            ...     owner='nobody'
            ... )

            >>> # Restrict to specific roles
            >>> response = hec_util.update_token_acl(
            ...     token_name='restricted_token',
            ...     perms_read='admin,power',
            ...     perms_write='admin',
            ...     sharing='app'
            ... )

        Notes:
            - Logs ACL update results at debug level
            - Logs info on successful update
            - Logs error with full result details if update fails
            - Returns JSON even if decode fails (may return incomplete data)
        """
        uri = self._get_token_uri(token_name, extra_parts=['acl'], output_json=False)
        post_args = {
            'sharing': sharing,
            'owner': owner,
            'perms.read': perms_read,
            'perms.write': perms_write,
            'output_mode': 'json',
        }

        result = self.rest_proxy.make_rest_call(method="POST", url=uri, postargs=post_args)
        logger.debug(f"ACL RESULT: {result}")

        if result.get("status", 500) in [200, 201]:
            logger.info('Successfully updated acl setting of token=%s', token_name)

            try:
                response_json = json.loads(result.get("content", "{}"))
            except Exception as e:
                logger.error("Error in decoding JSON.")

            return response_json
        else:
            msg = 'Failed to update acl settings of token={0}'.format(token_name)

            logger.error(f"ACL Results: {result}")
            logger.error(msg)
            raise RuntimeError(msg)

    def acquire_token(
        self, token_name, index, sourcetype=None, source=None, host=None, is_use_ack=False
    ):
        """
        Acquire a valid HEC token, creating or updating it as needed.

        This is a high-level method that ensures you have a working HEC token.
        It will:
        1. Try to get the existing token
        2. Enable it if disabled
        3. Update index/sourcetype if they differ
        4. Create a new token if it doesn't exist

        This method handles the complete token lifecycle management automatically.

        Args:
            token_name (str): Name of the HEC token to acquire
            index (str): Splunk index where events will be sent. Required.
            sourcetype (str, optional): Sourcetype for events sent with this token.
                Defaults to None.
            source (str, optional): Source field for events sent with this token.
                Defaults to None.
            host (str, optional): Host field for events sent with this token.
                Defaults to None.
            is_use_ack (bool, optional): If True, creates a synchronous/acknowledged token
                that waits for indexing confirmation. If False, creates asynchronous token.
                Defaults to False.

        Returns:
            str or None: The HEC token string if successful, None if acquisition fails.
                Token format: UUID string like 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

        Raises:
            TokenDoesNotExist: Raised internally when token doesn't exist, then creates it

        Example:
            >>> # Acquire token for AI agent events
            >>> token = hec_util.acquire_token(
            ...     token_name='ai_agent_token',
            ...     index='main',
            ...     sourcetype='ai_agent:response',
            ...     source='agent_processor'
            ... )
            >>> print(token)
            'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

            >>> # Acquire acknowledged token
            >>> ack_token = hec_util.acquire_token(
            ...     token_name='critical_events',
            ...     index='security',
            ...     sourcetype='security:alert',
            ...     is_use_ack=True
            ... )

        Notes:
            - Automatically enables token if found disabled
            - Updates existing token settings if index/sourcetype changed
            - Creates new token if not found or if token field is empty
            - Deletes and recreates token if existing token has empty token value
            - Logs info when creating new token
            - Returns None on any exception during acquisition
        """
        try:
            # Get token
            token_setting = self.get_token(token_name, token_setting=True)
            # Token exists
            for entry in token_setting.get('entry', []):
                content = entry.get('content', {})
                if content.get('disabled'):
                    self.toggle_token(token_name)
                # if existing token's index and/or sourcetype are different, update token settings
                if content.get('index') != index or content.get('sourcetype') != sourcetype:
                    self.update_token(
                        token_name, index=index, indexes=index, sourcetype=sourcetype
                    )

            if content.get('token'):
                return content.get('token')
            else:
                logger.debug(
                    "Token is empty so attempting to delete the token and create new one"
                )
                self.delete_token(token_name)
                raise TokenDoesNotExist

        except TokenDoesNotExist as e:
            logger.info("Could not find resource %s - Attempting to create one", token_name)
            contents = self.create_token(
                token_name,
                index,
                sourcetype=sourcetype,
                host=host,
                source=source,
                is_use_ack=is_use_ack,
            )
            for entry in contents.get('entry', []):
                content = entry.get('content', {})
                if content.get('disabled'):
                    self.toggle_token(token_name)
                token = content.get('token')
                break
            # update acl settings
            # self.update_token_acl(token_name)
            return token

        except Exception as e:
            logger.error(
                f"Problem in Aquiring Token: {str(e)}, traceback: {traceback.format_exc()}"
            )
            return None

    def enable_http_listener(self):
        """
        Enable the HTTP Event Collector listener if currently disabled.

        Checks the global HEC settings and enables the HTTP listener if it is
        found to be disabled. This is a prerequisite for using HEC tokens to
        submit events to Splunk.

        Returns:
            dict or None: Dictionary containing HEC global settings if successful:
                - disabled (bool): Whether HEC is disabled (will be False after enabling)
                - port (int): HEC port number
                - enableSSL (bool): Whether SSL is enabled
                - And other HEC configuration settings
                Returns None if unable to retrieve settings or enable HEC.

        Example:
            >>> settings = hec_util.enable_http_listener()
            >>> if settings:
            ...     print(f"HEC enabled on port {settings.get('port')}")
            ...     print(f"SSL enabled: {settings.get('enableSSL')}")
            >>> else:
            ...     print("Failed to enable HEC")

        Notes:
            - Automatically calls toggle_http_listener() if HEC is disabled
            - Updates the returned settings dict to set 'disabled' to False
            - Logs debug message on successful global HEC enablement
            - Logs error if unable to retrieve global settings
            - Returns None if get_global_settings() raises an exception
            - Safe to call even if HEC is already enabled
        """
        try:
            global_settings_content = self.get_global_settings()
        except Exception as e:
            logger.error(f"Problem in getting HEC global settings: {str(e)}")

        for entry in global_settings_content.get('entry', []):
            # Get first entry
            content = entry.get('content', {})

            if content.get('disabled'):

                self.toggle_http_listener()

                content['disabled'] = False

            logger.debug(f"Enabled HEC globally successfully. ")

            return content

        return None

    def push_event(self, event, token):
        """
        Push a single JSON event to Splunk using HTTP Event Collector.

        Submits an event to the HEC endpoint for indexing. The event should be
        properly formatted according to HEC event schema.

        Args:
            event (dict): JSON event to push to Splunk. Should contain 'time',
                'sourcetype', 'source', and 'event' fields.
            headers (dict): HTTP headers including HEC token authorization.
                Must contain 'Authorization' header with HEC token.

        Returns:
            None

        Raises:
            Exception: If HEC returns non-200 status code with message "Unable to push event."

        Example:
            >>> event = {
            ...     "time": time.time(),
            ...     "sourcetype": "ai_agent:response",
            ...     "event": {"request_id": "123", "data": "..."}
            ... }
            >>> headers = {"Authorization": f"Splunk {hec_token}"}
            >>> hec_util.push_event(event, headers)

        Notes:
            - Logs success at debug level for successful submissions
            - Logs warnings for failed submissions with status code and response
            - Uses verify=False to skip SSL certificate verification (localhost)
        """

        event_submission_url = self._get_event_submission_url() + "?output_mode=json"

        json_event = json.dumps(event)

        searchinfo = self.searchinfo
        searchinfo['session_key'] = token
        hec_rest_proxy = rest_proxy_from_searchinfo(searchinfo=searchinfo)

        hec_response = hec_rest_proxy.make_rest_call(
            method="POST", url=event_submission_url, jsonargs=json_event
        )

        if hec_response.get("status", 500) in [200, 201]:
            logger.debug(
                f"Successfully sent post spl event to HEC for request_id={event.get('event', {}).get('request_id')}, "
                f"session_id={event.get('event', {}).get('session_id')}"
            )

        else:
            logger.warning(
                f"Failed to send event to HEC: status={hec_response.get('status')}, "
                f"response={hec_response.get('content')}"
            )
            # Handle in parent function call
            raise Exception("Unable to push event.")
