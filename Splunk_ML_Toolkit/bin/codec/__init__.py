#!/usr/bin/env python

import json

# from distutils.version import StrictVersion
from packaging.version import Version as StrictVersion  # python 3.13 upgrade

import platform

import numpy as np

from . import codecs_manager
from algos.AITKContainer import AITKContainer

import cexc

logger = cexc.get_logger(__name__)
messages = cexc.get_messages_logger()

NUMPY_VERSION = "1.23.0"


class MLSPLEncoder(json.JSONEncoder):
    def default(
        self, obj
    ):  # pylint: disable=E0202 ; pylint doesn't like overriding default for some reason
        codec = codecs_manager.get_codec_table().get(
            (type(obj).__module__, type(obj).__name__), None
        )
        if codec is not None:
            return codec.encode(obj)
        # Explicitly handle AITKContainer serialization
        try:

            if isinstance(obj, AITKContainer):
                return {
                    "__mlspl_type": (obj.__class__.__module__, obj.__class__.__name__),
                    "params": obj.out_params,
                    "options": getattr(obj, "options", {}),
                    "algo_name": getattr(obj, "algo_name", None),
                    "model_name": getattr(obj, "model_name", None),
                    "target_variable": getattr(obj, "target_variable", None),
                    "feature_variables": getattr(obj, "feature_variables", None),
                }
            # To fix "Not JSON serializable: numpy.intc" error, MLA-4304
            if platform.system() == "Windows" and isinstance(obj, np.intc):
                logger.debug(f"The Obj of mltkcontainer{obj}{dir(obj)}")
                return int(obj)
            return json.JSONEncoder.default(self, obj)
        except Exception:
            raise TypeError(
                "Not JSON serializable: %s.%s" % (type(obj).__module__, type(obj).__name__)
            )


class MLSPLDecoder(json.JSONDecoder):
    def __init__(self, *args, **kwargs):
        super(MLSPLDecoder, self).__init__(*args, object_hook=self._object_hook, **kwargs)

    def _object_hook(self, obj):
        if isinstance(obj, dict) and "__mlspl_type" in obj:
            module_name, name = obj["__mlspl_type"]
            logger.debug(f"The Module Name Under decode: {module_name}")
            codec = codecs_manager.get_codec_table().get((module_name, name), None)
            if (
                codec is None
                and module_name == "algos.AITKContainer"
                and name == "AITKContainer"
            ):
                try:
                    from algos.AITKContainer import AITKContainer

                    # Extract the options
                    options = obj.get("options", {})

                    # Create the container with just options parameter
                    container = AITKContainer(options)

                    # Get the feature_variables from the serialized object
                    # This might be nested in params
                    feature_variables = obj.get("feature_variables")
                    if feature_variables is None and "params" in obj:
                        params = obj.get("params", {})
                        feature_variables = params.get("feature_variables")

                    # Similarly get other important attributes
                    target_variable = obj.get("target_variable")
                    if target_variable is None and "params" in obj:
                        params = obj.get("params", {})
                        target_variable = params.get("target_variable")

                    # Explicitly set these critical attributes
                    setattr(container, "feature_variables", feature_variables)
                    setattr(container, "target_variable", target_variable)

                    # Set other attributes from params if they exist
                    if "params" in obj:
                        params = obj.get("params", {})
                        for key, value in params.items():
                            if not hasattr(container, key) or getattr(container, key) is None:
                                setattr(container, key, value)

                    # Set any remaining top-level attributes
                    for key, value in obj.items():
                        if key not in ["__mlspl_type", "options", "params"] and not hasattr(
                            container, key
                        ):
                            setattr(container, key, value)

                    return container

                except Exception as e:
                    logger.exception(f"Failed to import or initialize AITKContainer: {e}")
                    raise ValueError(
                        f"Failed to decode model of type {module_name}.{name}. "
                        f"Ensure the class exists and is importable."
                    )
            if codec:
                return codec.decode(obj)
            logger.error(
                'Model might be old. No codec for record of type "%s.%s"' % (module_name, name)
            )
            raise ValueError(
                f'The model may not be compatible with this version of MLTK. Please try re-creating the model.'
            )
        return obj


def encode(obj):
    if StrictVersion(np.version.version) >= StrictVersion(NUMPY_VERSION):
        return MLSPLEncoder().encode(obj)
    else:
        raise RuntimeError(
            "Python for Scientific Computing version 1.1 or later is required to save models."
        )


def decode(payload):
    if StrictVersion(np.version.version) >= StrictVersion(NUMPY_VERSION):
        return MLSPLDecoder().decode(payload)
    else:
        raise RuntimeError(
            "Python for Scientific Computing version 1.1 or later is required to load models."
        )
