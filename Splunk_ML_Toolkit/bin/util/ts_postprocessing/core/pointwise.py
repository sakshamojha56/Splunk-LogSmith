from __future__ import annotations

from typing import Dict, List, Optional, Sequence, Tuple

from ..quantiles import mirror_quantile

IQR_EPS = 1e-6


def flag_threshold_band_breaches(
    actuals: Sequence[float],
    lower_thresholds: Sequence[float],
    upper_thresholds: Sequence[float],
    threshold_direction: str = "both",
) -> List[bool]:
    """Return directional flags for breaches of a lower/upper threshold band."""
    if len(actuals) != len(lower_thresholds) or len(actuals) != len(upper_thresholds):
        raise ValueError(
            "actuals, lower_thresholds, and upper_thresholds must have identical lengths."
        )
    threshold_direction = _validate_threshold_direction(threshold_direction)
    if threshold_direction == "upper":
        return [a > hi for a, hi in zip(actuals, upper_thresholds)]
    if threshold_direction == "lower":
        return [a < lo for a, lo in zip(actuals, lower_thresholds)]
    return [a < lo or a > hi for a, lo, hi in zip(actuals, lower_thresholds, upper_thresholds)]


def calculate_iqr_anomaly_scores(
    actuals: Sequence[float],
    forecasts: Sequence[float],
    lower_quartiles: Sequence[float],
    upper_quartiles: Sequence[float],
) -> List[float]:
    """Calculate pointwise IQR-normalized anomaly scores."""
    # This validation is redundant for the apply_pointwise_method pipeline, but
    # this helper can also be called directly. Keep the local check so direct
    # callers fail fast instead of getting silent truncation from zip().
    expected_len = len(actuals)
    if (
        len(forecasts) != expected_len
        or len(lower_quartiles) != expected_len
        or len(upper_quartiles) != expected_len
    ):
        raise ValueError(
            "actuals, forecasts, lower_quartiles, and upper_quartiles must have identical lengths."
        )

    scores: List[float] = []
    for actual, forecast, q1, q3 in zip(actuals, forecasts, lower_quartiles, upper_quartiles):
        score = abs(actual - forecast) / ((q3 - q1) + IQR_EPS)
        scores.append(score)
    return scores


def calculate_residual_anomaly_scores(
    actuals: Sequence[float],
    forecasts: Sequence[float],
) -> List[float]:
    """Calculate pointwise residual anomaly scores."""
    # This validation is redundant for the apply_pointwise_method pipeline, but
    # this helper can also be called directly. Keep the local check so direct
    # callers fail fast instead of getting silent truncation from zip().
    expected_len = len(actuals)
    if len(forecasts) != expected_len:
        raise ValueError("actuals, forecasts must have identical lengths.")

    scores: List[float] = []
    for actual, forecast in zip(actuals, forecasts):
        score = abs(actual - forecast)
        scores.append(score)
    return scores


def compute_quanbin_threshold_band(
    centerline: Sequence[float],
    lower_quantiles: Sequence[float],
    upper_quantiles: Sequence[float],
    multiplier: float,
) -> Tuple[List[float], List[float]]:
    """Compute the effective QuanBin threshold band around a centerline."""
    expected_len = len(centerline)
    if len(lower_quantiles) != expected_len or len(upper_quantiles) != expected_len:
        raise ValueError(
            "centerline, lower_quantiles, and upper_quantiles must have identical lengths."
        )

    lower_thresholds: List[float] = []
    upper_thresholds: List[float] = []
    for median, lower, upper in zip(centerline, lower_quantiles, upper_quantiles):
        lower_distance = median - lower
        upper_distance = upper - median
        lower_thresholds.append(median - (lower_distance * multiplier))
        upper_thresholds.append(median + (upper_distance * multiplier))
    return lower_thresholds, upper_thresholds


def compute_iqr_threshold_band(
    forecasts: Sequence[float],
    lower_quartiles: Sequence[float],
    upper_quartiles: Sequence[float],
    threshold: float,
) -> tuple[list[float], list[float]]:
    """Map the IQR score threshold back into the original data space."""
    expected_len = len(forecasts)
    if len(lower_quartiles) != expected_len or len(upper_quartiles) != expected_len:
        raise ValueError(
            "forecasts, lower_quartiles, and upper_quartiles must have " "identical lengths."
        )

    lower_thresholds: list[float] = []
    upper_thresholds: list[float] = []
    for forecast, q1, q3 in zip(forecasts, lower_quartiles, upper_quartiles):
        radius = float(threshold) * ((q3 - q1) + IQR_EPS)
        lower_thresholds.append(forecast - radius)
        upper_thresholds.append(forecast + radius)
    return lower_thresholds, upper_thresholds


def compute_residual_threshold_band(
    forecasts: Sequence[float],
    threshold_curve: Sequence[float],
) -> tuple[list[float], list[float]]:
    """Map the residual threshold curve back into the original data space."""
    expected_len = len(forecasts)
    if len(threshold_curve) != expected_len:
        raise ValueError("forecasts and threshold_curve must have identical lengths.")

    lower_thresholds = [
        forecast - radius for forecast, radius in zip(forecasts, threshold_curve)
    ]
    upper_thresholds = [
        forecast + radius for forecast, radius in zip(forecasts, threshold_curve)
    ]
    return lower_thresholds, upper_thresholds


def calculate_residual_thresholds(
    lower_quartiles: Sequence[float],
    upper_quartiles: Sequence[float],
    threshold: float,
) -> List[float]:
    """
    Flag residual anomaly scores as anomalous when they exceed a threshold based
    on the running mean IQR. Averaging the IQR over time makes the threshold more
    stable and less sensitive to short-term variation, while still satisfying the
    streaming/causal requirement because each threshold is computed using only the
    current and previously observed IQR values.
    """
    scaling_factors: List[float] = []
    residual_thresholds: List[float] = []
    for i, (q1, q3) in enumerate(zip(lower_quartiles, upper_quartiles)):
        scaling_factor = q3 - q1
        if i > 0:
            scaling_factor += scaling_factors[i - 1]
        scaling_factors.append(scaling_factor)

    for i in range(len(scaling_factors)):
        scaling_factors[i] /= i + 1
        threshold_i = scaling_factors[i] * threshold
        residual_thresholds.append(threshold_i)

    return residual_thresholds


def threshold_scores(scores: Sequence[float], threshold: float) -> List[bool]:
    """Convert numeric scores to binary flags with a fixed threshold."""
    return [score > threshold for score in scores]


def apply_pointwise_method(
    actuals: Sequence[float],
    forecasts: Optional[Sequence[float]],
    quantiles: Dict[float, Sequence[float]],
    pointwise_method: str,
    pointwise_params: Optional[Dict],
) -> (
    Tuple[Optional[List[float]], List[bool]]
    | Tuple[
        Optional[List[float]],
        List[bool],
        Dict[str, Optional[List[Optional[float]]]],
    ]
):
    """Run the selected pointwise method and return scores plus binary flags."""
    expected_len = len(actuals)

    if pointwise_method == "quanbin":
        params = _validate_quanbin_inputs(pointwise_params, quantiles, expected_len)
        lower = _require_quantile(quantiles, float(params["quantile_lower"]), expected_len)
        upper = _require_quantile(quantiles, float(params["quantile_upper"]), expected_len)
        q50 = _require_quantile(quantiles, 0.50, expected_len)
        lower_thresholds, upper_thresholds = compute_quanbin_threshold_band(
            centerline=q50,
            lower_quantiles=lower,
            upper_quantiles=upper,
            multiplier=params["multiplier"],
        )
        pointwise_flags = flag_threshold_band_breaches(
            actuals,
            lower_thresholds,
            upper_thresholds,
            params["threshold_direction"],
        )
        threshold_columns = _build_threshold_columns(
            lower_thresholds,
            upper_thresholds,
            params["threshold_direction"],
            expected_len,
        )
        return None, pointwise_flags, threshold_columns

    if pointwise_method == "iqr":
        params = _validate_iqr_inputs(
            pointwise_params,
            quantiles,
            forecasts,
            expected_len,
        )
        q25 = _require_quantile(quantiles, 0.25, expected_len)
        q50 = _require_quantile(quantiles, 0.50, expected_len)
        q75 = _require_quantile(quantiles, 0.75, expected_len)
        scores = calculate_iqr_anomaly_scores(
            actuals=actuals,
            forecasts=forecasts if forecasts is not None else q50,
            lower_quartiles=q25,
            upper_quartiles=q75,
        )
        lower_thresholds, upper_thresholds = compute_iqr_threshold_band(
            forecasts=forecasts if forecasts is not None else q50,
            lower_quartiles=q25,
            upper_quartiles=q75,
            threshold=params["threshold_value"],
        )

        threshold_columns = _build_threshold_columns(
            lower_thresholds,
            upper_thresholds,
            params["threshold_direction"],
            expected_len,
        )
        pointwise_flags = flag_threshold_band_breaches(
            actuals,
            lower_thresholds,
            upper_thresholds,
            params["threshold_direction"],
        )
        return scores, pointwise_flags, threshold_columns

    if pointwise_method == "residual":
        params = _validate_residual_inputs(
            pointwise_params,
            quantiles,
            forecasts,
            expected_len,
        )
        q25 = _require_quantile(quantiles, 0.25, expected_len)
        q50 = _require_quantile(quantiles, 0.50, expected_len)
        q75 = _require_quantile(quantiles, 0.75, expected_len)
        scores = calculate_residual_anomaly_scores(
            actuals=actuals,
            forecasts=forecasts if forecasts is not None else q50,
        )
        residual_thresholds = calculate_residual_thresholds(q25, q75, params["threshold_value"])
        lower_thresholds, upper_thresholds = compute_residual_threshold_band(
            forecasts=forecasts if forecasts is not None else q50,
            threshold_curve=residual_thresholds,
        )
        threshold_columns = _build_threshold_columns(
            lower_thresholds,
            upper_thresholds,
            params["threshold_direction"],
            expected_len,
        )
        pointwise_flags = flag_threshold_band_breaches(
            actuals,
            lower_thresholds,
            upper_thresholds,
            params["threshold_direction"],
        )
        return scores, pointwise_flags, threshold_columns

    raise ValueError("pointwise_method must be one of: 'quanbin', 'iqr', 'residual'.")


def validate_actuals(actuals: Sequence[float]) -> None:
    """Validate the presence of actual observations."""
    if actuals is None:
        raise ValueError("actuals is required.")
    if len(actuals) == 0:
        raise ValueError("actuals must be non-empty.")


def normalize_quantile_map(
    forecast_quantiles: Optional[Dict[float, Sequence[float]]],
) -> Dict[float, Sequence[float]]:
    """Normalize quantile-map keys to floats."""
    if forecast_quantiles is None:
        return {}

    normalized: Dict[float, Sequence[float]] = {}
    for key, values in forecast_quantiles.items():
        try:
            quantile = float(key)
        except (TypeError, ValueError) as exc:
            raise ValueError(f"Invalid quantile key: {key!r}") from exc
        normalized[quantile] = values
    return normalized


def _require_quantile(
    quantiles: Dict[float, Sequence[float]], q: float, expected_len: int
) -> Sequence[float]:
    if q not in quantiles:
        raise ValueError(f"forecast_quantiles must contain quantile {q}.")
    values = quantiles[q]
    if len(values) != expected_len:
        raise ValueError(
            f"Quantile {q} length mismatch: expected {expected_len}, got {len(values)}."
        )
    return values


def _build_threshold_columns(
    lower_thresholds: Sequence[float],
    upper_thresholds: Sequence[float],
    threshold_direction: str,
    expected_len: int,
) -> Dict[str, List[float]]:
    return {
        "threshold_lower": (
            list(lower_thresholds)
            if threshold_direction in {"both", "lower"}
            else [float("-inf")] * expected_len
        ),
        "threshold_upper": (
            list(upper_thresholds)
            if threshold_direction in {"both", "upper"}
            else [float("inf")] * expected_len
        ),
    }


def _validate_quanbin_inputs(
    pointwise_params: Optional[Dict],
    quantiles: Dict[float, Sequence[float]],
    expected_len: int,
) -> Dict[str, float | str]:
    if not pointwise_params:
        raise ValueError(
            "pointwise_params['quantile'] is required for " "pointwise_method='quanbin'."
        )

    params = dict(pointwise_params)
    has_explicit_bounds = "quantile_upper" in params or "quantile_lower" in params
    if has_explicit_bounds:
        if "quantile_upper" not in params:
            raise ValueError(
                "pointwise_params['quantile_upper'] is required when using "
                "explicit quanbin bounds."
            )
        allowed = {
            "multiplier",
            "quantile_upper",
            "quantile_lower",
            "threshold_direction",
        }
    else:
        if "quantile" not in params:
            raise ValueError(
                "pointwise_params['quantile'] is required for " "pointwise_method='quanbin'."
            )
        allowed = {"multiplier", "quantile", "threshold_direction"}

    unknown = sorted(set(params) - allowed)
    if unknown:
        raise ValueError(f"Unsupported quanbin pointwise_params keys: {unknown}")

    if has_explicit_bounds:
        quantile_upper = float(params["quantile_upper"])
        if quantile_upper <= 0.5 or quantile_upper >= 1.0:
            raise ValueError("pointwise_params['quantile_upper'] must be in (0.5, 1.0).")
        if "quantile_lower" in params:
            quantile_lower = float(params["quantile_lower"])
        else:
            quantile_lower = mirror_quantile(quantile_upper)
        if quantile_lower <= 0 or quantile_lower >= 0.5:
            raise ValueError("pointwise_params['quantile_lower'] must be in (0.0, 0.5).")
        if quantile_upper <= quantile_lower:
            raise ValueError(
                "pointwise_params['quantile_upper'] must be greater than "
                "pointwise_params['quantile_lower']."
            )
    else:
        quantile_upper = float(pointwise_params["quantile"])
        if quantile_upper <= 0.5 or quantile_upper >= 1.0:
            raise ValueError("pointwise_params['quantile'] must be in (0.5, 1.0).")
        quantile_lower = mirror_quantile(quantile_upper)

    multiplier = _validate_multiplier(params["multiplier"])
    _require_quantile(quantiles, quantile_lower, expected_len)
    _require_quantile(quantiles, quantile_upper, expected_len)
    _require_quantile(quantiles, 0.50, expected_len)
    return {
        "quantile_upper": quantile_upper,
        "quantile_lower": quantile_lower,
        "multiplier": multiplier,
        "threshold_direction": _validate_threshold_direction(params["threshold_direction"]),
    }


def _validate_iqr_inputs(
    pointwise_params: Optional[Dict],
    quantiles: Dict[float, Sequence[float]],
    forecasts: Optional[Sequence[float]],
    expected_len: int,
) -> Dict[str, float | str]:
    return _validate_score_based_inputs(
        pointwise_method="iqr",
        pointwise_params=pointwise_params,
        quantiles=quantiles,
        forecasts=forecasts,
        expected_len=expected_len,
    )


def _validate_residual_inputs(
    pointwise_params: Optional[Dict],
    quantiles: Dict[float, Sequence[float]],
    forecasts: Optional[Sequence[float]],
    expected_len: int,
) -> Dict[str, float | str]:
    return _validate_score_based_inputs(
        pointwise_method="residual",
        pointwise_params=pointwise_params,
        quantiles=quantiles,
        forecasts=forecasts,
        expected_len=expected_len,
    )


def _validate_score_based_inputs(
    pointwise_method: str,
    pointwise_params: Optional[Dict],
    quantiles: Dict[float, Sequence[float]],
    forecasts: Optional[Sequence[float]],
    expected_len: int,
) -> Dict[str, float | str]:
    _require_quantile(quantiles, 0.25, expected_len)
    _require_quantile(quantiles, 0.50, expected_len)
    _require_quantile(quantiles, 0.75, expected_len)
    if forecasts is not None and len(forecasts) != expected_len:
        raise ValueError(
            f"forecasts length mismatch: expected {expected_len}, got {len(forecasts)}."
        )
    params = dict(pointwise_params or {})
    allowed = {"threshold_direction", "threshold_value"}
    unknown = sorted(set(params) - allowed)
    if unknown:
        raise ValueError(f"Unsupported {pointwise_method} pointwise_params keys: {unknown}")
    if "threshold_value" not in params:
        raise ValueError(
            "pointwise_params['threshold_value'] is required when "
            f"pointwise_method='{pointwise_method}'."
        )
    threshold_value = float(params["threshold_value"])
    if threshold_value <= 0:
        raise ValueError(
            f"pointwise_params['threshold_value'] must be greater than zero when "
            f"pointwise_method='{pointwise_method}'."
        )
    return {
        "threshold_value": threshold_value,
        "threshold_direction": _validate_threshold_direction(
            params.get("threshold_direction", "both")
        ),
    }


def _validate_multiplier(value: object) -> float:
    multiplier = float(value)
    if multiplier <= 0:
        raise ValueError("pointwise_params['multiplier'] must be greater than zero.")
    return multiplier


def _validate_threshold_direction(value: object) -> str:
    threshold_direction = str(value).lower()
    allowed = {"both", "upper", "lower"}
    if threshold_direction not in allowed:
        raise ValueError("threshold_direction must be one of: 'both', 'upper', 'lower'.")
    return threshold_direction
