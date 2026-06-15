"""CDTSM constants, configuration defaults, and compiled regex patterns."""

import re

# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------
MIN_INPUT_DATAPOINTS = 1
MAX_QUANTILE_HORIZON = 128  # API only returns quantiles for first 128 points
MAX_DETECTION_WINDOW_SECONDS = 86400  # 24 hours
NATIVE_FORECAST_HORIZON = 384  # Model natively forecasts up to 384 points with good accuracy
DEFAULT_TS_BATCH_SIZE = 500  # Per-column batch limit; no limit on total columns

# Time resolution is flexible; algorithm detects and uses whatever resolution is present

# API quantiles (decimal form)
AVAILABLE_QUANTILES = [
    0.01,
    0.05,
    0.1,
    0.2,
    0.25,
    0.3,
    0.4,
    0.5,
    0.6,
    0.7,
    0.75,
    0.8,
    0.9,
    0.95,
    0.99,
]

# Must match API quantiles; includes 'mean' and p-notation
VALID_PERCENTILES = {
    'mean',
    'p1',
    'p5',
    'p10',
    'p20',
    'p25',
    'p30',
    'p40',
    'p50',
    'p60',
    'p70',
    'p75',
    'p80',
    'p90',
    'p95',
    'p99',
}

# conf_interval maps to symmetric quantile pairs: 98%->(0.01,0.99), 90%->(0.05,0.95), etc.
VALID_LOWER_QUANTILES = [q for q in AVAILABLE_QUANTILES if q <= 0.5]

# SPL QuanBin: optional quantile_lower / quantile_upper (must be complementary; see PredictAI).
# Lower tail: strict lower half; upper tail: strict upper half (matches AVAILABLE mirror pairs).
VALID_SPL_QUANTILE_LOWER = [q for q in AVAILABLE_QUANTILES if q < 0.5]
VALID_SPL_QUANTILE_UPPER = [q for q in AVAILABLE_QUANTILES if q > 0.5]

VALID_CONF_INTERVALS = [20, 40, 50, 60, 80, 90, 98]

# conf_interval -> (lower_quantile, upper_quantile)
CONF_INTERVAL_TO_QUANTILES = {
    20: (0.4, 0.6),
    40: (0.3, 0.7),
    50: (0.25, 0.75),
    60: (0.2, 0.8),
    80: (0.1, 0.9),
    90: (0.05, 0.95),
    98: (0.01, 0.99),
}

# ---------------------------------------------------------------------------
# Context building
# ---------------------------------------------------------------------------
DEFAULT_COARSE_BLOCK_SIZE = 2  # Fallback when resolution cannot be determined
MAX_COARSE_CTX_POINTS = 512  # Fallback; normally calculated dynamically
MAX_FINE_CTX_POINTS = 512  # Recent raw values

FIXED_BLOCK_SIZE = 60
FIXED_FINE_LEN = 512
FIXED_MAX_COARSE_CTX_POINTS = 512
MAX_TRAINING_POINTS = (
    FIXED_MAX_COARSE_CTX_POINTS * FIXED_BLOCK_SIZE
) + FIXED_FINE_LEN  # 512 * 60 + 512 = 31,232

# Legacy floor for docs / SPL comments; runtime minimum rows use MIN_INPUT_DATAPOINTS where applicable.
MIN_ANOMALY_DETECTION_POINTS = 60
RECOMMENDED_ANOMALY_DETECTION_POINTS = 60

# Legacy default kept for older internal checks; SPL-level null handling is controlled by fill_null.
IMPUTE_NULLS = True

FILL_NULL_FF = "forward_fill"
FILL_NULL_INTERPOLATE = "interpolate"
DEFAULT_FILL_NULL = FILL_NULL_INTERPOLATE

# When False, wildcard '*' is not supported for fields_to_forecast
ACCEPT_ALL = False

# Internal: per-row tzinfo for string times with mixed %z offsets (e.g. DST); not a user field
CDTSM_INTERNAL_ROW_TZ_COLUMN = "_cdtsm_row_tz"
# Internal: epoch seconds before calendar-DST uniform spacing (23h/24h/25h → fixed steps); forecast output only
CDTSM_INTERNAL_ORIGINAL_TIME_COLUMN = "_cdtsm_original_epoch"

# Predefined datetime formats for detection
# Ordered from most specific to least specific
PREDEFINED_DATETIME_FORMATS = [
    # ISO with timezone offset (try before naive T — RFC 3339 e.g. ...T...-07:00)
    '%Y-%m-%dT%H:%M:%S.%f%z',
    '%Y-%m-%dT%H:%M:%S%z',
    '%Y-%m-%d %H:%M:%S%z',
    '%Y-%m-%dT%H:%M:%S.%fZ',  # 2024-01-01T00:00:00.000000Z
    '%Y-%m-%dT%H:%M:%S.%f',  # 2024-01-01T00:00:00.000000
    # ISO formats without microseconds
    '%Y-%m-%dT%H:%M:%SZ',  # 2024-01-01T00:00:00Z
    '%Y-%m-%dT%H:%M:%S',  # 2024-01-01T00:00:00
    '%Y-%m-%dT%H:%M',  # 2024-01-01T00:00
    # Standard formats with dashes
    '%Y-%m-%d %H:%M:%S.%f',  # 2024-01-01 00:00:00.000000
    '%Y-%m-%d %H:%M:%S',  # 2024-01-01 00:00:00
    '%Y-%m-%d %H:%M',  # 2024-01-01 00:00
    '%Y-%m-%d',  # 2024-01-01
    # Formats with slashes (ISO order)
    '%Y/%m/%d %H:%M:%S.%f',  # 2024/01/01 00:00:00.000000
    '%Y/%m/%d %H:%M:%S',  # 2024/01/01 00:00:00
    '%Y/%m/%d %H:%M',  # 2024/01/01 00:00
    '%Y/%m/%d',  # 2024/01/01
    # US formats (month/day/year)
    '%m/%d/%Y %H:%M:%S.%f',  # 01/01/2024 00:00:00.000000
    '%m/%d/%Y %H:%M:%S',  # 01/01/2024 00:00:00
    '%m/%d/%Y %H:%M',  # 01/01/2024 00:00
    '%m/%d/%Y',  # 01/01/2024
    # European formats (day/month/year)
    '%d/%m/%Y %H:%M:%S.%f',  # 01/01/2024 00:00:00.000000
    '%d/%m/%Y %H:%M:%S',  # 01/01/2024 00:00:00
    '%d/%m/%Y %H:%M',  # 01/01/2024 00:00
    '%d/%m/%Y',  # 01/01/2024
]

# Regex for Splunk-style negative relative times (e.g. -3h, -7d, -30s, -2w, -6mon, -1y, -15m)
_RELATIVE_TIME_RE = re.compile(r"^-(\d+)(s|m|h|d|w|mon|y)$")

_RELATIVE_TIME_UNITS = {
    "s": 1,
    "m": 60,
    "h": 3600,
    "d": 86400,
    "w": 604800,
    "mon": 2592000,  # 30-day month
    "y": 31536000,  # 365-day year
}

# Normalize strftime round-trip mismatches: %f 1-6 digits, %z with/without colon
_FRAC_SEC_RE = re.compile(r'\.(\d{1,6})')
_TZ_COLON_RE = re.compile(r'([+-]\d{2}):(\d{2})$')

# ---------------------------------------------------------------------------
# mlspl.conf [CTSM] stanza and keys
# ---------------------------------------------------------------------------
CTSM_STANZA = "CTSM"
CTSM_OPT_OUT_KEY = "ctsm_opt_out"
CTSM_ACKNOWLEDGE_KEY = "ctsm_acknowledge"
CTSM_REPAIR_TIMESERIES_KEY = "repair_timeseries"
# When ``repair_timeseries`` is absent from ``mlspl.conf`` [CTSM], treat as enabled (string for conf API).
CTSM_REPAIR_TIMESERIES_DEFAULT = "true"

SELF_HOSTED_CDTSM_ENDPOINT_KEY = "self_hosted_cdtsm_endpoint"
SELF_HOSTED_CDTSM_TIMEOUT_KEY = "self_hosted_cdtsm_timeout"
SELF_HOSTED_CDTSM_MODEL_KEY = "self_hosted_cdtsm_model"
SELF_HOSTED_CDTSM_DEFAULT_TIMEOUT = 300.0
SELF_HOSTED_CDTSM_DEFAULT_MODEL = "CDTSM"

# Storage-password coordinates for the self-hosted CDTSM bearer token.
CDTSM_AUTH_TOKEN_KEY = "CDTSM_AUTH_TOKEN"
CDTSM_AUTH_TOKEN_REALM = "aitk_fm_tokens"

# ---------------------------------------------------------------------------
# Execution modes
# ---------------------------------------------------------------------------
MODE_FORECAST = "forecast"
MODE_ANOMALY = "anomaly"
VALID_MODES = (MODE_FORECAST, MODE_ANOMALY)

# Anomaly mode: SPL `method=` values (mapped to internal postprocessing names).
PARAM_AD_METHOD = "method"
# SPL-only names (postprocessing still uses AD_METHOD_QUANBIN / AD_METHOD_RESIDUAL).
SPL_METHOD_QUANBIN = "quantile"
SPL_METHOD_IQR_RESIDUAL = "iqr_residual"
VALID_SPL_ANOMALY_METHODS = (SPL_METHOD_QUANBIN, SPL_METHOD_IQR_RESIDUAL)

# ---------------------------------------------------------------------------
# Pointwise methods (internal / ts_postprocessing)
# ---------------------------------------------------------------------------
AD_METHOD_IQR = "iqr"
AD_METHOD_QUANBIN = "quanbin"
AD_METHOD_RESIDUAL = "residual"
VALID_AD_POINTWISE_METHODS = (AD_METHOD_IQR, AD_METHOD_QUANBIN, AD_METHOD_RESIDUAL)

# Max stride for anomaly_detection rolling forecasts (hard cap independent of API horizon).
# SPL: if stride is set explicitly, values above MAX_AD_STRIDE are rejected (not silently clamped).
MAX_AD_STRIDE = 128

# ---------------------------------------------------------------------------
# Segment methods
# ---------------------------------------------------------------------------
AD_SEGMENT_LOGIC = "logic"
AD_SEGMENT_SMOOTH = "smooth"
VALID_AD_SEGMENT_METHODS = (AD_SEGMENT_LOGIC, AD_SEGMENT_SMOOTH)

# ---------------------------------------------------------------------------
# Threshold directions (QuanBin)
# ---------------------------------------------------------------------------
AD_THRESHOLD_BOTH = "both"
AD_THRESHOLD_LOWER = "lower"
AD_THRESHOLD_UPPER = "upper"
VALID_AD_THRESHOLD_DIRECTIONS = (AD_THRESHOLD_BOTH, AD_THRESHOLD_LOWER, AD_THRESHOLD_UPPER)

# ---------------------------------------------------------------------------
# Aggregation functions (smooth)
# ---------------------------------------------------------------------------
AD_AGG_FUNC_ANY = "any"
AD_AGG_FUNC_ALL = "all"
AD_AGG_FUNC_MODE = "mode"
VALID_AD_AGG_FUNCS = (AD_AGG_FUNC_ANY, AD_AGG_FUNC_ALL, AD_AGG_FUNC_MODE)

# ---------------------------------------------------------------------------
# Zones (AnomalyViz)
# ---------------------------------------------------------------------------
ZONE_HISTORY = "history"
ZONE_FORECAST = "forecast"
ZONE_POST = "post"

# ---------------------------------------------------------------------------
# Anomaly states (AnomalyViz)
# ---------------------------------------------------------------------------
ANOMALY_STATE_NORMAL = "NORMAL"
ANOMALY_STATE_ANOMALOUS = "ANOMALOUS"

# ---------------------------------------------------------------------------
# Percentiles / quantiles
# ---------------------------------------------------------------------------
PERCENTILE_MEAN = "mean"
IQR_REQUIRED_QUANTILES = ["p25", "p50", "p75"]

# p-notation -> float quantile
P_TO_FLOAT_MAP = {
    "p1": 0.01,
    "p5": 0.05,
    "p10": 0.1,
    "p20": 0.2,
    "p25": 0.25,
    "p30": 0.3,
    "p40": 0.4,
    "p50": 0.5,
    "p60": 0.6,
    "p70": 0.7,
    "p75": 0.75,
    "p80": 0.8,
    "p90": 0.9,
    "p95": 0.95,
    "p99": 0.99,
}


def float_quantile_to_percentile_key(q: float) -> str:
    """
    Map a probability in (0, 1) to API/metadata p-notation (e.g. ``p20``).

    ``int(q * 100)`` is unsafe with binary floats (e.g. ``1.0 - 0.8`` → ``0.1999…`` → p19).
    Rounding the percentage keeps lower/upper quantile keys aligned with
    :data:`P_TO_FLOAT_MAP` for anomaly QuanBin and CI visualization.
    """
    pct = int(round(float(q) * 100))
    return f"p{pct}"


# ---------------------------------------------------------------------------
# Default AD parameters
# ---------------------------------------------------------------------------
DEFAULT_MODEL_NAME = "CDTSM"
# Default SPL ``context_length`` for anomaly detection when the search omits it. Set to
# 512 to match the server-side ``build_multi_resolution`` invariant: even when fewer
# than ``FIXED_BLOCK_SIZE`` points are available the multi-resolution build always
# produces a non-empty coarse and fine context, so a larger default is safe to expose.
DEFAULT_CONTEXT_LENGTH = 512
# Recommended/default anomaly context when SPL does not provide context_length.
ADVISED_CONTEXT_LENGTH = 512
# Floor for legacy short-series context handling.
DEFAULT_MIN_CONTEXT_LENGTH = 20
# Legacy alias — same as :data:`DEFAULT_MIN_CONTEXT_LENGTH`.
SHORT_SERIES_CONTEXT_LENGTH = DEFAULT_MIN_CONTEXT_LENGTH
DEFAULT_DETECTION_LENGTH = 128
DEFAULT_STRIDE = 128
DEFAULT_AD_THRESHOLD = 3.0
DEFAULT_AD_QUANTILE_LEVEL = 0.2
DEFAULT_AD_MULTIPLIER = 5.0
DEFAULT_ON_SPAN = 3
DEFAULT_ON_RATIO = 0.5
DEFAULT_OFF_SPAN = 3
DEFAULT_OFF_RATIO = 0.9
DEFAULT_SMOOTH_WIN_SIZE = 5
DEFAULT_AD_CONF_INTERVAL = 60

# Max context entries per API request (anomaly detection batching)
MAX_PAYLOAD_ENTRIES_PER_CALL = 500

# Scheduler-level recovery. Individual HTTP calls still use their local retry
# loop; these limits control how long multi-batch schedulers keep requeueing
# exhausted jobs while other batches continue to complete successfully.
#
# Sized for slow (~50s) hosted API responses. The retry delay receives ±50%
# jitter when applied so that simultaneously requeued batches do not wake up
# in lockstep and re-create the same thundering-herd that triggered the
# requeue.
CDTSM_RATE_LIMIT_PROGRESS_RETRY_DELAY_SECONDS = 60
# 8-minute no-progress budget covers ~3 batches of slow responses + local
# retry chains for batches still working through transient errors. Tighter
# values race the legitimate retry chain at this latency.
CDTSM_RATE_LIMIT_PROGRESS_NO_PROGRESS_TIMEOUT_SECONDS = 8 * 60
CDTSM_RATE_LIMIT_PROGRESS_MAX_WALL_TIME_SECONDS = 60 * 60

# Multiplicative jitter applied to retry delays and local backoffs so that
# many simultaneously requeued or back-off-sleeping requests do not wake up
# at exactly the same instant.
CDTSM_RETRY_JITTER_FRACTION = 0.5

# Client-side rate limiter (token bucket) defaults. Sized to ~80% of the
# observed 50 req/min hosted quota so 429s are essentially impossible from
# our side under steady state.
CDTSM_API_RATE_LIMIT_PER_MINUTE_DEFAULT = 40.0
# Burst tokens allowed at startup before the bucket throttles. Kept small so
# we do not stampede the server in the first second of a run; the steady
# refill rate then sustains throughput.
CDTSM_API_TOKEN_BUCKET_BURST_CAPACITY = 5

# In-flight cap for the hosted async / sync schedulers. Sized via Little's
# law for ~50s response latency × 40 req/min target throughput: 40/60 × 50
# ≈ 33 in-flight. Setting 25 leaves additional headroom for variability.
CDTSM_API_MAX_CONCURRENCY_DEFAULT = 25

# CPU/DataFrame workers used after BY anomaly forecast API responses are back.
# This is intentionally separate from API concurrency because this phase is
# local CPU and pandas/numpy work, not upstream HTTP pressure.
CDTSM_ANOMALY_BY_POSTPROCESS_MAX_WORKERS_DEFAULT = 32

# Streak of CDTSMUpstreamTransientError across sibling batches that triggers
# a full transport reset (rebuild the shared httpx.AsyncClient). Defense in
# depth for the case where TLS / DNS / HTTP-2 state on the shared client is
# itself wedged.
CDTSM_TRANSIENT_STREAK_RESET_THRESHOLD = 5

# mlspl.conf [CTSM] keys that override the defaults above.
CDTSM_API_RATE_LIMIT_PER_MINUTE_KEY = "cdtsm_api_rate_limit_per_minute"
CDTSM_API_MAX_CONCURRENCY_KEY = "cdtsm_api_max_concurrency"
CDTSM_ANOMALY_BY_POSTPROCESS_MAX_WORKERS_KEY = "cdtsm_anomaly_by_postprocess_max_workers"

# ---------------------------------------------------------------------------
# Parameter sets (convert_params / validation)
# ---------------------------------------------------------------------------
PARAM_STRS = [
    "model_name",
    "fields_to_forecast",
    "by",
    "time_field",
    "quantiles",
    "mode",
    "method",
    "detection_window_earliest",
    "detection_window_latest",
    "context_window_earliest",
    "context_window_latest",
    "conf_interval",
    "threshold_direction",
    "fill_null",
]

PARAM_INTS = [
    "forecast_k",
    "holdback",
    "context_length",
    "detection_length",
    "stride",
    "on_span",
    "off_span",
]

PARAM_FLOATS = [
    "quantile",
    "quantile_lower",
    "quantile_upper",
    "multiplier",
    "on_ratio",
    "off_ratio",
]

PARAM_BOOLS = ["show_input"]

ANOMALY_DETECTION_PARAMS = {
    "mode",
    "method",
    "context_length",
    "detection_length",
    "detection_window_earliest",
    "detection_window_latest",
    "context_window_earliest",
    "context_window_latest",
    "stride",
    "quantile",
    "quantile_lower",
    "quantile_upper",
    "multiplier",
    "threshold_direction",
    # Logic segmentation (passed to run_postprocessing as segment_params; segment_method is fixed)
    "on_span",
    "off_span",
    "on_ratio",
    "off_ratio",
}

BASE_PARAMS = {
    "model_name",
    "fields_to_forecast",
    "by",
    "time_field",
    "quantiles",
    "forecast_k",
    "holdback",
    "conf_interval",
    "show_input",
    "fill_null",
}

EXPECTED_PARAMS = BASE_PARAMS | ANOMALY_DETECTION_PARAMS

# Forecast-by only: duplicate ``time_field`` within one group → merge metric columns with this
# reducer (code constant, not SPL). Non-metric columns use ``first``. Allowed: mean, median, min, max, mode.
_FORECAST_BY_DUP_TIME_AGG_VALID = frozenset({"mean", "median", "min", "max", "mode"})
FORECAST_BY_DUP_TIME_AGG = "mean"
if FORECAST_BY_DUP_TIME_AGG not in _FORECAST_BY_DUP_TIME_AGG_VALID:
    raise ValueError(f"Invalid FORECAST_BY_DUP_TIME_AGG: {FORECAST_BY_DUP_TIME_AGG!r}")

# Internal placeholder used only while grouping BY columns. It lets pandas keep
# null-valued BY combinations; outputs restore the placeholder back to null.
FORECAST_BY_NULL_SENTINEL = "***###CDTSM_NULL_BY_VALUE###***"

# Mode-specific parameter sets (PredictAI: forecast vs anomaly)
FORECAST_ONLY_PARAMS = frozenset(
    {
        "forecast_k",
        "holdback",
        "quantiles",
    }
)
ANOMALY_ONLY_PARAMS = frozenset(ANOMALY_DETECTION_PARAMS - {"mode"})
