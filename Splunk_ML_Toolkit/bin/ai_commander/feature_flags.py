import cexc
from util.mlspl_loader import MLSPLConf

logger = cexc.get_logger(__name__)


def read_feature_flag(searchinfo, flag_name: str) -> bool:
    flags_conf = MLSPLConf(searchinfo)
    logger.debug("The flags conf is: {}".format(flags_conf))
    flag_value = flags_conf.get_mlspl_prop(flag_name.lower(), "slim_feature_flags")
    logger.debug("The flag conf returned is: {}".format(flag_value))
    return str(flag_value).lower() in ("true", "1", "yes", "on")
