"""Anomaly-detection mode — rolling forecast + postprocessing + AnomalyViz output."""

import asyncio
import time

import numpy as np
import pandas as pd

import cexc

from collections import defaultdict, namedtuple

from cdtsm_pkg.constants import (
    CDTSM_INTERNAL_ROW_TZ_COLUMN,
    MAX_QUANTILE_HORIZON,
    MAX_AD_STRIDE,
    FILL_NULL_INTERPOLATE,
    MAX_DETECTION_WINDOW_SECONDS,
    _RELATIVE_TIME_RE,
    CONF_INTERVAL_TO_QUANTILES,
    ADVISED_CONTEXT_LENGTH,
    MIN_INPUT_DATAPOINTS,
    RECOMMENDED_ANOMALY_DETECTION_POINTS,
    MAX_PAYLOAD_ENTRIES_PER_CALL,
    AD_METHOD_QUANBIN,
    AD_METHOD_RESIDUAL,
    ZONE_HISTORY,
    ZONE_FORECAST,
    ZONE_POST,
    ANOMALY_STATE_NORMAL,
    ANOMALY_STATE_ANOMALOUS,
    PERCENTILE_MEAN,
    P_TO_FLOAT_MAP,
    CDTSM_API_MAX_CONCURRENCY_DEFAULT,
    CDTSM_API_RATE_LIMIT_PER_MINUTE_DEFAULT,
    CDTSM_RATE_LIMIT_PROGRESS_RETRY_DELAY_SECONDS,
    CDTSM_RATE_LIMIT_PROGRESS_NO_PROGRESS_TIMEOUT_SECONDS,
    CDTSM_RATE_LIMIT_PROGRESS_MAX_WALL_TIME_SECONDS,
    CDTSM_TRANSIENT_STREAK_RESET_THRESHOLD,
    float_quantile_to_percentile_key,
)
from cdtsm_pkg.time_utils import (
    parse_detection_window_time,
    _extract_data_timezone,
)
from util.cdtsm_postprocessing import ensure_quanbin_median_quantile, run_postprocessing
from util.telemetry_cdtsm_util import (
    log_cdtsm_anomaly_params,
    log_cdtsm_time_field_null,
    log_cdtsm_time_resolution,
)

logger = cexc.get_logger(__name__)
messages = cexc.get_messages_logger()


class _SkipAnomalyByGroup(RuntimeError):
    """Raised internally when one BY combination cannot produce anomaly context."""


def _min_context_rows_for_h_validation(_algo) -> int:
    """Minimum H (context rows). Coarse block size adapts to ``len(series)``; no fixed-60 row floor."""
    return 1


def _trim_time_window_indices_for_context_length(detection_indices, H_cfg):
    """Drop in-window rows before index ``H_cfg`` so context_length can be honored.

    ``detection_indices`` must be non-empty sorted row indices into the series.
    ``H_cfg`` must be a positive int (context row count).
    Returns ``(trimmed_int64_array, detection_start_idx_time, did_trim)``.
    Raises ``ValueError`` if no indices remain at or after ``H_cfg``.
    """
    if H_cfg is None:
        raise TypeError("context_length (H_cfg) must not be None")
    detection_indices = np.atleast_1d(np.asarray(detection_indices, dtype=np.int64))
    detection_start_idx_time = int(detection_indices[0])
    if detection_start_idx_time >= H_cfg:
        return detection_indices, detection_start_idx_time, False
    trimmed = detection_indices[detection_indices >= H_cfg]
    if len(trimmed) == 0:
        raise ValueError(f"no in-window rows at or after context boundary index {H_cfg}")
    return trimmed, detection_start_idx_time, True


def _anomaly_run_edges_from_is_anomaly(is_anomaly):
    """Mark first/last row of each contiguous run of 1s in ``is_anomaly`` (0/1 per row).

    Single-point runs have both start and end set; interior anomaly rows have neither.
    """
    is_one = np.asarray(is_anomaly, dtype=np.int8) == 1
    if is_one.size == 0:
        return np.empty((0,), dtype=np.int8), np.empty((0,), dtype=np.int8)

    prev_is_one = np.empty_like(is_one)
    prev_is_one[0] = False
    prev_is_one[1:] = is_one[:-1]

    next_is_one = np.empty_like(is_one)
    next_is_one[-1] = False
    next_is_one[:-1] = is_one[1:]

    is_anomaly_start = is_one & ~prev_is_one
    is_anomaly_end = is_one & ~next_is_one
    return is_anomaly_start.astype(np.int8), is_anomaly_end.astype(np.int8)


def _window_reference_epoch_for_parse(raw_value, dataset_last_epoch, now_epoch):
    """Reference epoch for ``parse_detection_window_time`` (same as detection_window_*)."""
    return now_epoch if _RELATIVE_TIME_RE.match(str(raw_value).strip()) else dataset_last_epoch


# ``ad_context_length_effective`` stores resolved context row count ``H`` for this dataframe
# (per ``forecast_by`` group when applicable), not the raw SPL ``context_length`` parameter alone.
AnomalyPrecomputedState = namedtuple(
    "AnomalyPrecomputedState",
    [
        "df_clean",
        "N",
        "all_times",
        "H",
        "K",
        "S",
        "detection_start_idx",
        "base_context_start_idx",
        "col_arrays",
        "full_entries",
        "partial_entries",
        "full_entry_map",
        "partial_entry_map",
        "partial_horizon",
        "ad_context_length_effective",
        "ad_short_series_context_clamped",
        "quantiles_list",
        "was_repaired",
    ],
)


class AnomalyModeMixin:
    """Mixin providing anomaly-detection mode for PredictAI."""

    def _record_anomaly_by_preprocess_step_timing(self, step, elapsed):
        """Record a per-group anomaly BY preprocessing step into the parent collector."""
        recorder = getattr(self, "_cdtsm_anomaly_by_preprocess_step_recorder", None)
        if recorder is None:
            return
        try:
            recorder(step, elapsed)
        except Exception:
            logger.debug(
                "CDTSM anomaly_detection: failed to record BY preprocessing step timing for %s",
                step,
                exc_info=True,
            )

    def _record_anomaly_by_pp_module_call(self, elapsed):
        """Record one ``run_postprocessing`` call duration into the parent collector.

        Called per metric column per group. Aggregated and logged once at the
        end of :meth:`_apply_anomaly_detection_by_groups` so users can see how
        much wall time the postprocessing module itself consumed across the
        entire BY run.
        """
        recorder = getattr(self, "_cdtsm_anomaly_by_pp_module_recorder", None)
        if recorder is None:
            return
        try:
            recorder(elapsed)
        except Exception:
            logger.debug(
                "CDTSM anomaly_detection: failed to record BY postprocessing module timing",
                exc_info=True,
            )

    def _materialize_anomaly_payload_entry(self, prep, entry_desc):
        """Build one anomaly API payload entry from a lightweight context descriptor.

        Mirrors the server-side ``build_multi_resolution`` flow exactly via
        :meth:`_build_payload_contexts`: the raw context-window slice is passed
        through ``_normalize_inputs`` and then the multi_res if-block, which for
        single-resolution 1D arrays calls ``build_multi_resolution`` (with the
        fixed aggregation factor and fixed coarse/fine context lengths). For any
        non-empty preprocessed input this always yields non-empty coarse and
        fine contexts — no minimum data-point requirement and no client-side
        block-size fallback dance.
        """
        _stride_idx, col, ctx_start, det_offset = entry_desc
        series = prep.col_arrays[col][ctx_start:det_offset]
        coarse, fine = self._build_payload_contexts(series)
        if coarse.size == 0:
            raise RuntimeError(
                "CDTSM anomaly_detection: context window has no usable points "
                "after non-finite cleanup."
            )
        return {
            "coarse_ctx": coarse.tolist() if hasattr(coarse, "tolist") else coarse,
            "fine_ctx": fine.tolist() if hasattr(fine, "tolist") else fine,
        }

    def _build_detection_window_parse_env(self, all_times):
        """Timezone / format bundle for :func:`parse_detection_window_time`.

        ``context_window_*`` uses the same inputs as ``detection_window_*`` so
        relative times, epochs, and naive datetime strings resolve identically.
        """
        dataset_last_epoch = float(all_times[-1])
        now_epoch = time.time()
        detected_fmt = getattr(self, "_detected_time_format", None)
        original_sample = getattr(self, "_original_time_sample", None)
        predominant_tz = getattr(self, "_predominant_data_tz", None)
        fallback_tz = _extract_data_timezone(detected_fmt, original_sample)
        return {
            "dataset_last_epoch": dataset_last_epoch,
            "now_epoch": now_epoch,
            "detected_fmt": detected_fmt,
            "predominant_tz": predominant_tz,
            "fallback_tz": fallback_tz,
        }

    def _log_detection_window_tz_preamble(self, env):
        """Same log lines as ``detection_window_*`` resolution (predominant / fallback tz)."""
        if getattr(self, "_cdtsm_suppress_high_frequency_logs", False):
            return
        predominant_tz = env["predominant_tz"]
        detected_fmt = env["detected_fmt"]
        fallback_tz = env["fallback_tz"]
        if predominant_tz is not None:
            logger.info(
                "CDTSM anomaly_detection: predominant data timezone %s — "
                "naive detection_window_* strings are localized here (same as "
                "offsets in the time column), not Splunk user TZ",
                predominant_tz,
            )
        elif fallback_tz is not None:
            logger.info(
                "CDTSM anomaly_detection: detected data timezone %s "
                "from format '%s' — naive window parameters localized here",
                fallback_tz,
                detected_fmt,
            )

    def _log_naive_detection_window_wall(self, naive_wall):
        """Log how naive window strings are localized (UTC vs Splunk UI vs data tz)."""
        if getattr(self, "_cdtsm_suppress_high_frequency_logs", False):
            return
        if getattr(self, "_parse_detection_window_naive_use_utc", False):
            logger.info(
                "CDTSM anomaly_detection: naive detection_window_* / context_window_* "
                "datetimes interpreted as UTC wall time (matches naive string time "
                "column → epoch)"
            )
            return
        if naive_wall is not None:
            logger.info(
                "CDTSM anomaly_detection: naive detection_window_* datetimes "
                "interpreted in Splunk UI timezone %s (no data-column tz)",
                getattr(naive_wall, "key", naive_wall),
            )

    def _parse_window_time_with_env(self, raw_value, reference_epoch, env, naive_wall):
        """Call :func:`parse_detection_window_time` with the same kwargs as detection windows."""
        return parse_detection_window_time(
            raw_value,
            reference_epoch,
            time_format=env["detected_fmt"],
            predominant_data_tz=env["predominant_tz"],
            fallback_data_tz=env["fallback_tz"],
            naive_wall_tzinfo=naive_wall,
            naive_string_data_matches_pandas_utc=getattr(
                self, "_parse_detection_window_naive_use_utc", False
            ),
        )

    def _apply_anomaly_detection(self, df, options=None, skip_ensure_config=False):
        """Perform stateless anomaly detection using rolling forecast + postprocessing.

        The input time series is partitioned into a *Context Window* (fed to the
        TSFM) and a *Detection Window* (compared against the forecast).  Multiple
        forecasts are produced with a configurable stride to cover the detection
        window.

        When ``show_input=True`` (default) returns all rows (history + detection
        window) so the output can be fed directly into AnomalyViz.  When
        ``show_input=False`` only detection-window rows are returned.

        Context may be specified in time via ``context_window_earliest`` /
        ``context_window_latest`` (mutually exclusive with ``context_length``).
        Detection extent pairs with those flags per validation in ``PredictAI``.

        Detection time windows (mutually exclusive with ``context_length`` on the
        earliest side): (1) ``detection_window_earliest`` with optional
        ``detection_window_latest`` — omit ``context_length``; or (2)
        ``detection_window_latest`` only with ``context_length`` — rows from
        ``context_length`` onward whose time is ``<= latest`` are scored.

        Public output columns per metric:
            <metric>.forecast         – predicted mean (detection window only)
            <metric>.anomaly_score    – IQR: normalised deviation; QuanBin: binary 1/0
            <metric>.anomaly_state    – NORMAL / ANOMALOUS
            <metric>.threshold_upper  – upper pointwise threshold band (detection window only)
            <metric>.threshold_lower  – lower pointwise threshold band (detection window only)

        Hidden columns consumed by AnomalyViz (underscore-prefixed):
            _upper{CI}.<metric> – upper quantile for the CI band (detection window only)
            _lower{CI}.<metric> – lower quantile for the CI band (detection window only)
            _vars               – comma-separated list of analysed variables
            _time_field         – configured time column name (e.g. _time or timestamp)
            _evalStart          – epoch timestamp of detection window start
            _evalEnd            – epoch timestamp of detection window end
            _ciList             – confidence interval levels (e.g. "60" or "98,50")
            _zone               – 'history' or 'forecast'
            _isAnomaly.<metric> – 1 if this metric is anomalous at this time, else 0
            _is_anomaly_start.<metric> – 1 if this row starts a contiguous anomalous run for that metric
            _is_anomaly_end.<metric>   – 1 if this row ends a contiguous anomalous run for that metric
            _threshold_upper.<metric> / _threshold_lower.<metric> – pointwise bands from postprocessing

        Args:
            df (pd.DataFrame): Input dataframe (must include context + detection data)
            options (dict, optional): Additional runtime options
            skip_ensure_config (bool): If True, skip :meth:`_ensure_config` (caller ran it on a
                parent frame, e.g. full data before ``forecast_by`` grouping).

        Returns:
            pd.DataFrame: All rows with anomaly and AnomalyViz fields populated
        """
        logger.info("CDTSM anomaly_detection: starting")

        prep = self._anomaly_phase_build_precomputed(df, options, skip_ensure_config)
        return self._anomaly_phase_api_and_postprocess(prep, options=options)

    def _anomaly_phase_build_precomputed(
        self,
        df,
        options=None,
        skip_ensure_config=False,
        skip_time_conversion=False,
        skip_duplicate_aggregation=False,
        skip_numeric_validation=False,
        skip_basic_config_validation=False,
        skip_fill_null_dropna=False,
        skip_time_sort=False,
    ):
        """Validate/clean data and precompute anomaly API payload entries (no HTTP).

        When ``skip_time_conversion`` is True (BY workers after a parent one-shot
        :meth:`ValidationMixin._cdtsm_apply_time_conversion_once_for_by_groups`), the time column
        is already epoch seconds; null-check and :meth:`_convert_time_field_to_seconds` are skipped.

        Returns:
            AnomalyPrecomputedState: bundle for :meth:`_anomaly_phase_api_and_postprocess`.
        """

        # ├─ Data cleaning (same pipeline as forecast mode):
        # │   _ensure_config → _validate_time_field_no_nulls_or_blanks_before_convert
        # │   → _convert_time_field_to_seconds → sort → repair → validate → impute

        _preprocessing_phase_t0 = time.perf_counter()
        _step_t0 = time.perf_counter()
        if not skip_ensure_config:
            self._ensure_config(df)
        elif skip_basic_config_validation:
            self._time_resolution_seconds = None
            self._time_series_was_repaired = False
        else:
            if df is None or df.empty:
                raise RuntimeError("CDTSM: Input dataframe is empty")
            if self.time_field not in df.columns:
                raise RuntimeError(
                    f"CDTSM: time_field '{self.time_field}' not found in input data. "
                    f"Available columns: {', '.join(df.columns)}"
                )
            missing_columns = [col for col in self.columns if col not in df.columns]
            if missing_columns:
                raise RuntimeError(
                    f"CDTSM: The following columns were not found in input data: {', '.join(missing_columns)}. "
                    f"Available columns: {', '.join(df.columns)}"
                )
            self._time_resolution_seconds = None
            self._time_series_was_repaired = False
            if not skip_time_conversion:
                self._detected_time_format = None
                self._time_was_string = False
                self._time_was_datetime64 = False
                self._predominant_data_tz = None
                self._is_unix_timestamp = False
        self._record_anomaly_by_preprocess_step_timing(
            "config_validation", time.perf_counter() - _step_t0
        )

        _step_t0 = time.perf_counter()
        if not skip_time_conversion:
            self._validate_time_field_no_nulls_or_blanks_before_convert(df)
            df = self._convert_time_field_to_seconds(df)
        self._record_anomaly_by_preprocess_step_timing(
            "time_conversion", time.perf_counter() - _step_t0
        )
        _prep_t0 = time.perf_counter()
        if skip_time_sort:
            df_sorted = df
        else:
            if df[self.time_field].is_monotonic_increasing:
                df_sorted = df.copy(deep=False)
            else:
                df_sorted = df.sort_values(self.time_field)
            df_sorted.reset_index(drop=True, inplace=True)
        _sort_elapsed = time.perf_counter() - _prep_t0
        self._record_anomaly_by_preprocess_step_timing("sort_reset", _sort_elapsed)
        _repair_t0 = time.perf_counter()
        use_fast_regular_resolution = (
            bool(getattr(self, "_cdtsm_fast_regular_time_resolution", False))
            and skip_duplicate_aggregation
            and len(df_sorted) >= 2
        )
        if use_fast_regular_resolution:
            time_values = df_sorted[self.time_field].to_numpy(dtype=np.int64, copy=False)
            # Per-group sanity check on the post-conversion time column. The
            # parent-level pre-convert check in
            # ``_cdtsm_apply_time_conversion_once_for_by_groups`` already
            # rejects raw nulls/blanks once per apply, so this branch only
            # fires telemetry/raises for groups that somehow carry an invalid
            # sentinel (== 0) timestamp — keeping per-group telemetry
            # symmetrical with the slow-path emitted inside
            # ``_validate_and_repair_time_resolution``.
            if time_values.size > 0 and bool((time_values == 0).any()):
                log_cdtsm_time_field_null(is_groupby=1)
                raise RuntimeError(
                    f"CDTSM: The time field '{self.time_field}' contains invalid "
                    "(zero) timestamps in this BY group. All timestamp values must "
                    "be non-null and non-zero."
                )
            time_diffs = np.diff(time_values)
            if (
                time_diffs.size > 0
                and int(time_diffs[0]) > 0
                and bool(np.all(time_diffs == time_diffs[0]))
            ):
                detected_diff = int(time_diffs[0])
                self._time_resolution_seconds = detected_diff
                log_cdtsm_time_resolution(
                    most_frequent_resolution=detected_diff,
                    decided_resolution=detected_diff,
                    was_repaired=False,
                    is_groupby=1,
                )
            else:
                df_sorted = self._validate_and_repair_time_resolution(
                    df_sorted,
                    input_already_sorted=True,
                    skip_duplicate_aggregation=skip_duplicate_aggregation,
                )
        else:
            df_sorted = self._validate_and_repair_time_resolution(
                df_sorted,
                input_already_sorted=True,
                skip_duplicate_aggregation=skip_duplicate_aggregation,
            )
        _repair_elapsed = time.perf_counter() - _repair_t0
        self._record_anomaly_by_preprocess_step_timing(
            "time_resolution_repair", _repair_elapsed
        )
        _numeric_t0 = time.perf_counter()
        if not skip_numeric_validation:
            self._validate_numerical_columns(df_sorted)
        _numeric_elapsed = time.perf_counter() - _numeric_t0
        self._record_anomaly_by_preprocess_step_timing("numeric_validation", _numeric_elapsed)
        _impute_t0 = time.perf_counter()
        fill_mode = getattr(self, "fill_null", FILL_NULL_INTERPOLATE)
        skip_fill_step = fill_mode == FILL_NULL_INTERPOLATE or (
            skip_fill_null_dropna
            and not bool(getattr(self, "_time_series_was_repaired", False))
        )
        if skip_fill_step:
            df_clean = df_sorted
        else:
            df_filled = self._apply_fill_null(df_sorted)
            df_clean = df_filled.dropna(subset=self.columns)
        _impute_elapsed = time.perf_counter() - _impute_t0
        self._record_anomaly_by_preprocess_step_timing("fill_null_dropna", _impute_elapsed)
        if df_clean.empty:
            raise RuntimeError("CDTSM anomaly_detection: no valid data after cleaning")

        N = len(df_clean)
        all_times = df_clean[self.time_field].values
        suppress_high_frequency_logs = getattr(
            self, "_cdtsm_suppress_high_frequency_logs", False
        )
        if not suppress_high_frequency_logs:
            logger.info(
                "CDTSM anomaly_detection: preprocessing timings rows_in=%d rows_clean=%d — "
                "sort=%.4fs, time_resolution=%.4fs, numeric_validation=%.4fs, impute/dropna=%.4fs",
                len(df),
                N,
                _sort_elapsed,
                _repair_elapsed,
                _numeric_elapsed,
                _impute_elapsed,
            )

        # Per-invocation (per BY-group slice) effective context length: never mutate
        # ``self._ad_context_length`` here so multi-``forecast_by`` / parent instances keep the
        # configured SPL value; ``AnomalyPrecomputedState`` carries what this row count allows.
        # ``self._ad_context_length`` is the SPL value, or the default 60 when SPL omits it.
        # Per group, clamp only when there are not enough rows to leave at least one
        # point in the detection window.
        _window_t0 = time.perf_counter()
        configured_context_length = self._ad_context_length
        effective_context_length = configured_context_length
        short_series_context_clamped = False
        if configured_context_length is not None:
            cfg_ctx = int(configured_context_length)
            max_context_for_detection = max(0, N - 1)
            if cfg_ctx > max_context_for_detection:
                capped_ctx = max_context_for_detection
                cap_reason = "input shorter than configured context_length"
            else:
                capped_ctx = cfg_ctx
                cap_reason = "configured/default context_length"
            if capped_ctx != cfg_ctx:
                short_series_context_clamped = True
                if not suppress_high_frequency_logs:
                    logger.info(
                        "CDTSM anomaly_detection: %d usable row(s); effective context_length=%d "
                        "(%s; configured=%d, default=%d).",
                        N,
                        capped_ctx,
                        cap_reason,
                        cfg_ctx,
                        ADVISED_CONTEXT_LENGTH,
                    )
            effective_context_length = capped_ctx

        if N < MIN_INPUT_DATAPOINTS:
            if self._ad_window_earliest is not None or self._ad_window_latest is not None:
                raise RuntimeError(
                    f"CDTSM anomaly_detection: at least {MIN_INPUT_DATAPOINTS} usable "
                    f"data points are required in the input. Adjust the SPL time range so enough "
                    f"rows remain after cleaning."
                )
            raise RuntimeError(
                f"CDTSM anomaly_detection: at least {MIN_INPUT_DATAPOINTS} usable "
                f"data points are required in the input. context_length={self._ad_context_length}. "
                f"Provide a longer time series or reduce context_length so enough rows remain "
                f"after cleaning."
            )
        if N < RECOMMENDED_ANOMALY_DETECTION_POINTS and not suppress_high_frequency_logs:
            messages.warn(
                f"Anomaly detection accuracy improves when you include more "
                f"than {RECOMMENDED_ANOMALY_DETECTION_POINTS} data points "
                f"from a time series' history."
            )

        #   ├─ Detection window resolution:
        #   │  — context_window_earliest / context_window_latest (time-bounded context)
        #   │  — detection_window_earliest (+ optional latest), without context_length:
        #   │       Points in [earliest, latest]. H = detection_start_idx (prefix context).
        #   │  — detection_window_latest only, with context_length (no earliest):
        #   │       Candidates: row index >= context_length and time <= latest; H = context_length.

        cwp_e = getattr(self, "_ad_context_window_earliest", None)
        cwp_l = getattr(self, "_ad_context_window_latest", None)
        if cwp_e is not None or cwp_l is not None:
            env = self._build_detection_window_parse_env(all_times)
            self._log_detection_window_tz_preamble(env)
            dataset_last_epoch = env["dataset_last_epoch"]
            now_epoch = env["now_epoch"]

            times_float = np.array(all_times, dtype=float)
            row_idx = np.arange(N, dtype=np.int64)

            if cwp_e is not None and cwp_l is not None:
                # Same order as detection_window_earliest (+ optional latest): wall tz, then validate
                naive_wall = self._naive_wall_tzinfo_for_detection_window()
                self._log_naive_detection_window_wall(naive_wall)
                self._validate_detection_window_value_for_custom_time_field(
                    cwp_e, "context_window_earliest"
                )
                self._validate_detection_window_value_for_custom_time_field(
                    cwp_l, "context_window_latest"
                )
                ref_ce = _window_reference_epoch_for_parse(cwp_e, dataset_last_epoch, now_epoch)
                ctx_earliest_epoch = self._parse_window_time_with_env(
                    cwp_e, ref_ce, env, naive_wall
                )
                ref_cl = _window_reference_epoch_for_parse(cwp_l, dataset_last_epoch, now_epoch)
                ctx_latest_epoch = self._parse_window_time_with_env(
                    cwp_l, ref_cl, env, naive_wall
                )
                if ctx_earliest_epoch > ctx_latest_epoch:
                    raise RuntimeError(
                        "CDTSM anomaly_detection: context_window_earliest cannot be after "
                        "context_window_latest (latest must be >= earliest)."
                    )
                ctx_dur = ctx_latest_epoch - ctx_earliest_epoch
                if ctx_dur > MAX_DETECTION_WINDOW_SECONDS:
                    raise RuntimeError(
                        f"CDTSM anomaly_detection: context window duration "
                        f"({ctx_dur / 3600:.1f} hours) exceeds the maximum allowed "
                        f"({MAX_DETECTION_WINDOW_SECONDS / 3600:.0f} hours)."
                    )

                context_mask = (times_float >= ctx_earliest_epoch) & (
                    times_float <= ctx_latest_epoch
                )
                context_indices = np.atleast_1d(np.where(context_mask)[0]).astype(np.int64)
                if len(context_indices) == 0:
                    raise RuntimeError(
                        "CDTSM anomaly_detection: no data points fall within the "
                        "context window [context_window_earliest, context_window_latest]."
                    )
                if len(context_indices) > 1 and not np.all(np.diff(context_indices) == 1):
                    raise RuntimeError(
                        "CDTSM anomaly_detection: context_window range must cover "
                        "contiguous rows in time order."
                    )
                context_start_idx = int(context_indices[0])
                context_end_idx = int(context_indices[-1])
                H = int(len(context_indices))
                detection_start_idx = context_end_idx + 1
                if detection_start_idx >= N:
                    raise RuntimeError(
                        "CDTSM anomaly_detection: no rows remain after the context window "
                        "for detection."
                    )

                if self._ad_detection_length is not None:
                    K = min(int(self._ad_detection_length), N - detection_start_idx)
                else:
                    self._validate_detection_window_value_for_custom_time_field(
                        self._ad_window_latest, "detection_window_latest"
                    )
                    ref_dl = _window_reference_epoch_for_parse(
                        self._ad_window_latest, dataset_last_epoch, now_epoch
                    )
                    det_latest_epoch = self._parse_window_time_with_env(
                        self._ad_window_latest, ref_dl, env, naive_wall
                    )
                    detection_mask = (row_idx >= detection_start_idx) & (
                        times_float <= det_latest_epoch
                    )
                    detection_indices = np.atleast_1d(np.where(detection_mask)[0]).astype(
                        np.int64
                    )
                    if len(detection_indices) == 0:
                        raise RuntimeError(
                            "CDTSM anomaly_detection: no detection rows after context "
                            "with time <= detection_window_latest."
                        )
                    if len(detection_indices) > 1 and not np.all(
                        np.diff(detection_indices) == 1
                    ):
                        raise RuntimeError(
                            "CDTSM anomaly_detection: detection rows must be contiguous "
                            "in row order."
                        )
                    if int(detection_indices[0]) != detection_start_idx:
                        raise RuntimeError(
                            "CDTSM anomaly_detection: first detection row after context "
                            "has time after detection_window_latest."
                        )
                    K = int(len(detection_indices))
                    first_det_ts = float(all_times[detection_start_idx])
                    win_dur = det_latest_epoch - first_det_ts
                    if win_dur > MAX_DETECTION_WINDOW_SECONDS:
                        raise RuntimeError(
                            f"CDTSM anomaly_detection: detection window duration "
                            f"({win_dur / 3600:.1f} hours) exceeds the maximum allowed "
                            f"({MAX_DETECTION_WINDOW_SECONDS / 3600:.0f} hours)."
                        )

                if not suppress_high_frequency_logs:
                    logger.info(
                        "CDTSM anomaly_detection: context time window [cwe,cwl] — "
                        "context_start_idx=%d, context_end_idx=%d, H=%d, "
                        "detection_start_idx=%d, K=%d",
                        context_start_idx,
                        context_end_idx,
                        H,
                        detection_start_idx,
                        K,
                    )

            elif cwp_l is not None:
                # Same order as detection_window_latest-only: validate, then wall tz, then parse
                self._validate_detection_window_value_for_custom_time_field(
                    cwp_l, "context_window_latest"
                )
                naive_wall = self._naive_wall_tzinfo_for_detection_window()
                self._log_naive_detection_window_wall(naive_wall)
                ref_cl = _window_reference_epoch_for_parse(cwp_l, dataset_last_epoch, now_epoch)
                ctx_latest_epoch = self._parse_window_time_with_env(
                    cwp_l, ref_cl, env, naive_wall
                )
                ctx_row_mask = times_float <= ctx_latest_epoch
                if not np.any(ctx_row_mask):
                    raise RuntimeError(
                        "CDTSM anomaly_detection: no rows with time <= context_window_latest."
                    )
                context_end_idx = int(np.where(ctx_row_mask)[0][-1])
                H = context_end_idx + 1
                detection_start_idx = context_end_idx + 1
                if detection_start_idx >= N:
                    raise RuntimeError(
                        "CDTSM anomaly_detection: no rows after context_window_latest "
                        "for detection."
                    )

                if self._ad_detection_length is not None:
                    K = min(int(self._ad_detection_length), N - detection_start_idx)
                else:
                    self._validate_detection_window_value_for_custom_time_field(
                        self._ad_window_latest, "detection_window_latest"
                    )
                    ref_dl = _window_reference_epoch_for_parse(
                        self._ad_window_latest, dataset_last_epoch, now_epoch
                    )
                    det_latest_epoch = self._parse_window_time_with_env(
                        self._ad_window_latest, ref_dl, env, naive_wall
                    )
                    detection_mask = (row_idx >= detection_start_idx) & (
                        times_float <= det_latest_epoch
                    )
                    detection_indices = np.atleast_1d(np.where(detection_mask)[0]).astype(
                        np.int64
                    )
                    if len(detection_indices) == 0:
                        raise RuntimeError(
                            "CDTSM anomaly_detection: no data points in the detection "
                            "range after context_window_latest."
                        )
                    if len(detection_indices) > 1 and not np.all(
                        np.diff(detection_indices) == 1
                    ):
                        raise RuntimeError(
                            "CDTSM anomaly_detection: detection candidates must be contiguous "
                            "in row order."
                        )
                    if int(detection_indices[0]) != detection_start_idx:
                        raise RuntimeError(
                            "CDTSM anomaly_detection: first row after context has time after "
                            "detection_window_latest."
                        )
                    K = int(len(detection_indices))
                    first_det_ts = float(all_times[detection_start_idx])
                    win_dur = det_latest_epoch - first_det_ts
                    if win_dur > MAX_DETECTION_WINDOW_SECONDS:
                        raise RuntimeError(
                            f"CDTSM anomaly_detection: detection window duration "
                            f"({win_dur / 3600:.1f} hours) exceeds the maximum allowed "
                            f"({MAX_DETECTION_WINDOW_SECONDS / 3600:.0f} hours)."
                        )

                if not suppress_high_frequency_logs:
                    logger.info(
                        "CDTSM anomaly_detection: context_window_latest only — "
                        "context_end_idx=%d, H=%d, detection_start_idx=%d, K=%d",
                        context_end_idx,
                        H,
                        detection_start_idx,
                        K,
                    )

            else:
                # context_window_earliest only — same tz / parse pipeline as detection_window_earliest
                naive_wall = self._naive_wall_tzinfo_for_detection_window()
                self._log_naive_detection_window_wall(naive_wall)
                self._validate_detection_window_value_for_custom_time_field(
                    cwp_e, "context_window_earliest"
                )
                self._validate_detection_window_value_for_custom_time_field(
                    self._ad_window_earliest, "detection_window_earliest"
                )
                ref_ce = _window_reference_epoch_for_parse(cwp_e, dataset_last_epoch, now_epoch)
                ctx_earliest_epoch = self._parse_window_time_with_env(
                    cwp_e, ref_ce, env, naive_wall
                )
                ref_de = _window_reference_epoch_for_parse(
                    self._ad_window_earliest, dataset_last_epoch, now_epoch
                )
                det_earliest_epoch = self._parse_window_time_with_env(
                    self._ad_window_earliest, ref_de, env, naive_wall
                )
                if ctx_earliest_epoch >= det_earliest_epoch:
                    raise RuntimeError(
                        "CDTSM anomaly_detection: context_window_earliest must be before "
                        "detection_window_earliest."
                    )

                if self._ad_window_latest is not None:
                    self._validate_detection_window_value_for_custom_time_field(
                        self._ad_window_latest, "detection_window_latest"
                    )
                    ref_dl = _window_reference_epoch_for_parse(
                        self._ad_window_latest, dataset_last_epoch, now_epoch
                    )
                    det_latest_epoch = self._parse_window_time_with_env(
                        self._ad_window_latest, ref_dl, env, naive_wall
                    )
                else:
                    det_latest_epoch = dataset_last_epoch

                if det_earliest_epoch > det_latest_epoch:
                    raise RuntimeError(
                        "CDTSM anomaly_detection: detection_window_earliest cannot be after "
                        "detection_window_latest (latest must be >= earliest)."
                    )

                # Filter context the same way as detection windows: inclusive time bounds on rows
                context_mask = (times_float >= ctx_earliest_epoch) & (
                    times_float < det_earliest_epoch
                )
                context_indices = np.atleast_1d(np.where(context_mask)[0]).astype(np.int64)
                if len(context_indices) == 0:
                    raise RuntimeError(
                        "CDTSM anomaly_detection: no data points fall in the context window "
                        "[context_window_earliest, detection_window_earliest)."
                    )
                if len(context_indices) > 1 and not np.all(np.diff(context_indices) == 1):
                    raise RuntimeError(
                        "CDTSM anomaly_detection: context_window range must cover "
                        "contiguous rows in time order."
                    )
                context_start_idx = int(context_indices[0])
                context_end_idx = int(context_indices[-1])
                H = int(len(context_indices))
                detection_start_idx = context_end_idx + 1
                if detection_start_idx >= N:
                    raise RuntimeError(
                        "CDTSM anomaly_detection: no rows at or after detection_window_earliest."
                    )
                if float(all_times[detection_start_idx]) < det_earliest_epoch:
                    raise RuntimeError(
                        "CDTSM anomaly_detection: first row at or after the context block "
                        "must have time >= detection_window_earliest."
                    )

                if self._ad_detection_length is not None:
                    K = min(int(self._ad_detection_length), N - detection_start_idx)
                elif self._ad_window_latest is not None:
                    detection_mask = (row_idx >= detection_start_idx) & (
                        times_float <= det_latest_epoch
                    )
                    detection_indices = np.atleast_1d(np.where(detection_mask)[0]).astype(
                        np.int64
                    )
                    if len(detection_indices) == 0:
                        raise RuntimeError(
                            "CDTSM anomaly_detection: no detection rows with time <= "
                            "detection_window_latest."
                        )
                    if len(detection_indices) > 1 and not np.all(
                        np.diff(detection_indices) == 1
                    ):
                        raise RuntimeError(
                            "CDTSM anomaly_detection: detection candidates must be contiguous "
                            "in row order."
                        )
                    if int(detection_indices[0]) != detection_start_idx:
                        raise RuntimeError(
                            "CDTSM anomaly_detection: detection_window_latest is before the "
                            "first detection row."
                        )
                    K = int(len(detection_indices))
                    win_dur = det_latest_epoch - float(all_times[detection_start_idx])
                    if win_dur > MAX_DETECTION_WINDOW_SECONDS:
                        raise RuntimeError(
                            f"CDTSM anomaly_detection: detection window duration "
                            f"({win_dur / 3600:.1f} hours) exceeds the maximum allowed "
                            f"({MAX_DETECTION_WINDOW_SECONDS / 3600:.0f} hours)."
                        )
                else:
                    det_mask_full = (times_float >= det_earliest_epoch) & (
                        times_float <= det_latest_epoch
                    )
                    det_idx_full = np.atleast_1d(np.where(det_mask_full)[0]).astype(np.int64)
                    if len(det_idx_full) == 0:
                        raise RuntimeError(
                            "CDTSM anomaly_detection: no data points fall within the "
                            f"detection window [{det_earliest_epoch}, {det_latest_epoch}]."
                        )
                    if int(det_idx_full[0]) != detection_start_idx:
                        raise RuntimeError(
                            "CDTSM anomaly_detection: detection window does not align with "
                            "rows after the context window."
                        )
                    if len(det_idx_full) > 1 and not np.all(np.diff(det_idx_full) == 1):
                        raise RuntimeError(
                            "CDTSM anomaly_detection: detection window rows must be contiguous "
                            "in row order."
                        )
                    K = int(len(det_idx_full))

                if not suppress_high_frequency_logs:
                    logger.info(
                        "CDTSM anomaly_detection: context_window_earliest only — "
                        "context_start_idx=%d, context_end_idx=%d, detection_start_idx=%d, H=%d, K=%d",
                        context_start_idx,
                        context_end_idx,
                        detection_start_idx,
                        H,
                        K,
                    )

            min_h = _min_context_rows_for_h_validation(self)
            if H < min_h:
                raise RuntimeError(
                    "CDTSM anomaly_detection: not sufficient data points in context "
                    f"(H={H}, minimum {min_h})."
                )
            if H < RECOMMENDED_ANOMALY_DETECTION_POINTS:
                messages.warn(
                    f"Anomaly detection accuracy improves when you include more "
                    f"than {RECOMMENDED_ANOMALY_DETECTION_POINTS} data points "
                    f"from a time series' history."
                )

        elif self._ad_window_earliest is not None:
            dataset_last_epoch = float(all_times[-1])
            now_epoch = time.time()
            detected_fmt = getattr(self, '_detected_time_format', None)
            original_sample = getattr(self, '_original_time_sample', None)

            predominant_tz = getattr(self, '_predominant_data_tz', None)
            fallback_tz = _extract_data_timezone(detected_fmt, original_sample)
            if predominant_tz is not None and not suppress_high_frequency_logs:
                logger.info(
                    "CDTSM anomaly_detection: predominant data timezone %s — "
                    "naive detection_window_* strings are localized here (same as "
                    "offsets in the time column), not Splunk user TZ",
                    predominant_tz,
                )
            elif fallback_tz is not None and not suppress_high_frequency_logs:
                logger.info(
                    "CDTSM anomaly_detection: detected data timezone %s "
                    "from format '%s' — naive window parameters localized here",
                    fallback_tz,
                    detected_fmt,
                )

            naive_wall = self._naive_wall_tzinfo_for_detection_window()
            self._log_naive_detection_window_wall(naive_wall)
            self._validate_detection_window_value_for_custom_time_field(
                self._ad_window_earliest, "detection_window_earliest"
            )

            ref_e = (
                now_epoch
                if _RELATIVE_TIME_RE.match(str(self._ad_window_earliest).strip())
                else dataset_last_epoch
            )
            earliest_epoch = parse_detection_window_time(
                self._ad_window_earliest,
                ref_e,
                time_format=detected_fmt,
                predominant_data_tz=predominant_tz,
                fallback_data_tz=fallback_tz,
                naive_wall_tzinfo=naive_wall,
                naive_string_data_matches_pandas_utc=getattr(
                    self, "_parse_detection_window_naive_use_utc", False
                ),
            )

            if self._ad_window_latest is not None:
                self._validate_detection_window_value_for_custom_time_field(
                    self._ad_window_latest, "detection_window_latest"
                )
                ref_l = (
                    now_epoch
                    if _RELATIVE_TIME_RE.match(str(self._ad_window_latest).strip())
                    else dataset_last_epoch
                )
                latest_epoch = parse_detection_window_time(
                    self._ad_window_latest,
                    ref_l,
                    time_format=detected_fmt,
                    predominant_data_tz=predominant_tz,
                    fallback_data_tz=fallback_tz,
                    naive_wall_tzinfo=naive_wall,
                    naive_string_data_matches_pandas_utc=getattr(
                        self, "_parse_detection_window_naive_use_utc", False
                    ),
                )
            else:
                latest_epoch = dataset_last_epoch

            if earliest_epoch > latest_epoch:
                raise RuntimeError(
                    "CDTSM anomaly_detection: detection_window_earliest cannot be after "
                    "detection_window_latest (latest must be >= earliest)."
                )

            window_duration = latest_epoch - earliest_epoch
            if window_duration > MAX_DETECTION_WINDOW_SECONDS:
                hours = window_duration / 3600
                max_hours = MAX_DETECTION_WINDOW_SECONDS / 3600
                raise RuntimeError(
                    f"CDTSM anomaly_detection: detection window duration "
                    f"({hours:.1f} hours) exceeds the maximum allowed "
                    f"({max_hours:.0f} hours). Please narrow the window by "
                    f"adjusting detection_window_earliest or "
                    f"detection_window_latest."
                )

            times_float = np.array(all_times, dtype=float)
            detection_mask = (times_float >= earliest_epoch) & (times_float <= latest_epoch)
            detection_indices = np.atleast_1d(np.where(detection_mask)[0]).astype(np.int64)
            if len(detection_indices) == 0:
                raise RuntimeError(
                    "CDTSM anomaly_detection: no data points fall within the "
                    f"detection window [{earliest_epoch}, {latest_epoch}]."
                )
            detection_start_idx = int(detection_indices[0])
            K = int(len(detection_indices))
            H = detection_start_idx

            if not suppress_high_frequency_logs:
                logger.info(
                    "CDTSM anomaly_detection: window resolved — "
                    "earliest_epoch=%.1f, latest_epoch=%.1f, "
                    "detection_start_idx=%d, K=%d, H=%d",
                    earliest_epoch,
                    latest_epoch,
                    detection_start_idx,
                    K,
                    H,
                )

            if H == 0:
                raise RuntimeError(
                    "CDTSM anomaly_detection: not sufficient data points in " "context."
                )

            min_h = _min_context_rows_for_h_validation(self)
            if H < min_h:
                raise RuntimeError(
                    f"CDTSM anomaly_detection: not sufficient data points in context"
                )

            if H < RECOMMENDED_ANOMALY_DETECTION_POINTS:
                messages.warn(
                    f"Anomaly detection accuracy improves when you include more "
                    f"than {RECOMMENDED_ANOMALY_DETECTION_POINTS} data points "
                    f"from a time series' history."
                )

        elif self._ad_window_latest is not None:
            H_cfg = effective_context_length
            if H_cfg is None:
                raise RuntimeError(
                    "CDTSM anomaly_detection: latest-only detection window requires "
                    "context_length (internal configuration error)."
                )

            dataset_last_epoch = float(all_times[-1])
            now_epoch = time.time()
            detected_fmt = getattr(self, '_detected_time_format', None)
            original_sample = getattr(self, '_original_time_sample', None)

            predominant_tz = getattr(self, '_predominant_data_tz', None)
            fallback_tz = _extract_data_timezone(detected_fmt, original_sample)
            if predominant_tz is not None and not suppress_high_frequency_logs:
                logger.info(
                    "CDTSM anomaly_detection: predominant data timezone %s — "
                    "naive detection_window_* strings are localized here (same as "
                    "offsets in the time column), not Splunk user TZ",
                    predominant_tz,
                )
            elif fallback_tz is not None and not suppress_high_frequency_logs:
                logger.info(
                    "CDTSM anomaly_detection: detected data timezone %s "
                    "from format '%s' — naive window parameters localized here",
                    fallback_tz,
                    detected_fmt,
                )

            self._validate_detection_window_value_for_custom_time_field(
                self._ad_window_latest, "detection_window_latest"
            )
            naive_wall = self._naive_wall_tzinfo_for_detection_window()
            self._log_naive_detection_window_wall(naive_wall)

            ref_l = (
                now_epoch
                if _RELATIVE_TIME_RE.match(str(self._ad_window_latest).strip())
                else dataset_last_epoch
            )
            latest_epoch = parse_detection_window_time(
                self._ad_window_latest,
                ref_l,
                time_format=detected_fmt,
                predominant_data_tz=predominant_tz,
                fallback_data_tz=fallback_tz,
                naive_wall_tzinfo=naive_wall,
                naive_string_data_matches_pandas_utc=getattr(
                    self, "_parse_detection_window_naive_use_utc", False
                ),
            )

            times_float = np.array(all_times, dtype=float)
            row_idx = np.arange(N, dtype=np.int64)
            detection_mask = (row_idx >= H_cfg) & (times_float <= latest_epoch)
            detection_indices = np.atleast_1d(np.where(detection_mask)[0]).astype(np.int64)
            if len(detection_indices) == 0:
                raise RuntimeError(
                    "CDTSM anomaly_detection: no data points fall in the detection "
                    f"candidate range (row index >= {H_cfg} and time <= "
                    f"detection_window_latest)."
                )
            if len(detection_indices) > 1:
                if not np.all(np.diff(detection_indices) == 1):
                    raise RuntimeError(
                        "CDTSM anomaly_detection: detection candidates must be contiguous "
                        "in row order; sort your data by the time field."
                    )

            detection_start_idx = int(detection_indices[0])
            K = int(len(detection_indices))
            H = H_cfg

            first_det_ts = float(all_times[detection_start_idx])
            if first_det_ts > latest_epoch:
                raise RuntimeError(
                    "CDTSM anomaly_detection: detection_window_latest is before the "
                    f"time at the first detection row (index {detection_start_idx})."
                )
            window_duration = latest_epoch - first_det_ts
            if window_duration > MAX_DETECTION_WINDOW_SECONDS:
                hours = window_duration / 3600
                max_hours = MAX_DETECTION_WINDOW_SECONDS / 3600
                raise RuntimeError(
                    f"CDTSM anomaly_detection: detection window duration "
                    f"({hours:.1f} hours) exceeds the maximum allowed "
                    f"({max_hours:.0f} hours). Please narrow detection_window_latest "
                    f"or reduce context_length."
                )

            if not suppress_high_frequency_logs:
                logger.info(
                    "CDTSM anomaly_detection: latest-capped window — "
                    "latest_epoch=%.1f, context_length=%d, "
                    "detection_start_idx=%d, K=%d, H=%d",
                    latest_epoch,
                    H_cfg,
                    detection_start_idx,
                    K,
                    H,
                )

            if H == 0:
                raise RuntimeError(
                    "CDTSM anomaly_detection: not sufficient data points in " "context."
                )

            min_h = _min_context_rows_for_h_validation(self)
            if H < min_h:
                raise RuntimeError(
                    f"CDTSM anomaly_detection: not sufficient data points in context"
                )

            if H < RECOMMENDED_ANOMALY_DETECTION_POINTS:
                messages.warn(
                    f"Anomaly detection accuracy improves when you include more "
                    f"than {RECOMMENDED_ANOMALY_DETECTION_POINTS} data points "
                    f"from a time series' history."
                )

        else:
            H = effective_context_length
            K_requested = self._ad_detection_length
            if N <= H:
                raise RuntimeError(
                    f"CDTSM anomaly_detection: not enough data for "
                    f"context_length={H}. Only {N} usable row(s) after cleaning; "
                    f"need more than {H} rows to reserve {H} context points before "
                    f"any detection window."
                )
            detection_start_idx = H
            K = min(K_requested, N - H)
            if H < _min_context_rows_for_h_validation(self):
                raise _SkipAnomalyByGroup(
                    "not enough context points after per-group cleaning "
                    f"(N={N}, H={H}, K={K})."
                )
            # if K < K_requested:
            #     messages.warn(
            #         f"CDTSM anomaly_detection: reserved {H} point(s) for "
            #         f"context (context_length), leaving {K} point(s) for detection "
            #         f"instead of the requested detection_length={K_requested}. "
            #         f"Anomaly scoring runs on these {K} point(s) only."
            #     )

            if N < detection_start_idx + K:
                raise RuntimeError(
                    f"CDTSM anomaly_detection: not enough data. "
                    f"Need at least {detection_start_idx + K} points, "
                    f"but only {N} available."
                )

        if K == 0:
            raise RuntimeError(
                "CDTSM anomaly_detection: detection window contains 0 data "
                "points. Please adjust 'detection_window_earliest' / "
                "'detection_window_latest' or 'detection_length' to include "
                "data in the detection window."
            )

        # Cap stride to MAX_QUANTILE_HORIZON so every forecast call gets
        # complete quantile coverage from the API (which only returns
        # quantiles for the first MAX_QUANTILE_HORIZON points). Also enforce
        # MAX_AD_STRIDE as a hard upper bound on stride.
        S = min(self._ad_stride, MAX_QUANTILE_HORIZON, MAX_AD_STRIDE)

        base_context_start_idx = detection_start_idx - H

        if S < self._ad_stride and not suppress_high_frequency_logs:
            logger.info(
                "CDTSM anomaly_detection: stride capped from %d to %d "
                "(min of MAX_QUANTILE_HORIZON=%d, MAX_AD_STRIDE=%d)",
                self._ad_stride,
                S,
                MAX_QUANTILE_HORIZON,
                MAX_AD_STRIDE,
            )
        if not suppress_high_frequency_logs:
            logger.info(
                "CDTSM anomaly_detection: N=%d, H=%d, K=%d, S=%d, "
                "context_range=[%d:%d], detection_range=[%d:%d]",
                N,
                H,
                K,
                S,
                base_context_start_idx,
                detection_start_idx,
                detection_start_idx,
                detection_start_idx + K,
            )
        if H < _min_context_rows_for_h_validation(self):
            raise _SkipAnomalyByGroup(
                "not enough context points after per-group cleaning " f"(N={N}, H={H}, K={K})."
            )
        self._record_anomaly_by_preprocess_step_timing(
            "detection_window_resolution", time.perf_counter() - _window_t0
        )
        self._record_cdtsm_apply_timing(
            "preprocessing", time.perf_counter() - _preprocessing_phase_t0
        )

        col_arrays = {
            col: df_clean[col].to_numpy(dtype=float, copy=False) for col in self.columns
        }
        quantiles_list = list(self.percentiles)

        # Phase 1: Precompute lightweight (stride x column) context descriptors.
        # The heavier coarse/fine contexts are built only for the current API batch.
        full_entries = []
        full_entry_map = []
        partial_entries = []
        partial_entry_map = []
        partial_horizon = None

        _payload_t0 = time.perf_counter()
        stride_idx = 0
        for offset in range(0, K, S):
            ctx_start = base_context_start_idx + offset
            det_offset = detection_start_idx + offset
            points_to_use = min(S, K - offset)
            is_partial = points_to_use < S

            for col in self.columns:
                entry = (stride_idx, col, ctx_start, det_offset)

                if is_partial:
                    partial_entries.append(entry)
                    partial_entry_map.append((stride_idx, col))
                    partial_horizon = points_to_use
                else:
                    full_entries.append(entry)
                    full_entry_map.append((stride_idx, col))

            stride_idx += 1

        num_strides = stride_idx
        total_entries = len(full_entries) + len(partial_entries)
        full_batches = (
            (len(full_entries) + MAX_PAYLOAD_ENTRIES_PER_CALL - 1)
            // MAX_PAYLOAD_ENTRIES_PER_CALL
            if full_entries
            else 0
        )
        total_calls = full_batches + (1 if partial_entries else 0)
        descriptor_elapsed = time.perf_counter() - _payload_t0
        self._record_cdtsm_apply_timing("materialization", descriptor_elapsed)
        self._record_anomaly_by_preprocess_step_timing("descriptor_build", descriptor_elapsed)
        self._record_anomaly_by_preprocess_step_timing(
            "group_preprocess_total", time.perf_counter() - _preprocessing_phase_t0
        )
        if not suppress_high_frequency_logs:
            logger.info(
                "CDTSM anomaly_detection: precomputed %d context descriptors (%d strides x %d cols), "
                "standalone batching would use %d API call(s) (max %d entries/call), "
                "descriptor_build=%.4fs",
                total_entries,
                num_strides,
                len(self.columns),
                total_calls,
                MAX_PAYLOAD_ENTRIES_PER_CALL,
                descriptor_elapsed,
            )
        prep = AnomalyPrecomputedState(
            df_clean=df_clean,
            N=N,
            all_times=all_times,
            H=H,
            K=K,
            S=S,
            detection_start_idx=detection_start_idx,
            base_context_start_idx=base_context_start_idx,
            col_arrays=col_arrays,
            full_entries=full_entries,
            partial_entries=partial_entries,
            full_entry_map=full_entry_map,
            partial_entry_map=partial_entry_map,
            partial_horizon=partial_horizon,
            ad_context_length_effective=int(H),
            ad_short_series_context_clamped=short_series_context_clamped,
            quantiles_list=quantiles_list,
            was_repaired=bool(
                getattr(self, "_time_series_was_repaired", False)
                or getattr(self, "_cdtsm_repair_warning_pending", False)
            ),
        )
        return prep

    def _anomaly_phase_api_and_postprocess(self, prep, options=None, all_predictions=None):
        """HTTP batching, demux, postprocessing, and AnomalyViz columns from precomputed state."""
        self._ad_context_length_effective = prep.ad_context_length_effective
        self._ad_short_series_context_clamped = prep.ad_short_series_context_clamped
        N = prep.N
        K = prep.K
        S = prep.S
        detection_start_idx = prep.detection_start_idx
        col_arrays = prep.col_arrays
        df_clean = prep.df_clean
        all_times = prep.all_times
        full_entries = prep.full_entries
        partial_entries = prep.partial_entries
        full_entry_map = prep.full_entry_map
        partial_entry_map = prep.partial_entry_map
        # ``partial_horizon`` and ``quantiles_list`` used to be read here to
        # construct the API payload locally, but the per-batch payload is now
        # built inside ``_call_anomaly_api_for_group_preps`` (which reads them
        # straight off ``prep``). They are intentionally not bound to local
        # names anymore.
        _api_phase_t0 = time.perf_counter()
        if all_predictions is None:
            # Delegate to the same compacted-batch scheduler that the BY
            # anomaly flow uses. We pass a single-item prep_items list so the
            # scheduler treats this as one "combination" while still:
            #   * compacting full + partial-stride entries into the smallest
            #     possible number of horizon-uniform API requests,
            #   * issuing those requests with asyncio + per-process token
            #     bucket so multiple batches are in-flight concurrently up
            #     to the configured max concurrency,
            #   * handling 429 / transient transport errors with per-request
            #     local retry, scheduler-level requeue + jittered backoff,
            #     async-client rebuild on transient streaks, and progress
            #     watchdogs (max wall-clock + no-success-timeout).
            # When the compaction collapses everything into a single API
            # call the scheduler's fast path keeps the call synchronous so
            # existing test mocks on ``_call_endpoint`` continue to work
            # transparently. ``quantiles_list``, ``S``, and ``partial_horizon``
            # are no longer referenced here — they are derived from ``prep``
            # inside the scheduler.
            if full_entries or partial_entries:
                predictions_by_index = self._call_anomaly_api_for_group_preps(
                    [(0, None, prep)],
                    flow_label="compacted",
                )
                all_predictions = predictions_by_index[0]
                del predictions_by_index
            else:
                all_predictions = []
            self._record_cdtsm_apply_timing("api", time.perf_counter() - _api_phase_t0)
        elif not isinstance(all_predictions, list):
            all_predictions = list(all_predictions)
        del full_entries, partial_entries

        _postprocess_phase_t0 = time.perf_counter()
        # Phase 3: Demux responses back to per-stride, per-column order
        expected_prediction_count = len(full_entry_map) + len(partial_entry_map)
        if len(all_predictions) != expected_prediction_count:
            raise RuntimeError(
                "CDTSM anomaly_detection: API prediction count mismatch "
                f"({len(all_predictions)} prediction(s) for {expected_prediction_count} payload entries)."
            )

        quantile_keys = [p for p in self.percentiles if p != PERCENTILE_MEAN]
        per_col_forecast_arrays = {col: np.zeros(K, dtype=float) for col in self.columns}
        per_col_quantile_arrays = {
            col: {p: np.zeros(K, dtype=float) for p in quantile_keys} for col in self.columns
        }

        def _assign_prediction_to_arrays(entry_desc, prediction):
            s_idx, col = entry_desc
            offset = int(s_idx) * S
            pts = min(S, K - offset)
            if pts <= 0:
                return

            mean_vals = prediction.get("mean") if isinstance(prediction, dict) else None
            if mean_vals is not None:
                mean_arr = np.asarray(mean_vals[:pts], dtype=float)
                per_col_forecast_arrays[col][offset : offset + mean_arr.size] = mean_arr

            quantiles_data = (
                prediction.get("quantiles", {}) if isinstance(prediction, dict) else {}
            )
            col_q_arrays = per_col_quantile_arrays[col]
            for p_key in quantile_keys:
                q_vals = quantiles_data.get(p_key)
                if q_vals is None:
                    continue
                q_arr = np.asarray(q_vals[:pts], dtype=float)
                col_q_arrays[p_key][offset : offset + q_arr.size] = q_arr

        pred_idx = 0
        for entry_desc in full_entry_map:
            _assign_prediction_to_arrays(entry_desc, all_predictions[pred_idx])
            pred_idx += 1
        for entry_desc in partial_entry_map:
            _assign_prediction_to_arrays(entry_desc, all_predictions[pred_idx])
            pred_idx += 1
        del all_predictions, full_entry_map, partial_entry_map

        per_col_final_flags = {}
        per_col_scores = {}
        per_col_threshold_columns = {}

        # When fill_null=interpolate (the default) the coarse/fine context
        # builders interpolate gaps in the context window, but the detection
        # window slice can still carry NaNs. Postprocessing needs finite
        # actuals, so linearly interpolate NaNs across the detection window
        # using numpy. We compute the x-axis once and only enter the
        # interpolation branch when NaNs are actually present for the metric.
        #
        # Whenever we materially interpolate actuals here, we also remember
        # the interpolated series in ``per_col_interpolated_detection`` so
        # the final SPL output can show the interpolated values for that
        # metric column inside the detection window (otherwise the row would
        # display ``null`` for the metric even though the score / state /
        # threshold columns reflect the interpolated value — confusing).
        fill_mode_is_interp = (
            getattr(self, "fill_null", FILL_NULL_INTERPOLATE) == FILL_NULL_INTERPOLATE
        )
        det_x_axis = np.arange(K) if (fill_mode_is_interp and K > 0) else None
        per_col_interpolated_detection = {}

        for col in self.columns:
            actuals_arr = np.asarray(
                col_arrays[col][detection_start_idx : detection_start_idx + K],
                dtype=float,
            )
            if fill_mode_is_interp:
                nan_mask = np.isnan(actuals_arr)
                if nan_mask.any():
                    finite_mask = ~nan_mask
                    if finite_mask.any():
                        # ``actuals_arr`` is a view into ``col_arrays[col]``
                        # (which itself is a view into ``df_clean``). Copy
                        # before writing so the upstream frame stays
                        # untouched. ``np.interp`` is constant-extrapolating
                        # at the edges, which matches forward/backward-fill
                        # behavior on leading/trailing NaNs.
                        actuals_arr = actuals_arr.copy()
                        actuals_arr[nan_mask] = np.interp(
                            det_x_axis[nan_mask],
                            det_x_axis[finite_mask],
                            actuals_arr[finite_mask],
                        )
                        per_col_interpolated_detection[col] = actuals_arr
            forecasts_arr = per_col_forecast_arrays[col]
            forecast_quantiles = {}
            for p_key, q_arr in per_col_quantile_arrays[col].items():
                if p_key in P_TO_FLOAT_MAP:
                    forecast_quantiles[P_TO_FLOAT_MAP[p_key]] = q_arr

            if self._ad_method == AD_METHOD_QUANBIN:
                pointwise_params = {
                    "quantile_upper": float(self._ad_quantile_upper),
                    "quantile_lower": float(self._ad_quantile_lower),
                    "multiplier": self._ad_multiplier,
                    "threshold_direction": self._ad_threshold_direction,
                }
                fq_for_pp = ensure_quanbin_median_quantile(forecast_quantiles, pointwise_params)
            else:
                # residual — SPL uses `multiplier`; map to postprocessing `threshold_value`.
                pointwise_params = {
                    "threshold_value": float(self._ad_threshold),
                    "threshold_direction": self._ad_threshold_direction,
                }
                fq_for_pp = forecast_quantiles

            _pp_module_t0 = time.perf_counter()
            try:
                pp_result = run_postprocessing(
                    actuals=actuals_arr,
                    forecasts=forecasts_arr,
                    forecast_quantiles=fq_for_pp,
                    pointwise_method=self._ad_method,
                    pointwise_params=pointwise_params,
                    segment_method=self._ad_segment_method,
                    segment_params=self._ad_segment_params,
                )
            except Exception as e:
                logger.error(
                    "CDTSM anomaly_detection: postprocessing failed for %s: %s", col, str(e)
                )
                raise RuntimeError(f"CDTSM anomaly_detection postprocessing failed: {e}")
            self._record_anomaly_by_pp_module_call(time.perf_counter() - _pp_module_t0)

            per_col_final_flags[col] = pp_result["final_flags"]
            per_col_scores[col] = pp_result["scores"]
            per_col_threshold_columns[col] = pp_result.get("threshold_columns") or {}

        # When show_input=True (default) include history + detection + post
        # rows so AnomalyViz can render the full context.  When False, return
        # detection window + post rows only.
        include_history = self.show_input

        detection_end_idx = detection_start_idx + K
        post_count = N - detection_end_idx

        base_cols = [self.time_field] + list(self.columns)
        if CDTSM_INTERNAL_ROW_TZ_COLUMN in df_clean.columns:
            base_cols.append(CDTSM_INTERNAL_ROW_TZ_COLUMN)

        if include_history:
            output_row_slice = slice(None)
            out_detection_offset = detection_start_idx
        else:
            output_row_slice = slice(detection_start_idx, detection_end_idx)
            out_detection_offset = 0
            post_count = 0

        n_out = N if include_history else K
        det_slice = slice(out_detection_offset, out_detection_offset + K)
        output_cols = {
            col: df_clean[col].to_numpy(copy=False)[output_row_slice] for col in base_cols
        }
        # When ``fill_null=interpolate`` and the detection window had NaNs,
        # ``per_col_interpolated_detection`` holds the numpy-interpolated
        # actuals for each affected metric. Overlay them onto the output
        # column for those rows so the SPL response shows interpolated
        # values rather than nulls. Context-window rows are intentionally
        # left untouched (their interpolation, if any, happens inside the
        # coarse/fine context builders before the API call only — those
        # interpolated values are not surfaced as output).
        if per_col_interpolated_detection:
            for _interp_col, _interp_actuals in per_col_interpolated_detection.items():
                if _interp_col not in output_cols:
                    continue
                # output_cols[_interp_col] is currently a view into df_clean
                # (``to_numpy(copy=False)``). Materialize a writable float
                # array before overwriting the detection slice so df_clean
                # — which may be a shallow copy of the user-supplied frame
                # — is never mutated.
                _col_out = np.array(output_cols[_interp_col], dtype=float, copy=True)
                _col_out[det_slice] = _interp_actuals
                output_cols[_interp_col] = _col_out
        emit_numpy_arrays = getattr(self, "_cdtsm_emit_numpy_arrays", False)
        if not emit_numpy_arrays:
            # Per-row constant object columns; in BY mode these are added once at
            # final collation to avoid materializing them N times.
            output_cols["_vars"] = np.full(n_out, ",".join(self.columns), dtype=object)
            output_cols["_time_field"] = np.full(n_out, self.time_field, dtype=object)
        zone_col = np.full(n_out, ZONE_FORECAST, dtype=object)
        if include_history:
            if detection_start_idx > 0:
                zone_col[:detection_start_idx] = ZONE_HISTORY
            if post_count > 0:
                zone_col[detection_end_idx:] = ZONE_POST
        output_cols["_zone"] = zone_col

        for col in self.columns:
            final_flags = per_col_final_flags[col]
            scores = per_col_scores[col]
            forecasts_arr = per_col_forecast_arrays[col]

            forecast_col = f"{col}.forecast"
            forecast_values = np.full(n_out, np.nan, dtype=float)
            forecast_values[det_slice] = forecasts_arr
            output_cols[forecast_col] = forecast_values

            for ci_val in self._ad_ci_bands:
                lower_q, upper_q = CONF_INTERVAL_TO_QUANTILES[ci_val]
                lower_p_key = float_quantile_to_percentile_key(lower_q)
                upper_p_key = float_quantile_to_percentile_key(upper_q)
                for label, p_key in [
                    (f"upper{ci_val}", upper_p_key),
                    (f"lower{ci_val}", lower_p_key),
                ]:
                    band_col = f"_{label}.{col}"
                    q_vals = per_col_quantile_arrays[col].get(p_key)
                    band_values = np.full(n_out, np.nan, dtype=float)
                    if q_vals is not None:
                        band_values[det_slice] = q_vals
                    output_cols[band_col] = band_values

            tc = per_col_threshold_columns.get(col) or {}
            lower_list = tc.get("threshold_lower")
            upper_list = tc.get("threshold_upper")
            if lower_list is not None and upper_list is not None:
                lower_thresh = np.asarray(lower_list, dtype=float)
                upper_thresh = np.asarray(upper_list, dtype=float)
                for suffix, vals in [
                    ("_threshold_upper", upper_thresh),
                    ("_threshold_lower", lower_thresh),
                ]:
                    tcol = f"{suffix}.{col}"
                    tvals = np.full(n_out, np.nan, dtype=float)
                    tvals[det_slice] = vals
                    output_cols[tcol] = tvals
                for public_suffix, vals in [
                    ("threshold_upper", upper_thresh),
                    ("threshold_lower", lower_thresh),
                ]:
                    public_col = f"{col}.{public_suffix}"
                    public_vals = np.full(n_out, np.nan, dtype=float)
                    public_vals[det_slice] = vals
                    output_cols[public_col] = public_vals

            score_col = f"{col}.anomaly_score"
            state_col = f"{col}.anomaly_state"
            flags_arr = np.asarray(final_flags, dtype=bool)
            if scores is not None:
                score_values = np.asarray(scores, dtype=float)
            else:
                score_values = flags_arr.astype(float)
            score_col_values = np.full(n_out, np.nan, dtype=float)
            score_col_values[det_slice] = score_values
            output_cols[score_col] = score_col_values
            state_col_values = np.full(n_out, "", dtype=object)
            state_col_values[det_slice] = np.where(
                flags_arr, ANOMALY_STATE_ANOMALOUS, ANOMALY_STATE_NORMAL
            )
            output_cols[state_col] = state_col_values

        for col in self.columns:
            is_anomaly_col = np.zeros(n_out, dtype=np.int8)
            ff = np.asarray(per_col_final_flags[col], dtype=bool)
            is_anomaly_col[out_detection_offset : out_detection_offset + K] = ff.astype(np.int8)
            output_cols[f"_isAnomaly.{col}"] = is_anomaly_col
            is_anomaly_start, is_anomaly_end = _anomaly_run_edges_from_is_anomaly(
                is_anomaly_col
            )
            output_cols[f"_is_anomaly_start.{col}"] = is_anomaly_start
            output_cols[f"_is_anomaly_end.{col}"] = is_anomaly_end

        eval_start_ts = float(all_times[detection_start_idx])
        eval_end_ts = float(all_times[detection_start_idx + K - 1])
        output_cols["_evalStart"] = np.full(n_out, eval_start_ts, dtype=float)
        output_cols["_evalEnd"] = np.full(n_out, eval_end_ts, dtype=float)

        if emit_numpy_arrays:
            # BY collation will add per-row constant object columns once for the
            # final concatenated frame (huge perf win for 16M+ rows / many groups).
            self._record_cdtsm_apply_timing(
                "postprocessing", time.perf_counter() - _postprocess_phase_t0
            )
            return {
                "n_rows": n_out,
                "history_count": detection_start_idx if include_history else 0,
                "K": K,
                "post_count": post_count,
                "include_history": include_history,
                "columns": output_cols,
            }

        output_cols["_ciList"] = np.full(
            n_out, ",".join(str(ci) for ci in self._ad_ci_bands), dtype=object
        )
        result_df = pd.DataFrame(output_cols)

        history_count = detection_start_idx if include_history else 0
        suppress_group_output_logs = getattr(self, "_cdtsm_suppress_group_post_api_logs", False)
        if not suppress_group_output_logs:
            logger.info(
                "CDTSM anomaly_detection: completed. %d total rows "
                "(%d history + %d detection + %d post), %d columns, include_history=%d",
                len(result_df),
                history_count,
                K,
                post_count,
                len(result_df.columns),
                1 if include_history else 0,
            )

        if not getattr(self, "_cdtsm_suppress_anomaly_telemetry", False):
            seg = getattr(self, '_ad_segment_params', {}) or {}
            try:
                log_cdtsm_anomaly_params(
                    mode=self.mode,
                    model_name=self.model_name,
                    num_columns=len(self.columns),
                    time_field=self.time_field,
                    show_input=self.show_input,
                    forecast_k=self.horizon,
                    holdback=self.holdback,
                    quantiles=",".join(self.user_percentiles),
                    conf_interval=self.conf_interval or 0,
                    method=getattr(self, "_ad_spl_method", self._ad_method),
                    context_length=self._ad_context_length,
                    detection_length=self._ad_detection_length,
                    detection_window_earliest=self._ad_window_earliest,
                    detection_window_latest=self._ad_window_latest,
                    context_window_earliest=getattr(self, "_ad_context_window_earliest", None),
                    context_window_latest=getattr(self, "_ad_context_window_latest", None),
                    stride=self._ad_stride,
                    threshold=self._ad_threshold,
                    quantile_lower=self._ad_quantile_lower,
                    quantile_upper=self._ad_quantile_upper,
                    multiplier=self._ad_multiplier,
                    threshold_direction=self._ad_threshold_direction,
                    segment_method=self._ad_segment_method,
                    on_span=seg.get("on_span"),
                    on_ratio=seg.get("on_ratio"),
                    off_span=seg.get("off_span"),
                    off_ratio=seg.get("off_ratio"),
                    win_size=seg.get("win_size"),
                    agg_func=seg.get("agg_fun"),
                    conf_interval_viz=",".join(str(ci) for ci in self._ad_ci_bands),
                    num_datapoints=N,
                    detection_points=K,
                    is_groupby=1 if getattr(self, "forecast_by", None) else 0,
                    was_repaired=getattr(self, "_time_series_was_repaired", False),
                )
            except Exception:
                pass
        self._record_cdtsm_apply_timing(
            "postprocessing", time.perf_counter() - _postprocess_phase_t0
        )
        return result_df

    def _call_anomaly_api_for_group_preps(self, prep_items, flow_label="forecast_by compacted"):
        """Call anomaly forecast API for one or more preps using compacted stride-compatible batches.

        The same scheduler is used for both BY (``forecast_by``) flows and the
        non-BY single-series flow. In the latter case the caller passes a
        single ``(0, None, prep)`` item and a ``flow_label`` of ``"compacted"``
        (or another flow-specific label) so log lines accurately describe the
        path. Concurrency / 429 retry / transient-error recovery behavior is
        identical across flows; this is the single async fan-out that the
        non-BY flow now reuses to issue multiple API requests in-flight.

        Args:
            prep_items (list): ``[(group_index, group_key, AnomalyPrecomputedState), ...]``.
            flow_label (str): Short descriptor inserted into the API-phase log
                messages. Defaults to ``"forecast_by compacted"`` (BY flow);
                pass ``"compacted"`` for non-BY single-series.

        Returns:
            dict: ``group_index -> predictions`` in the exact order expected by
            :meth:`_anomaly_phase_api_and_postprocess`.
        """
        predictions_by_index = {}
        horizon_counts = {}
        horizon_order = []
        quantiles_list = None

        for group_index, key, prep in prep_items:
            predictions_by_index[group_index] = [None] * (
                len(prep.full_entries) + len(prep.partial_entries)
            )
            if quantiles_list is None:
                quantiles_list = prep.quantiles_list
            elif list(quantiles_list) != list(prep.quantiles_list):
                raise RuntimeError(
                    "CDTSM anomaly_detection: internal error — mixed quantile metadata "
                    "across forecast_by groups."
                )
            if prep.S not in horizon_counts:
                horizon_counts[prep.S] = 0
                horizon_order.append(prep.S)
            horizon_counts[prep.S] += len(prep.full_entries) + len(prep.partial_entries)

        quantiles_list = quantiles_list or list(self.percentiles)
        cap = int(MAX_PAYLOAD_ENTRIES_PER_CALL)
        total_entries = sum(horizon_counts.values())
        total_calls = sum((count + cap - 1) // cap for count in horizon_counts.values())
        logger.info(
            "CDTSM anomaly_detection: %s API phase — %d payload "
            "context(s) across %d combination(s), up to %d context(s)/request, "
            "%d request(s); partial stride entries share the stride horizon and are "
            "trimmed after demux.",
            flow_label,
            total_entries,
            len(prep_items),
            cap,
            total_calls,
        )

        def _iter_tasks_for_horizon(horizon):
            for group_index, key, prep in prep_items:
                if prep.S != horizon:
                    continue
                order_idx = 0
                for entry in prep.full_entries:
                    yield group_index, key, order_idx, entry, prep
                    order_idx += 1
                for entry in prep.partial_entries:
                    # Request the stride horizon and trim extra forecast points during postprocess.
                    # This lets short final strides compact with full strides instead of creating
                    # separate small-horizon API calls.
                    yield group_index, key, order_idx, entry, prep
                    order_idx += 1

        def _iter_batch_specs():
            for horizon in horizon_order:
                task_count = horizon_counts[horizon]
                if not task_count:
                    continue
                n_batches = (task_count + cap - 1) // cap
                task_iter = _iter_tasks_for_horizon(horizon)
                for batch_idx in range(1, n_batches + 1):
                    chunk = []
                    for _ in range(cap):
                        try:
                            chunk.append(next(task_iter))
                        except StopIteration:
                            break
                    if not chunk:
                        break
                    yield horizon, batch_idx, n_batches, chunk

        def _store_chunk_predictions(chunk, predictions):
            for (group_index, _key, order_idx, _entry, _prep), pred in zip(chunk, predictions):
                predictions_by_index[group_index][order_idx] = pred

        def _build_payload_for_chunk(chunk, horizon):
            return {
                "payload": [
                    self._materialize_anomaly_payload_entry(prep, entry_desc)
                    for _group_index, _key, _order_idx, entry_desc, prep in chunk
                ],
                "model": self.api_model_name,
                "metadata": {"quantiles": quantiles_list, "horizon": horizon},
            }

        def _call_batch(batch_number, horizon, batch_idx, n_batches, chunk):
            logger.info(
                "CDTSM anomaly_detection: %s API batch %d/%d "
                "(horizon batch %d/%d) — horizon=%d, context_count=%d",
                flow_label,
                batch_number,
                total_calls,
                batch_idx,
                n_batches,
                horizon,
                len(chunk),
            )
            _payload_t0 = time.perf_counter()
            payload = _build_payload_for_chunk(chunk, horizon)
            self._record_cdtsm_apply_timing(
                "materialization", time.perf_counter() - _payload_t0
            )
            response = self._call_endpoint(payload, horizon)
            predictions = response.get("predictions", [])
            if len(predictions) != len(chunk):
                raise RuntimeError(
                    "CDTSM anomaly_detection: API prediction count mismatch "
                    f"({len(predictions)} prediction(s) for {len(chunk)} payload entries)."
                )
            _store_chunk_predictions(chunk, predictions)
            del payload, response, predictions

        async def _call_batch_async(
            async_infer_session,
            batch_number,
            horizon,
            batch_idx,
            n_batches,
            chunk,
            *,
            force_fresh_connection: bool = False,
        ):
            logger.info(
                "CDTSM anomaly_detection: %s async API batch %d/%d "
                "(horizon batch %d/%d) — horizon=%d, context_count=%d%s",
                flow_label,
                batch_number,
                total_calls,
                batch_idx,
                n_batches,
                horizon,
                len(chunk),
                " [fresh connection]" if force_fresh_connection else "",
            )
            _payload_t0 = time.perf_counter()
            payload = await asyncio.to_thread(_build_payload_for_chunk, chunk, horizon)
            self._record_cdtsm_apply_timing(
                "materialization", time.perf_counter() - _payload_t0
            )
            response = await async_infer_session.infer(
                payload,
                horizon,
                force_fresh_connection=force_fresh_connection,
            )
            predictions = response.get("predictions", [])
            if len(predictions) != len(chunk):
                raise RuntimeError(
                    "CDTSM anomaly_detection: API prediction count mismatch "
                    f"({len(predictions)} prediction(s) for {len(chunk)} payload entries)."
                )
            _store_chunk_predictions(chunk, predictions)
            del payload, response, predictions

        async def _run_batch_specs_async(max_concurrency, rate_limiter):
            import heapq
            import random

            from cdtsm_pkg.forecast_providers import (
                CDTSMRateLimitRetryExhausted,
                CDTSMUpstreamTransientError,
                build_async_infer_session,
            )

            async def _guarded_call(async_infer_session, batch_number, spec, attempt):
                try:
                    await _call_batch_async(
                        async_infer_session,
                        batch_number,
                        *spec,
                        force_fresh_connection=(attempt > 0),
                    )
                    return "success", batch_number, spec, attempt, None
                except CDTSMRateLimitRetryExhausted as exc:
                    return "rate_limited", batch_number, spec, attempt, exc
                except CDTSMUpstreamTransientError as exc:
                    return "transient", batch_number, spec, attempt, exc

            async with build_async_infer_session(
                self, rate_limiter=rate_limiter
            ) as async_infer_session:
                batch_iter = enumerate(_iter_batch_specs(), start=1)
                pending = set()
                delayed = []
                delayed_seq = 0
                new_specs_exhausted = False
                started_at = time.monotonic()
                last_success_at = started_at
                # Streak of CDTSMUpstreamTransientError across batches with no
                # intervening success. Above the threshold we drain pending
                # work and rebuild the underlying httpx.AsyncClient.
                consecutive_transient = 0
                reset_pending = False

                def _schedule_spec(batch_number, spec, attempt):
                    pending.add(
                        asyncio.create_task(
                            _guarded_call(async_infer_session, batch_number, spec, attempt)
                        )
                    )

                def _schedule_next_new():
                    nonlocal new_specs_exhausted
                    try:
                        batch_number, spec = next(batch_iter)
                    except StopIteration:
                        new_specs_exhausted = True
                        return False
                    _schedule_spec(batch_number, spec, attempt=0)
                    return True

                def _schedule_ready_delayed(now):
                    scheduled = 0
                    while delayed and delayed[0][0] <= now and len(pending) < max_concurrency:
                        _ready_at, _seq, batch_number, spec, attempt = heapq.heappop(delayed)
                        _schedule_spec(batch_number, spec, attempt)
                        scheduled += 1
                    return scheduled

                def _fill_pending():
                    now = time.monotonic()
                    if reset_pending:
                        # Hold off on submitting anything while we drain
                        # in-flight work prior to rebuilding the client.
                        return
                    _schedule_ready_delayed(now)
                    if delayed:
                        # Once a batch has exhausted local 429 retries, prioritize
                        # that older job before admitting more fresh work. Otherwise
                        # new jobs can consume the recovered quota before the older
                        # retry wakes up.
                        return
                    while len(pending) < max_concurrency:
                        if delayed and delayed[0][0] <= now:
                            _schedule_ready_delayed(now)
                            continue
                        if not _schedule_next_new():
                            break

                _fill_pending()

                while pending or delayed or not new_specs_exhausted:
                    now = time.monotonic()
                    if now - started_at > CDTSM_RATE_LIMIT_PROGRESS_MAX_WALL_TIME_SECONDS:
                        raise RuntimeError(
                            f"CDTSM anomaly_detection: {flow_label} API phase "
                            "exceeded max wall-clock time while retrying transient batches."
                        )
                    if (
                        now - last_success_at
                        > CDTSM_RATE_LIMIT_PROGRESS_NO_PROGRESS_TIMEOUT_SECONDS
                    ):
                        raise RuntimeError(
                            f"CDTSM anomaly_detection: {flow_label} API phase "
                            "made no successful API progress while retrying transient "
                            "batches."
                        )

                    _fill_pending()

                    # If we are mid-drain ahead of an AsyncClient rebuild and
                    # have drained pending work, perform the rebuild now and
                    # resume normal scheduling. Delayed work is kept on the
                    # heap and will be picked up on the next loop iteration.
                    if reset_pending and not pending:
                        logger.warning(
                            "CDTSM anomaly_detection: rebuilding hosted async "
                            "transport after %d consecutive transient errors.",
                            consecutive_transient,
                        )
                        await async_infer_session.reset()
                        consecutive_transient = 0
                        reset_pending = False
                        _fill_pending()

                    if not pending:
                        if delayed:
                            sleep_for = max(0.0, delayed[0][0] - time.monotonic())
                            await asyncio.sleep(min(sleep_for, 5.0))
                            continue
                        if new_specs_exhausted:
                            break

                    wait_timeout = None
                    if delayed:
                        wait_timeout = max(0.0, delayed[0][0] - time.monotonic())
                    done, pending = await asyncio.wait(
                        pending,
                        timeout=wait_timeout,
                        return_when=asyncio.FIRST_COMPLETED,
                    )
                    if not done:
                        continue
                    for task in done:
                        status, batch_number, spec, attempt, exc = await task
                        if status == "success":
                            last_success_at = time.monotonic()
                            consecutive_transient = 0
                            logger.info(
                                "CDTSM anomaly_detection: %s API "
                                "batch %d completed after %d scheduler-level "
                                "retry attempt(s).",
                                flow_label,
                                batch_number,
                                attempt,
                            )
                            continue

                        # 60s base, ±50% jitter so simultaneously requeued
                        # batches don't wake up in lockstep.
                        retry_delay = float(CDTSM_RATE_LIMIT_PROGRESS_RETRY_DELAY_SECONDS) * (
                            1.0 + random.uniform(0.0, 0.5)
                        )
                        delayed_seq += 1
                        heapq.heappush(
                            delayed,
                            (
                                time.monotonic() + retry_delay,
                                delayed_seq,
                                batch_number,
                                spec,
                                attempt + 1,
                            ),
                        )
                        reason = (
                            "rate-limit (429)"
                            if status == "rate_limited"
                            else "transient transport/connection error"
                        )
                        if status == "transient":
                            consecutive_transient += 1
                            if consecutive_transient >= CDTSM_TRANSIENT_STREAK_RESET_THRESHOLD:
                                reset_pending = True
                        else:
                            consecutive_transient = 0
                        logger.warning(
                            "CDTSM anomaly_detection: %s API "
                            "batch %d exhausted local retries for %s; requeued for "
                            "scheduler-level retry attempt %d after %.1fs. "
                            "pending=%d delayed=%d cause=%s "
                            "transient_streak=%d reset_pending=%s",
                            flow_label,
                            batch_number,
                            reason,
                            attempt + 1,
                            retry_delay,
                            len(pending),
                            len(delayed),
                            type(exc).__name__ if exc is not None else "unknown",
                            consecutive_transient,
                            reset_pending,
                        )

        if total_calls == 1:
            batch_iter = _iter_batch_specs()
            try:
                spec = next(batch_iter)
            except StopIteration:
                spec = None
            if spec is not None:
                _call_batch(1, *spec)
        else:
            # Read configurable throttle parameters; on any error fall back
            # to the in-code defaults so we never block on a config read.
            try:
                from util.ctsm_conf_util import CTSMConfUtil

                throttle = CTSMConfUtil(self._searchinfo).get_cdtsm_api_throttle_params()
                rate_per_minute = float(throttle["rate_limit_per_minute"])
                max_concurrency_cfg = int(throttle["max_concurrency"])
            except Exception as e:  # pragma: no cover - defensive
                logger.warning(
                    "CDTSM anomaly_detection: could not read API throttle params (%s); "
                    "using defaults rate=%s/min, concurrency=%d.",
                    type(e).__name__,
                    CDTSM_API_RATE_LIMIT_PER_MINUTE_DEFAULT,
                    CDTSM_API_MAX_CONCURRENCY_DEFAULT,
                )
                rate_per_minute = CDTSM_API_RATE_LIMIT_PER_MINUTE_DEFAULT
                max_concurrency_cfg = CDTSM_API_MAX_CONCURRENCY_DEFAULT

            from cdtsm_pkg.forecast_providers import build_async_token_bucket

            rate_limiter = build_async_token_bucket(rate_per_minute)
            max_concurrency = min(total_calls, max_concurrency_cfg)
            logger.info(
                "CDTSM anomaly_detection: %s API phase — running "
                "%d request(s) with asyncio, max concurrency=%d, "
                "client-side rate limit=%.1f req/min.",
                flow_label,
                total_calls,
                max_concurrency,
                rate_per_minute,
            )
            asyncio.run(_run_batch_specs_async(max_concurrency, rate_limiter))
        del horizon_counts, horizon_order

        logger.info(
            "CDTSM anomaly_detection: %s API phase completed — api_calls_made=%d",
            flow_label,
            total_calls,
        )

        for group_index, preds in predictions_by_index.items():
            if any(pred is None for pred in preds):
                raise RuntimeError(
                    "CDTSM anomaly_detection: internal error — missing compacted API "
                    f"prediction(s) for forecast_by group index {group_index}."
                )
        return predictions_by_index

    def _apply_anomaly_detection_by_groups(self, df, options=None):
        """Anomaly detection per ``forecast_by`` group, keys sorted case-insensitively.

        Runs :meth:`_ensure_config` once on the full input (wildcard resolution), then
        :meth:`ValidationMixin._cdtsm_apply_time_conversion_once_for_by_groups` so ingest time
        conversion runs once on the full frame (not per group). For each distinct ``forecast_by``
        value, duplicate ``time_field`` rows within a group are merged with
        :meth:`ForecastModeMixin._aggregate_duplicate_timestamps_for_group_by` before scoring.

        **Phase 1 (no HTTP):** precompute validation, detection windows, and batched payload
        entries for every BY group. All groups are prepared sequentially on this instance —
        no thread pool, no per-group child clones — using parent-resolved config snapshots so
        every group skips the full-frame validation/wildcard scan.

        **Phase 2 (compacted HTTP fan-out):** the asyncio-based scheduler in
        :meth:`_call_anomaly_api_for_group_preps` packs every group's context entries into
        the smallest possible set of horizon-uniform API requests and runs them concurrently.

        **Phase 3:** demux + postprocessing (:meth:`_anomaly_phase_api_and_postprocess`) per
        group, sequentially in BY-key order. Group output parts are emitted directly into the
        accumulator so there is no reorder buffer and per-group state is released as we go.

        Returns:
            pd.DataFrame: Concatenated per-group outputs with BY column(s) first.
        """
        fcols = getattr(self, "forecast_by_columns", None) or []
        if not fcols:
            raise RuntimeError(
                "CDTSM: internal error — _apply_anomaly_detection_by_groups called without forecast_by"
            )
        for c in fcols:
            if c not in df.columns:
                raise RuntimeError(
                    f"CDTSM: BY grouping column '{c}' not found in input data. "
                    f"Available columns: {', '.join(df.columns)}"
                )
        by_total_t0 = time.perf_counter()
        # BY groups are now processed serially on ``self`` (no ThreadPoolExecutor
        # in preprocessing or postprocessing), so per-step aggregators can be
        # plain dicts/counters with no locks.
        by_preprocess_step_timings = defaultdict(float)
        by_preprocess_step_counts = defaultdict(int)

        def _record_by_preprocess_step(step, elapsed):
            try:
                elapsed = float(elapsed)
            except (TypeError, ValueError):
                return
            by_preprocess_step_timings[step] += elapsed
            by_preprocess_step_counts[step] += 1

        def _log_by_preprocess_step_summary(groups_prepared, elapsed):
            ordered_steps = [
                "parent_ensure_config",
                "parent_time_conversion",
                "parent_by_null_fill",
                "parent_by_compact",
                "parent_duplicate_aggregation",
                "parent_numeric_validation",
                "parent_preprocess_column_view",
                "parent_group_materialization",
                "group_slice",
                "metric_presence_check",
                "config_validation",
                "time_conversion",
                "sort_reset",
                "time_resolution_repair",
                "numeric_validation",
                "fill_null_dropna",
                "detection_window_resolution",
                "descriptor_build",
                "group_preprocess_total",
            ]
            parts = []
            steps_recorded = 0
            for step in ordered_steps:
                if step not in by_preprocess_step_timings:
                    continue
                steps_recorded += 1
                parts.append(
                    "%s=%.4fs(count=%d)"
                    % (
                        step,
                        by_preprocess_step_timings[step],
                        by_preprocess_step_counts.get(step, 0),
                    )
                )
            extra_steps = sorted(
                step for step in by_preprocess_step_timings if step not in set(ordered_steps)
            )
            for step in extra_steps:
                steps_recorded += 1
                parts.append(
                    "%s=%.4fs(count=%d)"
                    % (
                        step,
                        by_preprocess_step_timings[step],
                        by_preprocess_step_counts.get(step, 0),
                    )
                )
            logger.info(
                "CDTSM anomaly_detection: forecast_by cumulative preprocessing step timings "
                "groups_total=%d groups_prepared=%d elapsed=%.4fs steps_recorded=%d",
                n_groups,
                groups_prepared,
                elapsed,
                steps_recorded,
            )
            logger.info(
                "CDTSM anomaly_detection: forecast_by cumulative preprocessing step breakdown: %s",
                ", ".join(parts) if parts else "no step timings recorded",
            )

        previous_by_preprocess_recorder = getattr(
            self, "_cdtsm_anomaly_by_preprocess_step_recorder", None
        )
        self._cdtsm_anomaly_by_preprocess_step_recorder = _record_by_preprocess_step

        # Cumulative time spent inside ``run_postprocessing`` across all BY
        # groups + metric columns. Plain accumulators are safe because BY
        # groups are processed serially.
        by_pp_module_total = [0.0]
        by_pp_module_count = [0]

        def _record_by_pp_module_call(elapsed):
            try:
                elapsed = float(elapsed)
            except (TypeError, ValueError):
                return
            by_pp_module_total[0] += elapsed
            by_pp_module_count[0] += 1

        previous_by_pp_module_recorder = getattr(
            self, "_cdtsm_anomaly_by_pp_module_recorder", None
        )
        self._cdtsm_anomaly_by_pp_module_recorder = _record_by_pp_module_call

        parent_suppress_hf = getattr(self, "_cdtsm_suppress_high_frequency_logs", False)
        self._cdtsm_suppress_high_frequency_logs = True
        _stage_t0 = time.perf_counter()
        self._ensure_config(df)
        _ensure_elapsed = time.perf_counter() - _stage_t0
        _record_by_preprocess_step("parent_ensure_config", _ensure_elapsed)

        _stage_t0 = time.perf_counter()
        # ``time_out_state`` is no longer used: BY groups run serially on
        # ``self``, which already holds the freshly exported time-output
        # state after ``_cdtsm_apply_time_conversion_once_for_by_groups``.
        df_full, _ = self._cdtsm_apply_time_conversion_once_for_by_groups(df)
        _time_conversion_elapsed = time.perf_counter() - _stage_t0
        _record_by_preprocess_step("parent_time_conversion", _time_conversion_elapsed)

        _stage_t0 = time.perf_counter()
        df_full = self._fill_null_forecast_by_values_for_grouping(df_full)
        _by_null_fill_elapsed = time.perf_counter() - _stage_t0
        _record_by_preprocess_step("parent_by_null_fill", _by_null_fill_elapsed)

        _stage_t0 = time.perf_counter()
        df_full = self._compact_forecast_by_columns_for_grouping(df_full)
        _by_compact_elapsed = time.perf_counter() - _stage_t0
        _record_by_preprocess_step("parent_by_compact", _by_compact_elapsed)

        _stage_t0 = time.perf_counter()
        df_full = self._aggregate_duplicate_timestamps_for_by_groups(df_full, fcols)
        _duplicate_elapsed = time.perf_counter() - _stage_t0
        _record_by_preprocess_step("parent_duplicate_aggregation", _duplicate_elapsed)

        _stage_t0 = time.perf_counter()
        self._validate_numerical_columns(df_full)
        _numeric_validation_elapsed = time.perf_counter() - _stage_t0
        _record_by_preprocess_step("parent_numeric_validation", _numeric_validation_elapsed)
        metric_values = df_full[self.columns].to_numpy(dtype=float, copy=False)
        metric_finite_values = np.isfinite(metric_values)

        # Sort the whole frame by time exactly once so every BY group slice is
        # already monotonic; this lets every child skip its own
        # ``sort_values``/``reset_index`` pass. Pandas' sort_values short-circuits
        # for already-sorted columns so this is cheap when data is in order.
        _stage_t0 = time.perf_counter()
        try:
            is_already_sorted = bool(df_full[self.time_field].is_monotonic_increasing)
        except Exception:
            is_already_sorted = False
        if not is_already_sorted:
            df_full = df_full.sort_values(self.time_field, kind="mergesort")
            df_full.reset_index(drop=True, inplace=True)
            # Re-take metric arrays from the sorted view to keep
            # ``metric_finite_values`` aligned with positional row indices used
            # by ``group_positions``.
            metric_values = df_full[self.columns].to_numpy(dtype=float, copy=False)
            metric_finite_values = np.isfinite(metric_values)
        _record_by_preprocess_step("parent_time_sort", time.perf_counter() - _stage_t0)

        _stage_t0 = time.perf_counter()
        prep_input_cols = [self.time_field] + list(self.columns)
        if CDTSM_INTERNAL_ROW_TZ_COLUMN in df_full.columns:
            prep_input_cols.append(CDTSM_INTERNAL_ROW_TZ_COLUMN)
        prep_input_cols = list(dict.fromkeys(prep_input_cols))
        df_preprocess_source = df_full[prep_input_cols]
        _record_by_preprocess_step(
            "parent_preprocess_column_view", time.perf_counter() - _stage_t0
        )

        _stage_t0 = time.perf_counter()
        groupby_cols = fcols[0] if len(fcols) == 1 else fcols
        groups = df_full.groupby(groupby_cols, sort=False, observed=True)
        group_positions = groups.indices
        sorted_keys = sorted(group_positions.keys(), key=self._forecast_by_group_sort_key)

        # Accumulate per-group numpy column dicts. We avoid creating any
        # intermediate DataFrames or pd.concat calls per group — the final
        # combined frame is assembled once at the very end using
        # np.concatenate per column. This is the single largest win for the
        # post-API/output phase on multi-million row BY runs.
        group_array_outputs = []
        emitted_output_groups = 0

        def emit_output_part(group_key, out_part):
            nonlocal emitted_output_groups
            if isinstance(out_part, dict):
                row_count = int(out_part.get("n_rows", 0))
                payload = out_part
            else:
                # DataFrame fallback (e.g. error path / unexpected single-group flow).
                row_count = len(out_part)
                payload = {
                    "n_rows": row_count,
                    "columns": {c: out_part[c].to_numpy(copy=False) for c in out_part.columns},
                    "as_dataframe": True,
                }
            group_array_outputs.append((group_key, row_count, payload))
            emitted_output_groups += 1

        def _combine_group_array_outputs():
            """Build the final combined DataFrame from accumulated numpy dicts.

            Concatenates each column once via ``np.concatenate``, materializes
            per-row constant columns a single time, and adds BY prefix columns
            using a single ``pd.concat`` (axis=1, copy=False) at the end.
            """
            if not group_array_outputs:
                return None
            total_rows = 0
            row_counts_list = []
            for _gk, rc, _payload in group_array_outputs:
                total_rows += rc
                row_counts_list.append(rc)
            row_counts_arr = np.asarray(row_counts_list, dtype=np.int64)

            # Union of column names while preserving first-seen order.
            col_order = []
            col_seen = set()
            col_dtypes = {}
            df_passthrough = False
            for _gk, _rc, payload in group_array_outputs:
                if payload.get("as_dataframe"):
                    df_passthrough = True
                for c, arr in payload["columns"].items():
                    if c not in col_seen:
                        col_seen.add(c)
                        col_order.append(c)
                    if c not in col_dtypes and arr is not None:
                        col_dtypes[c] = arr.dtype

            # Build each column once.
            final_cols = {}
            for c in col_order:
                dtype = col_dtypes.get(c)
                pieces = []
                for _gk, rc, payload in group_array_outputs:
                    arr = payload["columns"].get(c)
                    if arr is None:
                        if dtype is None or dtype.kind in ("O", "U", "S"):
                            arr = np.full(rc, "", dtype=object)
                        elif dtype.kind in ("i", "u"):
                            arr = np.zeros(rc, dtype=dtype)
                        else:
                            arr = np.full(rc, np.nan, dtype=dtype)
                    pieces.append(arr)
                if len(pieces) == 1:
                    final_cols[c] = pieces[0]
                else:
                    final_cols[c] = np.concatenate(pieces)

            # Per-row constant columns built once for total_rows (huge savings
            # over materializing them per group when there are many groups).
            # Only add when not already supplied via DataFrame passthrough.
            if "_vars" not in col_seen:
                final_cols["_vars"] = np.full(total_rows, ",".join(self.columns), dtype=object)
            if "_time_field" not in col_seen:
                final_cols["_time_field"] = np.full(total_rows, self.time_field, dtype=object)
            if "_ciList" not in col_seen:
                final_cols["_ciList"] = np.full(
                    total_rows,
                    ",".join(str(ci) for ci in self._ad_ci_bands),
                    dtype=object,
                )

            # BY prefix columns and _groupby_field.
            key_rows = []
            for group_key, _rc, _payload in group_array_outputs:
                if isinstance(group_key, tuple):
                    if len(group_key) != len(fcols):
                        raise RuntimeError(
                            f"CDTSM: internal error — group key length {len(group_key)} "
                            f"!= BY column count {len(fcols)}"
                        )
                    key_tuple = group_key
                else:
                    if len(fcols) != 1:
                        raise RuntimeError(
                            "CDTSM: internal error — scalar group key with multi-column BY"
                        )
                    key_tuple = (group_key,)
                key_rows.append(
                    [self._forecast_by_restore_null_sentinel(value) for value in key_tuple]
                )
            key_matrix = np.asarray(key_rows, dtype=object)

            prefix_cols = {}
            for insert_at, col in enumerate(fcols):
                prefix_cols[col] = np.repeat(key_matrix[:, insert_at], row_counts_arr)
            prefix_cols["_groupby_field"] = np.full(total_rows, ",".join(fcols), dtype=object)

            # Reuse the union of column names to drive a single DataFrame
            # construction. Keys not in BY prefix and not constant are streamed
            # in original order, then constants appended.
            ordered_columns = {}
            for k in prefix_cols:
                ordered_columns[k] = prefix_cols[k]
            for c in col_order:
                if c in ordered_columns:
                    continue
                ordered_columns[c] = final_cols[c]
            for c in ("_vars", "_time_field", "_ciList"):
                if c in ordered_columns:
                    continue
                if c in final_cols:
                    ordered_columns[c] = final_cols[c]

            combined = pd.DataFrame(ordered_columns)
            if df_passthrough:
                # Preserve a clean RangeIndex when any DF-style payload was
                # passed through.
                combined.reset_index(drop=True, inplace=True)
            return combined

        group_tasks = [
            (group_index, key, group_positions[key])
            for group_index, key in enumerate(sorted_keys)
        ]
        _group_materialization_elapsed = time.perf_counter() - _stage_t0
        _record_by_preprocess_step(
            "parent_group_materialization", _group_materialization_elapsed
        )
        logger.info(
            "CDTSM anomaly_detection: forecast_by setup timings groups=%d — "
            "ensure_config=%.4fs, time_conversion=%.4fs, by_null_fill=%.4fs, "
            "by_compact=%.4fs, duplicate_aggregation=%.4fs, "
            "numeric_validation=%.4fs, group_materialization=%.4fs",
            len(group_tasks),
            _ensure_elapsed,
            _time_conversion_elapsed,
            _by_null_fill_elapsed,
            _by_compact_elapsed,
            _duplicate_elapsed,
            _numeric_validation_elapsed,
            _group_materialization_elapsed,
        )
        self._record_cdtsm_apply_timing(
            "materialization",
            _ensure_elapsed
            + _time_conversion_elapsed
            + _by_null_fill_elapsed
            + _by_compact_elapsed
            + _duplicate_elapsed
            + _numeric_validation_elapsed
            + _group_materialization_elapsed,
        )
        n_groups = len(group_tasks)
        repair_enabled_cache = self._is_repair_timeseries_enabled()
        self._cdtsm_suppress_high_frequency_logs = parent_suppress_hf

        def _group_metric_presence(row_positions):
            group_finite = metric_finite_values[row_positions]
            has_value_by_col = group_finite.any(axis=0)
            if not has_value_by_col.any():
                return False, True
            empty_columns = [
                col
                for col, has_value in zip(self.columns, has_value_by_col)
                if not bool(has_value)
            ]
            if empty_columns:
                if len(empty_columns) == 1:
                    raise RuntimeError(
                        f"CDTSM: Column '{empty_columns[0]}' contains only null values. "
                        f"Cannot perform forecasting on empty series."
                    )
                raise RuntimeError(
                    f"CDTSM: Columns {', '.join(empty_columns)} contain only null values. "
                    f"Cannot perform forecasting on empty series."
                )
            return True, not bool(group_finite.all())

        if n_groups == 0:
            raise RuntimeError("CDTSM: no BY groups for anomaly_detection.")

        # ----------------------------------------------------------------
        # Serial BY pipeline.
        #
        # Earlier revisions ran BY preprocessing and postprocessing on
        # ``ThreadPoolExecutor`` worker pools (10 and up to 32 workers). The
        # per-group state was isolated with throwaway child ``PredictAI``
        # instances and the recorders were guarded by ``threading.Lock``.
        # The pools have been removed: every BY group is preprocessed,
        # then API-batched (the compacted API scheduler is still
        # ``asyncio``-based and runs requests concurrently), then
        # postprocessed in a single in-order loop on ``self``. Parent state
        # is snapshotted once before the loop and restored once after, so we
        # pay zero per-group child-instance construction cost and emit
        # output parts directly in BY-key order without a reorder buffer.
        # ----------------------------------------------------------------
        ctx_snap = self._ad_context_length
        clamp_snap = getattr(self, "_ad_short_series_context_clamped", False)
        suppress_repair_snap = getattr(self, "_cdtsm_suppress_repair_warning", False)
        suppress_hf_snap = getattr(self, "_cdtsm_suppress_high_frequency_logs", False)
        fast_resolution_snap = getattr(self, "_cdtsm_fast_regular_time_resolution", False)
        suppress_anom_tel_snap = getattr(self, "_cdtsm_suppress_anomaly_telemetry", False)
        suppress_group_logs_snap = getattr(self, "_cdtsm_suppress_group_post_api_logs", False)
        emit_numpy_arrays_snap = getattr(self, "_cdtsm_emit_numpy_arrays", False)
        use_wildcard_snap = getattr(self, "_use_wildcard", False)
        repair_cache_snap = getattr(self, "_cdtsm_repair_timeseries_enabled_cache", None)
        has_repair_cache_snap = hasattr(self, "_cdtsm_repair_timeseries_enabled_cache")

        # Configure ``self`` once for the whole BY loop. The single-group
        # parent flow used to fan these flags through ``_make_by_child``; we
        # now mutate ``self`` because no other thread will read it during the
        # BY phase.
        self._cdtsm_suppress_repair_warning = True
        self._cdtsm_suppress_high_frequency_logs = True
        self._cdtsm_fast_regular_time_resolution = True
        self._cdtsm_suppress_anomaly_telemetry = True
        # Per-group numpy column dicts (no DataFrame ctor, no constant columns)
        # — collation builds one DataFrame at the very end.
        self._cdtsm_emit_numpy_arrays = True
        # Parent already ran ``_ensure_config(df_full)`` so wildcard resolution
        # is complete; keep it disabled so per-group preps don't re-scan.
        self._use_wildcard = False
        self._cdtsm_repair_timeseries_enabled_cache = repair_enabled_cache

        # The parent already imported its own time-output state via
        # ``_cdtsm_apply_time_conversion_once_for_by_groups``; no per-group
        # ``_cdtsm_import_time_output_state`` is required when serial.

        try:
            # ---- Phase 1: serial preprocessing ----
            _preprocess_phase_t0 = time.perf_counter()
            preps_by_index = {}
            any_repaired = False
            for group_index, key, row_positions in group_tasks:
                _step_t0 = time.perf_counter()
                (
                    group_has_metric_values,
                    group_has_missing_metric_values,
                ) = _group_metric_presence(row_positions)
                _record_by_preprocess_step(
                    "metric_presence_check", time.perf_counter() - _step_t0
                )
                if not group_has_metric_values:
                    logger.warning(
                        "CDTSM anomaly_detection: skipping forecast_by combination %d/%d "
                        "key=%r because all selected time series values are null.",
                        group_index + 1,
                        n_groups,
                        key,
                    )
                    continue

                _step_t0 = time.perf_counter()
                df_g = df_preprocess_source.take(row_positions)
                _record_by_preprocess_step("group_slice", time.perf_counter() - _step_t0)

                try:
                    prep = self._anomaly_phase_build_precomputed(
                        df_g,
                        options,
                        skip_ensure_config=True,
                        skip_time_conversion=True,
                        skip_duplicate_aggregation=True,
                        skip_numeric_validation=True,
                        skip_basic_config_validation=True,
                        skip_fill_null_dropna=not group_has_missing_metric_values,
                        skip_time_sort=True,
                    )
                except _SkipAnomalyByGroup as e:
                    logger.warning(
                        "CDTSM anomaly_detection: skipping forecast_by combination %d/%d "
                        "key=%r because no context is available: %s",
                        group_index + 1,
                        n_groups,
                        key,
                        str(e),
                    )
                    continue
                finally:
                    del df_g

                if getattr(prep, "was_repaired", False):
                    any_repaired = True
                # Match the per-child isolation the old thread-pool flow
                # provided: clear the sticky pending bit so the next group's
                # ``prep.was_repaired`` reflects only that group's data.
                # ``_time_series_was_repaired`` is already reset by
                # ``_anomaly_phase_build_precomputed`` for skip-config callers.
                self._cdtsm_repair_warning_pending = False
                preps_by_index[group_index] = (key, prep)

            if not preps_by_index:
                raise RuntimeError(
                    "CDTSM anomaly_detection: no BY groups had enough context points "
                    "or non-null time series values after per-group cleaning."
                )
            if len(preps_by_index) != n_groups:
                logger.warning(
                    "CDTSM anomaly_detection: skipping %d/%d BY group(s) with no usable "
                    "context or non-null time series values; continuing with %d group(s).",
                    n_groups - len(preps_by_index),
                    n_groups,
                    len(preps_by_index),
                )
            if any_repaired:
                # Drop the per-group suppression briefly so the user-visible
                # repair caution actually emits once, then re-suppress for the
                # postprocess phase which never repairs but may still trigger
                # the unrelated high-frequency log path.
                self._cdtsm_suppress_repair_warning = suppress_repair_snap
                self._warn_time_series_repaired_once()
                self._cdtsm_suppress_repair_warning = True

            _preprocess_elapsed = time.perf_counter() - _preprocess_phase_t0
            logger.info(
                "CDTSM anomaly_detection: forecast_by preprocessing phase timings "
                "groups_total=%d groups_prepared=%d elapsed=%.4fs",
                n_groups,
                len(preps_by_index),
                _preprocess_elapsed,
            )
            _log_by_preprocess_step_summary(len(preps_by_index), _preprocess_elapsed)
            self._record_cdtsm_apply_timing("preprocessing", _preprocess_elapsed)

            # Free the parent-level scratch we no longer need before the API
            # phase to keep peak memory bounded for high-cardinality BY runs.
            del (
                groups,
                group_positions,
                group_tasks,
                df_full,
                df_preprocess_source,
                metric_values,
                metric_finite_values,
            )

            # ---- Phase 2: compacted API call (asyncio under the hood) ----
            logger.info(
                "CDTSM anomaly_detection: forecast_by API phase — preprocessing complete; "
                "%d group(s); compacted API requests run with the shared async scheduler.",
                len(preps_by_index),
            )
            valid_group_indices = sorted(preps_by_index)
            prep_items = [
                (gi, preps_by_index[gi][0], preps_by_index[gi][1]) for gi in valid_group_indices
            ]
            prep_item_count = len(prep_items)
            # Capture aggregate ``num_datapoints`` / ``detection_points``
            # across all BY groups before Phase 3 starts popping ``preps_by_index``.
            # These feed the single global ``log_cdtsm_anomaly_params`` emission
            # at the end of the BY flow — per-group telemetry stays suppressed
            # via ``_cdtsm_suppress_anomaly_telemetry`` because every BY group
            # shares the same anomaly configuration.
            anomaly_params_total_datapoints = sum(
                int(preps_by_index[gi][1].N) for gi in valid_group_indices
            )
            anomaly_params_total_detection_points = sum(
                int(preps_by_index[gi][1].K) for gi in valid_group_indices
            )
            _compacted_api_t0 = time.perf_counter()
            predictions_by_index = self._call_anomaly_api_for_group_preps(prep_items)
            _compacted_api_elapsed = time.perf_counter() - _compacted_api_t0
            self._record_cdtsm_apply_timing("api", _compacted_api_elapsed)
            # Drop the heavy ``full_entries`` / ``partial_entries`` payload
            # descriptors now that the API has consumed them. Keeps peak
            # memory low across the postprocess phase.
            preps_by_index = {
                gi: (key, prep._replace(full_entries=(), partial_entries=()))
                for gi, (key, prep) in preps_by_index.items()
            }
            del prep_items
            logger.info(
                "CDTSM anomaly_detection: forecast_by compacted API phase timing "
                "groups=%d elapsed=%.4fs",
                prep_item_count,
                _compacted_api_elapsed,
            )

            # ---- Phase 3: serial postprocess + emit, in BY-key order ----
            _postprocess_phase_t0 = time.perf_counter()
            log_group_post_api = n_groups <= 50
            self._cdtsm_suppress_group_post_api_logs = not log_group_post_api

            for gi in valid_group_indices:
                key, prep = preps_by_index[gi]
                predictions = predictions_by_index[gi]
                if log_group_post_api:
                    logger.info(
                        "CDTSM anomaly_detection: forecast_by API/postprocess "
                        "combination %d/%d key=%r (H=%d, K=%d)",
                        gi + 1,
                        n_groups,
                        key,
                        prep.H,
                        prep.K,
                    )
                out_g = self._anomaly_phase_api_and_postprocess(
                    prep, options=options, all_predictions=predictions
                )
                if log_group_post_api:
                    out_rows = (
                        int(out_g.get("n_rows", 0)) if isinstance(out_g, dict) else len(out_g)
                    )
                    logger.info(
                        "CDTSM anomaly_detection: forecast_by API/postprocess complete "
                        "for combination %d/%d key=%r, output_rows=%d",
                        gi + 1,
                        n_groups,
                        key,
                        out_rows,
                    )
                emit_output_part(key, out_g)
                # Aggressively release per-group state so high-cardinality
                # BY runs don't accumulate predictions and prep objects.
                del out_g, predictions
                preps_by_index.pop(gi, None)
                predictions_by_index.pop(gi, None)

            if emitted_output_groups != len(valid_group_indices):
                raise RuntimeError(
                    "CDTSM anomaly_detection: forecast_by API phase incomplete "
                    f"({emitted_output_groups}/{len(valid_group_indices)} groups)."
                )
            del preps_by_index, predictions_by_index, valid_group_indices
            _postprocess_elapsed = time.perf_counter() - _postprocess_phase_t0
            logger.info(
                "CDTSM anomaly_detection: forecast_by postprocess/output phase timing "
                "groups=%d elapsed=%.4fs",
                emitted_output_groups,
                _postprocess_elapsed,
            )
            self._record_cdtsm_apply_timing("postprocessing", _postprocess_elapsed)
        finally:
            # Restore parent state. Even on the happy path this is required
            # because ``self`` is reused across SPL invocations (the parent
            # algorithm instance can outlive a single ``apply``).
            self._ad_context_length = ctx_snap
            self._ad_short_series_context_clamped = clamp_snap
            self._cdtsm_suppress_repair_warning = suppress_repair_snap
            self._cdtsm_suppress_high_frequency_logs = suppress_hf_snap
            self._cdtsm_fast_regular_time_resolution = fast_resolution_snap
            self._cdtsm_suppress_anomaly_telemetry = suppress_anom_tel_snap
            self._cdtsm_suppress_group_post_api_logs = suppress_group_logs_snap
            self._cdtsm_emit_numpy_arrays = emit_numpy_arrays_snap
            self._use_wildcard = use_wildcard_snap
            if has_repair_cache_snap:
                self._cdtsm_repair_timeseries_enabled_cache = repair_cache_snap
            else:
                try:
                    delattr(self, "_cdtsm_repair_timeseries_enabled_cache")
                except AttributeError:
                    pass

        _final_collation_t0 = time.perf_counter()
        if not group_array_outputs:
            raise RuntimeError(
                f"CDTSM anomaly_detection: no output rows for BY={self.forecast_by!r}"
            )
        _final_concat_t0 = time.perf_counter()
        combined = _combine_group_array_outputs()
        _final_concat_elapsed = time.perf_counter() - _final_concat_t0
        # Group prefix columns + constant columns are now assembled inside the
        # single-pass combiner above. Keep the separate timing fields for
        # backwards compatibility with log parsers.
        _final_flush_elapsed = 0.0
        _group_column_elapsed = 0.0
        del group_array_outputs
        _final_collation_elapsed = time.perf_counter() - _final_collation_t0
        # Final BY group concat / column-prefix assembly is "data preparation
        # for output" — the postprocessing module already returned per-group
        # results above. Bucket it under output_preparation for the 5-phase
        # apply summary in apply.py.
        self._record_cdtsm_apply_timing("output_preparation", _final_collation_elapsed)
        logger.info(
            "CDTSM anomaly_detection: forecast_by final group collation timing "
            "groups=%d output_rows=%d flush=%.4fs concat=%.4fs "
            "group_columns=%.4fs total=%.4fs",
            n_groups,
            len(combined),
            _final_flush_elapsed,
            _final_concat_elapsed,
            _group_column_elapsed,
            _final_collation_elapsed,
        )
        logger.info(
            "CDTSM anomaly_detection: forecast_by total phase timing groups=%d output_rows=%d total=%.4fs",
            n_groups,
            len(combined),
            time.perf_counter() - by_total_t0,
        )

        # Cumulative time spent inside the postprocessing module across all
        # BY groups + metric columns (sum of wall time per call). With serial
        # execution this is also the real elapsed module-time contribution.
        pp_module_total = by_pp_module_total[0]
        pp_module_count = by_pp_module_count[0]
        pp_module_avg_ms = (
            (pp_module_total / pp_module_count) * 1000.0 if pp_module_count > 0 else 0.0
        )
        logger.info(
            "CDTSM anomaly_detection: forecast_by cumulative postprocessing module "
            "timing groups=%d calls=%d total_module_time=%.4fs avg_per_call=%.3fms",
            n_groups,
            pp_module_count,
            pp_module_total,
            pp_module_avg_ms,
        )

        if previous_by_preprocess_recorder is None:
            try:
                delattr(self, "_cdtsm_anomaly_by_preprocess_step_recorder")
            except AttributeError:
                pass
        else:
            self._cdtsm_anomaly_by_preprocess_step_recorder = previous_by_preprocess_recorder
        if previous_by_pp_module_recorder is None:
            try:
                delattr(self, "_cdtsm_anomaly_by_pp_module_recorder")
            except AttributeError:
                pass
        else:
            self._cdtsm_anomaly_by_pp_module_recorder = previous_by_pp_module_recorder

        # Single global anomaly-params telemetry for the BY flow. Per-group
        # invocations are suppressed inside ``_anomaly_phase_api_and_postprocess``
        # via ``_cdtsm_suppress_anomaly_telemetry`` because anomaly
        # configuration is globally identical across every BY combination.
        # ``num_datapoints`` / ``detection_points`` are summed across all
        # valid BY groups (captured before Phase 3 popped ``preps_by_index``).
        seg = getattr(self, "_ad_segment_params", {}) or {}
        try:
            log_cdtsm_anomaly_params(
                mode=self.mode,
                model_name=self.model_name,
                num_columns=len(self.columns),
                time_field=self.time_field,
                show_input=self.show_input,
                forecast_k=self.horizon,
                holdback=self.holdback,
                quantiles=",".join(self.user_percentiles),
                conf_interval=self.conf_interval or 0,
                method=getattr(self, "_ad_spl_method", self._ad_method),
                context_length=self._ad_context_length,
                detection_length=self._ad_detection_length,
                detection_window_earliest=self._ad_window_earliest,
                detection_window_latest=self._ad_window_latest,
                context_window_earliest=getattr(self, "_ad_context_window_earliest", None),
                context_window_latest=getattr(self, "_ad_context_window_latest", None),
                stride=self._ad_stride,
                threshold=self._ad_threshold,
                quantile_lower=self._ad_quantile_lower,
                quantile_upper=self._ad_quantile_upper,
                multiplier=self._ad_multiplier,
                threshold_direction=self._ad_threshold_direction,
                segment_method=self._ad_segment_method,
                on_span=seg.get("on_span"),
                on_ratio=seg.get("on_ratio"),
                off_span=seg.get("off_span"),
                off_ratio=seg.get("off_ratio"),
                win_size=seg.get("win_size"),
                agg_func=seg.get("agg_fun"),
                conf_interval_viz=",".join(str(ci) for ci in self._ad_ci_bands),
                num_datapoints=anomaly_params_total_datapoints,
                detection_points=anomaly_params_total_detection_points,
                is_groupby=1,
                was_repaired=getattr(self, "_time_series_was_repaired", False),
            )
        except Exception:
            pass

        return combined
