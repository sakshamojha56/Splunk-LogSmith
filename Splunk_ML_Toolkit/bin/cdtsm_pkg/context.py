"""Coarse/fine context building and time-resolution detection."""

import math
from typing import Any, List, Optional, Tuple, Union, Sequence

import numpy as np
import pandas as pd

import cexc

from cdtsm_pkg.constants import (
    DEFAULT_COARSE_BLOCK_SIZE,
    FIXED_BLOCK_SIZE,
    FIXED_FINE_LEN,
    FIXED_MAX_COARSE_CTX_POINTS,
    MAX_COARSE_CTX_POINTS,
    MAX_FINE_CTX_POINTS,
)

logger = cexc.get_logger(__name__)


class ContextMixin:
    """Mixin supplying context-window construction for CDTSM forecasting."""

    def _detect_time_resolution(self, df):
        """Detect time resolution from the dataframe.

        Note: Time field is already in seconds (Unix timestamp) at this point.

        Args:
            df (pd.DataFrame): Input dataframe with time field in seconds

        Returns:
            int: Time resolution in seconds (60 or 300)
        """
        if len(df) < 2:
            return 60

        df_sorted = df.sort_values(self.time_field)
        try:
            time_series = df_sorted[self.time_field].astype('int64')
            time_diffs = time_series.diff().dropna()
            if not time_diffs.empty:
                detected_diff = int(time_diffs.unique()[0])
                logger.info("CDTSM: Detected time resolution: %d seconds", detected_diff)
                return detected_diff
        except Exception as e:
            logger.warning("CDTSM: Could not detect time resolution: %s", str(e))

        logger.info("CDTSM: Using default time resolution: 60 seconds")
        return 60

    def _coarse_block_size_for_len(self, n: int) -> int:
        """Block size for :meth:`build_coarse_context`: ``FIXED_BLOCK_SIZE`` or full series if shorter.

        When the fine-resolution series has fewer than :data:`FIXED_BLOCK_SIZE` points, each
        coarse bucket aggregates the entire series (one coarse point), so the API still receives
        non-empty coarse context.
        """
        n = int(n)
        if n < 1:
            return 1
        if n < FIXED_BLOCK_SIZE:
            return n
        return FIXED_BLOCK_SIZE

    def _get_resolution_params(self, fine_series_len: Optional[int] = None):
        """Return coarse block size and fine context length.

        ``fine_series_len`` is the number of fine-resolution points (e.g. training rows). When
        omitted, the nominal :data:`FIXED_BLOCK_SIZE` is returned (e.g. callers without a series).

        Returns:
            tuple: (block_size, fine_len)
        """
        fine_len = FIXED_FINE_LEN
        if fine_series_len is None:
            block_size = FIXED_BLOCK_SIZE
        else:
            block_size = self._coarse_block_size_for_len(fine_series_len)
        return block_size, fine_len

    def strip_leading_nans(self, arr):
        """
        Removes contiguous NaN values from the beginning of a NumPy array.

        Args:
        arr: The input NumPy array.

        Returns:
        A new NumPy array with leading NaN values removed.
        If the array is all NaNs or empty, returns an empty array.
        """

        isnan = np.isnan(arr)
        first_valid_index = np.argmax(~isnan)
        return arr[first_valid_index:]

    def linear_interpolation(self, arr):
        """
        Performs linear interpolation to fill NaN values in a 1D numpy array.

        Args:
            arr: The 1D numpy array containing NaN values.

        Returns:
            A new numpy array with NaN values filled using linear interpolation,
            or the original array if no NaNs are present.
            Returns None if the input is not a 1D array.
            Returns the original array if there are no NaN values.
        """

        nans = np.isnan(arr)
        if not np.any(nans):  # Check if there are any NaNs
            return arr

        def x(z):
            return z.nonzero()[0]

        nans_indices = x(nans)
        non_nans_indices = x(~nans)
        non_nans_values = arr[~nans]

        try:
            arr[nans] = np.interp(nans_indices, non_nans_indices, non_nans_values)
        except ValueError:
            if len(non_nans_values) > 0:
                mu = np.nanmean(arr)
            else:
                mu = 0.0
            arr = np.where(np.isfinite(arr), arr, mu)
        return arr

    def _replace_non_finite(self, arr: np.ndarray) -> np.ndarray:
        """Replaces non-finite values (inf, -inf) in the array with NaN.
        Args:
          arr: input numpy array.
        Returns:
          numpy array with non-finite values replaced by NaN.
        """
        if arr.size == 0:
            return arr
        if np.isfinite(arr).all():
            return arr
        arr = arr.copy()
        arr[~np.isfinite(arr)] = np.nan

        return arr

    def _preprocess_series(self, series: Union[np.ndarray, Sequence[float]]) -> np.ndarray:
        """Apply the non-finite cleanup and gap filling.
        Args:
          series: 1D array-like of fine-resolution time series data.
        Returns:
          1D numpy array with non-finite values replaced and gaps filled via linear interpolation.
        """
        series = np.asarray(series, dtype=np.float32).reshape(-1)
        series = self._replace_non_finite(series)
        series = np.asarray(self.strip_leading_nans(series), dtype=np.float32).reshape(-1)

        if series.size == 0:
            return series

        series = np.asarray(self.linear_interpolation(series), dtype=np.float32).reshape(-1)
        return series

    def build_coarse_context(
        self,
        series: np.ndarray,
        agg_factor: int = DEFAULT_COARSE_BLOCK_SIZE,
        max_coarse_ctx: int = MAX_COARSE_CTX_POINTS,
    ) -> np.ndarray:
        """Construct a gap-filled coarse context by:
        1. Cleaning non-finite values and interpolating gaps on the full fine series.
        2. Taking up to rightmost (max_coarse_ctx * block) raw fine samples.
        3. Partitioning into consecutive non-overlapping blocks of 'block' size from left to right (chronological order preserved).
        4. Computing the mean of each block.

        Args:
          series: array of fine-resolution (e.g minute-level) time series data.
          agg_factor: aggregation factor to form coarse blocks.
          max_coarse_ctx: maximum number of coarse points to return.

        Returns:
          1D array representing coarse context with length <= max_coarse_ctx.
        """
        logger.debug("CDTSM: Building coarse context with updated functions")
        series = self._preprocess_series(series)
        return self._build_coarse_context_from_preprocessed(
            series,
            agg_factor=agg_factor,
            max_coarse_ctx=max_coarse_ctx,
        )

    def _build_coarse_context_from_preprocessed(
        self,
        series: np.ndarray,
        agg_factor: int = DEFAULT_COARSE_BLOCK_SIZE,
        max_coarse_ctx: int = MAX_COARSE_CTX_POINTS,
    ) -> np.ndarray:
        """Aggregate a preprocessed fine series into coarse blocks.

        Matches the server-side ``build_multi_resolution`` invariant: for any non-empty
        preprocessed series the coarse context is non-empty. When the available raw
        window is shorter than one ``agg_factor`` block, the remaining points are
        aggregated into a single coarse bucket (effectively shrinking the block) so
        the API always receives at least one coarse point.
        """
        agg_factor = max(1, int(agg_factor))
        needed_raw = max_coarse_ctx * agg_factor
        raw_slice = series[-needed_raw:]

        if raw_slice.shape[0] == 0:
            return np.empty((0,), dtype=np.float32)

        # When the available window is shorter than one block, aggregate all
        # available samples into a single coarse point instead of dropping
        # everything (the previous behaviour produced an empty coarse context
        # when ``len(series) < agg_factor``).
        if raw_slice.shape[0] < agg_factor:
            coarse = np.asarray([raw_slice.mean(dtype=np.float32)], dtype=np.float32)
            return coarse

        # Ensure we only form full blocks; drop partial leading block if length not multiple.
        remainder = raw_slice.shape[0] % agg_factor
        if remainder:
            raw_slice = raw_slice[remainder:]  # align to block boundary at the right edge

        coarse = raw_slice.reshape(-1, agg_factor).mean(axis=1, dtype=np.float32)
        if coarse.shape[0] > max_coarse_ctx:
            coarse = coarse[-max_coarse_ctx:]
        return coarse.astype(np.float32, copy=False)

    # def build_coarse_context(
    #     self,
    #     series: np.ndarray,
    #     max_coarse_ctx: int = MAX_COARSE_CTX_POINTS,
    #     block: int = DEFAULT_COARSE_BLOCK_SIZE,
    # ) -> List[float]:
    #     """Construct coarse context by:
    #        1. Taking up to rightmost (max_coarse_ctx * block) raw fine samples.
    #        2. Partitioning into consecutive non-overlapping blocks of 'block' size from left to right (chronological order preserved).
    #        3. Computing the mean of each block.

    #     Args:
    #       series: array of fine-resolution (fine-level) time series data.
    #       max_coarse_ctx: maximum number of coarse points to return.
    #       block: number of fine samples to aggregate into one coarse sample.
    #     Returns:
    #       List of floats representing coarse means with length <= max_coarse_ctx.
    #     """
    #     needed_raw = max_coarse_ctx * block
    #     raw_slice = series[-needed_raw:]
    #     remainder = len(raw_slice) % block
    #     if remainder != 0:
    #         raw_slice = raw_slice[remainder:]
    #     coarse = []
    #     for i in range(0, len(raw_slice), block):
    #         block_vals = raw_slice[i : i + block]
    #         if len(block_vals) < block:
    #             break
    #         coarse.append(float(sum(block_vals) / block))
    #     return coarse[-max_coarse_ctx:]

    def slice_fine_context(
        self,
        series: Union[np.ndarray, Sequence[float]],
        fine_len: int = MAX_FINE_CTX_POINTS,
    ) -> np.ndarray:
        """Return the rightmost gap-filled fine_len points (or entire series if shorter).

        Args:
          series: fine-resolution (e.g minute-level) time series data.
          fine_len: desired length of fine-level context to extract.

        Returns:
          1D array representing the fine-level context of length <= fine_len.
        """
        logger.debug("CDTSM: Building fine context with updated functions")

        series = self._preprocess_series(series)
        return self._slice_fine_context_from_preprocessed(series, fine_len=fine_len)

    def _slice_fine_context_from_preprocessed(
        self,
        series: np.ndarray,
        fine_len: int = MAX_FINE_CTX_POINTS,
    ) -> np.ndarray:
        """Return the rightmost fine_len points from a preprocessed series (non-finite values already handled and gaps filled)."""
        return series[-fine_len:]

    @staticmethod
    def _normalize_inputs(inputs: Any) -> List[dict]:
        """Mirror server-side ``_normalize_inputs`` for client-side context building.

        Accepts a single series or list/tuple of series. Each series can be:
        - single-resolution: list-like or array-like of fine-resolution data
        - multi-resolution: 2-tuple/list of ``(coarse_series, fine_series)``

        Returns a list of dicts with keys:
        - ``multi_res`` (bool)
        - ``coarse`` (1D float32 ndarray, only when ``multi_res`` is True)
        - ``fine`` (1D float32 ndarray)

        For the CDTSM client, callers pass a single 1D series so the result is
        always ``[{"multi_res": False, "fine": <1d float32 array>}]``. The full
        normalize / multi-res branch is kept for parity with the server so the
        same code path is taken regardless of how a future caller hands input in.
        """

        def _to_numpy_1d(x: Any) -> np.ndarray:
            if isinstance(x, np.ndarray):
                return np.asarray(x, dtype=np.float32).reshape(-1)
            if isinstance(x, (list, tuple)):
                return np.asarray(x, dtype=np.float32).reshape(-1)
            return np.asarray([x], dtype=np.float32)

        if isinstance(inputs, np.ndarray):
            return [{"multi_res": False, "fine": _to_numpy_1d(inputs)}]

        if not isinstance(inputs, (list, tuple)):
            return [{"multi_res": False, "fine": _to_numpy_1d(inputs)}]

        if inputs and all(not isinstance(x, (list, tuple, np.ndarray)) for x in inputs):
            return [{"multi_res": False, "fine": _to_numpy_1d(inputs)}]

        normalized_series: List[dict] = []
        for elem in inputs:
            if (
                isinstance(elem, (list, tuple))
                and len(elem) == 2
                and all(isinstance(sub, (list, tuple, np.ndarray)) for sub in elem)
            ):
                normalized_series.append(
                    {
                        "multi_res": True,
                        "coarse": _to_numpy_1d(elem[0]),
                        "fine": _to_numpy_1d(elem[1]),
                    }
                )
            else:
                normalized_series.append({"multi_res": False, "fine": _to_numpy_1d(elem)})

        return normalized_series

    def build_multi_resolution(
        self,
        series: Union[np.ndarray, Sequence[float]],
        agg_factor: int = FIXED_BLOCK_SIZE,
    ) -> Tuple[np.ndarray, np.ndarray]:
        """Mirror server-side ``build_multi_resolution`` exactly.

        Steps:
          1. ``_preprocess_series(series)`` — non-finite cleanup, leading-NaN
             trim, linear interpolation of interior gaps.
          2. ``_build_coarse_context_from_preprocessed`` with the supplied
             ``agg_factor`` (defaults to :data:`FIXED_BLOCK_SIZE`) and
             :data:`FIXED_MAX_COARSE_CTX_POINTS` — invariant: any non-empty
             preprocessed series yields a non-empty coarse context (when
             ``len(series) < agg_factor`` all available samples collapse into a
             single coarse bucket).
          3. ``_slice_fine_context_from_preprocessed`` with
             :data:`FIXED_FINE_LEN`.

        Returns:
            Tuple ``(coarse_ctx, fine_ctx)`` of 1D float32 arrays.
        """
        series = self._preprocess_series(series)
        coarse_ctx = self._build_coarse_context_from_preprocessed(
            series,
            agg_factor=agg_factor,
            max_coarse_ctx=FIXED_MAX_COARSE_CTX_POINTS,
        )
        fine_ctx = self._slice_fine_context_from_preprocessed(series, fine_len=FIXED_FINE_LEN)
        return coarse_ctx, fine_ctx

    def _build_payload_contexts(
        self,
        series: Union[np.ndarray, Sequence[float]],
        agg_factor: int = FIXED_BLOCK_SIZE,
    ) -> Tuple[np.ndarray, np.ndarray]:
        """Single entry point used by every API payload-building site (forecast/anomaly,
        BY/non-BY) to derive ``(coarse_ctx, fine_ctx)`` from one preprocessed
        time series.

        Mirrors the server flow: pass the (already preprocessed by the SPL
        pipeline) input through :meth:`_normalize_inputs`, then for each item
        run the multi_res if/else block. Single-resolution 1D arrays — the
        only shape this client emits — always reach
        :meth:`build_multi_resolution`, so coarse/fine contexts are derived
        with a fixed ``agg_factor`` (=:data:`FIXED_BLOCK_SIZE`) and the fixed
        max-coarse / fine lengths, matching the server exactly.
        """
        normalized = self._normalize_inputs(series)
        if not normalized:
            return (
                np.empty((0,), dtype=np.float32),
                np.empty((0,), dtype=np.float32),
            )
        item = normalized[0]
        if item.get("multi_res"):
            coarse_ctx = self._preprocess_series(item["coarse"])
            fine_ctx = self._preprocess_series(item["fine"])
        else:
            coarse_ctx, fine_ctx = self.build_multi_resolution(
                item["fine"], agg_factor=agg_factor
            )
        return coarse_ctx, fine_ctx

    # def slice_fine_context(
    #     self, series: List[float], fine_len: int = MAX_FINE_CTX_POINTS
    # ) -> List[float]:
    #     """Return the rightmost fine_len points (or entire series if shorter).
    #     Args:
    #       series: list or array of fine-resolution (fine-level) time series data.
    #       fine_len: desired length of fine-level context to extract.
    #     Returns:
    #       List of floats representing the fine-level context of length <= fine_len.
    #     """
    #     return series[-fine_len:]

    def _percentile_to_api_key(self, percentile):
        """Convert percentile name to API response key format.

        The API returns percentiles with p-notation:
        - p10 -> "p10"
        - p20 -> "p20"
        - p90 -> "p90"
        - mean -> "mean" (unchanged)

        Args:
            percentile (str): Percentile name (e.g., "p10", "p90", "mean")

        Returns:
            str: API key format (same as input for new API)
        """
        return percentile
