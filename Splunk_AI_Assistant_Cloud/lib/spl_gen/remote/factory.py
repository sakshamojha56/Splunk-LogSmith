from typing import Any, Optional

from splunklib.client import Service

from ..saia_settings_v2 import is_agent_mode_enabled
from .v1alpha1 import SaiaApi, SaiaApiBase
from .v2alpha1 import SAIAApiV2


class SaiaApiFactory:
    """Select the appropriate SAIA API implementation for flag-driven callers."""

    @staticmethod
    def create(
        v2_enabled: bool,
        service: Service,
        system_scoped_service: Service,
        username: str,
        chat_id: Optional[str],
        hashed_user: int,
    ) -> SaiaApiBase:
        saia_api_cls = SAIAApiV2 if v2_enabled else SaiaApi
        return saia_api_cls(
            service,
            system_scoped_service,
            username,
            chat_id,
            hashed_user,
        )

    @classmethod
    def from_rest_handler(
        cls,
        flag_owner: Any,
        service: Service,
        system_scoped_service: Service,
        username: str,
        chat_id: Optional[str],
        hashed_user: int,
    ) -> SaiaApiBase:
        return cls.create(
            getattr(flag_owner, "V2_FLAG", False),
            service,
            system_scoped_service,
            username,
            chat_id,
            hashed_user,
        )

    @classmethod
    def from_agent_mode_setting(
        cls,
        service: Service,
        system_scoped_service: Service,
        username: str,
        chat_id: Optional[str],
        hashed_user: int,
        default_v2_enabled: bool = True,
    ) -> SaiaApiBase:
        return cls.create(
            is_agent_mode_enabled(service, default=default_v2_enabled),
            service,
            system_scoped_service,
            username,
            chat_id,
            hashed_user,
        )
