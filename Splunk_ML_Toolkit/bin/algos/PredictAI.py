#!/usr/bin/env python
"""
PredictAI Algorithm - CDTSM time series forecasting and anomaly detection.

This algorithm provides zero-shot time series forecasting by calling an AI prediction
service. It supports multiple time series columns, customizable quantiles, configurable
forecast horizons, and anomaly detection mode.

Method implementations are split across mixin classes in cdtsm_pkg/:
  ValidationMixin    (cdtsm_pkg.validation)    — data validation & time resolution repair
  ApiClientMixin     (cdtsm_pkg.api_client)    — API calls, batching, retry logic
  ContextMixin       (cdtsm_pkg.context)       — coarse/fine context building
  ForecastModeMixin  (cdtsm_pkg.forecast_mode) — payload building, forecast dataframe
  AnomalyModeMixin   (cdtsm_pkg.anomaly_mode)  — rolling forecast + anomaly postprocessing
  OutputUtilsMixin   (cdtsm_pkg.output_utils)  — finalize apply output timestamps (epoch → original)
Constants and time utilities live in cdtsm_pkg.constants and cdtsm_pkg.time_utils.
"""

import copy
import re
import json
import time
import requests
import pandas as pd
from pandas._libs.tslibs.parsing import DateParseError
import numpy as np
import math
from datetime import timedelta, datetime, timezone
from typing import List, Optional
from zoneinfo import ZoneInfo

import cexc
from base import BaseAlgo
from util.param_util import convert_params, parse_cdtsm_by_columns
from util.ai_commander_util import (
    get_cached_scs_token,
    get_scs_token_from_session,
    get_tentantinfo_from_session,
    get_timezone_from_current_context,
)
from util.telemetry_cdtsm_util import (
    log_cdtsm_apply,
    log_cdtsm_time_resolution,
    log_cdtsm_time_field_null,
    log_cdtsm_apply_details,
    log_cdtsm_apply_stats,
)
from util.ts_postprocessing.quantiles import mirror_quantile
from util.ctsm_conf_util import CTSMConfUtil

from cdtsm_pkg.constants import *  # noqa: F401, F403
from cdtsm_pkg.constants import (  # explicit: not exported by star-import
    CDTSM_INTERNAL_ROW_TZ_COLUMN,
    DEFAULT_FILL_NULL,
    DEFAULT_AD_QUANTILE_LEVEL,
    FILL_NULL_FF,
    FILL_NULL_INTERPOLATE,
    MIN_INPUT_DATAPOINTS,
    PARAM_AD_METHOD,
    SPL_METHOD_IQR_RESIDUAL,
    SPL_METHOD_QUANBIN,
    VALID_SPL_ANOMALY_METHODS,
    VALID_SPL_QUANTILE_LOWER,
    VALID_SPL_QUANTILE_UPPER,
    _TZ_COLON_RE,
    float_quantile_to_percentile_key,
)
from cdtsm_pkg.time_utils import (
    _normalize_for_roundtrip,
    _get_frac_sec_precision,
    _trim_frac_seconds,
    _normalize_timestamp_string_for_parse,
    _parse_iso8601_scalar_to_pd_timestamp,
    _parse_strftime_format_rowwise,
    _series_timestamps_to_epoch_seconds,
    parse_relative_or_absolute_time,
    _is_datetime_string,
    _extract_data_timezone,
    predominant_tzinfo_from_timestamp_series,
)
from cdtsm_pkg.validation import ValidationMixin
from cdtsm_pkg.api_client import ApiClientMixin
from cdtsm_pkg.context import ContextMixin
from cdtsm_pkg.forecast_mode import ForecastModeMixin
from cdtsm_pkg.anomaly_mode import AnomalyModeMixin
from cdtsm_pkg.output_utils import OutputUtilsMixin

logger = cexc.get_logger(__name__)
messages = cexc.get_messages_logger()

logger.info("CDTSM: module loaded")


class PredictAI(
    ValidationMixin,
    ApiClientMixin,
    ContextMixin,
    ForecastModeMixin,
    AnomalyModeMixin,
    OutputUtilsMixin,
    BaseAlgo,
):
    """
    PredictAI algorithm for zero-shot time series forecasting.

    This algorithm:
    - Validates time resolution (1-min or 5-min)
    - Handles null metric values using fill_null (interpolate by default)
    - Validates numerical columns
    - Calls AI prediction service
    - Returns forecasts with multiple quantiles
    """

    def _reset_cdtsm_apply_timings(self):
        self._cdtsm_apply_timings = {
            "materialization": 0.0,
            "preprocessing": 0.0,
            "api": 0.0,
            "postprocessing": 0.0,
            # Output assembly that happens after run_postprocessing returns:
            # final BY group collation, output dataframe construction, and the
            # ``_finalize_apply_output_timestamps`` formatting pass. Excluded
            # from ``postprocessing`` so the 5-phase summary in apply.py can
            # show "data prep for output" separately from the postprocessing
            # module's own runtime.
            "output_preparation": 0.0,
            # Processor-level work that wraps ``algo.apply`` but is invisible
            # to the algo's other phase timers. ``input_assembly`` is the
            # one-shot ``pd.concat`` of all input chunks plus
            # ``_validate_input_fields`` (whole-frame ``isna().all()`` per
            # metric / BY column). ``processor_teardown`` is the post-apply
            # ``gc.collect`` that reclaims intermediate frames. Both are
            # recorded by ``ApplyPredictAIProcessor`` after ``algo.apply``
            # returns (because ``apply`` resets timings on entry).
            "input_assembly": 0.0,
            "processor_teardown": 0.0,
        }

    def _record_cdtsm_apply_timing(self, phase, elapsed):
        try:
            if not hasattr(self, "_cdtsm_apply_timings"):
                self._reset_cdtsm_apply_timings()
            self._cdtsm_apply_timings[phase] = self._cdtsm_apply_timings.get(
                phase, 0.0
            ) + float(elapsed)
        except Exception:
            logger.debug("CDTSM: failed to record apply timing for phase=%r", phase)

    def get_cdtsm_apply_timing_summary(self):
        if not hasattr(self, "_cdtsm_apply_timings"):
            self._reset_cdtsm_apply_timings()
        return dict(self._cdtsm_apply_timings)

    def __init__(self, options):
        self._reset_cdtsm_apply_timings()
        _raw_params = options.get("params", {}) or {}
        params = convert_params(
            _raw_params,
            strs=PARAM_STRS,
            ints=PARAM_INTS,
            floats=PARAM_FLOATS,
            bools=PARAM_BOOLS,
        )
        unexpected_params = set(params.keys()) - EXPECTED_PARAMS
        if unexpected_params:
            raise RuntimeError(
                f"CDTSM: Unexpected parameter(s): {', '.join(sorted(unexpected_params))}. "
                f"Valid user parameters are: {', '.join(sorted(EXPECTED_PARAMS))}"
            )

        _raw_mode = params.get("mode", MODE_FORECAST)
        if isinstance(_raw_mode, str):
            _raw_mode = _raw_mode.strip().lower()
        self.mode = _raw_mode

        if self.mode not in VALID_MODES:
            raise RuntimeError(
                f"CDTSM: Invalid mode '{params.get('mode')}'. "
                f"Supported modes: '{MODE_FORECAST}', '{MODE_ANOMALY}'"
            )

        _param_keys = set(params.keys())
        if self.mode == MODE_ANOMALY:
            _bad_forecast = sorted(_param_keys & FORECAST_ONLY_PARAMS)
            if _bad_forecast:
                raise RuntimeError(
                    f"CDTSM anomaly_detection: invalid parameter(s) for anomaly detection mode: "
                    f"{', '.join(_bad_forecast)}. "
                    "These parameters apply only to forecast mode (remove them or use mode=forecast)."
                )
        elif self.mode == MODE_FORECAST:
            _bad_anomaly = sorted(_param_keys & ANOMALY_ONLY_PARAMS)
            if _bad_anomaly:
                raise RuntimeError(
                    f"CDTSM: invalid parameter(s) for forecast mode: {', '.join(_bad_anomaly)}. "
                    "These parameters apply only to anomaly mode "
                    f"(remove them or use mode={MODE_ANOMALY})."
                )

        self.model_name = params.get("model_name", DEFAULT_MODEL_NAME)
        self.api_model_name = self.model_name.upper()

        self.columns_str = params.get("fields_to_forecast")
        if not self.columns_str:
            raise RuntimeError("CDTSM: fields_to_forecast argument is required")

        self.columns = [col.strip() for col in self.columns_str.split(",") if col.strip()]
        if not self.columns:
            raise RuntimeError("CDTSM: fields_to_forecast parameter cannot be empty")

        self._use_wildcard = False
        if '*' in self.columns:
            _fields_label = (
                "fields_to_detect_anomaly"
                if self.mode == MODE_ANOMALY
                else "fields_to_forecast"
            )
            if self.mode == MODE_ANOMALY:
                _usage = (
                    f"Usage: | apply CDTSM <field1> <field2> ... mode={MODE_ANOMALY} "
                    "[time_field=_time] [context_length=...] [detection_length=...]"
                )
            else:
                _usage = "Usage: | apply CDTSM <field1> <field2> ... [time_field=_time] [forecast_k=10]"
            raise RuntimeError(
                f"CDTSM does not support wildcard '*' for {_fields_label}. "
                f"Please specify explicit field names. {_usage}"
            )

        self.time_field = params.get("time_field", "_time")

        if not self._use_wildcard and self.time_field in self.columns:
            if self.mode == MODE_ANOMALY:
                raise RuntimeError(
                    f"CDTSM: time_field '{self.time_field}' cannot be included in "
                    "fields_to_detect_anomaly. The time field is used for timestamps and should "
                    "not be listed with the metric column(s). Specify only the metric columns "
                    "to analyze (e.g., cpu, memory, disk_io)."
                )
            raise RuntimeError(
                f"CDTSM: time_field '{self.time_field}' cannot be included in fields_to_forecast. "
                f"The time field is used for timestamps and should not be forecasted. "
                f"fields_to_forecast should only contain the time series columns to forecast "
                f"(e.g., cpu, memory, disk_io)."
            )
        self.show_input = params.get("show_input", True)

        raw_by = (params.get("by") or "").strip()
        by_parts = parse_cdtsm_by_columns(raw_by) if raw_by else []
        if by_parts:
            seen_lower = set()
            for p in by_parts:
                pl = p.lower()
                if pl in seen_lower:
                    raise RuntimeError(
                        f"CDTSM: duplicate BY column '{p}' (comparison is case-insensitive)."
                    )
                seen_lower.add(pl)
            self.forecast_by_columns = by_parts
            self.forecast_by = ", ".join(by_parts)
        else:
            self.forecast_by_columns = None
            self.forecast_by = None

        raw_fill_null = params.get("fill_null", DEFAULT_FILL_NULL)
        raw_fill_null_str = str(raw_fill_null).strip()
        raw_fill_null_normalized = raw_fill_null_str.lower()
        self.fill_null = raw_fill_null_normalized
        self.fill_null_value = None
        if raw_fill_null_normalized in (FILL_NULL_FF, FILL_NULL_INTERPOLATE):
            pass
        else:
            try:
                self.fill_null_value = float(raw_fill_null_str)
            except (TypeError, ValueError):
                raise RuntimeError(
                    "CDTSM: fill_null must be one of 'forward_fill', 'interpolate', "
                    f"or a float value. Provided: {raw_fill_null!r}"
                )
            if not math.isfinite(self.fill_null_value):
                raise RuntimeError(
                    "CDTSM: fill_null numeric value must be finite. "
                    f"Provided: {raw_fill_null!r}"
                )
            self.fill_null = "value"

        if self.forecast_by_columns:
            for by_col in self.forecast_by_columns:
                if by_col == self.time_field:
                    raise RuntimeError(
                        f"CDTSM: BY grouping column '{by_col}' cannot be the same as time_field "
                        f"('{self.time_field}'). Choose a different grouping field."
                    )
                if by_col in self.columns:
                    _fields_label = (
                        "fields_to_detect_anomaly"
                        if self.mode == MODE_ANOMALY
                        else "fields_to_forecast"
                    )
                    raise RuntimeError(
                        f"CDTSM: BY grouping column '{by_col}' cannot appear in {_fields_label}. "
                        f"Use categorical column(s) that are not forecasted or analyzed metrics."
                    )
            logger.info(
                "CDTSM: Per-group %s enabled (BY %s)",
                "anomaly_detection" if self.mode == MODE_ANOMALY else "forecasting",
                self.forecast_by,
            )

        if self.mode == MODE_FORECAST:
            forecast_k_provided = "forecast_k" in params
            holdback_provided = "holdback" in params

            # forecast_k is the TOTAL number of forecast points (including holdback)
            # holdback specifies how many of those forecast_k points are holdback validation points
            # future_points = forecast_k - holdback (new forecast points beyond the input data)
            self.horizon = params.get("forecast_k", 128)
            self.holdback = params.get("holdback", 0)

            if self.horizon == 0:
                raise RuntimeError(
                    "CDTSM: forecast_k cannot be 0. "
                    "Please specify a positive value for forecast_k."
                )

            if self.horizon < 0:
                raise RuntimeError(
                    f"CDTSM: forecast_k cannot be negative. Provided: {self.horizon}"
                )
            if self.holdback < 0:
                raise RuntimeError(
                    f"CDTSM: holdback cannot be negative. Provided: {self.holdback}"
                )

            if self.holdback > self.horizon:
                raise RuntimeError(
                    f"CDTSM: holdback ({self.holdback}) cannot exceed forecast_k ({self.horizon}). "
                    f"holdback specifies how many of the forecast_k points are used for holdback validation. "
                )

            self.future_points = self.horizon - self.holdback

            if holdback_provided and forecast_k_provided:
                logger.info(
                    "CDTSM: forecast_k:%d total points (holdback:%d validation + %d future forecasts)",
                    self.horizon,
                    self.holdback,
                    self.future_points,
                )
            elif holdback_provided:
                logger.info(
                    "CDTSM: Holdback specified (holdback:%d), using default forecast_k:%d - "
                    "total %d points (%d holdback + %d future)",
                    self.holdback,
                    self.horizon,
                    self.horizon,
                    self.holdback,
                    self.future_points,
                )
            elif forecast_k_provided:
                logger.info(
                    "CDTSM: forecast_k specified (forecast_k:%d), using default holdback:%d - "
                    "all %d points are future forecasts",
                    self.horizon,
                    self.holdback,
                    self.future_points,
                )
            else:
                logger.info(
                    "CDTSM: Using default values - forecast_k:%d, holdback:%d - "
                    "all %d points are future forecasts",
                    self.horizon,
                    self.holdback,
                    self.future_points,
                )

            quantiles_str = params.get("quantiles", PERCENTILE_MEAN)
            self.user_percentiles = [
                p.strip().lower() for p in quantiles_str.split(",") if p.strip()
            ]
            if PERCENTILE_MEAN not in self.user_percentiles:
                self.user_percentiles.insert(0, PERCENTILE_MEAN)

            invalid_percentiles = set(self.user_percentiles) - VALID_PERCENTILES
            if invalid_percentiles:
                raise RuntimeError(
                    f"CDTSM: Invalid quantiles: {', '.join(invalid_percentiles)}. "
                    f"Valid values are: {', '.join(sorted(VALID_PERCENTILES))}"
                )

            self.conf_interval = params.get("conf_interval", 90)
            self.conf_alpha = None
            self.conf_lower_quantile = None
            self.conf_upper_quantile = None

            if self.conf_interval is not None:
                try:
                    conf_interval_value = int(self.conf_interval)
                except (ValueError, TypeError):
                    raise RuntimeError(
                        f"CDTSM: conf_interval must be an integer. Provided: {self.conf_interval} (type: {type(self.conf_interval).__name__})"
                    )

                if (
                    isinstance(self.conf_interval, float)
                    and self.conf_interval != conf_interval_value
                ):
                    raise RuntimeError(
                        f"CDTSM: conf_interval must be an integer without decimal places. Provided: {self.conf_interval}"
                    )

                self.conf_interval = conf_interval_value

                if self.conf_interval not in VALID_CONF_INTERVALS:
                    valid_values_str = ", ".join(str(v) for v in sorted(VALID_CONF_INTERVALS))
                    raise RuntimeError(
                        f"CDTSM: Invalid conf_interval value: {self.conf_interval}. "
                        f"Valid conf_interval values are: {valid_values_str}."
                    )

            if self.conf_interval is not None and self.conf_interval > 0:
                self.conf_alpha = 1 - (self.conf_interval / 100.0)
                lower_quantile_value, upper_quantile_value = CONF_INTERVAL_TO_QUANTILES[
                    self.conf_interval
                ]
                self.conf_lower_quantile = float_quantile_to_percentile_key(
                    lower_quantile_value
                )
                self.conf_upper_quantile = float_quantile_to_percentile_key(
                    upper_quantile_value
                )

                logger.info(
                    "CDTSM: Confidence interval %d%% (alpha:%.2f) -> lower quantile: %s (%.2f), upper quantile: %s (%.2f)",
                    self.conf_interval,
                    self.conf_alpha,
                    self.conf_lower_quantile,
                    lower_quantile_value,
                    self.conf_upper_quantile,
                    upper_quantile_value,
                )

            self.percentiles = list(self.user_percentiles)
            if self.conf_lower_quantile and self.conf_lower_quantile not in self.percentiles:
                self.percentiles.append(self.conf_lower_quantile)
            if self.conf_upper_quantile and self.conf_upper_quantile not in self.percentiles:
                self.percentiles.append(self.conf_upper_quantile)

            # User quantiles get p-format columns; confidence intervals get lower/upper format
            self.output_user_quantiles = list(self.user_percentiles)
            self.output_conf_quantiles = []
            if self.conf_lower_quantile:
                self.output_conf_quantiles.append((self.conf_lower_quantile, 'lower'))
            if self.conf_upper_quantile:
                self.output_conf_quantiles.append((self.conf_upper_quantile, 'upper'))

            logger.info("CDTSM: Quantiles to request from API: %s", ", ".join(self.percentiles))
            logger.info(
                "CDTSM: User quantiles for output (p-format): %s",
                ", ".join(self.output_user_quantiles),
            )
            if self.output_conf_quantiles:
                conf_display = [f"{t}={q}" for q, t in self.output_conf_quantiles]
                logger.info(
                    "CDTSM: Confidence interval quantiles for output (lower/upper format): %s",
                    ", ".join(conf_display),
                )

            total_forecast_points = self.horizon

            # API limit is 128 for quantiles
            if total_forecast_points > MAX_QUANTILE_HORIZON:
                messages.warn(
                    "Confidence intervals and quantiles are only produced for the first 128 predicted data points."
                )
                logger.info(
                    "CDTSM: Total forecast points (%d) exceeds quantile limit (%d) - "
                    "quantiles will only be available for first %d points",
                    total_forecast_points,
                    MAX_QUANTILE_HORIZON,
                    MAX_QUANTILE_HORIZON,
                )

            if total_forecast_points > NATIVE_FORECAST_HORIZON:
                messages.warn(
                    "Accuracy of predictions will decline with extended forecast horizons. "
                    "The model natively forecasts 128 points. "
                    "We recommend validating the accuracy of forecasts longer than 384 points."
                )
                logger.info(
                    "CDTSM: Total forecast points (%d) exceeds native model horizon (%d) - "
                    "prediction accuracy may decline for extended forecasts",
                    total_forecast_points,
                    NATIVE_FORECAST_HORIZON,
                )

        else:
            # Anomaly mode: forecast-only parameters are rejected above; placeholders for telemetry.
            self.horizon = 128
            self.holdback = 0
            self.future_points = 128
            self.user_percentiles = [PERCENTILE_MEAN]
            self.conf_interval = None
            self.conf_alpha = None
            self.conf_lower_quantile = None
            self.conf_upper_quantile = None
            self.percentiles = [PERCENTILE_MEAN]
            self.output_user_quantiles = [PERCENTILE_MEAN]
            self.output_conf_quantiles = []

        self.ts_batch_size = DEFAULT_TS_BATCH_SIZE

        self.feature_variables = options.get("feature_variables", [])
        self.target_variable = options.get("target_variable", [])
        self.algo_name = options.get("algo_name", self.__class__.__name__)
        self._searchinfo = None

        self._original_time_dtype = None
        self._time_was_string = False
        self._time_was_datetime64 = False
        self._original_time_sample = None
        self._detected_time_format = None
        self._is_unix_timestamp = False
        self._epoch_unit = 's'
        self._frac_sec_precision = 6
        self._data_tz = None
        self._predominant_data_tz = None
        self._original_time_tz_offset_has_colon = False

        self._holdback_df = None

        self._time_resolution_seconds = None
        self._time_series_was_repaired = False

        if self.mode == MODE_ANOMALY:
            _spl_method = str(params.get(PARAM_AD_METHOD, SPL_METHOD_QUANBIN)).strip().lower()
            if _spl_method not in VALID_SPL_ANOMALY_METHODS:
                raise RuntimeError(
                    f"CDTSM anomaly_detection: Invalid method '{params.get(PARAM_AD_METHOD)}'. "
                    f"Supported: {', '.join(repr(m) for m in VALID_SPL_ANOMALY_METHODS)}"
                )
            # SPL `iqr_residual` maps to postprocessing pointwise_method `residual`.
            if _spl_method == SPL_METHOD_IQR_RESIDUAL:
                self._ad_method = AD_METHOD_RESIDUAL
            else:
                self._ad_method = AD_METHOD_QUANBIN
            self._ad_spl_method = _spl_method
            self._ad_window_earliest = params.get("detection_window_earliest", None)
            self._ad_window_latest = params.get("detection_window_latest", None)
            self._ad_context_window_earliest = params.get("context_window_earliest", None)
            self._ad_context_window_latest = params.get("context_window_latest", None)
            self._ad_context_length_effective = None

            has_context_time_window = (
                self._ad_context_window_earliest is not None
                or self._ad_context_window_latest is not None
            )

            if has_context_time_window:
                if params.get("context_length") is not None:
                    raise RuntimeError(
                        "CDTSM anomaly_detection: 'context_length' cannot be used with "
                        "'context_window_earliest' or 'context_window_latest'."
                    )

                cwe = self._ad_context_window_earliest
                cwl = self._ad_context_window_latest
                dwe = self._ad_window_earliest
                dwl = self._ad_window_latest
                dl_raw = params.get("detection_length")

                if cwe is not None and cwl is not None:
                    if dwe is not None:
                        raise RuntimeError(
                            "CDTSM anomaly_detection: when both 'context_window_earliest' and "
                            "'context_window_latest' are set, do not use "
                            "'detection_window_earliest'. Specify detection with exactly one of "
                            "'detection_length' or 'detection_window_latest'."
                        )
                    if (dl_raw is not None) == (dwl is not None):
                        raise RuntimeError(
                            "CDTSM anomaly_detection: when both 'context_window_earliest' and "
                            "'context_window_latest' are set, provide exactly one of "
                            "'detection_length' or 'detection_window_latest' (not both, not "
                            "neither)."
                        )
                    self._ad_context_length = None
                    self._ad_detection_length = dl_raw
                    if dl_raw is not None:
                        self._ad_window_latest = None
                elif cwl is not None:
                    if dwe is not None:
                        raise RuntimeError(
                            "CDTSM anomaly_detection: 'context_window_latest' without "
                            "'context_window_earliest' cannot be combined with "
                            "'detection_window_earliest'."
                        )
                    if (dl_raw is not None) == (dwl is not None):
                        raise RuntimeError(
                            "CDTSM anomaly_detection: when using 'context_window_latest' alone, "
                            "provide exactly one of 'detection_length' or "
                            "'detection_window_latest' (not both, not neither)."
                        )
                    self._ad_context_length = None
                    self._ad_detection_length = dl_raw
                    if dl_raw is not None:
                        self._ad_window_latest = None
                else:
                    # context_window_earliest only (no context_window_latest)
                    if dwe is None:
                        raise RuntimeError(
                            "CDTSM anomaly_detection: 'context_window_earliest' without "
                            "'context_window_latest' requires 'detection_window_earliest'."
                        )
                    if (dl_raw is not None) and (dwl is not None):
                        raise RuntimeError(
                            "CDTSM anomaly_detection: when using 'context_window_earliest' alone, "
                            "use at most one of 'detection_length' or 'detection_window_latest'."
                        )
                    self._ad_context_length = None
                    self._ad_detection_length = dl_raw

            elif (
                self._ad_window_earliest is not None
                and params.get("context_length") is not None
            ):
                raise RuntimeError(
                    "CDTSM anomaly_detection: 'detection_window_earliest' cannot be used "
                    "together with 'context_length'. Use detection_window_earliest with "
                    "optional detection_window_latest (omit context_length), or use "
                    "context_length with detection_window_latest only"
                )

            elif self._ad_window_latest is not None and self._ad_window_earliest is None:
                if params.get("context_length") is None:
                    raise RuntimeError(
                        "CDTSM anomaly_detection: 'detection_window_latest' without "
                        "'detection_window_earliest' requires 'context_length' "
                        "(rows before the detection tail are reserved for context)."
                    )

            if not has_context_time_window:
                has_window_param = (
                    self._ad_window_earliest is not None or self._ad_window_latest is not None
                )

                if has_window_param:
                    if self._ad_window_earliest is not None:
                        self._ad_context_length = None
                    else:
                        # Latest-only window: context_length required (validated above).
                        self._ad_context_length = params.get("context_length")
                        if self._ad_context_length < MIN_INPUT_DATAPOINTS:
                            raise RuntimeError(
                                f"CDTSM anomaly_detection: context_length must be at least "
                                f"{MIN_INPUT_DATAPOINTS} (got {self._ad_context_length}). "
                                f"Block size for coarse context adapts when the series is shorter."
                            )
                    self._ad_detection_length = None
                    if params.get("detection_length") is not None:
                        raise RuntimeError(
                            "CDTSM anomaly_detection: 'detection_length' cannot be used "
                            "together with 'detection_window_earliest' or "
                            "'detection_window_latest'. Use one approach or the other."
                        )
                else:
                    self._ad_context_length = params.get(
                        "context_length", DEFAULT_CONTEXT_LENGTH
                    )
                    self._ad_detection_length = params.get(
                        "detection_length", DEFAULT_DETECTION_LENGTH
                    )
                    if self._ad_context_length < MIN_INPUT_DATAPOINTS:
                        raise RuntimeError(
                            f"CDTSM anomaly_detection: context_length must be at least "
                            f"{MIN_INPUT_DATAPOINTS} (got {self._ad_context_length}). "
                            f"Block size for coarse context adapts when the series is shorter."
                        )

            # Stride must be 1..MAX_AD_STRIDE (128) when set in SPL. When omitted, default follows
            # detection_length (capped at MAX_AD_STRIDE) or DEFAULT_STRIDE.
            if "stride" in params:
                _stride_int = params["stride"]
                if _stride_int < 1 or _stride_int > MAX_AD_STRIDE:
                    raise RuntimeError(
                        f"CDTSM anomaly_detection: stride must be from 1 to {MAX_AD_STRIDE} "
                        f"(got {_stride_int})."
                    )
                self._ad_stride = _stride_int
            else:
                _base = (
                    self._ad_detection_length
                    if self._ad_detection_length is not None
                    else DEFAULT_STRIDE
                )
                try:
                    _stride_int = int(_base)
                except (TypeError, ValueError):
                    _stride_int = DEFAULT_STRIDE
                self._ad_stride = min(max(1, _stride_int), MAX_AD_STRIDE)

            if self._ad_method != AD_METHOD_QUANBIN:
                for p in ("quantile", "quantile_lower", "quantile_upper"):
                    if params.get(p) is not None:
                        raise RuntimeError(
                            f"CDTSM anomaly_detection: parameter '{p}' is only valid "
                            f"for method='{SPL_METHOD_QUANBIN}', but "
                            f"method='{SPL_METHOD_IQR_RESIDUAL}'."
                        )

            if self._ad_method == AD_METHOD_QUANBIN:
                _q = params.get("quantile")
                _ql = params.get("quantile_lower")
                _qu = params.get("quantile_upper")

                if _q is not None and (_ql is not None or _qu is not None):
                    raise RuntimeError(
                        "CDTSM anomaly_detection: 'quantile' cannot be used "
                        "together with 'quantile_lower' or 'quantile_upper'. "
                        "Use either 'quantile' alone, or "
                        "'quantile_lower'/'quantile_upper'."
                    )

                if _q is not None:
                    _qu = _q
                    _ql = None

                _has_ql = _ql is not None
                _has_qu = _qu is not None
                if _has_ql and _has_qu:
                    q_lo = float(_ql)
                    q_hi = float(_qu)
                    if q_lo not in VALID_SPL_QUANTILE_LOWER:
                        raise RuntimeError(
                            "CDTSM anomaly_detection: quantile_lower must be one of "
                            f"{', '.join(str(q) for q in VALID_SPL_QUANTILE_LOWER)}. "
                            f"Got {q_lo}."
                        )
                    if q_hi not in VALID_SPL_QUANTILE_UPPER:
                        raise RuntimeError(
                            "CDTSM anomaly_detection: quantile_upper must be one of "
                            f"{', '.join(str(q) for q in VALID_SPL_QUANTILE_UPPER)}. "
                            f"Got {q_hi}."
                        )
                elif _has_ql:
                    q_lo = float(_ql)
                    if q_lo not in VALID_SPL_QUANTILE_LOWER:
                        raise RuntimeError(
                            "CDTSM anomaly_detection: quantile_lower must be one of "
                            f"{', '.join(str(q) for q in VALID_SPL_QUANTILE_LOWER)}. "
                            f"Got {q_lo}."
                        )
                    q_hi = mirror_quantile(q_lo)
                    if q_hi not in VALID_SPL_QUANTILE_UPPER:
                        raise RuntimeError(
                            "CDTSM anomaly_detection: implied quantile_upper "
                            f"{q_hi} is not a supported upper quantile."
                        )
                elif _has_qu:
                    q_hi = float(_qu)
                    if q_hi not in VALID_SPL_QUANTILE_UPPER:
                        raise RuntimeError(
                            "CDTSM anomaly_detection: quantile_upper must be one of "
                            f"{', '.join(str(q) for q in VALID_SPL_QUANTILE_UPPER)}. "
                            f"Got {q_hi}."
                        )
                    q_lo = mirror_quantile(q_hi)
                    if q_lo not in VALID_SPL_QUANTILE_LOWER:
                        raise RuntimeError(
                            "CDTSM anomaly_detection: implied quantile_lower "
                            f"{q_lo} is not a supported lower quantile."
                        )
                else:
                    q_lo = float(DEFAULT_AD_QUANTILE_LEVEL)
                    q_hi = mirror_quantile(q_lo)

                self._ad_quantile_level = q_lo
                self._ad_quantile_lower = q_lo
                self._ad_quantile_upper = q_hi
                self._ad_multiplier = params.get("multiplier", DEFAULT_AD_MULTIPLIER)
                if self._ad_multiplier <= 0:
                    raise RuntimeError(
                        f"CDTSM anomaly_detection: multiplier must be positive. "
                        f"Got {self._ad_multiplier}."
                    )
                _valid_directions = VALID_AD_THRESHOLD_DIRECTIONS
                self._ad_threshold_direction = params.get(
                    "threshold_direction", AD_THRESHOLD_BOTH
                )
                if self._ad_threshold_direction not in _valid_directions:
                    raise RuntimeError(
                        f"CDTSM anomaly_detection: Invalid threshold_direction "
                        f"'{self._ad_threshold_direction}'. "
                        f"Supported: {', '.join(_valid_directions)}."
                    )
                self._ad_threshold = None
            else:
                # AD_METHOD_RESIDUAL (SPL: iqr_residual)
                self._ad_quantile_level = None
                self._ad_quantile_lower = None
                self._ad_quantile_upper = None
                self._ad_multiplier = None
                self._ad_threshold = params.get("multiplier", DEFAULT_AD_THRESHOLD)
                self._ad_threshold_direction = params.get(
                    "threshold_direction", AD_THRESHOLD_BOTH
                )
                if self._ad_threshold_direction not in VALID_AD_THRESHOLD_DIRECTIONS:
                    raise RuntimeError(
                        f"CDTSM anomaly_detection: Invalid threshold_direction "
                        f"'{self._ad_threshold_direction}'. "
                        f"Supported: {', '.join(VALID_AD_THRESHOLD_DIRECTIONS)}."
                    )

            # Logic segmentation only (segment_method is not SPL-configurable).
            self._ad_segment_method = AD_SEGMENT_LOGIC
            on_span = int(params.get("on_span", DEFAULT_ON_SPAN))
            off_span = int(params.get("off_span", DEFAULT_OFF_SPAN))
            on_ratio = float(params.get("on_ratio", DEFAULT_ON_RATIO))
            off_ratio = float(params.get("off_ratio", DEFAULT_OFF_RATIO))
            if on_span <= 0 or off_span <= 0:
                raise RuntimeError(
                    "CDTSM anomaly_detection: on_span and off_span must be positive integers."
                )
            if not (0.0 <= on_ratio <= 1.0 and 0.0 <= off_ratio <= 1.0):
                raise RuntimeError(
                    "CDTSM anomaly_detection: on_ratio and off_ratio must be within [0, 1]."
                )
            self._ad_segment_params = {
                "on_span": on_span,
                "on_ratio": on_ratio,
                "off_span": off_span,
                "off_ratio": off_ratio,
            }

            ci_band_raw = params.get("conf_interval", str(DEFAULT_AD_CONF_INTERVAL))
            ci_band_values = []
            for token in str(ci_band_raw).split(","):
                token = token.strip()
                if not token:
                    continue
                try:
                    ci_val = int(token)
                except ValueError:
                    raise RuntimeError(
                        f"CDTSM anomaly_detection: conf_interval values must be integers. "
                        f"Got '{token}'."
                    )
                if ci_val not in VALID_CONF_INTERVALS:
                    valid_str = ", ".join(str(v) for v in sorted(VALID_CONF_INTERVALS))
                    raise RuntimeError(
                        f"CDTSM anomaly_detection: Unsupported conf_interval value {ci_val}. "
                        f"Supported values: {valid_str}."
                    )
                if ci_val not in ci_band_values:
                    ci_band_values.append(ci_val)
            if not ci_band_values:
                ci_band_values = [DEFAULT_AD_CONF_INTERVAL]
            self._ad_ci_bands = ci_band_values

            if self._ad_method == AD_METHOD_QUANBIN:
                lower_p = float_quantile_to_percentile_key(self._ad_quantile_lower)
                upper_p = float_quantile_to_percentile_key(self._ad_quantile_upper)
                for p in [lower_p, upper_p]:
                    if p not in self.user_percentiles:
                        self.user_percentiles.append(p)
                if self._ad_multiplier != 1.0 and "p50" not in self.user_percentiles:
                    self.user_percentiles.append("p50")
            else:
                for p in IQR_REQUIRED_QUANTILES:
                    if p not in self.user_percentiles:
                        self.user_percentiles.append(p)

            for ci_val in self._ad_ci_bands:
                lower_q, upper_q = CONF_INTERVAL_TO_QUANTILES[ci_val]
                lower_p = float_quantile_to_percentile_key(lower_q)
                upper_p = float_quantile_to_percentile_key(upper_q)
                for p in [lower_p, upper_p]:
                    if p not in self.user_percentiles:
                        self.user_percentiles.append(p)

            self.percentiles = list(self.user_percentiles)
            if self.conf_lower_quantile and self.conf_lower_quantile not in self.percentiles:
                self.percentiles.append(self.conf_lower_quantile)
            if self.conf_upper_quantile and self.conf_upper_quantile not in self.percentiles:
                self.percentiles.append(self.conf_upper_quantile)

            segp = self._ad_segment_params
            logger.info(
                "CDTSM anomaly_detection: spl_method=%s, internal_method=%s, context_length=%s, "
                "detection_length=%s, context_window_earliest=%s, context_window_latest=%s, "
                "window_earliest=%s, window_latest=%s, stride=%d, "
                "segment_type=%s (fixed), on_span=%s, on_ratio=%s, off_span=%s, off_ratio=%s",
                self._ad_spl_method,
                self._ad_method,
                self._ad_context_length,
                self._ad_detection_length,
                getattr(self, "_ad_context_window_earliest", None),
                getattr(self, "_ad_context_window_latest", None),
                self._ad_window_earliest,
                self._ad_window_latest,
                self._ad_stride,
                self._ad_segment_method,
                segp["on_span"],
                segp["on_ratio"],
                segp["off_span"],
                segp["off_ratio"],
            )

        self._scs_token = None
        self._scs_token_expiry = None

        conf_interval_info = (
            f"{self.conf_interval}% (alpha={self.conf_alpha:g}, lower={self.conf_lower_quantile}, upper={self.conf_upper_quantile})"
            if self.conf_interval
            else "None"
        )
        fields_info = "*" if self._use_wildcard else self.columns
        logger.info(
            "PredictAI initialized: model:%s, fields_to_forecast:%s, forecast_k:%d, quantiles:%s, conf_interval:%s, holdback:%s, show_input:%s",
            self.model_name,
            fields_info,
            self.horizon,
            self.user_percentiles,
            conf_interval_info,
            self.holdback if self.holdback > 0 else 0,
            self.show_input,
        )

        # Deep copy for safe per-group ``PredictAI`` clones in anomaly ``forecast_by`` parallel runs.
        self._cdtsm_init_options_snapshot = copy.deepcopy(options)

    def set_searchinfo(self, searchinfo):
        """Set searchinfo for accessing Splunk services."""
        self._searchinfo = searchinfo
        if isinstance(searchinfo, dict):
            logger.info("CDTSM.set_searchinfo: app:%s", searchinfo.get("app"))

    def _get_splunk_user_timezone_name(self) -> Optional[str]:
        """Return the search user's IANA timezone from Splunk REST ``tz`` in current-context.

        Uses :func:`~util.ai_commander_util.get_timezone_from_current_context`.
        Cached per algorithm instance. Returns ``None`` if unavailable or no ``tz``.
        """
        if hasattr(self, "_cached_splunk_user_tz_name"):
            return self._cached_splunk_user_tz_name

        self._cached_splunk_user_tz_name = None
        if not self._searchinfo:
            return None

        try:
            tz_val = get_timezone_from_current_context(self._searchinfo)
            if isinstance(tz_val, str) and tz_val.strip():
                self._cached_splunk_user_tz_name = tz_val.strip()
                logger.info(
                    "CDTSM: Splunk user timezone from current-context (IANA): %s",
                    self._cached_splunk_user_tz_name,
                )
            return self._cached_splunk_user_tz_name
        except Exception as e:
            logger.warning(
                "CDTSM: Could not read tz from authentication/current-context: %s",
                str(e),
            )
            return None

    def _get_splunk_ui_tzinfo(self):
        """tzinfo for naive ``detection_window_*`` strings when Splunk ``_time`` UI applies.

        Prefer the user's IANA ``tz`` from ``/services/authentication/current-context``
        (DST-aware). If missing or invalid, use the Python process local zone via
        :meth:`datetime.datetime.astimezone` (no SPL search).

        Always returns a tzinfo (UTC only if no local tzinfo is available).
        """
        if hasattr(self, "_cached_splunk_ui_tzinfo"):
            return self._cached_splunk_ui_tzinfo

        tz_name = self._get_splunk_user_timezone_name()
        if tz_name:
            try:
                zi = ZoneInfo(tz_name)
                self._cached_splunk_ui_tzinfo = zi
                return zi
            except Exception as e:
                logger.warning(
                    "CDTSM: Invalid Splunk user tz %r (%s); trying process local timezone",
                    tz_name,
                    str(e),
                )

        local_tz = datetime.now().astimezone().tzinfo
        if local_tz is not None:
            logger.info(
                "CDTSM: Using process local timezone for naive detection_window times "
                "(no usable tz in current-context): %s",
                local_tz,
            )
            self._cached_splunk_ui_tzinfo = local_tz
            return self._cached_splunk_ui_tzinfo

        logger.info(
            "CDTSM: Using UTC for naive detection_window times "
            "(no tz in current-context and no local tzinfo)."
        )
        self._cached_splunk_ui_tzinfo = timezone.utc
        return self._cached_splunk_ui_tzinfo

    def _naive_wall_tzinfo_for_detection_window(self):
        """tzinfo for naive window strings when the column has no data-side zone.

        If the series already yielded *predominant_data_tz* or a *fallback* from
        ``%z`` in the detected format, return ``None`` so
        :func:`~cdtsm_pkg.time_utils.parse_detection_window_time` localizes
        naive params with the **same** offsets as the data (not Splunk user TZ,
        which can be UTC and would shift wall clocks by several hours).

        Splunk UI tz applies only for pure-epoch ``_time`` or tz-naive string
        ``_time`` (no offset in the raw field).
        """
        if self.time_field != "_time":
            return None
        predominant = getattr(self, "_predominant_data_tz", None)
        detected_fmt = getattr(self, "_detected_time_format", None)
        original_sample = getattr(self, "_original_time_sample", None)
        fallback = _extract_data_timezone(detected_fmt, original_sample)
        if predominant is not None or fallback is not None:
            return None

        is_unix = getattr(self, "_is_unix_timestamp", False)
        has_z_in_fmt = bool(detected_fmt and "%z" in detected_fmt)
        if is_unix or not has_z_in_fmt:
            return self._get_splunk_ui_tzinfo()
        return None

    def _validate_detection_window_value_for_custom_time_field(self, value, param_label):
        """Reject datetime strings when ``time_field`` is not ``_time`` but is epoch-like."""
        if value is None or self.time_field == "_time":
            return
        if not getattr(self, "_is_unix_timestamp", False):
            return
        if _is_datetime_string(value):
            raise RuntimeError(
                f"CDTSM anomaly_detection: {param_label} cannot be a datetime string "
                f"when time_field is '{self.time_field}' (epoch-like column). "
                "Pass a Unix epoch value or a Splunk relative time (e.g. -3h)."
            )

    def _detect_timestamp_format(self, time_col):
        """Detect timestamp format from time column data.

        For numeric columns, validates that values fall within a plausible epoch
        range and detects the unit (seconds / milliseconds / microseconds /
        nanoseconds) – sets ``self._epoch_unit`` accordingly.

        For string/object columns, first checks whether the strings are numeric
        epoch values (e.g. ``"1616000000"``).  If not, tries to match against
        ``PREDEFINED_DATETIME_FORMATS`` via ``pd.to_datetime()``.

        Args:
            time_col (pd.Series): Time column from dataframe

        Returns:
            tuple: (format_string or None, is_unix_timestamp)
                - format_string: strftime format if string timestamps detected
                - is_unix_timestamp: True if Unix timestamp detected

        Side-effects:
            Sets ``self._epoch_unit`` when a Unix-epoch column is detected.
        """
        samples = []
        for val in time_col:
            if pd.notna(val):
                samples.append(val)
                if len(samples) >= 5:  # Test with first 5 non-null values
                    break

        if not samples:
            logger.warning("CDTSM: No non-null values found in time column")
            return None, False

        if pd.api.types.is_numeric_dtype(time_col):
            suppress_hf_logs = getattr(self, "_cdtsm_suppress_high_frequency_logs", False)
            sample_values = [float(v) for v in samples]
            abs_median = abs(sorted(sample_values)[len(sample_values) // 2])

            if abs_median < 1e10:
                self._epoch_unit = 's'
                if not suppress_hf_logs:
                    logger.info(
                        "CDTSM: Detected Unix timestamp in seconds (numeric, median=%.1f)",
                        abs_median,
                    )
                return None, True
            elif abs_median < 1e13:
                self._epoch_unit = 'ms'
                if not suppress_hf_logs:
                    logger.info(
                        "CDTSM: Detected Unix timestamp in milliseconds (numeric, median=%.1f)",
                        abs_median,
                    )
                return None, True
            elif abs_median < 1e16:
                self._epoch_unit = 'us'
                if not suppress_hf_logs:
                    logger.info(
                        "CDTSM: Detected Unix timestamp in microseconds (numeric, median=%.1f)",
                        abs_median,
                    )
                return None, True
            elif abs_median < 1e19:
                self._epoch_unit = 'ns'
                if not suppress_hf_logs:
                    logger.info(
                        "CDTSM: Detected Unix timestamp in nanoseconds (numeric, median=%.1f)",
                        abs_median,
                    )
                return None, True
            else:
                logger.warning(
                    "CDTSM: Numeric time column values (median=%.1f) are outside any "
                    "plausible epoch range – not treating as Unix timestamp",
                    abs_median,
                )
                return None, False

        if pd.api.types.is_datetime64_any_dtype(time_col):
            if not getattr(self, "_cdtsm_suppress_high_frequency_logs", False):
                logger.info("CDTSM: Time column is already datetime type")
            return None, False

        if time_col.dtype == object:
            suppress_hf_logs = getattr(self, "_cdtsm_suppress_high_frequency_logs", False)
            sample_strs = [str(s) for s in samples]
            if all(s.replace('.', '', 1).lstrip('-').isdigit() for s in sample_strs):
                try:
                    numeric_samples = [float(s) for s in sample_strs]
                    abs_median = abs(sorted(numeric_samples)[len(numeric_samples) // 2])

                    if abs_median < 1e10:
                        self._epoch_unit = 's'
                        if not suppress_hf_logs:
                            logger.info(
                                "CDTSM: Detected string-encoded Unix timestamp in seconds (median=%.1f)",
                                abs_median,
                            )
                        return None, True
                    elif abs_median < 1e13:
                        self._epoch_unit = 'ms'
                        if not suppress_hf_logs:
                            logger.info(
                                "CDTSM: Detected string-encoded Unix timestamp in milliseconds (median=%.1f)",
                                abs_median,
                            )
                        return None, True
                    elif abs_median < 1e16:
                        self._epoch_unit = 'us'
                        if not suppress_hf_logs:
                            logger.info(
                                "CDTSM: Detected string-encoded Unix timestamp in microseconds (median=%.1f)",
                                abs_median,
                            )
                        return None, True
                    elif abs_median < 1e19:
                        self._epoch_unit = 'ns'
                        if not suppress_hf_logs:
                            logger.info(
                                "CDTSM: Detected string-encoded Unix timestamp in nanoseconds (median=%.1f)",
                                abs_median,
                            )
                        return None, True
                except (ValueError, TypeError):
                    pass

            sample_series = pd.Series(sample_strs)
            for fmt in PREDEFINED_DATETIME_FORMATS:
                try:
                    parse_series = (
                        sample_series.map(_normalize_timestamp_string_for_parse)
                        if "%z" in fmt
                        else sample_series
                    )
                    parsed_datetimes = _parse_strftime_format_rowwise(parse_series, fmt)
                    if "%z" in fmt:
                        formatted_back = parsed_datetimes.map(
                            lambda t: t.strftime(fmt) if pd.notna(t) else ""
                        )
                    else:
                        formatted_back = parsed_datetimes.dt.strftime(fmt)
                    formatted_norm = _normalize_for_roundtrip(formatted_back, fmt)
                    sample_norm = _normalize_for_roundtrip(sample_series, fmt)
                    all_match = (formatted_norm == sample_norm).all()

                    if all_match:
                        if len(time_col) > 10:
                            test_indices = np.random.choice(
                                len(time_col), min(20, len(time_col)), replace=False
                            )
                            test_samples = []
                            for idx in test_indices:
                                val = time_col.iloc[idx]
                                if pd.notna(val):
                                    test_samples.append(str(val))

                            if test_samples:
                                test_series = pd.Series(test_samples)
                                try:
                                    test_parse = (
                                        test_series.map(_normalize_timestamp_string_for_parse)
                                        if "%z" in fmt
                                        else test_series
                                    )
                                    test_parsed = _parse_strftime_format_rowwise(
                                        test_parse, fmt
                                    )
                                    if "%z" in fmt:
                                        test_formatted = test_parsed.map(
                                            lambda t: t.strftime(fmt) if pd.notna(t) else ""
                                        )
                                    else:
                                        test_formatted = test_parsed.dt.strftime(fmt)
                                    test_fmt_norm = _normalize_for_roundtrip(
                                        test_formatted, fmt
                                    )
                                    test_ser_norm = _normalize_for_roundtrip(test_series, fmt)
                                    all_match = (test_fmt_norm == test_ser_norm).all()
                                except (ValueError, TypeError, DateParseError):
                                    all_match = False

                        if all_match:
                            if '%f' in fmt:
                                self._frac_sec_precision = _get_frac_sec_precision(
                                    sample_strs[0]
                                )
                            if not suppress_hf_logs:
                                logger.info(
                                    "CDTSM: Detected timestamp format: %s (sample: %s, frac_prec: %d)",
                                    fmt,
                                    sample_strs[0],
                                    self._frac_sec_precision,
                                )
                            return fmt, False

                except (ValueError, TypeError, DateParseError):
                    continue
                except Exception:
                    continue

            logger.warning(
                "CDTSM: Could not detect format from predefined formats (sample: %s)",
                sample_strs[0] if sample_strs else "N/A",
            )
            return None, False

        return None, False

    def _convert_time_field_to_seconds(self, df, *, inplace=False):
        """Convert time field to seconds (Unix timestamp) for internal processing.

        Detects and caches the timestamp format, then converts to seconds.
        Supports:
        - String timestamps (with predefined format detection)
        - Unix timestamps (numeric)
        - Datetime objects

        Args:
            df (pd.DataFrame): Input dataframe
            inplace (bool): If True, mutate ``df`` directly instead of creating a
                shallow wrapper copy. Use only when callers no longer need the
                original time column.

        Returns:
            pd.DataFrame: Dataframe with time field converted to seconds (int64)

        Raises:
            RuntimeError: If time field cannot be converted to seconds
        """
        df_converted = df if inplace else df.copy(deep=False)

        if self.time_field not in df_converted:
            raise RuntimeError(
                f"CDTSM: Time field '{self.time_field}' not found in dataframe. "
                f"Available columns: {', '.join(df_converted.columns)}"
            )

        time_col = df_converted[self.time_field]
        self._original_time_dtype = time_col.dtype

        suppress_hf_logs = getattr(self, "_cdtsm_suppress_high_frequency_logs", False)
        if not suppress_hf_logs:
            logger.info(
                "CDTSM: Converting time field '%s' (dtype: %s) to seconds since epoch",
                self.time_field,
                self._original_time_dtype,
            )

        self._predominant_data_tz = None
        self._original_time_tz_offset_has_colon = False
        self._parse_detection_window_naive_use_utc = False

        try:
            detected_format, is_unix = self._detect_timestamp_format(time_col)
            self._detected_time_format = detected_format
            self._is_unix_timestamp = is_unix

            if time_col.dtype == object:
                self._time_was_string = True

                for val in time_col:
                    if pd.notna(val):
                        self._original_time_sample = str(val)
                        break

                if self._original_time_sample and _TZ_COLON_RE.search(
                    self._original_time_sample
                ):
                    self._original_time_tz_offset_has_colon = True

                if detected_format and '%z' in detected_format and self._original_time_sample:
                    self._data_tz = _extract_data_timezone(
                        detected_format, self._original_time_sample
                    )
                    if self._data_tz is not None and not suppress_hf_logs:
                        logger.info(
                            "CDTSM: Extracted data timezone %s for output conversion",
                            self._data_tz,
                        )

                if is_unix:
                    self._is_unix_timestamp = True
                    numeric_col = pd.to_numeric(time_col, errors='coerce')
                    null_count = numeric_col.isna().sum()
                    if null_count > 0:
                        log_cdtsm_time_field_null(
                            is_groupby=1 if getattr(self, "forecast_by", None) else 0
                        )
                        raise RuntimeError(
                            f"CDTSM: Failed to parse time field '{self.time_field}'. "
                            f"{null_count} value(s) could not be converted to numeric."
                        )
                    _EPOCH_DIVISORS = {
                        's': 1,
                        'ms': 1_000,
                        'us': 1_000_000,
                        'ns': 1_000_000_000,
                    }
                    divisor = _EPOCH_DIVISORS.get(self._epoch_unit, 1)
                    if divisor == 1:
                        df_converted[self.time_field] = numeric_col.values.astype('int64')
                    else:
                        df_converted[self.time_field] = (numeric_col.values / divisor).astype(
                            'int64'
                        )
                else:
                    try:
                        if detected_format:
                            if "%z" in detected_format:
                                time_col_parse = time_col.map(
                                    _normalize_timestamp_string_for_parse
                                )
                                time_datetime = _parse_strftime_format_rowwise(
                                    time_col_parse, detected_format
                                )
                                df_converted[
                                    self.time_field
                                ] = _series_timestamps_to_epoch_seconds(time_datetime)
                            else:
                                time_col_parse = time_col
                                time_datetime = pd.to_datetime(
                                    time_col_parse, format=detected_format
                                )
                                df_converted[self.time_field] = (
                                    time_datetime.values.astype("int64") // 10**9
                                )
                        else:
                            cleaned = time_col.map(_normalize_timestamp_string_for_parse)
                            try:
                                time_datetime = pd.to_datetime(cleaned, errors="raise")
                            except (ValueError, TypeError, DateParseError):
                                time_datetime = time_col.map(
                                    lambda v: (
                                        _parse_iso8601_scalar_to_pd_timestamp(v)
                                        if pd.notna(v)
                                        else pd.NaT
                                    )
                                )
                            if pd.api.types.is_datetime64_any_dtype(time_datetime):
                                df_converted[self.time_field] = (
                                    time_datetime.values.astype("int64") // 10**9
                                )
                            else:
                                df_converted[
                                    self.time_field
                                ] = _series_timestamps_to_epoch_seconds(time_datetime)
                    except DateParseError as e:
                        raise RuntimeError(
                            f"CDTSM: Failed to parse time field '{self.time_field}'. "
                            f"Error: {str(e)}"
                        )

                    null_count = time_datetime.isna().sum()
                    if null_count == len(time_datetime):
                        log_cdtsm_time_field_null(
                            is_groupby=1 if getattr(self, "forecast_by", None) else 0
                        )
                        raise RuntimeError(
                            f"CDTSM: Failed to parse time field '{self.time_field}'. "
                            f"All values resulted in NaT after conversion."
                        )

                    if null_count > 0:
                        log_cdtsm_time_field_null(
                            is_groupby=1 if getattr(self, "forecast_by", None) else 0
                        )
                        raise RuntimeError(
                            f"CDTSM: Failed to parse time field '{self.time_field}'. "
                            f"Some values resulted in NaT after conversion. Please check the format of the time field."
                        )
                    self._predominant_data_tz = predominant_tzinfo_from_timestamp_series(
                        time_datetime
                    )
                    if not pd.api.types.is_datetime64_any_dtype(time_datetime):
                        _tz_series = time_datetime.map(
                            lambda t: t.tzinfo if pd.notna(t) else None
                        )
                        if _tz_series.notna().any():
                            df_converted[CDTSM_INTERNAL_ROW_TZ_COLUMN] = _tz_series

            elif pd.api.types.is_datetime64_any_dtype(time_col):
                self._time_was_string = False
                self._time_was_datetime64 = True
                if getattr(time_col.dt, "tz", None) is not None:
                    self._predominant_data_tz = time_col.dt.tz
                df_converted[self.time_field] = time_col.values.astype('int64') // 10**9

            elif pd.api.types.is_numeric_dtype(time_col):
                self._time_was_string = False
                if is_unix:
                    self._is_unix_timestamp = True
                    _EPOCH_DIVISORS = {
                        's': 1,
                        'ms': 1_000,
                        'us': 1_000_000,
                        'ns': 1_000_000_000,
                    }
                    divisor = _EPOCH_DIVISORS.get(self._epoch_unit, 1)
                    if divisor == 1:
                        df_converted[self.time_field] = time_col.values.astype('int64')
                    else:
                        df_converted[self.time_field] = (time_col.values / divisor).astype(
                            'int64'
                        )
                else:
                    raise RuntimeError(
                        f"CDTSM: Numeric time field '{self.time_field}' values are outside any "
                        f"plausible epoch range. Cannot interpret as timestamps."
                    )

            else:
                raise RuntimeError(
                    f"CDTSM: Unsupported dtype '{time_col.dtype}' for time field '{self.time_field}'"
                )

            # Naive string/object timestamps become epoch via pandas datetime64 (UTC wall);
            # detection_window_* must use the same semantics or earliest/latest vs data mis-compare.
            self._parse_detection_window_naive_use_utc = (
                getattr(self, "_time_was_string", False)
                and not getattr(self, "_is_unix_timestamp", True)
                and self._predominant_data_tz is None
                and not (self._detected_time_format and "%z" in self._detected_time_format)
            )

            return df_converted

        except Exception as e:
            cexc.log_traceback()
            log_cdtsm_time_field_null(is_groupby=1 if getattr(self, "forecast_by", None) else 0)
            raise RuntimeError(
                f"CDTSM: Unable to convert time field '{self.time_field}'. Please check if it has time values."
            )

    def apply(self, df, options=None):
        """Main inference method for PredictAI: forecasting or anomaly detection.

        Returns a dataframe whose time column is converted back to the ingest representation
        (strings, datetime64, or epoch unit) via :meth:`_finalize_apply_output_timestamps`.

        Args:
            df (pd.DataFrame): Input dataframe with time series data
            options (dict, optional): Additional options

        Returns:
            pd.DataFrame: Forecast or anomaly-detection output with original-format timestamps
        """
        self._reset_cdtsm_apply_timings()

        if self._searchinfo:
            try:
                ctsm_conf = CTSMConfUtil(self._searchinfo)
                if ctsm_conf.get_ctsm_opt_out():
                    raise RuntimeError(
                        "CDTSM is currently disabled. Please contact your administrator to enable Cisco Deep Time Series Model."
                    )
            except RuntimeError:
                raise
            except Exception as e:
                logger.warning(
                    "CDTSM: Could not read ctsm_opt_out config: %s. Proceeding with CDTSM.",
                    str(e),
                )

        if self.mode == MODE_ANOMALY:
            if self.forecast_by:
                result_df = self._apply_anomaly_detection_by_groups(df, options)
            else:
                result_df = self._apply_anomaly_detection(df, options)
            _post_t0 = time.perf_counter()
            result_df = self._finalize_apply_output_timestamps(result_df)
            self._record_cdtsm_apply_timing(
                "output_preparation", time.perf_counter() - _post_t0
            )

            return result_df

        if self.forecast_by:
            result_df, total_clean_rows = self._apply_forecast_by_groups(df)
            _post_t0 = time.perf_counter()
            result_df = self._finalize_apply_output_timestamps(result_df)
            self._record_cdtsm_apply_timing(
                "output_preparation", time.perf_counter() - _post_t0
            )

            logger.info(
                "PredictAI.apply: result_df shape:%s, columns:%s",
                getattr(result_df, "shape", None),
                list(result_df.columns) if not result_df.empty else [],
            )

            log_cdtsm_apply_details(
                forecast_k=self.horizon,
                holdback=self.holdback,
                num_columns=len(self.columns),
                num_datapoints=total_clean_rows,
                resolution_seconds=self._time_resolution_seconds or 0,
                was_repaired=getattr(self, '_time_series_was_repaired', False),
                quantiles=",".join(self.user_percentiles),
                conf_interval=self.conf_interval or 0,
                mode=self.mode,
                model_name=self.model_name,
                time_field=self.time_field,
                show_input=self.show_input,
                is_groupby=1,
            )

            try:
                rows = total_clean_rows
                column_count = (
                    len(self.columns) if hasattr(self, 'columns') and self.columns else 0
                )
                was_repaired = getattr(self, '_time_series_was_repaired', False)
                is_fixed = not was_repaired
                resolution = (
                    self._time_resolution_seconds
                    if is_fixed and self._time_resolution_seconds
                    else None
                )

                log_cdtsm_apply_stats(
                    rows=rows,
                    column_count=column_count,
                    processed_time=0.0,
                    resolution=resolution,
                    is_fixed=is_fixed,
                    is_groupby=1,
                )
            except Exception as e:
                logger.debug("CDTSM: Could not log apply stats: %s", str(e))

            return result_df

        df_clean, predictions = self._build_payload(df)

        logger.info(
            "CDTSM: Using cleaned dataframe with %d rows for forecasting",
            len(df_clean),
        )

        _post_t0 = time.perf_counter()
        result_df = self._build_forecast_dataframe(predictions, df_clean)
        result_df = self._finalize_apply_output_timestamps(result_df)
        self._record_cdtsm_apply_timing("output_preparation", time.perf_counter() - _post_t0)

        logger.info(
            "PredictAI.apply: result_df shape:%s, columns:%s",
            getattr(result_df, "shape", None),
            list(result_df.columns) if not result_df.empty else [],
        )

        log_cdtsm_apply_details(
            forecast_k=self.horizon,
            holdback=self.holdback,
            num_columns=len(self.columns),
            num_datapoints=len(df_clean),
            resolution_seconds=self._time_resolution_seconds or 0,
            was_repaired=getattr(self, '_time_series_was_repaired', False),
            quantiles=",".join(self.user_percentiles),
            conf_interval=self.conf_interval or 0,
            mode=self.mode,
            model_name=self.model_name,
            time_field=self.time_field,
            show_input=self.show_input,
            is_groupby=0,
        )

        try:
            rows = len(df_clean) if df_clean is not None else 0
            column_count = len(self.columns) if hasattr(self, 'columns') and self.columns else 0
            was_repaired = getattr(self, '_time_series_was_repaired', False)
            is_fixed = not was_repaired
            resolution = (
                self._time_resolution_seconds
                if is_fixed and self._time_resolution_seconds
                else None
            )

            log_cdtsm_apply_stats(
                rows=rows,
                column_count=column_count,
                processed_time=0.0,
                resolution=resolution,
                is_fixed=is_fixed,
                is_groupby=0,
            )
        except Exception as e:
            logger.debug("CDTSM: Could not log apply stats: %s", str(e))

        return result_df

    def fit(self, df, options):
        """PredictAI does not support model training (fit).

        This algorithm performs zero-shot inference only. Use the apply command instead.

        Args:
            df (pd.DataFrame): Input dataframe
            options (dict): Options

        Raises:
            RuntimeError: Always raises error directing users to use apply command
        """
        raise RuntimeError(
            "PredictAI does not support the 'fit' command as it performs zero-shot inference only. "
            "Please use the 'predictAI' command instead. "
            "Example: | predictAI model_name=CDTSM columns=cpu,memory horizon=128"
        )

    @staticmethod
    def register_codecs():
        """PredictAI does not support saved models."""
        from util.base_util import MLSPLNotImplementedError

        msg = 'The PredictAI algorithm does not support saving models.'
        raise MLSPLNotImplementedError(msg)
