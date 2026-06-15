from typing import Any


SAIA_SETTINGS_V2_COLLECTION = "saia_settings_v2"
KEY_ENABLE_SAIA_V2 = "enable_saia_v2"


def _coerce_bool(value: Any, default: bool) -> bool:
    if isinstance(value, bool):
        return value

    if isinstance(value, str):
        normalized = value.strip().lower()
        if normalized in {"1", "true", "t", "yes", "y"}:
            return True
        if normalized in {"0", "false", "f", "no", "n"}:
            return False

    if isinstance(value, (int, float)):
        return bool(value)

    return default


def is_agent_mode_enabled(service: Any, default: bool = True) -> bool:
    """
    Return the persisted Agent Mode state used to gate SAIA v2 uploads.

    Default to the current v2 behavior when the setting is missing so existing
    deployments do not regress until the flag is explicitly written.
    """
    try:
        collection = service.kvstore[SAIA_SETTINGS_V2_COLLECTION]
        entry = collection.data.query_by_id(KEY_ENABLE_SAIA_V2)
    except Exception:
        return default

    if not isinstance(entry, dict):
        return default

    return _coerce_bool(entry.get("enabled"), default)
