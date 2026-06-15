import json
import traceback
import sys
import boto3
from typing import Dict, List


def get_boto3_security_keys(
    aws_region_name: str,
    aws_access_key_id: str,
    aws_secret_access_key: str,
    aws_role_name: str,
    aws_session_name: str,
) -> Dict[str, str]:
    """
    Generates temporary security credentials using AWS STS (Security Token Service).

    Args:
        aws_region_name (str): AWS region name.
        aws_access_key_id (str): AWS access key ID.
        aws_secret_access_key (str): AWS secret access key.
        aws_role_name (str): AWS IAM role ARN to assume.
        aws_session_name (str): Name for the AWS session.

    Returns:
        Dict[str, str]: Dictionary containing AWS security keys and session token.
    """

    test_session = boto3.Session(aws_access_key_id, aws_secret_access_key)
    sts = test_session.client("sts", region_name=aws_region_name)
    response = sts.assume_role(RoleArn=aws_role_name, RoleSessionName=aws_session_name)
    new_aws_access_key_id = response['Credentials']['AccessKeyId']
    new_aws_secret_access_key = response['Credentials']['SecretAccessKey']
    aws_session_token = response['Credentials']['SessionToken']

    aws_keys = {
        "aws_access_key_id": new_aws_access_key_id,
        "aws_secret_access_key": new_aws_secret_access_key,
        "aws_session_token": aws_session_token,
        "region_name": aws_region_name,
    }

    return aws_keys


def get_models_from_aws_bedrock(data: Dict) -> List[Dict]:
    """
    Fetches available foundation models and inference profiles from AWS Bedrock.

    Args:
        data (Dict): Configuration data containing AWS credentials and region details.

    Returns:
        List[Dict]: List of available AWS Bedrock foundation models and inference profiles.
    """
    aws_region_name = data["Bedrock"]["region"]["value"]
    aws_access_key_id = data["Bedrock"]["aws_access_key_id"]["value"]
    aws_secret_access_key = data["Bedrock"]["aws_access_token"]["value"]
    aws_role_name = data["Bedrock"]["role_arn"]["value"]
    aws_session_name = "splunk-ai-commander-session-name"
    aws_keys = get_boto3_security_keys(
        aws_region_name,
        aws_access_key_id,
        aws_secret_access_key,
        aws_role_name,
        aws_session_name,
    )
    bedrock_client = boto3.client('bedrock', **aws_keys)
    models = []
    try:
        # Get foundation models
        response = bedrock_client.list_foundation_models(byOutputModality='TEXT')
        models = response["modelSummaries"]

        # Get inference profiles
        try:
            inference_response = bedrock_client.list_inference_profiles()
            inference_profiles = inference_response.get("inferenceProfileSummaries", [])

            # Transform inference profiles to match foundation model structure
            for profile in inference_profiles:
                profile_model = {
                    "modelId": profile.get("inferenceProfileId"),
                    "modelName": profile.get("inferenceProfileName"),
                    "providerName": (
                        profile.get("models", [{}])[0].get("modelArn", "").split(":")[3]
                        if profile.get("models")
                        else "bedrock"
                    ),
                    "inputModalities": ["TEXT"],
                    "outputModalities": ["TEXT"],
                    "responseStreamingSupported": True,
                    "customizationsSupported": [],
                    "inferenceTypesSupported": ["ON_DEMAND"],
                }
                models.append(profile_model)
        except Exception as inference_error:
            # If inference profiles are not available or accessible, continue with foundation models only
            print(f"Warning: Could not fetch inference profiles: {inference_error}")
    except Exception as e:
        print(f"Error fetching Bedrock models: {e}")

    return models


def update_aws_bedrock_config(data: str) -> Dict:
    """
    Updates AWS Bedrock model configuration.

    Args:
        data (str): JSON string containing the current configuration.

    Returns:
        Dict: Updated configuration data.
    """
    try:
        data = json.loads(data)

        openai_section = data.get("OpenAI", {}).get("models", {})
        gpt_4o_mini_settings = openai_section.get("gpt-4o-mini", {})

        if "Bedrock" not in data:
            data["Bedrock"] = {}

        if "models" not in data["Bedrock"]:
            data["Bedrock"]["models"] = {}

        models = get_models_from_aws_bedrock(data)
        new_model_names = {model.get("modelId") for model in models if model.get("modelId")}

        existing_models = data["Bedrock"]["models"]
        models_to_remove = set(existing_models.keys()) - new_model_names
        for model_name in models_to_remove:
            del existing_models[model_name]

        for model_name in new_model_names:
            if model_name not in existing_models:
                existing_models[model_name] = gpt_4o_mini_settings.copy()

        return data

    except Exception as e:
        return dict()


def litellm_connection_check(data: str) -> Dict[str, str]:
    """
    Test LiteLLM connection by making a simple API call.
    Supports all LiteLLM compatible providers with special handling for bedrock and AzureOpenAI.

    Args:
        data (str): JSON string containing LiteLLM configuration.

    Returns:
        Dict[str, str]: Dictionary containing connection test results.
    """
    try:

        import os

        ssl_cert_file = os.environ.get("SSL_CERT_FILE")
        if ssl_cert_file and not os.path.exists(ssl_cert_file):
            os.environ.pop("SSL_CERT_FILE")

        import litellm

        litellm.drop_params = True

        config = json.loads(data)
        model = config.get("model", "")
        provider = config.get("provider", "").lower()
        nested_config = config.get("config", {})

        api_key = nested_config.get("api_key", "")
        api_base = nested_config.get("endpoint", "")
        api_version = nested_config.get("api_version", "")

        # Extract max_tokens, temperature, and reasoning_effort from config
        # Similar to how llm_base.py handles these parameters
        max_tokens = nested_config.get("max_tokens", 100)
        temperature = nested_config.get("temperature", 0.1)
        reasoning_effort = nested_config.get("reasoning_effort", "NONE")

        if not model:
            return {
                "status": "error",
                "message": "Model name is required for LiteLLM connection test.",
            }

        # Prepare extra_params for reasoning_effort (similar to litellm_post in llm_base.py)
        extra_params = {}
        if reasoning_effort != "NONE":
            extra_params["reasoning_effort"] = reasoning_effort.lower()

        # Prepare payload for completion call
        payload = {
            "api_base": api_base.rstrip("/") if api_base else None,
            "api_key": api_key,
            "model": provider.lower() + "/" + config.get("model", ""),
            "messages": [
                {
                    "role": "user",
                    "content": "Hello, this is a connection test. Please respond with 'Connection successful'.",
                }
            ],
            "max_tokens": int(max_tokens),
            "temperature": float(temperature),
        }

        # Handle bedrock connections with AWS credentials
        if provider == "bedrock":
            payload.pop("api_base", None)
            payload.pop("api_key", None)
            try:
                # Extract AWS credentials from nested config for bedrock
                aws_keys = {
                    "aws_region_name": nested_config.get("region", ""),
                    "aws_access_key_id": nested_config.get("access_key_id", ""),
                    "aws_secret_access_key": nested_config.get("secret_key", ""),
                    "aws_role_name": nested_config.get("role_arn", ""),
                    "aws_session_name": "splunk-ai-commander-session-name",
                }

                # Validate required AWS credentials
                if not all(
                    [
                        aws_keys["aws_region_name"],
                        aws_keys["aws_access_key_id"],
                        aws_keys["aws_secret_access_key"],
                    ]
                ):
                    return {
                        "status": "error",
                        "message": "Missing required AWS credentials for bedrock connection (region, access_key_id, secret_key).",
                    }

                # Get temporary security credentials if role is provided
                payload.update(
                    {
                        "aws_region_name": aws_keys["aws_region_name"],
                        "aws_access_key_id": aws_keys["aws_access_key_id"],
                        "aws_secret_access_key": aws_keys["aws_secret_access_key"],
                        "aws_role_name": aws_keys["aws_role_name"],
                        "aws_session_name": aws_keys["aws_session_name"],
                    }
                )

            except Exception as aws_error:
                return {
                    "status": "error",
                    "message": f"Bedrock AWS credential setup failed: {str(aws_error)}",
                }
        elif provider == "openai":
            payload["api_base"] = api_base.rstrip("/chat/completions") if api_base else None
            payload["model"] = provider.lower() + "/" + config.get("model", "")
        elif provider == "azureopenai":  # AzureOpenAI connection
            payload["model"] = provider.lower()[:5] + "/" + config.get("model", "")
            payload["api_version"] = api_version

        elif provider == "ollama":
            # Ollama doesn't require api_key
            payload.pop("api_key", None)
            payload["model"] = provider.lower() + "/" + config.get("model", "")
        else:  # Other providers (OpenAI, Anthropic, etc.)
            # Generic handling for other providers
            payload["model"] = provider.lower() + "/" + config.get("model", "")

        # Test connection with payload and extra_params (reasoning_effort)
        # Similar to litellm_post in llm_base.py
        response = litellm.completion(**payload, **extra_params)

        if response and response.choices:
            return {
                "status": "success",
                "message": f"Successfully connected to {provider} with model {model}.",
                "response_content": response.choices[0].message.content.strip(),
            }
        else:
            return {"status": "error", "message": "Invalid response from LiteLLM."}

    except ImportError:
        return {
            "status": "error",
            "message": "LiteLLM library not available. Install with: pip install litellm",
        }
    except Exception as e:
        return {"status": "error", "message": f"LiteLLM connection failed: {str(e)}"}


if __name__ == "__main__":
    # Call the function and print the result
    try:
        if len(sys.argv) < 2:
            print(json.dumps({"status": "error", "message": "Function name required"}))
        elif sys.argv[1] == "update_aws_bedrock_config":
            result = json.dumps(update_aws_bedrock_config(*sys.argv[2:]))
            print(result)
        elif sys.argv[1] == "litellm_connection_check":
            result = json.dumps(litellm_connection_check(*sys.argv[2:]))
            print(result)
        else:
            print(
                json.dumps({"status": "error", "message": f"Unknown function: {sys.argv[1]}"})
            )
    except:
        print(str(traceback.format_exc()))
