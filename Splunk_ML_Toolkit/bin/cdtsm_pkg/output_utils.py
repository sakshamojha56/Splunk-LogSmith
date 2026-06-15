"""Epoch-to-original time conversion and datetime format detection."""

import math
import re
from datetime import datetime as dt

import numpy as np
import pandas as pd

import cexc
from cdtsm_pkg.time_utils import (
    _normalize_for_roundtrip,
    _get_frac_sec_precision,
    _trim_frac_seconds,
)
from cdtsm_pkg.constants import (
    CDTSM_INTERNAL_ROW_TZ_COLUMN,
    PREDEFINED_DATETIME_FORMATS,
)


def _format_epoch_series_with_per_row_tz(
    epoch_series,
    tz_series,
    strftime_fmt,
    *,
    fallback_tz=None,
    use_colon_in_offset=False,
):
    """Format epoch seconds using each row's ``tzinfo`` (mixed ``%z`` / DST).

    ``strftime`` emits ``±HHMM`` for ``%z``; ``use_colon_in_offset`` rewrites
    to RFC 3339 ``±HH:MM`` when the original input used a colon.
    """
    out = []
    for i in range(len(epoch_series)):
        e = epoch_series.iloc[i]
        tz = tz_series.iloc[i]
        ts = pd.to_datetime(e, unit="s", utc=True)
        if tz is not None:
            ts = ts.tz_convert(tz)
        elif fallback_tz is not None:
            ts = ts.tz_convert(fallback_tz)
        s = ts.strftime(strftime_fmt)
        if use_colon_in_offset and "%z" in strftime_fmt:
            s = re.sub(r"([+-]\d{2})(\d{2})$", r"\1:\2", s)
        out.append(s)
    return pd.Series(out, index=epoch_series.index)


logger = cexc.get_logger(__name__)
messages = cexc.get_messages_logger()


class OutputUtilsMixin:
    def _convert_epoch_seconds_to_original_time(self, df):
        """Convert the time field from internal epoch seconds back to its
        original format (string, datetime64, numeric epoch with correct unit).

        This is the single canonical output conversion method. Both the
        forecast and anomaly-detection code paths must use it so that
        timezone, fractional-second precision, and epoch-unit handling are
        consistent.
        """
        if self._is_unix_timestamp:
            _EPOCH_MULTIPLIERS = {'s': 1, 'ms': 1_000, 'us': 1_000_000, 'ns': 1_000_000_000}
            multiplier = _EPOCH_MULTIPLIERS.get(self._epoch_unit, 1)

            if multiplier != 1:
                df[self.time_field] = (df[self.time_field].values * multiplier).astype('int64')
                logger.info(
                    "CDTSM: Converted time field '%s' back to epoch %s (multiplier=%d)",
                    self.time_field,
                    self._epoch_unit,
                    multiplier,
                )

            if self._time_was_string:
                df[self.time_field] = df[self.time_field].astype(str)
                logger.info(
                    "CDTSM: Converted time field '%s' back to string-encoded epoch",
                    self.time_field,
                )
            else:
                logger.info(
                    "CDTSM: Keeping time field '%s' as numeric epoch (unit=%s)",
                    self.time_field,
                    self._epoch_unit,
                )

        elif self._time_was_datetime64:
            logger.info(
                "CDTSM: Converting time field '%s' back to datetime64 format",
                self.time_field,
            )
            dt_series = pd.to_datetime(df[self.time_field], unit='s')
            if self._data_tz is not None:
                dt_series = dt_series.dt.tz_localize('UTC').dt.tz_convert(self._data_tz)
            df[self.time_field] = dt_series
            logger.info("CDTSM: Successfully converted timestamps back to datetime64")

        elif self._time_was_string and self._detected_time_format:
            tz_col = CDTSM_INTERNAL_ROW_TZ_COLUMN
            if tz_col in df.columns and df[tz_col].notna().any():
                use_colon = getattr(self, "_original_time_tz_offset_has_colon", False)
                formatted = _format_epoch_series_with_per_row_tz(
                    df[self.time_field],
                    df[tz_col],
                    self._detected_time_format,
                    fallback_tz=self._data_tz,
                    use_colon_in_offset=use_colon,
                )
                if "%f" in self._detected_time_format and self._frac_sec_precision < 6:
                    formatted = _trim_frac_seconds(formatted, self._frac_sec_precision)
                df[self.time_field] = formatted
                df.drop(columns=[tz_col], inplace=True)
                logger.info(
                    "CDTSM: Converted timestamps using per-row timezone offsets "
                    "(mixed %z / DST preserved)"
                )
            else:
                datetime_series = pd.to_datetime(df[self.time_field], unit="s")

                if self._data_tz is not None:
                    datetime_series = datetime_series.dt.tz_localize("UTC").dt.tz_convert(
                        self._data_tz
                    )
                    logger.info(
                        "CDTSM: Converted UTC datetimes to data timezone %s",
                        self._data_tz,
                    )

                formatted = datetime_series.dt.strftime(self._detected_time_format)
                if "%f" in self._detected_time_format and self._frac_sec_precision < 6:
                    formatted = _trim_frac_seconds(formatted, self._frac_sec_precision)
                df[self.time_field] = formatted
                logger.info("CDTSM: Successfully converted timestamps to original format")

        elif self._time_was_string and self._original_time_sample:
            datetime_series = pd.to_datetime(df[self.time_field], unit='s')

            if self._data_tz is not None:
                datetime_series = datetime_series.dt.tz_localize('UTC').dt.tz_convert(
                    self._data_tz
                )
                logger.info(
                    "CDTSM: Converted UTC datetimes to data timezone %s",
                    self._data_tz,
                )

            format_str = self._detect_datetime_format(self._original_time_sample)

            if format_str:
                formatted = datetime_series.dt.strftime(format_str)
                if '%f' in format_str:
                    orig_prec = _get_frac_sec_precision(self._original_time_sample)
                    if orig_prec < 6:
                        formatted = _trim_frac_seconds(formatted, orig_prec)
                df[self.time_field] = formatted
                logger.info("CDTSM: Converted to string format: %s", format_str)
            else:
                df[self.time_field] = datetime_series.astype(str)
                logger.info("CDTSM: Converted to default string format")

        else:
            logger.info(
                "CDTSM: Keeping time field '%s' as numeric (seconds since epoch)",
                self.time_field,
            )

        return df

    def _finalize_apply_output_timestamps(self, df):
        """Last step of CDTSM ``apply`` (forecast or anomaly): map epochs to original timestamps.

        Internal pipeline uses epoch seconds (including restored wall-clock values after repair).
        This converts the time column to the ingest representation (string, datetime64, or scaled
        epoch) via :meth:`_convert_epoch_seconds_to_original_time`, then mirrors ``_time`` for
        ForecastViz when the configured time column is not ``_time``.
        """
        if df is None or df.empty:
            return df
        if "_time" in df.columns and self.time_field != "_time":
            df.drop(columns=["_time"], errors="ignore", inplace=True)
        df = self._convert_epoch_seconds_to_original_time(df)
        if self.time_field != "_time":
            df["_time"] = df[self.time_field]
        return df

    def _detect_datetime_format(self, sample_str):
        """Detect datetime format string from a sample timestamp string.

        This method uses a comprehensive approach to detect the format:
        1. Parse the sample with pd.to_datetime (which handles many formats)
        2. Try various format patterns to find which one reproduces the original string
        3. Builds format strings dynamically based on structure analysis

        Args:
            sample_str (str): Sample timestamp string

        Returns:
            str: Format string for strftime, or None if format cannot be detected
        """
        try:
            parsed_dt = pd.to_datetime(sample_str)

            format_patterns = [
                # ISO formats
                '%Y-%m-%dT%H:%M:%S.%fZ',  # 2024-01-01T00:00:00.000000Z
                '%Y-%m-%dT%H:%M:%S.%f',  # 2024-01-01T00:00:00.000000
                '%Y-%m-%dT%H:%M:%SZ',  # 2024-01-01T00:00:00Z
                '%Y-%m-%dT%H:%M:%S',  # 2024-01-01T00:00:00
                '%Y-%m-%dT%H:%M',  # 2024-01-01T00:00
                # Standard formats with dashes
                '%Y-%m-%d %H:%M:%S.%f',  # 2024-01-01 00:00:00.000000
                '%Y-%m-%d %H:%M:%S',  # 2024-01-01 00:00:00
                '%Y-%m-%d %H:%M',  # 2024-01-01 00:00
                '%Y-%m-%d',  # 2024-01-01
                # Formats with slashes
                '%Y/%m/%d %H:%M:%S.%f',  # 2024/01/01 00:00:00.000000
                '%Y/%m/%d %H:%M:%S',  # 2024/01/01 00:00:00
                '%Y/%m/%d %H:%M',  # 2024/01/01 00:00
                '%Y/%m/%d',  # 2024/01/01
                # US formats (month/day/year)
                '%m/%d/%Y %H:%M:%S.%f',  # 01/01/2024 00:00:00.000000
                '%m/%d/%Y %H:%M:%S',  # 01/01/2024 00:00:00
                '%m/%d/%Y %H:%M',  # 01/01/2024 00:00
                '%m/%d/%Y',  # 01/01/2024
                '%m-%d-%Y %H:%M:%S',  # 01-01-2024 00:00:00
                '%m-%d-%Y',  # 01-01-2024
                # European formats (day/month/year)
                '%d/%m/%Y %H:%M:%S.%f',  # 01/01/2024 00:00:00.000000
                '%d/%m/%Y %H:%M:%S',  # 01/01/2024 00:00:00
                '%d/%m/%Y %H:%M',  # 01/01/2024 00:00
                '%d/%m/%Y',  # 01/01/2024
                '%d-%m-%Y %H:%M:%S',  # 01-01-2024 00:00:00
                '%d-%m-%Y',  # 01-01-2024
                '%d.%m.%Y %H:%M:%S',  # 01.01.2024 00:00:00
                '%d.%m.%Y',  # 01.01.2024
                # Compact formats
                '%Y%m%d%H%M%S',  # 20240101000000
                '%Y%m%d%H%M',  # 202401010000
                '%Y%m%d',  # 20240101
                # Formats with text month
                '%d %b %Y %H:%M:%S',  # 01 Jan 2024 00:00:00
                '%d %b %Y',  # 01 Jan 2024
                '%d %B %Y %H:%M:%S',  # 01 January 2024 00:00:00
                '%d %B %Y',  # 01 January 2024
                '%b %d %Y %H:%M:%S',  # Jan 01 2024 00:00:00
                '%b %d %Y',  # Jan 01 2024
                '%B %d %Y %H:%M:%S',  # January 01 2024 00:00:00
                '%B %d %Y',  # January 01 2024
                # RFC formats
                '%a, %d %b %Y %H:%M:%S',  # Mon, 01 Jan 2024 00:00:00
                '%a %b %d %H:%M:%S %Y',  # Mon Jan 01 00:00:00 2024
                # With timezone info
                '%Y-%m-%d %H:%M:%S%z',  # 2024-01-01 00:00:00+0000
                '%Y-%m-%d %H:%M:%S %Z',  # 2024-01-01 00:00:00 UTC
            ]

            for fmt in format_patterns:
                try:
                    formatted = parsed_dt.strftime(fmt)
                    fmt_norm = _normalize_for_roundtrip(pd.Series([formatted]), fmt).iloc[0]
                    sample_norm = _normalize_for_roundtrip(
                        pd.Series([sample_str.strip()]), fmt
                    ).iloc[0]
                    if fmt_norm == sample_norm:
                        return fmt
                except (ValueError, AttributeError):
                    continue

            format_from_structure = self._infer_format_from_structure(sample_str, parsed_dt)
            if format_from_structure:
                return format_from_structure

            logger.warning(
                "CDTSM: Could not detect exact datetime format from sample: %s, will use pandas default",
                sample_str,
            )
            return None

        except Exception as e:
            logger.warning(
                "CDTSM: Error detecting datetime format from sample '%s': %s",
                sample_str,
                str(e),
            )
            return None

    def _infer_format_from_structure(self, sample_str, parsed_dt):
        """Infer datetime format by analyzing string structure.

        Args:
            sample_str (str): Original datetime string
            parsed_dt: Parsed datetime object

        Returns:
            str: Format string, or None if cannot infer
        """
        parts = []

        if '-' in sample_str and 'T' in sample_str:
            parts.append('%Y-%m-%dT%H:%M:%S')
        elif '-' in sample_str:
            if sample_str.index('-') < 5:
                parts.append('%d-%m-%Y')
            else:
                parts.append('%Y-%m-%d')
        elif '/' in sample_str:
            slash_pos = sample_str.index('/')
            if slash_pos <= 2:
                try:
                    dt_parts = sample_str.split()[0].split('/')
                    if int(dt_parts[0]) > 12:
                        parts.append('%d/%m/%Y')
                    else:
                        parts.append('%m/%d/%Y')
                except:
                    parts.append('%m/%d/%Y')
            else:
                parts.append('%Y/%m/%d')

        if ':' in sample_str:
            if '.' in sample_str.split()[-1]:
                if parts:
                    parts[0] += ' %H:%M:%S.%f'
                else:
                    return '%H:%M:%S.%f'
            else:
                if parts:
                    parts[0] += ' %H:%M:%S'
                else:
                    return '%H:%M:%S'

        if parts:
            return parts[0]

        return None
