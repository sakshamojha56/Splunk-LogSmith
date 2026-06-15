import cexc
from ai_commander.chat_models_check import is_hosted_llm_available
from util.searchinfo_util import searchinfo_from_request

logger = cexc.get_logger(__name__)


class MltkFeatureFlags(object):
    @classmethod
    def handle_get(cls, request: dict, path_parts: list) -> dict:
        try:
            searchinfo = searchinfo_from_request(request)
            flag_value = is_hosted_llm_available(searchinfo)
            return {
                'payload': {
                    'features': {'mltk_hosted_llm': flag_value},
                    'status': 'success',
                },
                'status': 200,
            }

        except Exception as e:
            logger.error(f"Error checking hosted LLM availability: {str(e)}")
            return {
                'payload': {'message': "Failed to check hosted LLM availability"},
                'status': 500,
            }
