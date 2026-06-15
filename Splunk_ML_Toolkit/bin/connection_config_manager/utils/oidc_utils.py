import json
import urllib.request
import urllib.parse
import cexc

logger = cexc.get_logger(__name__)


def exchange_oidc_token(auth_connection_details: dict, timeout: int = 10) -> str:
    """
    Exchange OIDC client credentials for an access token.
    """
    token_url = auth_connection_details.get("token_url", "")
    client_id = auth_connection_details.get("client_id", "")
    client_secret = auth_connection_details.get("client_secret", "")

    if not token_url or not client_id or not client_secret:
        raise ValueError(
            "OIDC auth_connection_details must include 'token_url', "
            "'client_id', and 'client_secret'."
        )

    form_data = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
    }
    scope = auth_connection_details.get("scope")
    if scope:
        form_data["scope"] = scope

    encoded_body = urllib.parse.urlencode(form_data).encode("utf-8")

    req = urllib.request.Request(
        token_url,
        data=encoded_body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = ""
        try:
            error_body = e.read().decode("utf-8")
        except Exception:
            pass
        logger.error(
            f"OIDC token exchange failed: HTTP {e.code} from {token_url}. "
            f"Response: {error_body}"
        )
        raise RuntimeError(f"OIDC token exchange failed (HTTP {e.code}): {error_body}")
    except Exception as e:
        logger.error(f"OIDC token exchange request error: {e}")
        raise RuntimeError(f"OIDC token exchange failed: {e}")

    access_token = body.get("access_token")
    if not access_token:
        raise RuntimeError(
            f"OIDC token response missing 'access_token'. "
            f"Response keys: {list(body.keys())}"
        )

    logger.info("OIDC token exchange succeeded for client_id='%s'.", client_id)
    return access_token
