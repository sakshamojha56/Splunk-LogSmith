#!/usr/bin/env python

from pandas import DataFrame
from sklearn.ensemble import RandomForestClassifier as _RandomForestClassifier

from base import ClassifierMixin, BaseAlgo
from codec import codecs_manager
from util.param_util import convert_params
from util.algo_util import handle_max_features
import cexc

logger = cexc.get_logger(__name__)
messages = cexc.get_messages_logger()


class RandomForestClassifier(ClassifierMixin, BaseAlgo):
    def __init__(self, options):
        self.handle_options(options)

        out_params = convert_params(
            options.get('params', {}),
            ints=[
                'random_state',
                'n_estimators',
                'max_depth',
                'min_samples_split',
                'max_leaf_nodes',
            ],
            strs=['max_features', 'criterion', 'class_weight'],
        )

        if 'max_depth' not in out_params:
            out_params.setdefault('max_leaf_nodes', 2000)

        if 'max_features' in out_params:
            out_params['max_features'] = handle_max_features(out_params['max_features'])

        if 'class_weight' in out_params:
            out_params['class_weight'] = self.handle_class_weight(out_params['class_weight'])
        else:
            out_params['class_weight'] = None
        logger.debug("RandomForestClassifier params: %s", str(out_params))
        self.estimator = _RandomForestClassifier(**out_params)

    def handle_class_weight(self, class_weight):

        class_weight_lower = class_weight.strip().lower()

        if class_weight_lower in ["none", "null", "false"]:
            return None
        elif class_weight_lower in ["balanced", "balanced_subsample"]:
            return class_weight_lower
        else:
            weight_dict = {}
            logger.info("Parsing class_weight string: %s", class_weight)
            for class_pair in class_weight.split(","):
                try:
                    key, value = class_pair.split(":")
                    key = key.strip()
                    value = float(value.strip())
                    weight_dict[key] = value
                except Exception as e:
                    raise ValueError(
                        "Invalid class_weight format. Expected format: 'class1:weight1,class2:weight2,...'. or a value amongst balanced, balanced_subsample, None. Error: %s"
                        % str(e)
                    )
            return weight_dict

    def summary(self, options):
        if len(options) != 2:  # only model name and mlspl_limits
            raise RuntimeError(
                '"%s" models do not take options for summarization' % self.__class__.__name__
            )
        df = DataFrame(
            {'feature': self.columns, 'importance': self.estimator.feature_importances_.ravel()}
        )
        return df

    @staticmethod
    def register_codecs():
        from codec.codecs import SimpleObjectCodec, TreeCodec

        codecs_manager.add_codec(
            'algos.RandomForestClassifier', 'RandomForestClassifier', SimpleObjectCodec
        )
        codecs_manager.add_codec(
            'sklearn.ensemble._forest', 'RandomForestClassifier', SimpleObjectCodec
        )
        codecs_manager.add_codec(
            'sklearn.tree._classes', 'DecisionTreeClassifier', SimpleObjectCodec
        )
        codecs_manager.add_codec('sklearn.tree._tree', 'Tree', TreeCodec)
