from typing import Optional, Literal
from pydantic import BaseModel, Field, field_validator
from run_history.search_utils import DefaultSearchConfig


class EventData(BaseModel):
    """
    Nested event data for AI agent run history.

    This model represents the actual event details for an agent execution run.
    """

    request_id: str = Field(..., description="Unique identifier for the agent request")

    session_id: str = Field(
        ..., description="Session identifier for the agent execution context"
    )

    agent_name: str = Field(..., description="Name of the AI agent being executed")

    runtime_id: Optional[str] = Field(
        None, description="Runtime identifier for the agent execution environment"
    )

    search_id: str = Field(None, description="Search ID associated with the agent run")

    version: Optional[int] = Field(None, description="Version of the agent configuration")

    prompt: str = Field(..., description="Prompt template or user input provided to the agent")

    trigger: str = Field(
        default="adhoc search",
        description="Trigger type for the agent execution (e.g., 'adhoc search', 'scheduled', 'api')",
    )

    response: Optional[str] = Field(
        default=None, description="Agent's response output. Empty for run_started events."
    )

    type: Literal["run_started", "run_finished", "run_failed"] = Field(
        ..., description="Event type indicating the stage of agent execution"
    )

    processing_time: Optional[str] = Field(
        default=None,
        description="Time taken for processing in seconds. Empty for run_started events.",
    )

    row_index: int = Field(
        ..., ge=0, description="Index of the row being processed in batch operations"
    )

    run_start_time: str = Field(..., description="Timestamp when the agent run started")

    update_time: Optional[str] = Field(
        None,
        description="Timestamp when this event was last updated (or inserted since indexes are immutable)",
    )

    @field_validator('processing_time')
    @classmethod
    def validate_processing_time(cls, v: str) -> str:
        """Validate processing_time is either empty or a valid numeric string."""
        if v and v != "":
            try:
                float(v)
            except ValueError:
                raise ValueError("processing_time must be a valid numeric string or empty")
        return v


class RunHistoryEvent(BaseModel):
    """
    Pydantic model for AI agent run history events sent to Splunk HEC.

    This model represents the complete event structure including metadata
    and event data for tracking AI agent execution history.

    Example:
        ```python
        event = RunHistoryEvent(
            time=time.time(),
            sourcetype="ai_agent:response",
            source="aiagent_processor",
            event=EventData(
                request_id="req-123",
                session_id="sess-456",
                sid="search-789",
                agent_name="my_agent",
                prompt="What is the weather?",
                type="run_started",
                row_index=0,
                run_start_time=time.time(),
                update_time=time.time()
            )
        )
        ```
    """

    time: float = Field(..., description="Unix timestamp when the event occurred")

    sourcetype: str = Field(
        default=DefaultSearchConfig.SOURCETYPE,
        description="Splunk sourcetype for indexing and parsing",
    )

    source: str = Field(
        default=DefaultSearchConfig.SOURCE, description="Source identifier for the event origin"
    )

    event: EventData = Field(
        ..., description="Nested event data containing agent execution details"
    )

    @field_validator('time')
    @classmethod
    def validate_time(cls, v: float) -> float:
        """Validate that time is a positive Unix timestamp."""
        if v <= 0:
            raise ValueError("time must be a positive Unix timestamp")
        return v
