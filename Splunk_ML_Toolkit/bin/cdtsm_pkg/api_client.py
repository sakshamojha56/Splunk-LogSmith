"""API client — HTTP calls, batching, retry logic, and token management."""

import concurrent.futures
import json
import math
import time
import uuid

import numpy as np
import pandas as pd
import requests

import cexc

from cdtsm_pkg.constants import (
    CDTSM_API_MAX_CONCURRENCY_DEFAULT,
    CDTSM_API_RATE_LIMIT_PER_MINUTE_DEFAULT,
    CDTSM_RATE_LIMIT_PROGRESS_MAX_WALL_TIME_SECONDS,
    CDTSM_RATE_LIMIT_PROGRESS_NO_PROGRESS_TIMEOUT_SECONDS,
    CDTSM_RATE_LIMIT_PROGRESS_RETRY_DELAY_SECONDS,
    CDTSM_TRANSIENT_STREAK_RESET_THRESHOLD,
    DEFAULT_TS_BATCH_SIZE,
    MAX_QUANTILE_HORIZON,
    NATIVE_FORECAST_HORIZON,
)

logger = cexc.get_logger(__name__)
messages = cexc.get_messages_logger()


class ApiClientMixin:
    """Mixin supplying API-transport methods for CDTSM forecasting.

    All ``self.*`` attributes (columns, percentiles, api_model_name,
    _searchinfo, _scs_token, _scs_token_expiry, ts_batch_size,
    holdback, future_points, etc.) are expected to be provided by
    the concrete class that inherits this mixin (i.e. PredictAI).
    """

    def _json_safe_value(self, value):
        """Convert NumPy/Pandas values in API payloads to JSON-serializable objects."""
        if isinstance(value, np.ndarray):
            return value.tolist()
        if isinstance(value, np.generic):
            return value.item()
        if isinstance(value, dict):
            return {k: self._json_safe_value(v) for k, v in value.items()}
        if isinstance(value, (list, tuple)):
            return [self._json_safe_value(v) for v in value]
        if not isinstance(value, (str, bytes)):
            try:
                if pd.isna(value):
                    return None
            except (TypeError, ValueError):
                pass
        return value

    def _json_safe_payload(self, payload):
        """Return a JSON-serializable copy of a CDTSM API payload."""
        return self._json_safe_value(payload)

    def _build_single_payload(self, df_data, horizon, columns=None):
        """Build API payload for a single batch of time series columns.

        Payload format (array-based, without field names):
        {
            "payload": [
                {"coarse_ctx": [...], "fine_ctx": [...]},  # First column
                {"coarse_ctx": [...], "fine_ctx": [...]}   # Second column
            ],
            "model": "<model_name>",
            "metadata": {"quantiles": ["mean", "p10", ...], "horizon": N}
        }

        The "model" field defaults to "CTSM" (when model_name=CDTSM) but can be
        overridden via the model_name parameter.

        Response forecasts are returned in the same order as the payload array.

        Args:
            df_data (pd.DataFrame): Dataframe with time series data (including any previous predictions)
            horizon (int): Number of points to forecast in this batch
            columns (list, optional): Specific columns to include in payload. Defaults to self.columns.

        Returns:
            dict: API request payload with array-based format
        """
        cols_to_process = columns if columns is not None else self.columns

        # Coarse/fine context generation mirrors the server-side
        # ``build_multi_resolution`` flow exactly: each preprocessed series
        # passes through ``_normalize_inputs`` and then the multi_res if-block,
        # which for single-resolution 1D arrays calls ``build_multi_resolution``
        # with the fixed aggregation factor. ``_build_payload_contexts``
        # encapsulates that flow so every payload site (forecast/anomaly,
        # BY/non-BY) builds contexts identically.
        payload_data = []
        for col in cols_to_process:
            series = df_data[col].to_numpy(dtype=float, copy=False)
            coarse_ctx, fine_ctx = self._build_payload_contexts(series)
            payload_data.append({"coarse_ctx": coarse_ctx, "fine_ctx": fine_ctx})

        quantiles_list = list(self.percentiles)

        request_payload = {
            "payload": payload_data,
            "model": self.api_model_name,
            "metadata": {"quantiles": quantiles_list, "horizon": horizon},
        }

        return request_payload

    def _forecast_with_batching(self, df_data, total_horizon):
        """Perform forecasting with parallel batching across time series columns.

        Batching strategy:
        - Splits time series columns into batches of ts_batch_size (default 500)
        - Processes column batches in parallel using ThreadPoolExecutor
        - Collates results from all batches into a single prediction dictionary

        Args:
            df_data (pd.DataFrame): Initial data to start forecasting from
            total_horizon (int): Total number of points to forecast (includes holdback if specified)

        Returns:
            dict: Combined predictions from all batches, keyed by column name
                  Format: {col: {percentile: [values]}}
        """
        total_columns = len(self.columns)
        num_batches = math.ceil(total_columns / self.ts_batch_size)

        if self.holdback > 0:
            logger.info(
                "CDTSM: Starting parallel column batching with holdback - "
                "holdback:%d, future:%d, total_horizon:%d, columns:%d, ts_batch_size:%d, num_batches:%d",
                self.holdback,
                self.future_points,
                total_horizon,
                total_columns,
                self.ts_batch_size,
                num_batches,
            )
        else:
            logger.info(
                "CDTSM: Starting parallel column batching - "
                "total_horizon:%d, columns:%d, ts_batch_size:%d, num_batches:%d",
                total_horizon,
                total_columns,
                self.ts_batch_size,
                num_batches,
            )

        all_predictions = {
            col: {percentile: [] for percentile in self.percentiles} for col in self.columns
        }

        def process_column_batch(batch_info, attempt=0):
            """Process a single batch of columns.

            Args:
                batch_info (tuple): (batch_idx, start, end)
                attempt (int): scheduler-level retry attempt index. When >0
                    the underlying HTTP call is forced onto a fresh
                    connection (``Connection: close`` header).

            Returns:
                tuple: (batch_idx, predictions_dict) where predictions_dict is keyed by column name
            """
            batch_idx, start, end = batch_info
            batch_columns = self.columns[start:end]

            logger.info(
                "CDTSM: Processing column batch %d/%d with %d columns%s",
                batch_idx + 1,
                num_batches,
                len(batch_columns),
                " [fresh connection]" if attempt > 0 else "",
            )

            _payload_t0 = time.perf_counter()
            payload = self._build_single_payload(df_data, total_horizon, columns=batch_columns)
            self._record_cdtsm_apply_timing(
                "materialization", time.perf_counter() - _payload_t0
            )

            start_time = time.perf_counter()
            if attempt > 0:
                # Scheduler-level retry — force a fresh TCP/TLS connection.
                # Pass the kwarg only on retries so test fakes that mock
                # ``_call_endpoint`` with the 2-arg signature keep working.
                response = self._call_endpoint(
                    payload, total_horizon, force_fresh_connection=True
                )
            else:
                response = self._call_endpoint(payload, total_horizon)
            elapsed = time.perf_counter() - start_time
            self._record_cdtsm_apply_timing("api", elapsed)
            logger.info(
                "CDTSM: Column batch %d/%d API call completed in %.2f seconds",
                batch_idx + 1,
                num_batches,
                elapsed,
            )

            _post_t0 = time.perf_counter()
            batch_predictions = self._prune_and_validate_response_for_columns(
                response, total_horizon, batch_columns
            )
            self._record_cdtsm_apply_timing("postprocessing", time.perf_counter() - _post_t0)

            return (batch_idx, batch_predictions)

        if num_batches == 1:
            logger.info("CDTSM: Single batch - processing without threading")
            _, batch_predictions = process_column_batch((0, 0, total_columns))
            all_predictions.update(batch_predictions)
        else:
            logger.info(
                "CDTSM: Processing %d column batches in parallel",
                num_batches,
            )

            import heapq
            import random

            from cdtsm_pkg.forecast_providers import (
                CDTSMRateLimitRetryExhausted,
                CDTSMUpstreamTransientError,
                build_sync_token_bucket,
            )

            # Read configurable throttle parameters; defaults if config read fails.
            try:
                from util.ctsm_conf_util import CTSMConfUtil

                throttle = CTSMConfUtil(self._searchinfo).get_cdtsm_api_throttle_params()
                rate_per_minute = float(throttle["rate_limit_per_minute"])
                max_concurrency_cfg = int(throttle["max_concurrency"])
            except Exception as e:  # pragma: no cover - defensive
                logger.warning(
                    "CDTSM: could not read API throttle params (%s); using defaults "
                    "rate=%s/min, concurrency=%d.",
                    type(e).__name__,
                    CDTSM_API_RATE_LIMIT_PER_MINUTE_DEFAULT,
                    CDTSM_API_MAX_CONCURRENCY_DEFAULT,
                )
                rate_per_minute = CDTSM_API_RATE_LIMIT_PER_MINUTE_DEFAULT
                max_concurrency_cfg = CDTSM_API_MAX_CONCURRENCY_DEFAULT

            # Install a process-local sync token bucket on the mixin so the
            # provider can gate each request before sending. Cleared after
            # the executor block so unrelated calls don't inherit it.
            prior_rate_limiter = getattr(self, "_cdtsm_rate_limiter", None)
            self._cdtsm_rate_limiter = build_sync_token_bucket(rate_per_minute)

            max_workers = min(num_batches, max_concurrency_cfg)
            logger.info(
                "CDTSM: Forecast batching — running %d batch(es) with up to %d "
                "concurrent worker(s), client-side rate limit=%.1f req/min.",
                num_batches,
                max_workers,
                rate_per_minute,
            )

            start_time = time.time()

            batch_error = None
            completed_batches = 0
            # Streak of CDTSMUpstreamTransientError across sibling batches.
            # Used only as a signal for logging; the sync transport doesn't
            # pool connections, so no client rebuild is needed here.
            consecutive_transient = 0

            with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
                future_to_batch = {}
                delayed = []
                delayed_seq = 0
                new_batches_exhausted = False
                started_at = time.monotonic()
                last_success_at = started_at
                batch_iter = enumerate(range(0, total_columns, self.ts_batch_size))

                def submit_batch(batch_info, attempt):
                    future = executor.submit(process_column_batch, batch_info, attempt)
                    future_to_batch[future] = (batch_info, attempt)

                def submit_next_new_batch():
                    nonlocal new_batches_exhausted
                    try:
                        idx, start = next(batch_iter)
                    except StopIteration:
                        new_batches_exhausted = True
                        return False
                    end = min(start + self.ts_batch_size, total_columns)
                    submit_batch((idx, start, end), attempt=0)
                    return True

                def submit_ready_delayed(now):
                    submitted = 0
                    while (
                        delayed and delayed[0][0] <= now and len(future_to_batch) < max_workers
                    ):
                        _ready_at, _seq, batch_info, attempt = heapq.heappop(delayed)
                        submit_batch(batch_info, attempt)
                        submitted += 1
                    return submitted

                def fill_pending_batches():
                    now = time.monotonic()
                    submit_ready_delayed(now)
                    if delayed:
                        # Give rate-limited older batches priority over new work so
                        # newly admitted batches do not consume quota before retries.
                        return
                    while len(future_to_batch) < max_workers:
                        if delayed and delayed[0][0] <= now:
                            submit_ready_delayed(now)
                            continue
                        if not submit_next_new_batch():
                            break

                fill_pending_batches()
                while future_to_batch or delayed or not new_batches_exhausted:
                    now = time.monotonic()
                    if now - started_at > CDTSM_RATE_LIMIT_PROGRESS_MAX_WALL_TIME_SECONDS:
                        batch_error = (
                            -1,
                            "forecast batching exceeded max wall-clock time while "
                            "retrying transient column batches",
                        )
                        break
                    if (
                        now - last_success_at
                        > CDTSM_RATE_LIMIT_PROGRESS_NO_PROGRESS_TIMEOUT_SECONDS
                    ):
                        batch_error = (
                            -1,
                            "forecast batching made no successful API progress while "
                            "retrying transient column batches",
                        )
                        break

                    fill_pending_batches()
                    if not future_to_batch:
                        if delayed:
                            sleep_for = max(0.0, delayed[0][0] - time.monotonic())
                            time.sleep(min(sleep_for, 5.0))
                            continue
                        if new_batches_exhausted:
                            break

                    wait_timeout = None
                    if delayed:
                        wait_timeout = max(0.0, delayed[0][0] - time.monotonic())
                    done, _not_done = concurrent.futures.wait(
                        future_to_batch,
                        timeout=wait_timeout,
                        return_when=concurrent.futures.FIRST_COMPLETED,
                    )
                    if not done:
                        continue

                    for future in done:
                        batch_info, attempt = future_to_batch.pop(future)
                        batch_idx = batch_info[0]
                        try:
                            result_idx, batch_predictions = future.result()
                        except (
                            CDTSMRateLimitRetryExhausted,
                            CDTSMUpstreamTransientError,
                        ) as transient_exc:
                            # 60s base + ±50% jitter so simultaneously
                            # requeued batches don't wake up in lockstep.
                            retry_delay = float(
                                CDTSM_RATE_LIMIT_PROGRESS_RETRY_DELAY_SECONDS
                            ) * (1.0 + random.uniform(0.0, 0.5))
                            delayed_seq += 1
                            heapq.heappush(
                                delayed,
                                (
                                    time.monotonic() + retry_delay,
                                    delayed_seq,
                                    batch_info,
                                    attempt + 1,
                                ),
                            )
                            if isinstance(transient_exc, CDTSMRateLimitRetryExhausted):
                                reason = "rate-limit (429)"
                                consecutive_transient = 0
                            else:
                                reason = "transient transport/connection error"
                                consecutive_transient += 1
                            logger.warning(
                                "CDTSM: Column batch %d/%d exhausted local retries "
                                "for %s; requeued for scheduler-level retry "
                                "attempt %d after %.1fs. pending=%d delayed=%d "
                                "cause=%s transient_streak=%d",
                                batch_idx + 1,
                                num_batches,
                                reason,
                                attempt + 1,
                                retry_delay,
                                len(future_to_batch),
                                len(delayed),
                                type(transient_exc).__name__,
                                consecutive_transient,
                            )
                            if consecutive_transient >= CDTSM_TRANSIENT_STREAK_RESET_THRESHOLD:
                                logger.warning(
                                    "CDTSM: Forecast transient streak reached "
                                    "threshold (%d). Sync transport is "
                                    "connection-per-request so no client "
                                    "rebuild is needed; retries continue "
                                    "with fresh connections.",
                                    consecutive_transient,
                                )
                                consecutive_transient = 0
                            continue
                        except Exception as e:
                            batch_error = (batch_idx, str(e))
                            logger.error(
                                "CDTSM: Column batch %d failed with error: %s. "
                                "Cancelling all remaining batches - no partial results allowed.",
                                batch_idx + 1,
                                str(e),
                            )
                            for f in future_to_batch:
                                if not f.done():
                                    f.cancel()
                            future_to_batch.clear()
                            break

                        for col, col_preds in batch_predictions.items():
                            all_predictions[col] = col_preds
                        completed_batches += 1
                        last_success_at = time.monotonic()
                        consecutive_transient = 0
                        logger.info(
                            "CDTSM: Completed column batch %d/%d with %d columns "
                            "after %d scheduler-level retry attempt(s)",
                            result_idx + 1,
                            num_batches,
                            len(batch_predictions),
                            attempt,
                        )

                    if batch_error is not None:
                        break

                if batch_error is not None:
                    failed_batch_idx, error_msg = batch_error
                    batch_label = (
                        "scheduler"
                        if failed_batch_idx < 0
                        else f"column batch {failed_batch_idx + 1}/{num_batches}"
                    )
                    raise RuntimeError(
                        f"CDTSM: Forecasting failed - {batch_label} encountered an error: "
                        f"{error_msg}. Completed {completed_batches}/{num_batches} batches "
                        "before failure. No partial results are returned."
                    )

            # Restore the prior limiter (typically None) so unrelated calls
            # on this mixin instance after _forecast_with_batching returns do
            # not inadvertently get throttled by our scheduler's bucket.
            if prior_rate_limiter is None:
                self._cdtsm_rate_limiter = None
            else:
                self._cdtsm_rate_limiter = prior_rate_limiter

            elapsed = time.time() - start_time
            logger.info(
                "CDTSM: Parallel column batching completed in %.2f seconds",
                elapsed,
            )

        logger.info(
            "CDTSM: Parallel column batching complete - processed %d columns across %d batches",
            total_columns,
            num_batches,
        )

        return all_predictions

    def _prune_single_prediction_for_column(self, col_prediction, batch_horizon, col):
        """Prune one prediction object for one output column."""
        pruned_col_response = {}

        for percentile in self.percentiles:
            values = None

            # Handle "mean" at top level, others inside "quantiles"
            if percentile == "mean":
                if "mean" not in col_prediction:
                    logger.warning(
                        "CDTSM: 'mean' key not found for column '%s' in API response",
                        col,
                    )
                    continue
                values = col_prediction["mean"]
            else:
                if "quantiles" not in col_prediction:
                    logger.warning(
                        "CDTSM: 'quantiles' key not found for column '%s' in API response",
                        col,
                    )
                    continue

                quantiles_dict = col_prediction["quantiles"]

                api_key = self._percentile_to_api_key(percentile)

                if api_key not in quantiles_dict:
                    logger.warning(
                        "CDTSM: Percentile '%s' not found in quantiles for column '%s'",
                        percentile,
                        col,
                    )
                    continue

                values = quantiles_dict[api_key]

            if not isinstance(values, (list, tuple)):
                logger.warning(
                    "CDTSM: Expected list/array for %s/%s, got %s",
                    col,
                    percentile,
                    type(values).__name__,
                )
                continue

            original_length = len(values)

            expected_length = batch_horizon

            pruned_values = values[:expected_length]
            pruned_col_response[percentile] = pruned_values

            if original_length > expected_length:
                logger.warning(
                    "CDTSM: API returned %d values for %s/%s, pruned to %d (expected)",
                    original_length,
                    col,
                    percentile,
                    expected_length,
                )
            elif original_length < expected_length:
                logger.warning(
                    "CDTSM: API returned only %d values for %s/%s, expected %d",
                    original_length,
                    col,
                    percentile,
                    expected_length,
                )

        return pruned_col_response

    def _prune_and_validate_response_for_columns(self, response, batch_horizon, batch_columns):
        """Prune API response for a specific batch of columns.

        Similar to _prune_and_validate_response but works with a subset of columns.

        Args:
            response (dict): API response with forecasts
            batch_horizon (int): Expected horizon length
            batch_columns (list): List of column names in this batch

        Returns:
            dict: Pruned response keyed by column name with p-notation keys
        """
        pruned_response = {}

        if "predictions" not in response:
            raise RuntimeError(
                "CDTSM: Invalid API response structure - missing 'predictions' key"
            )

        predictions = response["predictions"]

        if len(predictions) != len(batch_columns):
            logger.warning(
                "CDTSM: API returned %d predictions but expected %d columns for this batch",
                len(predictions),
                len(batch_columns),
            )

        for idx, col in enumerate(batch_columns):
            if idx >= len(predictions):
                logger.warning(
                    "CDTSM: Column '%s' (index %d) not found in predictions array (length %d)",
                    col,
                    idx,
                    len(predictions),
                )
                continue

            col_prediction = predictions[idx]
            pruned_col_response = self._prune_single_prediction_for_column(
                col_prediction, batch_horizon, col
            )

            if pruned_col_response:
                pruned_response[col] = pruned_col_response

        return pruned_response

    def _call_endpoint(self, payload, batch_horizon, *, force_fresh_connection=False):
        """Infer via self-hosted URL from mlspl.conf [CTSM] or Splunk-hosted SCS.

        Non-empty ``self_hosted_cdtsm_endpoint`` → ``SelfHostedCdtsmProvider``;
        otherwise ``HostedCdtsmProvider`` (tenant slim-api + SCS bearer). See
        ``cdtsm_pkg.forecast_providers.resolve_forecast_provider``.

        ``force_fresh_connection`` is forwarded to the hosted provider so that
        scheduler-level retries open a new TCP/TLS connection rather than
        reusing a pooled one.
        """
        from cdtsm_pkg.forecast_providers import infer_with_resolved_provider

        return infer_with_resolved_provider(
            self,
            self._json_safe_payload(payload),
            batch_horizon,
            force_fresh_connection=force_fresh_connection,
        )

    async def _call_endpoint_async(self, payload, batch_horizon):
        """Async equivalent of :meth:`_call_endpoint` for asyncio fan-out paths."""
        from cdtsm_pkg.forecast_providers import infer_with_resolved_provider_async

        return await infer_with_resolved_provider_async(
            self, self._json_safe_payload(payload), batch_horizon
        )
