from typing import Any, Dict, List, Optional

from requests import Response

from ..constants import (
    DATA_ID_INDEX_METADATA,
    DATA_ID_SOURCETYPE_METADATA,
    DATAMODELS_METADATA,
    KO_ID_ALERTS_METADATA,
    KO_ID_DASHBOARDS_METADATA,
    KO_ID_DATAMODELS_METADATA,
    KO_REPORTS_KNOWLEDGE_OBJECTS_METADATA,
    LOOKUP_METADATA,
    MACROS_ID_METADATA,
)
from .v1alpha1 import HTTP_METHOD_POST, PATH_DATA_UPLOAD, SaiaApiBase

PATH_SPL_WRITE = "spl/write"
PATH_SPL_EDIT = "spl/edit"
PATH_SPL_OPTIMIZE = "spl/optimize"
PATH_ASK_SPLUNK_QUESTION = "spl/ask_splunk_question"
PATH_SPL_EXPLAIN = "spl/explain"

API_ROOT_V2 = "saia-api-v2"
API_VERSION_V2 = "v2alpha1"


class SAIAApiV2(SaiaApiBase):
    API_ROOT = API_ROOT_V2
    API_VERSION = API_VERSION_V2

    def _make_post_request(
        self,
        path: str,
        request_id: str,
        body: Dict[str, Any],
        headers: Optional[Dict[str, str]] = None,
        stream: bool = False,
    ) -> Response:
        if not headers:
            headers = {}

        if self.ec_token:
            headers["x-ec-token"] = self.ec_token

        return self._make_request(
            HTTP_METHOD_POST,
            path,
            body,
            headers,
            stream,
            request_id=request_id,
            api_root=API_ROOT_V2,
            api_version=API_VERSION_V2,
        )

    def _build_spl_request_body(
        self,
        job_id: str,
        user_prompt: str,
        chat_history,
        locale: str,
        log_to_telemetry: bool,
        source_app_id: str,
        additional_context: Optional[Dict[str, Any]] = None,
        classification: Optional[int] = None,
    ) -> Dict[str, Any]:
        body = {
            "user_prompt": user_prompt,
            "chat_id": self.chat_id,
            "chat_history": chat_history,
            "source_app_id": source_app_id,
            "app_version": self.app_version,
            "additional_context": additional_context,
            "locale": locale,
            "request_id": job_id,
            "log_to_telemetry": log_to_telemetry,
        }
        if classification is not None:
            body["classification"] = classification
        return body

    def _build_data_upload_request_body(
        self,
        request_id: str,
        data_id: str,
        payload: List[Dict[str, Any]],
        source_app_id: str = "",
    ) -> Dict[str, Any]:
        return {
            "data_id": data_id,
            "data": payload,
            "request_id": request_id,
            "stack_id": self.deployment_id,
            "app_version": self.app_version,
            "source_app_id": source_app_id,
        }

    def _make_data_upload_request(
        self,
        request_id: str,
        data_id: str,
        payload: List[Dict[str, Any]],
        source_app_id: str = "",
    ) -> Response:
        return self._make_post_request(
            PATH_DATA_UPLOAD,
            request_id=request_id,
            body=self._build_data_upload_request_body(
                request_id=request_id,
                data_id=data_id,
                payload=payload,
                source_app_id=source_app_id,
            ),
            headers=self._build_request_headers(request_id),
        )

    def spl_write(
        self,
        job_id: str,
        user_prompt: str,
        chat_history,
        locale: str,
        log_to_telemetry: bool,
        source_app_id: str,
        additional_context: Optional[Dict[str, Any]] = None,
        request_headers: Optional[Dict[str, str]] = None,
    ) -> Response:
        return self._make_post_request(
            PATH_SPL_WRITE,
            request_id=job_id,
            body=self._build_spl_request_body(
                job_id=job_id,
                user_prompt=user_prompt,
                chat_history=chat_history,
                locale=locale,
                log_to_telemetry=log_to_telemetry,
                source_app_id=source_app_id,
                additional_context=additional_context,
                classification=0,
            ),
            headers=self._build_request_headers(job_id, request_headers),
        )

    def spl_explain(self,
        job_id: str,
        user_prompt: str,
        chat_history,
        locale: str,
        log_to_telemetry: bool,
        source_app_id: str,
        additional_context: Optional[Dict[str, Any]] = None,
        request_headers: Optional[Dict[str, str]] = None,
    ) -> Response:
        return self._make_post_request(
            PATH_SPL_EXPLAIN,
            request_id=job_id,
            body=self._build_spl_request_body(
                job_id=job_id,
                user_prompt=user_prompt,
                chat_history=chat_history,
                locale=locale,
                log_to_telemetry=log_to_telemetry,
                source_app_id=source_app_id,
                additional_context=additional_context,
                classification=4,
            ),
            headers=self._build_request_headers(job_id, request_headers),
        )

    def spl_edit(
        self,
        job_id: str,
        user_prompt: str,
        chat_history,
        locale: str,
        log_to_telemetry: bool,
        source_app_id: str,
        additional_context: Optional[Dict[str, Any]] = None,
        request_headers: Optional[Dict[str, str]] = None,
    ) -> Response:
        return self._make_post_request(
            PATH_SPL_EDIT,
            request_id=job_id,
            body=self._build_spl_request_body(
                job_id=job_id,
                user_prompt=user_prompt,
                chat_history=chat_history,
                locale=locale,
                log_to_telemetry=log_to_telemetry,
                source_app_id=source_app_id,
                additional_context=additional_context,
                classification=1,
            ),
            headers=self._build_request_headers(job_id, request_headers),
        )

    def spl_optimize(
        self,
        job_id: str,
        user_prompt: str,
        chat_history,
        locale: str,
        log_to_telemetry: bool,
        source_app_id: str,
        additional_context: Optional[Dict[str, Any]] = None,
        request_headers: Optional[Dict[str, str]] = None,
    ) -> Response:
        return self._make_post_request(
            PATH_SPL_OPTIMIZE,
            request_id=job_id,
            body=self._build_spl_request_body(
                job_id=job_id,
                user_prompt=user_prompt,
                chat_history=chat_history,
                locale=locale,
                log_to_telemetry=log_to_telemetry,
                source_app_id=source_app_id,
                additional_context=additional_context,
                classification=3,
            ),
            headers=self._build_request_headers(job_id, request_headers),
        )

    def ask_splunk_question(
        self,
        job_id: str,
        user_prompt: str,
        chat_history,
        locale: str,
        log_to_telemetry: bool,
        source_app_id: str,
        additional_context: Optional[Dict[str, Any]] = None,
        request_headers: Optional[Dict[str, str]] = None,
    ) -> Response:
        return self._make_post_request(
            PATH_ASK_SPLUNK_QUESTION,
            request_id=job_id,
            body=self._build_spl_request_body(
                job_id=job_id,
                user_prompt=user_prompt,
                chat_history=chat_history,
                locale=locale,
                log_to_telemetry=log_to_telemetry,
                source_app_id=source_app_id,
                additional_context=additional_context,
                classification=2,
            ),
            headers=self._build_request_headers(job_id, request_headers),
        )

    def get_data_status(self, data_id: str, request_id: str) -> bool:
        response = self._make_get_request(
            f"data/{data_id}/status",
            request_id=request_id,
            headers=self._build_request_headers(request_id),
        )
        return response.json().get("should_upload", False)

    def submit_sourcetype_metadata(
        self,
        request_id: str,
        field_data: List[Dict[str, Any]],
        source_app_id: str = "",
    ) -> Response:
        return self._make_data_upload_request(
            request_id,
            DATA_ID_SOURCETYPE_METADATA,
            field_data,
            source_app_id=source_app_id,
        )

    def submit_index_metadata(
        self,
        request_id: str,
        field_data: List[Dict[str, Any]],
        source_app_id: str = "",
    ) -> Response:
        return self._make_data_upload_request(
            request_id,
            DATA_ID_INDEX_METADATA,
            field_data,
            source_app_id=source_app_id,
        )

    def submit_macros_metadata(
        self,
        request_id: str,
        field_data: List[Dict[str, Any]],
        source_app_id: str = "",
    ) -> Response:
        return self._make_data_upload_request(
            request_id,
            MACROS_ID_METADATA,
            field_data,
            source_app_id=source_app_id,
        )

    def submit_lookups_metadata(
        self,
        request_id: str,
        field_data: List[Dict[str, Any]],
        source_app_id: str = "",
    ) -> Response:
        return self._make_data_upload_request(
            request_id,
            LOOKUP_METADATA,
            field_data,
            source_app_id=source_app_id,
        )

    def submit_datamodels_metadata(
        self,
        request_id: str,
        field_data: List[Dict[str, Any]],
        source_app_id: str = "",
    ) -> Response:
        return self._make_data_upload_request(
            request_id,
            DATAMODELS_METADATA,
            field_data,
            source_app_id=source_app_id,
        )

    def submit_reports_knowledge_object_metadata(
        self,
        request_id: str,
        field_data: List[Dict[str, Any]],
        source_app_id: str = "",
    ) -> Response:
        return self._make_data_upload_request(
            request_id,
            KO_REPORTS_KNOWLEDGE_OBJECTS_METADATA,
            field_data,
            source_app_id=source_app_id,
        )

    def submit_alerts_knowledge_object_metadata(
        self,
        request_id: str,
        field_data: List[Dict[str, Any]],
        source_app_id: str = "",
    ) -> Response:
        return self._make_data_upload_request(
            request_id,
            KO_ID_ALERTS_METADATA,
            field_data,
            source_app_id=source_app_id,
        )

    def submit_dashboards_knowledge_object_metadata(
        self,
        request_id: str,
        field_data: List[Dict[str, Any]],
        source_app_id: str = "",
    ) -> Response:
        return self._make_data_upload_request(
            request_id,
            KO_ID_DASHBOARDS_METADATA,
            field_data,
            source_app_id=source_app_id,
        )

    def submit_datamodels_knowledge_object_metadata(
        self,
        request_id: str,
        field_data: List[Dict[str, Any]],
        source_app_id: str = "",
    ) -> Response:
        return self._make_data_upload_request(
            request_id,
            DATAMODELS_METADATA,
            field_data,
            source_app_id=source_app_id,
        )
