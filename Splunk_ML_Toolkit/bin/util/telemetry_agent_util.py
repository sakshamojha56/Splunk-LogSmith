import uuid
import cexc
from util.error_util import safe_func
import time

logger = cexc.get_logger(__name__)


@safe_func
def log_uuid():
    logger.debug("UUID=%s" % str(uuid.uuid4()))


@safe_func
def log_agent_action_details(
    uuid: str,
    action: str,
    agent_name: str,
    n_tools: int,
    execution_status: str,
    time_processing: float = 0.0,
):
    logger.debug(
        "UUID=%s, command=aiagent, trigger=SPL, action=%s, agent_name=%s, n_tools=%d, execution_status=%s, time_processing=%f"
        % (uuid, action, agent_name, n_tools, execution_status, time_processing)
    )


@safe_func
def log_ai_command_details(
    uuid: str,
    provider: str,
    model: str,
    execution_status: str,
    input_token: int = 0,
    output_token: int = 0,
    total_token: int = 0,
    error_type: str = "",
    time_processing: float = 0.0,
    trigger: str = "ai",
    auth_type: str = "",
):
    logger.debug(
        "UUID=%s, trigger=%s, provider=%s, model=%s, input_token=%d, output_token=%d, total_token=%d, error_type=%s, execution_status=%s, time_processing=%f, auth_type=%s"
        % (
            uuid,
            trigger,
            provider,
            model,
            input_token,
            output_token,
            total_token,
            error_type,
            execution_status,
            time_processing,
            auth_type,
        )
    )


class Timer(object):
    def __enter__(self):
        self.start = time.time()
        return self

    def __exit__(self, *args):
        self.end = time.time()
        self.interval = self.end - self.start
