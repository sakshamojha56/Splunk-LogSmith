"""
CDTSM-specific telemetry utilities.

This module provides telemetry logging functions for CDTSM operations mainly apply for now.
"""

import uuid
import cexc
from util.error_util import safe_func

logger = cexc.get_logger(__name__)


@safe_func
def log_uuid():
    logger.debug("UUID=%s" % str(uuid.uuid4()))


@safe_func
def log_cdtsm_apply(is_groupby=0):
    """
    Log CDTSM apply event.

    Args:
        is_groupby (int): 1 when emitted from a BY (forecast_by) flow, 0 otherwise.
    """
    logger.debug(
        "command=apply, model_name=cdtsm, is_cdtsm=1, is_groupby=%d" % (1 if is_groupby else 0,)
    )


@safe_func
def log_cdtsm_time_resolution(
    most_frequent_resolution, decided_resolution, was_repaired, is_groupby=0
):
    """
    Log time series resolution information for CDTSM apply.

    Args:
        most_frequent_resolution (int): The most frequent (mode) resolution in seconds
        decided_resolution (int): The resolution that was decided/used in seconds
        was_repaired (bool): Whether the time series needed repair due to inconsistent intervals
        is_groupby (int): 1 when emitted from a BY (forecast_by) flow, 0 otherwise.
    """
    logger.debug(
        "command=apply, model=cdtsm, is_cdtsm=1, most_frequent_resolution_seconds=%d, "
        "decided_resolution_seconds=%d, time_series_repaired=%d, is_groupby=%d"
        % (
            most_frequent_resolution,
            decided_resolution,
            1 if was_repaired else 0,
            1 if is_groupby else 0,
        )
    )


@safe_func
def log_cdtsm_time_field_null(is_groupby=0):
    """
    Log event when the time field passed to CDTSM has no valid timestamps (is fully null).

    Args:
        is_groupby (int): 1 when emitted from a BY (forecast_by) flow, 0 otherwise.
    """
    logger.debug(
        "command=apply, model=cdtsm, is_cdtsm=1, time_field_null=1, is_groupby=%d"
        % (1 if is_groupby else 0,)
    )


@safe_func
def log_cdtsm_apply_details(
    forecast_k,
    holdback,
    num_columns,
    num_datapoints,
    resolution_seconds,
    was_repaired,
    quantiles,
    conf_interval,
    mode,
    model_name,
    time_field,
    show_input,
    is_groupby=0,
):
    """
    Log comprehensive CDTSM apply details for telemetry.

    Args:
        forecast_k (int): The number of forecast points requested
        holdback (int): The number of holdback points
        num_columns (int): Number of columns being forecast
        num_datapoints (int): Number of input datapoints
        resolution_seconds (int): The time resolution in seconds
        was_repaired (bool): Whether the time series was repaired
        quantiles (str): Comma-separated list of quantiles requested
        conf_interval (int): The confidence interval value (0 if disabled)
        mode (str): Execution mode (e.g. "forecast")
        model_name (str): Model name (e.g. "CDTSM")
        time_field (str): Name of the time field used
        show_input (bool): Whether input rows are included in output
        is_groupby (int): 1 when emitted from a BY (forecast_by) flow, 0 otherwise.
    """
    logger.debug(
        "command=apply, model=cdtsm, is_cdtsm=1, mode=%s, model_name=%s, "
        "time_field=%s, show_input=%d, forecast_k=%d, holdback=%d, "
        "num_columns=%d, num_datapoints=%d, resolution_seconds=%d, "
        "time_series_repaired=%d, quantiles=%s, conf_interval=%d, is_groupby=%d"
        % (
            mode,
            model_name,
            time_field,
            1 if show_input else 0,
            forecast_k,
            holdback,
            num_columns,
            num_datapoints,
            resolution_seconds,
            1 if was_repaired else 0,
            quantiles,
            conf_interval if conf_interval else 0,
            1 if is_groupby else 0,
        )
    )


@safe_func
def log_cdtsm_apply_stats(
    rows, column_count, processed_time, resolution=None, is_fixed=True, is_groupby=0
):
    """
    Log CDTSM apply statistics for telemetry.

    Args:
        rows (int): Number of rows processed
        column_count (int): Number of columns being forecast
        processed_time (float): Total time in seconds to process the apply command
        resolution (int or None): The time resolution in seconds if fixed/consistent, None if not fixed
        is_fixed (bool): Whether the time series has a fixed/consistent resolution (default True)
        is_groupby (int): 1 when emitted from a BY (forecast_by) flow, 0 otherwise.
    """
    resolution_str = str(resolution) if resolution is not None else "None"
    logger.debug(
        "command=apply, model=cdtsm, rows=%d, column_count=%d, rows_processed_time=%f, "
        "resolution=%s, is_fixed=%d, is_cdtsm=1, is_groupby=%d"
        % (
            rows,
            column_count,
            processed_time,
            resolution_str,
            1 if is_fixed else 0,
            1 if is_groupby else 0,
        )
    )


@safe_func
def log_cdtsm_api_call(endpoint, response_time, status_code, retry_count=0, is_groupby=0):
    """
    Log CDTSM API call details for telemetry.

    Args:
        endpoint (str): The API endpoint called
        response_time (float): Time in seconds for the API response
        status_code (int): HTTP status code returned
        retry_count (int): Number of retries attempted (default 0)
        is_groupby (int): 1 when emitted from a BY (forecast_by) flow, 0 otherwise.
    """
    logger.debug(
        "command=apply, model=cdtsm, endpoint=%s, api_response_time=%f, "
        "status_code=%d, retry_count=%d, is_groupby=%d"
        % (
            endpoint,
            response_time,
            status_code,
            retry_count,
            1 if is_groupby else 0,
        )
    )


@safe_func
def log_cdtsm_anomaly_params(
    mode,
    model_name,
    num_columns,
    time_field,
    show_input,
    forecast_k,
    holdback,
    quantiles,
    conf_interval,
    method,
    context_length,
    detection_length,
    detection_window_earliest,
    detection_window_latest,
    stride,
    threshold,
    quantile_lower,
    quantile_upper,
    multiplier,
    threshold_direction,
    segment_method,
    on_span,
    on_ratio,
    off_span,
    off_ratio,
    win_size,
    agg_func,
    conf_interval_viz,
    num_datapoints,
    detection_points,
    context_window_earliest=None,
    context_window_latest=None,
    is_groupby=0,
    was_repaired=False,
):
    """
    Log all resolved parameter values for CDTSM anomaly mode.

    Every parameter is logged with its resolved value (user-provided or default).
    Parameters that do not apply to the chosen method or segment_method
    are logged as "None".

    Args:
        mode (str): Execution mode ("anomaly")
        model_name (str): Model name (default "CDTSM")
        num_columns (int): Number of columns being analysed
        time_field (str): Name of the time field
        show_input (bool): Whether input rows are included in output
        forecast_k (int): Total forecast horizon
        holdback (int): Holdback points
        quantiles (str): Comma-separated quantiles requested
        conf_interval (int): Confidence interval value
        method (str): SPL method name (e.g. quantile, iqr_residual)
        context_length: Context window length (int or None)
        detection_length: Detection window length (int or None)
        detection_window_earliest: Earliest detection window bound (str or None)
        detection_window_latest: Latest detection window bound (str or None)
        stride (int): Stride between rolling forecasts
        threshold: IQR multiplier (float or None)
        quantile_lower: Quantile resolved lower-tail quantile (float or None)
        quantile_upper: Quantile resolved upper-tail quantile (float or None)
        multiplier: Quantile multiplier (float or None)
        threshold_direction: Direction (str or None)
        segment_method (str): "logic" or "smooth"
        on_span: Logic segment on_span (int or None)
        on_ratio: Logic segment on_ratio (float or None)
        off_span: Logic segment off_span (int or None)
        off_ratio: Logic segment off_ratio (float or None)
        win_size: Smooth segment window size (int or None)
        agg_func: Smooth segment aggregation function (str or None)
        conf_interval_viz (str): Comma-separated conf_interval band values
        num_datapoints (int): Total input data points
        detection_points (int): Number of points in the detection window
        is_groupby (int): 1 when emitted from a BY (forecast_by) flow, 0 otherwise.
        was_repaired (bool): Whether the time series was repaired (true if any
            BY group required repair in the BY flow, otherwise the single
            series' repair flag in the non-BY flow).
    """
    _s = lambda v: str(v) if v is not None else "None"
    logger.debug(
        "command=apply, model=cdtsm, is_cdtsm=1, "
        "mode=%s, model_name=%s, num_columns=%d, time_field=%s, "
        "show_input=%d, forecast_k=%d, holdback=%d, quantiles=%s, "
        "conf_interval=%s, method=%s, context_length=%s, "
        "detection_length=%s, detection_window_earliest=%s, "
        "detection_window_latest=%s, context_window_earliest=%s, "
        "context_window_latest=%s, stride=%s, threshold=%s, "
        "quantile_lower=%s, quantile_upper=%s, multiplier=%s, threshold_direction=%s, "
        "segment_method=%s, on_span=%s, on_ratio=%s, off_span=%s, "
        "off_ratio=%s, win_size=%s, agg_func=%s, conf_interval_viz=%s, "
        "num_datapoints=%d, detection_points=%d, is_groupby=%d, "
        "time_series_repaired=%d"
        % (
            mode,
            model_name,
            num_columns,
            time_field,
            1 if show_input else 0,
            forecast_k,
            holdback,
            quantiles,
            _s(conf_interval),
            method,
            _s(context_length),
            _s(detection_length),
            _s(detection_window_earliest),
            _s(detection_window_latest),
            _s(context_window_earliest),
            _s(context_window_latest),
            _s(stride),
            _s(threshold),
            _s(quantile_lower),
            _s(quantile_upper),
            _s(multiplier),
            _s(threshold_direction),
            segment_method,
            _s(on_span),
            _s(on_ratio),
            _s(off_span),
            _s(off_ratio),
            _s(win_size),
            _s(agg_func),
            conf_interval_viz,
            num_datapoints,
            detection_points,
            1 if is_groupby else 0,
            1 if was_repaired else 0,
        )
    )


@safe_func
def log_cdtsm_rate_limit(endpoint, retry_count, max_retries, exhausted, is_groupby=0):
    """
    Log CDTSM API rate-limit (HTTP 429) event for telemetry.

    Args:
        endpoint (str): The API endpoint that returned 429
        retry_count (int): Current retry attempt number
        max_retries (int): Maximum retries configured
        exhausted (bool): Whether all retries have been exhausted
        is_groupby (int): 1 when emitted from a BY (forecast_by) flow, 0 otherwise.
    """
    logger.debug(
        "command=apply, model=cdtsm, is_cdtsm=1, "
        "rate_limit=1, endpoint=%s, retry_count=%d, "
        "max_retries=%d, retries_exhausted=%d, is_groupby=%d"
        % (
            endpoint,
            retry_count,
            max_retries,
            1 if exhausted else 0,
            1 if is_groupby else 0,
        )
    )


@safe_func
def log_cdtsm_apply_time(total_time, is_groupby=0):
    """
    Log total CDTSM apply execution time.

    Args:
        total_time (float): Total execution time in seconds for the apply command
        is_groupby (int): 1 when emitted from a BY (forecast_by) flow, 0 otherwise.
    """
    logger.debug(
        "command=apply, model=cdtsm, apply_time=%f, is_groupby=%d"
        % (total_time, 1 if is_groupby else 0)
    )
