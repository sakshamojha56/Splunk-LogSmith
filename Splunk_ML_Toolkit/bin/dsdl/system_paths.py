"""
Shared system path constants for DSDL modules.

This module centralizes the system path setup code that was previously
duplicated across multiple files in the dsdl folder.
"""

import os
import sys
import cexc

from util.base_util import get_system_paths, SUPPORTED_SYSTEMS, get_app_version, PSC_PATH_PREFIX

logger = cexc.get_logger(__name__)

# Get system paths
sa_path, system = get_system_paths()

system_path = os.path.join(sa_path, 'bin', '%s' % (SUPPORTED_SYSTEMS[system]))

APP_NAME = f"Splunk_SA_Scientific_Python_{SUPPORTED_SYSTEMS[system]}"
SPLUNK_HOME = os.environ.get('SPLUNK_HOME', '/opt/splunk')
APP_PATH = os.path.join(SPLUNK_HOME, 'etc', 'apps', APP_NAME)

# Get app version dynamically
psc_folder = f"{PSC_PATH_PREFIX}{SUPPORTED_SYSTEMS[system]}"
app_version = get_app_version(psc_folder)
version_pattern = app_version.replace(".", "_").lower() if app_version else "4_2_4"

# App library paths
APP_LIB = os.path.join(APP_PATH, "lib")

# Windows uses 'Lib/site-packages' directly, Linux/macOS use 'lib/python3.13/site-packages'
if system[0] == 'Windows':
    APP_LIB_PATH = os.path.join(
        APP_PATH,
        "bin",
        SUPPORTED_SYSTEMS[system],
        version_pattern,
        "Lib",
        "site-packages",
    )
else:
    APP_LIB_PATH = os.path.join(
        APP_PATH,
        "bin",
        SUPPORTED_SYSTEMS[system],
        version_pattern,
        "lib",
        "python3.13",
        "site-packages",
    )


def setup_sys_path():
    """
    Add the required library paths to sys.path if not already present.
    Call this function to ensure all necessary paths are available for imports.
    Only adds paths that actually exist on the filesystem.

    Note: We append paths instead of inserting at position 0 to avoid conflicts
    with Splunk's built-in libraries (e.g., urllib3 v2 in PSC requires OpenSSL 1.1.1+
    but Splunk's Python uses OpenSSL 1.0.2). This way, Splunk's compatible versions
    are used for common libraries like requests/urllib3, while PSC provides
    additional modules like docker.
    """
    # Add APP_LIB (contains additional modules)
    if APP_LIB not in sys.path and os.path.exists(APP_LIB):
        sys.path.append(APP_LIB)
        logger.debug(f"Added APP_LIB to sys.path: {APP_LIB}")

    # Add APP_LIB_PATH (site-packages) if it exists
    if APP_LIB_PATH not in sys.path and os.path.exists(APP_LIB_PATH):
        sys.path.append(APP_LIB_PATH)
        logger.debug(f"Added APP_LIB_PATH to sys.path: {APP_LIB_PATH}")


# Set environment variable for cryptography compatibility
os.environ["CRYPTOGRAPHY_ALLOW_OPENSSL_102"] = "1"
