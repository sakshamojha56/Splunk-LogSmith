import json
import os
import subprocess
import sys
import stat
import traceback
import time
from util.base_util import (
    get_apps_path,
    get_mltk_pycache_path,
    get_system_paths,
    SUPPORTED_SYSTEMS,
    PSC_PATH_PREFIX,
    get_app_version,
)
from util import exec_anaconda_for_model_upload

import cexc

logger = cexc.get_logger(__name__)


def exec_anaconda_bouncer(script_path, params):
    """Re-execute the current Python script using the Anaconda Python
    interpreter included with Splunk_SA_Scientific_Python.

    After executing this function, you can safely import the Python
    libraries included in Splunk_SA_Scientific_Python (e.g. numpy).

    Canonical usage is to put the following at the *top* of your
    Python script (before any other imports):

       import exec_anaconda
       exec_anaconda.exec_anaconda()

       # Your other imports should now work.
       import numpy as np
       import pandas as pd
       ...
    """

    exec_anaconda_for_model_upload.check_python_version()

    sa_path, system = get_system_paths()

    system_path = os.path.join(sa_path, 'bin', '%s' % (SUPPORTED_SYSTEMS[system]))

    if system[0] == 'Windows':
        psc_folder = f"{PSC_PATH_PREFIX}{SUPPORTED_SYSTEMS[system]}"
        app_version = get_app_version(psc_folder)
        version_pattern = app_version.replace(".", "_").lower() if app_version else ""
        versioned_path = os.path.join(system_path, version_pattern)
        if os.path.exists(versioned_path):
            system_path = versioned_path
        python_path = os.path.join(system_path, 'python.exe')
        # MLA-564: Windows need the DLLs to be in the PATH
        dllpath = os.path.join(system_path, 'Library', 'bin')
        pathsep = os.pathsep if 'PATH' in os.environ else ''
        os.environ['PATH'] = os.environ.get('PATH', '') + pathsep + dllpath
    else:
        python_path = os.path.join(system_path, 'bin', 'python')

    logger.info(
        'python_path for exec_anaconda_bouncer is - {} and {}'.format(python_path, script_path)
    )

    # MLA-996: Unset PYTHONHOME
    # XXX: After migration to Python3 PYTHONPATH is not set anymore so this will
    # be unnecessary. SPL-170875
    os.environ.pop('PYTHONHOME', None)

    # Ensure that execute bit is set on <system_path>/bin/python
    if system[0] != 'Windows':
        mode = os.stat(python_path).st_mode
        os.chmod(python_path, mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)

    sys.stderr.flush()

    # In Quake and later PYTHONPATH is removed or not set.
    # So after shelling into PSC Python interpreter will lose
    # information about what Splunk core's Python path is. So we
    # stash it into an environment variable to retrieve it after
    # switching into conda.
    os.environ['SPLUNK_CORE_PYTHONPATH'] = json.dumps(sys.path)

    try:
        os.environ['MKL_NUM_THREADS'] = '4'
        if system[0] != "Windows":
            os.environ['VECLIB_MAXIMUM_THREADS'] = '1'
            os.environ['OPENBLAS_NUM_THREADS'] = '4'

        result = subprocess.run(
            [python_path, script_path] + params, text=True, capture_output=True
        )
        # Check and print the result
        if result.returncode == 0:
            return_output = json.loads(result.stdout.strip())
        else:
            return_output = json.loads(result.stderr.strip())
            # logger.info(f"Error: {result.stderr.strip(return_output)}")

        return return_output
    except:
        # logger.info(str(traceback.format_exc()))
        traceback.print_exc(None, sys.stderr)
        sys.stderr.flush()
        time.sleep(0.1)
        return dict()
