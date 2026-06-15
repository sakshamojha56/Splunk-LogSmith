#!/usr/bin/env python
# Copyright (C) 2015-2019 Splunk Inc. All Rights Reserved.
import gc
import json
import pandas as pd
import cexc

from .BaseProcessor import BaseProcessor
from util.searchinfo_util import is_parsetmp
from util.ai_commander_util import handle_secrets
from ai_commander.constants import CLEAR_PASSWORD
from vertex_int.endpoint_invoker import VertexInvoker
from vertex_int.constants import (
    VERTEX_PROVIDER_PREFIX,
    VERTEX_SECRETS_REALM,
    VERTEX_MODEL_ALGO_NAME,
)
from util.vertex_util_extensions import get_vertex_model_options_from_disk

logger = cexc.get_logger(__name__)
messages = cexc.get_messages_logger()


class ApplyVertexProcessor(BaseProcessor):
    """Vertex Apply Processor - Invokes Vertex AI endpoints for model inference."""

    def __init__(self, process_options, searchinfo):
        self.searchinfo = searchinfo
        (
            self.algo_name,
            self.algo,
            self.process_options,
            self.namespace,
        ) = ApplyVertexProcessor.setup_model(process_options, self.searchinfo)
        self.resource_limits = ApplyVertexProcessor.load_resource_limits(
            self.algo_name, self.process_options
        )
        self.invoke_metrics = None
        self._chunk_counter = 0

    def get_relevant_fields(self):
        """Return the feature field names needed for Vertex inference."""
        feature_variables = self.process_options.get('feature_variables', [])

        if isinstance(feature_variables, str):
            if feature_variables.strip():
                relevant_fields = [f.strip() for f in feature_variables.split(',')]
            else:
                relevant_fields = []
        elif isinstance(feature_variables, list):
            relevant_fields = list(feature_variables)
        else:
            relevant_fields = []

        split_by = self.process_options.get('split_by', [])
        if split_by:
            relevant_fields.extend(split_by)

        features_param = self.process_options.get("params", {}).get("features", "")
        if features_param:
            spl_features = []
            for feature in features_param.split(','):
                feature = feature.strip().strip('"').strip("'")
                if feature:
                    spl_features.append(feature)
            relevant_fields = spl_features

        if '_time' not in relevant_fields:
            relevant_fields.append('_time')

        if len(relevant_fields) <= 1:
            relevant_fields.append('*')
            logger.warning("No specific feature fields found, using wildcard")

        return relevant_fields

    @classmethod
    def setup_model(cls, process_options, searchinfo):
        """
        Load Vertex model configuration and initialize endpoint invoker.

        Steps:
        1. Handle parsetmp search (skip model loading)
        2. Load model configuration from lookup table
        3. Verify runtime is Vertex
        4. Load GCP credentials from secure storage
        5. Initialize VertexInvoker with credentials
        """
        namespace = process_options.pop('namespace', None)
        mlspl_conf = process_options.pop('mlspl_conf')

        if is_parsetmp(searchinfo):
            process_options['mlspl_limits'] = {}
            process_options['feature_variables'] = ['*']
            return None, None, process_options, None

        try:
            model_name = process_options['model_name']

            algo_name, model_data, model_options = get_vertex_model_options_from_disk(
                model_name=model_name, searchinfo=searchinfo, namespace=namespace
            )

            if model_options.get('runtime') != 'vertex':
                raise RuntimeError(
                    f"Model '{model_name}' is not a Vertex model (runtime: {model_options.get('runtime')})"
                )

            original_model_name = model_options.get('model_name', model_name)
            model_options.update(process_options)
            process_options = model_options
            process_options['mlspl_limits'] = mlspl_conf.get_stanza(VERTEX_MODEL_ALGO_NAME)

            gcp_credentials = cls._load_gcp_credentials(original_model_name, searchinfo)
            endpoint_name = process_options.get('endpoint_name', '')

            algo = VertexInvoker(gcp_credentials=gcp_credentials, endpoint_name=endpoint_name)

            logger.info("Loaded Vertex model configuration")
            return algo_name, algo, process_options, namespace

        except Exception as exc:
            model_name = process_options.get('model_name', 'unknown')
            cexc.log_traceback()
            logger.error(f"Failed to load Vertex model '{model_name}': {str(exc)}")

            if (
                "does not exist" in str(exc)
                or "No such file" in str(exc)
                or "Invalid model name" in str(exc)
            ):
                raise RuntimeError(
                    f"Vertex model '{model_name}' is not registered. Please register the model"
                )
            if "credentials" in str(exc).lower() or "password" in str(exc).lower():
                raise RuntimeError(
                    f"Unable to access credentials for model '{model_name}'. The model may need to be re-registered."
                )
            if "runtime" in str(exc).lower():
                raise RuntimeError(
                    f"Model '{model_name}' is not a Vertex model. Please use the correct apply command for this model type."
                )
            raise RuntimeError(
                f"Unable to load model '{model_name}'. Please check the model configuration or contact your administrator."
            )

    @classmethod
    def _load_gcp_credentials(cls, model_name, searchinfo):
        """Load GCP credentials from secure Splunk storage."""
        try:
            provider_name = f"{VERTEX_PROVIDER_PREFIX}{model_name}"
            response = handle_secrets(
                searchinfo=searchinfo,
                provider=provider_name,
                type="SELECT",
                realm=VERTEX_SECRETS_REALM,
            )

            if response is None:
                logger.error(
                    f"Password storage returned None for model '{model_name}', provider: {provider_name}"
                )
                raise RuntimeError(
                    f"Unable to retrieve Vertex credentials for model '{model_name}'. Please re-register the model."
                )

            if 'status' in response and response['status'] not in [200, 201]:
                status = response.get('status')
                message = response.get('message', 'Unknown error')
                logger.error(
                    f"Credential retrieval failed for '{model_name}': status={status}, message={message}"
                )

                if status == 404:
                    raise RuntimeError(
                        f"Vertex credentials not found for model '{model_name}'. Please re-register the model."
                    )
                raise RuntimeError(
                    f"Unable to access Vertex credentials for model '{model_name}'. Please contact your administrator."
                )

            clear_password = response.get(CLEAR_PASSWORD, "")
            if clear_password:
                return json.loads(clear_password)

            logger.error(
                f"Credentials exist but clear_password field is empty for model '{model_name}'"
            )
            raise RuntimeError(
                f"Vertex credentials are corrupted for model '{model_name}'. Please re-register the model."
            )

        except json.JSONDecodeError as exc:
            logger.error(f"Invalid JSON in credentials for model '{model_name}': {str(exc)}")
            raise RuntimeError(
                f"Vertex credentials are corrupted for model '{model_name}'. Please re-register the model."
            )
        except Exception as exc:
            if isinstance(exc, RuntimeError):
                raise
            logger.error(
                f"Unexpected error loading credentials for model '{model_name}': {str(exc)}"
            )
            cexc.log_traceback()
            raise RuntimeError(
                f"Unable to load Vertex credentials for model '{model_name}'. Please contact your administrator."
            )

    @staticmethod
    def load_resource_limits(algo_name, process_options):
        """Load algorithm-specific limits."""
        resource_limits = {}
        limits = process_options['mlspl_limits']
        resource_limits['max_memory_usage_mb'] = int(limits.get('max_memory_usage_mb', -1))
        resource_limits['streaming_apply'] = False
        return resource_limits

    @classmethod
    def _prepare_features_and_options(cls, df, process_options):
        """Prepare features and invocation options for Vertex endpoint call."""
        input_feature_map = process_options.get('input_feature_map', {})
        output_prediction_map = process_options.get('output_prediction_map', {})
        openapi_spec = process_options.get('openapi_spec', {})
        batch_size = process_options.get('batch_size')

        features = ApplyVertexProcessor._extract_features(
            df, input_feature_map, process_options
        )

        if not (input_feature_map and '*' in input_feature_map):
            ApplyVertexProcessor._validate_features(df, features)

        options = ApplyVertexProcessor._build_invocation_options(
            openapi_spec, input_feature_map, output_prediction_map, batch_size
        )
        return features, options

    @classmethod
    def _extract_features(cls, df, input_feature_map, process_options):
        """Extract feature list from DataFrame based on configuration."""
        spl_features = ApplyVertexProcessor._extract_spl_features(process_options)

        if input_feature_map and '*' in input_feature_map:
            if spl_features:
                logger.debug(
                    f"Wildcard with SPL features: using {len(spl_features)} explicit features"
                )
                return spl_features
            features = ApplyVertexProcessor._filter_internal_columns(df.columns)
            logger.debug(f"Wildcard: using {len(features)} columns (internal filtered)")
            return features

        if input_feature_map:
            required_features = list(input_feature_map.keys())
            if spl_features:
                invalid = set(spl_features) - set(required_features)
                if invalid:
                    raise RuntimeError(
                        f"SPL features {list(invalid)} not in model. Available: {required_features}"
                    )
                return [f for f in required_features if f in spl_features]
            return required_features

        if spl_features:
            return spl_features

        return ApplyVertexProcessor._filter_internal_columns(df.columns)

    @classmethod
    def _filter_internal_columns(cls, columns):
        """Remove Splunk/MLTK internal columns."""
        PREFIXES = ('__mv_', '_chunked_')
        FIELDS = {
            '_time',
            '_raw',
            '_serial',
            '_si',
            '_sourcetype',
            '_kv',
            '_chunked_idx',
            '_cd',
        }
        return [
            col
            for col in columns
            if not any(col.startswith(p) for p in PREFIXES) and col not in FIELDS
        ]

    @classmethod
    def _validate_features(cls, df, features):
        """Validate features exist in DataFrame."""
        missing = set(features) - set(df.columns)
        if missing:
            raise RuntimeError(
                f"Features not found in DataFrame: {list(missing)}. Use | table or features= to select correct columns."
            )

    @classmethod
    def _build_invocation_options(
        cls, openapi_spec, input_feature_map, output_prediction_map, batch_size=None
    ):
        """Build options dictionary for Vertex endpoint invocation."""
        options = {}
        if openapi_spec:
            options['openapi_spec'] = openapi_spec
        if input_feature_map:
            options['input_feature_map'] = input_feature_map
        if output_prediction_map:
            options['output_prediction_map'] = output_prediction_map
        if batch_size is not None:
            options['batch_size'] = batch_size
        return options

    @classmethod
    def _extract_spl_features(cls, process_options):
        """Extract features from SPL query parameters."""
        features_param = process_options.get("params", {}).get("features", "")
        if not features_param:
            return []
        features = []
        for feature in features_param.split(','):
            feature = feature.strip().strip('"').strip("'")
            if feature:
                features.append(feature)
        return features

    def apply(self, df, algo, process_options):
        """
        Perform Vertex model inference on input DataFrame.

        Flow:
        1. Validate endpoint configuration
        2. Prepare features and invocation options
        3. Invoke Vertex endpoint via invoker
        4. Return predictions merged with original features
        """
        model_name = process_options.get('model_name', 'unknown')

        self._chunk_counter += 1
        current_chunk = self._chunk_counter

        try:
            endpoint_name = process_options.get('endpoint_name')
            if not endpoint_name:
                logger.error(f"Model '{model_name}' missing endpoint_name in configuration")
                raise RuntimeError(
                    "Model configuration is incomplete. Please re-register the model."
                )

            features, options = ApplyVertexProcessor._prepare_features_and_options(
                df, process_options
            )
            options['mlspl_limits'] = process_options.get('mlspl_limits', {})

            prediction_df = algo.apply(df=df, features=features, options=options)

            if hasattr(algo, 'last_invoke_metrics'):
                self.invoke_metrics = algo.last_invoke_metrics.copy()
                self.invoke_metrics['chunk_id'] = current_chunk
                self.invoke_metrics['total_chunks'] = current_chunk

            gc.collect()
            return prediction_df

        except Exception as exc:
            model_name = process_options.get('model_name', 'unknown')
            cexc.log_traceback()
            logger.error(f"Error during Vertex inference for model '{model_name}': {str(exc)}")

            exception_name = type(exc).__name__
            if isinstance(exc, RuntimeError) or exception_name == 'ValidationError':
                cexc.messages.warn(str(exc))
                raise RuntimeError(str(exc))

            error_msg = f"Model '{model_name}' inference failed. Please check your input data or contact your administrator."
            cexc.messages.warn(error_msg)
            raise RuntimeError(error_msg)

    def process(self):
        """If algo isn't loaded, load the model. Create the output dataframe."""
        if self.algo is None:
            raise RuntimeError("Vertex invoker not initialized")

        if len(self.df) > 0:
            self.df = self.apply(self.df, self.algo, self.process_options)

        if self.df is None:
            messages.warn('Apply method did not return any results.')
            self.df = pd.DataFrame()
