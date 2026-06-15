"""Input validation, time-resolution repair, and data-quality checks."""

import copy

import numpy as np
import pandas as pd

import cexc
from cdtsm_pkg.constants import (
    CDTSM_INTERNAL_ORIGINAL_TIME_COLUMN,
    DEFAULT_FILL_NULL,
    FILL_NULL_FF,
    FILL_NULL_INTERPOLATE,
    FORECAST_BY_DUP_TIME_AGG,
    MIN_INPUT_DATAPOINTS,
)
from util.ctsm_conf_util import CTSMConfUtil
from util.telemetry_cdtsm_util import (
    log_cdtsm_time_field_null,
    log_cdtsm_time_resolution,
)

logger = cexc.get_logger(__name__)
messages = cexc.get_messages_logger()
CDTSM_REPAIR_WARNING_MESSAGE = "Timeseries was repaired. Repaired time series might have different resolution than the original."

# Consecutive-step deltas (seconds) for one sample per *calendar day* when absolute
# timestamps cross DST: 24h, 23h (spring forward), 25h (fall back). CDTSM otherwise
# treats these as "inconsistent"; we normalize in-place to uniform 86400s steps.
_CALENDAR_DAY_DST_INTERVAL_SEC = frozenset({82800, 86400, 90000})
# 30× calendar-day triplet: 30×{23h,24h,25h} in seconds (LA-style monthly noon samples).
_CALENDAR_30DAY_DST_INTERVAL_SEC = frozenset({2588400, 2592000, 2595600})

# Snapshot for BY-group workers after the parent runs ``_convert_time_field_to_seconds`` once
# on the full frame (output timestamp restoration needs the same ingest metadata).
_CDTSM_TIME_OUTPUT_STATE_ATTRS = (
    "_original_time_dtype",
    "_detected_time_format",
    "_is_unix_timestamp",
    "_time_was_string",
    "_time_was_datetime64",
    "_original_time_sample",
    "_original_time_tz_offset_has_colon",
    "_data_tz",
    "_predominant_data_tz",
    "_epoch_unit",
    "_frac_sec_precision",
    "_parse_detection_window_naive_use_utc",
)


class ValidationMixin:
    """Mixin providing data-validation and time-series repair helpers for CDTSM.

    Expects the host class to expose at least the following attributes:

    * ``self.time_field``          – name of the timestamp column
    * ``self.columns``             – list of target column names
    * ``self.columns_str``         – comma-joined target column names
    * ``self._use_wildcard``       – whether ``*`` was requested
    * ``self._searchinfo``         – Splunk search info dict
    * ``self._time_resolution_seconds``  – cached resolution (set by repair)
    * ``self._time_series_was_repaired`` – flag set after repair
    """

    def _ensure_config(self, df):
        """Validate input dataframe and configuration.

        Args:
            df (pd.DataFrame): Input dataframe

        Raises:
            RuntimeError: If validation fails
        """
        if df is None or df.empty:
            raise RuntimeError("CDTSM: Input dataframe is empty")

        if not getattr(self, "_cdtsm_suppress_repair_warning", False):
            self._cdtsm_repair_warning_emitted = False
            self._cdtsm_repair_warning_pending = False

        if self.time_field not in df.columns:
            raise RuntimeError(
                f"CDTSM: time_field '{self.time_field}' not found in input data. "
                f"Available columns: {', '.join(df.columns)}"
            )

        if self._use_wildcard:
            self._resolve_wildcard_columns(df)

        missing_columns = [col for col in self.columns if col not in df.columns]
        if missing_columns:
            raise RuntimeError(
                f"CDTSM: The following columns were not found in input data: {', '.join(missing_columns)}. "
                f"Available columns: {', '.join(df.columns)}"
            )

    def _cdtsm_export_time_output_state(self):
        """Copy attributes set by :meth:`~algos.PredictAI.PredictAI._convert_time_field_to_seconds` for BY clones."""
        state = {}
        for name in _CDTSM_TIME_OUTPUT_STATE_ATTRS:
            if not hasattr(self, name):
                continue
            v = getattr(self, name)
            try:
                state[name] = copy.copy(v)
            except TypeError:
                state[name] = v
        return state

    def _cdtsm_import_time_output_state(self, state):
        """Restore ingest time metadata on a worker :class:`~algos.PredictAI.PredictAI` instance."""
        if not state:
            return
        for name, v in state.items():
            setattr(self, name, v)

    def _cdtsm_apply_time_conversion_once_for_by_groups(self, df):
        """Run time null-check + epoch conversion once on the full frame for ``forecast_by`` / BY paths.

        Call immediately after :meth:`_ensure_config` on ``df``. Group workers should
        :meth:`_ensure_config` the same converted frame, :meth:`_cdtsm_import_time_output_state`,
        then run per-group prep with ``skip_time_conversion=True``.

        Returns:
            tuple: ``(df_converted, time_output_state_dict)``
        """
        self._validate_time_field_no_nulls_or_blanks_before_convert(df)
        df_conv = self._convert_time_field_to_seconds(df, inplace=True)
        return df_conv, self._cdtsm_export_time_output_state()

    def _cdtsm_group_has_no_series_values(self, df_g):
        """Return True when a BY group has no non-null values in any selected series column."""
        if df_g is None or df_g.empty:
            return True
        series_cols = [col for col in self.columns if col in df_g.columns]
        if not series_cols:
            return True
        return not df_g[series_cols].notna().to_numpy().any()

    def _warn_time_series_repaired_once(self):
        """Emit the user-facing repair caution at most once per parent invocation."""
        if getattr(self, "_cdtsm_suppress_repair_warning", False):
            self._cdtsm_repair_warning_pending = True
            return
        if getattr(self, "_cdtsm_repair_warning_emitted", False):
            return
        messages.warn(CDTSM_REPAIR_WARNING_MESSAGE)
        self._cdtsm_repair_warning_emitted = True
        self._cdtsm_repair_warning_pending = False

    def _validate_time_field_no_nulls_or_blanks_before_convert(self, df):
        """Reject null or blank values in the time column before epoch conversion.

        Matches the error raised later by :meth:`_validate_and_repair_time_resolution`
        for null timestamps, but runs on the raw ingest column so failures happen
        before :meth:`~algos.PredictAI.PredictAI._convert_time_field_to_seconds`.
        Blank strings (including whitespace-only) in object/string columns are treated
        like nulls for this check.
        """
        if self.time_field not in df.columns:
            return
        time_col = df[self.time_field]
        null_count = int(time_col.isna().sum())
        blank_count = 0
        if time_col.dtype == object or pd.api.types.is_string_dtype(time_col):
            non_null = time_col.notna()
            blank_count = int(time_col[non_null].astype(str).str.strip().eq("").sum())
        if null_count > 0 or blank_count > 0:
            log_cdtsm_time_field_null(is_groupby=1 if getattr(self, "forecast_by", None) else 0)
            raise RuntimeError(
                f"CDTSM: The time field '{self.time_field}' contains at least 1 null value. "
                f"All timestamp values must be non-null. "
                f"Please remove or fill null timestamps before applying CDTSM."
            )

    def _resolve_wildcard_columns(self, df):
        """Resolve wildcard '*' to actual numeric columns available for forecasting.

        Detects all numeric columns in the dataframe (excluding time_field) and sets
        them as the columns to forecast. Non-numeric columns are reported as warnings.

        Args:
            df (pd.DataFrame): Input dataframe

        Raises:
            RuntimeError: If no forecastable columns are found
        """
        all_columns = list(df.columns)
        numeric_columns = []
        non_numeric_columns = []
        skipped_internal_columns = []

        for col in all_columns:
            if col == self.time_field:
                continue

            if col.startswith('__mv'):
                skipped_internal_columns.append(col)
                continue

            if pd.api.types.is_numeric_dtype(df[col]):
                numeric_columns.append(col)
            else:
                try:
                    converted = pd.to_numeric(df[col], errors='coerce')
                    non_null_count = converted.notna().sum()
                    total_count = len(df[col])
                    if total_count > 0 and (non_null_count / total_count) > 0.5:
                        numeric_columns.append(col)
                        logger.info(
                            "CDTSM: Column '%s' can be converted to numeric (%.1f%% valid values)",
                            col,
                            (non_null_count / total_count) * 100,
                        )
                    else:
                        non_numeric_columns.append(col)
                except Exception:
                    non_numeric_columns.append(col)

        if non_numeric_columns:
            messages.warn(
                f"CDTSM: The following columns are not numeric and cannot be forecasted: "
                f"{', '.join(non_numeric_columns)}"
            )
            logger.warning(
                "CDTSM: Non-forecastable columns (not numeric): %s",
                ", ".join(non_numeric_columns),
            )

        if not numeric_columns:
            raise RuntimeError(
                f"CDTSM: No numeric columns found for forecasting when using '*' wildcard. "
                f"Available columns (excluding time_field '{self.time_field}'): "
                f"{', '.join([c for c in all_columns if c != self.time_field and not c.startswith('__mv')])}. "
                f"Please ensure your data contains numeric columns to forecast."
            )

        self.columns = numeric_columns
        self.columns_str = ",".join(numeric_columns)

        logger.info(
            "CDTSM: Wildcard '*' resolved to %d numeric columns: %s",
            len(numeric_columns),
            ", ".join(numeric_columns[:10]) + ("..." if len(numeric_columns) > 10 else ""),
        )

    def _is_repair_timeseries_enabled(self):
        """Check if time series repair is enabled in mlspl.conf.

        Returns:
            bool: True if repair_timeseries is set to true in [CTSM] stanza (default True when unset
            or unreadable).
        """
        if hasattr(self, "_cdtsm_repair_timeseries_enabled_cache"):
            return self._cdtsm_repair_timeseries_enabled_cache
        try:
            if self._searchinfo:
                ctsm_conf = CTSMConfUtil(self._searchinfo)
                enabled = ctsm_conf.get_repair_timeseries()
                self._cdtsm_repair_timeseries_enabled_cache = enabled
                return enabled
        except Exception as e:
            logger.warning(
                "CDTSM: Could not read repair_timeseries config: %s. Defaulting to True (repair enabled).",
                str(e),
            )
        self._cdtsm_repair_timeseries_enabled_cache = True
        return True

    def _is_recommended_resolution(self, resolution_seconds):
        """Check if the resolution is one of the recommended values (1 minute or 5 minutes).

        Args:
            resolution_seconds (int): Resolution in seconds

        Returns:
            bool: True if resolution is 60 (1 min) or 300 (5 min), False otherwise
        """
        return resolution_seconds in (60, 300)

    def _validate_and_repair_time_resolution(
        self, df, input_already_sorted=False, skip_duplicate_aggregation=False
    ):
        """Validate time resolution and repair if inconsistent.

        If time intervals are consistent, returns the dataframe as-is.
        If consistent but the resolution is not 1 minute or 5 minutes (and repair_timeseries is disabled),
        a caution message is displayed to the user.

        Duplicate timestamps are first collapsed by averaging metric columns and taking the
        first value for non-metric columns.

        If time intervals are inconsistent:
        - If repair_timeseries is disabled: raises a RuntimeError
        - If repair_timeseries is enabled (default when unset in mlspl.conf): repairs the time series by:
          1. Calculating mode of time differences
          2. Resampling data to mode resolution starting from earliest timestamp
          3. Averaging data points that fall in each time bucket
          4. Applying forward fill then backward fill for missing values

        Note: Time field is already in seconds (Unix timestamp) at this point.

        Args:
            df (pd.DataFrame): Input dataframe with time field in seconds

        Returns:
            pd.DataFrame: Original or repaired dataframe with consistent time resolution

        Raises:
            RuntimeError: If repair_timeseries is disabled and intervals are inconsistent
        """
        if len(df) < 2:
            logger.warning(
                "CDTSM: Dataframe has fewer than 2 datapoints, cannot validate time resolution"
            )
            return df

        # Check if repair is enabled in mlspl.conf
        repair_enabled = self._is_repair_timeseries_enabled()
        suppress_high_frequency_logs = getattr(
            self, "_cdtsm_suppress_high_frequency_logs", False
        )
        if not suppress_high_frequency_logs:
            logger.info(
                "CDTSM: repair_timeseries config is %s",
                "enabled" if repair_enabled else "disabled",
            )

        if input_already_sorted:
            df_sorted = df
        elif df[self.time_field].is_monotonic_increasing:
            df_sorted = df.copy(deep=False)
        else:
            df_sorted = df.sort_values(self.time_field)

        null_count = df_sorted[self.time_field].isna().sum()
        zero_count = (df_sorted[self.time_field] == 0).sum()

        if null_count > 0 or zero_count > 0:
            log_cdtsm_time_field_null(is_groupby=1 if getattr(self, "forecast_by", None) else 0)
            raise RuntimeError(
                f"CDTSM: The time field '{self.time_field}' contains at least 1 null value. "
                f"All timestamp values must be non-null. "
                f"Please remove or fill null timestamps before applying CDTSM."
            )

        if not skip_duplicate_aggregation:
            df_sorted = self._aggregate_duplicate_timestamps(df_sorted)

        try:
            time_series = df_sorted[self.time_field].astype('int64')
            time_diffs = time_series.diff().dropna()
        except RuntimeError:
            raise  # Re-raise RuntimeError for duplicate timestamps
        except Exception as e:
            logger.warning("CDTSM: Could not compute time differences: %s", str(e))
            return df_sorted

        if time_diffs.empty:
            return df_sorted

        unique_diffs = time_diffs.unique()

        if len(unique_diffs) == 1:
            detected_diff = int(unique_diffs[0])

            if detected_diff == 0:
                raise RuntimeError(
                    "CDTSM: The time field has a resolution of 0 seconds, which means all timestamps are identical. "
                    "A constant time field is not allowed. Please provide data with varying timestamps."
                )
            self._time_resolution_seconds = detected_diff
            self._log_resolution(detected_diff, len(time_diffs), repaired=False)

            if not repair_enabled and not self._is_recommended_resolution(detected_diff):
                resolution_str = self._format_resolution(detected_diff)
                messages.warn(
                    "The Cisco Deep Time Series Model will produce more accurate results when the metric resolution is either 1-minute or 5-minute."
                )
                logger.warning(
                    "CDTSM: Time resolution %d seconds (%s) is not a recommended resolution (1 min or 5 min)",
                    detected_diff,
                    resolution_str,
                )

            log_cdtsm_time_resolution(
                most_frequent_resolution=detected_diff,
                decided_resolution=detected_diff,
                was_repaired=False,
                is_groupby=1 if getattr(self, "forecast_by", None) else 0,
            )
            return df_sorted

        diff_ints = {int(round(float(x))) for x in unique_diffs}
        if diff_ints <= _CALENDAR_DAY_DST_INTERVAL_SEC:
            if not suppress_high_frequency_logs:
                logger.info(
                    "CDTSM: Interval sizes match calendar-day DST variance only "
                    "(%s). Normalizing to uniform %ds steps; row order and metric values unchanged.",
                    sorted(diff_ints),
                    86400,
                )
            t0 = int(time_series.iloc[0])
            n = len(time_series)
            df_sorted = df_sorted.copy()

            df_sorted[CDTSM_INTERNAL_ORIGINAL_TIME_COLUMN] = time_series.astype(np.int64).values
            df_sorted[self.time_field] = t0 + np.arange(n, dtype=np.int64) * 86400

            self._time_resolution_seconds = 86400
            self._time_series_was_repaired = True
            self._log_resolution(86400, n - 1, repaired=True)

            log_cdtsm_time_resolution(
                most_frequent_resolution=86400,
                decided_resolution=86400,
                was_repaired=True,
                is_groupby=1 if getattr(self, "forecast_by", None) else 0,
            )
            self._warn_time_series_repaired_once()
            if not suppress_high_frequency_logs:
                logger.info(
                    "CDTSM: Timestamps had calendar-day DST variance (23h / 24h / 25h between points). "
                    "Normalized time indices to uniform 24-hour (86400 s) spacing; metric values unchanged."
                )
            return df_sorted

        if diff_ints <= _CALENDAR_30DAY_DST_INTERVAL_SEC:
            step_30d = 30 * 86400  # 2592000 — nominal 30×24h spacing
            if not suppress_high_frequency_logs:
                logger.info(
                    "CDTSM: Interval sizes match 30-day calendar DST variance only "
                    "(%s). Normalizing to uniform %ds steps; row order and metric values unchanged.",
                    sorted(diff_ints),
                    step_30d,
                )
            t0 = int(time_series.iloc[0])
            n = len(time_series)
            df_sorted = df_sorted.copy()

            df_sorted[CDTSM_INTERNAL_ORIGINAL_TIME_COLUMN] = time_series.astype(np.int64).values
            df_sorted[self.time_field] = t0 + np.arange(n, dtype=np.int64) * step_30d

            self._time_resolution_seconds = step_30d
            self._time_series_was_repaired = True
            self._log_resolution(step_30d, n - 1, repaired=True)

            log_cdtsm_time_resolution(
                most_frequent_resolution=step_30d,
                decided_resolution=step_30d,
                was_repaired=True,
                is_groupby=1 if getattr(self, "forecast_by", None) else 0,
            )
            self._warn_time_series_repaired_once()
            if not suppress_high_frequency_logs:
                logger.info(
                    "CDTSM: Timestamps had 30-day calendar DST variance; "
                    "normalized time indices to uniform 30×86400 s spacing; metric values unchanged."
                )
            return df_sorted

        diff_counts = time_diffs.value_counts()
        if not suppress_high_frequency_logs:
            logger.warning(
                "CDTSM: Inconsistent time intervals detected. Found varying intervals: %s",
                dict(diff_counts.head(5).items()),
            )

        mode_resolution = int(diff_counts.index[0])
        if not suppress_high_frequency_logs:
            logger.info(
                "CDTSM: Mode resolution is %d seconds (occurred %d times out of %d intervals)",
                mode_resolution,
                diff_counts.iloc[0],
                len(time_diffs),
            )

        if mode_resolution == 0:
            raise RuntimeError(
                "CDTSM: The most common time interval is 0 seconds, indicating many consecutive identical timestamps. "
                "Please provide data with distinct, incrementing timestamps."
            )

        if not repair_enabled:
            resolution_str = self._format_resolution(mode_resolution)
            logger.error(
                "CDTSM: repair_timeseries is disabled and time series has inconsistent intervals. Mode resolution: %d seconds",
                mode_resolution,
            )

            log_cdtsm_time_resolution(
                most_frequent_resolution=mode_resolution,
                decided_resolution=mode_resolution,
                was_repaired=False,
                is_groupby=1 if getattr(self, "forecast_by", None) else 0,
            )

            raise RuntimeError(
                f"CDTSM: The time series has inconsistent time intervals and cannot be processed. "
            )

        if not suppress_high_frequency_logs:
            logger.info(
                "CDTSM: repair_timeseries is enabled. Proceeding with time series repair."
            )

        df_repaired = self._repair_time_series(df_sorted, mode_resolution)

        self._time_resolution_seconds = mode_resolution
        self._time_series_was_repaired = True
        self._log_resolution(mode_resolution, len(df_repaired) - 1, repaired=True)

        log_cdtsm_time_resolution(
            most_frequent_resolution=mode_resolution,
            decided_resolution=mode_resolution,
            was_repaired=True,
            is_groupby=1 if getattr(self, "forecast_by", None) else 0,
        )

        return df_repaired

    def _repair_time_series(self, df, target_resolution):
        """Repair time series by resampling to target resolution.

        Args:
            df (pd.DataFrame): Input dataframe sorted by time
            target_resolution (int): Target resolution in seconds

        Returns:
            pd.DataFrame: Repaired dataframe with consistent time resolution
        """
        start_time = np.int64(df[self.time_field].iloc[0])
        end_time = np.int64(df[self.time_field].iloc[-1])

        num_buckets = int((end_time - start_time) / target_resolution) + 1

        suppress_high_frequency_logs = getattr(
            self, "_cdtsm_suppress_high_frequency_logs", False
        )
        if not suppress_high_frequency_logs:
            logger.info(
                "CDTSM: Repairing time series - start:%d, end:%d, resolution:%ds, buckets:%d",
                start_time,
                end_time,
                target_resolution,
                num_buckets,
            )

        new_timestamps = start_time + np.arange(num_buckets, dtype=np.int64) * target_resolution

        repaired_df = pd.DataFrame({self.time_field: new_timestamps})

        bucket_idx = (df[self.time_field].astype("int64").to_numpy() - int(start_time)) // int(
            target_resolution
        )
        valid_bucket_mask = (bucket_idx >= 0) & (bucket_idx < num_buckets)

        metric_cols = [col for col in self.columns if col in df.columns]
        if metric_cols:
            values_df = df.loc[valid_bucket_mask, metric_cols].apply(
                pd.to_numeric, errors="coerce"
            )
            values_df.insert(0, "bucket", bucket_idx[valid_bucket_mask].astype(np.int64))
            bucket_means = values_df.groupby("bucket", sort=False)[metric_cols].mean()

            for col in metric_cols:
                col_out = np.full(num_buckets, np.nan, dtype=float)
                if col in bucket_means.columns:
                    col_out[bucket_means.index.to_numpy(dtype=np.int64)] = bucket_means[
                        col
                    ].to_numpy(dtype=float)
                repaired_df[col] = col_out

        null_counts_before = {
            col: repaired_df[col].isna().sum()
            for col in self.columns
            if col in repaired_df.columns
        }
        total_nulls_before = sum(null_counts_before.values())

        if total_nulls_before > 0:
            if not suppress_high_frequency_logs:
                logger.info(
                    "CDTSM: Repair created %d null values across columns. Applying fill_null=%s.",
                    total_nulls_before,
                    getattr(self, "fill_null", DEFAULT_FILL_NULL),
                )

            repaired_df = self._apply_fill_null(repaired_df)

            null_counts_after = {
                col: repaired_df[col].isna().sum()
                for col in self.columns
                if col in repaired_df.columns
            }
            total_nulls_after = sum(null_counts_after.values())

            if total_nulls_after > 0:
                if getattr(self, "fill_null", DEFAULT_FILL_NULL) == FILL_NULL_INTERPOLATE:
                    if not suppress_high_frequency_logs:
                        logger.info(
                            "CDTSM: %d null values retained for context-level linear interpolation",
                            total_nulls_after,
                        )
                else:
                    logger.warning(
                        "CDTSM: %d null values remain after fill_null handling",
                        total_nulls_after,
                    )
            else:
                if not suppress_high_frequency_logs:
                    logger.info("CDTSM: All null values successfully handled by fill_null")

        resolution_str = self._format_resolution(target_resolution)

        self._warn_time_series_repaired_once()

        if not suppress_high_frequency_logs:
            logger.info(
                "CDTSM: Time series repair complete - original rows: %d, repaired rows: %d, resolution: %s",
                len(df),
                len(repaired_df),
                resolution_str,
            )

        return repaired_df

    @staticmethod
    def _metric_mode(series):
        """Return mode for a metric column, ignoring nulls."""
        ss = pd.Series(series).dropna()
        if ss.empty:
            return np.nan
        mo = ss.mode()
        if len(mo):
            return mo.iloc[0]
        return ss.iloc[0]

    def _aggregate_duplicate_timestamp_columns(
        self, df, group_cols, *, metric_agg="mean", sort_result=True
    ):
        """Collapse duplicate rows for ``group_cols`` using metric aggregation.

        Metric columns use ``metric_agg``; non-metric columns keep the first value.
        """
        if df.empty:
            return df

        group_cols = list(group_cols)
        if not group_cols:
            return df
        missing_group_cols = [col for col in group_cols if col not in df.columns]
        if missing_group_cols:
            return df

        if not df.duplicated(subset=group_cols, keep=False).any():
            if not sort_result:
                return df
            sort_cols = [col for col in group_cols if col in df.columns]
            out = df.sort_values(sort_cols)
            out.reset_index(drop=True, inplace=True)
            return out

        agg_map = {}
        df_for_agg = df.copy()
        for col in self.columns:
            if col not in df_for_agg.columns or col == self.time_field:
                continue
            if metric_agg == "mode":
                agg_map[col] = self._metric_mode
            else:
                df_for_agg[col] = pd.to_numeric(df_for_agg[col], errors="coerce")
                agg_map[col] = metric_agg

        for col in df_for_agg.columns:
            if col in group_cols or col in agg_map:
                continue
            agg_map[col] = "first"

        out = df_for_agg.groupby(group_cols, as_index=False, sort=False, observed=True).agg(
            agg_map
        )
        if sort_result:
            out.sort_values(group_cols, inplace=True)
            out.reset_index(drop=True, inplace=True)
        else:
            out.reset_index(drop=True, inplace=True)
        return out

    def _aggregate_duplicate_timestamps(self, df):
        """Collapse exact duplicate timestamps by averaging metric columns."""
        if df.empty or self.time_field not in df.columns:
            return df
        if not df[self.time_field].duplicated(keep=False).any():
            if df[self.time_field].is_monotonic_increasing:
                return df
            out = df.sort_values(self.time_field)
            out.reset_index(drop=True, inplace=True)
            return out

        n_before = len(df)
        out = self._aggregate_duplicate_timestamp_columns(
            df, [self.time_field], metric_agg="mean"
        )

        if not getattr(self, "_cdtsm_suppress_high_frequency_logs", False):
            logger.info(
                "CDTSM: merged duplicate %s values: %d rows -> %d rows (mean on metrics)",
                self.time_field,
                n_before,
                len(out),
            )
        return out

    def _aggregate_duplicate_timestamps_for_group_by(self, df_g):
        """Within one BY group, collapse duplicate timestamps."""
        if df_g.empty or self.time_field not in df_g.columns:
            return df_g
        if not df_g[self.time_field].duplicated(keep=False).any():
            if df_g[self.time_field].is_monotonic_increasing:
                return df_g
            out = df_g.sort_values(self.time_field)
            out.reset_index(drop=True, inplace=True)
            return out

        n_before = len(df_g)
        metric_agg = FORECAST_BY_DUP_TIME_AGG
        out = self._aggregate_duplicate_timestamp_columns(
            df_g, [self.time_field], metric_agg=metric_agg
        )

        if not getattr(self, "_cdtsm_suppress_high_frequency_logs", False):
            logger.info(
                "CDTSM: per-group — merged duplicate %s within one group: %d rows -> %d (%s on metrics)",
                self.time_field,
                n_before,
                len(out),
                metric_agg,
            )
        return out

    def _aggregate_duplicate_timestamps_for_by_groups(self, df, by_cols):
        """Collapse duplicate BY/time rows once before splitting into groups."""
        fcols = list(by_cols or [])
        if df.empty or not fcols or self.time_field not in df.columns:
            return df

        group_cols = fcols + [self.time_field]
        if not df.duplicated(subset=group_cols, keep=False).any():
            return df

        n_before = len(df)
        metric_agg = FORECAST_BY_DUP_TIME_AGG
        out = self._aggregate_duplicate_timestamp_columns(
            df, group_cols, metric_agg=metric_agg, sort_result=False
        )

        if not getattr(self, "_cdtsm_suppress_high_frequency_logs", False):
            logger.info(
                "CDTSM: forecast_by — merged duplicate BY/%s combinations: %d rows -> %d (%s on metrics)",
                self.time_field,
                n_before,
                len(out),
                metric_agg,
            )
        return out

    def _format_resolution(self, resolution_seconds):
        """Format time resolution in human-readable form.

        Args:
            resolution_seconds (int): Resolution in seconds

        Returns:
            str: Human-readable resolution string (e.g., "5 minute(s)", "1 hour(s)")
        """
        if resolution_seconds >= 3600:
            return f"{resolution_seconds / 3600:.1f} hour(s)"
        elif resolution_seconds >= 60:
            return f"{resolution_seconds / 60:.1f} minute(s)"
        else:
            return f"{resolution_seconds} second(s)"

    def _log_resolution(self, resolution_seconds, num_intervals, repaired=False):
        """Log the detected/repaired time resolution in human-readable format.

        Args:
            resolution_seconds (int): Resolution in seconds
            num_intervals (int): Number of intervals
            repaired (bool): Whether the time series was repaired
        """
        resolution_str = self._format_resolution(resolution_seconds)

        status = "repaired to" if repaired else "detected"
        if not getattr(self, "_cdtsm_suppress_high_frequency_logs", False):
            logger.info(
                "CDTSM: Time resolution %s: %d seconds (%s) - %d intervals",
                status,
                resolution_seconds,
                resolution_str,
                num_intervals,
            )

    def _validate_numerical_columns(self, df):
        """Validate that all specified columns are numerical and suitable for forecasting.

        Args:
            df (pd.DataFrame): Input dataframe

        Raises:
            RuntimeError: If any column is not numerical or contains only nulls
        """
        present_columns = [col for col in self.columns if col in df.columns]
        for col in present_columns:
            if not pd.api.types.is_numeric_dtype(df[col]):
                try:
                    df[col] = pd.to_numeric(df[col], errors='coerce')
                except Exception as e:
                    raise RuntimeError(
                        f"CDTSM: Column '{col}' is not numerical and cannot be converted. "
                        f"Time series forecasting requires numerical data. Error: {str(e)}"
                    )

        if not present_columns:
            return

        metric_df = df[present_columns]
        non_null_any = metric_df.notna().any(axis=0)
        empty_columns = [col for col in present_columns if not bool(non_null_any[col])]
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

        inf_mask = np.isinf(metric_df.to_numpy(dtype=float, copy=False))
        if inf_mask.any():
            inf_columns = [
                col
                for col, has_inf in zip(present_columns, inf_mask.any(axis=0))
                if bool(has_inf)
            ]
            if len(inf_columns) == 1:
                raise RuntimeError(
                    f"CDTSM: Column '{inf_columns[0]}' contains infinite values. "
                    f"Please clean your data before forecasting."
                )
            raise RuntimeError(
                f"CDTSM: Columns {', '.join(inf_columns)} contain infinite values. "
                f"Please clean your data before forecasting."
            )

    def _apply_fill_null(self, df):
        """Apply the configured fill_null behavior to time-series columns."""
        fill_mode = getattr(self, "fill_null", DEFAULT_FILL_NULL)
        suppress_high_frequency_logs = getattr(
            self, "_cdtsm_suppress_high_frequency_logs", False
        )
        if fill_mode == FILL_NULL_INTERPOLATE:
            if not suppress_high_frequency_logs:
                logger.info(
                    "CDTSM: fill_null=interpolate - preserving null metric values for "
                    "context-level linear interpolation"
                )
            return df

        if fill_mode == FILL_NULL_FF:
            if not suppress_high_frequency_logs:
                logger.info("CDTSM: fill_null=forward_fill - applying forward fill")
            return self._apply_forward_fill(df)

        fill_value = getattr(self, "fill_null_value", None)
        if fill_value is None:
            raise RuntimeError(
                "CDTSM: internal error - fill_null numeric mode missing fill_null_value"
            )

        null_counts = {col: df[col].isna().sum() for col in self.columns if col in df.columns}
        if not any(count > 0 for count in null_counts.values()):
            return df

        df_filled = df.copy()
        for col in self.columns:
            null_count_before = null_counts.get(col, 0)
            if null_count_before > 0:
                if not suppress_high_frequency_logs:
                    logger.info(
                        "CDTSM: Column '%s' has %d null values (%.1f%%), filling with %s",
                        col,
                        null_count_before,
                        (null_count_before / len(df)) * 100,
                        fill_value,
                    )
                df_filled[col] = df_filled[col].fillna(float(fill_value))
        return df_filled

    def _apply_forward_fill(self, df):
        """Apply forward fill to impute null values in all time series columns.

        If nulls remain after forward fill (e.g., leading nulls), apply backward fill
        to impute them with the next available value.

        Args:
            df (pd.DataFrame): Input dataframe

        Returns:
            pd.DataFrame: Dataframe with nulls imputed
        """
        null_counts = {col: df[col].isna().sum() for col in self.columns if col in df.columns}
        if not any(count > 0 for count in null_counts.values()):
            return df

        suppress_high_frequency_logs = getattr(
            self, "_cdtsm_suppress_high_frequency_logs", False
        )
        df_filled = df.copy()

        for col in self.columns:
            null_count_before = null_counts.get(col, 0)

            if null_count_before > 0:
                if not suppress_high_frequency_logs:
                    logger.info(
                        "CDTSM: Column '%s' has %d null values (%.1f%%), applying forward fill",
                        col,
                        null_count_before,
                        (null_count_before / len(df)) * 100,
                    )

                df_filled[col] = df_filled[col].ffill()

                null_count_after = df_filled[col].isna().sum()

                if null_count_after > 0:
                    if not suppress_high_frequency_logs:
                        logger.info(
                            "CDTSM: Column '%s' has %d remaining null values after forward fill (likely leading nulls), applying backward fill",
                            col,
                            null_count_after,
                        )

                    df_filled[col] = df_filled[col].bfill()

                    null_count_final = df_filled[col].isna().sum()

                    if null_count_final > 0:
                        logger.warning(
                            "CDTSM: Column '%s' still has %d null values after both forward and backward fill (entire column may be null)",
                            col,
                            null_count_final,
                        )

        return df_filled

    def _validate_datapoint_count(self, df):
        """Validate that datapoint count meets minimum requirements.

        Args:
            df (pd.DataFrame): Input dataframe (should be sorted by time field)

        Returns:
            pd.DataFrame: Original dataframe (unchanged)

        Raises:
            RuntimeError: If datapoint count is below minimum
        """
        datapoint_count = len(df)

        if datapoint_count < MIN_INPUT_DATAPOINTS:
            raise RuntimeError(
                f"CDTSM: Too few input datapoints. "
                f"Minimum required: {MIN_INPUT_DATAPOINTS}, provided: {datapoint_count}. "
                f"Time series forecasting requires sufficient historical data. "
                f"Please expand the time range or reduce data filtering."
            )

        logger.info(
            "CDTSM: Validated datapoint count: %d (min required: %d)",
            datapoint_count,
            MIN_INPUT_DATAPOINTS,
        )

        return df

    def _validate_time_span(self, df):
        """DEPRECATED: Time span validation is no longer performed.

        Instead of validating time span and throwing errors, the algorithm now automatically
        caps training data to the most recent MAX_TRAINING_POINTS (31,232 points).

        This method is kept for backward compatibility but does nothing.

        Args:
            df (pd.DataFrame): Input dataframe with time field in seconds
        """
        logger.debug(
            "CDTSM: Time span validation skipped (deprecated - using automatic capping instead)"
        )
        return
