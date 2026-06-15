import cexc
from ai_commander.feature_flags import (
    read_feature_flag,
)
from util.searchinfo_util import searchinfo_from_request

logger = cexc.get_logger(__name__)


class AgentFeatureFlag(object):
    @classmethod
    def handle_get(cls, request: dict, path_parts: list) -> dict:
        try:
            searchinfo = searchinfo_from_request(request)
            flag_value = read_feature_flag(searchinfo, "aitk_agent_builder_feature_enabled")
            return {
                'payload': {
                    'features': {'mltk_hosted_llm': flag_value},
                    'status': 'success',
                },
                'status': 200,
            }

        except Exception as e:
            logger.error(f"Error reading feature flag: {str(e)}")
            return {
                'payload': {'message': "Failed to read feature flag"},
                'status': 500,
            }
