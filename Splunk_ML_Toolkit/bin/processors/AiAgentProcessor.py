import uuid
import cexc
import itertools
import re
import pandas as pd
import uuid
import random
import string
import httpx
import json
import hashlib
import base64
import asyncio
import time
import os
import pydantic
from datetime import datetime
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from .BaseProcessor import BaseProcessor
from util.telemetry_agent_util import log_agent_action_details, Timer
from agent_manager.common_utils import get_total_tools_count
from util.ai_commander_util import get_scs_api_base_url, get_cached_scs_token
from util.rest_url_util import make_splunk_url
from util.rest_proxy import rest_proxy_from_searchinfo
from typing import Optional, Dict, List, Any
from ai_commander.constants import PAYLOAD, AGENT_BUILDER_FEATURE_FLAG, AGENT_INTEGRATION_CONFIG
from ai_commander.feature_flags import read_feature_flag
from hec.event import EventData, RunHistoryEvent
from util.mlspl_loader import MLSPLConf

logger = cexc.get_logger(__name__)


class AiAgentProcessor(BaseProcessor):
    def __init__(self, process_options: dict, searchinfo: dict) -> None:
        """
        Initializes the AiAgentProcessor with the given process options and search information.

        Args:
            process_options (dict):
                Options related to processing, including parameters.
                Expected parameters:
                - agent_name: Name of the agent to use
                - prompt: The prompt template for the agent
                - agent_config: Pre-retrieved agent configuration
                - mcp_configs: Pre-retrieved MCP configurations
                - kb_configs: Pre-retrieved knowledge base configurations
                - llm_config: Pre-retrieved LLM configuration
            searchinfo (dict):
                Information about the search context.
        """
        super().__init__(process_options, searchinfo)
        self.searchinfo = searchinfo
        self.search_id = searchinfo.get("sid")
        self.process_options = process_options
        self.session_key = searchinfo.get("session_key")
        is_feature_enabled = read_feature_flag(searchinfo, AGENT_BUILDER_FEATURE_FLAG)
        if not is_feature_enabled:
            raise RuntimeError(
                f"The feature Agent Builder is not enabled. Please contact your administrator."
            )

        # Get agent configuration
        self.agent_name = self.process_options.get('params', {}).get('agent_name')
        if not self.agent_name:
            raise RuntimeError("agent_name parameter is required")

        self.prompt_template = self.process_options.get('params', {}).get('prompt', '')
        if not self.prompt_template:
            raise RuntimeError("prompt parameter is required")

        # Get pre-retrieved configuration details from process_options
        self.agent_config = self.process_options.get('agent_config')
        if not self.agent_config:
            raise RuntimeError("agent_config not provided in process_options")

        self.mcp_configs = self.process_options.get('mcp_configs')
        if not self.mcp_configs:
            raise RuntimeError("mcp_configs not provided in process_options")

        self.kb_configs = self.process_options.get('kb_configs')
        if not self.kb_configs:
            raise RuntimeError("kb_configs not provided in process_options")

        self.llm_config = self.process_options.get('llm_config')
        if not self.llm_config:
            raise RuntimeError("llm_config not provided in process_options")

        self.scs_token = None
        self.scs_token_expiry = None
        self.total_processed_rows = 0

        self.rest_proxy = rest_proxy_from_searchinfo(self.searchinfo)

        mlspl = MLSPLConf(searchinfo)
        agent_integration_config = mlspl.get_stanza(AGENT_INTEGRATION_CONFIG)
        self.max_retries = int(agent_integration_config.get('max_retries', 3))
        self.retry_backoff_factor = int(agent_integration_config.get('backoff_factor', 4))

        logger.info(
            f"AiAgentProcessor initialized with pre-retrieved configs for agent: {self.agent_name}"
        )

    def _generate_session_id(self) -> str:
        u = uuid.uuid4()
        base = u.hex
        extra = random.choice(string.ascii_letters + string.digits + "-_")
        return base + extra

    def _encrypt_payload(self, payload: dict, scs_token: str, salt: str) -> str:
        """
        Encrypts the payload using the SCS token as the encryption key.

        Args:
            payload (dict): The payload to encrypt
            scs_token (str): The SCS token to use as encryption key
            salt (str): The salt to use for key derivation

        Returns:
            str: Base64 encoded encrypted payload

        Raises:
            RuntimeError: If encryption fails
        """
        try:
            # Convert payload to JSON string
            payload_json = json.dumps(payload)
            payload_bytes = payload_json.encode('utf-8')

            # Create a key from the SCS token using PBKDF2 with provided salt
            salt_bytes = salt.encode('utf-8')
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt_bytes,
                iterations=100000,
            )
            key = base64.urlsafe_b64encode(kdf.derive(scs_token.encode('utf-8')))

            # Create Fernet cipher
            cipher = Fernet(key)

            # Encrypt the payload
            encrypted_payload = cipher.encrypt(payload_bytes)

            # Return base64 encoded encrypted payload
            encrypted_b64 = base64.b64encode(encrypted_payload).decode('utf-8')

            logger.debug(
                f"Successfully encrypted payload of size {len(payload_json)} bytes with salt: {salt[:8]}..."
            )
            return encrypted_b64

        except Exception as e:
            logger.error(f"Failed to encrypt payload: {str(e)}")
            raise RuntimeError(f"Payload encryption failed: {str(e)}")

    def validate_params(self, prompt: str) -> List[str]:
        """
        Validates that all placeholders in the prompt exist as columns in the dataframe.

        Args:
            prompt (str):
                The prompt string containing placeholders.

        Returns:
            list:
                A list of placeholder names.

        Raises:
            ValueError: If any placeholder does not exist in the dataframe columns.
        """
        # Extract placeholders using regex to handle all formats like {col1}, {col1}-{col2}, etc.
        placeholders = re.findall(r"{(.*?)}", prompt)

        # Check for missing columns
        missing_columns = [col for col in placeholders if col not in self.df.columns]
        if missing_columns:
            raise ValueError(f"Missing columns in CSV: {missing_columns}")

        return placeholders

    def _push_event(self, event: RunHistoryEvent) -> None:
        """Push event to index via receivers/simple endpoint."""
        event_operations_url = (
            make_splunk_url(
                self.rest_proxy, namespace="app", extra_url_parts=["mltk", "hec_operations"]
            )
            + "?output_mode=json"
        )

        event_payload = {"events": [event.model_dump()]}

        try:
            with Timer() as timed:
                response = self.rest_proxy.make_rest_call(
                    method="PUT", url=event_operations_url, jsonargs=json.dumps(event_payload)
                )

            logger.debug(
                f"Time taken to push event for type: {event.event.type}: {timed.interval if 'timed' in locals() else -1}"
            )

            if not response.get("status", 500) in [200, 201]:
                if response.get("status", 207):
                    logger.debug("Partial results pushed to index.")
                else:
                    logger.error("Problem in pushing event to index.")
                    raise Exception(
                        f"Could not push events to index: {response.get('content', {})}"
                    )
        except Exception as e:
            logger.error(f"Error pushing event to index: {str(e)}, suppressing the error.")

    def substitute_values(self, template: str, row: dict) -> str:
        """
        Substitutes values into the given template based on row data.

        Args:
            template (str):
                The template string with placeholders.
            row (dict):
                The row data to be used for substitution.

        Returns:
            str:
                The formatted string.
        """
        return template.format(**row)

    async def call_agent_async(
        self,
        request_id: str,
        session_id: str,
        prompt: str,
    ) -> str:
        """
        Asynchronous version of call_agent method for parallel processing.
        """
        scs_url = get_scs_api_base_url(self.searchinfo) + '/agent/aws_agentcore/invoke'

        (
            scs_token,
            scs_token_expiry,
        ) = get_cached_scs_token(self.scs_token, self.scs_token_expiry, self.searchinfo)
        self.scs_token_expiry = scs_token_expiry
        self.scs_token = scs_token
        headers = {
            "Authorization": f"Bearer {self.scs_token}",
            "Content-Type": "application/json",
            "request_id": request_id,
            "Connection": "Keep-Alive",
            "Keep-Alive": "timeout=1000, max=1",
        }
        payload = {
            'system_prompt': self.agent_config.get('details')
            .get('versions', [])[0]
            .get('system_prompt', ''),
            'task_prompt': prompt,
            'session_id': session_id,
            'runtime_id': self.agent_config.get('details', {})
            .get('versions', [])[0]
            .get('runtime_params', {})
            .get('runtime_id'),
            'version': self.agent_config.get('details', {})
            .get('versions', [])[0]
            .get('runtime_params', {})
            .get('version'),
            'agent_timeout': int(
                self.agent_config.get('details', {})
                .get('versions', [])[0]
                .get('agent_timeout', 300)
            ),
        }

        # Merge all configuration dictionaries into the payload
        payload.update(self.mcp_configs)
        payload.update(self.kb_configs)
        payload.update(self.llm_config)

        # Encrypt the payload using SCS token and request_id as salt
        try:
            encrypted_payload = self._encrypt_payload(payload, self.scs_token, request_id)
            final_payload = {PAYLOAD: encrypted_payload}
        except Exception as e:
            logger.error(f"Failed to encrypt payload: {str(e)}")
            raise RuntimeError(f"Payload encryption failed: {str(e)}")

        for attempt in range(self.max_retries + 1):
            should_retry = False
            try:
                async with httpx.AsyncClient(timeout=1000) as client:
                    async with client.stream(
                        'POST', scs_url, headers=headers, json=final_payload
                    ) as response:
                        status = response.status_code
                        if status == 429:
                            # Rate limit exceeded - retry with exponential backoff
                            if attempt < self.max_retries:
                                wait_time = self.retry_backoff_factor**attempt
                                logger.warning(
                                    f"Rate limit exceeded (429). Retrying in {wait_time}s "
                                    f"(attempt {attempt + 1}/{self.max_retries + 1})"
                                )
                                await asyncio.sleep(wait_time)
                                should_retry = True
                                continue
                            else:
                                # Max retries exceeded
                                error_data = await response.aread()
                                try:
                                    error_json = json.loads(error_data)
                                    error_message = error_json.get(
                                        'error_message', 'Rate limit exceeded'
                                    )
                                except:
                                    error_message = 'Rate limit exceeded after max retries'
                                raise RuntimeError(error_message)

                        if status != 200:
                            # Read error response
                            error_data = await response.aread()
                            try:
                                error_json = json.loads(error_data)
                                error_message = error_json.get(
                                    'error_message', 'Internal Server Error'
                                )
                            except:
                                error_message = f'Internal Server Error (Status: {status})'
                            raise RuntimeError(error_message)

                        response.raise_for_status()

                        # Process streaming response
                        final_response = None
                        async for line in response.aiter_lines():
                            if not line.strip():
                                continue

                            try:
                                chunk_data = json.loads(line)
                                chunk_status = chunk_data.get('status', '').lower()

                                if chunk_status == 'thinking':
                                    # Ignore thinking status chunks
                                    logger.debug(f"Agent thinking... (session: {session_id})")
                                    continue
                                elif chunk_status == 'completed':
                                    # Capture final response
                                    is_success = chunk_data.get('success', False)
                                    if not is_success:
                                        error_message = chunk_data.get(
                                            'error_message', 'Agent reported failure'
                                        )
                                        raise RuntimeError(
                                            f"Agent failed to complete: {error_message}"
                                        )
                                    final_response = chunk_data.get('response')
                                    break
                            except json.JSONDecodeError as je:
                                logger.warning(f"Failed to parse chunk: {line}, error: {je}")
                                continue

                        if final_response is None:
                            raise RuntimeError("No completed response received from agent")
                        return final_response
            except Exception as e:
                # If it's the last attempt, raise the error
                if attempt >= self.max_retries or not should_retry:
                    logger.error(f"Failed to get agent status from SCS async: {str(e)}")
                    raise RuntimeError(f"Failure occured during calling agent async: {str(e)}")
                # Otherwise, continue to next retry iteration

    async def _process_row_async(
        self, index: int, row: pd.Series, prompt_template: str
    ) -> tuple:
        """
        Process a single row asynchronously.

        Args:
            index: Row index
            row: Row data
            prompt_template: Template to substitute values into

        Returns:
            tuple: (index, result, substituted_prompt, request_id, session_id, processing_time)
        """
        request_id = str(uuid.uuid4())
        session_id = self._generate_session_id()

        # Substitute values in prompt template
        substituted_prompt = self.substitute_values(prompt_template, row)

        try:
            run_start_time = str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
            history_event = EventData(
                request_id=request_id,
                session_id=session_id,
                search_id=self.search_id,
                agent_name=self.agent_name,
                runtime_id=self.agent_config.get('details', {})
                .get('versions', [])[0]
                .get('runtime_params', {})
                .get('runtime_id'),
                version=self.agent_config.get('details', {})
                .get('versions', [])[0]
                .get('runtime_params', {})
                .get('version'),
                prompt=substituted_prompt,
                trigger="adhoc search",
                response=None,
                type="run_started",
                processing_time=None,
                row_index=index,
                run_start_time=run_start_time,
                update_time=run_start_time,
            )

            logger.info("History initialized properly.")

            hec_event = RunHistoryEvent(time=time.time(), event=history_event.model_dump())

            self._push_event(hec_event)

        except pydantic.ValidationError as ve:
            logger.warning(
                f"Pydantic validation error encountered during pushing events to index, so suppressing the error: {str(ve)}"
            )

        except Exception as e:
            logger.error(f"Error pushing event to index: {str(e)}, suppressing the error.")

        try:
            with Timer() as timed:
                # Call the agent asynchronously
                result = await self.call_agent_async(request_id, session_id, substituted_prompt)

            if result is None or len(result) == 0:
                raise Exception("Got Empty Response from Agent.")

            log_agent_action_details(
                request_id,
                "invoke",
                self.agent_name,
                get_total_tools_count(
                    self.agent_config.get('details', {}).get('versions', [])[0]
                ),
                "success",
                time_processing=timed.interval,
            )

        except Exception as e:
            logger.error(
                f"command=aiagent, session_id={session_id}, agent={self.agent_name},"
                f" processing_time={timed.interval if 'timed' in locals() else 0}, is_success=0,"
                f" error_message={str(e)}"
            )

            try:
                hec_event.time = time.time()
                hec_event.event.processing_time = timed.interval
                hec_event.event.type = "run_failure"
                hec_event.event.update_time = str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

                self._push_event(hec_event)

            except Exception as e:
                logger.error(f"Error pushing event to index: {str(e)}, suppressing the error.")

            log_agent_action_details(
                request_id,
                "invoke",
                self.agent_name,
                get_total_tools_count(
                    self.agent_config.get('details', {}).get('versions', [])[0]
                ),
                "failure",
            )

            raise RuntimeError(f"Failed to process row {index}: {str(e)}")

        try:
            hec_event.time = time.time()
            hec_event.event.response = result
            hec_event.event.processing_time = timed.interval
            hec_event.event.type = "run_finished"
            hec_event.event.update_time = str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

            self._push_event(hec_event)

        except Exception as e:
            logger.error(f"Error pushing event to index: {str(e)}, suppressing the error.")

        return (index, result, substituted_prompt, request_id, session_id, timed.interval)

    async def _process_all_rows_async_with_progress(self, prompt_template: str) -> tuple:
        """
        Process all rows asynchronously.

        Args:
            prompt_template: Template to substitute values into

        Returns:
            tuple: (results, substituted_prompts) in original order
        """
        # Create tasks for all rows
        tasks = []
        for index, row in self.df.iterrows():
            task = self._process_row_async(index, row, prompt_template)
            tasks.append(task)

        # Wait for all tasks to complete
        completed_tasks = await asyncio.gather(*tasks, return_exceptions=True)

        # Sort results by original index to maintain order
        results = []
        substituted_prompts = []

        for task_result in completed_tasks:
            if isinstance(task_result, Exception):
                raise task_result

            (
                index,
                result,
                substituted_prompt,
                request_id,
                session_id,
                processing_time,
            ) = task_result
            results.append((index, result, substituted_prompt))

        # Sort by index to maintain original order
        results.sort(key=lambda x: x[0])

        # Extract results and prompts in order
        ordered_results = [result for _, result, _ in results]
        ordered_prompts = [prompt for _, _, prompt in results]

        return ordered_results, ordered_prompts

    async def _process_all_rows_async(self, prompt_template: str) -> tuple:
        """
        Process all rows asynchronously and maintain order.

        Args:
            prompt_template: Template to substitute values into

        Returns:
            tuple: (results, substituted_prompts) in original order
        """
        # Create tasks for all rows
        tasks = []
        for index, row in self.df.iterrows():
            task = self._process_row_async(index, row, prompt_template)
            tasks.append(task)

        # Wait for all tasks to complete
        completed_tasks = await asyncio.gather(*tasks, return_exceptions=True)

        # Sort results by original index to maintain order
        results = []
        substituted_prompts = []

        for task_result in completed_tasks:
            if isinstance(task_result, Exception):
                raise task_result

            (
                index,
                result,
                substituted_prompt,
                request_id,
                session_id,
                processing_time,
            ) = task_result
            results.append((index, result, substituted_prompt))

        # Sort by index to maintain original order
        results.sort(key=lambda x: x[0])

        # Extract results and prompts in order
        ordered_results = [result for _, result, _ in results]
        ordered_prompts = [prompt for _, _, prompt in results]

        return ordered_results, ordered_prompts

    def process(self) -> None:
        """
        Processes the AI agent request by formatting the prompt and calling the agent.

        This method:
        1. Validates the prompt template placeholders
        2. Creates async tasks for each row in the dataframe
        3. Processes all rows concurrently while maintaining order
        4. Substitutes values into the prompt template
        5. Calls the agent with the configured MCPs and knowledge bases
        6. Stores the results in a new column in the correct order
        """
        prompt_template = self.prompt_template.replace('"', '')

        # Validate prompt template placeholders
        placeholders = self.validate_params(prompt_template)

        def _generate_unique_column_name(base_name: str) -> str:
            """
            Generates a unique column name to avoid conflicts.

            Args:
                base_name (str):
                    The base name for the column.

            Returns:
                str:
                    A unique column name.
            """
            i = 1
            while f"{base_name}_{i}" in self.df.columns:
                i += 1
            return f"{base_name}_{i}"

        column_name = _generate_unique_column_name("result")
        self.df[column_name] = None

        # Add agent_name column if it doesn't exist
        if 'agent_name' not in self.df.columns:
            self.df['agent_name'] = self.agent_name
        # Initialize prompt column to store substituted prompts for each row
        if 'prompt' not in self.df.columns:
            self.df['prompt'] = None

        with Timer() as timer:
            # Run async processing with progress reporting
            try:
                # Use the new method with progress reporting
                results, substituted_prompts = asyncio.run(
                    self._process_all_rows_async_with_progress(prompt_template)
                )
                # Store results in the dataframe in correct order
                self.df.loc[: len(results) - 1, column_name] = results

                # Populate agent_name for all rows and substituted prompts for each row
                self.df['agent_name'] = self.agent_name
                self.df.loc[: len(substituted_prompts) - 1, 'prompt'] = substituted_prompts

                self.total_processed_rows = len(results)

            except Exception as e:
                logger.error(f"Failed to process rows asynchronously: {str(e)}")
                raise RuntimeError(f"Failed to process agent requests: {str(e)}")

        logger.info(
            f"Successfully processed {self.total_processed_rows} rows with agent '{self.agent_name}' using async processing"
        )

    def get_output(self):
        """
        Return the output dataframe, potentially with streaming support.

        Returns:
            (dataframe): output dataframe
        """
        if self.df is None:
            self.df = pd.DataFrame()
        return self.df

    def get_relevant_fields(self) -> List[str]:
        """
        Returns a list of relevant fields for processing.

        Returns:
            list:
                List of field names relevant to the agent processing.
        """
        # Return agent-specific relevant fields
        fields = ['agent_name', 'prompt']

        # Add placeholder fields from the prompt template
        try:
            placeholders = re.findall(r"{(.*?)}", self.prompt_template)
            fields.extend(placeholders)
        except Exception as e:
            logger.warning(f"Could not extract placeholders from prompt: {e}")

        return fields
