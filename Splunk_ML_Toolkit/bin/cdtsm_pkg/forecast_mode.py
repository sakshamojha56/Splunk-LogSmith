"""Forecast mode — payload construction, response validation, and output dataframe assembly."""

import math
import time
from collections import defaultdict, namedtuple

import numpy as np
import pandas as pd

import cexc
from cdtsm_pkg.constants import (
    CDTSM_INTERNAL_ORIGINAL_TIME_COLUMN,
    CDTSM_INTERNAL_ROW_TZ_COLUMN,
    AVAILABLE_QUANTILES,
    FILL_NULL_INTERPOLATE,
    FIXED_BLOCK_SIZE,
    FORECAST_BY_DUP_TIME_AGG,
    FORECAST_BY_NULL_SENTINEL,
    MAX_QUANTILE_HORIZON,
    MAX_TRAINING_POINTS,
    MIN_INPUT_DATAPOINTS,
    NATIVE_FORECAST_HORIZON,
)
from util.telemetry_cdtsm_util import (
    log_cdtsm_time_field_null,
    log_cdtsm_time_resolution,
)

logger = cexc.get_logger(__name__)
messages = cexc.get_messages_logger()

# Per-group forecast pipeline state for ``forecast_by`` (compacted API requests).
# ``group_index`` is the stable order of BY keys (case-insensitive sort); HTTP chunks
# batch consecutive indices (see ``_apply_forecast_by_groups`` logging).
FbGroupForecastPrep = namedtuple(
    "FbGroupForecastPrep",
    [
        "group_key",
        "df_clean",
        "df_for_payload",
        "forecast_horizon",
        "holdback_df",
        "group_index",
        "was_repaired",
    ],
)


def _future_epoch_seconds_cycling_gaps(orig_times: np.ndarray, n_future: int) -> np.ndarray:
    """Return ``n_future`` epoch timestamps after the last row, cycling observed gaps.

    Used when calendar-DST variance was normalized to uniform steps: restores wall-clock
    cadence (23h/24h/25h mixes) for forecast rows by repeating the inter-arrival pattern.
    """
    if n_future < 1:
        return np.array([], dtype=np.int64)
    o = np.asarray(orig_times, dtype=np.int64).reshape(-1)
    if o.size < 2:
        raise RuntimeError(
            "CDTSM: need at least two time points to extend forecast timestamps "
            "using the original calendar interval pattern."
        )
    gaps = np.diff(o)
    out = np.empty(n_future, dtype=np.int64)
    t = int(o[-1])
    for i in range(n_future):
        t += int(gaps[i % len(gaps)])
        out[i] = t
    return out


class ForecastModeMixin:
    """Mixin supplying forecast-mode pipeline methods to PredictAI."""

    def _record_forecast_by_preprocess_step_timing(self, step, elapsed):
        """Record a per-group forecast BY preprocessing step into the parent collector.

        Mirrors ``_record_anomaly_by_preprocess_step_timing`` so the BY forecast path
        can emit the same cumulative per-step breakdown logs as BY anomaly.
        """
        recorder = getattr(self, "_cdtsm_forecast_by_preprocess_step_recorder", None)
        if recorder is None:
            return
        try:
            recorder(step, elapsed)
        except Exception:
            logger.debug(
                "CDTSM: failed to record BY forecast preprocessing step timing for %s",
                step,
                exc_info=True,
            )

    @staticmethod
    def _forecast_by_group_sort_key(group_key):
        """Case-insensitive sort order for ``groupby`` keys (scalar or tuple)."""
        if isinstance(group_key, tuple):
            return tuple(str(x).casefold() for x in group_key)
        return (str(group_key).casefold(),)

    @staticmethod
    def _forecast_by_restore_null_sentinel(value):
        """Map the internal null BY placeholder back to a pandas null value."""
        if value == FORECAST_BY_NULL_SENTINEL:
            return np.nan
        return value

    def _fill_null_forecast_by_values_for_grouping(self, df):
        """Replace null BY values with a private sentinel so null groups are preserved."""
        fcols = getattr(self, "forecast_by_columns", None) or []
        if not fcols:
            return df

        null_counts = df[fcols].isna().sum()
        total_nulls = int(null_counts.sum())
        if total_nulls == 0:
            return df

        out = df.copy(deep=False)
        for col in fcols:
            if int(null_counts[col]) > 0:
                out[col] = out[col].where(out[col].notna(), FORECAST_BY_NULL_SENTINEL)
        logger.info(
            "CDTSM: forecast_by — replaced %d null BY value(s) with internal sentinel "
            "for grouping; output values will be restored to null.",
            total_nulls,
        )
        return out

    def _compact_forecast_by_columns_for_grouping(self, df):
        """Store object/string BY columns as categories while processing CSV input."""
        fcols = getattr(self, "forecast_by_columns", None) or []
        category_cols = [
            col
            for col in fcols
            if col in df.columns
            and not isinstance(df[col].dtype, pd.CategoricalDtype)
            and (pd.api.types.is_object_dtype(df[col]) or pd.api.types.is_string_dtype(df[col]))
        ]
        if not category_cols:
            return df

        out = df.copy(deep=False)
        for col in category_cols:
            out[col] = out[col].astype("category")
        logger.info(
            "CDTSM: forecast_by - compacted BY column(s) for grouping with category dtype: %s",
            category_cols,
        )
        return out

    def _append_forecast_by_columns_to_output(self, out_df, group_key):
        """Assign BY column value(s) from ``group_key`` to an already-owned output frame."""
        fcols = getattr(self, "forecast_by_columns", None) or []
        if not fcols:
            raise RuntimeError(
                "CDTSM: internal error — _append_forecast_by_columns_to_output without "
                "forecast_by_columns"
            )
        if isinstance(group_key, tuple):
            if len(group_key) != len(fcols):
                raise RuntimeError(
                    f"CDTSM: internal error — group key length {len(group_key)} "
                    f"!= BY column count {len(fcols)}"
                )
            values = [
                (c, self._forecast_by_restore_null_sentinel(v))
                for c, v in zip(fcols, group_key)
            ]
        else:
            if len(fcols) != 1:
                raise RuntimeError(
                    "CDTSM: internal error — scalar group key with multi-column BY"
                )
            values = [(fcols[0], self._forecast_by_restore_null_sentinel(group_key))]

        for insert_at, (col, value) in enumerate(values):
            if col in out_df.columns:
                out_df.pop(col)
            out_df.insert(insert_at, col, value)

        groupby_col = "_groupby_field"
        if groupby_col in out_df.columns:
            out_df.pop(groupby_col)
        out_df.insert(len(fcols), groupby_col, ",".join(fcols))
        return out_df

    def _prepare_forecast_for_api(
        self,
        df,
        skip_ensure_config=False,
        skip_time_conversion=False,
        skip_duplicate_aggregation=False,
        skip_numeric_validation=False,
        skip_basic_config_validation=False,
        skip_time_sort=False,
        skip_fill_null_dropna=False,
    ):
        """Validate and clean input, then produce training slice for one forecast API context.

        Used by :meth:`_build_payload` and by :meth:`_apply_forecast_by_groups` (per ``forecast_by`` group).

        When ``skip_time_conversion`` is True (BY-group workers after a parent one-shot
        :meth:`ValidationMixin._cdtsm_apply_time_conversion_once_for_by_groups`), the time column
        is already epoch seconds; null-check and :meth:`_convert_time_field_to_seconds` are skipped.

        Skip flags supplied by :meth:`_apply_forecast_by_groups` after parent-frame work:
        ``skip_basic_config_validation`` (parent already verified time_field/columns),
        ``skip_time_sort`` (parent already sorted), ``skip_numeric_validation`` (parent
        already validated numeric dtypes once on the full frame), ``skip_fill_null_dropna``
        (group has no missing metric values, so fill/dropna would be a no-op).

        Returns:
            tuple: ``(df_clean, df_for_payload, forecast_horizon, holdback_df_snapshot)`` where
            ``holdback_df_snapshot`` is a copy of holdback rows when ``holdback > 0``, else ``None``.
            :attr:`self._holdback_df` is left set for the current group (same data as the snapshot
            when holdback is enabled).

        Raises:
            RuntimeError: If validation fails or data quality is insufficient
        """
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
        self._record_forecast_by_preprocess_step_timing(
            "config_validation", time.perf_counter() - _step_t0
        )

        _step_t0 = time.perf_counter()
        if not skip_time_conversion:
            self._validate_time_field_no_nulls_or_blanks_before_convert(df)
            df = self._convert_time_field_to_seconds(df)
        self._record_forecast_by_preprocess_step_timing(
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
        self._record_forecast_by_preprocess_step_timing("sort_reset", _sort_elapsed)

        _repair_t0 = time.perf_counter()
        # Fast path: when a BY worker (parent already sorted/dedup'd) has perfectly
        # regular time intervals, bypass the full repair scan and just cache the
        # detected resolution. This mirrors the ``_cdtsm_fast_regular_time_resolution``
        # short-circuit used by BY anomaly.
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
        self._record_forecast_by_preprocess_step_timing(
            "time_resolution_repair", _repair_elapsed
        )

        _numeric_t0 = time.perf_counter()
        if not skip_numeric_validation:
            self._validate_numerical_columns(df_sorted)
        _numeric_elapsed = time.perf_counter() - _numeric_t0
        self._record_forecast_by_preprocess_step_timing("numeric_validation", _numeric_elapsed)

        _impute_t0 = time.perf_counter()
        fill_mode = getattr(self, "fill_null", FILL_NULL_INTERPOLATE)
        # For interpolate mode the build_*_context helpers handle gaps internally,
        # so no fill/dropna is needed. For ff/value modes we can also skip the
        # fill+dropna pass when the parent precomputed that this group has no
        # missing metric values AND no repair pass introduced new NaNs.
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
        self._record_forecast_by_preprocess_step_timing("fill_null_dropna", _impute_elapsed)

        suppress_high_frequency_logs = getattr(
            self, "_cdtsm_suppress_high_frequency_logs", False
        )

        if len(df_clean) != len(df_sorted) and not suppress_high_frequency_logs:
            logger.info(
                "CDTSM: Dropped %d rows with null values after fill_null handling",
                len(df_sorted) - len(df_clean),
            )

        if df_clean.empty:
            raise RuntimeError(
                "CDTSM: No valid data remaining after cleaning null values. "
                "Please check your data quality."
            )

        df_clean = self._validate_datapoint_count(df_clean)

        if not suppress_high_frequency_logs:
            logger.info(
                "CDTSM: forecast preprocessing timings rows_in=%d rows_clean=%d — "
                "sort=%.4fs, time_resolution=%.4fs, numeric_validation=%.4fs, impute/dropna=%.4fs",
                len(df),
                len(df_clean),
                _sort_elapsed,
                _repair_elapsed,
                _numeric_elapsed,
                _impute_elapsed,
            )
            logger.info(
                "CDTSM: Data cleaning complete. Final cleaned dataframe has %d rows and %d columns",
                len(df_clean),
                len(df_clean.columns),
            )

        if self.holdback > 0:
            total_points = len(df_clean)

            if self.holdback >= total_points:
                raise RuntimeError(
                    f"CDTSM: holdback ({self.holdback}) must be less than total datapoints ({total_points}). "
                    f"Maximum allowed holdback: {total_points - 1}"
                )

            training_points = total_points - self.holdback
            df_training = df_clean.iloc[:training_points]
            self._holdback_df = df_clean.iloc[training_points:]

            if not suppress_high_frequency_logs:
                logger.info(
                    "CDTSM: Holdback mode enabled. Split %d datapoints into %d training + %d holdback",
                    total_points,
                    len(df_training),
                    len(self._holdback_df),
                )
                logger.info(
                    "CDTSM: Training data range: %s to %s",
                    df_training[self.time_field].iloc[0],
                    df_training[self.time_field].iloc[-1],
                )
                logger.info(
                    "CDTSM: Holdback data range: %s to %s",
                    self._holdback_df[self.time_field].iloc[0],
                    self._holdback_df[self.time_field].iloc[-1],
                )

            df_for_payload = df_training
            forecast_horizon = self.horizon
            if not suppress_high_frequency_logs:
                logger.info(
                    "CDTSM: Forecasting %d total points (%d holdback + %d future)",
                    forecast_horizon,
                    self.holdback,
                    self.future_points,
                )
        else:
            self._holdback_df = None
            df_for_payload = df_clean
            forecast_horizon = self.horizon
            if not suppress_high_frequency_logs:
                logger.info(
                    "CDTSM: Regular forecast mode. Using all %d datapoints for API call (horizon:%d, all future)",
                    len(df_clean),
                    self.horizon,
                )

        original_training_count = len(df_for_payload)
        if original_training_count > MAX_TRAINING_POINTS:
            df_for_payload = df_for_payload.tail(MAX_TRAINING_POINTS)
            if not suppress_high_frequency_logs:
                logger.info(
                    "CDTSM: Training data capped from %d to %d most recent points (max allowed)",
                    original_training_count,
                    MAX_TRAINING_POINTS,
                )

        training_points_count = len(df_for_payload)
        # Payload contexts are built with the fixed server-side aggregation
        # factor (FIXED_BLOCK_SIZE) regardless of training-window length.
        # ``_build_coarse_context_from_preprocessed`` collapses to a single
        # coarse bucket when ``training_points_count < FIXED_BLOCK_SIZE`` so we
        # always emit non-empty coarse + fine contexts.
        if not suppress_high_frequency_logs:
            logger.info(
                "CDTSM: Training data ready — %d point(s), coarse block_size=%d "
                "(server-side fixed aggregation factor)",
                training_points_count,
                FIXED_BLOCK_SIZE,
            )

        holdback_snapshot = None
        if self.holdback > 0 and self._holdback_df is not None:
            holdback_snapshot = self._holdback_df

        return df_clean, df_for_payload, forecast_horizon, holdback_snapshot

    def _build_payload(self, df, skip_ensure_config=False):
        """Build payload for API call with comprehensive validation and data transformations.

        This method performs all necessary data transformations before building the payload:
        1. Validates configuration
        2. Validates time field has no null or blank values (before epoch conversion)
        3. Converts time field to seconds
        4. Sorts by time
        5. Validates and repairs time resolution (resamples if intervals are inconsistent)
        6. Validates numerical columns
        7. Applies fill_null handling for null metric values
        8. Drops any remaining rows with nulls unless fill_null=interpolate
        9. Validates minimum datapoint count
        10. Calls the forecast API (with column batching as needed)

        Args:
            df (pd.DataFrame): Input dataframe (raw, unprocessed)
            skip_ensure_config (bool): If True, skip :meth:`_ensure_config` (used after a
                full-frame config pass for per-group ``forecast_by`` runs). Per-group
                time-series validation still runs below.

        Returns:
            tuple: (df_clean, predictions_dict) where ``predictions_dict`` maps each metric
            column to percentile → list of forecast values.

        Raises:
            RuntimeError: If validation fails or data quality is insufficient
        """
        _preprocess_phase_t0 = time.perf_counter()
        df_clean, df_for_payload, forecast_horizon, _ = self._prepare_forecast_for_api(
            df, skip_ensure_config=skip_ensure_config
        )
        self._record_cdtsm_apply_timing(
            "preprocessing", time.perf_counter() - _preprocess_phase_t0
        )

        all_batch_predictions = self._forecast_with_batching(df_for_payload, forecast_horizon)

        return df_clean, all_batch_predictions

    def _aggregate_duplicate_timestamps_for_group_by(self, df_g):
        """Within one ``forecast_by`` group, merge rows that share the same ``time_field``.

        Metric columns (``self.columns``) are aggregated with :data:`~cdtsm_pkg.constants.FORECAST_BY_DUP_TIME_AGG`
        (code constant, not SPL). All other columns use the first observed value (including the
        grouping column and internal CDTSM columns). Used for per-group forecast and anomaly runs.

        Returns:
            pd.DataFrame: One row per distinct ``time_field`` value, sorted by time.
        """
        if df_g.empty or self.time_field not in df_g.columns:
            return df_g

        tcol = df_g[self.time_field]
        if not tcol.duplicated(keep=False).any():
            if df_g[self.time_field].is_monotonic_increasing:
                return df_g
            out = df_g.sort_values(self.time_field)
            out.reset_index(drop=True, inplace=True)
            return out

        n_before = len(df_g)
        agg_name = FORECAST_BY_DUP_TIME_AGG

        def _metric_mode(series):
            ss = pd.Series(series).dropna()
            if ss.empty:
                return np.nan
            mo = ss.mode()
            if len(mo):
                return mo.iloc[0]
            return ss.iloc[0]

        agg_map = {}
        for col in self.columns:
            if col not in df_g.columns or col == self.time_field:
                continue
            if agg_name == "mode":
                agg_map[col] = _metric_mode
            else:
                agg_map[col] = agg_name

        for col in df_g.columns:
            if col == self.time_field or col in agg_map:
                continue
            agg_map[col] = "first"

        out = df_g.groupby(self.time_field, as_index=False, sort=False).agg(agg_map)
        out.sort_values(self.time_field, inplace=True)
        out.reset_index(drop=True, inplace=True)

        if not getattr(self, "_cdtsm_suppress_high_frequency_logs", False):
            logger.info(
                "CDTSM: per-group — merged duplicate %s within one group: %d rows -> %d (%s on metrics)",
                self.time_field,
                n_before,
                len(out),
                agg_name,
            )
        return out

    def _build_forecast_by_compacted_payload_slots(self, flat_series_specs, forecast_horizon):
        """Build one API ``payload`` array entry per (group training frame, metric column).

        ``flat_series_specs`` is a list of ``(df_for_payload, col_name)`` in API order.

        Returns:
            dict: Request body with ``payload``, ``model``, and ``metadata`` (same shape as
            :meth:`ApiClientMixin._build_single_payload`).
        """
        # Coarse/fine context generation mirrors the server-side
        # ``build_multi_resolution`` flow exactly: each preprocessed series
        # passes through ``_normalize_inputs`` and then the multi_res if-block,
        # which for single-resolution 1D arrays calls ``build_multi_resolution``
        # with the fixed aggregation factor.
        payload_data = []
        for df_p, col in flat_series_specs:
            series = df_p[col].to_numpy(dtype=float, copy=False)
            coarse_ctx, fine_ctx = self._build_payload_contexts(series)
            payload_data.append({"coarse_ctx": coarse_ctx, "fine_ctx": fine_ctx})

        quantiles_list = list(self.percentiles)
        return {
            "payload": payload_data,
            "model": self.api_model_name,
            "metadata": {"quantiles": quantiles_list, "horizon": forecast_horizon},
        }

    def _apply_forecast_by_groups(self, df):
        """Forecast independently per ``self.forecast_by`` group, ordered alphabetically by key.

        Runs :meth:`_ensure_config` once on the full input (wildcard resolution), then
        :meth:`ValidationMixin._cdtsm_apply_time_conversion_once_for_by_groups` so time-to-epoch
        conversion runs once on the full frame (not per group). Then:

        1. **Preprocessing phase** — For every BY combination: duplicate timestamps are merged,
           then validation, time resolution repair, and training-window materialization run.
           All groups are prepped **sequentially on this instance** — no thread pool, no
           per-group child clones — using parent-resolved config so each group skips the
           full-frame validation/wildcard scan.

        2. **API phase** — HTTP only. Requests are **compacted**: up to ``self.ts_batch_size``
           time series (one per group × metric) per call when ``len(fields_to_forecast)`` does
           not exceed that cap; otherwise falls back to per-group column batching.

        Duplicate ``time_field`` values within a group are merged using
        :data:`~cdtsm_pkg.constants.FORECAST_BY_DUP_TIME_AGG` on metric columns before the per-group pipeline runs.

        Output concatenates groups with ``forecast_by`` / ``forecast_by_columns`` leading columns.
        """
        fcols = getattr(self, "forecast_by_columns", None) or []
        if not fcols:
            raise RuntimeError(
                "CDTSM: internal error — _apply_forecast_by_groups called without forecast_by"
            )

        for c in fcols:
            if c not in df.columns:
                raise RuntimeError(
                    f"CDTSM: BY grouping column '{c}' not found in input data. "
                    f"Available columns: {', '.join(df.columns)}"
                )

        by_total_t0 = time.perf_counter()

        # Per-group preprocessing step recorder. With BY work now running
        # serially on ``self`` (no ThreadPoolExecutor), the aggregator is a
        # plain dict/counter and no lock is needed.
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
                "parent_time_sort",
                "parent_preprocess_column_view",
                "parent_group_materialization",
                "metric_presence_check",
                "group_slice",
                "config_validation",
                "time_conversion",
                "sort_reset",
                "time_resolution_repair",
                "numeric_validation",
                "fill_null_dropna",
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
                "CDTSM: forecast_by cumulative preprocessing step timings "
                "groups_total=%d groups_prepared=%d elapsed=%.4fs steps_recorded=%d",
                n_tasks,
                groups_prepared,
                elapsed,
                steps_recorded,
            )
            logger.info(
                "CDTSM: forecast_by cumulative preprocessing step breakdown: %s",
                ", ".join(parts) if parts else "no step timings recorded",
            )

        previous_by_preprocess_recorder = getattr(
            self, "_cdtsm_forecast_by_preprocess_step_recorder", None
        )
        self._cdtsm_forecast_by_preprocess_step_recorder = _record_by_preprocess_step

        parent_suppress_hf = getattr(self, "_cdtsm_suppress_high_frequency_logs", False)
        self._cdtsm_suppress_high_frequency_logs = True
        _stage_t0 = time.perf_counter()
        self._ensure_config(df)
        _ensure_elapsed = time.perf_counter() - _stage_t0
        _record_by_preprocess_step("parent_ensure_config", _ensure_elapsed)

        _stage_t0 = time.perf_counter()
        df_full, time_out_state = self._cdtsm_apply_time_conversion_once_for_by_groups(df)
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

        # Numeric-column validation runs once on the full frame instead of once
        # per BY group; children pass ``skip_numeric_validation=True``.
        _stage_t0 = time.perf_counter()
        self._validate_numerical_columns(df_full)
        _numeric_validation_elapsed = time.perf_counter() - _stage_t0
        _record_by_preprocess_step("parent_numeric_validation", _numeric_validation_elapsed)
        # ``metric_finite_values`` lets BY workers (a) skip groups whose metric
        # cells are all null without building a DataFrame, and (b) tell children
        # to skip the fill/dropna pass when no missing values are present.
        metric_values = df_full[self.columns].to_numpy(dtype=float, copy=False)
        metric_finite_values = np.isfinite(metric_values)

        _stage_t0 = time.perf_counter()
        repair_enabled_cache = self._is_repair_timeseries_enabled()
        _repair_config_elapsed = time.perf_counter() - _stage_t0

        # Sort the whole frame by time exactly once so every BY group slice is
        # already monotonic; children skip their own sort/reset_index pass via
        # ``skip_time_sort=True``. Pandas' sort_values short-circuits when the
        # column is already sorted so this is cheap on already-ordered data.
        _stage_t0 = time.perf_counter()
        try:
            is_already_sorted = bool(df_full[self.time_field].is_monotonic_increasing)
        except Exception:
            is_already_sorted = False
        if not is_already_sorted:
            df_full = df_full.sort_values(self.time_field, kind="mergesort")
            df_full.reset_index(drop=True, inplace=True)
            # Re-take metric arrays from the sorted view to keep ``metric_finite_values``
            # aligned with positional row indices used by ``group_positions``.
            metric_values = df_full[self.columns].to_numpy(dtype=float, copy=False)
            metric_finite_values = np.isfinite(metric_values)
        _record_by_preprocess_step("parent_time_sort", time.perf_counter() - _stage_t0)

        # Narrowed view of just the columns each child actually needs for
        # preprocessing (time + metric columns + per-row tz). This avoids carrying
        # the BY columns and any unrelated source columns through every per-group
        # ``take`` and copy.
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
        group_tasks = [
            (group_index, key, group_positions[key])
            for group_index, key in enumerate(sorted_keys)
        ]
        _group_materialization_elapsed = time.perf_counter() - _stage_t0
        _record_by_preprocess_step(
            "parent_group_materialization", _group_materialization_elapsed
        )
        self._record_cdtsm_apply_timing(
            "materialization",
            _ensure_elapsed
            + _time_conversion_elapsed
            + _by_null_fill_elapsed
            + _by_compact_elapsed
            + _duplicate_elapsed
            + _numeric_validation_elapsed
            + _repair_config_elapsed
            + _group_materialization_elapsed,
        )

        n_tasks = len(group_tasks)
        if n_tasks == 0:
            self._cdtsm_suppress_high_frequency_logs = parent_suppress_hf
            if previous_by_preprocess_recorder is None:
                try:
                    delattr(self, "_cdtsm_forecast_by_preprocess_step_recorder")
                except AttributeError:
                    pass
            else:
                self._cdtsm_forecast_by_preprocess_step_recorder = (
                    previous_by_preprocess_recorder
                )
            raise RuntimeError("CDTSM: no BY groups to forecast — check input after grouping.")
        self._cdtsm_suppress_high_frequency_logs = parent_suppress_hf

        def _group_metric_presence(row_positions):
            """Vectorised replacement for ``_cdtsm_group_has_no_series_values``.

            Reads from the parent-precomputed ``metric_finite_values`` matrix so
            we never build a per-group DataFrame just to detect null-only groups.

            Returns:
                ``(group_has_metric_values, group_has_missing_metric_values)``.
                ``group_has_missing_metric_values=False`` lets the per-group
                pass ``skip_fill_null_dropna=True`` to
                ``_prepare_forecast_for_api`` for groups that don't need an
                imputation pass.
            """
            group_finite = metric_finite_values[row_positions]
            if not group_finite.any():
                return False, True
            return True, not bool(group_finite.all())

        # ----------------------------------------------------------------
        # Serial BY preprocessing.
        #
        # Earlier revisions ran preprocessing on a ``ThreadPoolExecutor`` with
        # up to 10 worker threads, using per-group throwaway child instances
        # cloned from ``self.__dict__``. Recorders were guarded by a
        # ``threading.Lock``. We now run BY groups sequentially on ``self``
        # with one outer snapshot/restore of the per-group flags, so per-call
        # overhead disappears (no ``__dict__.copy()``, no child reset, no
        # lock contention) and the recorder is a plain dict mutation.
        # ----------------------------------------------------------------
        prev_suppress_repair = getattr(self, "_cdtsm_suppress_repair_warning", False)
        prev_suppress_hf = getattr(self, "_cdtsm_suppress_high_frequency_logs", False)
        prev_fast_resolution = getattr(self, "_cdtsm_fast_regular_time_resolution", False)
        prev_use_wildcard = getattr(self, "_use_wildcard", False)
        prev_repair_cache = getattr(self, "_cdtsm_repair_timeseries_enabled_cache", None)
        has_prev_repair_cache = hasattr(self, "_cdtsm_repair_timeseries_enabled_cache")

        self._cdtsm_suppress_repair_warning = True
        self._cdtsm_suppress_high_frequency_logs = True
        self._cdtsm_fast_regular_time_resolution = True
        # Parent already ran ``_ensure_config(df)``; keep wildcard resolution
        # off so per-group preps don't re-scan.
        self._use_wildcard = False
        self._cdtsm_repair_timeseries_enabled_cache = repair_enabled_cache
        # ``time_out_state`` is still exported above for parity, but in serial
        # mode ``self`` already holds that state in-place after
        # ``_cdtsm_apply_time_conversion_once_for_by_groups``.
        _ = time_out_state

        try:
            _preprocess_phase_t0 = time.perf_counter()
            group_preps = []
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
                        "CDTSM: skipping forecast_by combination %d/%d key=%r because all "
                        "selected time series values are null.",
                        group_index + 1,
                        n_tasks,
                        key,
                    )
                    continue

                _step_t0 = time.perf_counter()
                df_g_agg = df_preprocess_source.take(row_positions)
                _record_by_preprocess_step("group_slice", time.perf_counter() - _step_t0)

                try:
                    df_clean_g, df_fp_g, fh_g, hb_snap = self._prepare_forecast_for_api(
                        df_g_agg,
                        skip_ensure_config=True,
                        skip_time_conversion=True,
                        skip_duplicate_aggregation=True,
                        skip_numeric_validation=True,
                        skip_basic_config_validation=True,
                        skip_time_sort=True,
                        skip_fill_null_dropna=not group_has_missing_metric_values,
                    )
                finally:
                    del df_g_agg

                group_was_repaired = bool(
                    getattr(self, "_time_series_was_repaired", False)
                    or getattr(self, "_cdtsm_repair_warning_pending", False)
                )
                # Reset the per-call flags so the NEXT group's prep starts
                # fresh — otherwise a single repaired group's pending warning
                # bleeds into every subsequent group's "was_repaired" read.
                self._time_series_was_repaired = False
                self._cdtsm_repair_warning_pending = False
                if group_was_repaired:
                    any_repaired = True

                group_preps.append(
                    FbGroupForecastPrep(
                        group_key=key,
                        df_clean=df_clean_g,
                        df_for_payload=df_fp_g,
                        forecast_horizon=fh_g,
                        holdback_df=hb_snap,
                        group_index=group_index,
                        was_repaired=group_was_repaired,
                    )
                )
            _preprocess_elapsed = time.perf_counter() - _preprocess_phase_t0

            if not group_preps:
                if previous_by_preprocess_recorder is None:
                    try:
                        delattr(self, "_cdtsm_forecast_by_preprocess_step_recorder")
                    except AttributeError:
                        pass
                else:
                    self._cdtsm_forecast_by_preprocess_step_recorder = (
                        previous_by_preprocess_recorder
                    )
                raise RuntimeError(
                    "CDTSM: forecast_by found no BY groups with non-null time series values."
                )
            if len(group_preps) != n_tasks:
                logger.warning(
                    "CDTSM: skipping %d/%d BY group(s) with all-null time series values; "
                    "continuing with %d group(s).",
                    n_tasks - len(group_preps),
                    n_tasks,
                    len(group_preps),
                )
            if any_repaired:
                # Briefly restore the parent's suppress flag so the
                # user-visible repair caution actually emits once.
                self._cdtsm_suppress_repair_warning = prev_suppress_repair
                self._warn_time_series_repaired_once()
                self._cdtsm_suppress_repair_warning = True
        finally:
            # Restore parent state. The flags must always be restored — even
            # on the happy path — because ``self`` is reused across SPL
            # invocations of the algorithm instance.
            self._cdtsm_suppress_repair_warning = prev_suppress_repair
            self._cdtsm_suppress_high_frequency_logs = prev_suppress_hf
            self._cdtsm_fast_regular_time_resolution = prev_fast_resolution
            self._use_wildcard = prev_use_wildcard
            if has_prev_repair_cache:
                self._cdtsm_repair_timeseries_enabled_cache = prev_repair_cache
            else:
                try:
                    delattr(self, "_cdtsm_repair_timeseries_enabled_cache")
                except AttributeError:
                    pass
        logger.info(
            "CDTSM: forecast_by preprocessing phase timings groups_total=%d groups_prepared=%d "
            "rows_clean=%d elapsed=%.4fs",
            n_tasks,
            len(group_preps),
            sum(len(p.df_clean) for p in group_preps),
            _preprocess_elapsed,
        )
        _log_by_preprocess_step_summary(len(group_preps), _preprocess_elapsed)
        self._record_cdtsm_apply_timing("preprocessing", _preprocess_elapsed)

        total_clean_rows = sum(len(p.df_clean) for p in group_preps)
        del groups, group_positions, group_tasks, df_full
        del df_preprocess_source, metric_values, metric_finite_values
        n_metrics = len(self.columns)
        max_series = int(self.ts_batch_size)

        output_chunks = []
        pending_output_parts = []
        pending_output_rows = 0
        emitted_output_groups = 0
        output_flush_group_count = 128
        output_flush_row_count = 100_000
        api_elapsed_total = 0.0
        postprocess_elapsed_total = 0.0
        payload_materialization_elapsed_total = 0.0

        def flush_output_parts(force=False):
            nonlocal pending_output_parts, pending_output_rows
            if not pending_output_parts:
                return
            if (
                not force
                and len(pending_output_parts) < output_flush_group_count
                and pending_output_rows < output_flush_row_count
            ):
                return
            if len(pending_output_parts) == 1:
                chunk = pending_output_parts[0]
                chunk.reset_index(drop=True, inplace=True)
            else:
                chunk = pd.concat(pending_output_parts, ignore_index=True)
            output_chunks.append(chunk)
            pending_output_parts = []
            pending_output_rows = 0

        def emit_output_part(out_part):
            nonlocal pending_output_rows, emitted_output_groups
            pending_output_parts.append(out_part)
            pending_output_rows += len(out_part)
            emitted_output_groups += 1
            flush_output_parts()

        def emit_one_group(prep, preds_g):
            prev_hb = getattr(self, "_holdback_df", None)
            try:
                self._holdback_df = prep.holdback_df
                out_g = self._build_forecast_dataframe(preds_g, prep.df_clean)
            finally:
                self._holdback_df = prev_hb
            if out_g.empty:
                raise RuntimeError(
                    f"CDTSM: no forecast output for group BY={self.forecast_by!r}, "
                    f"key={prep.group_key!r}. Check data quality for this group."
                )
            out_part = self._append_forecast_by_columns_to_output(out_g, prep.group_key)
            emit_output_part(out_part)
            del out_g, out_part

        _api_output_phase_t0 = time.perf_counter()
        if n_metrics > max_series:
            logger.info(
                "CDTSM: forecast_by compaction skipped — %d forecast field(s) exceed API batch cap (%d); "
                "using per-group column batching.",
                n_metrics,
                max_series,
            )
            logger.info(
                "CDTSM: forecast_by API phase — %d group(s), preprocessing complete; "
                "running forecasting API per group.",
                len(group_preps),
            )
            for prep_idx, prep in enumerate(group_preps):
                logger.info(
                    "CDTSM: forecast_by API combination %d/%d key=%r "
                    "(payload_rows=%d, horizon=%d)",
                    prep.group_index + 1,
                    len(group_preps),
                    prep.group_key,
                    len(prep.df_for_payload),
                    prep.forecast_horizon,
                )
                preds_g = self._forecast_with_batching(
                    prep.df_for_payload, prep.forecast_horizon
                )
                _post_t0 = time.perf_counter()
                emit_one_group(prep, preds_g)
                postprocess_elapsed_total += time.perf_counter() - _post_t0
                group_preps[prep_idx] = None
        else:
            max_groups = max(1, max_series // n_metrics)
            while max_groups * n_metrics > max_series:
                max_groups -= 1
            max_groups = max(1, max_groups)

            n_groups = len(group_preps)
            est_http = math.ceil(n_groups / max_groups) if n_groups else 0
            logger.info(
                "CDTSM: forecast_by API phase — preprocessing complete; request compaction — "
                "%d group(s), %d metric(s)/group, up to %d group(s) per HTTP request "
                "(<= %d series/request), ~%d request(s).",
                n_groups,
                n_metrics,
                max_groups,
                max_series,
                est_http,
            )

            for chunk_idx, chunk_start in enumerate(range(0, n_groups, max_groups)):
                chunk_end = min(chunk_start + max_groups, n_groups)
                first_prep = group_preps[chunk_start]
                last_prep = group_preps[chunk_end - 1]
                chunk_len = chunk_end - chunk_start
                logger.info(
                    "CDTSM: forecast_by API chunk %d/%d — group_index %d..%d "
                    "(%d BY group(s), %d time series in payload).",
                    chunk_idx + 1,
                    est_http,
                    first_prep.group_index,
                    last_prep.group_index,
                    chunk_len,
                    chunk_len * n_metrics,
                )
                horizon = first_prep.forecast_horizon
                for prep_idx in range(chunk_start + 1, chunk_end):
                    if group_preps[prep_idx].forecast_horizon != horizon:
                        raise RuntimeError(
                            "CDTSM: internal error — mixed forecast horizons across forecast_by groups."
                        )

                _chunk_t0 = time.perf_counter()
                _payload_t0 = time.perf_counter()

                def iter_payload_specs():
                    for prep_idx in range(chunk_start, chunk_end):
                        prep = group_preps[prep_idx]
                        for col in self.columns:
                            yield prep.df_for_payload, col

                payload = self._build_forecast_by_compacted_payload_slots(
                    iter_payload_specs(),
                    horizon,
                )
                _payload_elapsed = time.perf_counter() - _payload_t0
                payload_materialization_elapsed_total += _payload_elapsed

                _api_t0 = time.perf_counter()
                response = self._call_endpoint(payload, horizon)
                _api_elapsed = time.perf_counter() - _api_t0
                api_elapsed_total += _api_elapsed
                _demux_t0 = time.perf_counter()
                if "predictions" not in response:
                    raise RuntimeError(
                        "CDTSM: Invalid API response structure - missing 'predictions' key"
                    )
                predictions = response["predictions"]
                expected_predictions = chunk_len * n_metrics
                if len(predictions) != expected_predictions:
                    logger.warning(
                        "CDTSM: API returned %d predictions but expected %d for "
                        "forecast_by compacted chunk %d/%d",
                        len(predictions),
                        expected_predictions,
                        chunk_idx + 1,
                        est_http,
                    )
                    if len(predictions) < expected_predictions:
                        raise RuntimeError(
                            "CDTSM: forecast_by compacted API response is incomplete "
                            f"for chunk {chunk_idx + 1}/{est_http}"
                        )

                slot = 0
                for prep_idx in range(chunk_start, chunk_end):
                    prep = group_preps[prep_idx]
                    logger.info(
                        "CDTSM: forecast_by API response demux for combination %d/%d " "key=%r",
                        prep.group_index + 1,
                        n_groups,
                        prep.group_key,
                    )
                    preds_g = {}
                    for col in self.columns:
                        col_prediction = self._prune_single_prediction_for_column(
                            predictions[slot], horizon, col
                        )
                        if not col_prediction:
                            raise RuntimeError(
                                "CDTSM: forecast_by compacted API response has no usable "
                                f"prediction values for column '{col}'"
                            )
                        preds_g[col] = col_prediction
                        slot += 1
                    emit_one_group(prep, preds_g)

                del payload, response, predictions
                _demux_elapsed = time.perf_counter() - _demux_t0
                postprocess_elapsed_total += _demux_elapsed
                for prep_idx in range(chunk_start, chunk_end):
                    group_preps[prep_idx] = None
                logger.info(
                    "CDTSM: forecast_by API chunk timing chunk=%d/%d groups=%d series=%d — "
                    "payload_build=%.4fs, api=%.4fs, demux_output=%.4fs, total=%.4fs",
                    chunk_idx + 1,
                    est_http,
                    chunk_len,
                    expected_predictions,
                    _payload_elapsed,
                    _api_elapsed,
                    _demux_elapsed,
                    time.perf_counter() - _chunk_t0,
                )

        _concat_t0 = time.perf_counter()
        flush_output_parts(force=True)
        if not output_chunks:
            raise RuntimeError(f"CDTSM: no forecast output rows for BY={self.forecast_by!r}")
        if len(output_chunks) == 1:
            combined = output_chunks.pop()
        else:
            combined = pd.concat(output_chunks, ignore_index=True)
        prefix = list(fcols)
        if "_groupby_field" in combined.columns:
            prefix.append("_groupby_field")
        if list(combined.columns[: len(prefix)]) != prefix:
            combined = combined[prefix + [c for c in combined.columns if c not in prefix]]
        del output_chunks
        # Final BY concat + column-prefix reordering is "data preparation for
        # output" — keep it separate from per-group postprocessing module work
        # so the 5-phase apply summary in apply.py can attribute it cleanly.
        _output_prep_elapsed = time.perf_counter() - _concat_t0
        self._record_cdtsm_apply_timing(
            "materialization", payload_materialization_elapsed_total
        )
        self._record_cdtsm_apply_timing("api", api_elapsed_total)
        self._record_cdtsm_apply_timing("postprocessing", postprocess_elapsed_total)
        self._record_cdtsm_apply_timing("output_preparation", _output_prep_elapsed)
        logger.info(
            "CDTSM: forecast_by phase timing summary groups=%d output_rows=%d — "
            "api_output=%.4fs, total=%.4fs",
            emitted_output_groups,
            len(combined),
            time.perf_counter() - _api_output_phase_t0,
            time.perf_counter() - by_total_t0,
        )
        del group_preps

        if previous_by_preprocess_recorder is None:
            try:
                delattr(self, "_cdtsm_forecast_by_preprocess_step_recorder")
            except AttributeError:
                pass
        else:
            self._cdtsm_forecast_by_preprocess_step_recorder = previous_by_preprocess_recorder
        return combined, total_clean_rows

    def _prune_and_validate_response(self, response, batch_horizon):
        """Prune API response to ensure each array contains at most horizon values.

        This ensures that even if the API returns more values than requested,
        we only use the first `horizon` values for forecasting.

        The new API response structure is:
        {
          "predictions": [
            {
              "mean": [...values...],
              "quantiles": {
                "p10": [...values...],
                "p20": [...values...],
                ...
                "p90": [...values...]
              }
            },
            { ... another column ... }
          ]
        }

        Each element in predictions array corresponds to a column in self.columns (same order).

        Args:
            response (dict): API response with forecasts

        Returns:
            dict: Pruned response with arrays limited to horizon length,
                  organized by column name with p-notation keys
        """
        pruned_response = {}

        if "predictions" not in response:
            raise RuntimeError(
                "CDTSM: Invalid API response structure - missing 'predictions' key"
            )

        predictions = response["predictions"]

        if len(predictions) != len(self.columns):
            logger.warning(
                "CDTSM: API returned %d predictions but expected %d columns",
                len(predictions),
                len(self.columns),
            )

        for idx, col in enumerate(self.columns):
            if idx >= len(predictions):
                logger.warning(
                    "CDTSM: Column '%s' (index %d) not found in predictions array (length %d)",
                    col,
                    idx,
                    len(predictions),
                )
                continue

            col_prediction = predictions[idx]
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

            if pruned_col_response:
                pruned_response[col] = pruned_col_response

        logger.info(
            "CDTSM: Validated and pruned API response for %d columns", len(pruned_response)
        )

        return pruned_response

    def _get_forecast_column_name(
        self, percentile, col, is_conf_interval=False, conf_type=None
    ):
        """Generate forecast column name based on whether it's a confidence interval quantile.

        Args:
            percentile (str): Percentile identifier (e.g., 'p10', 'mean', 'p90')
            col (str): Column name (e.g., 'cpu', 'memory')
            is_conf_interval (bool): Whether this is for a confidence interval column
            conf_type (str): 'lower' or 'upper' if is_conf_interval is True

        Returns:
            str: Forecast column name
                - For mean: 'predicted({col})' (e.g., 'predicted(cpu)')
                - For other user percentiles: '{percentile}(predicted({col}))' (e.g., 'p10(predicted(cpu))')
                - For conf_interval lower: 'lower{interval}(predicted({col}))' (e.g., 'lower95(predicted(cpu))')
                - For conf_interval upper: 'upper{interval}(predicted({col}))' (e.g., 'upper95(predicted(cpu))')
        """
        if is_conf_interval and conf_type:
            # Confidence interval column (lower or upper)
            alpha_str = f"{self.conf_interval:g}"  # :g removes trailing zeros
            return f"{conf_type}{alpha_str}(predicted({col}))"
        elif percentile == 'mean':
            # Mean gets a simplified column name without the mean() prefix
            return f"predicted({col})"
        else:
            # Standard user percentile (always p-format)
            return f"{percentile}(predicted({col}))"

    def _get_all_forecast_columns(self, col):
        """Get list of all forecast column names for a given column.

        This includes both user quantiles (p-format) and confidence interval columns (lower/upper format).

        Args:
            col (str): Column name (e.g., 'cpu', 'memory')

        Returns:
            list: List of (column_name, source_percentile) tuples
        """
        columns = []

        for percentile in self.output_user_quantiles:
            col_name = self._get_forecast_column_name(percentile, col, is_conf_interval=False)
            columns.append((col_name, percentile))

        for percentile, conf_type in self.output_conf_quantiles:
            col_name = self._get_forecast_column_name(
                percentile, col, is_conf_interval=True, conf_type=conf_type
            )
            columns.append((col_name, percentile))

        return columns

    def _populate_forecastviz_metadata(self, forecast_df):
        """Set fields equivalent to the ``forecastviz(ft, hb, v, ci)`` macro (see macros.conf).

        Populates ``_ft`` (forecast_k), ``_hb`` (holdback), ``_vars`` (fields_to_forecast),
        ``_time_field`` (configured time column name), and ``_ci`` (conf_interval) on every
        row so SPL does not need a separate ``| eval`` and ForecastViz can resolve holdback
        using the same logic as karma/ARIMA.
        """
        if forecast_df is None or forecast_df.empty:
            return
        vars_str = ",".join(self.columns)
        ci_val = self.conf_interval
        if ci_val is not None:
            try:
                ci_val = int(ci_val)
            except (TypeError, ValueError):
                ci_val = None
        forecast_df["_ft"] = int(self.horizon)
        forecast_df["_hb"] = int(self.holdback)
        forecast_df["_vars"] = vars_str
        forecast_df["_time_field"] = self.time_field
        forecast_df["_ci"] = ci_val

    def _build_forecast_dataframe(self, response, input_df):
        """Build forecast dataframe with both original input rows and forecast rows.

        Supports two modes:
        1. Regular mode: Forecast rows have future timestamps beyond input data
        2. Holdback mode: Forecast rows use existing holdback timestamps

        Output structure:
        - Input rows: Original columns with their values, forecast columns set to null
        - Forecast rows: Time field with timestamps, forecast columns with predictions,
          original columns set to null (or actual values in holdback mode)

        Args:
            response (dict): API response with forecasts (already pruned and validated)
            input_df (pd.DataFrame): Original cleaned input dataframe (ALL data including holdback)

        Returns:
            pd.DataFrame: Combined dataframe with input rows and forecast rows
        """
        if input_df.empty:
            logger.warning("CDTSM: Input dataframe is empty")
            return pd.DataFrame()

        if self._time_resolution_seconds is None:
            time_resolution_seconds = self._detect_time_resolution(input_df)
            logger.warning(
                "CDTSM: Time resolution was not cached, detecting: %d seconds (%d minutes)",
                time_resolution_seconds,
                time_resolution_seconds // 60,
            )
        else:
            time_resolution_seconds = self._time_resolution_seconds

        if input_df[self.time_field].is_monotonic_increasing:
            input_df_sorted = input_df
        else:
            input_df_sorted = input_df.sort_values(self.time_field)

        orig_col = CDTSM_INTERNAL_ORIGINAL_TIME_COLUMN
        has_orig = orig_col in input_df.columns
        orig_times_full = None
        all_forecast_times = None
        if has_orig:
            orig_times_full = input_df_sorted[orig_col].astype(np.int64).values
            if self.holdback > 0 and self._holdback_df is not None:
                hb_orig = self._holdback_df[orig_col].astype(np.int64).values
                n_future = int(self.future_points)
                if n_future > 0:
                    ft = _future_epoch_seconds_cycling_gaps(orig_times_full, n_future)
                    all_forecast_times = np.concatenate([hb_orig, ft])
                else:
                    all_forecast_times = hb_orig
            else:
                all_forecast_times = _future_epoch_seconds_cycling_gaps(
                    orig_times_full, int(self.horizon)
                )

        if has_orig:
            last_time_seconds = int(orig_times_full[-1])
            logger.info(
                "CDTSM: Calendar-DST uniform spacing was applied upstream; "
                "restoring original epoch timestamps on output (history + forecast cadence from observed gaps)."
            )
        else:
            last_time_seconds = int(input_df_sorted[self.time_field].iloc[-1])

        if self.holdback > 0 and self._holdback_df is not None:
            forecast_horizon = self.horizon
            logger.info(
                "CDTSM: Building forecast dataframe in HOLDBACK mode (total:%d: %d holdback + %d future)",
                forecast_horizon,
                self.holdback,
                self.future_points,
            )
        else:
            forecast_horizon = self.horizon
            logger.info(
                "CDTSM: Building forecast dataframe in REGULAR mode (horizon:%d, all future, last_time:%d seconds)",
                forecast_horizon,
                last_time_seconds,
            )

        forecast_records = []
        for step in range(forecast_horizon):
            if has_orig and all_forecast_times is not None:
                forecast_time_seconds = int(all_forecast_times[step])
            elif self.holdback > 0 and self._holdback_df is not None:
                if step < self.holdback:
                    forecast_time_seconds = int(self._holdback_df[self.time_field].iloc[step])
                else:
                    steps_beyond_holdback = step - self.holdback + 1
                    forecast_time_seconds = last_time_seconds + (
                        steps_beyond_holdback * time_resolution_seconds
                    )
            else:
                forecast_time_seconds = last_time_seconds + (
                    (step + 1) * time_resolution_seconds
                )

            record = {self.time_field: forecast_time_seconds}
            if CDTSM_INTERNAL_ROW_TZ_COLUMN in input_df_sorted.columns:
                if self.holdback > 0 and self._holdback_df is not None and step < self.holdback:
                    record[CDTSM_INTERNAL_ROW_TZ_COLUMN] = self._holdback_df[
                        CDTSM_INTERNAL_ROW_TZ_COLUMN
                    ].iloc[step]
                else:
                    record[CDTSM_INTERNAL_ROW_TZ_COLUMN] = input_df_sorted[
                        CDTSM_INTERNAL_ROW_TZ_COLUMN
                    ].iloc[-1]

            for col in self.columns:
                if col not in response:
                    logger.warning("CDTSM: Column '%s' not found in API response", col)
                    continue

                col_response = response[col]

                all_columns = self._get_all_forecast_columns(col)

                for forecast_col_name, source_percentile in all_columns:

                    if source_percentile in col_response:
                        values = col_response[source_percentile]
                        if step < len(values):
                            record[forecast_col_name] = values[step]
                        else:
                            record[forecast_col_name] = None
                    else:
                        record[forecast_col_name] = None

            forecast_records.append(record)

        if not forecast_records:
            messages.warn("CDTSM: No forecast records generated from API response")
            return pd.DataFrame()

        if self.holdback > 0 and self._holdback_df is not None:
            logger.info(
                "CDTSM: Building output in HOLDBACK mode - forecast_records:%d (holdback:%d, future:%d)",
                len(forecast_records),
                self.holdback,
                self.future_points,
            )

            holdback_records = forecast_records[: self.holdback]
            future_records = forecast_records[self.holdback :] if self.future_points > 0 else []

            logger.info(
                "CDTSM: Split forecasts - holdback_records:%d, future_records:%d",
                len(holdback_records),
                len(future_records),
            )

            if self.show_input:
                result_df = input_df_sorted.copy()
                logger.info(
                    "CDTSM: include_input - including all %d input rows", len(result_df)
                )
            else:
                result_df = self._holdback_df.copy()
                logger.info(
                    "CDTSM: show_input:False - including only %d holdback rows",
                    len(result_df),
                )

            if has_orig and orig_col in result_df.columns:
                result_df[self.time_field] = result_df[orig_col].values
                result_df.drop(columns=[orig_col], inplace=True)

            total_forecast_cols = 0
            for col in self.columns:
                all_columns = self._get_all_forecast_columns(col)
                for forecast_col_name, _ in all_columns:
                    result_df[forecast_col_name] = None
                    total_forecast_cols += 1

            logger.info(
                "CDTSM: Initialized %d forecast columns (all null)",
                total_forecast_cols,
            )

            total_rows = len(result_df)
            if self.show_input:
                holdback_start_idx = total_rows - self.holdback
            else:
                holdback_start_idx = 0

            result_df.reset_index(drop=True, inplace=True)

            for step, record in enumerate(holdback_records):
                row_idx = holdback_start_idx + step

                for col in self.columns:
                    all_columns = self._get_all_forecast_columns(col)
                    for forecast_col_name, _ in all_columns:
                        if forecast_col_name in record:
                            result_df.iloc[
                                row_idx, result_df.columns.get_loc(forecast_col_name)
                            ] = record[forecast_col_name]

            logger.info(
                "CDTSM: Added forecast values to %d holdback rows (indices %d to %d)",
                self.holdback,
                holdback_start_idx,
                total_rows - 1,
            )

            if future_records:
                logger.info(
                    "CDTSM: Creating %d new future forecast rows beyond holdback",
                    len(future_records),
                )

                future_df = pd.DataFrame.from_records(future_records)

                for col in result_df.columns:
                    if col not in future_df.columns:
                        future_df[col] = None

                result_df = pd.concat([result_df, future_df], ignore_index=True)

                logger.info(
                    "CDTSM: Concatenated holdback result (%d rows) with future forecasts (%d rows) : %d total rows",
                    total_rows,
                    len(future_df),
                    len(result_df),
                )

            forecast_df = result_df

        else:
            logger.info("CDTSM: Building output in REGULAR mode - creating new forecast rows")

            forecast_df = pd.DataFrame.from_records(forecast_records)

            if self.show_input:
                logger.info("CDTSM: include_input - including input data with forecast")

                input_df_with_forecasts = input_df_sorted.copy()
                if has_orig and orig_col in input_df_with_forecasts.columns:
                    input_df_with_forecasts[self.time_field] = input_df_with_forecasts[
                        orig_col
                    ].values
                    input_df_with_forecasts.drop(columns=[orig_col], inplace=True)

                total_forecast_cols = 0
                for col in self.columns:
                    all_columns = self._get_all_forecast_columns(col)
                    for forecast_col_name, _ in all_columns:
                        input_df_with_forecasts[forecast_col_name] = None
                        total_forecast_cols += 1

                logger.info(
                    "CDTSM: Added %d forecast columns to input dataframe (set to null)",
                    total_forecast_cols,
                )

                for col in input_df_sorted.columns:
                    if col == CDTSM_INTERNAL_ORIGINAL_TIME_COLUMN:
                        continue
                    if col not in forecast_df.columns:
                        if col == '_time' and self.time_field != '_time':
                            continue
                        forecast_df[col] = None

                logger.info(
                    "CDTSM: Added %d original columns to forecast dataframe (set to null)",
                    len(
                        [
                            col
                            for col in input_df_sorted.columns
                            if col not in [self.time_field]
                            and col != CDTSM_INTERNAL_ORIGINAL_TIME_COLUMN
                            and not (col == '_time' and self.time_field != '_time')
                        ]
                    ),
                )

                combined_df = pd.concat(
                    [input_df_with_forecasts, forecast_df], ignore_index=True
                )

                logger.info(
                    "CDTSM: Combined input (%d rows) and forecast (%d rows) into %d total rows",
                    len(input_df_with_forecasts),
                    len(forecast_df),
                    len(combined_df),
                )

                forecast_df = combined_df
            else:
                logger.info(
                    "CDTSM: exclude_input - showing only forecast rows without input data"
                )

        logger.info(
            "CDTSM: Generated forecast dataframe with %d rows and %d columns",
            len(forecast_df),
            len(forecast_df.columns),
        )
        logger.info(
            "CDTSM: Forecast columns: %s",
            [col for col in forecast_df.columns if col != self.time_field],
        )

        if CDTSM_INTERNAL_ORIGINAL_TIME_COLUMN in forecast_df.columns:
            forecast_df.drop(
                columns=[CDTSM_INTERNAL_ORIGINAL_TIME_COLUMN],
                errors="ignore",
                inplace=True,
            )

        self._populate_forecastviz_metadata(forecast_df)

        return forecast_df
