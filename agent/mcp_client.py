"""
MCP Client — talks to Splunk's REST API directly (port 8089).
The MCP layer at /services/mcp returns empty results despite valid tokens,
so we use the native Splunk oneshot search REST endpoint instead.
"""
import os
import json
import base64
import asyncio
from typing import List
import httpx
from dotenv import load_dotenv

load_dotenv()

SPLUNK_MGMT    = os.getenv("SPLUNK_MGMT", "https://localhost:8089")
SPLUNK_URL     = os.getenv("SPLUNK_URL", "http://localhost:8001")
SPLUNK_USERNAME = os.getenv("SPLUNK_USERNAME", "saksham")
SPLUNK_PASSWORD = os.getenv("SPLUNK_PASSWORD", "saksham18")
MCP_TOKEN      = os.getenv("SPLUNK_MCP_TOKEN", "")


def _basic_auth() -> str:
    """Return a Basic auth header value."""
    creds = base64.b64encode(
        f"{SPLUNK_USERNAME}:{SPLUNK_PASSWORD}".encode()
    ).decode()
    return f"Basic {creds}"


async def run_search(spl: str, index: str = "main", max_results: int = 100) -> List[dict]:
    """
    Execute a Splunk oneshot search via the REST API (port 8089).
    Returns a list of result-row dicts.
    """
    params = {
        "search":       spl,
        "output_mode":  "json",
        "earliest_time": "0",
        "latest_time":   "now",
        "exec_mode":    "oneshot",
        "count":         str(max_results),
    }
    headers = {"Authorization": _basic_auth()}

    async with httpx.AsyncClient(verify=False, timeout=60) as client:
        for attempt in range(3):
            try:
                resp = await client.post(
                    f"{SPLUNK_MGMT}/services/search/jobs",
                    headers=headers,
                    data=params,
                )
                resp.raise_for_status()
                data = resp.json()
                return data.get("results", [])
            except Exception as e:
                if attempt == 2:
                    print(f"[Splunk REST] search failed after 3 attempts: {e}")
                    return []
                await asyncio.sleep(2 ** attempt)
    return []


async def get_raw_events(
    index: str = "main", search_terms: str = "*", max_results: int = 100
) -> List[str]:
    """
    Fetch raw _raw events from a Splunk index for regex training.
    Returns list of raw log strings.
    """
    spl = f"search index={index} {search_terms} | head {max_results} | fields _raw"
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

    matched    = int(rows[0].get("matched", 0))
    total      = int(rows[0].get("total",   1))
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
        "match_rate":        match_rate,
        "matched":           matched,
        "total":             total,
        "unmatched_samples": unmatched,
    }


async def health_check() -> dict:
    """Check connectivity to Splunk REST API."""
    splunk_ok = False
    try:
        async with httpx.AsyncClient(verify=False, timeout=10) as client:
            resp = await client.get(
                f"{SPLUNK_MGMT}/services/server/info?output_mode=json",
                headers={"Authorization": _basic_auth()},
            )
            splunk_ok = resp.status_code == 200
    except Exception as e:
        print(f"[Health] Splunk REST check failed: {e}")

    return {
        "splunk":               "ok" if splunk_ok else "error",
        "mcp_token_configured": bool(MCP_TOKEN),
        "splunk_url":           SPLUNK_URL,
        "splunk_mgmt":          SPLUNK_MGMT,
    }
