"""
This module contains methods used only by the "listmodels" command and /list_models REST handler
and has been split from models.base in order to avoid dependencies on Anaconda Python
"""

import re
import traceback

import cexc
import util.models_util as models_util
from util.constants import (
    MODEL_EXTENSION,
    MODEL_FILE_REGEX,
    ONNX_MODEL_EXTENSION,
    ONNX_MODEL_FILE_REGEX,
)
from util.lookups_util import get_lookups_from_splunk, parse_model_reply

logger = cexc.get_logger(__name__)
messages = cexc.get_messages_logger()

_model_re = re.compile(MODEL_FILE_REGEX)
_onnx_model_re = re.compile(ONNX_MODEL_FILE_REGEX)


def add_model_info_to_lookup_info(lookup_info):
    """
    Adds model-specific information to one of the entries from /lookup-table-files

    Args:
        lookup_info (set): An entry containing information about a lookup file

    Returns:
        lookup_info (set): The input, augmented with model-specific information
    """

    # define some defalt values here if something goes wrong loading the model
    algo_name = 'Unknown'
    model_name = 'Unknown'

    try:
        match = _model_re.match(lookup_info['id'])

        # if match is not found, check if the entry is an ONNX models
        if not match:
            match = _onnx_model_re.match(lookup_info['id'])

        model_name = match.group('model_name')

        algo_name, _, options = models_util.load_algo_options_from_disk(
            file_path=lookup_info['content']['eai:data']
        )
    except Exception:
        # if we fail to load the model, we should still populate model info as best we can
        options = {}

        logger.warn(traceback.format_exc())
        messages.warn('listmodels: Failed to load model "%s"', model_name)

    options[
        'algo_name'
    ] = algo_name  # can't use the "algo_name" inside options because it may not be present in pre 2.3 models

    # For SageMaker and Vertex models, preserve the original model_name from CSV.
    # Their lookup filenames include provider-specific prefixes that should not
    # leak into the displayed model name.
    # For other models, use filename-extracted name for consistency.
    if options.get('runtime') not in ('sagemaker', 'vertex'):
        options[
            'model_name'
        ] = model_name  # can't use the "model_name" inside options because it may be inconsistent with the model file name

    # Remove sensitive credential fields from model listing
    sensitive_fields = ['aws_credentials', 'password', 'secret_key', 'access_key', 'token']
    for field in sensitive_fields:
        if field in options:
            logger.warning(
                f"Removed sensitive field '{field}' from model '{options.get('model_name', model_name)}'"
            )
            del options[field]

    lookup_info['content']['mlspl:model_info'] = options
    return lookup_info


def list_models(searchinfo, query_params=None):
    """
    Gets a list of models from Splunk's /lookup-table-files endpoint

    Args:
        searchinfo (set): a seachinfo object
        query_params (list): a list of tuples representing URL params, ie. [(count, -1)]

    Returns:
        output (list): a list of lookup files
    """

    if query_params is None:
        query_params = []
    name_query = ('search', 'name=*__mlspl_*{}'.format(MODEL_EXTENSION))
    query_params.append(name_query)

    lookup_files = get_lookups_from_splunk(
        searchinfo, '-', parse_model_reply, query_params=query_params
    )
    lookup_files['entry'] = list(map(add_model_info_to_lookup_info, lookup_files['entry']))

    # Clean up orphaned SageMaker passwords
    _cleanup_orphaned_sagemaker_passwords(lookup_files, searchinfo)

    return lookup_files


def list_mltkcontainer_models(searchinfo, query_params=None):
    """
    Gets a list of LinearRegression models from Splunk's /lookup-table-files endpoint.

    Args:
        searchinfo (set): a seachinfo object
        query_params (list): a list of tuples representing URL params, ie. [(count, -1)]

    Returns:
        output (list): a list of lookup files filtered by LinearRegression algo
    """
    if query_params is None:
        query_params = []

    name_query = ('search', f'name=*__mlspl_*{MODEL_EXTENSION}')
    query_params.append(name_query)

    lookup_files = get_lookups_from_splunk(
        searchinfo, '-', parse_model_reply, query_params=query_params
    )

    # Add extra model metadata
    entries = list(map(add_model_info_to_lookup_info, lookup_files['entry']))
    logger.debug("The entries are: {}".format(entries))

    # Filter only LinearRegression models
    def is_linear_regression(entry):
        try:
            model_info = entry.get('content', {}).get('mlspl:model_info', {})
            algo_name = model_info.get('algo_name', '')
            return algo_name.lower() == 'mltkcontainer'
        except Exception as e:
            logger.warning(f"Error checking algo_name in entry: {e}")
            return False

    lookup_files['entry'] = list(filter(is_linear_regression, entries))

    # Clean up orphaned SageMaker passwords
    _cleanup_orphaned_sagemaker_passwords(lookup_files, searchinfo)

    return lookup_files


def _cleanup_orphaned_sagemaker_passwords(lookup_files, searchinfo):
    """
    Clean up orphaned SageMaker passwords during list_models.

    Cleanup runs on every list_models call. Users can refresh the model list
    to trigger cleanup if orphaned credentials exist.
    """
    try:
        from util.sagemaker_util_extensions import cleanup_orphaned_sagemaker_passwords

        # Extract SageMaker model names
        sagemaker_model_names = [
            entry.get('content', {}).get('mlspl:model_info', {}).get('model_name')
            for entry in lookup_files.get('entry', [])
            if entry.get('content', {}).get('mlspl:model_info', {}).get('runtime')
            == 'sagemaker'
        ]
        sagemaker_model_names = [name for name in sagemaker_model_names if name]

        cleanup_orphaned_sagemaker_passwords(searchinfo, sagemaker_model_names)

    except Exception as e:
        logger.error(f"Orphaned password cleanup failed: {e}")


def _cleanup_orphaned_vertex_passwords(lookup_files, searchinfo):
    """
    Clean up orphaned Vertex passwords during list_models.

    Cleanup runs on every list_models call. Users can refresh the model list
    to trigger cleanup if orphaned credentials exist.
    """
    try:
        from util.vertex_util_extensions import cleanup_orphaned_vertex_passwords

        vertex_model_names = [
            entry.get('content', {}).get('mlspl:model_info', {}).get('model_name')
            for entry in lookup_files.get('entry', [])
            if entry.get('content', {}).get('mlspl:model_info', {}).get('runtime') == 'vertex'
        ]
        vertex_model_names = [name for name in vertex_model_names if name]

        cleanup_orphaned_vertex_passwords(searchinfo, vertex_model_names)

    except Exception as e:
        logger.error(f"Orphaned Vertex password cleanup failed: {e}")
