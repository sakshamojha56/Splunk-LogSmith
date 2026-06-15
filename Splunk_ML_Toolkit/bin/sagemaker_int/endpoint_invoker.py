"""SageMaker Endpoint Invoker - Production-ready AWS SageMaker integration for MLTK."""

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError, BotoCoreError, UnknownServiceError
import json
import time
from typing import Dict, Any, Union, List, Tuple, Optional
import pandas as pd
import numpy as np
from io import BytesIO
import struct
from util import df_util
import cexc

from sagemaker_int.constants import (
    CONTENT_TYPE_JSON,
    CONTENT_TYPE_JSONLINES,
    CONTENT_TYPE_CSV,
    CONTENT_TYPE_PLAIN,
    CONTENT_TYPE_NPY,
    CONTENT_TYPE_PARQUET,
    CONTENT_TYPE_PARQUET_ALT,
    CONTENT_TYPE_LIBSVM,
    CONTENT_TYPE_RECORDIO,
    AWS_SESSION_NAME_PREFIX,
    AWS_CREDENTIALS_DURATION_SECONDS,
    BOTO_CONNECT_TIMEOUT,
    BOTO_READ_TIMEOUT,
    BOTO_MAX_RETRIES,
    MLTK_INTERNAL_COLUMN_PREFIX,
)

logger = cexc.get_logger(__name__)

try:
    from sagemaker_int.schema_core import (
        SchemaValidator,
        ValidationError,
        ConfigurationError,
        SchemaPathError,
        EndpointError,
    )

    SCHEMA_VALIDATOR_AVAILABLE = True
except ImportError:
    SCHEMA_VALIDATOR_AVAILABLE = False

    class ValidationError(Exception):
        pass

    class ConfigurationError(ValidationError):
        pass

    class SchemaPathError(ValidationError):
        pass

    class EndpointError(ValidationError):
        pass

    logger.warning("SchemaValidator not available - only dynamic mode will work")


class SageMakerInvoker:
    """SageMaker endpoint invoker with schema-driven validation and AWS STS."""

    def __init__(
        self,
        aws_access_key_id: str,
        aws_secret_access_key: str,
        aws_role_arn: str,
        aws_region: str,
    ):
        self.aws_access_key_id = aws_access_key_id
        self.aws_secret_access_key = aws_secret_access_key
        self.aws_role_arn = aws_role_arn
        self.aws_region = aws_region
        self.aws_session_name = AWS_SESSION_NAME_PREFIX
        self._payload_validated = False

        # Streaming statistics (O(1) memory) - persists across chunks
        self._api_call_count = 0
        self._api_call_sum = 0.0
        self._api_call_min = float('inf')
        self._api_call_max = 0.0

        self.boto_config = Config(
            connect_timeout=BOTO_CONNECT_TIMEOUT,
            read_timeout=BOTO_READ_TIMEOUT,
            retries={'max_attempts': BOTO_MAX_RETRIES},
        )

        self.aws_keys = self._assume_role()

    def _assume_role(self) -> Dict[str, str]:
        try:
            session = boto3.Session(self.aws_access_key_id, self.aws_secret_access_key)
            sts = session.client("sts", region_name=self.aws_region, config=self.boto_config)
            response = sts.assume_role(
                RoleArn=self.aws_role_arn,
                RoleSessionName=self.aws_session_name,
                DurationSeconds=AWS_CREDENTIALS_DURATION_SECONDS,
            )
            creds = response['Credentials']
            expiration = creds.get('Expiration')
            if expiration:
                logger.info(f"AWS credentials will expire at: {expiration}")
            return {
                "aws_access_key_id": creds['AccessKeyId'],
                "aws_secret_access_key": creds['SecretAccessKey'],
                "aws_session_token": creds['SessionToken'],
                "region_name": self.aws_region,
            }
        except ClientError as e:
            error_code = e.response.get('Error', {}).get('Code', 'Unknown')
            error_message = e.response.get('Error', {}).get('Message', str(e))
            logger.error(f"Failed to assume AWS role:")
            logger.error(f"  Error Code: {error_code}")
            logger.error(f"  Error Message: {error_message}")

            if error_code == 'AccessDenied':
                raise RuntimeError(
                    f"Access denied when assuming AWS role. Please verify that your AWS credentials have permission to assume the configured role."
                )
            elif error_code == 'InvalidClientTokenId':
                raise RuntimeError(
                    f"AWS credentials are invalid. Please verify your AWS access key ID and secret access key."
                )
            elif error_code == 'SignatureDoesNotMatch':
                raise RuntimeError(
                    f"AWS credentials signature mismatch. Please verify your AWS secret access key is correct."
                )
            else:
                raise RuntimeError(
                    f"Unable to authenticate with AWS. Please verify your AWS credentials and permissions."
                )

        except UnknownServiceError as e:
            logger.warning(
                f"STS service not available in boto3 (Windows limitation). "
                f"Falling back to direct credentials without role assumption."
            )
            return {
                "aws_access_key_id": self.aws_access_key_id,
                "aws_secret_access_key": self.aws_secret_access_key,
                "aws_session_token": None,
                "region_name": self.aws_region,
            }

        except BotoCoreError as e:
            logger.error(f"Network error during AWS role assumption: {str(e)}")
            raise RuntimeError(
                f"Network error while connecting to AWS. Please check your network connection."
            )

        except Exception as e:
            logger.error(f"Unexpected error during AWS role assumption: {str(e)}")
            raise RuntimeError(
                f"Unable to establish AWS session. Please contact your administrator."
            )

    def _invoke_endpoint(
        self,
        endpoint_name: str,
        payload: Union[dict, str, bytes],
        content_type: str = CONTENT_TYPE_JSON,
        return_raw: bool = False,
    ) -> Union[Any, Tuple[bytes, str]]:
        """Invoke SageMaker endpoint."""
        # Step 1: Prepare body based on content type and payload type
        if isinstance(payload, bytes):
            body = payload
        elif content_type == CONTENT_TYPE_JSON and isinstance(payload, dict):
            body = json.dumps(payload)
        elif isinstance(payload, str):
            body = payload
        else:
            body = json.dumps(payload)

        # Step 2: Create SageMaker runtime client and invoke endpoint
        client = boto3.client(
            'sagemaker-runtime',
            aws_access_key_id=self.aws_keys['aws_access_key_id'],
            aws_secret_access_key=self.aws_keys['aws_secret_access_key'],
            aws_session_token=self.aws_keys['aws_session_token'],
            region_name=self.aws_keys['region_name'],
            config=self.boto_config,
        )

        try:
            invoke_start = time.time()
            response = client.invoke_endpoint(
                EndpointName=endpoint_name, Body=body, ContentType=content_type
            )
            raw_body = response['Body'].read()
            invoke_duration = time.time() - invoke_start
            response_content_type = response.get('ContentType', content_type)

            # Update streaming statistics (O(1) memory, O(1) CPU)
            self._api_call_count += 1
            self._api_call_sum += invoke_duration
            self._api_call_min = min(self._api_call_min, invoke_duration)
            self._api_call_max = max(self._api_call_max, invoke_duration)

        except ClientError as e:
            error_code = e.response.get('Error', {}).get('Code', 'Unknown')
            error_message = e.response.get('Error', {}).get('Message', str(e))
            logger.error(f"SageMaker ClientError for endpoint '{endpoint_name}':")
            logger.error(f"  Error Code: {error_code}")
            logger.error(f"  Error Message: {error_message}")
            logger.error(f"  Content Type: {content_type}")

            if error_code == 'ModelError':
                if 'Expected instances' in error_message or 'expected' in error_message.lower():
                    raise RuntimeError(
                        f"The data format sent to the model does not match what the endpoint expects. "
                        f"Please verify the model's input requirements and ensure your data is structured correctly."
                    )
                else:
                    raise RuntimeError(
                        f"The SageMaker model encountered an error while processing your request. "
                        f"Please check your input data format or contact your administrator."
                    )

            elif error_code == 'ValidationException' or error_code == 'ValidationError':
                raise RuntimeError(
                    f"Invalid request to SageMaker endpoint. Please verify the endpoint configuration and input data format."
                )

            elif error_code == 'ServiceUnavailable' or error_code == 'InternalServerError':
                raise RuntimeError(
                    f"The SageMaker endpoint is temporarily unavailable. Please try again in a few moments."
                )

            elif error_code == 'ResourceNotFound' or 'Could not find endpoint' in error_message:
                raise RuntimeError(
                    f"SageMaker endpoint '{endpoint_name}' not found. Please register the model"
                )

            elif 'Throttling' in error_code or 'TooManyRequests' in error_code:
                raise RuntimeError(
                    f"Too many requests to the SageMaker endpoint. Please reduce the request rate or try again later."
                )

            elif (
                error_code == 'ExpiredTokenException'
                or 'token' in error_message.lower()
                and 'expired' in error_message.lower()
            ):
                raise RuntimeError(
                    f"AWS credentials expired during long-running operation. The current session allows up to 2 hours. "
                    f"Please split large datasets into smaller batches or contact your administrator."
                )

            else:
                raise RuntimeError(
                    f"Unable to invoke the SageMaker endpoint. Please contact your administrator for assistance."
                )

        except BotoCoreError as e:
            logger.error(f"BotoCoreError for endpoint '{endpoint_name}': {str(e)}")
            raise RuntimeError(
                f"Network error while connecting to SageMaker endpoint. Please check your network connection and AWS credentials."
            )

        except Exception as e:
            logger.error(f"Unexpected error invoking endpoint '{endpoint_name}': {str(e)}")
            raise RuntimeError(
                f"An unexpected error occurred while invoking the SageMaker endpoint. Please contact your administrator."
            )

        # Step 3: Return raw or parsed response
        if return_raw:
            return raw_body, response_content_type
        else:
            return self._parse_response(raw_body, response_content_type)

    def _parse_response(self, response_body: bytes, content_type: str) -> Any:
        """Parse response from endpoint - handles all SageMaker content types."""
        if content_type.startswith(CONTENT_TYPE_NPY):
            buffer = BytesIO(response_body)
            arr = np.load(buffer, allow_pickle=False)
            return arr.tolist() if arr.ndim > 0 else [float(arr)]

        elif content_type in [CONTENT_TYPE_PARQUET, CONTENT_TYPE_PARQUET_ALT]:
            buffer = BytesIO(response_body)
            df = pd.read_parquet(buffer)
            return df.to_dict('records')

        elif content_type.startswith(CONTENT_TYPE_RECORDIO):
            buffer = BytesIO(response_body)
            results = []
            while True:
                length_bytes = buffer.read(4)
                if not length_bytes:
                    break
                length = struct.unpack('I', length_bytes)[0]
                record_bytes = buffer.read(length)
                record = json.loads(record_bytes.decode('utf-8'))
                results.append(record)
            return results

        try:
            decoded = response_body.decode('utf-8')
        except UnicodeDecodeError:
            logger.error("Failed to decode response body as UTF-8")
            return []

        if 'json' in content_type.lower():
            if 'jsonlines' in content_type.lower():
                lines = decoded.strip().split('\n')
                results = []
                for line in lines:
                    if line.strip():
                        try:
                            results.append(json.loads(line))
                        except json.JSONDecodeError:
                            results.append(line)
                return results

            try:
                return json.loads(decoded)
            except json.JSONDecodeError:
                lines = decoded.strip().split('\n')
                if len(lines) == 1:
                    try:
                        return float(lines[0])
                    except ValueError:
                        return lines[0]
                else:
                    results = []
                    for line in lines:
                        if line.strip():
                            try:
                                results.append(json.loads(line))
                            except json.JSONDecodeError:
                                try:
                                    results.append(float(line))
                                except ValueError:
                                    results.append(line)
                    return results

        elif 'csv' in content_type.lower():
            lines = decoded.strip().split('\n')
            results = []
            for line in lines:
                if line.strip():
                    values = line.split(',')
                    if len(values) == 1:
                        try:
                            val = float(values[0].strip())
                            results.append(int(val) if val == int(val) else val)
                        except ValueError:
                            results.append(values[0].strip())
                    else:
                        row = []
                        for val in values:
                            try:
                                v = float(val.strip())
                                row.append(int(v) if v == int(v) else v)
                            except ValueError:
                                row.append(val.strip())
                        results.append(row)
            return results

        elif CONTENT_TYPE_LIBSVM in content_type.lower():
            lines = decoded.strip().split('\n')
            results = []
            for line in lines:
                if line.strip():
                    try:
                        results.append(int(float(line.strip())))
                    except ValueError:
                        results.append(line.strip())
            return results

        else:
            lines = decoded.strip().split('\n')
            if len(lines) == 1:
                return decoded.strip()
            return [line.strip() for line in lines if line.strip()]

    def _prepare_data(
        self, df: pd.DataFrame, features: List[str], options: Dict
    ) -> Tuple[pd.DataFrame, Any]:
        X = df.copy()
        X = X.loc[:, ~X.columns.str.startswith(MLTK_INTERNAL_COLUMN_PREFIX)]

        if len(features) == 0:
            features = X.columns.tolist()

        logger.debug(
            f"_prepare_data: Input DataFrame has {len(X.columns)} columns, features list has {len(features)} items"
        )

        X, nans, _ = df_util.prepare_features(
            X=X,
            variables=features,
            final_columns=X[features].columns,
            get_dummies=False,
            mlspl_limits=options.get('mlspl_limits'),
        )

        logger.debug(
            f"_prepare_data: After preparation, DataFrame has {len(X.columns)} columns: {list(X.columns)}"
        )
        return X, nans

    def _try_schema_validator(self, options: Dict) -> Tuple[Optional[Any], Optional[str]]:
        if not SCHEMA_VALIDATOR_AVAILABLE:
            return None, None

        openapi_spec = options.get('openapi_spec')
        if not openapi_spec:
            return None, None

        try:
            config = {
                'openapi_spec': openapi_spec,
                'input_feature_map': options.get('input_feature_map', {}),
                'output_prediction_map': options.get('output_prediction_map', {}),
                'batch_size': options.get('batch_size'),
            }

            validator = SchemaValidator.from_dict(config)
            content_types = validator.get_supported_content_types()
            content_type = content_types[0] if content_types else CONTENT_TYPE_JSON
            return validator, content_type

        except (ConfigurationError, SchemaPathError) as e:
            logger.error(f"Schema validation error: {e}")
            return None, None

        except Exception as e:
            logger.error(f"Failed to initialize SchemaValidator: {e}")
            return None, None

    def _invoke_with_validator(
        self,
        endpoint_name: str,
        content_type: str,
        validator: Any,
        df: pd.DataFrame,
        features: List[str],
        nans: Any,
        options: Dict,
        original_df: pd.DataFrame = None,
    ) -> pd.DataFrame:
        """
        Invoke endpoint using SchemaValidator (schema-driven mode).

        Flow:
        1. Check validator mode (batch vs single-record)
        2. Route to appropriate invocation method
        3. Parse response using validator
        4. Create output DataFrame and merge with original features
        """
        # Step 1: Check mode - route to single-record mode if needed
        if hasattr(validator, 'is_single_record_mode') and validator.is_single_record_mode():
            return self._invoke_single_record_mode(
                endpoint_name, content_type, validator, df, features, nans, options, original_df
            )

        # Step 2: Batch mode - check if chunking needed
        batch_size = options.get('batch_size')

        if batch_size and len(df) > batch_size:
            return self._invoke_batch_mode_chunked(
                endpoint_name,
                content_type,
                validator,
                df,
                features,
                nans,
                options,
                batch_size,
                original_df,
            )

        # Step 3: Batch mode without chunking - invoke once for all rows
        payload = validator.dataframe_to_payload(df, content_type)
        raw_body, response_ct = self._invoke_endpoint(
            endpoint_name, payload, content_type, return_raw=True
        )

        # Step 4: Parse response using validator (pattern-aware)
        response_str = raw_body.decode('utf-8') if isinstance(raw_body, bytes) else raw_body
        result_df = validator.response_to_dataframe(response_str, response_ct)

        # Step 5: Create output DataFrame - handles NaN rows automatically
        output = df_util.create_output_dataframe(
            y_hat=result_df.values, nans=nans, output_names=list(result_df.columns)
        )

        # Step 6: Align with original df index and merge with original features
        if original_df is not None:
            output.index = original_df.index
            return df_util.merge_predictions(original_df[features], output)
        return df_util.merge_predictions(df[features], output)

    def _invoke_single_record_mode(
        self,
        endpoint_name: str,
        content_type: str,
        validator: Any,
        df: pd.DataFrame,
        features: List[str],
        nans: Any,
        options: Dict,
        original_df: pd.DataFrame = None,
    ) -> pd.DataFrame:
        """Invoke endpoint in single-record mode - one API call per DataFrame row."""
        all_results = []

        for idx, row in df.iterrows():
            try:
                single_row_df = pd.DataFrame([row])
                payload = validator.dataframe_to_payload(single_row_df, content_type)
                raw_body, response_ct = self._invoke_endpoint(
                    endpoint_name, payload, content_type, return_raw=True
                )

                response_str = (
                    raw_body.decode('utf-8') if isinstance(raw_body, bytes) else raw_body
                )
                result_df = validator.response_to_dataframe(response_str, response_ct)

                all_results.append(result_df.iloc[0].to_dict())
                logger.debug(f"Processed row {idx + 1}/{len(df)}")

            except Exception as e:
                logger.error(f"Error processing row {idx + 1}: {e}")

                error_msg = str(e).lower()
                if any(
                    keyword in error_msg
                    for keyword in [
                        'network error',
                        'could not connect',
                        'endpoint not found',
                        'not found',
                        'connection',
                        'credentials',
                        'unauthorized',
                        'access denied',
                        'permission',
                    ]
                ):
                    raise

                logger.warning(f"Non-critical error for row {idx + 1}, adding empty result")
                if all_results:
                    empty_result = {col: None for col in all_results[0].keys()}
                    all_results.append(empty_result)
                else:
                    all_results.append({'prediction': None, 'error': str(e)})

        result_df = pd.DataFrame(all_results)

        y_hat = result_df.values
        output_names = list(result_df.columns)

        if y_hat.ndim == 2 and y_hat.shape[1] == 1:
            y_hat = y_hat.reshape(-1)
            output_names = output_names[0]

        output = df_util.create_output_dataframe(
            y_hat=y_hat, nans=nans, output_names=output_names
        )

        if original_df is not None:
            output.index = original_df.index
            return df_util.merge_predictions(original_df[features], output)
        return df_util.merge_predictions(df[features], output)

    def _invoke_batch_mode_chunked(
        self,
        endpoint_name: str,
        content_type: str,
        validator: Any,
        df: pd.DataFrame,
        features: List[str],
        nans: Any,
        options: Dict,
        batch_size: int,
        original_df: pd.DataFrame = None,
    ) -> pd.DataFrame:
        """Invoke endpoint in batch mode with automatic chunking for large DataFrames."""
        num_chunks = (len(df) + batch_size - 1) // batch_size

        all_results = []

        for chunk_idx in range(num_chunks):
            start_idx = chunk_idx * batch_size
            end_idx = min((chunk_idx + 1) * batch_size, len(df))
            chunk_df = df.iloc[start_idx:end_idx].copy()

            try:
                payload_str = validator.dataframe_to_payload(chunk_df, content_type)
                raw_body, response_ct = self._invoke_endpoint(
                    endpoint_name, payload_str, content_type, return_raw=True
                )

                response_str = (
                    raw_body.decode('utf-8') if isinstance(raw_body, bytes) else raw_body
                )
                result_df = validator.response_to_dataframe(response_str, response_ct)

                if len(result_df) != len(chunk_df):
                    logger.warning(
                        f"Batch {chunk_idx + 1}: Response has {len(result_df)} rows, expected {len(chunk_df)}. This may cause misalignment."
                    )

                all_results.append(result_df)

            except Exception as e:
                logger.error(f"Batch {chunk_idx + 1}/{num_chunks} failed: {str(e)}")
                cexc.log_traceback()

                error_msg = str(e).lower()
                if any(
                    keyword in error_msg
                    for keyword in [
                        'network error',
                        'could not connect',
                        'endpoint not found',
                        'not found',
                        'connection',
                        'credentials',
                        'unauthorized',
                        'access denied',
                        'permission',
                    ]
                ):
                    raise

                logger.warning(
                    f"Non-critical error in batch {chunk_idx + 1}, padding with null rows"
                )
                error_cols = list(all_results[0].columns) if all_results else ['prediction']
                error_df = pd.DataFrame(
                    [[None] * len(error_cols)] * len(chunk_df), columns=error_cols
                )
                all_results.append(error_df)
                logger.warning(f"Batch {chunk_idx + 1}: Padded with {len(chunk_df)} null rows")

        combined_results = pd.concat(all_results, ignore_index=True)

        expected_non_nan_rows = (~nans).sum()
        if len(combined_results) != expected_non_nan_rows:
            logger.error(
                f"Result row count mismatch: got {len(combined_results)} predictions for {expected_non_nan_rows} non-NaN input rows"
            )
            raise RuntimeError(
                "Prediction results count doesn't match input data. This may indicate an endpoint issue. Please contact your administrator."
            )

        output = df_util.create_output_dataframe(
            y_hat=combined_results.values,
            nans=nans,
            output_names=list(combined_results.columns),
        )

        if original_df is not None:
            output.index = original_df.index
            return df_util.merge_predictions(original_df[features], output)
        return df_util.merge_predictions(df[features], output)

    def apply(
        self, endpoint_name: str, df: pd.DataFrame, features: List[str], options: Dict
    ) -> Any:
        """
        Main entry point for SageMaker endpoint inference with schema validation.

        Pipeline:
        1. Filter internal columns
        2. Prepare data (handles NaN values)
        3. Initialize SchemaValidator
        4. One-time payload validation
        5. Invoke endpoint with appropriate mode
        6. Return predictions merged with original features
        """
        total_start = time.time()
        input_rows = len(df)

        # Note: Streaming stats (_api_call_count, _api_call_sum, etc.) persist across chunks
        # This allows accurate metrics across the entire dataset, not just the last chunk

        try:
            # Step 1: Filter MLTK internal columns
            df = df.loc[:, ~df.columns.str.startswith(MLTK_INTERNAL_COLUMN_PREFIX)]

            # Step 2: Prepare data (filters NaN rows, cleans data)
            X, nans = self._prepare_data(df, features, options)

            # Step 3: Initialize SchemaValidator from options
            validator, content_type = self._try_schema_validator(options)

            if not validator:
                raise RuntimeError(
                    "SageMaker models require OpenAPI specification and feature maps. "
                    "Please ensure your model was registered with 'openapi_spec', 'input_feature_map', and 'output_prediction_map'."
                )

            # Step 4: One-time validation (first invocation only)
            if not self._payload_validated:
                validator.validate_payload_structure(X, content_type)
                self._payload_validated = True

            # Step 5: Invoke using SchemaValidator (handles batch/single-record routing)
            result = self._invoke_with_validator(
                endpoint_name, content_type, validator, X, features, nans, options, df
            )

            total_duration = time.time() - total_start

            # Calculate API call timing statistics from streaming stats
            batch_size_used = options.get('batch_size', 1)
            if self._api_call_count > 0:
                min_time = self._api_call_min
                max_time = self._api_call_max
                avg_time = self._api_call_sum / self._api_call_count
            else:
                min_time = max_time = avg_time = 0

            # Store metrics for upstream logging (cumulative across all chunks)
            self.last_invoke_metrics = {
                'endpoint': endpoint_name,
                'batch_size': batch_size_used,
                'min_time': min_time,
                'max_time': max_time,
                'avg_time': avg_time,
                'total_time': total_duration,
                'api_call_count': self._api_call_count,
            }

            return result

        except Exception as e:
            total_duration = time.time() - total_start
            batch_size_used = options.get('batch_size', 1)

            # Calculate stats even on failure (if any API calls were made)
            if self._api_call_count > 0:
                min_time = self._api_call_min
                max_time = self._api_call_max
                avg_time = self._api_call_sum / self._api_call_count
            else:
                min_time = max_time = avg_time = 0

            # Store metrics for upstream logging (even on failure)
            self.last_invoke_metrics = {
                'endpoint': endpoint_name,
                'batch_size': batch_size_used,
                'min_time': min_time,
                'max_time': max_time,
                'avg_time': avg_time,
                'total_time': total_duration,
                'api_call_count': self._api_call_count,
                'error': str(e),
            }

            raise
