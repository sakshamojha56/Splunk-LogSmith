"""
SageMaker-specific telemetry utilities.

This module provides telemetry logging functions for SageMaker operations,
including model registration and apply/inference operations.
"""

import uuid
import cexc
from util.error_util import safe_func

logger = cexc.get_logger(__name__)


@safe_func
def log_uuid():
    logger.debug("UUID=%s" % str(uuid.uuid4()))


@safe_func
def log_sagemaker_register(model_name, algorithm, status):
    """
    Log SageMaker model registration event.

    Args:
        model_name (str): Name of the registered SageMaker model
        algorithm (str): Algorithm identifier (e.g., 'sagemaker_custom_model')
        status (int): Registration status (1=success, 0=failure)
    """
    logger.debug(
        "command=register, model=%s, algo_name=%s, status=%d" % (model_name, algorithm, status)
    )


@safe_func
def log_sagemaker_apply(model_name, algorithm, total_processed_time):
    """
    Log SageMaker model apply/inference event.

    Args:
        model_name (str): Name of the SageMaker model being applied
        algorithm (str): Algorithm identifier (e.g., 'sagemaker_custom_model')
        total_processed_time (float): Total time in seconds to process complete dataset
    """
    logger.debug(
        "command=apply, runtime=sagemaker, model=%s, algo_name=%s, total_processed_time=%f"
        % (model_name, algorithm, total_processed_time)
    )
