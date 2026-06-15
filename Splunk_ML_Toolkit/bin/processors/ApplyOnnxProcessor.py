#!/usr/bin/env python
# Copyright (C) 2015-2019 Splunk Inc. All Rights Reserved.
import gc

import pandas as pd
import numpy as np

import cexc
import models.base

from .BaseProcessor import BaseProcessor
from util import search_util
from util.searchinfo_util import is_parsetmp
from util.df_util import merge_predictions
from util.constants import ONNX_MODEL_EXTENSION
import util.onnx_util as onnx_util
from util.telemetry_onnx_util import (
    log_onnx_model_input_shape,
    log_onnx_app_algo_details,
)

logger = cexc.get_logger(__name__)
messages = cexc.get_messages_logger()


class ApplyOnnxProcessor(BaseProcessor):
    """The apply processor receives and returns pandas DataFrames."""

    def __init__(self, process_options, searchinfo):
        """Initialize options for the processor.

        Args:
            process_options (dict): process options
            searchinfo (dict): information required for search
        """
        self.upload = self._is_upload(process_options)
        self.searchinfo = searchinfo
        self.session = None
        self.algo = None
        # There is no option for upload through spl currently, therefore this if condition will never be triggered.
        if self.upload:
            # if ran in upload phase, setup model with validation and verification steps
            # else, check model entry in lookup table and return results.
            (
                self.algo_name,
                self.process_options,
                self.namespace,
            ) = ApplyOnnxProcessor.setup_model(process_options, self.searchinfo)
        else:
            # if not an upload stage, populate entries from lookup table for the model provided.
            (
                self.algo_name,
                self.process_options,
                self.namespace,
            ) = self.get_model_attributes(process_options, self.searchinfo)
        log_onnx_app_algo_details(
            self.searchinfo.get("app"), self.algo_name, self.process_options
        )

        self.resource_limits = ApplyOnnxProcessor.load_resource_limits(
            self.algo_name, self.process_options
        )

    def _is_upload(self, process_options):
        params = process_options.get("params", None)
        if params:
            upload = params.get('upload')
            if upload:
                return True
        return False

    @classmethod
    def get_model_attributes(cls, process_options, searchinfo):
        """
        Populate process_options with required fields: features, target, model_names, limits, model_folder_location,
        :param process_options:
        :param searchinfo:
        :return:
        """
        searchinfo = search_util.add_distributed_search_info(process_options, searchinfo)
        namespace = process_options.pop('namespace', None)

        # Fetch model name from process options parameter
        model_name = process_options["model_name"]
        if model_name.endswith(ONNX_MODEL_EXTENSION):
            model_name = model_name.split('.')[0]
        algo_name, model_data, model_options = models.base.get_model_options_from_disk(
            model_name, searchinfo, namespace
        )

        # Updating process_options with the metadata information from model file.
        model_options.update(process_options)
        process_options = model_options

        if onnx_util.check_model_for_size_limitation(model_data, process_options):
            return algo_name, process_options, namespace

    def get_relevant_fields(self):
        """For onnx models,
        2. Within model_location, access feature and target variables from metadata info.
        4. check sample.csv (if exists) to verify whether these feature/target variables exists
        5. If it does, update self.process_options with these params, else raise feature not found error.
        7. Return the feature variables as relevant fields.

        Returns:
            relevant_fields (list): relevant fields
        """

        relevant_fields = self.process_options['feature_variables'] + self.process_options.get(
            'split_by', []
        )

        # TODO MLA-1589: require explicit _* usage
        if '*' in relevant_fields:
            relevant_fields.append('_*')

        if '_time' not in relevant_fields:
            relevant_fields.append('_time')
        if 'target_variable' in self.process_options:
            # TODO : Modify for multi target support
            target_variables = self.process_options['target_variable']
            # Ensure target_variables is treated as a list
            if isinstance(target_variables, str):
                # Split by comma if it's a string
                target_variables = target_variables.split(",")
            # Append each target variable to relevant_fields if it's not already included
            for target in target_variables:
                # Remove any leading/trailing whitespace
                target = target.strip()
                if target and target not in relevant_fields:
                    relevant_fields.append(target)
        return relevant_fields

    @classmethod
    def setup_model(cls, process_options, searchinfo):
        """
        Load temp model, try to load real model, validate user capabilities for model upload.
        Parse feature variables and mlspl_limits
        Remove the tmp_dir in the process.

        Args:
            process_options (dict): process_options
            searchinfo (dict): information required for search
        Returns:
            algo_name (str): algorithm name
            algo (object): algorithm object
            process_options (dict): updated process options
            namespace (str): namespace of the model
        """

        searchinfo = search_util.add_distributed_search_info(process_options, searchinfo)

        namespace = process_options.pop('namespace', None)

        mlspl_conf = process_options.pop('mlspl_conf')

        assert onnx_util.validate_user_capabilities_for_upload(searchinfo)
        # For MLA-1989 we cannot properly load a model in parsetmp search
        if is_parsetmp(searchinfo):
            process_options['mlspl_limits'] = {}
            process_options['feature_variables'] = ['*']
            return None, None, process_options, None

        algo_name = ONNX_MODEL_EXTENSION[1:]
        process_options['mlspl_limits'] = mlspl_conf.get_stanza(algo_name)

        # Once validated and verified, create lookup table entry
        _ = onnx_util.create_onnx_model_lookup_entry(
            process_options['model_name'],
            algo_name=algo_name,
            options=process_options,
            max_size=None,
            tmp=False,
            searchinfo=searchinfo,
            namespace=namespace,
            local=False,
        )

        return algo_name, process_options, namespace

    @staticmethod
    def load_resource_limits(algo_name, process_options):
        """Load algorithm-specific limits.

        Args:
            algo_name (str): algorithm name
            process_options (dict): the mlspl limits from the conf files

        Returns:
            resource_limits (dict): dictionary of resource limits
        """
        resource_limits = {}
        limits = process_options['mlspl_limits']
        resource_limits['max_memory_usage_mb'] = int(limits.get('max_memory_usage_mb', -1))
        resource_limits['streaming_apply'] = False
        resource_limits['max_model_size_mb'] = int(limits.get('max_model_size_mb', -1))
        return resource_limits

    @staticmethod
    def get_input_fields(df, input_cols):
        # types of inputs:
        len_input_cols = len(input_cols)
        if len_input_cols > 1:
            # 1) where input_cols > 1
            # multiple input sources, each source can represent 1 column
            inputs = {c: df[c].values for c in df.columns}
            df_shape = df.shape
            log_onnx_model_input_shape(
                "Multiple columns single-dim input", str(len_input_cols), str(df_shape)
            )
            if len_input_cols != len(df.columns):
                raise RuntimeError(
                    f"Expected number of inputs in the dataset is {len_input_cols} but found {len(df.columns)}"
                )
            for items in input_cols:
                field_name = items.name
                # we need to minus one, because the first dimension is reserved for something else,
                # and is usually None for ONNX
                input_cols_shape_size = items.shape[1]
                if field_name not in df.columns:
                    raise RuntimeError(
                        f"Required field {field_name} of type {items.type} does not exist"
                    )
                else:
                    df_field_type = str(df[field_name].dtypes)
                    expected_field_type = items.type
                    print(
                        f"df_field_type: {df_field_type} expected_field_type: {expected_field_type}"
                    )
                    if df_field_type == "int64" or expected_field_type == "tensor(int64)":
                        inputs[field_name] = inputs[field_name].astype(np.int64)
                    elif df_field_type == "float32" or expected_field_type == "tensor(float)":
                        inputs[field_name] = inputs[field_name].astype(np.float32)
                    elif df_field_type == "float64" or expected_field_type == "tensor(float)":
                        inputs[field_name] = inputs[field_name].astype(np.float64)
                    elif df_field_type == "double" or expected_field_type == "tensor(double)":
                        inputs[field_name] = inputs[field_name].astype(np.float64)
                    else:
                        raise RuntimeError(
                            f"Only Integer and Float feature variables are "
                            f"supported. Found unknown values in {field_name} variable"
                        )
        elif len_input_cols == 1:
            # 2) input_cols == 1
            # maybe just one input source,
            # but it can be multi-dimension
            input_cols_shape = input_cols[0].shape
            df_shape = df.shape
            input_cols_shape_size = len(input_cols_shape)
            log_onnx_model_input_shape(
                "Single column multi-dim input", str(input_cols_shape), str(df_shape)
            )

            # DEBUG: Log decision parameters
            logger.info("[DEBUG] ONNX Input Processing:")
            logger.info(f"[DEBUG]   Model shape: {input_cols_shape}")
            logger.info(f"[DEBUG]   Model shape length: {input_cols_shape_size}")
            logger.info(f"[DEBUG]   DataFrame shape: {df_shape}")
            logger.info(f"[DEBUG]   DataFrame columns: {list(df.columns)}")
            logger.info(f"[DEBUG]   DataFrame dtypes: {dict(df.dtypes)}")
            if len(df) > 0:
                logger.info(f"[DEBUG]   First row sample: {df.iloc[0].to_dict()}")

            if input_cols_shape_size == 2:
                logger.info("[DEBUG] Taking 2D tensor path (shape_size=2)")
                # Scenarios with single input , 2d tensors. Ex. [None, 4]
                # FIXME: casting everything to float32 is not safe, nor precise
                if input_cols_shape[1] != df_shape[1]:
                    raise RuntimeError(
                        f"Data has shape of {df_shape}, but ONNX model requires shape {input_cols_shape}"
                    )
                if isinstance(df, pd.DataFrame):
                    inputs = {input_cols[0].name: df.to_numpy().astype(np.float32)}
                elif isinstance(df, np.ndarray):
                    inputs = {input_cols[0].name: df.astype(np.float32)}
                return inputs
            elif input_cols_shape_size == 3:
                # we have a 2d df, but we need a 3d tensor
                # Check if DataFrame is empty
                if len(df) == 0:
                    raise RuntimeError(
                        f"Empty DataFrame provided, cannot reshape to 3D tensor with shape {input_cols_shape}"
                    )

                # Check if columns contain lists (from streamstats list() or similar)
                first_col = df.columns[0]
                first_value = df[first_col].iloc[0]

                # Debug: log the actual type and value
                logger.info(
                    f"First value type: {type(first_value)}, value sample: {str(first_value)[:100]}"
                )

                # Check if it's a string with newline-separated values (Splunk multi-value field)
                is_string_list = isinstance(first_value, str) and '\n' in first_value
                logger.info(f"[DEBUG] Is string with newlines: {is_string_list}")

                if isinstance(first_value, (list, np.ndarray)) or is_string_list:
                    # Handle list-type columns (from streamstats list())
                    try:
                        # Convert list columns to 3D numpy array
                        # Expected shape: [batch_size, sequence_length, num_features]
                        list_data = []
                        expected_seq_len = None

                        for idx in range(len(df)):
                            row_data = []
                            for col in df.columns:
                                col_value = df[col].iloc[idx]

                                # Convert to list if it's an ndarray
                                if isinstance(col_value, np.ndarray):
                                    col_value = col_value.tolist()

                                # Parse string with newline-separated values (Splunk multi-value field)
                                if isinstance(col_value, str) and '\n' in col_value:
                                    col_value = col_value.split('\n')

                                if isinstance(col_value, list):
                                    # Validate list length consistency
                                    if expected_seq_len is None:
                                        expected_seq_len = len(col_value)
                                    elif len(col_value) != expected_seq_len:
                                        raise RuntimeError(
                                            f"Inconsistent sequence length in row {idx}, column '{col}': "
                                            f"expected {expected_seq_len} but got {len(col_value)}. "
                                            f"Ensure all list fields have the same length (e.g., window size in streamstats)."
                                        )

                                    # Handle None/NaN values in list and validate numeric types
                                    cleaned_list = []
                                    for val_idx, val in enumerate(col_value):
                                        if val is None or (
                                            isinstance(val, float) and np.isnan(val)
                                        ):
                                            cleaned_list.append(0.0)  # Replace with 0
                                        else:
                                            try:
                                                cleaned_list.append(float(val))
                                            except (ValueError, TypeError) as exc:
                                                raise RuntimeError(
                                                    f"Invalid non-numeric value '{val}' at position {val_idx} in row {idx}, column '{col}'. "
                                                    f"All values must be numeric for ONNX inference."
                                                ) from exc
                                    row_data.append(cleaned_list)
                                else:
                                    # Handle non-list values (scalar fallback)
                                    if expected_seq_len is None:
                                        expected_seq_len = 1
                                    val = (
                                        col_value
                                        if col_value is not None
                                        and not (
                                            isinstance(col_value, float) and np.isnan(col_value)
                                        )
                                        else 0.0
                                    )
                                    try:
                                        row_data.append([float(val)] * expected_seq_len)
                                    except (ValueError, TypeError) as exc:
                                        raise RuntimeError(
                                            f"Cannot convert scalar value '{val}' to float in row {idx}, column '{col}'"
                                        ) from exc

                            # Stack features horizontally: shape becomes [sequence_length, num_features]
                            try:
                                stacked_row = np.column_stack(row_data)
                            except ValueError as e:
                                raise RuntimeError(
                                    f"Failed to stack features in row {idx}. "
                                    f"This usually means lists have inconsistent lengths. Error: {str(e)}"
                                ) from e
                            list_data.append(stacked_row)

                        # Stack all rows: shape becomes [batch_size, sequence_length, num_features]
                        tensor_3d = np.stack(list_data, axis=0).astype(np.float32)

                        # Validate shape matches model expectations
                        if len(input_cols_shape) >= 3:
                            model_seq_len = input_cols_shape[1]
                            model_features = input_cols_shape[2]
                            actual_shape = tensor_3d.shape

                            if model_seq_len is not None and isinstance(model_seq_len, int):
                                if actual_shape[1] != model_seq_len:
                                    raise RuntimeError(
                                        f"Sequence length mismatch: data has {actual_shape[1]} timesteps, "
                                        f"but ONNX model requires {model_seq_len}. "
                                        f"Adjust your streamstats window={model_seq_len} to match the model."
                                    )

                            if model_features is not None and isinstance(model_features, int):
                                if actual_shape[2] != model_features:
                                    raise RuntimeError(
                                        f"Feature count mismatch: data has {actual_shape[2]} features, "
                                        f"but ONNX model requires {model_features}. "
                                        f"Ensure you're providing exactly {model_features} feature columns."
                                    )

                        logger.info(
                            f"Successfully converted list columns to 3D tensor with shape {tensor_3d.shape}"
                        )
                        inputs = {input_cols[0].name: tensor_3d}
                        return inputs

                    except RuntimeError:
                        # Re-raise RuntimeError with our custom messages
                        raise
                    except Exception as e:
                        raise RuntimeError(
                            f"Unexpected error converting list columns to 3D tensor: {type(e).__name__}: {str(e)}. "
                            f"Expected model shape: {input_cols_shape}, DataFrame shape: {df_shape}. "
                            f"Ensure your data is properly formatted with consistent list lengths."
                        ) from e
                else:
                    # Original logic for string columns with newline-separated values
                    logger.info("[DEBUG] Taking string column fallback path (not list/ndarray)")
                    logger.info(
                        "[DEBUG] This path expects string columns with newline-separated data"
                    )
                    for column in df:
                        if str(df[column].dtypes) != "str":
                            # non string value, we can not pretend that we can split the value into an array
                            raise RuntimeError(
                                f"data has shape of {df_shape}, but ONNX model requires shape {input_cols[0].shape}"
                            )
                        # Splunk multi-value fields have the values separated by new line
                        df = df[column].str.split("\n")
                    if isinstance(df, pd.DataFrame):
                        inputs = {input_cols[0].name: df.to_numpy().astype(np.float32)}
                    elif isinstance(df, np.ndarray):
                        inputs = {input_cols[0].name: df.astype(np.float32)}
                    return inputs
            elif input_cols_shape_size > 3:
                # Handle 4D+ tensors using string-based newline-split logic (original behavior)
                for column in df:
                    if str(df[column].dtypes) != "str":
                        raise RuntimeError(
                            f"data has shape of {df_shape}, but ONNX model requires shape {input_cols[0].shape}. "
                            f"For tensors with {input_cols_shape_size} dimensions, columns must contain string values with newline-separated data."
                        )
                    df = df[column].str.split("\n")
                if isinstance(df, pd.DataFrame):
                    inputs = {input_cols[0].name: df.to_numpy().astype(np.float32)}
                elif isinstance(df, np.ndarray):
                    inputs = {input_cols[0].name: df.astype(np.float32)}
                return inputs
            else:
                raise RuntimeError(
                    f"Unsupported tensor shape: {input_cols_shape}. Shape length is {input_cols_shape_size}. "
                    f"Data has shape {df.shape}. Only 2D and 3D tensors are fully supported."
                )
        else:
            # not input, error case
            raise RuntimeError("ONNX model does not have input")
        # Reshaping inputs
        for k in inputs:
            inputs[k] = inputs[k].reshape((inputs[k].shape[0], 1))
        return inputs

    @staticmethod
    def find_fields_to_drop(df, process_options):
        to_drop = [process_options.get("target_variable")]
        # TODO: ONNX- replace with preprocessing column functions
        for cols in df.columns:
            if cols.startswith('_'):
                to_drop.append(cols)
        return to_drop

    @staticmethod
    def fetch_output_col(process_options, target_var):
        """
        Function to fetch the output variable name when 'as' keyword is specified in the SPL
        """
        # updated this logic by adding multi-target support for apply command.
        output_var = process_options.get("output_name")
        n_timesteps = process_options.get("_n_forecast_timesteps")
        n_features = process_options.get("_n_forecast_features")
        # Handle multi-timestep forecasting outputs
        if n_timesteps and n_timesteps > 1:
            if output_var:
                # Generate timestep columns for custom output name
                if n_features and n_features > 1:
                    # Multiple features: generate feature_timestep columns
                    return [
                        f"{output_var}_f{f}_t{t}"
                        for f in range(n_features)
                        for t in range(n_timesteps)
                    ]
                else:
                    # Single feature: just timestep columns
                    return [f"{output_var}_t{t}" for t in range(n_timesteps)]
            else:
                # No custom output name - use target_var or defaults
                if n_features and n_features > 1:
                    # Multiple features from model output shape
                    if isinstance(target_var, list) and len(target_var) == n_features:
                        # Use provided target names
                        cols = []
                        for var in target_var:
                            for t in range(n_timesteps):
                                cols.append(f"predicted({var.strip()})_t{t}")
                        return cols
                    else:
                        # Generate default names for each feature and timestep
                        return [
                            f"predicted(y{f + 1})_t{t}"
                            for f in range(n_features)
                            for t in range(n_timesteps)
                        ]
                else:
                    # Single feature output
                    if isinstance(target_var, list) and len(target_var) > 0:
                        var = target_var[0]
                        return [f"predicted({var.strip()})_t{t}" for t in range(n_timesteps)]
                    elif isinstance(target_var, str) and target_var.strip():
                        return [
                            f"predicted({target_var.strip()})_t{t}" for t in range(n_timesteps)
                        ]
                    else:
                        return [f"predicted(value)_t{t}" for t in range(n_timesteps)]

        # Original logic for single-timestep outputs or classification
        if output_var:
            return [output_var, f"{output_var}_proba"]
        else:
            if isinstance(target_var, list):
                return [
                    f"predicted({var.strip()})" for var in target_var if var and var.strip()
                ]
            elif isinstance(target_var, str) and target_var.strip():
                return [f"predicted({target_var.strip()})"]
            else:
                return ["predicted(value)"]

    @staticmethod
    def fetch_model_params(process_options):
        """
        Function which extracts thresold from process_options
        """

        thresh = process_options.get("model_param_thresh")
        activation = process_options.get("model_param_activation")

        return thresh, activation

    @staticmethod
    def sigmoid(logits):
        # Compute sigmoid values for logits
        return 1 / (1 + np.exp(-logits))

    @staticmethod
    def softmax(logits, axis=-1):
        # Compute softmax values for logits
        exp_logits = np.exp(logits - np.max(logits, axis=axis, keepdims=True))
        return exp_logits / np.sum(exp_logits, axis=axis, keepdims=True)

    @staticmethod
    def tanh(x):
        # Computes the TanH values for logits
        return np.tanh(x)

    @staticmethod
    def is_regression_output(arr):
        """
        Check if the array is likely a regression output.
        """
        # check if it looks like probabilities
        if ApplyOnnxProcessor.is_probability_array(arr):
            return False

        # For logits, we expect some balance between positive and negative values
        mean_abs = np.mean(np.abs(arr))
        std_abs = np.std(np.abs(arr))

        # For logits:
        # 1. Standard deviation should be relatively small compared to mean
        # 2. Should have both positive and negative values
        # 3. Values should be somewhat balanced around zero
        if (
            std_abs / mean_abs < 2.0
            and np.any(arr < 0)  # Check for consistent scale
            and np.any(arr > 0)
            and np.abs(np.mean(arr)) < np.std(arr)  # Has both pos and neg
        ):  # Roughly balanced
            return False

        return True

    @staticmethod
    def is_probability_array(arr):
        """
        Handles probabilities including multi-target binary classification.
        """
        # Handle multi-target binary classification case
        # Each column represents probability for a different target
        if len(arr.shape) == 2 and np.all((arr >= 0) & (arr <= 1)):
            # Check if all values are between 0 and 1
            return True

        # Previous checks remain the same
        # Handle single column case (binary classification)
        if arr.shape[1] == 1:
            return np.all((arr >= 0) & (arr <= 1))

        # Handle two column case with class indices
        if arr.shape[1] == 2 and np.all(arr[:, 0].astype(int) == arr[:, 0]):
            return np.all((arr[:, 1] >= 0) & (arr[:, 1] <= 1))

        # Check if it's a proper probability distribution
        if np.all((arr >= 0) & (arr <= 1)):
            return np.allclose(np.sum(arr, axis=1), 1.0)

        return False

    @staticmethod
    def process_multi_target_binary_classification(arr, threshold, activation):
        """
        Process multi-target binary classification outputs.
        Each column represents a separate binary classification target.

        Args:
            arr: Input array where each column is probability for a target
            threshold: Confidence threshold
            activation: Activation function type

        Returns:
            Tuple of (class_indices, probabilities)
        """
        # Apply activation if needed
        if ApplyOnnxProcessor.is_logits_output(arr):
            if activation == 'sigmoid':
                probabilities = ApplyOnnxProcessor.sigmoid(arr)
            elif activation == 'softmax':
                probabilities = ApplyOnnxProcessor.softmax(arr, axis=1)
            elif activation == 'tanh':
                probabilities = ApplyOnnxProcessor.tanh(arr)
            elif activation is None:
                probabilities = arr
            else:
                raise ValueError(f"Unsupported activation function: {activation}")
        else:
            probabilities = arr  # Already probabilities

        # For each target, determine class based on threshold
        class_indices = np.where(probabilities >= threshold, 1, 0)

        return class_indices, probabilities

    @staticmethod
    def is_logits_output(arr):
        """Check if the array contains logits."""
        # Logits typically:
        # 1. Have both positive and negative values
        # 2. Are roughly centered around zero
        # 3. Don't follow probability constraints
        if np.any(arr < 0) and np.any(arr > 0):
            mean_abs = np.mean(np.abs(arr))
            if mean_abs > 0 and np.abs(np.mean(arr)) < mean_abs:
                return True
        return False

    @staticmethod
    def is_classification_output(arr):
        """
        Check if the array is likely a classification output.
        Handles logits, probabilities, and class indices.
        """
        if len(arr.shape) != 2:
            return False
        # Check if it's regression first
        if ApplyOnnxProcessor.is_regression_output(arr):
            return False
        # Check for class indices (integers)
        if np.all(arr.astype(int) == arr):
            return True
        # Check for probabilities
        if ApplyOnnxProcessor.is_probability_array(arr):
            return True
        # Check for logits
        if ApplyOnnxProcessor.is_logits_output(arr):
            return True
        return False

    @staticmethod
    def process_binary_classification(arr, threshold, activation):
        """Process binary classification outputs with threshold handling."""

        def apply_activation(arr, activation):
            if activation == 'sigmoid':
                return ApplyOnnxProcessor.sigmoid(arr)
            elif activation == 'softmax':
                return ApplyOnnxProcessor.softmax(arr, axis=1)
            elif activation == 'tanh':
                return ApplyOnnxProcessor.tanh(arr)
            return arr  # If already probabilities, return as is.

        num_columns = arr.shape[1]

        if num_columns == 1:
            probabilities = (
                apply_activation(arr, activation)
                if ApplyOnnxProcessor.is_logits_output(arr)
                else arr
            )
            positive_class_proba = probabilities.reshape(-1, 1)
            negative_class_proba = 1 - positive_class_proba

            # Determine class indices based on the threshold
            class_indices = (positive_class_proba >= threshold).astype(int)
            probabilities = np.hstack([negative_class_proba, positive_class_proba])

            return class_indices, probabilities

        elif num_columns == 2:
            probabilities = (
                apply_activation(arr, activation)
                if ApplyOnnxProcessor.is_logits_output(arr)
                else arr
            )

            positive_class_proba = probabilities[:, 1]
            negative_class_proba = probabilities[:, 0]

            # Apply thresholding logic
            class_indices = (positive_class_proba >= threshold).astype(int).reshape(-1, 1)
            probabilities = np.column_stack([negative_class_proba, positive_class_proba])

            return class_indices, probabilities

    @staticmethod
    def process_multiclass_classification(arr: np.ndarray, threshold: float, activation: str):
        """
        Process multiclass classification outputs with proper None handling.

        Args:
            arr: Input array of predictions
            threshold: Confidence threshold
            activation: Activation function type

        Returns:
            Tuple of (class_indices, probabilities)
        """
        if np.all(arr.astype(int) == arr):  # Class indices
            class_indices = arr.reshape(-1, 1)
            probabilities = np.zeros((len(arr), arr.max() + 1))
            for i, idx in enumerate(arr.flatten()):
                probabilities[i, idx] = 1.0

        elif ApplyOnnxProcessor.is_logits_output(arr):
            if activation == 'softmax':
                probabilities = ApplyOnnxProcessor.softmax(arr, axis=1)
            elif activation == 'sigmoid':
                probabilities = ApplyOnnxProcessor.sigmoid(arr)
            elif activation == 'tanh':
                probabilities = ApplyOnnxProcessor.tanh(arr)

            class_indices = np.argmax(probabilities, axis=1).reshape(-1, 1)

        else:  # Already probabilities
            probabilities = arr
            class_indices = np.argmax(probabilities, axis=1).reshape(-1, 1)

        # Convert to object dtype to allow string values
        class_indices = class_indices.astype(object)

        # Get max probabilities and apply threshold
        max_probabilities = np.max(probabilities, axis=1)
        below_threshold = max_probabilities < threshold

        # Set predictions below threshold to None
        class_indices[below_threshold] = "None"

        return class_indices, probabilities

    @staticmethod
    def process_classification_array(arr, threshold, activation):
        """Process any classification array."""
        # First check if it's multi-target binary classification
        if ApplyOnnxProcessor.is_probability_array(arr) and arr.shape[1] > 2:
            return ApplyOnnxProcessor.process_multi_target_binary_classification(
                arr, threshold, activation
            )
        # Otherwise, proceed with existing logic
        elif arr.shape[1] <= 2:
            return ApplyOnnxProcessor.process_binary_classification(arr, threshold, activation)
        else:
            return ApplyOnnxProcessor.process_multiclass_classification(
                arr, threshold, activation
            )

    @staticmethod
    def validate_model_params(threshold=None, activation=None):
        """
        Validate and set default values for model threshold and activation function

        Args:
        threshold (float, optional): Confidence threshold for predictions (0-1.0).
            Defaults to 0.1 if None
        activation (str, optional): Activation function to apply. Must be one of:
            'sigmoid', 'softmax', 'tanh' or None. Defaults to 'softmax' if None

        Returns:
        tuple: Validated (threshold, activation) values

        Raises:
        ValueError: If threshold > 1.0 or activation is not supported
        """
        # Set default values
        threshold = float(threshold if threshold is not None else 0.1)
        activation = activation if activation is not None else 'softmax'

        # Validate threshold is in valid range
        if threshold > 1.0:
            raise ValueError("Threshold value cannot be greater than 1.0")

        # Validate activation function
        valid_activations = {'sigmoid', 'softmax', 'tanh', None}
        if activation not in valid_activations:
            raise ValueError(
                f"Unsupported activation function: {activation}. Please use softmax, sigmoid, or relu."
            )

        return threshold, activation

    @staticmethod
    def process_predictions(prediction, thresold, activation):
        """
        Process predictions dynamically handling all cases:
        - Single/multi target regression
        - Binary/multiclass classifications
        - Logits/probabilities/class indices

        Args:
            prediction (list of np.ndarray,thresold,activation): List of prediction arrays

        Returns:
            dict: Processed outputs with appropriate fields
        """
        if (
            isinstance(prediction, list)
            and len(prediction) == 2
            and isinstance(prediction[0], np.ndarray)
            and isinstance(prediction[1], list)
        ):
            return {
                "class_indices": prediction[0],
                "probabilities": prediction[1],
                "regression_outputs": None,
            }

        # Convert single numpy array to list for consistent handling
        if isinstance(prediction, np.ndarray):
            prediction = [prediction]

        # Handle empty predictions
        if not prediction or len(prediction) == 0:
            return {"class_indices": None, "probabilities": None, "regression_outputs": None}

        # Single array case
        if len(prediction) == 1:
            arr = prediction[0]
            # Ensure 2D array
            if len(arr.shape) == 1:
                arr = arr.reshape(-1, 1)

            if ApplyOnnxProcessor.is_regression_output(arr):
                return {"class_indices": None, "probabilities": None, "regression_outputs": arr}

            if ApplyOnnxProcessor.is_classification_output(arr):
                class_indices, probabilities = ApplyOnnxProcessor.process_classification_array(
                    arr, thresold, activation
                )
                return {
                    "class_indices": class_indices,
                    "probabilities": [probabilities],  # Wrap in list for consistent output
                    "regression_outputs": None,
                }

            # Default to regression if nothing else matches
            return {"class_indices": None, "probabilities": None, "regression_outputs": arr}

        # Multiple arrays case (rest remains the same)
        class_indices_list = []
        probabilities_list = []
        regression_outputs = []

        for arr in prediction:
            if isinstance(arr, np.ndarray):
                # Ensure 2D array
                if len(arr.shape) == 1:
                    arr = arr.reshape(-1, 1)

                if ApplyOnnxProcessor.is_regression_output(arr):
                    regression_outputs.append(arr)
                elif ApplyOnnxProcessor.is_classification_output(arr):
                    (
                        class_indices,
                        probabilities,
                    ) = ApplyOnnxProcessor.process_classification_array(
                        arr, thresold, activation
                    )
                    class_indices_list.append(class_indices)
                    probabilities_list.append(probabilities)
                else:
                    regression_outputs.append(arr)

        return {
            "class_indices": np.hstack(class_indices_list) if class_indices_list else None,
            "probabilities": probabilities_list if probabilities_list else None,
            "regression_outputs": np.hstack(regression_outputs) if regression_outputs else None,
        }

    @staticmethod
    def apply(df, algo, process_options, session_obj=None):
        """Perform the literal predict from the estimator.

        Args:
            df (dataframe): input data
            algo (object): initialized algo object
            process_options (dict): process options
            session_obj (object) : specific session obj for onnx models

        Returns:
            prediction_df (dataframe): output dataframe
        """
        try:
            assert onnx_util.validate_feature_and_target_variables(df.head(), process_options)
            # TODO - ONNX can store the results for validation "df['output_column']", like scoring options.
            to_drop = ApplyOnnxProcessor.find_fields_to_drop(df, process_options)
            to_drop = [
                item
                for sublist in to_drop
                for item in (sublist if isinstance(sublist, list) else [sublist])
            ]

            df_new = df.drop(to_drop, axis=1, inplace=False)

            input_names = session_obj.get_inputs()
            _ = session_obj.get_outputs()[0].name if session_obj else None
            inputs = ApplyOnnxProcessor.get_input_fields(df_new, input_names)
            try:
                prediction = session_obj.run(None, input_feed=inputs)
                # Threshold and Activation function settings from search
                thresold, activation = ApplyOnnxProcessor.fetch_model_params(process_options)
                thresold, activation = ApplyOnnxProcessor.validate_model_params(
                    thresold, activation
                )

                prediction = ApplyOnnxProcessor.process_predictions(
                    prediction, float(thresold), str(activation)
                )

                if prediction['regression_outputs'] is not None:
                    regression_output = prediction['regression_outputs']

                    # Handle 3D outputs (e.g., from sequence forecasting models like GRU/LSTM)
                    if len(regression_output.shape) == 3:
                        batch_size, n_timesteps, n_features = regression_output.shape
                        logger.info(
                            f"[DEBUG] Reshaping 3D regression output: {regression_output.shape} -> ({batch_size}, {n_timesteps * n_features})"
                        )
                        # Reshape from (batch, timesteps, features) to (batch, timesteps*features)
                        regression_output = regression_output.reshape(
                            batch_size, n_timesteps * n_features
                        )

                    regression_outputs = [regression_output]
                    prediction_df = pd.Series(regression_outputs)
                    target_var = process_options.get('target_variable')

                    logger.info(f"[DEBUG] target_var value: {target_var}")
                    logger.info(f"[DEBUG] target_var type: {type(target_var)}")

                    # Store the number of timesteps and features for column naming
                    if len(prediction['regression_outputs'].shape) == 3:
                        batch_size, n_timesteps, n_features = prediction[
                            'regression_outputs'
                        ].shape
                        process_options['_n_forecast_timesteps'] = n_timesteps
                        process_options['_n_forecast_features'] = n_features
                        logger.info(
                            f"[DEBUG] Stored timesteps={n_timesteps}, features={n_features}"
                        )

                    # Generate column names
                    col_names = ApplyOnnxProcessor.fetch_output_col(process_options, target_var)
                    logger.info(f"[DEBUG] Generated {len(col_names)} column names: {col_names}")

                    # Create DataFrame with proper column names for regression outputs
                    output = merge_predictions(
                        df,
                        pd.DataFrame(
                            prediction_df[0],
                            columns=col_names,
                        ),
                    )
                else:  # Classification Task
                    temp_indices = []
                    temp_probs = []
                    # Process each probability output
                    for prob in prediction["probabilities"]:
                        if isinstance(prob, dict):
                            # Handle dictionary format probabilities
                            curr_indices = []
                            curr_probs = []

                            # Determine if binary or multi-class based on number of classes
                            is_binary = len(prob) == 2

                            if is_binary:
                                # For binary classification, check threshold for negative class (usually class 0)
                                neg_class_prob = prob.get(
                                    0, 0.0
                                )  # Get probability for negative class
                                pos_class_prob = prob.get(
                                    1, 0.0
                                )  # Get probability for positive class

                                if neg_class_prob >= float(thresold):
                                    curr_indices.append(0)  # Negative class
                                    curr_probs.append(round(neg_class_prob, 4))
                                else:
                                    curr_indices.append(1)  # Positive class
                                    curr_probs.append(round(pos_class_prob, 4))
                            else:
                                # Multi-class classification
                                max_item = max(prob.items(), key=lambda x: x[1])
                                max_prob = round(max_item[1], 4)

                                if max_prob >= float(thresold):
                                    try:
                                        curr_indices.append(int(max_item[0]))
                                    except ValueError:
                                        curr_indices.append(max_item[0])
                                    curr_probs.append(max_prob)

                            temp_indices.append(curr_indices)
                            temp_probs.append(curr_probs)

                        elif isinstance(prob, (np.ndarray, list)):
                            # Handle both single array and list of arrays
                            if isinstance(prob, list):
                                prob_arrays = prob
                            else:
                                prob_arrays = [prob]

                            all_indices = []
                            all_probs = []

                            # Process each target's probability array
                            for target_prob in prob_arrays:
                                # Check if this is a binary classification case
                                is_binary = target_prob.shape[1] == 2 and np.all(
                                    np.abs(np.sum(target_prob, axis=1) - 1) < 1e-5
                                )

                                if is_binary:
                                    # Binary classification case where row sums to 1
                                    # Use first column probability (class 0) for comparison
                                    neg_class_probs = target_prob[:, 0]
                                    pos_class_probs = target_prob[:, 1]

                                    # Use the actual probabilities directly
                                    target_indices = np.where(
                                        neg_class_probs >= float(thresold), 0, 1
                                    )
                                    target_max_probs = np.where(
                                        target_indices == 0, neg_class_probs, pos_class_probs
                                    )
                                    target_max_probs = np.round(target_max_probs, 8)

                                else:
                                    # Multi-class case (3 or more classes)
                                    row_sums = np.sum(target_prob, axis=1)
                                    is_multiclass = np.all(np.abs(row_sums - 1) < 1e-5)

                                    if is_multiclass:
                                        # Each row contains probabilities for different classes
                                        target_max_probs = np.max(target_prob, axis=1)
                                        target_indices = np.argmax(target_prob, axis=1)
                                        target_max_probs = np.round(target_max_probs, 8)

                                        # Apply threshold
                                        target_indices = np.where(
                                            target_max_probs >= float(thresold),
                                            target_indices,
                                            None,
                                        )
                                    else:
                                        # Handle as independent binary probabilities per column
                                        num_targets = target_prob.shape[1]
                                        col_indices = []
                                        col_probs = []

                                        for col in range(num_targets):
                                            col_prob = target_prob[:, col]
                                            col_prob_rounded = np.round(col_prob, 8)
                                            col_idx = np.where(
                                                col_prob_rounded >= float(thresold), 1, 0
                                            )

                                            col_indices.append(col_idx)
                                            col_probs.append(col_prob_rounded)

                                        target_indices = np.column_stack(col_indices)
                                        target_max_probs = np.column_stack(col_probs)

                                all_indices.append(target_indices)
                                all_probs.append(target_max_probs)

                            # For multi-target case, keep arrays separate
                            if len(prob_arrays) > 1:
                                # Each element in temp_indices and temp_probs will be a separate target's predictions
                                temp_indices.extend(all_indices)
                                temp_probs.extend(all_probs)
                            else:
                                # Single target case
                                temp_indices.append(all_indices[0])
                                temp_probs.append(all_probs[0])

                    # Convert to numpy arrays for consistent handling
                    if isinstance(prediction["probabilities"][0], dict):
                        class_indices = np.array(temp_indices).reshape(-1, 1)
                        max_probabilities = np.round(
                            np.array(temp_probs).reshape(-1, 1), 4
                        )  # Added rounding
                    else:
                        class_indices = np.column_stack(temp_indices)
                        max_probabilities = np.round(
                            np.column_stack(temp_probs), 4
                        )  # Added rounding

                    # Ensure proper types
                    class_indices = class_indices.astype(object)
                    max_probabilities = max_probabilities.astype(float)

                    # Create properly paired class-probability array
                    n_samples = len(class_indices)
                    n_targets = class_indices.shape[1]

                    # Initialize the combined array with the correct shape
                    combined_array = np.empty((n_samples, n_targets * 2), dtype=object)

                    # Fill the array ensuring class-probability pairs stay together
                    for i in range(n_samples):
                        for j in range(n_targets):
                            # Class goes in even indices (0, 2, 4, ...)
                            combined_array[i, j * 2] = class_indices[i, j]
                            # Probability goes in odd indices (1, 3, 5, ...)
                            combined_array[i, j * 2 + 1] = float(
                                format(max_probabilities[i, j], '.4f')
                            )

                    # Create Series with the combined array
                    prediction_df = pd.Series([combined_array])
                    target_var = process_options.get('target_variable')

                    # Create properly paired column names
                    if isinstance(target_var, list):
                        paired_columns = []
                        for var in target_var:
                            paired_columns.extend([var, f"{var}_proba"])
                        target_var = paired_columns
                    else:
                        target_var = [target_var, f"{target_var}_proba"]

                    # Create DataFrame for classification outputs
                    output = merge_predictions(
                        df,
                        pd.DataFrame(
                            prediction_df[0],
                            columns=ApplyOnnxProcessor.fetch_output_col(
                                process_options, target_var
                            ),
                        ),
                    )
            except Exception as e:
                raise RuntimeError(f"Error found during model inferencing : {e}") from e

            gc.collect()
        except Exception as e:
            cexc.log_traceback()
            cexc.messages.warn(
                'Error while applying model "%s": %s' % (process_options['model_name'], str(e))
            )
            raise RuntimeError(e) from e
        return output

    def process(self):
        if self.upload:
            # if uploading, then return empty dataframe with appropriate warning/error
            self.df = pd.json_normalize(self.process_options)
        else:
            # Else, return apply results if model lookup entry is found, else error
            """If algo isn't loaded, load the model. Create the output dataframe."""
            if self.algo is None:
                self.session = models.base.load_onnx_model(
                    model_name=self.process_options['model_name'],
                    searchinfo=self.searchinfo,
                    namespace=self.namespace,
                )
            if len(self.df) > 0:
                self.df = self.apply(
                    self.df, self.algo, self.process_options, session_obj=self.session
                )
            if self.df is None:
                messages.warn('Apply method did not return any results.')
                self.df = pd.DataFrame()
