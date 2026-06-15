"""Vertex AI Endpoint Invoker - Production-ready Vertex prediction integration for MLTK."""

import json
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional, Tuple

import pandas as pd

import cexc
from util import df_util
from util.vertex_validation_util import _normalize_vertex_endpoint_path
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
    from vertex_int.payload_builder import VertexPayloadBuilder
    from vertex_int.response_parser import VertexResponseParser

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


class VertexInvoker:
    """Vertex AI endpoint invoker with schema-driven validation and OAuth auth."""

    def __init__(self, gcp_credentials: Dict[str, Any], endpoint_name: Optional[str] = None):
        self.project_id = gcp_credentials.get('project_id')
        self.region = gcp_credentials.get('region')
        self.endpoint_id = gcp_credentials.get('endpoint_id')
        self.endpoint_name = endpoint_name or ''
        self.service_account_json = gcp_credentials.get('service_account_json')

        self._payload_validated = False
        self._credentials = None
        self._prediction_client = None

        # Streaming statistics (O(1) memory) - persists across chunks
        self._api_call_count = 0
        self._api_call_sum = 0.0
        self._api_call_min = float('inf')
        self._api_call_max = 0.0

        self._init_credentials()

    def _init_credentials(self) -> None:
        try:
            from google.oauth2 import service_account
        except Exception:
            raise RuntimeError(
                "Google authentication libraries are not installed. "
                "Install google-auth to enable Vertex endpoint invocation."
            )

        if not self.service_account_json:
            raise RuntimeError(
                "Missing service account JSON for Vertex authentication. "
                "Please re-register the model with valid credentials."
            )

        try:
            if isinstance(self.service_account_json, str):
                service_account_info = json.loads(self.service_account_json)
            else:
                service_account_info = self.service_account_json
        except json.JSONDecodeError:
            raise RuntimeError("Service account JSON is invalid. Please re-register the model.")

        try:
            self._credentials = service_account.Credentials.from_service_account_info(
                service_account_info,
                scopes=['https://www.googleapis.com/auth/cloud-platform'],
            )
        except Exception as exc:
            logger.error(f"Failed to authenticate with Vertex credentials: {exc}")
            raise RuntimeError(
                "Authentication failed while preparing Vertex invocation. "
                "Verify your service account JSON and permissions."
            )

        self._init_prediction_client()

    def _init_prediction_client(self) -> None:
        """Initialize Vertex PredictionService client if SDK is available."""
        try:
            from google.cloud import aiplatform_v1
        except Exception as exc:
            logger.warning(
                "google-cloud-aiplatform is not available; "
                f"falling back to direct REST invocation. Details: {exc}"
            )
            self._prediction_client = None
            return

        try:
            client_options = (
                {'api_endpoint': f"{self.region}-aiplatform.googleapis.com"}
                if self.region
                else None
            )
            self._prediction_client = aiplatform_v1.PredictionServiceClient(
                credentials=self._credentials,
                client_options=client_options,
            )
        except Exception as exc:
            logger.warning(
                "Failed to initialize Vertex PredictionServiceClient; "
                f"falling back to direct REST invocation. Details: {exc}"
            )
            self._prediction_client = None

    def _get_access_token(self) -> str:
        from google.auth.transport.requests import Request

        if not self._credentials:
            self._init_credentials()

        if not self._credentials.valid or self._credentials.expired:
            self._credentials.refresh(Request())
        return self._credentials.token

    def _build_endpoint_url(self) -> Tuple[str, str]:
        if not self.project_id or not self.region or not self.endpoint_id:
            raise RuntimeError(
                "Vertex credentials are missing required fields: "
                "'project_id', 'region', and 'endpoint_id'. Please re-register the model."
            )

        endpoint_path = _normalize_vertex_endpoint_path(
            self.endpoint_name, self.project_id, self.region, self.endpoint_id
        )
        endpoint_url = (
            f"https://{self.region}-aiplatform.googleapis.com/v1/{endpoint_path}:predict"
        )
        return endpoint_path, endpoint_url

    def _invoke_endpoint(
        self,
        payload: Any,
        content_type: str,
        return_raw: bool = False,
        validator: Optional[Any] = None,
    ) -> Any:
        endpoint_path, endpoint_url = self._build_endpoint_url()

        if isinstance(payload, bytes):
            body = payload
        elif isinstance(payload, str):
            body = payload.encode('utf-8')
        else:
            body = json.dumps(payload).encode('utf-8')

        def invoke_with_best_transport(request_body: bytes) -> Tuple[bytes, str]:
            if self._prediction_client:
                try:
                    return self._invoke_endpoint_sdk(endpoint_path, request_body, content_type)
                except ImportError:
                    # Missing SDK proto dependency; fallback keeps existing behavior.
                    return self._invoke_endpoint_rest(
                        endpoint_path, endpoint_url, request_body, content_type
                    )
            return self._invoke_endpoint_rest(
                endpoint_path, endpoint_url, request_body, content_type
            )

        invoke_start = time.time()
        try:
            raw_body, response_content_type = invoke_with_best_transport(body)
        except RuntimeError as exc:
            # Auto-retry once for common Vertex schema mismatch:
            # endpoint expects string_value but payload contains number_value.
            if self._should_retry_with_string_cast(exc, content_type):
                retry_payload = self._coerce_payload_string_fields(
                    payload, validator, content_type, log_context='retry'
                )
                if retry_payload is not None:
                    raw_body, response_content_type = invoke_with_best_transport(
                        json.dumps(retry_payload).encode('utf-8')
                    )
                else:
                    raise RuntimeError(
                        self._build_string_number_type_mismatch_message(str(exc))
                    ) from exc
            else:
                raise

        invoke_duration = time.time() - invoke_start
        self._api_call_count += 1
        self._api_call_sum += invoke_duration
        self._api_call_min = min(self._api_call_min, invoke_duration)
        self._api_call_max = max(self._api_call_max, invoke_duration)

        if return_raw:
            return raw_body, response_content_type
        return self._parse_response(raw_body, response_content_type)

    def _should_retry_with_string_cast(self, exc: Exception, content_type: str) -> bool:
        base_content_type = content_type.split(';')[0].strip().lower() if content_type else ''
        if base_content_type != CONTENT_TYPE_JSON:
            return False
        return self._is_string_number_type_mismatch_message(str(exc))

    @staticmethod
    def _is_string_number_type_mismatch_message(message: str) -> bool:
        lower_message = message.lower()
        return 'string_value' in lower_message and 'number_value' in lower_message

    @staticmethod
    def _build_string_number_type_mismatch_message(details: str = '') -> str:
        detail_text = f" Vertex details: {details}" if details else ''
        return (
            "Vertex endpoint rejected the payload because it expected a string value "
            f"but received a number.{detail_text} Please check whether the OpenAPI "
            "spec type for the field/column mentioned by Vertex is correct. If the "
            "Vertex endpoint expects a string, register that mapped field as type "
            "'string' and make sure input_feature_map points to that field."
        )

    def _prepare_payload_for_invocation(
        self, payload: Any, validator: Optional[Any], content_type: str
    ) -> Any:
        coerced_payload = self._coerce_payload_string_fields(
            payload, validator, content_type, log_context='pre-invoke'
        )
        return coerced_payload if coerced_payload is not None else payload

    def _coerce_payload_string_fields(
        self,
        payload: Any,
        validator: Optional[Any],
        content_type: str,
        log_context: str = 'retry',
    ) -> Optional[Dict[str, Any]]:
        """Convert only OpenAPI string-typed mapped fields to strings."""
        if validator is None:
            return None

        request_schemas = getattr(validator, 'request_schemas', {})
        base_content_type = content_type.split(';')[0].strip().lower() if content_type else ''
        if base_content_type != CONTENT_TYPE_JSON:
            return None

        request_schema = request_schemas.get(content_type) or request_schemas.get(
            base_content_type
        )
        input_feature_map = getattr(validator, 'input_feature_map', {})
        get_schema_type = getattr(validator, '_get_schema_type_for_path', None)

        if not request_schema or not input_feature_map or not get_schema_type:
            return None

        try:
            if isinstance(payload, dict):
                payload_obj = json.loads(json.dumps(payload))
            elif isinstance(payload, bytes):
                payload_obj = json.loads(payload.decode('utf-8'))
            elif isinstance(payload, str):
                payload_obj = json.loads(payload)
            else:
                return None
        except Exception as exc:
            logger.warning(f"Unable to parse payload for OpenAPI string-field coercion: {exc}")
            return None

        string_paths = []
        for schema_path in input_feature_map.values():
            expected_type = get_schema_type(request_schema, schema_path)
            if expected_type == 'string':
                tokens = self._schema_path_to_payload_tokens(schema_path)
                if tokens:
                    string_paths.append((schema_path, tokens))

        if not string_paths:
            return None

        changed_paths = []
        for schema_path, tokens in string_paths:
            if self._coerce_numeric_values_at_path(payload_obj, tokens):
                changed_paths.append(schema_path)

        if not changed_paths:
            return None

        if log_context == 'pre-invoke':
            logger.warning(
                "Vertex payload field(s) declared as string in OpenAPI contained "
                f"numeric values; coercing to strings before invocation: {changed_paths}"
            )
        else:
            logger.warning(
                "Retrying Vertex invocation after coercing OpenAPI string fields "
                f"to strings: {changed_paths}"
            )
        return payload_obj

    @staticmethod
    def _schema_path_to_payload_tokens(path: str) -> List[Any]:
        """Convert a schema path like instances[*].zipcode into traversal tokens."""
        tokens = []
        for segment in path.split('.'):
            remainder = segment
            while remainder:
                if '[' not in remainder:
                    tokens.append(remainder)
                    break

                prefix, remainder = remainder.split('[', 1)
                if prefix:
                    tokens.append(prefix)

                index, remainder = remainder.split(']', 1)
                if index == '*':
                    tokens.append('*')
                elif index.isdigit():
                    tokens.append(int(index))
                else:
                    tokens.append(index)

        return [token for token in tokens if token != '']

    def _coerce_numeric_values_at_path(self, value: Any, tokens: List[Any]) -> bool:
        """Mutate numeric values at a tokenized payload path into strings."""
        if not tokens:
            return False

        token = tokens[0]
        remaining = tokens[1:]

        if token == '*':
            if not isinstance(value, list):
                return False
            changed = False
            for item in value:
                changed = self._coerce_numeric_values_at_path(item, remaining) or changed
            return changed

        if isinstance(token, int):
            if not isinstance(value, list) or token >= len(value):
                return False
            if not remaining:
                item = value[token]
                if isinstance(item, (int, float)) and not isinstance(item, bool):
                    value[token] = str(item)
                    return True
                return False
            return self._coerce_numeric_values_at_path(value[token], remaining)

        if not isinstance(value, dict) or token not in value:
            return False

        if not remaining:
            item = value[token]
            if isinstance(item, (int, float)) and not isinstance(item, bool):
                value[token] = str(item)
                return True
            return False

        return self._coerce_numeric_values_at_path(value[token], remaining)

    def _invoke_endpoint_sdk(
        self, endpoint_path: str, body: bytes, content_type: str
    ) -> Tuple[bytes, str]:
        """Invoke Vertex endpoint using PredictionServiceClient.raw_predict."""
        try:
            from google.api.httpbody_pb2 import HttpBody
            from google.api_core import exceptions as gax_exceptions
        except Exception as exc:
            logger.warning(
                "Vertex SDK invocation dependencies are unavailable; "
                f"falling back to direct REST invocation. Details: {exc}"
            )
            raise ImportError(str(exc))

        try:
            response = self._prediction_client.raw_predict(
                endpoint=endpoint_path,
                http_body=HttpBody(data=body, content_type=content_type),
            )
            raw_body = response.data
            response_content_type = response.content_type or content_type
            return raw_body, response_content_type
        except gax_exceptions.InvalidArgument as exc:
            raise RuntimeError(
                f"Invalid request to Vertex endpoint. Please verify the input data format. Details: {exc}"
            )
        except gax_exceptions.Unauthenticated:
            raise RuntimeError(
                "Unauthorized request to Vertex endpoint. Verify service account permissions."
            )
        except gax_exceptions.PermissionDenied:
            raise RuntimeError(
                "Access denied to Vertex endpoint. Verify service account permissions."
            )
        except gax_exceptions.NotFound:
            raise RuntimeError(
                "Vertex endpoint not found. Please verify the endpoint configuration."
            )
        except gax_exceptions.ResourceExhausted:
            raise RuntimeError(
                "Too many requests to Vertex endpoint. Please reduce request rate."
            )
        except (gax_exceptions.DeadlineExceeded, gax_exceptions.ServiceUnavailable):
            raise RuntimeError(
                "Network error while connecting to Vertex endpoint. Please try again later."
            )
        except gax_exceptions.GoogleAPICallError as exc:
            logger.error(f"Vertex API call error for endpoint '{endpoint_path}': {exc}")
            raise RuntimeError(
                "Unable to invoke the Vertex endpoint. Please contact your administrator."
            )
        except Exception as exc:
            logger.error(
                f"Unexpected SDK error invoking Vertex endpoint '{endpoint_path}': {exc}"
            )
            raise RuntimeError(
                "An unexpected error occurred while invoking the Vertex endpoint."
            )

    def _invoke_endpoint_rest(
        self, endpoint_path: str, endpoint_url: str, body: bytes, content_type: str
    ) -> Tuple[bytes, str]:
        """Invoke Vertex endpoint via direct REST (fallback path)."""
        token = self._get_access_token()
        headers = {
            'Authorization': f"Bearer {token}",
            'Content-Type': content_type,
        }

        request = urllib.request.Request(
            endpoint_url,
            data=body,
            headers=headers,
            method='POST',
        )

        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                raw_body = response.read()
                response_content_type = response.headers.get('Content-Type', content_type)
                return raw_body, response_content_type
        except urllib.error.HTTPError as exc:
            error_details = ''
            try:
                error_details = exc.read().decode('utf-8')
            except Exception:
                error_details = ''

            logger.error(
                f"Vertex HTTPError for endpoint '{endpoint_path}': {exc.code} {exc.reason}"
            )

            if exc.code == 400:
                details = f" Details: {error_details}" if error_details else ''
                message = (
                    "Invalid request to Vertex endpoint. Please verify the input data format."
                    f"{details}"
                )
                if self._is_string_number_type_mismatch_message(error_details):
                    message = (
                        f"{message} " f"{self._build_string_number_type_mismatch_message()}"
                    )
                raise RuntimeError(message)
            if exc.code == 401:
                raise RuntimeError(
                    "Unauthorized request to Vertex endpoint. Verify service account permissions."
                )
            if exc.code == 403:
                raise RuntimeError(
                    "Access denied to Vertex endpoint. Verify service account permissions."
                )
            if exc.code == 404:
                raise RuntimeError(
                    "Vertex endpoint not found. Please verify the endpoint configuration."
                )
            if exc.code == 429:
                raise RuntimeError(
                    "Too many requests to Vertex endpoint. Please reduce request rate."
                )
            raise RuntimeError(
                "Unable to invoke the Vertex endpoint. Please contact your administrator."
            )
        except urllib.error.URLError as exc:
            logger.error(f"Network error during Vertex invocation: {exc}")
            raise RuntimeError(
                "Network error while connecting to Vertex endpoint. Please try again later."
            )
        except Exception as exc:
            logger.error(f"Unexpected error invoking Vertex endpoint: {exc}")
            raise RuntimeError(
                "An unexpected error occurred while invoking the Vertex endpoint."
            )

    def _parse_response(self, response_body: bytes, content_type: str) -> Any:
        if content_type.startswith(CONTENT_TYPE_NPY):
            import numpy as np
            from io import BytesIO

            buffer = BytesIO(response_body)
            arr = np.load(buffer, allow_pickle=False)
            return arr.tolist() if arr.ndim > 0 else [float(arr)]

        if content_type in [CONTENT_TYPE_PARQUET, CONTENT_TYPE_PARQUET_ALT]:
            from io import BytesIO

            df = pd.read_parquet(BytesIO(response_body))
            return df.to_dict('records')

        if content_type.startswith(CONTENT_TYPE_RECORDIO):
            from io import BytesIO
            import struct

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
                return decoded

        if 'csv' in content_type.lower():
            lines = decoded.strip().split('\n')
            results = []
            for line in lines:
                if line.strip():
                    values = line.split(',')
                    if len(values) == 1:
                        try:
                            results.append(float(values[0].strip()))
                        except ValueError:
                            results.append(values[0].strip())
                    else:
                        row = []
                        for val in values:
                            try:
                                row.append(float(val.strip()))
                            except ValueError:
                                row.append(val.strip())
                        results.append(row)
            return results

        if CONTENT_TYPE_LIBSVM in content_type.lower():
            lines = decoded.strip().split('\n')
            results = []
            for line in lines:
                if line.strip():
                    try:
                        results.append(int(float(line.strip())))
                    except ValueError:
                        results.append(line.strip())
            return results

        lines = decoded.strip().split('\n')
        if len(lines) == 1:
            return decoded.strip()
        return [line.strip() for line in lines if line.strip()]

    def _prepare_data(
        self, df: pd.DataFrame, features: List[str], options: Dict[str, Any]
    ) -> Tuple[pd.DataFrame, Any]:
        X = df.copy()
        X = X.loc[:, ~X.columns.str.startswith(MLTK_INTERNAL_COLUMN_PREFIX)]

        if len(features) == 0:
            features = X.columns.tolist()

        X, nans, _ = df_util.prepare_features(
            X=X,
            variables=features,
            final_columns=X[features].columns,
            get_dummies=False,
            mlspl_limits=options.get('mlspl_limits'),
        )
        return X, nans

    def _try_schema_validator(
        self, options: Dict[str, Any]
    ) -> Tuple[Optional[Any], Optional[str]]:
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
            json_request_schema = validator.request_schemas.get('application/json', {})
            validator._payload_builder = VertexPayloadBuilder(
                validator.input_feature_map,
                json_request_schema,
                validator.is_batch_mode,
            )
            json_response_schema = validator.response_schemas.get('application/json', {})
            validator._response_parser = VertexResponseParser(
                validator.output_prediction_map,
                json_response_schema,
                validator.is_batch_mode,
            )
            content_types = validator.get_supported_content_types()
            content_type = content_types[0] if content_types else CONTENT_TYPE_JSON
            return validator, content_type

        except (ConfigurationError, SchemaPathError) as exc:
            logger.error(f"Schema validation error: {exc}")
            return None, None
        except Exception as exc:
            logger.error(f"Failed to initialize SchemaValidator: {exc}")
            return None, None

    def _invoke_with_validator(
        self,
        content_type: str,
        validator: Any,
        df: pd.DataFrame,
        features: List[str],
        nans: Any,
        options: Dict[str, Any],
        original_df: Optional[pd.DataFrame] = None,
    ) -> pd.DataFrame:
        if hasattr(validator, 'is_single_record_mode') and validator.is_single_record_mode():
            return self._invoke_single_record_mode(
                content_type, validator, df, features, nans, options, original_df
            )

        batch_size = options.get('batch_size')
        if batch_size and len(df) > batch_size:
            return self._invoke_batch_mode_chunked(
                content_type, validator, df, features, nans, options, batch_size, original_df
            )

        payload = validator.dataframe_to_payload(df, content_type)
        payload = self._prepare_payload_for_invocation(payload, validator, content_type)
        raw_body, response_ct = self._invoke_endpoint(
            payload, content_type, return_raw=True, validator=validator
        )

        response_str = raw_body.decode('utf-8') if isinstance(raw_body, bytes) else raw_body
        result_df = validator.response_to_dataframe(response_str, response_ct)

        output = df_util.create_output_dataframe(
            y_hat=result_df.values, nans=nans, output_names=list(result_df.columns)
        )

        if original_df is not None:
            output.index = original_df.index
            return df_util.merge_predictions(original_df[features], output)
        return df_util.merge_predictions(df[features], output)

    @staticmethod
    def _is_non_recoverable_row_error(message: str) -> bool:
        lower_message = message.lower()
        return any(
            keyword in lower_message
            for keyword in [
                'network error',
                'endpoint not found',
                'connection',
                'credentials',
                'unauthorized',
                'access denied',
                'permission',
                'invalid request',
                'expected string_value',
                'number_value',
                'type casting',
                'openapi spec',
            ]
        )

    def _invoke_single_record_mode(
        self,
        content_type: str,
        validator: Any,
        df: pd.DataFrame,
        features: List[str],
        nans: Any,
        options: Dict[str, Any],
        original_df: Optional[pd.DataFrame] = None,
    ) -> pd.DataFrame:
        all_results = []

        for idx, row in df.iterrows():
            try:
                single_row_df = pd.DataFrame([row])
                payload = validator.dataframe_to_payload(single_row_df, content_type)
                payload = self._prepare_payload_for_invocation(payload, validator, content_type)
                raw_body, response_ct = self._invoke_endpoint(
                    payload, content_type, return_raw=True, validator=validator
                )

                response_str = (
                    raw_body.decode('utf-8') if isinstance(raw_body, bytes) else raw_body
                )
                result_df = validator.response_to_dataframe(response_str, response_ct)
                all_results.append(result_df.iloc[0].to_dict())

            except Exception as exc:
                logger.error(f"Error processing row {idx + 1}: {exc}")
                if self._is_non_recoverable_row_error(str(exc)):
                    raise

                if all_results:
                    empty_result = {col: None for col in all_results[0].keys()}
                    all_results.append(empty_result)
                else:
                    all_results.append({'prediction': None, 'error': str(exc)})

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
        content_type: str,
        validator: Any,
        df: pd.DataFrame,
        features: List[str],
        nans: Any,
        options: Dict[str, Any],
        batch_size: int,
        original_df: Optional[pd.DataFrame] = None,
    ) -> pd.DataFrame:
        num_chunks = (len(df) + batch_size - 1) // batch_size
        all_results = []

        for chunk_idx in range(num_chunks):
            start_idx = chunk_idx * batch_size
            end_idx = min((chunk_idx + 1) * batch_size, len(df))
            chunk_df = df.iloc[start_idx:end_idx].copy()

            try:
                payload_str = validator.dataframe_to_payload(chunk_df, content_type)
                payload_str = self._prepare_payload_for_invocation(
                    payload_str, validator, content_type
                )
                raw_body, response_ct = self._invoke_endpoint(
                    payload_str, content_type, return_raw=True, validator=validator
                )
                response_str = (
                    raw_body.decode('utf-8') if isinstance(raw_body, bytes) else raw_body
                )
                result_df = validator.response_to_dataframe(response_str, response_ct)

                if len(result_df) != len(chunk_df):
                    logger.warning(
                        f"Batch {chunk_idx + 1}: Response has {len(result_df)} rows, expected {len(chunk_df)}."
                    )
                all_results.append(result_df)

            except Exception as exc:
                logger.error(f"Batch {chunk_idx + 1}/{num_chunks} failed: {exc}")
                cexc.log_traceback()

                if self._is_non_recoverable_row_error(str(exc)):
                    raise

                error_cols = list(all_results[0].columns) if all_results else ['prediction']
                error_df = pd.DataFrame(
                    [[None] * len(error_cols)] * len(chunk_df), columns=error_cols
                )
                all_results.append(error_df)

        combined_results = pd.concat(all_results, ignore_index=True)

        expected_non_nan_rows = (~nans).sum()
        if len(combined_results) != expected_non_nan_rows:
            logger.error(
                f"Result row count mismatch: got {len(combined_results)} predictions for {expected_non_nan_rows} non-NaN input rows"
            )
            raise RuntimeError(
                "Prediction results count doesn't match input data. This may indicate an endpoint issue."
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
        self, df: pd.DataFrame, features: List[str], options: Dict[str, Any]
    ) -> pd.DataFrame:
        total_start = time.time()

        try:
            df = df.loc[:, ~df.columns.str.startswith(MLTK_INTERNAL_COLUMN_PREFIX)]

            X, nans = self._prepare_data(df, features, options)
            validator, content_type = self._try_schema_validator(options)

            if not validator:
                raise RuntimeError(
                    "Vertex models require OpenAPI specification and feature maps. "
                    "Please ensure your model was registered with 'openapi_spec', 'input_feature_map', and 'output_prediction_map'."
                )

            if not self._payload_validated:
                validator.validate_payload_structure(X, content_type)
                self._payload_validated = True

            result = self._invoke_with_validator(
                content_type, validator, X, features, nans, options, df
            )

            total_duration = time.time() - total_start
            batch_size_used = options.get('batch_size', 1)
            if self._api_call_count > 0:
                min_time = self._api_call_min
                max_time = self._api_call_max
                avg_time = self._api_call_sum / self._api_call_count
            else:
                min_time = max_time = avg_time = 0

            self.last_invoke_metrics = {
                'endpoint': self.endpoint_name or self.endpoint_id,
                'batch_size': batch_size_used,
                'min_time': min_time,
                'max_time': max_time,
                'avg_time': avg_time,
                'total_time': total_duration,
                'api_call_count': self._api_call_count,
            }
            return result

        except Exception as exc:
            total_duration = time.time() - total_start
            batch_size_used = options.get('batch_size', 1)
            if self._api_call_count > 0:
                min_time = self._api_call_min
                max_time = self._api_call_max
                avg_time = self._api_call_sum / self._api_call_count
            else:
                min_time = max_time = avg_time = 0

            self.last_invoke_metrics = {
                'endpoint': self.endpoint_name or self.endpoint_id,
                'batch_size': batch_size_used,
                'min_time': min_time,
                'max_time': max_time,
                'avg_time': avg_time,
                'total_time': total_duration,
                'api_call_count': self._api_call_count,
                'error': str(exc),
            }
            raise
