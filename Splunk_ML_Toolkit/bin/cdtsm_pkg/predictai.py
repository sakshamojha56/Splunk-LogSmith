"""Re-export PredictAI from algos/ for backward compatibility.

Deferred import avoids circular dependency (algos.PredictAI imports cdtsm_pkg mixins).
"""


def __getattr__(name):
    if name == "PredictAI":
        from algos.PredictAI import PredictAI

        return PredictAI
    raise AttributeError(f"module 'cdtsm_pkg.predictai' has no attribute {name!r}")
