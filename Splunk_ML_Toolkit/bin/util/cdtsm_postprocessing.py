"""
CDTSM helpers around the vendored ``ts_postprocessing`` package.

* :func:`run_postprocessing` is re-exported unchanged from
  :mod:`util.ts_postprocessing.api` (same signature and return dict as fm-timeseries).
* :func:`ensure_quanbin_median_quantile` — CDTSM-only helper to synthesize p50 when
  only tail quantiles are present (call before ``run_postprocessing``).
* :func:`quantile_bin_flags` — legacy test helper.
* :func:`apply_pointwise_method` — thin wrapper for tests that still pass a separate
  ``threshold_value`` (forwards to :func:`util.ts_postprocessing.core.apply_pointwise_method`).
"""

from __future__ import annotations

from typing import Dict, List, Optional, Sequence

# Local-only defaults for legacy quantile_bin_flags (avoid importing cdtsm_pkg at module load).
_AD_THRESHOLD_BOTH = "both"
_VALID_AD_THRESHOLD_DIRECTIONS = frozenset({"both", "lower", "upper"})

from util.ts_postprocessing.api import (
    run_postprocessing,
)  # noqa: E402 — canonical entrypoint (fm-timeseries)
from util.ts_postprocessing.core import (
    aggregate_bool_window,
    apply_pointwise_method as _apply_pointwise_method_impl,
    apply_segment_method,
    calculate_iqr_anomaly_scores,
    detect_intervals_from_binary,
    intervals_to_flags,
    normalize_quantile_map,
    smooth_flags,
    threshold_scores,
    validate_actuals,
)
from util.ts_postprocessing.quantiles import infer_paired_lower_quantile_field, mirror_quantile


def ensure_quanbin_median_quantile(
    forecast_quantiles: Optional[Dict[float, Sequence[float]]],
    pointwise_params: Optional[Dict],
) -> Optional[Dict[float, Sequence[float]]]:
    """If QuanBin inputs omit p50, set ``0.5`` to ``(Q(lower)+Q(upper))/2`` per point."""
    if not forecast_quantiles or not pointwise_params:
        return forecast_quantiles

    if "quantile_upper" in pointwise_params:
        q_up = float(pointwise_params["quantile_upper"])
        q_lo = float(pointwise_params.get("quantile_lower", mirror_quantile(q_up)))
    elif "quantile" in pointwise_params:
        q_up = float(pointwise_params["quantile"])
        q_lo = mirror_quantile(q_up)
    else:
        return forecast_quantiles

    qm = normalize_quantile_map(dict(forecast_quantiles))
    if 0.5 in qm:
        return qm
    if q_lo not in qm or q_up not in qm:
        return qm
    lo, hi = qm[q_lo], qm[q_up]
    if len(lo) != len(hi):
        return qm
    out = dict(qm)
    out[0.5] = [(float(a) + float(b)) / 2.0 for a, b in zip(lo, hi)]
    return out


def quantile_bin_flags(
    actuals: Sequence[float],
    lower_quantiles: Sequence[float],
    upper_quantiles: Sequence[float],
    medians: Optional[Sequence[float]] = None,
    multiplier: float = 1.0,
    threshold_direction: str = _AD_THRESHOLD_BOTH,
) -> List[bool]:
    """Return quantile binarization flags with optional band scaling and direction."""
    if len(actuals) != len(lower_quantiles) or len(actuals) != len(upper_quantiles):
        raise ValueError(
            "actuals, lower_quantiles, and upper_quantiles must have identical lengths."
        )
    if threshold_direction not in _VALID_AD_THRESHOLD_DIRECTIONS:
        raise ValueError(
            f"threshold_direction must be one of {_VALID_AD_THRESHOLD_DIRECTIONS}. "
            f"Got '{threshold_direction}'."
        )

    needs_scaling = multiplier != 1.0
    if needs_scaling:
        if medians is None:
            raise ValueError("medians are required when multiplier != 1.0.")
        if len(medians) != len(actuals):
            raise ValueError("medians length must match actuals length.")

    flags: List[bool] = []
    for i, (a, lo, hi) in enumerate(zip(actuals, lower_quantiles, upper_quantiles)):
        if needs_scaling:
            med = medians[i]
            lo = med - multiplier * (med - lo)
            hi = med + multiplier * (hi - med)

        if threshold_direction == "lower":
            flags.append(a < lo)
        elif threshold_direction == "upper":
            flags.append(a > hi)
        else:
            flags.append(a < lo or a > hi)
    return flags


def apply_pointwise_method(
    actuals: Sequence[float],
    forecasts: Optional[Sequence[float]],
    quantiles: Dict[float, Sequence[float]],
    pointwise_method: str,
    pointwise_params: Optional[Dict],
    threshold_value: Optional[float] = None,
):
    """Test helper: merges *threshold_value* into *pointwise_params* for iqr/residual."""
    pm = pointwise_method.lower()
    pp = dict(pointwise_params) if pointwise_params else {}

    if threshold_value is not None:
        if pm == "quanbin":
            raise ValueError("threshold_value must be None when pointwise_method='quanbin'.")
        if pm in ("iqr", "residual"):
            pp.setdefault("threshold_value", float(threshold_value))
    elif pm in ("iqr", "residual") and "threshold_value" not in pp:
        raise ValueError(
            "threshold_value is required when pointwise_method='iqr' or 'residual'."
        )

    scores, point_flags, _threshold_columns = _apply_pointwise_method_impl(
        actuals=actuals,
        forecasts=forecasts,
        quantiles=normalize_quantile_map(quantiles),
        pointwise_method=pointwise_method,
        pointwise_params=pp if pp else None,
    )
    return scores, point_flags


__all__ = [
    "run_postprocessing",
    "ensure_quanbin_median_quantile",
    "apply_pointwise_method",
    "apply_segment_method",
    "quantile_bin_flags",
    "calculate_iqr_anomaly_scores",
    "threshold_scores",
    "validate_actuals",
    "normalize_quantile_map",
    "aggregate_bool_window",
    "smooth_flags",
    "detect_intervals_from_binary",
    "intervals_to_flags",
    "mirror_quantile",
    "infer_paired_lower_quantile_field",
]
