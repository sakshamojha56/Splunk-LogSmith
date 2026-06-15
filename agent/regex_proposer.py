"""
Regex Proposer — uses Google Gemini to generate and refine
Splunk-compatible named-capture-group regex from log examples.

Falls back to a smart heuristic engine if Gemini is unavailable.
"""
import os
import json
import re
from typing import Optional, List
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = "gemini-2.5-flash"
_client = None


def _get_client():
    """Lazy-init Gemini client; returns None if unavailable."""
    global _client
    if _client is not None:
        return _client
    if not GEMINI_API_KEY:
        return None
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        _client = genai.GenerativeModel(GEMINI_MODEL)
        return _client
    except Exception:
        return None


def _generate(prompt: str) -> Optional[str]:
    """Call Gemini; return text or None on any error (quota, network, etc.)."""
    model = _get_client()
    if not model:
        return None
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"[Gemini] Unavailable ({type(e).__name__}): {e!s:.120}. Using heuristic fallback.")
        return None


# ── Heuristic Fallback Engine ─────────────────────────────────────────────────

# Ordered list of (pattern_name, detection_regex, field_list)
# Each field is (name, regex_template)
_HEURISTIC_PATTERNS = [
    # JSON log lines
    (
        "json_log",
        re.compile(r'^\s*\{'),
        [
            ("timestamp",   r'"(?:timestamp|time|@timestamp|ts)":\s*"(?P<timestamp>[^"]+)"'),
            ("level",       r'"(?:level|severity|log_level)":\s*"(?P<level>[^"]+)"'),
            ("message",     r'"(?:message|msg|text)":\s*"(?P<message>[^"]+)"'),
            ("host",        r'"(?:host|hostname|server)":\s*"(?P<host>[^"]+)"'),
            ("user",        r'"(?:user|username|user_id)":\s*"(?P<user>[^"]+)"'),
            ("src_ip",      r'"(?:ip|src_ip|client_ip|remote_addr)":\s*"(?P<src_ip>[^"]+)"'),
            ("status",      r'"(?:status|status_code|http_status)":\s*(?P<status>\d+)'),
        ],
    ),
    # Apache / NGINX Combined Access Log
    (
        "apache_access",
        re.compile(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}.*\[.*\].*"(?:GET|POST|PUT|DELETE|HEAD|OPTIONS)'),
        [
            ("src_ip",      r'(?P<src_ip>\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'),
            ("timestamp",   r'(?P<timestamp>\d{2}/\w{3}/\d{4}:\d{2}:\d{2}:\d{2}\s[+-]\d{4})'),
            ("http_method", r'"(?P<http_method>GET|POST|PUT|DELETE|HEAD|OPTIONS|PATCH)'),
            ("uri",         r'"(?:GET|POST|PUT|DELETE|HEAD|OPTIONS|PATCH)\s(?P<uri>[^\s"]+)'),
            ("status",      r'"\s(?P<status>\d{3})\s'),
            ("bytes",       r'(?P<bytes>\d+)\s"[^"]*"\s"'),
            ("user_agent",  r'"[^"]*"\s"(?P<user_agent>[^"]+)"'),
        ],
    ),
    # Syslog (RFC 3164 / 5424)
    (
        "syslog",
        re.compile(r'(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d+\s+\d{2}:\d{2}:\d{2}'),
        [
            ("timestamp",   r'(?P<timestamp>(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d+\s+\d{2}:\d{2}:\d{2})'),
            ("host",        r'\d{2}:\d{2}:\d{2}\s+(?P<host>\S+)'),
            ("process",     r'(?P<process>[a-zA-Z0-9_\-]+)(?:\[\d+\])?:'),
            ("pid",         r'(?P<pid>\d+)\]:?'),
            ("message",     r'\]:\s+(?P<message>.+)$'),
        ],
    ),
    # ISO8601 structured logs  (2024-01-15T12:34:56 level=INFO ...)
    (
        "iso_structured",
        re.compile(r'\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}'),
        [
            ("timestamp",   r'(?P<timestamp>\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)'),
            ("level",       r'(?P<level>DEBUG|INFO|WARN(?:ING)?|ERROR|CRITICAL|FATAL|TRACE)'),
            ("host",        r'host=(?P<host>[^\s,]+)'),
            ("user",        r'user(?:name)?=(?P<user>[^\s,]+)'),
            ("src_ip",      r'(?:src|ip|client)=(?P<src_ip>\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'),
            ("action",      r'action=(?P<action>[^\s,]+)'),
            ("status",      r'status=(?P<status>\d{3}|success|failure|failed|ok)'),
            ("duration_ms", r'duration(?:_ms)?=(?P<duration_ms>\d+)'),
            ("message",     r'(?:msg|message)=(?P<message>[^\n]+)'),
        ],
    ),
    # Windows Event Log style
    (
        "windows_event",
        re.compile(r'EventID|EventCode|Windows|Microsoft|MSWin', re.I),
        [
            ("timestamp",   r'(?P<timestamp>\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})'),
            ("event_id",    r'(?:EventID|EventCode)[=:\s]+(?P<event_id>\d+)'),
            ("level",       r'(?P<level>Information|Warning|Error|Critical|Verbose)'),
            ("source",      r'Source[=:\s]+(?P<source>[^\r\n,]+)'),
            ("user",        r'(?:User|Account)[=:\s]+(?P<user>[^\r\n,]+)'),
            ("host",        r'(?:Computer|Host)[=:\s]+(?P<host>[^\r\n,]+)'),
            ("message",     r'(?:Message|Description)[=:\s]+(?P<message>[^\r\n]+)'),
        ],
    ),
    # Generic fallback: key=value pairs
    (
        "key_value",
        re.compile(r'\w+=\S+'),
        [
            ("timestamp",   r'(?P<timestamp>\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?)'),
            ("level",       r'(?P<level>DEBUG|INFO|WARN(?:ING)?|ERROR|CRITICAL|FATAL)'),
            ("src_ip",      r'(?P<src_ip>\d{1,3}(?:\.\d{1,3}){3})'),
            ("message",     r'(?:msg|message)=(?P<message>[^\n]+)'),
        ],
    ),
]

_PII_KEYWORDS = {"ip", "email", "user", "password", "passwd", "token", "key",
                 "phone", "ssn", "name", "addr", "credit", "card", "secret"}
_PII_TYPE_MAP = {
    "ip": "ip_address", "src_ip": "ip_address", "email": "email",
    "user": "username", "username": "username", "password": "password",
    "token": "auth_token", "key": "api_key", "phone": "phone",
    "ssn": "ssn", "name": "pii_name", "addr": "address",
}


def _heuristic_propose(log_sample: str, real_examples: List[str]) -> List[dict]:
    """Detect log format heuristically and return field extraction proposals."""
    sample = log_sample # Force detection on user input for demo purposes

    matched_pattern = None
    for name, detector, fields in _HEURISTIC_PATTERNS:
        if detector.search(sample):
            matched_pattern = (name, fields)
            break

    if matched_pattern is None:
        _, fields = _HEURISTIC_PATTERNS[-1]  # generic fallback
    else:
        _, fields = matched_pattern

    results = []
    for fname, fregex in fields:
        # Only include fields whose regex actually matches at least one example
        hits = sum(1 for ex in [log_sample] if re.search(fregex, ex))
        if hits > 0:
            results.append({
                "name": fname,
                "regex": fregex,
                "description": f"Auto-detected field '{fname}' (heuristic, {hits} matches)",
            })

    if not results:
        # Last-resort: timestamp + message
        results = [
            {"name": "timestamp",
             "regex": r"(?P<timestamp>\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2})",
             "description": "ISO timestamp"},
            {"name": "level",
             "regex": r"(?P<level>DEBUG|INFO|WARN(?:ING)?|ERROR|CRITICAL|FATAL)",
             "description": "Log severity level"},
        ]
    return results


def _heuristic_pii(fields: List[dict]) -> List[dict]:
    """Tag PII fields by keyword matching on field names."""
    for f in fields:
        low = f["name"].lower()
        f["is_pii"] = any(kw in low for kw in _PII_KEYWORDS)
        f["pii_type"] = next((_PII_TYPE_MAP[kw] for kw in _PII_TYPE_MAP if kw in low), None)
    return fields


# ── JSON helper ───────────────────────────────────────────────────────────────

def _extract_json(text: str) -> str:
    text = re.sub(r'```(?:json)?\s*', '', text)
    text = re.sub(r'```\s*', '', text)
    match = re.search(r'\{.*\}', text, re.DOTALL)
    return match.group(0) if match else text


# ── Public API ────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are an expert Splunk field extraction engineer.
Write named-capture-group regular expressions compatible with Splunk's rex command.

Rules:
1. Use Python/PCRE named groups: (?P<fieldname>...)
2. Field names: lowercase, alphanumeric + underscore only
3. Return ONLY valid JSON, no markdown, no explanation
4. Each regex must be a small, isolated pattern that extracts ONLY that specific field. DO NOT write one massive full-line regex that captures everything at once.
5. Make patterns flexible (\\s+ for whitespace, [^\\s]+ for tokens)

Return format:
{
  "fields": [
    {"name": "field_name", "regex": "isolated_regex_with_named_group", "description": "what it captures"}
  ]
}"""


async def propose_regex(log_sample: str, real_examples: List[str]) -> List[dict]:
    """Propose field extraction regexes. Uses Gemini if available, heuristics otherwise."""
    examples_text = "\n".join(real_examples[:20]) if real_examples else log_sample

    prompt = f"""Analyze these log lines and propose named-capture-group regexes.

LOG SAMPLE:
{log_sample}

REAL EXAMPLES FROM SPLUNK:
{examples_text}

Propose regex patterns to extract ALL meaningful fields.
{SYSTEM_PROMPT}"""

    raw = _generate(prompt)
    if raw:
        try:
            data = json.loads(_extract_json(raw))
            fields = data.get("fields", [])
            if fields:
                return fields
        except Exception:
            pass

    # Gemini failed or returned bad JSON — use heuristic engine
    print("[Proposer] Using heuristic engine (Gemini unavailable)")
    return _heuristic_propose(log_sample, real_examples)


async def refine_regex(
    original_regex: str,
    field_name: str,
    unmatched_samples: List[str],
    match_rate: float
) -> str:
    """Refine a regex to cover more events. Falls back to original if Gemini unavailable."""
    unmatched_text = "\n".join(unmatched_samples[:10])

    prompt = f"""A Splunk rex regex for field '{field_name}' matches {match_rate:.0%} of events.

Current regex: {original_regex}

Unmatched lines (fix for these):
{unmatched_text}

Return ONLY the improved regex string for field '{field_name}' ((?P<{field_name}>...)).
No explanation, just the regex string."""

    raw = _generate(prompt)
    if raw:
        refined = raw.strip()
        if f"(?P<{field_name}>" in refined:
            return refined
        match = re.search(r'\(\?P<[^>]+>.*\)', refined)
        if match:
            return match.group(0)

    return original_regex  # keep original if Gemini unavailable


async def classify_pii_fields(fields: List[dict]) -> List[dict]:
    """Classify fields as PII. Falls back to keyword heuristics if Gemini unavailable."""
    field_names = [f["name"] for f in fields]

    prompt = f"""Classify these Splunk field names as PII or not.

Fields: {field_names}

PII types: ip_address, email, username, password, token, api_key, phone, credit_card, ssn, name

Return ONLY valid JSON:
{{
  "classifications": [
    {{"name": "field_name", "is_pii": true/false, "pii_type": "ip_address or null"}}
  ]
}}"""

    raw = _generate(prompt)
    if raw:
        try:
            data = json.loads(_extract_json(raw))
            classifications = {c["name"]: c for c in data.get("classifications", [])}
            for field in fields:
                cls = classifications.get(field["name"], {})
                field["is_pii"] = cls.get("is_pii", False)
                field["pii_type"] = cls.get("pii_type", None)
            return fields
        except Exception:
            pass

    return _heuristic_pii(fields)
