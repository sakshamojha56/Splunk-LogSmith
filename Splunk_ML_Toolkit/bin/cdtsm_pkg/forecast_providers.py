"""
CDTSM forecast inference providers: hosted (SCS) vs customer self-hosted endpoint.

Keeps transport logic modular so additional self-hosted model types can follow
the same pattern (config-driven URL, optional bearer auth, response shaping).
"""

from __future__ import annotations

import asyncio
import json
import random
import threading
import time
import uuid
from abc import ABC, abstractmethod
from typing import Any, Dict, Optional, Tuple

import requests

import cexc
from cdtsm_pkg.constants import (
    CDTSM_API_TOKEN_BUCKET_BURST_CAPACITY,
    CDTSM_AUTH_TOKEN_KEY,
    CDTSM_AUTH_TOKEN_REALM,
    CDTSM_RETRY_JITTER_FRACTION,
    FIXED_FINE_LEN,
)
from util.self_hosted_cdtsm_probe_light import (
    validate_self_hosted_base_url,
    self_hosted_infer_url,
)
from util.ai_commander_util import (
    get_cached_scs_token,
    get_tentantinfo_from_session,
    handle_secrets,
)
from util.ctsm_conf_util import CTSMConfUtil
from util.telemetry_cdtsm_util import log_cdtsm_api_call, log_cdtsm_rate_limit

logger = cexc.get_logger(__name__)

CDTSM_UPSTREAM_UNAVAILABLE_MSG = "Cisco Deep Time Series Model upstream currently unavailable."


class CDTSMRateLimitRetryExhausted(RuntimeError):
    """Raised when one API job exhausts its local 429 retry loop."""

    pass


class CDTSMUpstreamTransientError(RuntimeError):
    """Raised when one API job hits a transient transport/connection error
    after exhausting its local retry loop.

    Examples include httpx.NetworkError (connection reset / remote disconnect
    on Envoy-side ``downstream_remote_disconnect``), timeouts, and other
    transport-level failures that are expected to clear on a fresh
    connection. Callers (the batch scheduler) treat this like a rate-limit
    exhaustion: requeue with a delay so that other in-flight work has a
    chance to complete before we open new connections.
    """

    pass


def jittered_delay(base_seconds: float, fraction: float = CDTSM_RETRY_JITTER_FRACTION) -> float:
    """Return ``base_seconds * (1 + uniform(0, fraction))``.

    Used to spread retry wake-ups across a window so that simultaneously
    requeued or back-off-sleeping requests do not stampede the upstream at
    exactly the same instant. ``fraction`` is clamped to ``[0, 1]``.
    """
    if base_seconds <= 0:
        return 0.0
    f = max(0.0, min(1.0, float(fraction)))
    if f == 0.0:
        return float(base_seconds)
    return float(base_seconds) * (1.0 + random.uniform(0.0, f))


class _AsyncTokenBucket:
    """Asyncio-aware token bucket for client-side rate limiting.

    Refills at ``rate_per_minute / 60`` tokens per second, capped at
    ``capacity``. ``acquire()`` blocks (cooperatively) until at least one
    token is available, then consumes one. Fair under contention because the
    refill check and token consumption run under a single ``asyncio.Lock``
    per acquisition step.
    """

    def __init__(self, rate_per_minute: float, capacity: int):
        rate_per_minute = max(0.0, float(rate_per_minute))
        capacity = max(1, int(capacity))
        self.rate_per_sec = rate_per_minute / 60.0
        self.capacity = float(capacity)
        self.tokens = float(capacity)
        self.last_refill = time.monotonic()
        self.lock = asyncio.Lock()

    def _refill(self) -> None:
        now = time.monotonic()
        elapsed = now - self.last_refill
        if elapsed <= 0:
            return
        self.tokens = min(self.capacity, self.tokens + elapsed * self.rate_per_sec)
        self.last_refill = now

    async def acquire(self) -> None:
        if self.rate_per_sec <= 0:
            return
        while True:
            async with self.lock:
                self._refill()
                if self.tokens >= 1.0:
                    self.tokens -= 1.0
                    return
                deficit = 1.0 - self.tokens
                wait_for = deficit / self.rate_per_sec if self.rate_per_sec > 0 else 1.0
            await asyncio.sleep(max(0.01, min(wait_for, 5.0)))


class _SyncTokenBucket:
    """Threading-safe token bucket for the sync forecast threadpool path.

    Mirrors ``_AsyncTokenBucket`` but uses a ``threading.Lock`` and
    ``time.sleep``. Safe to share across threads of a ``ThreadPoolExecutor``.
    """

    def __init__(self, rate_per_minute: float, capacity: int):
        rate_per_minute = max(0.0, float(rate_per_minute))
        capacity = max(1, int(capacity))
        self.rate_per_sec = rate_per_minute / 60.0
        self.capacity = float(capacity)
        self.tokens = float(capacity)
        self.last_refill = time.monotonic()
        self.lock = threading.Lock()

    def _refill(self) -> None:
        now = time.monotonic()
        elapsed = now - self.last_refill
        if elapsed <= 0:
            return
        self.tokens = min(self.capacity, self.tokens + elapsed * self.rate_per_sec)
        self.last_refill = now

    def acquire(self) -> None:
        if self.rate_per_sec <= 0:
            return
        while True:
            with self.lock:
                self._refill()
                if self.tokens >= 1.0:
                    self.tokens -= 1.0
                    return
                deficit = 1.0 - self.tokens
                wait_for = deficit / self.rate_per_sec if self.rate_per_sec > 0 else 1.0
            time.sleep(max(0.01, min(wait_for, 5.0)))


def build_async_token_bucket(rate_per_minute: float) -> _AsyncTokenBucket:
    """Construct the standard hosted-API async token bucket."""
    return _AsyncTokenBucket(
        rate_per_minute=rate_per_minute,
        capacity=CDTSM_API_TOKEN_BUCKET_BURST_CAPACITY,
    )


def build_sync_token_bucket(rate_per_minute: float) -> _SyncTokenBucket:
    """Construct the standard hosted-API sync token bucket."""
    return _SyncTokenBucket(
        rate_per_minute=rate_per_minute,
        capacity=CDTSM_API_TOKEN_BUCKET_BURST_CAPACITY,
    )


def _fetch_cdtsm_auth_token(searchinfo: Optional[Dict[str, Any]]) -> Optional[str]:
    """Retrieve the CDTSM bearer token from Splunk storage passwords.

    Looks up realm=``aitk_fm_tokens``, key=``CDTSM_AUTH_TOKEN`` via the shared
    ``handle_secrets`` utility and returns the decrypted ``clear_password``.
    Returns ``None`` when the entry does not exist or any error occurs, so
    callers can fall back to unauthenticated requests.
    """
    if not searchinfo:
        logger.debug("CDTSM: No searchinfo — skipping auth token lookup.")
        return None
    try:
        logger.debug(
            "CDTSM: Fetching auth token (realm=%s, key=%s).",
            CDTSM_AUTH_TOKEN_REALM,
            CDTSM_AUTH_TOKEN_KEY,
        )
        response = handle_secrets(
            searchinfo,
            provider=CDTSM_AUTH_TOKEN_KEY,
            type="SELECT",
            realm=CDTSM_AUTH_TOKEN_REALM,
        )
        if not response:
            logger.warning("CDTSM: handle_secrets returned None for auth token.")
            return None

        status = response.get("status")
        if status is not None and int(status) not in (200, 201):
            logger.warning(
                "CDTSM: Auth token lookup failed (status=%s, message=%s). "
                "Proceeding without bearer token.",
                status,
                response.get("message", ""),
            )
            return None

        token = response.get("clear_password", "")
        if token:
            logger.info("CDTSM: Bearer token retrieved successfully.")
            return token

        logger.warning(
            "CDTSM: Auth token entry exists but clear_password is empty "
            "(realm=%s, key=%s). Proceeding without bearer token.",
            CDTSM_AUTH_TOKEN_REALM,
            CDTSM_AUTH_TOKEN_KEY,
        )
        return None
    except Exception as exc:
        logger.warning(
            "CDTSM: Could not fetch auth token from storage passwords "
            "(realm=%s, key=%s): %s",
            CDTSM_AUTH_TOKEN_REALM,
            CDTSM_AUTH_TOKEN_KEY,
            exc,
        )
        return None


def normalize_infer_response(raw: Dict[str, Any]) -> Dict[str, Any]:
    """
    Map self-hosted JSON into the shape expected by ApiClientMixin._prune_and_validate_*:
    {"predictions": [ {"mean": [...], "quantiles": {...}}, ... ]}
    """
    if not isinstance(raw, dict):
        raise RuntimeError("CDTSM: Self-hosted response is not a JSON object.")

    if "predictions" in raw and isinstance(raw["predictions"], list):
        return raw

    data = raw.get("data")
    if isinstance(data, dict) and "predictions" in data:
        inner = data["predictions"]
        if isinstance(inner, list):
            return {"predictions": inner}

    result = raw.get("result")
    if isinstance(result, dict) and isinstance(result.get("predictions"), list):
        return {"predictions": result["predictions"]}

    raise RuntimeError(
        "CDTSM: Self-hosted response missing a 'predictions' array. "
        "Check that the server matches the CDTSM infer contract."
    )


def build_self_hosted_request_body(payload: Dict[str, Any], model_name: str) -> Dict[str, Any]:
    """Strip horizon from metadata; horizon is sent only as query param per contract."""
    meta = payload.get("metadata") or {}
    quantiles = meta.get("quantiles")
    if not isinstance(quantiles, list):
        quantiles = list(meta.get("quantiles") or [])
    return {
        "payload": payload.get("payload", []),
        "model": model_name,
        "metadata": {"quantiles": quantiles},
    }


class ForecastProvider(ABC):
    """Abstract CDTSM inference transport."""

    @abstractmethod
    def infer(
        self,
        mixin: Any,
        payload: Dict[str, Any],
        batch_horizon: int,
    ) -> Dict[str, Any]:
        raise NotImplementedError

    async def infer_async(
        self,
        mixin: Any,
        payload: Dict[str, Any],
        batch_horizon: int,
    ) -> Dict[str, Any]:
        raise NotImplementedError


class HostedCdtsmProvider(ForecastProvider):
    """Default Splunk Cloud Services / tenant infer endpoint (existing behavior)."""

    def infer(
        self,
        mixin: Any,
        payload: Dict[str, Any],
        batch_horizon: int,
        *,
        force_fresh_connection: bool = False,
    ) -> Dict[str, Any]:
        return _call_hosted_scs_infer(
            mixin,
            payload,
            batch_horizon,
            force_fresh_connection=force_fresh_connection,
        )

    async def infer_async(
        self,
        mixin: Any,
        payload: Dict[str, Any],
        batch_horizon: int,
    ) -> Dict[str, Any]:
        return await _call_hosted_scs_infer_async(mixin, payload, batch_horizon)


class SelfHostedCdtsmProvider(ForecastProvider):
    """Customer-operated HTTP infer endpoint."""

    def __init__(
        self,
        base_url: str,
        model_name: str,
        timeout_seconds: float,
        bearer_token: Optional[str],
    ):
        self.base_url = base_url
        self.model_name = model_name
        self.timeout_seconds = timeout_seconds
        self.bearer_token = bearer_token

    def infer(
        self,
        mixin: Any,
        payload: Dict[str, Any],
        batch_horizon: int,
    ) -> Dict[str, Any]:
        url = self_hosted_infer_url(self.base_url)
        body = build_self_hosted_request_body(payload, self.model_name)
        request_id = str(uuid.uuid4())

        headers: Dict[str, str] = {
            "Content-Type": "application/json",
            "request_id": request_id,
        }
        if self.bearer_token:
            headers["Authorization"] = f"Bearer {self.bearer_token}"

        payload_content = _json_payload_bytes(body)
        _log_request_payload(
            "Self-hosted sync",
            request_id,
            batch_horizon,
            payload_content,
            mixin=mixin,
        )

        start = time.time()
        logger.info(
            "CDTSM: Self-hosted infer POST (request_id=%s, horizon=%s)",
            request_id,
            batch_horizon,
        )
        try:
            response = requests.post(
                url,
                data=payload_content,
                headers=headers,
                params={"horizon": batch_horizon},
                timeout=self.timeout_seconds,
            )
        except requests.exceptions.Timeout as e:
            logger.warning(
                "CDTSM: Self-hosted infer timed out after %s s (request_id=%s)",
                self.timeout_seconds,
                request_id,
            )
            raise RuntimeError(
                f"CDTSM: Self-hosted inference timed out after {int(self.timeout_seconds)} seconds. "
                "Increase the timeout or reduce forecast horizon."
            ) from e
        except requests.exceptions.ConnectionError as e:
            logger.warning(
                "CDTSM: Self-hosted connection error (request_id=%s): %s",
                request_id,
                type(e).__name__,
            )
            raise RuntimeError(
                "CDTSM: Could not connect to the self-hosted CDTSM endpoint. "
                "Verify the URL, network path, and TLS configuration."
            ) from e

        elapsed = time.time() - start
        log_cdtsm_api_call(
            url,
            elapsed,
            response.status_code,
            0,
            is_groupby=1 if getattr(mixin, "forecast_by", None) else 0,
        )

        if response.status_code == 401 or response.status_code == 403:
            raise RuntimeError(
                "CDTSM: Self-hosted endpoint rejected credentials (HTTP "
                f"{response.status_code}). Check the bearer token or server auth settings."
            )

        if 400 <= response.status_code < 500:
            detail = _safe_response_snippet(response)
            raise RuntimeError(
                f"CDTSM: Self-hosted inference failed with client error HTTP {response.status_code}. {detail}"
            )

        if response.status_code >= 500:
            detail = _safe_response_snippet(response)
            raise RuntimeError(
                f"CDTSM: Self-hosted inference failed with server error HTTP {response.status_code}. {detail}"
            )

        try:
            raw = response.json()
        except ValueError as e:
            raise RuntimeError("CDTSM: Self-hosted endpoint returned non-JSON response.") from e

        return normalize_infer_response(raw)

    async def infer_async(
        self,
        mixin: Any,
        payload: Dict[str, Any],
        batch_horizon: int,
    ) -> Dict[str, Any]:
        url = self_hosted_infer_url(self.base_url)
        body = build_self_hosted_request_body(payload, self.model_name)
        request_id = str(uuid.uuid4())

        headers: Dict[str, str] = {
            "Content-Type": "application/json",
            "request_id": request_id,
        }
        if self.bearer_token:
            headers["Authorization"] = f"Bearer {self.bearer_token}"

        import httpx

        encode_start = time.time()
        payload_content = await asyncio.to_thread(_json_payload_bytes, body)
        encode_elapsed = time.time() - encode_start
        _log_request_payload(
            "Self-hosted async",
            request_id,
            batch_horizon,
            payload_content,
            mixin=mixin,
        )

        start = time.time()
        logger.info(
            "CDTSM: Self-hosted async infer POST (request_id=%s, horizon=%s)",
            request_id,
            batch_horizon,
        )
        try:
            async with httpx.AsyncClient(
                timeout=self.timeout_seconds,
                trust_env=False,
            ) as client:
                response = await client.post(
                    url,
                    content=payload_content,
                    headers=headers,
                    params={"horizon": batch_horizon},
                )
        except httpx.TimeoutException as e:
            logger.warning(
                "CDTSM: Self-hosted async infer timed out after %s s (request_id=%s)",
                self.timeout_seconds,
                request_id,
            )
            raise RuntimeError(
                f"CDTSM: Self-hosted inference timed out after {int(self.timeout_seconds)} seconds. "
                "Increase the timeout or reduce forecast horizon."
            ) from e
        except httpx.NetworkError as e:
            logger.warning(
                "CDTSM: Self-hosted async connection error (request_id=%s): %s",
                request_id,
                type(e).__name__,
            )
            raise RuntimeError(
                "CDTSM: Could not connect to the self-hosted CDTSM endpoint. "
                "Verify the URL, network path, and TLS configuration."
            ) from e

        elapsed = time.time() - start
        log_cdtsm_api_call(
            url,
            elapsed,
            response.status_code,
            0,
            is_groupby=1 if getattr(mixin, "forecast_by", None) else 0,
        )

        if response.status_code == 401 or response.status_code == 403:
            raise RuntimeError(
                "CDTSM: Self-hosted endpoint rejected credentials (HTTP "
                f"{response.status_code}). Check the bearer token or server auth settings."
            )

        if 400 <= response.status_code < 500:
            detail = _safe_httpx_response_snippet(response)
            raise RuntimeError(
                f"CDTSM: Self-hosted inference failed with client error HTTP {response.status_code}. {detail}"
            )

        if response.status_code >= 500:
            detail = _safe_httpx_response_snippet(response)
            raise RuntimeError(
                f"CDTSM: Self-hosted inference failed with server error HTTP {response.status_code}. {detail}"
            )

        try:
            raw = response.json()
        except ValueError as e:
            raise RuntimeError("CDTSM: Self-hosted endpoint returned non-JSON response.") from e

        return normalize_infer_response(raw)


def _safe_response_snippet(response: requests.Response, max_len: int = 500) -> str:
    try:
        text = response.text or ""
    except Exception:
        return ""
    text = text.replace("\n", " ").strip()
    if len(text) > max_len:
        text = text[:max_len] + "..."
    return text


def _safe_httpx_response_snippet(response: Any, max_len: int = 500) -> str:
    try:
        text = response.text or ""
    except Exception:
        return ""
    text = text.replace("\n", " ").strip()
    if len(text) > max_len:
        text = text[:max_len] + "..."
    return text


def _json_payload_bytes(payload: Dict[str, Any]) -> bytes:
    """Serialize a request payload once, using compact JSON."""
    return json.dumps(payload, separators=(",", ":")).encode("utf-8")


def _should_suppress_payload_log(mixin: Any) -> bool:
    """Skip the full request-body log when the algorithm is in a high-frequency mode.

    BY-grouping anomaly and forecast paths set
    ``_cdtsm_suppress_high_frequency_logs`` on the algorithm because they may emit
    hundreds-to-thousands of inference calls per SPL invocation; logging the full
    payload for each call floods the search log and dwarfs the actual telemetry.
    """
    if mixin is None:
        return False
    return bool(getattr(mixin, "_cdtsm_suppress_high_frequency_logs", False))


def _log_request_payload(
    label: str,
    request_id: str,
    batch_horizon: int,
    payload_content: bytes,
    mixin: Optional[Any] = None,
):
    """Log a metadata-only marker for the outgoing inference request.

    The raw JSON body is intentionally NOT logged: it contains the cleaned
    user time-series values (per-metric float arrays after preprocessing /
    interpolation) that are sent to the inference endpoint. Logging the body
    would expose customer metric data in ``splunkd`` / ``python.log``.

    Only non-sensitive correlation metadata (transport label, request_id,
    horizon, payload byte size) is emitted. Per-request timings and
    request_ids are still emitted by the surrounding transport code.

    When the caller passes a ``mixin`` and that mixin has the high-frequency
    log suppression flag set (e.g. BY-grouping flows), this marker is also
    skipped to avoid log flooding.
    """
    if _should_suppress_payload_log(mixin):
        return
    logger.info(
        "CDTSM: %s request (request_id=%s, horizon=%s, payload_bytes=%d)",
        label,
        request_id,
        batch_horizon,
        len(payload_content),
    )


def _call_hosted_scs_infer(
    mixin: Any,
    payload: Dict[str, Any],
    batch_horizon: int,
    *,
    force_fresh_connection: bool = False,
) -> Dict[str, Any]:
    """Existing SCS tenant infer implementation (moved from ApiClientMixin._call_endpoint).

    Reads an optional ``_cdtsm_rate_limiter`` from ``mixin`` (set by the
    forecast scheduler) and gates each request on it. When
    ``force_fresh_connection`` is true (scheduler-level retry), sends
    ``Connection: close`` so the response's connection is not reused.
    """

    if not mixin._searchinfo:
        raise RuntimeError("CDTSM: Cannot obtain SCS token. searchinfo not available.")

    try:
        tenant, tenant_hostname = get_tentantinfo_from_session(mixin._searchinfo)
        endpoint = f"https://{tenant_hostname}/{tenant}/slim-api/v1alpha1/ai/infer"
    except Exception as e:
        logger.error("CDTSM: Failed to get tenant info: %s", str(e))
        raise RuntimeError(f"CDTSM: Failed to determine API endpoint: {str(e)}")

    try:
        mixin._scs_token, mixin._scs_token_expiry = get_cached_scs_token(
            mixin._scs_token, mixin._scs_token_expiry, mixin._searchinfo
        )
        token = mixin._scs_token
    except Exception as e:
        logger.error("CDTSM: Failed to fetch SCS token: %s", str(e))
        raise RuntimeError(f"CDTSM: Unable to obtain SCS token: {str(e)}")

    rate_limiter = getattr(mixin, "_cdtsm_rate_limiter", None)

    MAX_429_RETRIES = 3
    MAX_NETWORK_RETRIES = 2
    MAX_TIMEOUT_RETRIES = 2
    MAX_AUTH_RETRIES = 3
    retry_count_429 = 0
    retry_count_network = 0
    retry_count_timeout = 0
    retry_count_auth = 0

    if rate_limiter is not None:
        rate_limiter.acquire()

    while True:
        try:
            request_id = str(uuid.uuid4())
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
                "request_id": request_id,
            }
            if force_fresh_connection:
                headers["Connection"] = "close"
            payload_content = _json_payload_bytes(payload)
            _log_request_payload(
                "Hosted sync",
                request_id,
                batch_horizon,
                payload_content,
                mixin=mixin,
            )
            start_time = time.time()
            logger.info("CDTSM: Sending payload to hosted API")
            response = requests.post(
                endpoint,
                data=payload_content,
                headers=headers,
                params={"horizon": batch_horizon},
                timeout=300,
            )
            end_time = time.time()

            if response.status_code == 404:
                raise RuntimeError(CDTSM_UPSTREAM_UNAVAILABLE_MSG)

            if response.status_code in [401, 498]:
                logger.warning(
                    "CDTSM: Received status %s, regenerating token",
                    response.status_code,
                )
                mixin._scs_token = None
                mixin._scs_token_expiry = None
                try:
                    mixin._scs_token, mixin._scs_token_expiry = get_cached_scs_token(
                        mixin._scs_token, mixin._scs_token_expiry, mixin._searchinfo
                    )
                    token = mixin._scs_token
                except Exception as e:
                    logger.error("CDTSM: Failed to regenerate token: %s", str(e))
                    raise RuntimeError(f"CDTSM: Token regeneration failed: {str(e)}")

                retry_count_auth += 1
                if retry_count_auth <= MAX_AUTH_RETRIES:
                    backoff_time = jittered_delay(2 ** (retry_count_auth - 1))
                    logger.info(
                        "CDTSM: Retrying after auth refresh in %.2fs...",
                        backoff_time,
                    )
                    time.sleep(backoff_time)
                    continue
                raise RuntimeError(
                    f"CDTSM: API call failed after {MAX_AUTH_RETRIES} retries with auth errors"
                )

            if response.status_code == 429:
                retry_count_429 += 1
                _is_groupby_flag = 1 if getattr(mixin, "forecast_by", None) else 0
                if retry_count_429 <= MAX_429_RETRIES:
                    log_cdtsm_rate_limit(
                        endpoint,
                        retry_count_429,
                        MAX_429_RETRIES,
                        exhausted=False,
                        is_groupby=_is_groupby_flag,
                    )
                    backoff_time = jittered_delay(5 * (3 ** (retry_count_429 - 1)))
                    logger.warning(
                        "CDTSM: Rate limit exceeded (429). Retry %s/%s after %.2fs",
                        retry_count_429,
                        MAX_429_RETRIES,
                        backoff_time,
                    )
                    time.sleep(backoff_time)
                    continue
                log_cdtsm_rate_limit(
                    endpoint,
                    retry_count_429,
                    MAX_429_RETRIES,
                    exhausted=True,
                    is_groupby=_is_groupby_flag,
                )
                raise CDTSMRateLimitRetryExhausted(
                    f"CDTSM: API call failed after {MAX_429_RETRIES} retries due to rate limiting (429)"
                )

            response.raise_for_status()
            result = response.json()
            response_time = end_time - start_time
            total_retries = (
                retry_count_429 + retry_count_network + retry_count_timeout + retry_count_auth
            )
            log_cdtsm_api_call(
                endpoint,
                response_time,
                response.status_code,
                total_retries,
                is_groupby=1 if getattr(mixin, "forecast_by", None) else 0,
            )
            logger.info("CDTSM: Received successful response from API")
            if total_retries > 0:
                logger.info("CDTSM: Success after %s retries", total_retries)
            return result

        except requests.exceptions.Timeout:
            retry_count_timeout += 1
            if retry_count_timeout <= MAX_TIMEOUT_RETRIES:
                backoff_time = jittered_delay(5 * (3 ** (retry_count_timeout - 1)))
                logger.warning(
                    "CDTSM: API call timed out. Retry %s/%s after %.2fs",
                    retry_count_timeout,
                    MAX_TIMEOUT_RETRIES,
                    backoff_time,
                )
                time.sleep(backoff_time)
                continue
            raise RuntimeError(
                f"CDTSM: API call timed out after {MAX_TIMEOUT_RETRIES} retries. "
                "Please try again or reduce horizon."
            )

        except requests.exceptions.ConnectionError as e:
            if isinstance(e, requests.exceptions.SSLError):
                logger.error("CDTSM predictions failed with SSL error: %s", str(e))
                raise RuntimeError("CDTSM API call failed with SSL error") from e
            retry_count_network += 1
            if retry_count_network <= MAX_NETWORK_RETRIES:
                backoff_time = jittered_delay(5 * (3 ** (retry_count_network - 1)))
                logger.warning(
                    "CDTSM: Hosted sync connection error. Retry %s/%s after %.2fs: %s",
                    retry_count_network,
                    MAX_NETWORK_RETRIES,
                    backoff_time,
                    str(e),
                )
                time.sleep(backoff_time)
                continue
            logger.warning(
                "CDTSM: Hosted sync connection error exhausted local retries; "
                "surfacing as transient for scheduler-level requeue: %s",
                str(e),
            )
            raise CDTSMUpstreamTransientError(CDTSM_UPSTREAM_UNAVAILABLE_MSG) from e

        except requests.exceptions.HTTPError:
            logger.error("CDTSM predictions failed with HTTP error")
            error_msg = "CDTSM predictions failed with HTTP error."
            if "response" in locals() and response is not None:
                try:
                    error_msg += f" with status {response.status_code}"
                except Exception as e:
                    error_msg += f" with status 500"
                try:
                    error_response = response.json()
                    if isinstance(error_response, dict) and "error_message" in error_response:
                        error_msg += f" error_message: {error_response['error_message']}"
                    elif (
                        isinstance(error_response, dict) and "error_response" in error_response
                    ):
                        error_msg += f" error_response: {error_response['error_response']}"
                    else:
                        error_msg += f" response: {response.text}"
                except Exception as e:
                    error_msg += f" response: {response.text}"

            raise RuntimeError(error_msg)

        except RuntimeError:
            raise

        except Exception as e:
            logger.error("CDTSM predictions failed with unexpected error: %s", str(e))
            raise RuntimeError(f"CDTSM API call failed: {type(e).__name__}: {e}") from e


async def _call_hosted_scs_infer_async(
    mixin: Any, payload: Dict[str, Any], batch_horizon: int
) -> Dict[str, Any]:
    """Async hosted SCS infer implementation for asyncio fan-out."""
    if not mixin._searchinfo:
        raise RuntimeError("CDTSM: Cannot obtain SCS token. searchinfo not available.")

    try:
        tenant, tenant_hostname = get_tentantinfo_from_session(mixin._searchinfo)
        endpoint = f"https://{tenant_hostname}/{tenant}/slim-api/v1alpha1/ai/infer"
    except Exception as e:
        logger.error("CDTSM: Failed to get tenant info: %s", str(e))
        raise RuntimeError(f"CDTSM: Failed to determine API endpoint: {str(e)}")

    try:
        mixin._scs_token, mixin._scs_token_expiry = get_cached_scs_token(
            mixin._scs_token, mixin._scs_token_expiry, mixin._searchinfo
        )
        token = mixin._scs_token
    except Exception as e:
        logger.error("CDTSM: Failed to fetch SCS token: %s", str(e))
        raise RuntimeError(f"CDTSM: Unable to obtain SCS token: {str(e)}")

    import httpx

    MAX_RETRIES = 3
    retry_count = 0

    while retry_count <= MAX_RETRIES:
        try:
            request_id = str(uuid.uuid4())
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
                "request_id": request_id,
            }
            encode_start = time.time()
            payload_content = await asyncio.to_thread(_json_payload_bytes, payload)
            encode_elapsed = time.time() - encode_start
            _log_request_payload(
                "Hosted async",
                request_id,
                batch_horizon,
                payload_content,
                mixin=mixin,
            )

            start_time = time.time()
            logger.info("CDTSM: Sending async payload to hosted API")
            async with httpx.AsyncClient(timeout=300, trust_env=False) as client:
                response = await client.post(
                    endpoint,
                    content=payload_content,
                    headers=headers,
                    params={"horizon": batch_horizon},
                )
            end_time = time.time()

            if response.status_code == 404:
                raise RuntimeError(CDTSM_UPSTREAM_UNAVAILABLE_MSG)

            if response.status_code in [401, 498]:
                logger.warning(
                    "CDTSM: Received status %s, regenerating token",
                    response.status_code,
                )
                mixin._scs_token = None
                mixin._scs_token_expiry = None
                try:
                    mixin._scs_token, mixin._scs_token_expiry = get_cached_scs_token(
                        mixin._scs_token, mixin._scs_token_expiry, mixin._searchinfo
                    )
                    token = mixin._scs_token
                except Exception as e:
                    logger.error("CDTSM: Failed to regenerate token: %s", str(e))
                    raise RuntimeError(f"CDTSM: Token regeneration failed: {str(e)}")

                retry_count += 1
                if retry_count <= MAX_RETRIES:
                    backoff_time = 2 ** (retry_count - 1)
                    logger.info("CDTSM: Retrying in %s seconds...", backoff_time)
                    await asyncio.sleep(backoff_time)
                    continue
                raise RuntimeError(
                    f"CDTSM: API call failed after {MAX_RETRIES} retries with auth errors"
                )

            if response.status_code == 429:
                retry_count += 1
                _is_groupby_flag = 1 if getattr(mixin, "forecast_by", None) else 0
                if retry_count <= MAX_RETRIES:
                    log_cdtsm_rate_limit(
                        endpoint,
                        retry_count,
                        MAX_RETRIES,
                        exhausted=False,
                        is_groupby=_is_groupby_flag,
                    )
                    backoff_time = 5 * (3 ** (retry_count - 1))
                    logger.warning(
                        "CDTSM: Rate limit exceeded (429). Retry %s/%s after %ss",
                        retry_count,
                        MAX_RETRIES,
                        backoff_time,
                    )
                    await asyncio.sleep(backoff_time)
                    continue
                log_cdtsm_rate_limit(
                    endpoint,
                    retry_count,
                    MAX_RETRIES,
                    exhausted=True,
                    is_groupby=_is_groupby_flag,
                )
                raise CDTSMRateLimitRetryExhausted(
                    f"CDTSM: API call failed after {MAX_RETRIES} retries due to rate limiting (429)"
                )

            response.raise_for_status()
            parse_start = time.time()
            result = response.json()
            parse_elapsed = time.time() - parse_start
            response_time = end_time - start_time
            log_cdtsm_api_call(
                endpoint,
                response_time,
                response.status_code,
                retry_count,
                is_groupby=1 if getattr(mixin, "forecast_by", None) else 0,
            )
            logger.info(
                "CDTSM: Hosted async client timings payload_entries=%d — "
                "json_encode=%.4fs, http_roundtrip=%.4fs, response_parse=%.4fs, total=%.4fs",
                len(payload.get("payload", [])),
                encode_elapsed,
                response_time,
                parse_elapsed,
                encode_elapsed + response_time + parse_elapsed,
            )
            logger.info("CDTSM: Received successful async response from API")
            if retry_count > 0:
                logger.info("CDTSM: Success after %s retries", retry_count)
            return result

        except httpx.TimeoutException:
            retry_count += 1
            if retry_count <= MAX_RETRIES:
                backoff_time = 2 ** (retry_count - 1)
                logger.warning(
                    "CDTSM: API call timed out. Retry %s/%s after %ss",
                    retry_count,
                    MAX_RETRIES,
                    backoff_time,
                )
                await asyncio.sleep(backoff_time)
                continue
            raise RuntimeError(
                f"CDTSM: API call timed out after {MAX_RETRIES} retries. "
                "Please try again or reduce horizon."
            )

        except httpx.NetworkError as e:
            retry_count += 1
            if retry_count <= MAX_RETRIES:
                backoff_time = 2 ** (retry_count - 1)
                logger.warning(
                    "CDTSM: Hosted async (standalone) connection error. "
                    "Retry %s/%s after %ss: %s",
                    retry_count,
                    MAX_RETRIES,
                    backoff_time,
                    str(e),
                )
                await asyncio.sleep(backoff_time)
                continue
            logger.warning(
                "CDTSM: Hosted async (standalone) connection error exhausted local "
                "retries; surfacing as transient for scheduler-level requeue: %s",
                str(e),
            )
            raise CDTSMUpstreamTransientError(CDTSM_UPSTREAM_UNAVAILABLE_MSG) from e

        except httpx.HTTPStatusError:
            logger.error("CDTSM predictions failed with HTTP error")
            error_msg = "CDTSM predictions failed with HTTP error."
            try:
                error_msg += f" with status {response.status_code}"
            except Exception:
                error_msg += f" with status 500"
            try:
                error_response = response.json()
                if isinstance(error_response, dict) and "error_message" in error_response:
                    error_msg += f" error_message: {error_response['error_message']}"
                elif isinstance(error_response, dict) and "error_response" in error_response:
                    error_msg += f" error_response: {error_response['error_response']}"
                else:
                    error_msg += f" response: {response.text}"
            except Exception:
                error_msg += f" response: {response.text}"

            raise RuntimeError(error_msg)

        except RuntimeError:
            raise

        except Exception as e:
            logger.error("CDTSM predictions failed with unexpected error: %s", str(e))
            raise RuntimeError(f"CDTSM API call failed: {type(e).__name__}: {e}") from e

    raise RuntimeError(f"CDTSM: API call failed after {MAX_RETRIES} retries")


def resolve_forecast_provider(
    searchinfo: Optional[Dict[str, Any]],
) -> ForecastProvider:
    """
    Choose hosted vs self-hosted from mlspl.conf [CTSM].

    Non-empty ``self_hosted_cdtsm_endpoint`` in mlspl.conf [CTSM] selects self-hosted
    inference (POST to that fully qualified infer URL).  The bearer token is fetched
    from storage/passwords only when the self-hosted path is active.
    Empty endpoint uses Splunk-hosted slim-api + SCS bearer (existing behavior).
    """
    if not searchinfo:
        return HostedCdtsmProvider()

    try:
        params = CTSMConfUtil(searchinfo).get_self_hosted_cdtsm_params()
    except Exception as e:
        logger.warning(
            "CDTSM: Could not read self-hosted config; using hosted provider: %s",
            type(e).__name__,
        )
        return HostedCdtsmProvider()

    base_url = params["endpoint"]
    if not base_url:
        return HostedCdtsmProvider()

    model = params["model"]
    timeout = params["timeout"]

    ok_u, msg_u = validate_self_hosted_base_url(base_url)
    if not ok_u:
        raise RuntimeError(f"CDTSM: {msg_u}")

    bearer_token = _fetch_cdtsm_auth_token(searchinfo)

    return SelfHostedCdtsmProvider(
        base_url=base_url,
        model_name=model,
        timeout_seconds=timeout,
        bearer_token=bearer_token,
    )


def infer_with_resolved_provider(
    mixin: Any,
    payload: Dict[str, Any],
    batch_horizon: int,
    *,
    force_fresh_connection: bool = False,
) -> Dict[str, Any]:
    """Entry point from ApiClientMixin._call_endpoint.

    For self-hosted deployments the bearer token is read from Splunk storage
    passwords (realm=``aitk_fm_tokens``, key=``CDTSM_AUTH_TOKEN``) and forwarded
    as the ``Authorization: Bearer <token>`` header.  When no token is stored the
    request is sent unauthenticated, preserving backward-compatible behaviour.
    The token lookup only happens when ``self_hosted_cdtsm_endpoint`` is configured.

    ``force_fresh_connection`` is honored only by the hosted (SCS) provider —
    self-hosted endpoints manage their own transport policies.
    """
    searchinfo = getattr(mixin, "_searchinfo", None)
    provider = resolve_forecast_provider(searchinfo)
    if isinstance(provider, HostedCdtsmProvider):
        return provider.infer(
            mixin, payload, batch_horizon, force_fresh_connection=force_fresh_connection
        )
    return provider.infer(mixin, payload, batch_horizon)


async def infer_with_resolved_provider_async(
    mixin: Any,
    payload: Dict[str, Any],
    batch_horizon: int,
) -> Dict[str, Any]:
    """Async entry point from ApiClientMixin._call_endpoint_async."""
    searchinfo = getattr(mixin, "_searchinfo", None)
    provider = resolve_forecast_provider(searchinfo)
    return await provider.infer_async(mixin, payload, batch_horizon)


class _HostedAsyncInferSession:
    """Reusable hosted async transport for many concurrent inference calls.

    Supports:
      * Client-side rate limiting via an injected ``_AsyncTokenBucket`` so the
        scheduler can throttle starts to a fraction of the server quota.
      * ``force_fresh_connection=True`` on retried calls, which sends
        ``Connection: close`` so the response's connection is not returned to
        the pool. Combined with the 60s+ requeue delay (longer than httpx's
        default 5s keepalive expiry) this guarantees retries do not inherit
        pooled state from a failed prior attempt.
      * ``reset()`` to fully rebuild the underlying ``httpx.AsyncClient``
        when the scheduler detects a streak of transient errors that suggest
        wedged TLS / DNS / HTTP-2 state on the client itself.
    """

    def __init__(self, mixin: Any, rate_limiter: Optional[_AsyncTokenBucket] = None):
        self.mixin = mixin
        self.endpoint = None
        self.token = None
        self.client = None
        self.rate_limiter = rate_limiter

    async def _build_client(self):
        """Create a fresh ``httpx.AsyncClient`` for this session."""
        import httpx

        return httpx.AsyncClient(
            timeout=300,
            trust_env=False,
        )

    async def __aenter__(self):
        if not self.mixin._searchinfo:
            raise RuntimeError("CDTSM: Cannot obtain SCS token. searchinfo not available.")

        try:
            tenant, tenant_hostname = get_tentantinfo_from_session(self.mixin._searchinfo)
            self.endpoint = f"https://{tenant_hostname}/{tenant}/slim-api/v1alpha1/ai/infer"
        except Exception as e:
            logger.error("CDTSM: Failed to get tenant info: %s", str(e))
            raise RuntimeError(f"CDTSM: Failed to determine API endpoint: {str(e)}")

        try:
            self.mixin._scs_token, self.mixin._scs_token_expiry = get_cached_scs_token(
                self.mixin._scs_token,
                self.mixin._scs_token_expiry,
                self.mixin._searchinfo,
            )
            self.token = self.mixin._scs_token
        except Exception as e:
            logger.error("CDTSM: Failed to fetch SCS token: %s", str(e))
            raise RuntimeError(f"CDTSM: Unable to obtain SCS token: {str(e)}")

        self.client = await self._build_client()
        return self

    async def __aexit__(self, exc_type, exc, tb):
        if self.client is not None:
            await self.client.aclose()
            self.client = None
        return False

    async def reset(self) -> None:
        """Close and rebuild the underlying ``httpx.AsyncClient``.

        Callers must ensure no in-flight requests are using the existing
        client (typically by draining ``pending`` first). After reset the
        next ``infer()`` call opens a brand-new TCP+TLS connection with no
        residual pool, TLS-session, DNS, or HTTP/2 state from the prior
        client.
        """
        old_client = self.client
        self.client = None
        if old_client is not None:
            try:
                await old_client.aclose()
            except Exception as exc:  # pragma: no cover - defensive
                logger.debug(
                    "CDTSM: async client aclose during reset raised %s; continuing.",
                    type(exc).__name__,
                )
        self.client = await self._build_client()
        logger.info("CDTSM: Hosted async transport reset — new AsyncClient created.")

    async def infer(
        self,
        payload: Dict[str, Any],
        batch_horizon: int,
        *,
        force_fresh_connection: bool = False,
    ) -> Dict[str, Any]:
        import httpx

        # 429 retries: 3 attempts with 5s/15s/45s base backoff + jitter. 429
        # responses come back fast, so even three attempts cost <2 minutes
        # of wall time inclusive of backoff.
        MAX_429_RETRIES = 3
        # NetworkError retries: 2 attempts with 5s/15s base backoff. Sized
        # for slow upstream responses where a single failed network attempt
        # can itself take 30+ seconds before surfacing; we keep local retry
        # latency bounded and let the scheduler-level requeue handle longer
        # outages with fresh connections (force_fresh_connection=True).
        MAX_NETWORK_RETRIES = 2
        MAX_TIMEOUT_RETRIES = 2
        MAX_AUTH_RETRIES = 3
        retry_count_429 = 0
        retry_count_network = 0
        retry_count_timeout = 0
        retry_count_auth = 0

        if self.rate_limiter is not None:
            await self.rate_limiter.acquire()

        while True:
            try:
                request_id = str(uuid.uuid4())
                headers = {
                    "Authorization": f"Bearer {self.token}",
                    "Content-Type": "application/json",
                    "request_id": request_id,
                }
                if force_fresh_connection:
                    # Defense in depth on scheduler-level retries: instruct
                    # the server to close the underlying TCP connection
                    # after responding so httpx removes it from the pool.
                    headers["Connection"] = "close"
                encode_start = time.time()
                payload_content = await asyncio.to_thread(_json_payload_bytes, payload)
                encode_elapsed = time.time() - encode_start
                _log_request_payload(
                    "Hosted async",
                    request_id,
                    batch_horizon,
                    payload_content,
                    mixin=self.mixin,
                )

                start_time = time.time()
                logger.info("CDTSM: Sending async payload to hosted API")
                response = await self.client.post(
                    self.endpoint,
                    content=payload_content,
                    headers=headers,
                    params={"horizon": batch_horizon},
                )
                end_time = time.time()

                if response.status_code == 404:
                    raise RuntimeError(CDTSM_UPSTREAM_UNAVAILABLE_MSG)

                if response.status_code in [401, 498]:
                    logger.warning(
                        "CDTSM: Received status %s, regenerating token",
                        response.status_code,
                    )
                    self.mixin._scs_token = None
                    self.mixin._scs_token_expiry = None
                    try:
                        (
                            self.mixin._scs_token,
                            self.mixin._scs_token_expiry,
                        ) = get_cached_scs_token(
                            self.mixin._scs_token,
                            self.mixin._scs_token_expiry,
                            self.mixin._searchinfo,
                        )
                        self.token = self.mixin._scs_token
                    except Exception as e:
                        logger.error("CDTSM: Failed to regenerate token: %s", str(e))
                        raise RuntimeError(f"CDTSM: Token regeneration failed: {str(e)}")

                    retry_count_auth += 1
                    if retry_count_auth <= MAX_AUTH_RETRIES:
                        backoff_time = jittered_delay(2 ** (retry_count_auth - 1))
                        logger.info(
                            "CDTSM: Retrying after auth refresh in %.2fs...",
                            backoff_time,
                        )
                        await asyncio.sleep(backoff_time)
                        continue
                    raise RuntimeError(
                        f"CDTSM: API call failed after {MAX_AUTH_RETRIES} retries with auth errors"
                    )

                if response.status_code == 429:
                    retry_count_429 += 1
                    _is_groupby_flag = 1 if getattr(self.mixin, "forecast_by", None) else 0
                    if retry_count_429 <= MAX_429_RETRIES:
                        log_cdtsm_rate_limit(
                            self.endpoint,
                            retry_count_429,
                            MAX_429_RETRIES,
                            exhausted=False,
                            is_groupby=_is_groupby_flag,
                        )
                        backoff_time = jittered_delay(5 * (3 ** (retry_count_429 - 1)))
                        logger.warning(
                            "CDTSM: Rate limit exceeded (429). Retry %s/%s after %.2fs",
                            retry_count_429,
                            MAX_429_RETRIES,
                            backoff_time,
                        )
                        await asyncio.sleep(backoff_time)
                        continue
                    log_cdtsm_rate_limit(
                        self.endpoint,
                        retry_count_429,
                        MAX_429_RETRIES,
                        exhausted=True,
                        is_groupby=_is_groupby_flag,
                    )
                    raise CDTSMRateLimitRetryExhausted(
                        f"CDTSM: API call failed after {MAX_429_RETRIES} retries due to rate limiting (429)"
                    )

                response.raise_for_status()
                parse_start = time.time()
                result = response.json()
                parse_elapsed = time.time() - parse_start
                response_time = end_time - start_time
                total_retries = (
                    retry_count_429
                    + retry_count_network
                    + retry_count_timeout
                    + retry_count_auth
                )
                log_cdtsm_api_call(
                    self.endpoint,
                    response_time,
                    response.status_code,
                    total_retries,
                    is_groupby=1 if getattr(self.mixin, "forecast_by", None) else 0,
                )
                logger.info(
                    "CDTSM: Hosted async client timings payload_entries=%d — "
                    "json_encode=%.4fs, http_roundtrip=%.4fs, response_parse=%.4fs, total=%.4fs",
                    len(payload.get("payload", [])),
                    encode_elapsed,
                    response_time,
                    parse_elapsed,
                    encode_elapsed + response_time + parse_elapsed,
                )
                logger.info("CDTSM: Received successful async response from API")
                if total_retries > 0:
                    logger.info("CDTSM: Success after %s retries", total_retries)
                return result

            except httpx.TimeoutException:
                retry_count_timeout += 1
                if retry_count_timeout <= MAX_TIMEOUT_RETRIES:
                    backoff_time = jittered_delay(5 * (3 ** (retry_count_timeout - 1)))
                    logger.warning(
                        "CDTSM: API call timed out. Retry %s/%s after %.2fs",
                        retry_count_timeout,
                        MAX_TIMEOUT_RETRIES,
                        backoff_time,
                    )
                    await asyncio.sleep(backoff_time)
                    continue
                raise RuntimeError(
                    f"CDTSM: API call timed out after {MAX_TIMEOUT_RETRIES} retries. "
                    "Please try again or reduce horizon."
                )

            except httpx.NetworkError as e:
                retry_count_network += 1
                if retry_count_network <= MAX_NETWORK_RETRIES:
                    backoff_time = jittered_delay(5 * (3 ** (retry_count_network - 1)))
                    logger.warning(
                        "CDTSM: Hosted async connection error. Retry %s/%s after %.2fs: %s",
                        retry_count_network,
                        MAX_NETWORK_RETRIES,
                        backoff_time,
                        str(e),
                    )
                    await asyncio.sleep(backoff_time)
                    continue
                logger.warning(
                    "CDTSM: Hosted async connection error exhausted local retries; "
                    "surfacing as transient for scheduler-level requeue: %s",
                    str(e),
                )
                raise CDTSMUpstreamTransientError(CDTSM_UPSTREAM_UNAVAILABLE_MSG) from e

            except httpx.HTTPStatusError:
                logger.error("CDTSM predictions failed with HTTP error")
                error_msg = "CDTSM predictions failed with HTTP error."
                try:
                    error_msg += f" with status {response.status_code}"
                except Exception:
                    error_msg += f" with status 500"
                try:
                    error_response = response.json()
                    if isinstance(error_response, dict) and "error_message" in error_response:
                        error_msg += f" error_message: {error_response['error_message']}"
                    elif (
                        isinstance(error_response, dict) and "error_response" in error_response
                    ):
                        error_msg += f" error_response: {error_response['error_response']}"
                    else:
                        error_msg += f" response: {response.text}"
                except Exception:
                    error_msg += f" response: {response.text}"

                raise RuntimeError(error_msg)

            except RuntimeError:
                raise

            except Exception as e:
                logger.error("CDTSM predictions failed with unexpected error: %s", str(e))
                raise RuntimeError(f"CDTSM API call failed: {type(e).__name__}: {e}") from e


class _SelfHostedAsyncInferSession:
    """Reusable self-hosted async transport for many concurrent inference calls.

    ``mixin`` is held only to honor high-frequency log suppression (e.g. BY-grouping
    paths). It is not required for transport functionality.

    Concurrency against the customer-operated endpoint is bounded by the
    BY-grouping scheduler's ``max_concurrency`` setting from
    ``mlspl.conf [CTSM]`` (default ``CDTSM_API_MAX_CONCURRENCY_DEFAULT``).
    When a ``rate_limiter`` is provided, every ``infer()`` call awaits a
    token before issuing the HTTP POST so the configured
    ``rate_limit_per_minute`` is honored against self-hosted endpoints just
    as it is against the hosted SCS path.
    """

    def __init__(
        self,
        provider: SelfHostedCdtsmProvider,
        mixin: Optional[Any] = None,
        rate_limiter: Optional[_AsyncTokenBucket] = None,
    ):
        self.provider = provider
        self.mixin = mixin
        self.client = None
        self.rate_limiter = rate_limiter

    async def __aenter__(self):
        import httpx

        self.client = httpx.AsyncClient(
            timeout=self.provider.timeout_seconds,
            trust_env=False,
        )
        return self

    async def __aexit__(self, exc_type, exc, tb):
        if self.client is not None:
            await self.client.aclose()
        return False

    async def infer(
        self,
        payload: Dict[str, Any],
        batch_horizon: int,
        *,
        force_fresh_connection: bool = False,  # noqa: ARG002 - contract parity with _HostedAsyncInferSession
    ) -> Dict[str, Any]:
        # ``force_fresh_connection`` is accepted only to keep the call signature
        # in sync with ``_HostedAsyncInferSession.infer`` so the BY-grouping
        # scheduler in ``anomaly_mode.py`` can call either session uniformly.
        # Self-hosted endpoints manage their own transport policies, so the
        # flag is intentionally a no-op here (see ``infer_with_resolved_provider``).
        del force_fresh_connection
        import httpx

        url = self_hosted_infer_url(self.provider.base_url)
        body = build_self_hosted_request_body(payload, self.provider.model_name)
        request_id = str(uuid.uuid4())

        headers: Dict[str, str] = {
            "Content-Type": "application/json",
            "request_id": request_id,
        }
        if self.provider.bearer_token:
            headers["Authorization"] = f"Bearer {self.provider.bearer_token}"

        encode_start = time.time()
        payload_content = await asyncio.to_thread(_json_payload_bytes, body)
        encode_elapsed = time.time() - encode_start
        _log_request_payload(
            "Self-hosted async",
            request_id,
            batch_horizon,
            payload_content,
            mixin=self.mixin,
        )

        if self.rate_limiter is not None:
            await self.rate_limiter.acquire()

        start = time.time()
        logger.info(
            "CDTSM: Self-hosted async infer POST (request_id=%s, horizon=%s)",
            request_id,
            batch_horizon,
        )
        try:
            response = await self.client.post(
                url,
                content=payload_content,
                headers=headers,
                params={"horizon": batch_horizon},
            )
        except httpx.TimeoutException as e:
            logger.warning(
                "CDTSM: Self-hosted async infer timed out after %s s (request_id=%s)",
                self.provider.timeout_seconds,
                request_id,
            )
            raise RuntimeError(
                f"CDTSM: Self-hosted inference timed out after {int(self.provider.timeout_seconds)} seconds. "
                "Increase the timeout or reduce forecast horizon."
            ) from e
        except httpx.NetworkError as e:
            logger.warning(
                "CDTSM: Self-hosted async connection error (request_id=%s): %s",
                request_id,
                type(e).__name__,
            )
            raise RuntimeError(
                "CDTSM: Could not connect to the self-hosted CDTSM endpoint. "
                "Verify the URL, network path, and TLS configuration."
            ) from e

        elapsed = time.time() - start
        log_cdtsm_api_call(
            url,
            elapsed,
            response.status_code,
            0,
            is_groupby=1 if getattr(self.mixin, "forecast_by", None) else 0,
        )

        if response.status_code == 401 or response.status_code == 403:
            raise RuntimeError(
                "CDTSM: Self-hosted endpoint rejected credentials (HTTP "
                f"{response.status_code}). Check the bearer token or server auth settings."
            )

        if 400 <= response.status_code < 500:
            detail = _safe_httpx_response_snippet(response)
            raise RuntimeError(
                f"CDTSM: Self-hosted inference failed with client error HTTP {response.status_code}. {detail}"
            )

        if response.status_code >= 500:
            detail = _safe_httpx_response_snippet(response)
            raise RuntimeError(
                f"CDTSM: Self-hosted inference failed with server error HTTP {response.status_code}. {detail}"
            )

        try:
            parse_start = time.time()
            raw = response.json()
            parse_elapsed = time.time() - parse_start
        except ValueError as e:
            raise RuntimeError("CDTSM: Self-hosted endpoint returned non-JSON response.") from e

        logger.info(
            "CDTSM: Self-hosted async client timings payload_entries=%d — "
            "json_encode=%.4fs, http_roundtrip=%.4fs, response_parse=%.4fs, total=%.4fs",
            len(body.get("payload", [])),
            encode_elapsed,
            elapsed,
            parse_elapsed,
            encode_elapsed + elapsed + parse_elapsed,
        )
        return normalize_infer_response(raw)


def build_async_infer_session(
    mixin: Any,
    rate_limiter: Optional[_AsyncTokenBucket] = None,
):
    """Resolve transport once and return a reusable async inference session.

    When ``rate_limiter`` is provided it is attached to the resolved session
    (hosted or self-hosted) so that every ``infer()`` call awaits a token
    before sending. The ``rate_limit_per_minute`` setting from
    ``mlspl.conf [CTSM]`` is therefore honored uniformly across both
    transports; operators who want self-hosted endpoints to ignore the
    client-side limiter can set ``rate_limit_per_minute`` to a sufficiently
    high value (or remove the override).
    """
    searchinfo = getattr(mixin, "_searchinfo", None)
    provider = resolve_forecast_provider(searchinfo)
    if isinstance(provider, SelfHostedCdtsmProvider):
        return _SelfHostedAsyncInferSession(provider, mixin=mixin, rate_limiter=rate_limiter)
    return _HostedAsyncInferSession(mixin, rate_limiter=rate_limiter)
