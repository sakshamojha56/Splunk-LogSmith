from functools import wraps

import cexc

logger = cexc.get_logger('error_logger')


class RateLimitError(Exception):
    """Custom exception for rate limit errors."""

    pass


class CustomMLTKError(Exception):
    """Custom exception for MLTK errors."""

    pass


def safe_func(func):
    @wraps(func)
    def _safe_func(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(
                "An error occurred during the execution of {}: {}".format(func.__name__, e)
            )

    return _safe_func
