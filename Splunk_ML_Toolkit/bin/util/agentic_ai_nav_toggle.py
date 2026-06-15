#!/usr/bin/env python

import os
import sys
import traceback
import re
from urllib.parse import urlparse

# Ensure ml-spl/bin is on sys.path so we can import cexc and util.*
BIN_ROOT = os.path.dirname(os.path.dirname(__file__))
if BIN_ROOT not in sys.path:
    sys.path.insert(0, BIN_ROOT)

from util.base_util import get_system_paths, SUPPORTED_SYSTEMS

sa_path, system = get_system_paths()

system_path = os.path.join(sa_path, 'bin', '%s' % (SUPPORTED_SYSTEMS[system]))

APP_NAME = f"Splunk_SA_Scientific_Python_{SUPPORTED_SYSTEMS[system]}"
SPLUNK_HOME = os.environ.get('SPLUNK_HOME', '/opt/splunk')
APP_PATH = os.path.join(SPLUNK_HOME, 'etc', 'apps', APP_NAME)
APP_LIB_PATH = os.path.join(APP_PATH, "lib")
sys.path.append(APP_LIB_PATH)

import cexc
from splunklib.client import connect
from splunklib.binding import handler, HTTPError
from ai_commander.feature_flags import read_feature_flag
from util.base_util import make_splunkhome_path

logger = cexc.get_logger(__name__)

# Use the MLTK app context for nav and REST
APP_NAME = "Splunk_ML_Toolkit"
NAV_DEFAULT_RELATIVE_PATH = [
    "etc",
    "apps",
    APP_NAME,
    "default",
    "data",
    "ui",
    "nav",
    "default.xml",
]
NAV_LOCAL_RELATIVE_PATH = ["etc", "apps", APP_NAME, "local", "data", "ui", "nav", "default.xml"]
AGENTIC_COLLECTION_LABEL = "Agents"
FEATURE_FLAG_NAME = "aitk_agent_builder_feature_enabled"
AGENTIC_COLLECTION_XML = f'''  <collection label="{AGENTIC_COLLECTION_LABEL}">
    <view name="agents"/>
    <view name="agent_run_history"/>
  </collection>'''


def _extract_nav_link(content: str, label: str) -> str:
    pattern = rf'<a\s+href="[^"]+"\s+target="_blank">{re.escape(label)}</a>'
    match = re.search(pattern, content)
    return match.group(0) if match else ""


def _sync_nav_links_with_default(target_content: str, default_content: str) -> str:
    labels_to_sync = ["Docs", "Video Tutorials"]

    for label in labels_to_sync:
        default_link = _extract_nav_link(default_content, label)
        if not default_link:
            continue

        target_link = _extract_nav_link(target_content, label)
        if target_link:
            target_content = target_content.replace(target_link, default_link)
        else:
            nav_end = target_content.rfind("</nav>")
            if nav_end != -1:
                target_content = (
                    target_content[:nav_end] + f"  {default_link}\n" + target_content[nav_end:]
                )

    return target_content


def _extract_standalone_views(content: str) -> list:
    """
    Extract only standalone views (not inside collections) from nav content.
    Returns list of view names.
    """
    # First, remove all collection blocks from content
    content_without_collections = re.sub(
        r'<collection\s+label="[^"]+">.*?</collection>', '', content, flags=re.DOTALL
    )
    # Now extract views from the remaining content (these are standalone views)
    return re.findall(r'<view\s+name="([^"]+)"\s*/>', content_without_collections)


def _extract_collection_views(content: str) -> set:
    """Extract view names that appear inside collection blocks."""
    collection_blocks = re.findall(
        r'<collection\s+label="[^"]+">.*?</collection>', content, flags=re.DOTALL
    )
    collection_views = set()

    for collection_block in collection_blocks:
        collection_views.update(re.findall(r'<view\s+name="([^"]+)"\s*/>', collection_block))

    return collection_views


def _extract_extra_items_from_local(local_content: str, default_content: str) -> list:
    """Extract items from local nav that are not present in default nav."""
    extra_items = []

    # Extract only standalone views (not inside collections)
    local_views = _extract_standalone_views(local_content)
    default_views = set(_extract_standalone_views(default_content))
    default_views.update(_extract_collection_views(default_content))

    for view in local_views:
        if view not in default_views:
            extra_items.append(f'  <view name="{view}"/>')
            logger.debug("Found extra standalone view in local: %s", view)

    # Extract all collections from local (excluding Agents which we handle separately)
    local_collections = re.findall(
        r'(<collection\s+label="([^"]+)">\s*.*?\s*</collection>)', local_content, re.DOTALL
    )
    default_collections = re.findall(r'<collection\s+label="([^"]+)">', default_content)

    # Labels to exclude: current "Agents" and old "Agentic AI" (renamed)
    excluded_labels = {AGENTIC_COLLECTION_LABEL, "Agentic AI"}

    for collection_xml, label in local_collections:
        if label not in default_collections and label not in excluded_labels:
            extra_items.append(collection_xml)
            logger.debug("Found extra collection in local: %s", label)

    return extra_items


def _cleanup_duplicate_standalone_views(content: str) -> str:
    """
    Remove any duplicate standalone views from nav content.
    Removes standalone views that duplicate other standalone views or collection views.
    """
    collection_views = _extract_collection_views(content)

    # First, extract and temporarily replace all collection blocks with placeholders
    collections = []

    def save_collection(match):
        collections.append(match.group(0))
        return f'__COLLECTION_PLACEHOLDER_{len(collections) - 1}__'

    content_with_placeholders = re.sub(
        r'<collection\s+label="[^"]+">.*?</collection>',
        save_collection,
        content,
        flags=re.DOTALL,
    )

    # Track views already represented in collections so stray standalone copies are removed.
    seen_views = set(collection_views)
    original_content = content_with_placeholders

    def replace_duplicate_view(match):
        view_name = match.group(2)
        if view_name in seen_views:
            # This is a duplicate, remove it (including leading whitespace)
            return ''
        seen_views.add(view_name)
        return match.group(0)

    # Replace duplicates - keep first occurrence, remove subsequent ones
    content_with_placeholders = re.sub(
        r'(\s*)<view\s+name="([^"]+)"\s*/>',
        replace_duplicate_view,
        content_with_placeholders,
    )

    if content_with_placeholders != original_content:
        logger.debug("Cleaned up duplicate standalone views from nav content")

    # Restore collection blocks
    for i, collection in enumerate(collections):
        content_with_placeholders = content_with_placeholders.replace(
            f'__COLLECTION_PLACEHOLDER_{i}__', collection
        )

    return content_with_placeholders


def _update_nav_file(
    nav_path: str, enabled: bool, default_nav_path: str, use_local: bool
) -> bool:
    """
    Update nav file by:
    1. Starting from default nav as the base (source of truth)
    2. If local exists, preserving any extra items from local that aren't in default
    3. Applying Agents collection toggle based on feature flag
    4. Writing result to the appropriate path (local if exists, otherwise default)
    """
    if not default_nav_path or not os.path.isfile(default_nav_path):
        logger.error("Default nav file not found at %s; cannot proceed", default_nav_path)
        return False

    try:
        # Step 1: Read default nav as the base (source of truth)
        with open(default_nav_path, 'r', encoding='utf-8') as f:
            content = f.read()
        logger.debug("Using default nav file as base: %s", default_nav_path)

        # Step 2: If local exists, clean up any duplicate standalone agent views
        # and extract any extra items not in default
        extra_items = []
        if use_local and os.path.isfile(nav_path):
            with open(nav_path, 'r', encoding='utf-8') as f:
                local_content = f.read()
            # Clean up any duplicate standalone views from previous bug
            local_content = _cleanup_duplicate_standalone_views(local_content)
            extra_items = _extract_extra_items_from_local(local_content, content)
            if extra_items:
                logger.debug("Found %d extra items in local nav to preserve", len(extra_items))

        # Step 3: Apply Agents collection toggle based on feature flag
        agentic_collection_start = content.find(
            f'<collection label="{AGENTIC_COLLECTION_LABEL}">'
        )

        if enabled and agentic_collection_start == -1:
            # Add Agents collection after Models collection
            models_collection_end = content.find(
                '</collection>', content.find('<collection label="Models">')
            )
            if models_collection_end != -1:
                insert_pos = models_collection_end + len('</collection>')
                content = (
                    content[:insert_pos] + '\n' + AGENTIC_COLLECTION_XML + content[insert_pos:]
                )
                logger.debug("Added Agents collection after Models collection")
            else:
                # Fallback: add after experiments view
                experiments_pattern = '<view name="experiments"/>'
                experiments_pos = content.find(experiments_pattern)
                if experiments_pos != -1:
                    insert_pos = experiments_pos + len(experiments_pattern)
                    content = (
                        content[:insert_pos]
                        + '\n'
                        + AGENTIC_COLLECTION_XML
                        + content[insert_pos:]
                    )
                    logger.debug("Added Agents collection after experiments")
                else:
                    # Final fallback: add before closing </nav> tag
                    nav_end = content.rfind('</nav>')
                    if nav_end != -1:
                        content = (
                            content[:nav_end]
                            + AGENTIC_COLLECTION_XML
                            + '\n'
                            + content[nav_end:]
                        )
                        logger.debug("Added Agents collection at end of nav")
                    else:
                        logger.error("Could not find insertion point in nav file")
                        return False

        elif not enabled and agentic_collection_start != -1:
            # Remove the Agents collection from default content
            agentic_collection_end = content.find(
                '</collection>', agentic_collection_start
            ) + len('</collection>')
            content = content[:agentic_collection_start] + content[agentic_collection_end:]
            logger.debug("Removed Agents collection (feature flag disabled)")

        # Step 4: Add any extra items from local before </nav>
        if extra_items:
            nav_end = content.rfind('</nav>')
            if nav_end != -1:
                extra_content = '\n'.join(extra_items)
                content = content[:nav_end] + extra_content + '\n' + content[nav_end:]
                logger.debug("Added %d extra items from local nav", len(extra_items))

        # Step 5: Check if file needs to be updated
        current_content = ""
        if os.path.isfile(nav_path):
            with open(nav_path, 'r', encoding='utf-8') as f:
                current_content = f.read()

        if current_content == content:
            logger.debug("No changes required for nav file %s (enabled=%s)", nav_path, enabled)
            return False

        # Step 6: Write the updated content to the nav file
        with open(nav_path, 'w', encoding='utf-8') as f:
            f.write(content)
        logger.debug("Updated nav file at %s", nav_path)

        return True

    except Exception as e:
        logger.error("Failed to update nav file %s: %s", nav_path, str(e))
        logger.debug("Full error: %s", traceback.format_exc())
        return False


def _post_nav_to_splunk(session_key: str, nav_path: str, splunkd_uri: str) -> None:
    try:
        parsed = urlparse(splunkd_uri)
        logger.debug("Parsed splunkd URI: %s", parsed)
        scheme = parsed.scheme or "https"
        logger.debug("Scheme: %s", scheme)
        host = parsed.hostname or "127.0.0.1"
        logger.debug("Host: %s", host)
        port = parsed.port or 8089
        logger.debug("Port: %s", port)

        with open(nav_path, "r", encoding="utf-8") as f:
            nav_xml = f.read()

        service = connect(
            token=session_key,
            handler=handler(timeout=30),
            host=host,
            port=port,
            scheme=scheme,
            app=APP_NAME,
            owner="nobody",
            retries=2,
        )

        logger.debug(
            "Posting updated nav XML to Splunk REST endpoint (host=%s, port=%s, scheme=%s)",
            host,
            port,
            scheme,
        )

        try:
            # Prefer updating existing entity if it exists
            response = service.post("data/ui/nav/default", **{"eai:data": nav_xml})
            logger.debug("Nav POST response: %s", response)
        except HTTPError as http_err:
            if http_err.status == 404:
                # Entity does not exist yet; create it via the collection
                logger.debug(
                    "Nav entity 'default' not found, creating via data/ui/nav (name=default)"
                )
                response = service.post(
                    "data/ui/nav",
                    name="default",
                    **{"eai:data": nav_xml},
                )
            else:
                raise

        status = getattr(response, "status", None) or getattr(
            getattr(response, "response", None), "status", None
        )
        if status is not None:
            logger.debug("Nav POST completed with HTTP status %s", status)
        else:
            logger.debug("Nav POST completed; response object type=%s", type(response))
    except Exception:
        logger.error("Failed to POST nav XML to Splunk: %s", traceback.format_exc())


def main():
    try:
        # For scripted inputs with passAuth, Splunk writes the session key as the first line on stdin
        session_key = sys.stdin.readline().strip()
        if not session_key:
            logger.error("No session key received on stdin; cannot call Splunk REST API")
            return

        service = connect(token=session_key, app=APP_NAME, owner="nobody")
        splunkd_uri = f"{service.scheme}://{service.host}:{service.port}"
        logger.debug("Effective splunkd URI: %s", splunkd_uri)

        searchinfo = {
            "splunkd_uri": splunkd_uri,
            "session_key": session_key,
            "app": APP_NAME,
            "username": "splunk-system-user",
        }

        flag_enabled = read_feature_flag(searchinfo, FEATURE_FLAG_NAME)
        logger.debug(
            "Agentic AI feature flag '%s' evaluated to: %s",
            FEATURE_FLAG_NAME,
            flag_enabled,
        )

        # Check if local nav directory exists (not just the file)
        nav_local_path = make_splunkhome_path(NAV_LOCAL_RELATIVE_PATH)
        nav_default_path = make_splunkhome_path(NAV_DEFAULT_RELATIVE_PATH)
        nav_local_dir = os.path.dirname(nav_local_path)

        logger.debug("Default nav file path: %s", nav_default_path)
        logger.debug("Local nav directory: %s", nav_local_dir)

        # If local directory exists, use local (takes precedence in Splunk)
        # Otherwise, use default
        if os.path.isdir(nav_local_dir):
            logger.debug("Local nav directory exists, will write to local: %s", nav_local_path)
            nav_path = nav_local_path
            use_local = True
        else:
            logger.debug(
                "Local nav directory does not exist, will write to default: %s",
                nav_default_path,
            )
            nav_path = nav_default_path
            use_local = False

        # Update nav: start from default, preserve local extras if applicable, apply feature flag
        changed = _update_nav_file(nav_path, flag_enabled, nav_default_path, use_local)

        if changed:
            _post_nav_to_splunk(session_key, nav_path, splunkd_uri)
    except Exception:
        logger.error("Error while toggling Agentic AI nav: %s", traceback.format_exc())


if __name__ == "__main__":
    main()
