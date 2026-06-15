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
from sagemaker_int.endpoint_invoker import SageMakerInvoker
from sagemaker_int.constants import SAGEMAKER_PROVIDER_PREFIX, SAGEMAKER_SECRETS_REALM
from util.sagemaker_util_extensions import (
    get_sagemaker_model_options_from_disk,
)

logger = cexc.get_logger(__name__)
messages = cexc.get_messages_logger()


class ApplySagemakerProcessor(BaseProcessor):
    """SageMaker Apply Processor - Invokes AWS SageMaker endpoints for model inference."""

    def __init__(self, process_options, searchinfo):
        self.searchinfo = searchinfo
        (
            self.algo_name,
            self.algo,
            self.process_options,
            self.namespace,
        ) = ApplySagemakerProcessor.setup_model(process_options, self.searchinfo)
        self.resource_limits = ApplySagemakerProcessor.load_resource_limits(
            self.algo_name, self.process_options
        )
        self.invoke_metrics = None  # Will store timing metrics after inference
        self._chunk_counter = 0  # Track chunks processed

    def get_relevant_fields(self):
        """Return the feature field names needed for SageMaker inference."""
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
        Load SageMaker model configuration and initialize endpoint invoker.

        Steps:
        1. Handle parsetmp search (skip model loading)
        2. Load model configuration from lookup table
        3. Verify runtime is SageMaker
        4. Load AWS credentials from secure storage
        5. Initialize SageMakerInvoker with credentials
        """
        namespace = process_options.pop('namespace', None)
        mlspl_conf = process_options.pop('mlspl_conf')

        # Step 1: Skip model loading for parsetmp search (MLA-1989)
        if is_parsetmp(searchinfo):
            process_options['mlspl_limits'] = {}
            process_options['feature_variables'] = ['*']
            return None, None, process_options, None

        try:
            model_name = process_options['model_name']

            # Step 2: Load model configuration from lookup table
            algo_name, model_data, model_options = get_sagemaker_model_options_from_disk(
                model_name=model_name, searchinfo=searchinfo, namespace=namespace
            )

            # Step 3: Verify this is a SageMaker model
            if model_options.get('runtime') != 'sagemaker':
                raise RuntimeError(
                    f"Model '{model_name}' is not a SageMaker model (runtime: {model_options.get('runtime')})"
                )

            # Step 4: Merge configurations and load credentials
            original_model_name = model_options.get('model_name', model_name)
            model_options.update(process_options)
            process_options = model_options
            process_options['mlspl_limits'] = mlspl_conf.get_stanza('sagemaker_custom_model')

            aws_credentials = cls._load_aws_credentials(original_model_name, searchinfo)

            # Step 5: Initialize SageMaker invoker with credentials
            algo = SageMakerInvoker(
                aws_access_key_id=aws_credentials['access_key_id'],
                aws_secret_access_key=aws_credentials['secret_access_key'],
                aws_role_arn=aws_credentials['role_arn'],
                aws_region=aws_credentials['region'],
            )

            logger.info(f"Loaded SageMaker model configuration")
            return algo_name, algo, process_options, namespace

        except Exception as e:
            model_name = process_options.get('model_name', 'unknown')
            cexc.log_traceback()
            logger.error(f"Failed to load SageMaker model '{model_name}': {str(e)}")

            if (
                "does not exist" in str(e)
                or "No such file" in str(e)
                or "Invalid model name" in str(e)
            ):
                raise RuntimeError(
                    f"SageMaker model '{model_name}' is not registered. Please register the model"
                )
            elif "credentials" in str(e).lower() or "password" in str(e).lower():
                raise RuntimeError(
                    f"Unable to access credentials for model '{model_name}'. The model may need to be re-registered."
                )
            elif "runtime" in str(e).lower():
                raise RuntimeError(
                    f"Model '{model_name}' is not a SageMaker model. Please use the correct apply command for this model type."
                )
            else:
                raise RuntimeError(
                    f"Unable to load model '{model_name}'. Please check the model configuration or contact your administrator."
                )

    @classmethod
    def _load_aws_credentials(cls, model_name, searchinfo):
        """Load AWS credentials from secure Splunk storage."""
        try:
            provider_name = f"{SAGEMAKER_PROVIDER_PREFIX}{model_name}"
            response = handle_secrets(
                searchinfo=searchinfo,
                provider=provider_name,
                type="SELECT",
                realm=SAGEMAKER_SECRETS_REALM,
            )

            if response is None:
                logger.error(
                    f"Password storage returned None for model '{model_name}', provider: {provider_name}"
                )
                raise RuntimeError(
                    f"Unable to retrieve AWS credentials for model '{model_name}'. Please re-register the model to restore credentials."
                )

            if 'status' in response and response['status'] not in [200, 201]:
                status = response.get('status')
                message = response.get('message', 'Unknown error')
                logger.error(
                    f"Credential retrieval failed for '{model_name}': status={status}, message={message}"
                )

                if status == 404:
                    raise RuntimeError(
                        f"AWS credentials not found for model '{model_name}'. Please re-register the model."
                    )
                else:
                    raise RuntimeError(
                        f"Unable to access AWS credentials for model '{model_name}'. Please contact your administrator."
                    )

            clear_password = response.get(CLEAR_PASSWORD, "")
            if clear_password:
                return json.loads(clear_password)
            else:
                logger.error(
                    f"Credentials exist but clear_password field is empty for model '{model_name}'"
                )
                raise RuntimeError(
                    f"AWS credentials are corrupted for model '{model_name}'. Please re-register the model."
                )

        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in credentials for model '{model_name}': {str(e)}")
            raise RuntimeError(
                f"AWS credentials are corrupted for model '{model_name}'. Please re-register the model."
            )
        except Exception as e:
            if isinstance(e, RuntimeError):
                raise
            logger.error(
                f"Unexpected error loading credentials for model '{model_name}': {str(e)}"
            )
            cexc.log_traceback()
            raise RuntimeError(
                f"Unable to load AWS credentials for model '{model_name}'. Please contact your administrator."
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
        """Prepare features and invocation options for SageMaker endpoint call."""
        input_feature_map = process_options.get('input_feature_map', {})
        output_prediction_map = process_options.get('output_prediction_map', {})
        openapi_spec = process_options.get('openapi_spec', {})
        batch_size = process_options.get('batch_size')

        features = cls._extract_features(df, input_feature_map, process_options)

        if not (input_feature_map and '*' in input_feature_map):
            cls._validate_features(df, features)

        options = cls._build_invocation_options(
            openapi_spec, input_feature_map, output_prediction_map, batch_size
        )
        return features, options

    @classmethod
    def _extract_features(cls, df, input_feature_map, process_options):
        """Extract feature list from DataFrame based on configuration."""
        spl_features = cls._extract_spl_features(process_options)

        if input_feature_map and '*' in input_feature_map:
            if spl_features:
                logger.debug(
                    f"Wildcard with SPL features: using {len(spl_features)} explicit features"
                )
                return spl_features
            features = cls._filter_internal_columns(df.columns)
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

        return cls._filter_internal_columns(df.columns)

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
        """Build options dictionary for SageMaker endpoint invocation."""
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
        Perform SageMaker model inference on input DataFrame.

        Flow:
        1. Validate endpoint configuration
        2. Prepare features and invocation options
        3. Invoke SageMaker endpoint via invoker
        4. Return predictions merged with original features
        """
        model_name = process_options.get('model_name', 'unknown')

        # Increment chunk counter (each call to apply() is a new chunk)
        self._chunk_counter += 1
        current_chunk = self._chunk_counter

        try:
            # Step 1: Get endpoint name from model configuration
            endpoint_name = process_options.get('endpoint_name')
            if not endpoint_name:
                logger.error(f"Model '{model_name}' missing endpoint_name in configuration")
                raise RuntimeError(
                    f"Model configuration is incomplete. Please re-register the model."
                )

            # Step 2: Prepare features and invocation options from registered model configuration
            features, options = ApplySagemakerProcessor._prepare_features_and_options(
                df, process_options
            )
            options['mlspl_limits'] = process_options.get('mlspl_limits', {})

            # Step 3: Invoke SageMaker endpoint (invoker handles batch/single-record mode)
            prediction_df = algo.apply(
                endpoint_name=endpoint_name, df=df, features=features, options=options
            )

            # Step 4: Retrieve timing metrics from invoker and add chunk info
            if hasattr(algo, 'last_invoke_metrics'):
                self.invoke_metrics = algo.last_invoke_metrics.copy()
                self.invoke_metrics['chunk_id'] = current_chunk
                self.invoke_metrics[
                    'total_chunks'
                ] = current_chunk  # Will be final count at end

            gc.collect()
            return prediction_df

        except Exception as e:
            model_name = process_options.get('model_name', 'unknown')
            cexc.log_traceback()
            logger.error(f"Error during SageMaker inference for model '{model_name}': {str(e)}")

            exception_name = type(e).__name__

            if isinstance(e, RuntimeError) or exception_name == 'ValidationError':
                cexc.messages.warn(str(e))
                raise RuntimeError(str(e))
            else:
                error_msg = f"Model '{model_name}' inference failed. Please check your input data or contact your administrator."
                cexc.messages.warn(error_msg)
                raise RuntimeError(error_msg)

    def process(self):
        """If algo isn't loaded, load the model. Create the output dataframe."""
        if self.algo is None:
            raise RuntimeError("SageMaker invoker not initialized")

        if len(self.df) > 0:
            self.df = self.apply(self.df, self.algo, self.process_options)

        if self.df is None:
            messages.warn('Apply method did not return any results.')
            self.df = pd.DataFrame()
