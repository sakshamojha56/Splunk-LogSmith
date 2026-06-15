import abc
import json

import cexc
from .btool_proxy import BtoolProxy
from .searchinfo_util import (
    get_user_and_roles_from_searchinfo,
    should_use_btool,
    validate_searchinfo_for_btool,
)

logger = cexc.get_logger(__name__)

from .conf_loader import RestLoadingStrategy


class ContainerConf(object):
    """Utility class for loading and retrieving values from mlspl.conf."""

    def __init__(self, searchinfo, conf_name):
        if should_use_btool(searchinfo):
            is_valid, err = validate_searchinfo_for_btool(searchinfo)
            if is_valid:
                self.strategy = ContainerBtoolLoadingStrategy(searchinfo, conf_name)
            else:
                raise RuntimeError('Failed to load mlspl.conf on remote Splunk: %s' % err)
        else:
            self.strategy = ContainerRestLoadingStrategy(searchinfo, conf_name)

        self.stanza_mapping = self.strategy.load_stanza_mapping()

    def get_stanza(self, stanza):
        """
        Get a specific stanza. Will fall back to live REST call if not already loaded.
        """
        if stanza in self.stanza_mapping:
            logger.debug("Returning stanza [{}] from cached mapping".format(stanza))
            return self.stanza_mapping[stanza]

        # fetch it fresh from REST
        logger.debug("Fetching stanza [{}] live from REST".format(stanza))
        fresh_mapping = self.strategy.load_stanza_mapping(stanza_name=stanza)
        if fresh_mapping and stanza in fresh_mapping:
            # update cache
            self.stanza_mapping.update(fresh_mapping)
            return fresh_mapping[stanza]

        logger.debug("Stanza [{}] not found.".format(stanza))
        return None

    def get_container_prop(self, name, stanza='default', default=None):
        """Utility to retrieve a specify property."""
        default_stanza = self.stanza_mapping.get('default')
        default_prop_value = default_stanza.get(name, default)
        if stanza == 'default':
            return default_prop_value

        other_stanza = self.stanza_mapping.get(stanza, default_stanza)
        return other_stanza.get(name, default_prop_value)


class ContainerConfLoadingStrategy(object, metaclass=abc.ABCMeta):
    """Abstract class (patterned after algo_loader) to ensure the presence
    of the load_stanza_mapping method."""

    def load_stanza_mapping(self):
        """Should return a dictionary of stanza to attribute mappings."""
        raise NotImplementedError


class ContainerRestLoadingStrategy(ContainerConfLoadingStrategy):
    """Strategy for loading the conf from REST endpoint."""

    def __init__(self, searchinfo, conf_name):
        self.conf_loader = RestLoadingStrategy(conf_name=conf_name, searchinfo=searchinfo)

    def load_stanza_mapping(self, stanza_name=None):
        response = self.conf_loader.load_container_conf(stanza_name)
        content = json.loads(response['content'])

        stanza_mapping = {}

        if 'entry' not in content:
            return stanza_mapping

        for stanza in content['entry']:
            stanza_mapping[stanza['name']] = {
                key: value
                for key, value in stanza['content'].items()
                if not key.startswith("eai:") and key != "disabled"
            }

        return stanza_mapping


class ContainerBtoolLoadingStrategy(ContainerConfLoadingStrategy):
    """Strategy for loading the conf from btool utility."""

    def __init__(self, searchinfo, conf_name):
        self.conf_name = conf_name
        self.proxy = BtoolProxy(
            users_and_roles=get_user_and_roles_from_searchinfo(searchinfo=searchinfo),
            app=searchinfo['app'],
            # bundle_path is optional
            target_dir=searchinfo.get('bundle_path'),
        )

    def load_stanza_mapping(self):
        logger.debug('Loading mlspl.conf via btool.')
        return self.proxy.get_container_stanza_mapping(self.conf_name)
