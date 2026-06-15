from typing import Optional
import cexc
from util.mlspl_loader import MLSPLConf
from ai_commander.constants import ALLOWED_DOMAINS
from util.ai_commander_util import handle_secrets, get_user_roles
from urllib.parse import urlparse
import re
import time

logger = cexc.get_logger(__name__)


class CommonUtils:
    def __init__(self, search_info: dict, is_mlspl_load: bool = True) -> None:
        self.search_info = search_info
        if is_mlspl_load:
            mlspl_conf = MLSPLConf(search_info)
            self.allowed_domains = mlspl_conf.get_mlspl_prop(
                'allowed_domains', stanza=ALLOWED_DOMAINS, default=''
            ).split(',')
            self.enforce_domain_validation = mlspl_conf.get_mlspl_prop(
                'enforce_domain_validation', stanza=ALLOWED_DOMAINS, default='false'
            ).lower() in ("true", "1", "yes", "on")
        self.user_roles = None

    def is_url_whitelisted(self, url: str) -> bool:
        """
        Check if the URL is whitelisted based on domain validation rules.

        Args:
            url (str): The URL to validate

        Returns:
            bool: True if the URL is whitelisted, False otherwise
        """
        try:
            # Parse the URL
            parsed_url = urlparse(url)

            # Check if URL is HTTPS
            if parsed_url.scheme != 'https':
                logger.warning(f"URL is not HTTPS: {url}")
                return False

            # Check if URL is localhost
            hostname = parsed_url.hostname
            if not hostname:
                logger.warning(f"Invalid hostname in URL: {url}")
                return False

            # Check for localhost variations
            localhost_patterns = ['localhost', '127.0.0.1', '::1', '0.0.0.0']
            if hostname.lower() in localhost_patterns:
                logger.warning(f"Localhost URLs are not allowed: {url}")
                return False

            # If domain validation is not enforced, allow all non-localhost HTTPS URLs
            if not self.enforce_domain_validation:
                return True

            # Check if hostname matches any allowed domain pattern
            if not self.allowed_domains or (
                len(self.allowed_domains) == 1 and self.allowed_domains[0] == ''
            ):
                logger.warning("No allowed domains configured in mlspl.conf")
                return False

            for domain_pattern in self.allowed_domains:
                domain_pattern = domain_pattern.strip()
                if not domain_pattern:
                    continue
                # Convert wildcard pattern to regex
                # Escape special regex characters except *
                escaped_pattern = re.escape(domain_pattern)
                # Replace escaped \* with regex .* for wildcard matching
                regex_pattern = escaped_pattern.replace(r'\*', '.*')
                # Ensure full domain match
                regex_pattern = f'^{regex_pattern}$'

                if re.match(regex_pattern, hostname, re.IGNORECASE):
                    return True

            logger.warning(
                f"URL hostname {hostname} does not match any allowed domain patterns"
            )
            return False

        except Exception as e:
            logger.error(f"Error validating URL {url}: {str(e)}")
            return False

    def is_token_refresh_required(
        self, last_refresh_at: Optional[float], auto_refresh_enabled: bool
    ) -> bool:

        if not auto_refresh_enabled:
            return False
        elif last_refresh_at is None:
            return True

        # Check if last refresh was 20 minutes (1200 seconds) ago
        current_time = time.time()
        time_diff = current_time - float(last_refresh_at)

        # Return True if 20 minutes or more have passed since last refresh
        return time_diff >= 1200

    def update_token(self, realm: str, name: str, token: str, with_admin_token=False) -> str:
        """
        Update MCP token using shared handle_secrets utility

        Args:
            name (str): MCP connection name
            token (str): New token value
            with_admin_token (bool): Whether to use admin token for the update
        Returns:
            str: Reference string in format "realm:username"
        """
        try:
            result = handle_secrets(
                searchinfo=self.search_info,
                provider=name,
                token=token,
                type="UPDATE",
                realm=realm,
                with_admin_token=with_admin_token,
            )

            # handle_secrets returns the password object content on success,
            # or a dict with 'status' and 'message' on error
            if result and result.get('status') and result.get('status') not in (200, 201):
                raise Exception(
                    f"Failed to update token: {result.get('message', 'Unknown error')}"
                )

            return f"{realm}:{name}"

        except Exception as e:
            logger.error(f"Failed to update MCP token for {name}: {str(e)}")
            raise

    def is_user_eligible_by_role(self, acl: dict, action: str) -> bool:
        """
        Check if user is eligible to perform action based on ACL and user roles.

        Args:
            user_roles (list): List of roles the user has
            acl (dict): ACL dictionary with 'perms' key containing allowed roles for actions
            action (str): Action to check ('read' or 'write')
        """
        if self.search_info.get('roles'):
            self.user_roles = self.search_info.get('roles')

        if self.user_roles is None:
            logger.info("loading user roles for eligibility check")
            username = self.search_info.get('username', '')
            self.user_roles = get_user_roles(self.search_info, username)
            logger.info(
                f"Checking eligibility for user '{username}' with roles {self.user_roles} "
                f"for action '{action}' against ACL: {acl}"
            )
        user_name = self.search_info.get('username', '')

        try:
            allowed_roles = acl.get('perms', {}).get(action, [])
            if user_name == acl.get('owner'):
                return True
            elif acl.get('sharing') == 'owner':
                return False
            if not allowed_roles:
                return False

            if '*' in allowed_roles:
                return True

            for role in self.user_roles:
                if role in allowed_roles:
                    return True

            return False

        except Exception as e:
            logger.error(f"Error checking user eligibility by role: {str(e)}")
            return False
