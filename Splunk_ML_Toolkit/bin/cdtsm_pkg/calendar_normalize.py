"""Calendar-day normalization for CDTSM: local-date bucketing + uniform UTC spacing.

Daily series sampled at **local midnight** (or other wall times) across DST has
**unequal** gaps in Unix epoch seconds (23h / 24h / 25h). CDTSM's resolution
check requires a **single** step size between consecutive rows in seconds.

This module collapses data to **one row per local calendar date** in a named
IANA timezone, then assigns **synthetic** UTC instants::

    t[i] = t0 + i * 86400   (i = 0 .. n-1)

where ``t0`` is the Unix epoch second for **midnight** of the **first** local
date on the timeline in ``tz_name``.

Those instants are **not** the true UTC times of each local midnight when DST
applies; they are a **uniform calendar index** so consecutive rows differ by
exactly 86400 seconds. Values are the aggregated metric(s) for each local date.

Use this when you model **calendar days**, not physical 24-hour durations.
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional, Sequence

import pandas as pd

try:
    from zoneinfo import ZoneInfo
except ImportError:  # pragma: no cover
    ZoneInfo = None  # type: ignore

import cexc

logger = cexc.get_logger(__name__)

CALENDAR_DAY_SECONDS = 86400


def _ensure_zoneinfo(tz_name: str):
    if ZoneInfo is None:
        raise RuntimeError("zoneinfo is required (Python 3.9+)")
    return ZoneInfo(tz_name)


def parse_times_to_zone(
    series: pd.Series,
    tz_name: str,
    *,
    naive_local: bool = True,
) -> pd.Series:
    """Parse a time column to timezone-aware :class:`~pandas.DatetimeIndex` in ``tz_name``.

    * ISO strings **with** offsets / ``Z`` are parsed with ``utc=True`` (correct
      absolute instants), then converted to ``tz_name``.
    * Timezone-**naive** values are interpreted as wall time in ``tz_name`` when
      ``naive_local`` is True.

    Args:
        series: Raw time values (strings, epoch, datetimes).
        tz_name: IANA zone, e.g. ``America/Los_Angeles``.
        naive_local: If True, localize naive datetimes to ``tz_name``.

    Returns:
        Series of ``datetime64[ns, tz_name]``.
    """
    z = _ensure_zoneinfo(tz_name)
    # Prefer UTC-normalized parsing so mixed offsets (-08 / -07) parse reliably.
    dt_utc = pd.to_datetime(series, utc=True, errors="coerce")
    if isinstance(dt_utc.dtype, pd.DatetimeTZDtype) or (
        pd.api.types.is_datetime64_any_dtype(dt_utc) and dt_utc.dt.tz is not None
    ):
        return dt_utc.dt.tz_convert(z)

    dt_naive = pd.to_datetime(series, utc=False, errors="coerce")
    if not pd.api.types.is_datetime64_any_dtype(dt_naive):
        out = []
        for x in series:
            if pd.isna(x) and not isinstance(x, str):
                out.append(pd.NaT)
                continue
            t = pd.Timestamp(x)
            if t.tzinfo is None:
                if naive_local:
                    t = t.tz_localize(z, ambiguous="infer", nonexistent="shift_forward")
                else:
                    t = t.tz_localize("UTC").tz_convert(z)
            else:
                t = t.tz_convert(z)
            out.append(t)
        return pd.Series(out, index=series.index)

    if dt_naive.dt.tz is None:
        if naive_local:
            return dt_naive.dt.tz_localize(z, ambiguous="infer", nonexistent="shift_forward")
        return dt_naive.dt.tz_localize("UTC").dt.tz_convert(z)
    return dt_naive.dt.tz_convert(z)


def normalize_daily_local_to_uniform_utc(
    df: pd.DataFrame,
    time_col: str,
    tz_name: str,
    *,
    value_cols: Optional[Sequence[str]] = None,
    agg: str = "last",
) -> pd.DataFrame:
    """One row per local calendar date; synthetic UTC epoch spaced by 86400 seconds.

    After aggregation, row ``i`` has ``time_col`` equal to ``t0 + i * 86400`` where
    ``t0`` is the epoch second for **start of the earliest local date** (midnight
    in ``tz_name``). Values are combined with ``agg`` (default: last row within
    each local day, after sorting by time).

    Args:
        df: Input frame; must contain ``time_col``.
        time_col: Timestamp column name.
        tz_name: IANA timezone used to define **local calendar dates** (e.g.
            ``America/Los_Angeles``).
        value_cols: Metric columns to aggregate. If None, uses all non-time
            numeric columns.
        agg: Named aggregation: ``last``, ``first``, ``mean``, ``min``, ``max``.

    Returns:
        New DataFrame with ``time_col`` as **int64** Unix seconds (UTC),
        **uniform** 86400-second steps, and one row per sorted local date.

    Raises:
        RuntimeError: Empty input, missing column, or no value columns.
    """
    if df is None or len(df) == 0:
        raise RuntimeError("normalize_daily_local_to_uniform_utc: dataframe is empty")
    if time_col not in df.columns:
        raise RuntimeError(
            f"normalize_daily_local_to_uniform_utc: missing time column '{time_col}'"
        )

    z = _ensure_zoneinfo(tz_name)

    work = df.copy()
    work["_cdtsm_ts"] = parse_times_to_zone(work[time_col], tz_name)
    work = work.sort_values("_cdtsm_ts")
    work["_cdtsm_local_date"] = work["_cdtsm_ts"].dt.date

    if value_cols is None:
        value_cols = [
            c
            for c in work.columns
            if c not in (time_col, "_cdtsm_ts", "_cdtsm_local_date")
            and pd.api.types.is_numeric_dtype(work[c])
        ]
    else:
        value_cols = list(value_cols)
        for c in value_cols:
            if c not in work.columns:
                raise RuntimeError(
                    f"normalize_daily_local_to_uniform_utc: value column '{c}' not found"
                )

    if not value_cols:
        raise RuntimeError(
            "normalize_daily_local_to_uniform_utc: no value columns to aggregate; "
            "pass value_cols explicitly"
        )

    named = agg.lower()
    if named == "last":
        grouped = work.groupby("_cdtsm_local_date", sort=True)[value_cols].last()
    elif named == "first":
        grouped = work.groupby("_cdtsm_local_date", sort=True)[value_cols].first()
    elif named in ("mean", "min", "max"):
        grouped = getattr(work.groupby("_cdtsm_local_date", sort=True)[value_cols], named)()
    else:
        raise RuntimeError(f"normalize_daily_local_to_uniform_utc: unsupported agg={agg!r}")

    grouped = grouped.reset_index()
    local_dates = grouped["_cdtsm_local_date"].tolist()
    n = len(local_dates)
    if n == 0:
        raise RuntimeError("normalize_daily_local_to_uniform_utc: no rows after groupby")

    d0 = local_dates[0]
    t0 = datetime(d0.year, d0.month, d0.day, 0, 0, 0, tzinfo=z)
    base_utc = int(t0.timestamp())

    out_times = [base_utc + i * CALENDAR_DAY_SECONDS for i in range(n)]
    grouped[time_col] = out_times

    out = grouped.drop(columns=["_cdtsm_local_date"])
    # column order: time_col, then metrics
    cols = [time_col] + [c for c in out.columns if c != time_col]
    out = out[cols]
    out[time_col] = out[time_col].astype("int64")

    logger.info(
        "calendar_normalize: %d local dates in %s -> %d rows, uniform %ds steps from epoch %s",
        n,
        tz_name,
        n,
        CALENDAR_DAY_SECONDS,
        base_utc,
    )
    return out
