"""
MCP Client — wraps the Splunk MCP Server's REST API.
All calls use the encrypted MCP token from .env.
"""
import os
import json
import asyncio
from typing import List, Dict, Optional
import httpx
from dotenv import load_dotenv

load_dotenv()

SPLUNK_URL    = os.getenv("SPLUNK_URL", "http://localhost:8001")     # web port
SPLUNK_MGMT   = "https://localhost:8089"                             # REST API port
MCP_TOKEN     = os.getenv("SPLUNK_MCP_TOKEN", "")
SPLUNK_USERNAME = os.getenv("SPLUNK_USERNAME", "admin")
SPLUNK_PASSWORD = os.getenv("SPLUNK_PASSWORD", "")

# MCP endpoint — use HTTPS management port 8089
MCP_ENDPOINT = "https://localhost:8089/services/mcp"


def _mcp_headers() -> dict:
    """Auth headers for MCP server calls (Bearer token)."""
    if MCP_TOKEN:
        return {
            "Authorization": f"Bearer {MCP_TOKEN}",
            "Content-Type": "application/json",
        }
    return _basic_headers()


def _basic_headers() -> dict:
    """Basic auth headers for direct Splunk REST API calls."""
    import base64
    creds = base64.b64encode(f"{SPLUNK_USERNAME}:{SPLUNK_PASSWORD}".encode()).decode()
    return {
        "Authorization": f"Basic {creds}",
        "Content-Type": "application/json",
    }


async def run_search(spl: str, index: str = "main", max_results: int = 100) -> List[dict]:
    """
    Execute a Splunk search via the MCP run_search tool.
    Returns list of result rows.
    """
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {
            "name": "splunk_run_query",
            "arguments": {
                "query": spl,
                "row_limit": max_results,
                "earliest_time": "0",
                "latest_time": "now",
            }
        }
    }
    async with httpx.AsyncClient(verify=False, timeout=120, follow_redirects=True) as client:
        for attempt in range(3):
            try:
                resp = await client.post(MCP_ENDPOINT, headers=_mcp_headers(), json=payload)
                resp.raise_for_status()
                data = resp.json()
                # MCP splunk_run_query returns: {result: {content: [{text: '{"results":[...]}'}]}}
                result_text = data.get("result", {}).get("content", [{}])[0].get("text", "{}")
                if isinstance(result_text, str):
                    parsed = json.loads(result_text)
                    # splunk_run_query wraps in {"results": [...]}
                    if isinstance(parsed, dict) and "results" in parsed:
                        return parsed["results"]
                    if isinstance(parsed, list):
                        return parsed
                return []
            except Exception as e:
                if attempt == 2:
                    print(f"[MCP] run_search failed after 3 attempts: {e}")
                    return []
                await asyncio.sleep(2 ** attempt)
    return []


async def get_raw_events(index: str = "main", search_terms: str = "*", max_results: int = 100) -> List[str]:
    """
    Fetch raw _raw events from a Splunk index for regex training.
    Returns list of raw log strings.
    """
    spl = f'search index={index} {search_terms} | head {max_results} | fields _raw'
    rows = await run_search(spl, index, max_results)
    return [row.get("_raw", "") for row in rows if row.get("_raw")]


async def test_rex_extraction(
    index: str,
    regex: str,
    field_name: str,
    search_terms: str = "*",
    sample_size: int = 200,
) -> dict:
    """
    Test a rex extraction regex on real Splunk data.
    Returns {match_rate, matched, total, unmatched_samples}.
    """
    safe_regex = regex.replace('"', '\\"')
    spl = (
        f'search index={index} {search_terms} | head {sample_size} '
        f'| rex field=_raw "{safe_regex}" '
        f'| eval matched=if(isnotnull({field_name}), 1, 0) '
        f'| stats sum(matched) as matched, count as total'
    )
    rows = await run_search(spl, index, 1)
    if not rows:
        return {"match_rate": 0.0, "matched": 0, "total": 0, "unmatched_samples": []}

    matched = int(rows[0].get("matched", 0))
    total   = int(rows[0].get("total", 1))
    match_rate = matched / total if total > 0 else 0.0

    unmatched = []
    if match_rate < 0.95:
        spl_unmatched = (
            f'search index={index} {search_terms} | head {sample_size} '
            f'| rex field=_raw "{safe_regex}" '
            f'| where isnull({field_name}) '
            f'| head 10 | fields _raw'
        )
        unmatched_rows = await run_search(spl_unmatched, index, 10)
        unmatched = [r.get("_raw", "") for r in unmatched_rows if r.get("_raw")]

    return {
        "match_rate": match_rate,
        "matched": matched,
        "total": total,
        "unmatched_samples": unmatched,
    }


async def health_check() -> dict:
    """Check connectivity to Splunk REST API and MCP server."""
    splunk_ok = False
    try:
        # Use management port (8089) with basic auth for health check
        async with httpx.AsyncClient(verify=False, timeout=10) as client:
            resp = await client.get(
                f"{SPLUNK_MGMT}/services/server/info?output_mode=json",
                headers=_basic_headers(),
            )
            splunk_ok = resp.status_code == 200
    except Exception as e:
        print(f"[Health] Splunk REST check failed: {e}")

    return {
        "splunk": "ok" if splunk_ok else "error",
        "mcp_token_configured": bool(MCP_TOKEN),
        "splunk_url": SPLUNK_URL,
        "splunk_mgmt": SPLUNK_MGMT,
    }
