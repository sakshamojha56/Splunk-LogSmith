"""Time parsing, format detection, and timezone helpers."""

import re
from collections import Counter
from datetime import datetime, timezone as dt_timezone

import pandas as pd

import cexc
from cdtsm_pkg.constants import (
    PREDEFINED_DATETIME_FORMATS,
    _RELATIVE_TIME_RE,
    _RELATIVE_TIME_UNITS,
    _FRAC_SEC_RE,
    _TZ_COLON_RE,
)

logger = cexc.get_logger(__name__)


def _normalize_timestamp_string_for_parse(value):
    """Normalize string timestamps so strict ``strptime`` / Splunk parsers accept them.

    * UTF-8 BOM on first cell (common from CSV)
    * Unicode minus U+2212 / en-dash → ASCII ``-`` (copy-paste from docs)
    * ISO-8601 ``±HH:MM`` offset → ``±HHMM`` (``%z`` often requires no colon)

    Preserves the instant; no-op for non-strings and missing values.
    """
    if value is None:
        return value
    try:
        if pd.isna(value):
            return value
    except (ValueError, TypeError):
        pass
    s = str(value).strip()
    if s.startswith("\ufeff"):
        s = s[1:].lstrip()
    s = s.replace("\u2212", "-").replace("\u2013", "-")
    return _TZ_COLON_RE.sub(r"\1\2", s)


def _strip_timezone_colon_for_strptime(value):
    """Backward-compatible name; see :func:`_normalize_timestamp_string_for_parse`."""
    return _normalize_timestamp_string_for_parse(value)


def _parse_strftime_format_rowwise(series, fmt):
    """Parse *series* of strings with *fmt*; supports mixed ``%z`` offsets per row.

    Vectorized :func:`pd.to_datetime` with ``%z`` can return object dtype when
    offsets differ, which breaks ``.dt`` accessors — used by format detection.
    """
    if "%z" not in fmt:
        return pd.to_datetime(series, format=fmt, errors="raise")

    normalized = series.map(_normalize_timestamp_string_for_parse)

    def _one(x):
        if pd.isna(x):
            return pd.NaT
        return pd.to_datetime(x, format=fmt, errors="raise")

    return normalized.map(_one)


def _series_timestamps_to_epoch_seconds(ts_series):
    """Convert a Series of :class:`~pandas.Timestamp` (any dtype) to int64 epoch seconds."""

    def _to_epoch(t):
        if pd.isna(t):
            return pd.NA
        return int(pd.Timestamp(t).timestamp())

    return ts_series.map(_to_epoch).astype("int64")


def _parse_iso8601_scalar_to_pd_timestamp(value):
    """Parse ISO-8601 / RFC 3339 (incl. ``Z`` and ``±HH:MM``) via ``fromisoformat``.

    Returns ``pd.Timestamp`` or ``None`` if *value* is not parseable.
    """
    if value is None:
        return None
    try:
        if pd.isna(value):
            return None
    except (ValueError, TypeError):
        pass
    s = _normalize_timestamp_string_for_parse(value)
    if not isinstance(s, str) or not s:
        return None
    if s.endswith("Z") or s.endswith("z"):
        s = s[:-1] + "+00:00"
    try:
        return pd.Timestamp(datetime.fromisoformat(s))
    except (ValueError, TypeError, OSError):
        return None


def _normalize_for_roundtrip(series, fmt):
    """Normalize a Series of timestamp strings so that strftime round-trip
    comparison is not thrown off by cosmetic formatting differences.

    Handles two well-known sources of mismatch:
    * ``%f`` – fractional seconds: input may have 1-6 digits (e.g. ``.000``)
      but ``strftime`` always emits exactly 6 (e.g. ``.000000``).
    * ``%z`` – timezone offset: some platforms / Python versions use a colon
      (``+07:00``) while others do not (``+0700``).

    Both *series* (the original strings) and the formatted-back strings should
    be passed through this function before comparison.
    """
    needs_f = '%f' in fmt
    needs_z = '%z' in fmt
    if not needs_f and not needs_z:
        return series

    def _norm(s):
        if needs_f:
            s = _FRAC_SEC_RE.sub(lambda m: '.' + m.group(1).ljust(6, '0'), s)
        if needs_z:
            s = _TZ_COLON_RE.sub(r'\1\2', s)
        return s

    return series.apply(_norm)


def _get_frac_sec_precision(sample_str):
    """Return the number of fractional-second digits in *sample_str* (0–6)."""
    m = _FRAC_SEC_RE.search(sample_str)
    return len(m.group(1)) if m else 0


def _trim_frac_seconds(series, precision):
    """Trim ``strftime %f`` output (always 6 digits) to *precision* digits.

    No-op when *precision* >= 6 or <= 0 or the format has no fractional part.
    """
    if precision <= 0 or precision >= 6:
        return series

    def _trim(s):
        return _FRAC_SEC_RE.sub(lambda m: '.' + m.group(1)[:precision], s)

    return series.apply(_trim)


def parse_relative_or_absolute_time(value, reference_epoch, time_format=None, data_tz=None):
    """Convert a relative-time string or absolute timestamp to an epoch (float).

    Supported formats (tried in order):
      1. Splunk negative relative time: ``-3h``, ``-7d``, ``-30s``, ``-2w``,
         ``-6mon``, ``-1y``, ``-15m``  (always relative to *reference_epoch*).
         The caller decides what *reference_epoch* represents — typically the
         current wall-clock time for relative offsets.  Only the negative sign
         is allowed — forecasting into the future is not supported.
      2. Numeric epoch: ``1700000000`` or ``1700000000.5``
      3. Formatted datetime string matching *time_format* (the format detected
         from the input dataset, e.g. ``%Y-%m-%d %H:%M:%S``).  Falls back to
         ``pd.to_datetime`` with the predefined format list if *time_format*
         is ``None``.

    Args:
        value: The raw string value from the SPL parameter.
        reference_epoch: The epoch (seconds) that relative offsets are
            calculated from.  For relative time strings this should be
            ``time.time()`` (current wall-clock); for absolute values it
            is unused.
        time_format: Optional strftime format string detected from the data.
            When provided, the value is parsed with this format first before
            falling back to the predefined format list.
        data_tz: Optional ``datetime.tzinfo`` extracted from the input data's
            timestamps.  When the parsed datetime is timezone-naive and
            *data_tz* is not ``None``, the datetime is localized to *data_tz*
            before converting to epoch.  This ensures the window parameter is
            interpreted in the same timezone as the data.

    Returns:
        float: The resolved epoch in seconds.

    Raises:
        RuntimeError: If *value* cannot be parsed or uses a positive relative
            offset.
    """
    value = str(value).strip()

    if value.startswith("+"):
        raise RuntimeError(
            f"Positive relative time '{value}' is not supported. "
            "Only negative offsets (e.g. -3h) are allowed."
        )

    match = _RELATIVE_TIME_RE.match(value)
    if match:
        amount = int(match.group(1))
        unit = match.group(2)
        offset_secs = amount * _RELATIVE_TIME_UNITS[unit]
        return float(reference_epoch) - offset_secs

    try:
        return float(value)
    except (ValueError, TypeError):
        pass

    formats_to_try = []
    if time_format:
        formats_to_try.append(time_format)
    formats_to_try.extend(PREDEFINED_DATETIME_FORMATS)

    for fmt in formats_to_try:
        try:
            parse_val = _normalize_timestamp_string_for_parse(value) if "%z" in fmt else value
            dt = pd.to_datetime(parse_val, format=fmt, errors="raise")
            if data_tz is not None and dt.tzinfo is None:
                dt = dt.tz_localize(data_tz)
            return float(dt.timestamp())
        except (ValueError, TypeError):
            continue

    ts = _parse_iso8601_scalar_to_pd_timestamp(value)
    if ts is not None:
        dt = ts
        if data_tz is not None and dt.tzinfo is None:
            dt = dt.tz_localize(data_tz)
        return float(dt.timestamp())

    raise RuntimeError(
        f"Cannot parse time '{value}'. "
        "Use a Splunk relative time (e.g. -3h, -7d, -30s), "
        "a Unix epoch timestamp, or a datetime string matching the "
        "format of the input data."
    )


def _is_datetime_string(value):
    """Return True if *value* is a human-readable datetime string.

    Returns False for Splunk relative-time specifiers (e.g. ``-3h``) and
    numeric epoch timestamps so callers can route parsing (e.g. Splunk UI tz
    vs data-column tz).
    """
    v = str(value).strip()
    if _RELATIVE_TIME_RE.match(v):
        return False
    try:
        float(v)
        return False
    except (ValueError, TypeError):
        return True


def _parse_tz_offset_to_secs(offset_str):
    """Convert a ``%z``-style offset string to signed seconds.

    Examples::

        "+0530"  →  19800
        "-0700"  → -25200
        "+0000"  →  0
    """
    offset_str = offset_str.strip()
    sign = 1 if offset_str[0] == '+' else -1
    hours = int(offset_str[1:3])
    minutes = int(offset_str[3:5])
    return sign * (hours * 3600 + minutes * 60)


def _extract_data_timezone(detected_format, original_sample):
    """Extract the ``tzinfo`` from the data's detected timestamp format.

    If the detected format contains ``%z`` and the *original_sample* can be
    parsed with it, returns the ``datetime.tzinfo`` of the parsed timestamp.
    Otherwise returns ``None``.
    """
    if not detected_format or '%z' not in detected_format:
        return None
    if not original_sample:
        return None
    try:
        sample = _normalize_timestamp_string_for_parse(str(original_sample))
        dt = pd.to_datetime(sample, format=detected_format)
        return dt.tzinfo
    except Exception:
        return None


def predominant_tzinfo_from_timestamp_series(series_dt):
    """Return the most common ``tzinfo`` among non-null pandas Timestamps.

    Used so ``detection_window_*`` parameters without a timezone can be
    localized consistently with the majority of rows in the time column.

    Args:
        series_dt: ``pd.Series`` of ``Timestamp`` values (may be tz-naive or
            tz-aware).

    Returns:
        The mode ``tzinfo``, or ``None`` if all values are tz-naive.
    """
    tzs = []
    for ts in series_dt.dropna():
        if not isinstance(ts, pd.Timestamp):
            ts = pd.Timestamp(ts)
        if ts.tzinfo is not None:
            tzs.append(ts.tzinfo)
    if not tzs:
        return None
    return Counter(tzs).most_common(1)[0][0]


def _localize_naive_detection_window_ts(dt, tz_use):
    """Attach *tz_use* to naive *dt*; raise on ambiguous/nonexistent local times (DST)."""
    dt = pd.Timestamp(dt)
    if dt.tzinfo is not None:
        return dt
    return dt.tz_localize(tz_use, ambiguous="raise", nonexistent="raise")


def parse_detection_window_time(
    value,
    reference_epoch,
    time_format=None,
    *,
    predominant_data_tz=None,
    fallback_data_tz=None,
    naive_wall_tzinfo=None,
    naive_string_data_matches_pandas_utc=False,
):
    """Parse ``detection_window_earliest`` / ``latest`` and ``context_window_*`` with timezone policy.

    Context-window SPL parameters use this same function so resolution matches detection windows.

    * Relative Splunk times (e.g. ``-3h``) and numeric epoch values behave
      like :func:`parse_relative_or_absolute_time`.
    * If the window value is a **timezone-aware** datetime string (explicit
      offset in the parameter), that offset is used as-is.
    * If the window value is **timezone-naive**:
      * *predominant_data_tz* or *fallback_data_tz* (from the time column) win
        when set, so window strings match the same offsets / zone as the data
        (what users read from the field, e.g. ``-07:00`` in raw events).
      * If *naive_string_data_matches_pandas_utc* is True (tz-naive **string**
        time column converted with pandas ``datetime64`` → epoch), use **UTC**
        wall-clock so bounds match :meth:`~algos.PredictAI.PredictAI._convert_time_field_to_seconds`.
      * Otherwise *naive_wall_tzinfo* (Splunk user / UI zone for epoch-only
        numeric ``_time`` when window strings are local wall times).
      * If none of the above are set, naive strings are interpreted as **UTC**
        wall time.

    DST: localization uses ``ambiguous='raise'`` and ``nonexistent='raise'`` so
    invalid or ambiguous local times fail with a clear error.

    Args:
        value: Raw SPL parameter (string or number-like).
        reference_epoch: See :func:`parse_relative_or_absolute_time`.
        time_format: Detected strftime format for the data's time column.
        predominant_data_tz: Mode ``tzinfo`` from the data column (may be
            ``None``).
        fallback_data_tz: Single-sample tz from format (``_extract_data_timezone``).
        naive_wall_tzinfo: Splunk user / UI zone when the column has no usable
            data timezone (epoch or naive-string ``_time``).
        naive_string_data_matches_pandas_utc: If True, naive datetime window
            strings use UTC to match pandas naive string→epoch in the pipeline.

    Returns:
        float epoch seconds (UTC).
    """
    value = str(value).strip()

    if value.startswith("+"):
        raise RuntimeError(
            f"Positive relative time '{value}' is not supported. "
            "Only negative offsets (e.g. -3h) are allowed."
        )

    match = _RELATIVE_TIME_RE.match(value)
    if match:
        amount = int(match.group(1))
        unit = match.group(2)
        offset_secs = amount * _RELATIVE_TIME_UNITS[unit]
        return float(reference_epoch) - offset_secs

    try:
        return float(value)
    except (ValueError, TypeError):
        pass

    formats_to_try = []
    if time_format:
        formats_to_try.append(time_format)
    formats_to_try.extend(PREDEFINED_DATETIME_FORMATS)

    for fmt in formats_to_try:
        try:
            parse_val = _normalize_timestamp_string_for_parse(value) if "%z" in fmt else value
            dt = pd.to_datetime(parse_val, format=fmt, errors="raise")
            if not isinstance(dt, pd.Timestamp):
                dt = pd.Timestamp(dt)

            if dt.tzinfo is not None:
                return float(dt.timestamp())

            tz_use = predominant_data_tz or fallback_data_tz
            if tz_use is None:
                if naive_string_data_matches_pandas_utc:
                    tz_use = dt_timezone.utc
                else:
                    tz_use = naive_wall_tzinfo
            if tz_use is None:
                tz_use = dt_timezone.utc
            dt = _localize_naive_detection_window_ts(dt, tz_use)
            return float(dt.timestamp())
        except RuntimeError:
            raise
        except (ValueError, TypeError):
            continue

    ts = _parse_iso8601_scalar_to_pd_timestamp(value)
    if ts is not None:
        dt = ts if isinstance(ts, pd.Timestamp) else pd.Timestamp(ts)
        if dt.tzinfo is not None:
            return float(dt.timestamp())
        tz_use = predominant_data_tz or fallback_data_tz
        if tz_use is None:
            if naive_string_data_matches_pandas_utc:
                tz_use = dt_timezone.utc
            else:
                tz_use = naive_wall_tzinfo
        if tz_use is None:
            tz_use = dt_timezone.utc
        dt = _localize_naive_detection_window_ts(dt, tz_use)
        return float(dt.timestamp())

    raise RuntimeError(
        f"Cannot parse detection window time '{value}'. "
        "Use a Splunk relative time (e.g. -3h, -7d, -30s), "
        "a Unix epoch timestamp, or a datetime string matching the "
        "format of the input data."
    )
