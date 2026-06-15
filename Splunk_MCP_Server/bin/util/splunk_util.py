"""Utility helpers for building Splunk REST handler responses."""

from __future__ import annotations

import os
import sys
from typing import Any, Dict, Mapping, Optional

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from constants import CONTENT_TYPE_JSON


class SplunkUtil:

    @staticmethod
    def splunkd_endpoint_path(endpoint: str, *, mgmt_port_connection: bool) -> str:
        """Path to a splunkd REST endpoint, accounting for splunkweb's __raw proxy.

        Splunkd routes custom REST endpoints under ``/services/...``. When a
        client reaches us via Splunk Web (any non-management port), the
        request must traverse splunkweb's ``__raw`` proxy so that splunkd —
        not splunkweb's HTML UI — answers.

        Args:
            endpoint: REST endpoint name relative to the ``/services/``
                namespace (e.g. ``"mcp"`` or
                ``".well-known/oauth-protected-resource"``). A leading
                ``/`` is allowed and ignored.
            mgmt_port_connection: ``True`` when the caller reached splunkd
                directly on the management port; ``False`` when reached via
                Splunk Web.

        Returns:
            Absolute URL path (always starts with ``/``).
        """
        suffix = endpoint.lstrip("/")
        if mgmt_port_connection:
            return f"/services/{suffix}"
        return f"/en-US/splunkd/__raw/services/{suffix}"

    @staticmethod
    def create_json_response(
        status: int,
        payload: Any = None,
        error: Optional[str] = None,
        headers: Optional[Mapping[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Build the response dictionary expected by Splunk persistent REST handlers.

        Rules:
        - Use `payload` for a normal JSON response body.
        - Use `error` for an error response body: {"error": "..."}.
        - Do not pass both `payload` and `error`.
        """
        if payload is not None and error is not None:
            raise ValueError("Provide either 'payload' or 'error', not both.")

        response_headers = {"Content-Type": CONTENT_TYPE_JSON}
        if headers:
            response_headers.update(dict(headers))

        response: Dict[str, Any] = {
            "status": status,
            "headers": response_headers,
        }

        if error is not None:
            response["payload"] = {"error": error}
        else:
            response["payload"] = {} if payload is None else payload

        return response
