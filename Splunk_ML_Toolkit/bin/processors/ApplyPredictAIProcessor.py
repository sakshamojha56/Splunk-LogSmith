#!/usr/bin/env python
# Copyright (C) 2015-2019 Splunk Inc. All Rights Reserved.
"""
Specialized processor for PredictAI algorithm that doesn't require a saved model.
PredictAI performs zero-shot inference without any pre-trained model.
"""

import gc
import time

import pandas as pd

import cexc
from .BaseProcessor import BaseProcessor
from util.param_util import convert_params, parse_cdtsm_by_columns
from util.mlspl_loader import MLSPLConf
from util.processor_util import (
    load_sampler_limits,
    get_sampler,
)
from util.telemetry_cdtsm_util import log_cdtsm_time_field_null
from cdtsm_pkg.constants import (
    MODE_ANOMALY,
    MAX_TRAINING_POINTS,
    DEFAULT_CONTEXT_LENGTH,
    DEFAULT_DETECTION_LENGTH,
)

logger = cexc.get_logger(__name__)
messages = cexc.get_messages_logger()


class ApplyPredictAIProcessor(BaseProcessor):
    """
    Apply processor for PredictAI that instantiates the algorithm directly
    without loading a saved model, since PredictAI performs zero-shot inference.
    """

    def __init__(self, process_options, searchinfo):
        """Initialize the PredictAI processor.

        Args:
            process_options (dict): process options containing algorithm parameters
            searchinfo (dict): information required for search
        """
        self.searchinfo = searchinfo
        self.process_options = process_options
        self.namespace = process_options.pop('namespace', None)

        # Create MLSPLConf for configuration loading
        self.mlspl_conf = MLSPLConf(searchinfo)
        self.df = pd.DataFrame()
        self._input_chunks = []
        # Import PredictAI algorithm
        from algos.PredictAI import PredictAI

        # Get params - handle both predictai command and apply command structures
        params = process_options.get("params", {})

        # For apply command with CDTSM, ensure required parameters are present
        if process_options.get('is_ctsm', False):
            # Validate required parameters for CDTSM
            if 'fields_to_forecast' not in params:
                raise RuntimeError(
                    'CDTSM algorithm requires "fields_to_forecast" parameter. '
                    'Usage: | apply CDTSM cpu memory time_field=timestamp [forecast_k=128] [holdback=10]'
                )
            # model_name should already be set by apply.py, but ensure it's there
            if 'model_name' not in params:
                params['model_name'] = 'CDTSM'

        # Initialize the algorithm with options
        self.algo_options = {
            'params': params,
            'algo_name': process_options.get('algo_name', 'PredictAI'),
            'feature_variables': process_options.get('feature_variables', []),
            'target_variable': process_options.get('target_variable', []),
        }

        self.algo = PredictAI(self.algo_options)
        self.algo_name = process_options.get('algo_name', 'PredictAI')

        # Set searchinfo for the algorithm (needed for SCS token and tenant info)
        if hasattr(self.algo, 'set_searchinfo'):
            self.algo.set_searchinfo(searchinfo)

        # Load resource limits
        self.resource_limits = self.load_resource_limits()

        self._max_rows = self._compute_max_rows()

        params = process_options.get("params", {})
        logger.info(
            "ApplyPredictAIProcessor initialized: algo:cdtsm, model:%s, fields_to_forecast:%s, "
            "forecast_k:%s, holdback:%s, max_rows:%s",
            params.get('model_name', 'CDTSM'),
            params.get('fields_to_forecast', 'N/A'),
            getattr(self.algo, 'horizon', None),
            getattr(self.algo, 'holdback', None),
            self._max_rows,
        )

    def load_resource_limits(self):
        """Load algorithm-specific resource limits.

        Returns:
            resource_limits (dict): dictionary of resource limits
        """
        resource_limits = {}
        algo_name = "CDTSM"
        limits = self.mlspl_conf.get_stanza(
            algo_name
        )  # self.process_options.get('mlspl_limits', {})
        resource_limits['max_memory_usage_mb'] = int(limits.get('max_memory_usage_mb', 300))
        resource_limits['streaming_apply'] = False
        return resource_limits

    def get_relevant_fields(self):
        """Return the needed fields.

        For PredictAI, we need the time field and all time series columns.
        Note: We explicitly exclude _time if it's not being used as the time_field
        to avoid Splunk adding empty _time columns.

        Returns:
            relevant_fields (list): list of required field names
        """
        relevant_fields = []

        # Add time_field (default is _time)
        time_field = self.process_options.get('time_field', '_time')
        if time_field not in relevant_fields:
            relevant_fields.append(time_field)

        # Add all time series columns
        columns_str = self.process_options.get('fields_to_forecast', '')
        if columns_str:
            columns = [col.strip() for col in columns_str.split(',') if col.strip()]
            for col in columns:
                if col not in relevant_fields:
                    relevant_fields.append(col)

        params = self.process_options.get('params', {}) or {}
        by_raw = (params.get('by') or '').strip()
        if by_raw:
            for part in parse_cdtsm_by_columns(by_raw):
                if part not in relevant_fields:
                    relevant_fields.append(part)

        # If no specific fields, request all
        if len(relevant_fields) <= 1:  # Only time field
            relevant_fields.append('*')

        logger.debug("CDTSM relevant fields: %s", relevant_fields)
        return relevant_fields

    def _compute_max_rows(self):
        """Compute the maximum rows to keep based on mode and parameters.

        Returns None (no cap) for time-based anomaly detection since the
        detection window size can't be determined without parsing timestamps.
        """
        if self.algo.mode == MODE_ANOMALY:
            if getattr(self.algo, "forecast_by", None):
                return None
            if self.algo._ad_window_earliest is not None:
                return None
            if getattr(self.algo, "_ad_context_window_earliest", None) is not None:
                return None
            if getattr(self.algo, "_ad_context_window_latest", None) is not None:
                return None
            # REVIEW
            ctx = self.algo._ad_context_length or DEFAULT_CONTEXT_LENGTH
            det = self.algo._ad_detection_length or DEFAULT_DETECTION_LENGTH
            return ctx + det
        else:
            if getattr(self.algo, 'forecast_by', None):
                return None
            return MAX_TRAINING_POINTS + self.algo.holdback

    def receive_input(self, df):
        """Receive dataframe and cap to _max_rows to limit memory usage.

        Splunk sends data in chronological order. We keep the most recent
        rows since the model only uses the tail of the data.
        """
        if df is not None and len(df) > 0:
            self._input_chunks.append(df)
        # if self._max_rows is not None and len(self.df) > self._max_rows:
        #     self.df = self.df.tail(self._max_rows)

    def process(self):
        """Process the input dataframe and generate forecasts."""
        # Measure chunk concat + whole-frame field validation as a single
        # "input_assembly" phase so the apply-summary breakdown in apply.py
        # can attribute time spent stitching CEXC chunks together and
        # scanning the assembled frame for missing/empty required fields.
        # For large BY runs (millions of rows across many chunks) this
        # block can be several seconds and is otherwise invisible to the
        # algo's own phase timers.
        _assembly_t0 = time.perf_counter()
        if self._input_chunks:
            if len(self._input_chunks) == 1:
                self.df = self._input_chunks[0]
            else:
                self.df = pd.concat(self._input_chunks)
            self._input_chunks = []

        if len(self.df) == 0:
            messages.warn('CDTSM: received empty dataframe.')
            self.df = pd.DataFrame()
            return

        # Validate that required fields exist and have data
        self._validate_input_fields()
        _assembly_elapsed = time.perf_counter() - _assembly_t0

        try:
            # Call the apply method directly. Note that ``algo.apply`` resets
            # its own per-run timing dict on entry, so we record the
            # input_assembly and processor_teardown buckets *after* it
            # returns. If apply raises we simply lose those numbers — they
            # never make it into the summary, which is fine for failed runs.
            self.df = self.algo.apply(self.df, self.process_options)

            try:
                self.algo._record_cdtsm_apply_timing("input_assembly", _assembly_elapsed)
            except Exception:
                logger.debug("CDTSM: failed to record input_assembly timing", exc_info=True)

            _teardown_t0 = time.perf_counter()
            gc.collect()
            try:
                self.algo._record_cdtsm_apply_timing(
                    "processor_teardown", time.perf_counter() - _teardown_t0
                )
            except Exception:
                logger.debug(
                    "CDTSM: failed to record processor_teardown timing",
                    exc_info=True,
                )

        except Exception as e:
            cexc.log_traceback()
            messages.warn('Error while applying CDTSM: %s' % str(e))
            raise RuntimeError(e)

        if self.df is None:
            messages.warn('CDTSM apply method did not return any results.')
            self.df = pd.DataFrame()

    def _validate_input_fields(self):
        """Validate that required fields exist in input data and are not empty.

        This prevents the issue where Splunk creates empty columns for
        requested fields that don't exist in the source data.

        Raises:
            RuntimeError: If time_field or fields_to_forecast are missing or empty
        """
        params = self.process_options.get('params', {})

        # Get time_field (default is _time)
        time_field = params.get('time_field', '_time')

        # Check if time_field exists
        if time_field not in self.df.columns:
            available_fields = ', '.join(self.df.columns)
            raise RuntimeError(
                f"CDTSM: time_field '{time_field}' not found in input data. "
                f"Available fields: {','.join([col for col in list(self.df.columns) if not col.startswith('__mv')])}. "
                f"Please verify your SPL query includes this field or use time_field parameter to specify a different field."
            )

        # Check if time_field has any non-null values
        if self.df[time_field].isna().all():
            log_cdtsm_time_field_null(
                is_groupby=1 if getattr(self.algo, "forecast_by", None) else 0
            )
            raise RuntimeError(
                f"CDTSM: time_field '{time_field}' either does not exist / contains only non_numeric/null/empty values. "
                f"Please verify your SPL query is correctly retrieving the time field."
            )

        # Get fields_to_forecast
        fields_to_forecast_str = params.get('fields_to_forecast', '')
        if fields_to_forecast_str:
            fields_to_forecast = [
                col.strip().strip('"').strip("'")
                for col in fields_to_forecast_str.split(',')
                if col.strip()
            ]

            # Check if wildcard '*' is used - skip field validation as columns will be resolved dynamically
            if '*' in fields_to_forecast:
                logger.info(
                    "CDTSM: Wildcard '*' specified - skipping field existence validation, "
                    "columns will be resolved dynamically from available numeric fields"
                )
            else:
                # Check each field
                missing_fields = []
                empty_fields = []

                for field in fields_to_forecast:
                    if field not in self.df.columns:
                        missing_fields.append(field)
                    elif self.df[field].isna().all():
                        empty_fields.append(field)

                # Report missing fields
                if missing_fields:
                    available_fields = ', '.join(self.df.columns)
                    _mode = str(params.get('mode', 'forecast')).strip().lower()
                    _fields_phrase = (
                        "fields_to_detect_anomaly"
                        if _mode == MODE_ANOMALY
                        else "fields_to_forecast"
                    )
                    raise RuntimeError(
                        f"CDTSM: The following fields from {_fields_phrase} were not found in input data: {', '.join(missing_fields)}. "
                        f"Available fields: {','.join([col for col in list(self.df.columns) if not col.startswith('__mv')])}. "
                        f"Please verify your SPL query includes these fields."
                    )

                # Report empty fields
                if empty_fields:
                    raise RuntimeError(
                        f"CDTSM: The following fields exist but contain only non_numeric/null/empty values: {', '.join(empty_fields)}. "
                        f"Please verify your SPL query is correctly retrieving data for these fields."
                    )

        by_cols = parse_cdtsm_by_columns(params.get('by'))
        for by_col in by_cols:
            if by_col not in self.df.columns:
                raise RuntimeError(
                    f"CDTSM: BY grouping column '{by_col}' not found in input data. "
                    f"Available fields: {','.join([col for col in list(self.df.columns) if not col.startswith('__mv')])}. "
                    f"Please verify your SPL query includes this field."
                )
            if self.df[by_col].isna().all():
                raise RuntimeError(
                    f"CDTSM: BY grouping column '{by_col}' exists but contains only null/empty values."
                )

        logger.info(
            f"CDTSM: Input field validation passed - :'{time_field}', fields_to_forecast:{fields_to_forecast_str}"
        )
