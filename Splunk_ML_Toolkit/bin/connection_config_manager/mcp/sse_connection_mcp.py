"""
SSE Connection Module for ATLASSIAN MCP
Handles Server-Sent Events (SSE) based MCP connections for ATLASSIAN servers
"""

import asyncio
import json
import os
import sys
import re
import uuid
from typing import Any, Dict, Optional, Callable
from urllib.parse import urlparse
from util.base_util import get_system_paths, SUPPORTED_SYSTEMS

sa_path, system = get_system_paths()

system_path = os.path.join(sa_path, 'bin', '%s' % (SUPPORTED_SYSTEMS[system]))

APP_NAME = f"Splunk_SA_Scientific_Python_{SUPPORTED_SYSTEMS[system]}"
SPLUNK_HOME = os.environ.get('SPLUNK_HOME', '/opt/splunk')
APP_PATH = os.path.join(SPLUNK_HOME, 'etc', 'apps', APP_NAME)

# Dynamically find PSC version with boto3
psc_bin_path = os.path.join(sa_path, 'bin', SUPPORTED_SYSTEMS[system])
psc_version = None
python_version = None

if os.path.exists(psc_bin_path):
    versions = sorted(
        [
            d
            for d in os.listdir(psc_bin_path)
            if os.path.isdir(os.path.join(psc_bin_path, d)) and '_' in d
        ],
        reverse=True,
    )
    for v in versions:
        lib_path = os.path.join(psc_bin_path, v, 'lib')
        if os.path.exists(lib_path):
            # Find any python3.x directory
            python_dirs = [d for d in os.listdir(lib_path) if d.startswith('python3.')]
            for py_dir in sorted(python_dirs, reverse=True):  # prefer newer versions
                test_path_aiohttp = os.path.join(lib_path, py_dir, 'site-packages', 'aiohttp')
                test_path_httpx = os.path.join(lib_path, py_dir, 'site-packages', 'httpx')
                if os.path.exists(test_path_aiohttp) and os.path.exists(test_path_httpx):
                    psc_version = v
                    python_version = py_dir
                    break
            if psc_version:
                break

    # Fallback: use latest version and latest python even without boto3
    if not psc_version and versions:
        psc_version = versions[0]
        lib_path = os.path.join(psc_bin_path, psc_version, 'lib')
        if os.path.exists(lib_path):
            python_dirs = [d for d in os.listdir(lib_path) if d.startswith('python3.')]
            python_version = (
                sorted(python_dirs, reverse=True)[0] if python_dirs else 'python3.9'
            )

PSC_SITE_PACKAGES = (
    os.path.join(psc_bin_path, psc_version, 'lib', python_version, 'site-packages')
    if psc_version and python_version
    else None
)
# Insert PSC site-packages at the beginning to ensure we use PSC's boto3
if PSC_SITE_PACKAGES and os.path.exists(PSC_SITE_PACKAGES):
    sys.path.insert(0, PSC_SITE_PACKAGES)


import aiohttp
import cexc
import httpx

logger = cexc.get_logger(__name__)
import http.client as http_client

http_client.HTTPConnection.debuglevel = 1
ssl_cert_file = os.environ.get("SSL_CERT_FILE")
if ssl_cert_file and not os.path.exists(ssl_cert_file):
    logger.warning(
        f"Environment variable SSL_CERT_FILE is set to a non-existent path: {ssl_cert_file}. "
        "Removing it to prevent SSL errors."
    )
    os.environ.pop("SSL_CERT_FILE")

# Regex to extract sessionId from SSE stream
SESSION_ID_REGEX = re.compile(r"sessionId=([A-Za-z0-9\-]+)")


class MCPClient:
    """
    Asynchronous MCP client for SSE-based communication with ATLASSIAN MCP servers.
    Handles bidirectional communication:
    - Receives events via SSE GET stream
    - Sends JSON-RPC requests via POST with sessionId
    """

    def __init__(
        self,
        sse_url: str,
        token: str,
        verify_ssl: bool = False,
        cloud_id: Optional[str] = None,
        debug: bool = False,
    ):
        """
        Initialize MCPClient

        Args:
            sse_url: SSE endpoint URL (e.g., https://mcp.atlassian.com/v1/sse)
            token: OAuth bearer token
            verify_ssl: Whether to verify SSL certificates
            cloud_id: Atlassian cloud ID (optional)
            debug: Enable debug logging
        """
        self.sse_url = sse_url
        self.token = token
        self.verify_ssl = verify_ssl
        self.cloud_id = cloud_id
        self.debug = debug

        self.session: Optional[aiohttp.ClientSession] = None
        self.recv_task: Optional[asyncio.Task] = None
        self.session_id: Optional[str] = None
        self.ready_evt = asyncio.Event()
        self.pending: Dict[str, asyncio.Future] = {}

        self.on_sse: Optional[Callable[[str, str], None]] = None

    async def connect(self, wait_timeout: float = 20.0):
        """
        Connect to SSE endpoint and wait for sessionId

        Args:
            wait_timeout: Maximum time to wait for sessionId (seconds)

        Raises:
            RuntimeError: If sessionId not received within timeout
        """
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Accept": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
        if self.cloud_id:
            headers["X-Atlassian-Cloud-Id"] = self.cloud_id

        if self.debug:
            logger.info(f"[SSE] Connecting to {self.sse_url}")

        timeout = aiohttp.ClientTimeout(total=None)  # long-lived stream
        connector = aiohttp.TCPConnector(ssl=self.verify_ssl)
        self.session = aiohttp.ClientSession(
            headers=headers, timeout=timeout, connector=connector
        )

        self.recv_task = asyncio.create_task(self._recv_loop())

        try:
            await asyncio.wait_for(self.ready_evt.wait(), timeout=wait_timeout)
        except asyncio.TimeoutError:
            raise RuntimeError("Timed out waiting for sessionId in SSE stream")

        if self.debug:
            logger.info(f"[SSE] Connected with sessionId={self.session_id}")

    async def close(self):
        """Close SSE connection and cleanup resources"""
        if self.recv_task:
            self.recv_task.cancel()
            try:
                await self.recv_task
            except asyncio.CancelledError:
                pass
        if self.session and not self.session.closed:
            await self.session.close()

        for fut in list(self.pending.values()):
            if not fut.done():
                fut.set_exception(RuntimeError("Client closed"))
        self.pending.clear()

    async def _recv_loop(self):
        """
        Background task to receive SSE events and route JSON-RPC responses
        """
        assert self.session is not None
        try:
            async with self.session.get(self.sse_url) as resp:
                if self.debug:
                    logger.info(f"[SSE] Stream status={resp.status}")
                if resp.status != 200:
                    text = await resp.text()
                    raise RuntimeError(f"SSE GET failed: {resp.status} {text[:400]}")

                event = "message"
                data_lines = []

                while True:
                    line = await resp.content.readline()
                    if not line:
                        if self.debug:
                            logger.info("[SSE] Stream ended")
                        break
                    s = line.decode("utf-8", errors="replace").rstrip("\r\n")

                    # Extract sessionId from stream
                    if self.session_id is None:
                        m = SESSION_ID_REGEX.search(s)
                        if m:
                            self.session_id = m.group(1)
                            self.ready_evt.set()

                    # Parse SSE format
                    if s == "":
                        if data_lines:
                            await self._handle_event(event, "\n".join(data_lines))
                            data_lines = []
                        event = "message"
                        continue

                    if s.startswith(":"):
                        # Comment/heartbeat
                        continue
                    if s.startswith("event:"):
                        event = s[len("event:") :].strip()
                    elif s.startswith("data:"):
                        data_lines.append(s[len("data:") :].strip())
        except asyncio.CancelledError:
            pass
        except Exception as e:
            logger.error(f"[SSE] Receive loop error: {e}")
            for fut in list(self.pending.values()):
                if not fut.done():
                    fut.set_exception(e)
            self.pending.clear()
            raise

    async def _handle_event(self, event: str, data: str):
        """
        Handle incoming SSE event and route JSON-RPC responses

        Args:
            event: SSE event type
            data: SSE event data
        """
        if self.on_sse:
            try:
                self.on_sse(event, data)
            except Exception:
                pass

        try:
            payload = json.loads(data)
        except json.JSONDecodeError:
            if self.debug:
                logger.debug(f"[SSE] {event}: (non-JSON) {data[:200]}")
            return

        # Route JSON-RPC responses by id
        if isinstance(payload, dict) and payload.get("jsonrpc") == "2.0":
            msg_id = str(payload.get("id"))
            fut = self.pending.get(msg_id)
            if fut and not fut.done():
                if payload.get("error") is not None:
                    fut.set_exception(RuntimeError(payload["error"]))
                else:
                    fut.set_result(payload.get("result"))
                self.pending.pop(msg_id, None)
        else:
            if self.debug:
                logger.debug(f"[SSE] {event}: JSON (no jsonrpc): {str(payload)[:200]}")

    async def _post_rpc(self, body: Dict[str, Any]):
        """
        Send JSON-RPC request via POST with sessionId

        Args:
            body: JSON-RPC request body
        """
        assert self.session is not None
        if not self.session_id:
            raise RuntimeError("No sessionId yet; connect first.")

        url = f"{self.sse_url}?sessionId={self.session_id}"
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }
        if self.cloud_id:
            headers["X-Atlassian-Cloud-Id"] = self.cloud_id

        if self.debug:
            logger.debug(f"[SSE] POST {url} method={body.get('method')}")

        async with self.session.post(url, json=body, headers=headers) as resp:
            if resp.status >= 400:
                text = await resp.text()
                raise RuntimeError(f"POST failed: {resp.status} {text[:400]}")

    async def rpc(
        self,
        method: str,
        params: Optional[Dict[str, Any]] = None,
        id_hint: Optional[str] = None,
        timeout: float = 30.0,
    ):
        """
        Send JSON-RPC request and wait for response

        Args:
            method: JSON-RPC method name
            params: Method parameters
            id_hint: Optional request ID (auto-generated if not provided)
            timeout: Maximum time to wait for response (seconds)

        Returns:
            Response result

        Raises:
            RuntimeError: If request fails
            asyncio.TimeoutError: If response not received within timeout
        """
        req_id = id_hint or str(uuid.uuid4())
        fut = asyncio.get_running_loop().create_future()
        self.pending[req_id] = fut
        await self._post_rpc(
            {"jsonrpc": "2.0", "id": req_id, "method": method, "params": params or {}}
        )
        return await asyncio.wait_for(fut, timeout=timeout)

    async def initialize(self):
        """
        Send MCP initialize request

        Returns:
            Server initialization response
        """
        params = {
            "protocolVersion": "2025-03-26",
            "clientInfo": {"name": "splunk-mcp-client", "version": "1.0"},
            "capabilities": {},
        }
        return await self.rpc("initialize", params, id_hint="init-1")

    async def list_tools(self):
        """
        List available tools from MCP server

        Returns:
            Tools list response with tool names and descriptions
        """
        return await self.rpc("tools/list", {}, id_hint="tools-1")

    async def call_tool(
        self,
        name: str,
        arguments: Optional[Dict[str, Any]] = None,
        *,
        id_hint: Optional[str] = None,
        timeout: float = 60.0,
    ):
        """
        Call an MCP tool by name

        Args:
            name: Tool name
            arguments: Tool arguments
            id_hint: Optional request ID
            timeout: Maximum time to wait for response (seconds)

        Returns:
            Tool execution result
        """
        params = {"name": name, "arguments": arguments or {}}
        return await self.rpc("tools/call", params, id_hint=id_hint, timeout=timeout)


# ============================================================================
# Synchronous wrapper functions for REST handler compatibility
# ============================================================================


def test_atlassian_connection(
    url: str, token: str, cloud_id: Optional[str] = None, verify_ssl: bool = False
) -> dict:
    """
    Test ATLASSIAN MCP connection (synchronous wrapper for async client)

    Args:
        url: SSE endpoint URL
        token: OAuth bearer token
        cloud_id: Atlassian cloud ID (optional)
        verify_ssl: Whether to verify SSL certificates

    Returns:
        dict: Test result with success status and connection details
    """

    async def _test():
        client = MCPClient(url, token, verify_ssl=verify_ssl, cloud_id=cloud_id, debug=False)
        try:
            import time

            start_time = time.time()

            # Connect and initialize
            await client.connect(wait_timeout=15.0)
            await client.initialize()

            response_time_ms = int((time.time() - start_time) * 1000)

            return {
                "success": True,
                "status": "success",
                "message": "ATLASSIAN MCP server is reachable and token is valid",
                "data": {
                    "mcp_name": None,
                    "mcp_type": "ATLASSIAN",
                    "mcp_server_url": url,
                    "response_time_ms": response_time_ms,
                    "http_status": 200,
                    "authenticated": True,
                    "reachable": True,
                    "session_id": client.session_id,
                },
            }
        except asyncio.TimeoutError:
            return {
                "success": False,
                "status": "error",
                "message": "Request timeout - MCP server did not respond within 15 seconds",
                "data": {
                    "mcp_name": None,
                    "mcp_type": "ATLASSIAN",
                    "mcp_server_url": url,
                },
            }
        except RuntimeError as e:
            error_msg = str(e)
            # Extract HTTP status code if present
            http_status = None
            response_time_ms = (
                int((time.time() - start_time) * 1000) if 'start_time' in locals() else None
            )

            if "401" in error_msg:
                http_status = 401
                message = "Authentication failed: Bearer token is invalid or expired (HTTP 401)"
            elif "403" in error_msg:
                http_status = 403
                message = "Authentication failed: Bearer token is invalid (HTTP 403)"
            elif "Unauthorized" in error_msg or "invalid_token" in error_msg:
                http_status = 401
                message = "Authentication failed: Bearer token is invalid or expired (HTTP 401)"
            else:
                message = f"Connection failed: {error_msg}"

            error_data = {
                "mcp_name": None,
                "mcp_type": "ATLASSIAN",
                "mcp_server_url": url,
            }
            if response_time_ms is not None:
                error_data["response_time_ms"] = response_time_ms
            if http_status is not None:
                error_data["http_status"] = http_status
                error_data["authenticated"] = False
                error_data["reachable"] = True

            return {
                "success": False,
                "status": "error",
                "message": message,
                "data": error_data,
            }
        except Exception as e:
            response_time_ms = (
                int((time.time() - start_time) * 1000) if 'start_time' in locals() else None
            )
            error_data = {
                "mcp_name": None,
                "mcp_type": "ATLASSIAN",
                "mcp_server_url": url,
            }
            if response_time_ms is not None:
                error_data["response_time_ms"] = response_time_ms

            return {
                "success": False,
                "status": "error",
                "message": f"Unexpected error: {str(e)}",
                "data": error_data,
            }
        finally:
            await client.close()

    # Run async function in sync context
    try:
        return asyncio.run(_test())
    except Exception as e:
        error_msg = str(e)
        # Extract HTTP status code if present
        http_status = None

        if "401" in error_msg:
            http_status = 401
            message = "Authentication failed: Bearer token is invalid or expired (HTTP 401)"
        elif "403" in error_msg:
            http_status = 403
            message = "Authentication failed: Bearer token is invalid (HTTP 403)"
        elif "invalid_token" in error_msg or "Unauthorized" in error_msg:
            http_status = 401
            message = "Authentication failed: Bearer token is invalid or expired (HTTP 401)"
        else:
            message = f"Failed to run async test: {error_msg}"

        error_data = {
            "mcp_name": None,
            "mcp_type": "ATLASSIAN",
            "mcp_server_url": url,
        }
        if http_status is not None:
            error_data["http_status"] = http_status
            error_data["authenticated"] = False
            error_data["reachable"] = True

        logger.error(f"Failed to test ATLASSIAN connection: {e}")
        return {
            "success": False,
            "status": "error",
            "message": message,
            "data": error_data,
        }


def list_atlassian_tools(
    url: str, token: str, cloud_id: Optional[str] = None, verify_ssl: bool = False
) -> dict:
    """
    List tools from ATLASSIAN MCP server (synchronous wrapper for async client)

    Args:
        url: SSE endpoint URL
        token: OAuth bearer token
        cloud_id: Atlassian cloud ID (optional)
        verify_ssl: Whether to verify SSL certificates

    Returns:
        dict: Tools list with names and descriptions
    """

    async def _list_tools():
        client = MCPClient(url, token, verify_ssl=verify_ssl, cloud_id=cloud_id, debug=False)
        try:
            import time

            start_time = time.time()

            # Connect and list tools
            await client.connect(wait_timeout=15.0)
            tools_result = await client.list_tools()

            response_time_ms = int((time.time() - start_time) * 1000)

            # Extract tools with name and description
            tools_list = tools_result.get('tools', [])
            simplified_tools = [
                {"name": tool.get("name", ""), "description": tool.get("description", "")}
                for tool in tools_list
            ]

            return {
                "success": True,
                "status": "success",
                "message": f"Retrieved {len(simplified_tools)} tool(s) from ATLASSIAN MCP server",
                "data": {
                    "mcp_name": None,
                    "mcp_type": "ATLASSIAN",
                    "mcp_server_url": url,
                    "response_time_ms": response_time_ms,
                    "tool_count": len(simplified_tools),
                    "tools": simplified_tools,
                    "session_id": client.session_id,
                },
            }
        except asyncio.TimeoutError:
            return {
                "success": False,
                "status": "error",
                "message": "Request timeout - MCP server did not respond within 15 seconds",
                "data": {
                    "mcp_name": None,
                    "mcp_type": "ATLASSIAN",
                    "mcp_server_url": url,
                },
            }
        except RuntimeError as e:
            error_msg = str(e)
            # Extract HTTP status code if present
            http_status = None
            response_time_ms = (
                int((time.time() - start_time) * 1000) if 'start_time' in locals() else None
            )

            if "401" in error_msg:
                http_status = 401
                message = "Authentication failed: Bearer token is invalid (HTTP 401)"
            elif "403" in error_msg:
                http_status = 403
                message = "Authentication failed: Bearer token is invalid (HTTP 403)"
            elif "Unauthorized" in error_msg or "invalid_token" in error_msg:
                http_status = 401
                message = "Authentication failed: Bearer token is invalid (HTTP 401)"
            else:
                message = f"Failed to list tools: {error_msg}"

            error_data = {
                "mcp_name": None,
                "mcp_type": "ATLASSIAN",
                "mcp_server_url": url,
            }
            if response_time_ms is not None:
                error_data["response_time_ms"] = response_time_ms
            if http_status is not None:
                error_data["http_status"] = http_status
                error_data["authenticated"] = False
                error_data["reachable"] = True

            return {
                "success": False,
                "status": "error",
                "message": message,
                "data": error_data,
            }
        except Exception as e:
            response_time_ms = (
                int((time.time() - start_time) * 1000) if 'start_time' in locals() else None
            )
            error_data = {
                "mcp_name": None,
                "mcp_type": "ATLASSIAN",
                "mcp_server_url": url,
            }
            if response_time_ms is not None:
                error_data["response_time_ms"] = response_time_ms

            return {
                "success": False,
                "status": "error",
                "message": f"Unexpected error: {str(e)}",
                "data": error_data,
            }
        finally:
            await client.close()

    # Run async function in sync context
    try:
        return asyncio.run(_list_tools())
    except Exception as e:
        error_msg = str(e)
        # Extract HTTP status code if present
        http_status = None

        if "401" in error_msg:
            http_status = 401
            message = "Authentication failed: Bearer token is invalid (HTTP 401)"
        elif "403" in error_msg:
            http_status = 403
            message = "Authentication failed: Bearer token is invalid (HTTP 403)"
        elif "invalid_token" in error_msg or "Unauthorized" in error_msg:
            http_status = 401
            message = "Authentication failed: Bearer token is invalid (HTTP 401)"
        else:
            message = f"Failed to run async operation: {error_msg}"

        error_data = {
            "mcp_name": None,
            "mcp_type": "ATLASSIAN",
            "mcp_server_url": url,
        }
        if http_status is not None:
            error_data["http_status"] = http_status
            error_data["authenticated"] = False
            error_data["reachable"] = True

        logger.error(f"Failed to list ATLASSIAN tools: {e}")
        return {
            "success": False,
            "status": "error",
            "message": message,
            "data": error_data,
        }


def refresh_token(url: str, params: dict, mcp_type: str) -> tuple:
    if mcp_type == 'ATLASSIAN':
        req_params = {
            "grant_type": "refresh_token",
            "client_id": params.get('client_id'),
            "client_secret": params.get('client_secret'),
            "refresh_token": params.get('refresh_token'),
        }
        parsed_url = urlparse(url)
        token_url = f"{parsed_url.scheme}://{parsed_url.hostname}/v1/token"
        try:
            refresh_response = httpx.post(url=token_url, data=req_params)
            refresh_response.raise_for_status()
            refresh_data = refresh_response.json()
            return refresh_data.get("access_token"), refresh_data.get("refresh_token")

        except Exception as e:
            logger.error(f"Failed to refresh token: {e}")
            raise RuntimeError(f"connection to Atlassian MCP server failed: {e}")
    else:
        return None, None
