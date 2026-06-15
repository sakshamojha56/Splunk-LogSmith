"""
Utility class for reading and updating CTSM configuration in mlspl.conf
"""

import cexc
from cdtsm_pkg.constants import (
    CDTSM_ANOMALY_BY_POSTPROCESS_MAX_WORKERS_DEFAULT,
    CDTSM_ANOMALY_BY_POSTPROCESS_MAX_WORKERS_KEY,
    CDTSM_API_MAX_CONCURRENCY_DEFAULT,
    CDTSM_API_MAX_CONCURRENCY_KEY,
    CDTSM_API_RATE_LIMIT_PER_MINUTE_DEFAULT,
    CDTSM_API_RATE_LIMIT_PER_MINUTE_KEY,
    CTSM_STANZA,
    CTSM_OPT_OUT_KEY,
    CTSM_ACKNOWLEDGE_KEY,
    CTSM_REPAIR_TIMESERIES_DEFAULT,
    CTSM_REPAIR_TIMESERIES_KEY,
    SELF_HOSTED_CDTSM_ENDPOINT_KEY,
    SELF_HOSTED_CDTSM_TIMEOUT_KEY,
    SELF_HOSTED_CDTSM_MODEL_KEY,
    SELF_HOSTED_CDTSM_DEFAULT_TIMEOUT,
    SELF_HOSTED_CDTSM_DEFAULT_MODEL,
)
from .conf_loader import RestLoadingStrategy
from .mlspl_loader import MLSPLConf

logger = cexc.get_logger(__name__)


class CTSMConfUtil(RestLoadingStrategy):
    """Utility class for reading and updating CTSM settings in mlspl.conf."""

    def __init__(self, searchinfo):
        """Initialize the CTSM conf utility.

        Args:
            searchinfo (dict): Search info containing session key and other details
        """
        super().__init__(conf_name='mlspl', searchinfo=searchinfo)
        self.searchinfo = searchinfo

    def get_ctsm_opt_out(self) -> bool:
        """Read the ctsm_opt_out value from mlspl.conf.

        Returns:
            bool: True if opted out, False otherwise
        """
        try:
            mlspl_conf = MLSPLConf(self.searchinfo)
            ctsm_opt_out_value = mlspl_conf.get_mlspl_prop(
                CTSM_OPT_OUT_KEY, CTSM_STANZA, default='false'
            )
            # Normalize the value to boolean
            is_opted_out = str(ctsm_opt_out_value).lower() in ('true', '1', 'yes', 'on')
            logger.debug(
                f"CTSM opt-out value: {ctsm_opt_out_value}, normalized: {is_opted_out}"
            )
            return is_opted_out
        except Exception as e:
            logger.error(f"Error reading ctsm_opt_out: {str(e)}")
            raise

    def get_ctsm_acknowledge(self) -> bool:
        """Read the ctsm_acknowledge value from mlspl.conf.

        Returns:
            bool: True if acknowledged, False otherwise
        """
        try:
            mlspl_conf = MLSPLConf(self.searchinfo)
            ctsm_acknowledge_value = mlspl_conf.get_mlspl_prop(
                CTSM_ACKNOWLEDGE_KEY, CTSM_STANZA, default='false'
            )
            # Normalize the value to boolean
            is_acknowledged = str(ctsm_acknowledge_value).lower() in ('true', '1', 'yes', 'on')
            logger.debug(
                f"CTSM acknowledge value: {ctsm_acknowledge_value}, normalized: {is_acknowledged}"
            )
            return is_acknowledged
        except Exception as e:
            logger.error(f"Error reading ctsm_acknowledge: {str(e)}")
            raise

    def get_repair_timeseries(self) -> bool:
        """Read the repair_timeseries value from mlspl.conf.

        Returns:
            bool: True if time series repair is enabled, False otherwise (default is True when unset)
        """
        try:
            mlspl_conf = MLSPLConf(self.searchinfo)
            repair_timeseries_value = mlspl_conf.get_mlspl_prop(
                CTSM_REPAIR_TIMESERIES_KEY, CTSM_STANZA, default=CTSM_REPAIR_TIMESERIES_DEFAULT
            )
            # Normalize the value to boolean
            is_repair_enabled = str(repair_timeseries_value).lower() in (
                'true',
                '1',
                'yes',
                'on',
            )
            logger.debug(
                f"CTSM repair_timeseries value: {repair_timeseries_value}, normalized: {is_repair_enabled}"
            )
            return is_repair_enabled
        except Exception as e:
            logger.error(f"Error reading repair_timeseries: {str(e)}")
            raise

    def update_ctsm_opt_out(self, value: bool) -> bool:
        """Update the ctsm_opt_out value in mlspl.conf.

        Args:
            value (bool): The new value for ctsm_opt_out

        Returns:
            bool: True if update was successful, False otherwise
        """
        try:
            # Build the URL for updating the mlspl.conf stanza
            url = '{uri}/{namespace}/nobody/{app}/configs/conf-{conf_name}/{stanza}'.format(
                uri=self.proxy.splunkd_uri,
                namespace=self.proxy.name_space_str,
                app=self.proxy.splunk_app,
                conf_name=self.conf_name,
                stanza=CTSM_STANZA,
            )

            # Convert boolean to string for conf file
            value_str = 'true' if value else 'false'

            # Make the POST request to update the conf file
            postargs = {CTSM_OPT_OUT_KEY: value_str}

            resp = self.proxy.make_rest_call(method='POST', url=url, postargs=postargs)
            if resp:
                return True
            else:
                logger.error("Failed to update ctsm_opt_out - no response")
                return False

        except Exception as e:
            logger.error(f"Error updating ctsm_opt_out: {str(e)}")
            raise

    def update_ctsm_acknowledge(self, value: bool) -> bool:
        """Update the ctsm_acknowledge value in mlspl.conf.

        Args:
            value (bool): The new value for ctsm_acknowledge

        Returns:
            bool: True if update was successful, False otherwise
        """
        try:
            # Build the URL for updating the mlspl.conf stanza
            url = '{uri}/{namespace}/nobody/{app}/configs/conf-{conf_name}/{stanza}'.format(
                uri=self.proxy.splunkd_uri,
                namespace=self.proxy.name_space_str,
                app=self.proxy.splunk_app,
                conf_name=self.conf_name,
                stanza=CTSM_STANZA,
            )

            # Convert boolean to string for conf file
            value_str = 'true' if value else 'false'

            # Make the POST request to update the conf file
            postargs = {CTSM_ACKNOWLEDGE_KEY: value_str}

            resp = self.proxy.make_rest_call(method='POST', url=url, postargs=postargs)
            if resp:
                return True
            else:
                logger.error("Failed to update ctsm_acknowledge - no response")
                return False

        except Exception as e:
            logger.error(f"Error updating ctsm_acknowledge: {str(e)}")
            raise

    def get_self_hosted_cdtsm_params(self) -> dict:
        """Read all self-hosted CDTSM settings from mlspl.conf [CTSM] in a single REST call.

        Returns:
            dict: ``{"endpoint": str, "model": str, "timeout": float}``
                  endpoint is empty string when not configured;
                  model defaults to ``"CDTSM"``; timeout defaults to ``300.0``.
        """
        try:
            mlspl_conf = MLSPLConf(self.searchinfo)

            endpoint = str(
                mlspl_conf.get_mlspl_prop(
                    SELF_HOSTED_CDTSM_ENDPOINT_KEY, CTSM_STANZA, default=''
                )
                or ''
            ).strip()

            model = (
                str(
                    mlspl_conf.get_mlspl_prop(
                        SELF_HOSTED_CDTSM_MODEL_KEY,
                        CTSM_STANZA,
                        default=SELF_HOSTED_CDTSM_DEFAULT_MODEL,
                    )
                    or SELF_HOSTED_CDTSM_DEFAULT_MODEL
                ).strip()
                or SELF_HOSTED_CDTSM_DEFAULT_MODEL
            )

            try:
                timeout = float(
                    mlspl_conf.get_mlspl_prop(
                        SELF_HOSTED_CDTSM_TIMEOUT_KEY,
                        CTSM_STANZA,
                        default=str(SELF_HOSTED_CDTSM_DEFAULT_TIMEOUT),
                    )
                )
            except (TypeError, ValueError):
                timeout = SELF_HOSTED_CDTSM_DEFAULT_TIMEOUT

            return {"endpoint": endpoint, "model": model, "timeout": timeout}
        except Exception as e:
            logger.error("Error reading self-hosted CDTSM params: %s", str(e))
            raise

    def get_cdtsm_api_throttle_params(self) -> dict:
        """Read client-side throttle settings from mlspl.conf [CTSM].

        Returns:
            dict: ``{"rate_limit_per_minute": float, "max_concurrency": int}``
                  using the constants defaults when the keys are absent or
                  unparseable. Both values are clamped to be strictly
                  positive; non-positive overrides fall back to defaults.
        """
        try:
            mlspl_conf = MLSPLConf(self.searchinfo)

            try:
                rate_raw = mlspl_conf.get_mlspl_prop(
                    CDTSM_API_RATE_LIMIT_PER_MINUTE_KEY,
                    CTSM_STANZA,
                    default=str(CDTSM_API_RATE_LIMIT_PER_MINUTE_DEFAULT),
                )
                rate_limit_per_minute = float(rate_raw)
            except (TypeError, ValueError):
                rate_limit_per_minute = CDTSM_API_RATE_LIMIT_PER_MINUTE_DEFAULT
            if rate_limit_per_minute <= 0:
                rate_limit_per_minute = CDTSM_API_RATE_LIMIT_PER_MINUTE_DEFAULT

            try:
                conc_raw = mlspl_conf.get_mlspl_prop(
                    CDTSM_API_MAX_CONCURRENCY_KEY,
                    CTSM_STANZA,
                    default=str(CDTSM_API_MAX_CONCURRENCY_DEFAULT),
                )
                max_concurrency = int(float(conc_raw))
            except (TypeError, ValueError):
                max_concurrency = CDTSM_API_MAX_CONCURRENCY_DEFAULT
            if max_concurrency <= 0:
                max_concurrency = CDTSM_API_MAX_CONCURRENCY_DEFAULT

            return {
                "rate_limit_per_minute": rate_limit_per_minute,
                "max_concurrency": max_concurrency,
            }
        except Exception as e:
            logger.error("Error reading CDTSM API throttle params: %s", str(e))
            return {
                "rate_limit_per_minute": CDTSM_API_RATE_LIMIT_PER_MINUTE_DEFAULT,
                "max_concurrency": CDTSM_API_MAX_CONCURRENCY_DEFAULT,
            }

    def get_cdtsm_anomaly_by_postprocess_max_workers(self) -> int:
        """Read local anomaly BY post-API/postprocess worker count."""
        try:
            mlspl_conf = MLSPLConf(self.searchinfo)
            try:
                raw = mlspl_conf.get_mlspl_prop(
                    CDTSM_ANOMALY_BY_POSTPROCESS_MAX_WORKERS_KEY,
                    CTSM_STANZA,
                    default=str(CDTSM_ANOMALY_BY_POSTPROCESS_MAX_WORKERS_DEFAULT),
                )
                workers = int(float(raw))
            except (TypeError, ValueError):
                workers = CDTSM_ANOMALY_BY_POSTPROCESS_MAX_WORKERS_DEFAULT
            if workers <= 0:
                workers = CDTSM_ANOMALY_BY_POSTPROCESS_MAX_WORKERS_DEFAULT
            return workers
        except Exception as e:
            logger.error("Error reading CDTSM anomaly BY postprocess workers: %s", str(e))
            return CDTSM_ANOMALY_BY_POSTPROCESS_MAX_WORKERS_DEFAULT

    def update_ctsm_stanza_fields(self, fields: dict) -> bool:
        """Update multiple keys on [CTSM] in one REST POST."""
        if not fields:
            return True
        try:
            url = '{uri}/{namespace}/nobody/{app}/configs/conf-{conf_name}/{stanza}'.format(
                uri=self.proxy.splunkd_uri,
                namespace=self.proxy.name_space_str,
                app=self.proxy.splunk_app,
                conf_name=self.conf_name,
                stanza=CTSM_STANZA,
            )
            postargs = {k: '' if v is None else str(v) for k, v in fields.items()}
            resp = self.proxy.make_rest_call(method='POST', url=url, postargs=postargs)
            if resp:
                return True
            logger.error("Failed to update [CTSM] stanza — no response from splunkd")
            return False
        except Exception as e:
            logger.error("Error updating [CTSM] stanza: %s", str(e))
            return False
