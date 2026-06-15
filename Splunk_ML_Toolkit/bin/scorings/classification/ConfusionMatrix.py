#!/usr/bin/env python

import pandas as pd
import numpy as np  # Python 3.13 upgrade: Added numpy import for array operations in confusion matrix processing

from base_scoring import BaseScoring, ClassificationScoringMixin
from util.param_util import convert_params
from util.scoring_util import get_and_check_fields_two_1d_arrays


class ConfusionMatrixScoring(ClassificationScoringMixin, BaseScoring):
    """Implements sklearn.metrics.confusion_matrix"""

    def handle_options(self, options):
        """Only single-field against single-field comparisons supported."""
        params = options.get('params', {})
        params, _meta_params = self.convert_param_types(params)
        actual_fields, predicted_fields = get_and_check_fields_two_1d_arrays(
            options,
            self.scoring_name,
            a_field_alias='actual_field',
            b_field_alias='predicted_field',
        )
        return params, actual_fields, predicted_fields, _meta_params

    @staticmethod
    def convert_param_types(params):
        out_params = convert_params(params)
        _meta_params = {
            'class_variable_headers': True
        }  # Confusion matrix populates rows & cols with class-variables
        return out_params, _meta_params

    def score(self, df, options):
        """Confusion matrix requires arrays to be reshaped.

        Python 3.13 Upgrade: Enhanced to handle label encoding consistency
        for confusion matrix output formatting with proper label management.
        """
        # Prepare ground-truth and predicted labels
        actual_array, predicted_array = self.prepare_input_data(
            df, options.get('mlspl_limits', {})
        )

        # Convert arrays for sklearn compatibility and get label encoder
        a_processed, p_processed, label_encoder = self._convert_arrays_for_sklearn(
            actual_array.flatten(), predicted_array.flatten()
        )

        # Filter parameters to only include those accepted by the scoring function
        filtered_params = self._filter_params_for_scoring_function(self.params)

        # Apply the same parameter encoding logic as used in PRFS, specifically for labels
        if 'labels' in filtered_params:
            if label_encoder is not None:
                # Convert string labels to encoded integers using label encoder
                try:
                    original_labels = filtered_params['labels']
                    encoded_labels = []
                    for label in original_labels:
                        try:
                            # Convert label to string first, then encode
                            label_str = str(label)
                            encoded_label = label_encoder.transform([label_str])[0]
                            encoded_labels.append(encoded_label)
                        except (ValueError, KeyError):
                            # If label not in encoder, skip it
                            continue
                    filtered_params['labels'] = sorted(set(encoded_labels))
                except Exception as e:
                    # Fallback: use unique labels from processed data
                    unique_labels = np.unique(np.concatenate([a_processed, p_processed]))
                    filtered_params['labels'] = sorted(unique_labels)
            else:
                # No label encoder - data is already numeric, convert string labels to numeric
                try:
                    original_labels = filtered_params['labels']
                    numeric_labels = []
                    for label in original_labels:
                        try:
                            # Try to convert string label to int (e.g., '0' -> 0, '1.0' -> 1)
                            label_str = str(label)
                            # Handle both integer and float string representations
                            if '.' in label_str:
                                numeric_label = int(float(label_str))
                            else:
                                numeric_label = int(label_str)
                            numeric_labels.append(numeric_label)
                        except (ValueError, TypeError):
                            # If conversion fails, skip this label
                            continue
                    # Get unique numeric labels and only keep those that exist in the data
                    unique_data_labels = set(
                        np.unique(np.concatenate([a_processed, p_processed])).astype(int)
                    )
                    valid_labels = [
                        label for label in set(numeric_labels) if label in unique_data_labels
                    ]
                    filtered_params['labels'] = sorted(valid_labels)
                except Exception as e:
                    # Fallback: use unique labels from processed data
                    unique_labels = np.unique(np.concatenate([a_processed, p_processed]))
                    filtered_params['labels'] = sorted(unique_labels.astype(int))

        # Ensure labels parameter is consistent with encoded data - fallback if still not right
        if label_encoder is not None:
            # Use the encoded label range that actually appears in data
            unique_labels = np.unique(np.concatenate([a_processed, p_processed]))
            if 'labels' not in filtered_params or len(filtered_params['labels']) == 0:
                filtered_params['labels'] = sorted(unique_labels)
        elif 'labels' not in filtered_params or filtered_params['labels'] is None:
            # For non-encoded data, ensure we have the right labels
            unique_labels = np.unique(np.concatenate([a_processed, p_processed]))
            filtered_params['labels'] = sorted(unique_labels)

        # Get the scoring result
        result = self.scoring_function(a_processed, p_processed, **filtered_params)

        # Create the output df with proper label handling
        df_output = self.create_output(
            self.scoring_name, result, label_encoder, filtered_params.get('labels')
        )
        return df_output

    def create_output(self, scoring_name, result, label_encoder=None, actual_labels=None):
        """Output dataframe differs from parent.

        The indices of confusion matrix columns/rows should correspond.
        Columns represent predicted results, rows represent ground-truth.

        Python 3.13 Upgrade: Enhanced to handle encoded labels and ensure
        proper dimensional consistency for DataFrame creation with actual label management.
        """
        # Get class variables from various sources in priority order
        class_variables = None

        # 1. Use actual_labels if provided (most accurate)
        if actual_labels is not None:
            class_variables = list(actual_labels)

        # 2. If we have a label encoder, use the original class names
        elif label_encoder is not None and hasattr(label_encoder, 'classes_'):
            class_variables = list(label_encoder.classes_)

        # 3. Use labels parameter if available
        elif 'labels' in self.params and self.params['labels'] is not None:
            class_variables = list(self.params['labels'])

        # 4. Derive from result dimensions as fallback
        if class_variables is None:
            result_shape = (
                result.shape
                if hasattr(result, 'shape')
                else (len(result), len(result[0]) if result else 0)
            )
            n_classes = result_shape[0] if len(result_shape) > 1 else len(result)
            class_variables = list(range(n_classes))

        # Ensure class_variables matches result dimensions exactly
        result_shape = (
            result.shape
            if hasattr(result, 'shape')
            else (len(result), len(result[0]) if result else 0)
        )
        expected_size = result_shape[0] if len(result_shape) > 1 else len(result)

        if len(class_variables) != expected_size:
            # Adjust to match actual result size
            if len(class_variables) > expected_size:
                class_variables = class_variables[:expected_size]
            else:
                # Extend with numeric labels
                class_variables.extend(range(len(class_variables), expected_size))

        # Create labels for output
        col_labels = ['Label'] + ['predicted({})'.format(i) for i in class_variables]
        row_labels = pd.DataFrame(['actual({})'.format(i) for i in class_variables])

        # Create output df
        result_df = pd.DataFrame(result)

        # Ensure result_df has the right number of columns to match class_variables
        while result_df.shape[1] < len(class_variables):
            result_df[result_df.shape[1]] = 0
        while result_df.shape[1] > len(class_variables):
            result_df = result_df.iloc[:, :-1]

        # Ensure result_df has the right number of rows
        while result_df.shape[0] < len(class_variables):
            result_df.loc[result_df.shape[0]] = 0
        while result_df.shape[0] > len(class_variables):
            result_df = result_df.iloc[:-1, :]

        output_df = pd.concat((row_labels, result_df), axis=1)

        # Set column names, ensuring we have the right number
        if len(col_labels) == output_df.shape[1]:
            output_df.columns = col_labels
        else:
            # Fallback: create generic column names that match actual shape
            generic_labels = ['Label'] + [
                f'predicted({i})' for i in range(output_df.shape[1] - 1)
            ]
            output_df.columns = generic_labels

        return output_df
