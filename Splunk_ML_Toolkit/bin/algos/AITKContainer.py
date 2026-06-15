#!/usr/bin/env python
# MLTK-Container extension for custom containerized code that can run tensorflow or other deep learning frameworks
# Author: Philipp Drieger, Principal Machine Learning Architect, 2022

import os
import json
import numpy as np
import pandas as pd
import cexc

logger = cexc.get_logger(__name__)

from dsdl.system_paths import setup_sys_path

setup_sys_path()


from base import BaseAlgo
from codec import codecs_manager
from codec.codecs import NoopCodec
from util import df_util
from util.param_util import convert_params
from cexc import get_messages_logger, get_logger
from configparser import ConfigParser
from dsdl.passwords import decode_passwords
from splunklib.client import Service

# urllib fix from 3.6 to 3.7 to work with MLTK 5.3 onwards
try:
    from future.moves.urllib import error as urllib_error
    from future.moves.urllib import parse as urllib_parse
    from future.moves.urllib import request as urllib_request
except:
    from urllib import error as urllib_error
    from urllib import request as urllib_request
    from urllib import parse as urllib_parse
import ssl
from io import StringIO

# -------------------------------------------------------------------------------
# GLOBAL variables for logging
# -------------------------------------------------------------------------------
# enable logging by default
_AITKContainer_logging = True
_AITKContainer_logger = get_logger('AITKContainer')
_AITKContainer_messages = get_messages_logger()
_AITKContainer_notebooks = [
    "a_threat_hunting_notebook",
    "anomaly_detection_ecod",
    "appNLP_eval_summarization",
    "autoencoder",
    "autosklearn_classification",
    "barebone_spark",
    "barebone_template",
    "binary_nn_classifier",
    "binary_nn_classifier_designer",
    "binary_nn_classifier_onnx",
    "causalnex",
    "correlationmatrix",
    "dask_kmeans",
    "dnn_regressor",
    "drift_detection",
    "graph_algo",
    "graph_algo_louvain",
    "graphistry_notebook",
    "grid_search_svm",
    "grid_search_svm_mlflow",
    "hashing_encoder",
    "hashing_encoder_difference",
    "hashing_encoder_distance",
    "hidden_markov_model",
    "ja3_encoder",
    "linear_regressor",
    "llm_rag_document_encoder",
    "llm_rag_function_calling",
    "llm_rag_log_encoder",
    "llm_rag_milvus_management",
    "llm_rag_milvus_search",
    "llm_rag_ollama_model_manager",
    "llm_rag_ollama_text_processing",
    "llm_rag_script",
    "multivariate_lstm",
    "pretrained_dga_model_dsdl",
    "prophet_forecast",
    "push_to_milvus",
    "pytorch_logistic_regression",
    "pytorch_nn",
    "query_milvus",
    "random_cut_forest",
    "rapids_umap",
    "rapids_umap_dga",
    "river_halfspacetree",
    "seasonality_and_trend_decomposition",
    "shap_xgboost",
    "spacy_ner",
    "spacy_ner_ja",
    "spacy_sentiment",
    "spark_fp_growth",
    "spark_gradient_boosting_classifier",
    "spark_recommender",
    "stumpy",
    "transformers_classification",
    "transformers_sentencebert",
    "transformers_summarization",
    "transformers_zeroshot_classification",
    "umap",
    "univariate_cnn_forecast",
    "univariate_rnn_forecast",
    "xgboost_regressor",
]


# -------------------------------------------------------------------------------
# main class implementing communication with the container for classification
# -------------------------------------------------------------------------------
class AITKContainer(BaseAlgo):

    # ---------------------------------------------------------------------------
    # initialization function with options and parameter handling
    def __init__(self, options):
        # pass through options and parameters
        _AITKContainer_logger.debug(f'Deatils from AITKCONTAINER {options}')
        logger.debug("The options in AITKContainer is: {}".format(options))
        self.options = options  # <-- store options here
        self.out_params = options
        out_params = options
        # get endpoint from conf

        model_name = self.options.get('model_name', '__dev__')
        self.cluster_type = ''
        try:
            dsdl_conf = self._get_config(
                os.path.join(
                    os.path.dirname(__file__), "..", "..", "local", "dsdl_container.conf"
                )
            )
            stanza = model_name if dsdl_conf.has_section(model_name) else "__dev__"
            self.cluster_type = dsdl_conf.get(stanza, 'cluster', fallback='docker')
        except Exception as e:
            _AITKContainer_logger.warning(
                f"Could not read cluster type, defaulting to docker. Exception: {e}"
            )
        self.endpoint_url = self.get_endpoint_url(options, out_params)
        # save parsed parameters
        if _AITKContainer_logging:
            _AITKContainer_logger.info('init with params: {}'.format(options))
        self.out_params = out_params

    def to_dict(self):
        """
        Return a JSON-serializable representation of the model
        """
        return {
            "out_params": getattr(self, "out_params", None),
            "feature_variables": getattr(self, "feature_variables", None),
            "target_variable": getattr(self, "target_variable", None),
            "endpoint_url": getattr(self, "endpoint_url", None),
            # Include trained weights if stored
            "model_weights": getattr(self, "model_weights", None),
        }

    # helper function to log known notebook names or generic AITKContainer algo execution
    def log_algo_name(self, options):
        algo_name = "AITKContainer"
        _AITKContainer_logger.info('log_algo_name: {}'.format(options))
        try:
            notebook = options["params"]["algo"]
            if notebook in _AITKContainer_notebooks:
                algo_name = algo_name + "." + notebook
        except:
            algo_name = "AITKContainer"
        _AITKContainer_logger.debug('algo_name=%s, params={null}' % algo_name)
        return algo_name

    # helper function for fit apply summary to dynamically get endpoint url from conf
    def get_endpoint_url(self, options, out_params=None):
        # get default __dev__ endpoint from conf
        model_name_endpoint = ''
        # Determine model endpoint
        model_name = options.get('model_name', '__dev__')
        model_name_endpoint = self._get_endpoint_url_from_config(model_name)

        # Override for dev/staging mode
        if out_params and 'mode' in out_params:
            if 'dev' in out_params['mode'] or 'stag' in out_params['mode']:
                model_name_endpoint = self._get_endpoint_url_from_config("__dev__")

        if not model_name_endpoint:
            model_name_endpoint = self._get_endpoint_url_from_config("__dev__")
            _AITKContainer_messages.info(
                "AITKC info: no container model found - switching to default __dev__ container"
            )

        _AITKContainer_messages.info(f"AITKC endpoint: {model_name_endpoint}")

        # Determine cluster type from dsdl_container.conf
        cluster_type = self.cluster_type
        # Read container_connections.conf safely
        config_path = os.path.join(
            os.path.dirname(__file__), "..", "..", "local", "container_connections.conf"
        )
        config = self._get_config(config_path)

        if config.has_section(cluster_type):
            in_cluster_mode_str = config.get(cluster_type, 'in_cluster_mode', fallback='false')
        else:
            _AITKContainer_logger.warning(
                f"No section '{cluster_type}' in {config_path}. Defaulting to in_cluster_mode=false"
            )
            in_cluster_mode_str = 'false'

        in_cluster_mode = in_cluster_mode_str.lower() == 'true'

        # Ensure HTTPS if not in-cluster
        if not in_cluster_mode and not model_name_endpoint.startswith('http'):
            _AITKContainer_logger.error(
                f"Failed to connect to the container. Endpoint URL ({model_name_endpoint}) is undefined or not HTTPS."
            )
            raise Exception(
                f"Failed to connect to the container. Endpoint URL ({model_name_endpoint}) is undefined or not HTTPS."
            )

        return model_name_endpoint

    def detect_encoding(self, path):
        import codecs

        _null = "\x00".encode("ascii")  # encoding to ASCII for Python 3
        _null2 = _null * 2
        _null3 = _null * 3
        with open(path, "rb") as fp:
            data = fp.readline()
        sample = data[:4]
        if sample in (codecs.BOM_UTF32_LE, codecs.BOM_UTF32_BE):
            return "utf-32"  # BOM included
        if sample[:3] == codecs.BOM_UTF8:
            return "utf-8-sig"  # BOM included, MS style (discouraged)
        if sample[:2] in (codecs.BOM_UTF16_LE, codecs.BOM_UTF16_BE):
            return "utf-16"  # BOM included
        nullcount = sample.count(_null)
        if nullcount == 0:
            return "utf-8"
        if nullcount == 2:
            if sample[::2] == _null2:  # 1st and 3rd are null
                return "utf-16-be"
            if sample[1::2] == _null2:  # 2nd and 4th are null
                return "utf-16-le"
            # Did not detect 2 valid UTF-16 ascii-range characters
        if nullcount == 3:
            if sample[:3] == _null3:
                return "utf-32-be"
            if sample[1:] == _null3:
                return "utf-32-le"
            # Did not detect a valid UTF-32 ascii-range character
        return "utf-8"

    # helper function to get configparser object
    def _get_config(self, filename):
        conf = None
        encoding = 'utf-8'
        # conf = ConfigParser(delimiters=('='), strict=False)
        try:
            encoding = self.detect_encoding(filename)
        except Exception as e:
            _AITKContainer_logger.error(
                'unable to determine encoding for '
                + filename
                + '. Returned with exception ('
                + str(e)
                + ')'
            )
        try:
            conf = ConfigParser(delimiters=('='), strict=False)
            conf.read(filename, encoding=encoding)
            if not conf.sections():
                _AITKContainer_logger.warning(f"No sections found in config file: {filename}")
        except Exception as e:
            _AITKContainer_logger.error(f"Unable to parse config {filename}. Exception: {e}")
        return conf

    # helper function to get external hostname info from conf
    def _get_external_hostname_from_config(self, model_name):
        # set encoding to utf-8 by default
        url = ''
        containersConfParser = self._get_config(
            os.path.join(os.path.dirname(__file__), "..", "..", "local", "dsdl_container.conf")
        )
        try:
            stanza = model_name
            if not containersConfParser.has_section(stanza):
                stanza = "__dev__"
                _AITKContainer_messages.info(
                    'AITKC info: no config found for model name {} - switching to default __dev__ container'.format(
                        model_name
                    )
                )
            url = containersConfParser.get(stanza, 'api_url_external')
        except Exception as e:
            _AITKContainer_logger.error(
                'unable get external endpoint URL from config for model_name='
                + model_name
                + '. Returned with exception ('
                + str(e)
                + ')'
            )
        return url

    def _get_endpoint_url_from_config(self, model_name):
        # set encoding to utf-8 by default
        url = ''
        containersConfParser = self._get_config(
            os.path.join(os.path.dirname(__file__), "..", "..", "local", "dsdl_container.conf")
        )
        _AITKContainer_logger.debug(f'The container config path {containersConfParser}')
        try:
            stanza = model_name
            if not containersConfParser.has_section(stanza):
                stanza = "__dev__"
                _AITKContainer_messages.info(
                    'AITKC info: no config found for model name {} - switching to default __dev__ container'.format(
                        model_name
                    )
                )
            url = containersConfParser.get(stanza, 'api_url')
        except Exception as e:
            _AITKContainer_logger.error(
                'unable get endpoint URL from config for model_name='
                + model_name
                + '. Returned with exception ('
                + str(e)
                + ')'
            )
        return url

    def endpoint(self, url, data=None, content_type='application/json'):
        """
        Call the container endpoint (GET or POST) using cluster-specific configuration.
        - Cluster type comes directly from self.cluster_type
        - API token is fetched securely via decode_passwords()
        """
        method = "POST" if data else "GET"

        # --- Logging ---
        if _AITKContainer_logging:
            debug_message = f"{method} endpoint [{url}] called"
            if data:
                debug_message += f" with payload ({len(data)} bytes)"
            _AITKContainer_logger.info(debug_message)

        returns = f"ERROR on {method} request to endpoint [{url}]"

        try:
            # --- Load cluster-specific config ---
            cluster_type = self.cluster_type  # direct access, no getattr()
            config_path = os.path.join(
                os.path.dirname(__file__), "..", "..", "local", "container_connections.conf"
            )
            settings = self._get_config(config_path)

            if not settings.has_section(cluster_type):
                raise Exception(
                    f"Missing configuration section for cluster type: {cluster_type}"
                )

            cluster_conf = settings[cluster_type]
            in_cluster_mode = cluster_conf.getboolean("in_cluster_mode", fallback=False)

            # Safely interpret endpoint_cert_check_hostname: missing or empty => False
            raw_check = cluster_conf.get("endpoint_cert_check_hostname", "").strip()
            check_hostname = raw_check.lower() in ("1", "true", "yes", "on")

            cert_path = cluster_conf.get("endpoint_cert_filename_or_path", "").strip()

            # --- Get API token securely from Splunk passwords.conf ---
            session_key = self.options.get("session_key")
            if not session_key:
                raise Exception("Missing session key for Splunk service connection")

            splunk_service = Service(
                token=session_key, app='Splunk_ML_Toolkit', owner='nobody', sharing='app'
            )
            secret_settings = {}
            decode_passwords(splunk_service, secret_settings)
            api_token = secret_settings.get("api_token")

            if not api_token:
                raise Exception("API token not found in Splunk passwords.conf")

            # --- Build HTTP request ---
            headers = {"Authorization": api_token}
            if data:
                headers["Content-Type"] = content_type

                request = urllib_request.Request(url, str.encode(data), headers)
            else:
                request = urllib_request.Request(url, None, headers)

            # --- SSL Context setup ---
            ssl_context = None
            parsed_url = urllib_parse.urlparse(url)

            if not in_cluster_mode:
                if cert_path:
                    try:
                        if os.path.isfile(cert_path):
                            _AITKContainer_logger.info(
                                f"Using certification file is : {cert_path}"
                            )
                            ssl_context = ssl.create_default_context(cafile=cert_path)
                        else:
                            _AITKContainer_logger.info(
                                f"Using certification path is : {cert_path}"
                            )
                            ssl_context = ssl.create_default_context(capath=cert_path)
                        ssl_context.check_hostname = check_hostname
                    except Exception as e:
                        _AITKContainer_logger.warning(
                            f"SSL context setup failed ({e}); using context with verification disabled"
                        )
                        ssl_context = ssl.create_default_context()
                        ssl_context.check_hostname = False
                        ssl_context.verify_mode = ssl.CERT_NONE
                else:
                    # No certificate - use context with verification disabled (DO NOT fetch certificate)
                    _AITKContainer_logger.info(
                        f"No certificate provided, using SSL context with verification disabled"
                    )
                    ssl_context = ssl.create_default_context()
                    ssl_context.check_hostname = False
                    ssl_context.verify_mode = ssl.CERT_NONE
                    _AITKContainer_logger.info(
                        f"SSL context configured (unverified) for {parsed_url.hostname}"
                    )
            else:
                ssl_context = None  # inside cluster: trust internal network

            # ssl_context = ssl._create_unverified_context()
            _AITKContainer_logger.info(f"The ssl context type is: {type(ssl_context)}")
            logger.debug(
                f"SSL context settings: minimum_version={getattr(ssl_context, 'minimum_version', 'not set')}, check_hostname={getattr(ssl_context, 'check_hostname', 'not set')}"
            )
            response = urllib_request.urlopen(request, context=ssl_context)
            if (
                hasattr(response, 'fp')
                and hasattr(response.fp, 'raw')
                and hasattr(response.fp.raw, '_sock')
            ):
                sock = response.fp.raw._sock
                if hasattr(sock, 'version'):
                    tls_version = sock.version()
                    _AITKContainer_logger.info(f"Connection established using: {tls_version}")
                    logger.debug(f"TLS version negotiated: {tls_version}")
            status = response.getcode()
            returns = response.read()

            if _AITKContainer_logging:
                _AITKContainer_logger.info(
                    f"{method} endpoint [{url}] returned {len(returns)} bytes with status {status}"
                )

        except Exception as e:
            if _AITKContainer_logging:
                _AITKContainer_logger.error(f"{method} endpoint [{url}] failed: {e}")
            else:
                raise

        return returns

    # ---------------------------------------------------------------------------
    # helper function to check and log status received from container result
    # Arguments :
    # - result  : json of result - should contain at least status and message
    def check_and_log_status(self, result, params=''):
        if "status" in result:
            if result["status"] == 'error':
                _AITKContainer_messages.error('AITKC error: {}'.format(result["message"]))
            else:
                _AITKContainer_messages.info(
                    'AITKC info: {} with parameters {}'.format(result["message"], params)
                )
        else:
            _AITKContainer_messages.error(
                'AITKC error unknown or invalid result: {}'.format(result)
            )
        return None

    # ---------------------------------------------------------------------------
    # function to fit the model
    # Arguments : (self for convenience)
    # - df      : pandas dataframe as received from splunk search pipeline
    # - options : options received from MLSPL (passthrough to container)

    def fit(self, df, options):
        self.log_algo_name(options)
        # Make a copy of data, to not alter original dataframe
        if _AITKContainer_logging:
            _AITKContainer_logger.info('fit started with options ' + str(options) + '')
        # memorize parameters
        parameters = {"options": options, "feature_variables": self.feature_variables}
        # data prep with helper functions
        if hasattr(self, 'target_variable'):
            relevant_variables = self.feature_variables + [self.target_variable]
            parameters["target_variables"] = [self.target_variable]
        else:
            relevant_variables = self.feature_variables

        data, _ = df_util.drop_unused_and_missing(df.copy(), relevant_variables)
        # create a data object containing all relevant data and parameters
        payload = {"data": data.to_csv(index=False), "meta": parameters}
        # call our container endpoint and pass data as a json dump
        url = self.endpoint_url + '/fit'
        result = self.endpoint(url, json.dumps(payload))
        try:
            result = json.loads(result)
        except Exception as e:
            error_message = (
                'unable to read JSON response from '
                + url
                + '. Either you have no MLTK Container running or you probably face a network or connection issue. Please investigate Splunk search.log or python logs for more details. Returned with exception ('
                + str(e)
                + ')'
            )
            _AITKContainer_logger.error(error_message)
            _AITKContainer_messages.error(error_message)
            return df

        self.check_and_log_status(result, options)
        # check for returned predictions and merge them from y_hat into output dataframe
        if "results" in result:
            results_df = pd.read_csv(StringIO(result["results"]))
            # merge original dataframe with our obtained y_hat predictions and rename
            if hasattr(self, 'target_variable'):
                default_name = 'predicted_%s' % self.target_variable
                output_name = options.get('output_name', default_name)
                results_df = results_df.rename(columns={results_df.columns[0]: output_name})
            else:
                default_name = 'predicted'
                output_name = options.get('output_name', default_name)
                results_df = results_df.add_prefix(output_name + '_')
            # check if unequal length: return only results_df, not a merged one
            if len(df) == len(results_df):
                output = df_util.merge_predictions(df, results_df)
            else:
                output = results_df
            if _AITKContainer_logging:
                _AITKContainer_logger.info('fit ended with options ' + str(options) + '')
            # return the merged output dataframe
            return output
        return df

    # TODO test for partial fit handling as usual fit as partial fit is handled in container
    def partial_fit(self, df, options):
        return self.fit(df, options)

    # ---------------------------------------------------------------------------
    # function to apply an existing model
    # Arguments : (self for convenience)
    # - df      : pandas dataframe as received from splunk search pipeline
    def apply(self, df, options=None):
        # Refresh options with the current invocation so the endpoint has a valid session key.
        if options is not None:
            self.options = options
        self.log_algo_name(options)
        # _AITKContainer_messages.error('options: {}'.format(options))
        if _AITKContainer_logging:
            _AITKContainer_logger.info('apply started with options ' + str(options) + '')
        parameters = {"options": options, "feature_variables": self.feature_variables}
        # get enpoint url from conf
        self.endpoint_url = self.get_endpoint_url(options)

        data, _ = df_util.drop_unused_and_missing(df.copy(), self.feature_variables)
        # create a data object containing all relevant data and parameters
        payload = {"data": data.to_csv(index=False), "meta": parameters}
        # call our container endpoint and pass data as a json dump
        url = self.endpoint_url + '/apply'
        result = self.endpoint(url, json.dumps(payload))
        try:
            result = json.loads(result)
        except Exception as e:
            error_message = (
                'unable to read JSON response from '
                + url
                + '. Probably a connection issue. Please investigate Splunk search.log or python logs for more details. Returned with exception ('
                + str(e)
                + ')'
            )
            _AITKContainer_logger.error(error_message)
            _AITKContainer_messages.error(error_message)
            return df

        # check for the status of our response and display info or error messages
        self.check_and_log_status(result, options)

        # check for returned predictions and merge them from y_hat into output dataframe
        if "results" in result:
            results_df = pd.read_csv(StringIO(result["results"]))
            # merge original dataframe with our obtained y_hat predictions and rename
            if hasattr(self, 'target_variable'):
                default_name = 'predicted_%s' % self.target_variable
                output_name = options.get('output_name', default_name)
                results_df = results_df.rename(columns={results_df.columns[0]: output_name})
            else:
                default_name = 'predicted'
                output_name = options.get('output_name', default_name)
                results_df = results_df.add_prefix(output_name + '_')
            # check if unequal length: return only results_df, not a merged one
            if len(df) == len(results_df):
                output = df_util.merge_predictions(df, results_df)
            else:
                output = results_df
            if _AITKContainer_logging:
                _AITKContainer_logger.info('apply ended with options ' + str(options) + '')
            # return the merged output dataframe
            return output

        if _AITKContainer_logging:
            _AITKContainer_logger.error('apply ended with options ' + str(options) + '')
        # return unaltered dataframe in case of errors
        return df

    # ---------------------------------------------------------------------------
    # helper function to merge prediction with original dataframe (uses by fit and apply)
    # Arguments : (self for convenience)
    # - df      : pandas dataframe as received from splunk search pipeline
    # - options : options (passthrough)
    # - X       : features
    # - Y       : target (y_hat predictions received from either fit or apply)

    def merge_apply(self, df, options, X, Y):
        # TODO check for redundant calling/operations when called from apply function
        X, nans, columns = df_util.prepare_features(X, self.feature_variables)
        default_name = 'predicted({})'.format(self.target_variable)
        output_name = options.get('output_name', default_name)
        output = df_util.create_output_dataframe(
            y_hat=Y.values,
            nans=nans,
            output_names=output_name,
        )
        output = df_util.merge_predictions(df, output)
        return output

    # ---------------------------------------------------------------------------
    # function to create a model summary
    # Arguments : (self for convenience)
    # - options : options (passthrough)

    def summary(self, options):
        self.log_algo_name(options)
        # _AITKContainer_messages.info('Summary bob: {}'.format(options))
        if 'args' in options:
            raise RuntimeError('Summarization does not take values other than parameters')
        # start pessimistic and prepare an empty summary dataframe
        df = pd.DataFrame(data={"summary": ["no summary"]})
        # override with existing model name
        if options["model_name"]:
            df["name"] = options["model_name"]
        # get enpoint url from conf
        self.endpoint_url = self.get_endpoint_url(options)
        # call our container endpoint and pass data as a json dump
        url = self.endpoint_url + '/summary'
        result = self.endpoint(url)
        # result = self.endpoint(url, json.dumps(payload))
        try:
            result = json.loads(result)
            df["summary"] = json.dumps(result)
            df["api_url_external"] = self._get_external_hostname_from_config(
                options["model_name"]
            )

        except Exception as e:
            error_message = (
                'unable to read JSON response from '
                + url
                + '. Probably a connection issue. Please investigate Splunk search.log or python logs for more details. Returned with exception ('
                + str(e)
                + ')'
            )
            _AITKContainer_logger.error(error_message)
            _AITKContainer_messages.error(error_message)
            return df
        if _AITKContainer_logging:
            _AITKContainer_logger.info('summary ended with options ' + str(options) + '')
        # return the summary dataframe
        return df

    # register codecs for this algo in AITKC (MLTK-Container) namespace
    @staticmethod
    def register_codecs():
        from codec.codecs import SimpleObjectCodec

        codecs_manager.add_codec('AITKC.AITKContainer', 'AITKContainer', SimpleObjectCodec)
