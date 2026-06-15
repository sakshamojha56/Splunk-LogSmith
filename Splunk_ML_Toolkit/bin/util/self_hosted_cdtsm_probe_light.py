"""
Self-hosted CDTSM connection probe for REST handlers.

Uses only stdlib + requests so Splunk's non-Anaconda REST Python can import this
without pulling cdtsm_pkg (which triggers pandas via cdtsm_pkg.__init__).

Keep behavior aligned with cdtsm_pkg.forecast_providers probe/validators.

The configured endpoint must be the fully qualified infer URL (scheme, host, path).
No path suffix is appended.
"""

from __future__ import annotations

import math
import uuid
from typing import Any, Optional, Tuple
from urllib.parse import urlparse

import requests

# Mirror cdtsm_pkg.constants.FIXED_FINE_LEN (avoid importing cdtsm_pkg).
_FIXED_FINE_LEN = 512


def validate_self_hosted_base_url(url: str) -> Tuple[bool, str]:
    if not url or not str(url).strip():
        return False, "Endpoint URL is required when self-hosted CDTSM is enabled."
    parsed = urlparse(str(url).strip())
    if parsed.scheme not in ("http", "https"):
        return False, "Endpoint URL must start with http:// or https://."
    if not parsed.netloc:
        return False, "Endpoint URL must include a host."
    if not parsed.path or parsed.path == "/":
        return (
            False,
            "Endpoint URL must include the full infer path (e.g. .../system/slim-api/v1alpha1/ai/infer).",
        )
    return True, ""


def validate_self_hosted_model(model: str) -> Tuple[bool, str]:
    if not model or not str(model).strip():
        return False, "Model name is required when self-hosted CDTSM is enabled."
    return True, ""


def validate_self_hosted_timeout_seconds(timeout: Any) -> Tuple[bool, str, float]:
    try:
        t = float(timeout)
    except (TypeError, ValueError):
        return False, "Timeout must be a positive number.", 0.0
    if math.isnan(t) or math.isinf(t) or t <= 0:
        return False, "Timeout must be a positive number.", 0.0
    if t > 86400:
        return False, "Timeout cannot exceed 86400 seconds (24 hours).", 0.0
    return True, "", t


def self_hosted_infer_url(configured_infer_url: str) -> str:
    """Infer URL from configuration: fully qualified; only trailing slashes are trimmed."""
    return str(configured_infer_url).strip().rstrip("/")


def _safe_response_snippet(response: requests.Response, max_len: int = 500) -> str:
    try:
        text = response.text or ""
    except Exception:
        return ""
    text = text.replace("\n", " ").strip()
    if len(text) > max_len:
        text = text[:max_len] + "..."
    return text


def probe_self_hosted_infer(
    infer_endpoint_url: str,
    model_name: str,
    timeout_seconds: float,
    bearer_token: Optional[str],
) -> Tuple[bool, str]:
    ok_u, msg_u = validate_self_hosted_base_url(infer_endpoint_url)
    if not ok_u:
        return False, msg_u
    ok_m, msg_m = validate_self_hosted_model(model_name)
    if not ok_m:
        return False, msg_m
    ok_t, msg_t, tsec = validate_self_hosted_timeout_seconds(timeout_seconds)
    if not ok_t:
        return False, msg_t

    url = self_hosted_infer_url(infer_endpoint_url)
    fine_ctx = [0.0] * max(2, int(_FIXED_FINE_LEN))
    body = {
        "payload": [{"coarse_ctx": [0.0], "fine_ctx": fine_ctx}],
        "model": model_name,
        "metadata": {"quantiles": ["mean"]},
    }
    request_id = str(uuid.uuid4())
    headers = {"Content-Type": "application/json", "request_id": request_id}
    if bearer_token:
        headers["Authorization"] = f"Bearer {bearer_token}"

    try:
        r = requests.post(
            url,
            json=body,
            headers=headers,
            params={"horizon": 1},
            timeout=min(tsec, 60.0),
        )
    except requests.exceptions.Timeout:
        return False, "Connection test timed out. Increase timeout or check network path."
    except requests.exceptions.ConnectionError:
        return False, "Could not connect to the endpoint. Check URL and network access."

    if r.status_code == 200:
        return True, "Connection test succeeded."

    if r.status_code in (401, 403):
        return False, f"Authentication failed (HTTP {r.status_code})."

    if r.status_code == 404:
        return (
            False,
            f"Endpoint returned HTTP 404 for POST {url!s}. "
            f"Confirm this URL matches your server's infer route. {_safe_response_snippet(r)}",
        )

    if r.status_code >= 400:
        return False, f"Endpoint returned HTTP {r.status_code}. {_safe_response_snippet(r)}"

    return False, f"Unexpected HTTP status {r.status_code}."
