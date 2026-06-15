from __future__ import annotations

from typing import Dict, Optional, Sequence

from .core import (
    apply_pointwise_method,
    apply_segment_method,
    normalize_quantile_map,
    validate_actuals,
)


def run_postprocessing(
    actuals: Sequence[float],
    forecasts: Optional[Sequence[float]] = None,
    forecast_quantiles: Optional[Dict[float, Sequence[float]]] = None,
    pointwise_method: str = "iqr",
    pointwise_params: Optional[Dict] = None,
    segment_method: str = "logic",
    segment_params: Optional[Dict] = None,
) -> Dict:
    """Run postprocessing pipeline for anomaly detection.

    Returns:
        {
            "scores": Optional[List[float]],
            "point_flags": List[bool],
            "final_flags": List[bool],
            "segment_result": Dict,
            "threshold_columns": Dict
        }
    """
    validate_actuals(actuals)
    pointwise_method = pointwise_method.lower()
    segment_method = segment_method.lower()
    quantiles = normalize_quantile_map(forecast_quantiles)

    scores, point_flags, threshold_columns = apply_pointwise_method(
        actuals=actuals,
        forecasts=forecasts,
        quantiles=quantiles,
        pointwise_method=pointwise_method,
        pointwise_params=pointwise_params,
    )
    segment_result, final_flags = apply_segment_method(
        flags=point_flags,
        segment_method=segment_method,
        segment_params=segment_params,
    )

    return {
        "scores": scores,
        "point_flags": point_flags,
        "final_flags": final_flags,
        "segment_result": segment_result,
        "threshold_columns": threshold_columns,
    }
