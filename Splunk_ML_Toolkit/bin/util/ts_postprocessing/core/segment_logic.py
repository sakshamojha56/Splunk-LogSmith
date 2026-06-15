from __future__ import annotations

import math
from collections import Counter
from typing import Dict, List, Optional, Sequence, Tuple


Interval = Tuple[int, int]


def detect_intervals_from_binary(
    flags: Sequence[bool | int],
    on_span: int,
    on_ratio: float,
    off_span: int,
    off_ratio: float,
    min_region_length: int | None = None,
) -> List[Interval]:
    """Detect anomalous index intervals from binary pointwise flags.

    This follows the behavior of the `detect` function in o11y SignalFlow:
    - activate once on-window anomaly hits exceed threshold
    - start interval at the first anomalous point inside the activating on-window
    - allow deactivation only after minimum region length measured from the
      activating window start
    - deactivate when off-window has enough normal points
    """
    if on_span <= 0 or off_span <= 0:
        raise ValueError("on_span and off_span must be positive integers.")
    if not (0.0 <= on_ratio <= 1.0 and 0.0 <= off_ratio <= 1.0):
        raise ValueError("on_ratio and off_ratio must be within [0, 1].")

    binary = [int(x) for x in flags]
    if any(x not in (0, 1) for x in binary):
        raise ValueError("flags must be binary (0/1 or False/True).")

    n = len(binary)
    if n == 0 or n < on_span:
        return []

    on_required = max(1, math.ceil(on_span * on_ratio))
    off_required = max(1, math.ceil(off_span * off_ratio))
    min_len = min_region_length if min_region_length is not None else (on_span + off_span)

    prefix = []
    running = 0
    for x in binary:
        running += x
        prefix.append(running)

    def window_sum(end_idx: int, length: int) -> int:
        start_idx = end_idx - length + 1
        if start_idx <= 0:
            return prefix[end_idx]
        return prefix[end_idx] - prefix[start_idx - 1]

    intervals: List[Interval] = []
    active = False
    start_idx: int | None = None
    length_anchor_idx: int | None = None

    for idx in range(n):
        if not active:
            if idx + 1 >= on_span:
                ones = window_sum(idx, on_span)
                if ones >= on_required:
                    active = True
                    window_start = max(0, idx - on_span + 1)
                    length_anchor_idx = window_start
                    start_idx = next(
                        candidate_idx
                        for candidate_idx in range(window_start, idx + 1)
                        if binary[candidate_idx] == 1
                    )
        else:
            assert start_idx is not None
            assert length_anchor_idx is not None
            region_len = idx - length_anchor_idx + 1
            if region_len < min_len:
                continue
            ones = window_sum(idx, off_span)
            normals = off_span - ones
            if normals >= off_required:
                intervals.append((start_idx, idx))
                active = False
                start_idx = None
                length_anchor_idx = None

    if active and start_idx is not None:
        end_idx = n - 1
        assert length_anchor_idx is not None
        region_len = end_idx - length_anchor_idx + 1
        if region_len >= min_len:
            intervals.append((start_idx, end_idx))

    return intervals


def intervals_to_flags(length: int, intervals: Sequence[Interval]) -> List[bool]:
    flags = [False] * length
    for start_idx, end_idx in intervals:
        for i in range(max(0, start_idx), min(length, end_idx + 1)):
            flags[i] = True
    return flags


def smooth_flags(flags: Sequence[bool], win_size: int, agg_fun: str) -> List[bool]:
    """Smooth binary flags with a trailing window aggregation."""
    out: List[bool] = []
    for idx in range(len(flags)):
        window = flags[max(0, idx - win_size + 1) : idx + 1]
        out.append(aggregate_bool_window(window, agg_fun))
    return out


def aggregate_bool_window(window: Sequence[bool], agg_fun: str) -> bool:
    """Aggregate a boolean window to a single boolean flag."""
    if agg_fun == "any":
        return any(window)
    elif agg_fun == "all":
        return all(window)
    elif agg_fun == "mode":
        counts = Counter(window)
        if counts[True] == counts[False]:
            return True
        return counts[True] > counts[False]
    raise ValueError("agg_fun must be one of: any, all, mode.")


def apply_segment_method(
    flags: Sequence[bool],
    segment_method: str,
    segment_params: Optional[Dict],
) -> Tuple[Dict, List[bool]]:
    """Run the selected segment-stage method and return result plus final flags."""
    if segment_method == "smooth":
        params = _validate_smooth_params(segment_params)
        final_flags = smooth_flags(flags, params["win_size"], params["agg_fun"])
        return {"smoothed_flags": final_flags}, final_flags

    if segment_method == "logic":
        params = _validate_logic_params(segment_params)
        return _logic_segment(flags, params)

    raise ValueError("segment_method must be one of: 'logic', 'smooth'.")


def _validate_logic_params(segment_params: Optional[Dict]) -> Dict:
    if segment_params is None:
        raise ValueError(
            "segment_params is required for segment_method='logic' "
            "with keys: on_span, on_ratio, off_span, off_ratio."
        )
    required = ("on_span", "on_ratio", "off_span", "off_ratio")
    missing = [key for key in required if key not in segment_params]
    if missing:
        raise ValueError(f"Missing logic segment_params keys: {missing}")

    on_span = int(segment_params["on_span"])
    off_span = int(segment_params["off_span"])
    on_ratio = float(segment_params["on_ratio"])
    off_ratio = float(segment_params["off_ratio"])
    if on_span <= 0 or off_span <= 0:
        raise ValueError("on_span and off_span must be positive integers.")
    if not (0.0 <= on_ratio <= 1.0 and 0.0 <= off_ratio <= 1.0):
        raise ValueError("on_ratio and off_ratio must be within [0, 1].")

    return {
        "on_span": on_span,
        "on_ratio": on_ratio,
        "off_span": off_span,
        "off_ratio": off_ratio,
    }


def _validate_smooth_params(segment_params: Optional[Dict]) -> Dict:
    if segment_params is None:
        raise ValueError(
            "segment_params is required for segment_method='smooth' "
            "with keys: win_size, agg_fun."
        )
    required = ("win_size", "agg_fun")
    missing = [key for key in required if key not in segment_params]
    if missing:
        raise ValueError(f"Missing smooth segment_params keys: {missing}")

    win_size = int(segment_params["win_size"])
    agg_fun = str(segment_params["agg_fun"]).lower()
    if win_size <= 0:
        raise ValueError("win_size must be a positive integer.")
    if agg_fun not in {"any", "all", "mode"}:
        raise ValueError("agg_fun must be one of: any, all, mode.")
    return {"win_size": win_size, "agg_fun": agg_fun}


def _logic_segment(flags: Sequence[bool], params: Dict) -> Tuple[Dict, List[bool]]:
    intervals = detect_intervals_from_binary(
        flags=flags,
        on_span=params["on_span"],
        on_ratio=params["on_ratio"],
        off_span=params["off_span"],
        off_ratio=params["off_ratio"],
    )
    final_flags = intervals_to_flags(len(flags), intervals)

    num_anomalous_points = sum(1 for value in final_flags if value)
    return {
        "segment_flag": len(intervals) > 0,
        "anomalous_intervals": intervals,
        "num_anomalous_points": num_anomalous_points,
    }, final_flags
