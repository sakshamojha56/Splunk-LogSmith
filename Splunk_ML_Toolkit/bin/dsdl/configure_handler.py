import cexc
import json
import splunk

from dsdl.system_paths import setup_sys_path

logger = cexc.get_logger(__name__)

setup_sys_path()

from botocore.exceptions import ClientError

import docker
from urllib.parse import parse_qs
from docker.types import LogConfig
import splunklib.client as client
from dsdl.kubernetes_utility import K8SUtils, kubernetes_fields
from passwords import encode_passwords, decode_passwords
from dsdl.docker_util import (
    read_connection_data,
    get_connection_name,
    check_container_api_health,
)

from dsdl.exceptions import ApplicationError
from ai_commander.constants import DEFAULT_ACCESS_TOKEN

from util.telemetry_util import log_hpa_usage


class DockerConfigureService:
    def __init__(self, session_key: str, system_auth: str):
        self.session_key = session_key
        self.system_auth = system_auth
        self._service = None
        self._connection = None
        self._containers = None
        self._images = None
        self._docker_client = None
        self._docker_api_client = None
        self.container_type = "docker"

    @property
    def service(self):
        if not self._service:
            self._service = client.Service(
                token=self.system_auth, sharing="app", app="Splunk_ML_Toolkit"
            )
        return self._service

    def connection(self):
        """
        Return the stanza for the current container_type.
        Example: configs/conf-docker/docker or configs/conf-docker/kubernetes
        """
        if not self._connection:
            logger.debug(f"Fetching connection stanza for container_type={self.container_type}")
            self._connection = self.service.confs["container_connections"][self.container_type]
        return self._connection

    def create_docker_client(self, docker_url):
        return docker.DockerClient(base_url=docker_url)

    @property
    def container_stanzas(self):
        if not self._containers:
            self._containers = self.service.confs.create("dsdl_container")
        return self._containers

    @property
    def image_stanzas(self):
        if not self._images:
            self._images = self.service.confs.create("docker_images")
        return self._images

    @property
    def docker_client(self):
        if not self._docker_client:
            connection = self.connection().content
            docker_url = connection["docker_url"]
            logger.debug("Using docker_url: %s", docker_url)
            import requests

            self._docker_client = docker.from_env()
        return self._docker_client

    @property
    def docker_api_client(self):
        if not self._docker_api_client:
            connection = self.connection().content
            docker_url = connection["docker_url"]
            self._docker_api_client = docker.APIClient(base_url=docker_url)
        return self._docker_api_client

    def update_stanza_urls(self, k8s, stanza):
        k8s_name = stanza["id"]

        for port_name in ["api", "jupyter", "tensorboard", "spark", "mlflow"]:
            attr_name = port_name + "_url"
            if attr_name not in stanza or not stanza[attr_name]:
                try:
                    url = k8s.get_url(k8s_name, port_name)
                except:
                    url = None
                if url:
                    stanza.submit({attr_name: url})
                    stanza.refresh()

    def wait_for_all_urls(self, model_name, port_names=None, timeout=120, interval=5):
        """
        Waits until all expected service URLs are available via get_url.

        Args:
            model_name (str): The Kubernetes deployment/service name.
            port_names (List[str]): Ports to wait for. Defaults to common ports.
            timeout (int): Maximum wait time in seconds.
            interval (int): Polling interval in seconds.

        Returns:
            dict: Mapping of port_name to URL.

        Raises:
            TimeoutError: If any URL is not available in time.
        """
        import time

        if port_names is None:
            port_names = ["api", "jupyter", "tensorboard", "mlflow", "spark"]

        urls = {port: None for port in port_names}
        deadline = time.time() + timeout

        while time.time() < deadline:
            all_ready = True
            for port in port_names:
                if not urls[port]:
                    try:
                        url = self.get_url(model_name, port)
                        if url:
                            urls[port] = url
                        else:
                            all_ready = False
                    except Exception:
                        all_ready = False
            if all_ready:
                return urls
            time.sleep(interval)

        raise TimeoutError(
            f"[K8SUtils] Timeout: Not all service URLs ready for model '{model_name}'"
        )

    def start_container(self, searchinfo, request: dict, path_parts) -> dict:
        try:

            params_raw = request.get("payload", "{}")
            params = json.loads(params_raw)
            payload = params.get("payload", {})

            image = payload.get("image")
            model = payload.get("model")
            runtime = payload.get("runtime") or None
            cluster = payload.get("cluster", "docker").strip()  # docker | kubernetes
            mode = payload.get("mode", "DEV").strip()

            # 🔑 Set container_type dynamically so connection() fetches correct stanza
            self.container_type = cluster
            connection = self.connection()

            # Resolve repo + image
            repo, image_name = "splunk/", "mltk-container-golden-cpu"
            image_stanzas = {stanza.image: stanza for stanza in self.image_stanzas}
            if image in image_stanzas:
                image_stanza = image_stanzas[image]
                repo, image_name = image_stanza.repo, image_stanza.image

            # Create or fetch stanza for container instance
            stanza_name = f"{model}"
            container_stanza = (
                self.container_stanzas.create(stanza_name)
                if stanza_name not in self.container_stanzas
                else self.container_stanzas[stanza_name]
            )

            # 🔑 Shared env setup
            environment_vars = {
                "olly_enabled": "false",
                "splunk_access_enabled": "false",
                "splunk_hec_enabled": "false",
                "ENABLE_HTTPS": "true",
                "JUPYTER_PASSWD": "sha1:f7432152c71d:e8520c26b9d960e838d562768c1d24ef5b9b76c7",
                "MODE_DEV_PROD": "DEV" if mode == "DEV" else "PROD",
                "api_token": "",
            }

            conn_content = connection.content

            # Decode passwords from Splunk passwords.conf to get api_token
            decoded_secrets = {}
            decode_passwords(self.service, decoded_secrets)
            api_token_from_passwords = decoded_secrets.get("api_token", "")

            environment_vars.update(
                {
                    "JUPYTER_PASSWD": conn_content.get(
                        "jupyter_passwd", environment_vars["JUPYTER_PASSWD"]
                    ),
                    "api_token": (
                        api_token_from_passwords
                        if api_token_from_passwords
                        else conn_content.get("api_token", "")
                    ),
                }
            )

            # Default to HTTPS disabled unless explicitly enabled
            https_flag = str(conn_content.get("container_enable_https", "")).strip().lower()
            if https_flag in ["", "false", "0"]:
                environment_vars["ENABLE_HTTPS"] = "false"

            olly_enabled = conn_content.get("olly_enabled", "")
            if olly_enabled and ('true' in olly_enabled.lower() or olly_enabled == "1"):
                environment_vars["SPLUNK_ACCESS_TOKEN"] = conn_content.get(
                    "olly_splunk_access_token", ""
                )
                environment_vars["OTEL_TRACES_EXPORTER"] = "jaeger-thrift-splunk"
                environment_vars["OTEL_SERVICE_NAME"] = conn_content.get(
                    "olly_otel_service_name", ""
                )
                environment_vars["OTEL_EXPORTER_JAEGER_ENDPOINT"] = conn_content.get(
                    "olly_otel_endpoint", ""
                )
                environment_vars["olly_enabled"] = olly_enabled

            splunk_access_enabled = conn_content.get("splunk_access_enabled", "")
            if splunk_access_enabled and (
                'true' in splunk_access_enabled.lower() or splunk_access_enabled == "1"
            ):
                environment_vars["splunk_access_token"] = conn_content.get(
                    "splunk_access_token", ""
                )
                environment_vars["splunk_access_host"] = conn_content.get(
                    "splunk_access_host", ""
                )
                environment_vars["splunk_access_port"] = conn_content.get(
                    "splunk_access_port", ""
                )
                environment_vars["splunk_access_enabled"] = splunk_access_enabled

            splunk_hec_enabled = conn_content.get("splunk_hec_enabled", "")
            if splunk_hec_enabled and (
                'true' in splunk_hec_enabled.lower() or splunk_hec_enabled == "1"
            ):
                environment_vars["splunk_hec_token"] = conn_content.get("splunk_hec_token", "")
                environment_vars["splunk_hec_url"] = conn_content.get("splunk_hec_url", "")
                environment_vars["splunk_hec_enabled"] = splunk_hec_enabled

            # 🔑 Dispatch by cluster type
            if cluster == "docker":
                return self._start_docker_container(
                    model,
                    mode,
                    repo,
                    image_name,
                    runtime,
                    container_stanza,
                    environment_vars,
                    conn_content,
                )
            elif cluster == "kubernetes":
                # Capture optional overrides from payload
                overrides = {}
                # hpa_enabled can be 0/1 and should override even when 0
                if "hpa_enabled" in payload:
                    overrides["hpa_enabled"] = str(payload.get("hpa_enabled"))

                # Resource and replica/threshold overrides; replicas and cpu_threshold_percent may be intentionally cleared with ""
                for k in [
                    "min_cpu",
                    "max_cpu",
                    "min_memory",
                    "max_memory",
                    "min_replicas",
                    "max_replicas",
                    "cpu_threshold_percent",
                    "hpa_enabled",
                ]:
                    if k not in payload:
                        continue
                    v = payload.get(k)
                    # For replicas and cpu_threshold_percent we allow empty string to mean "clear existing value"
                    if k in ["min_replicas", "max_replicas", "cpu_threshold_percent"]:
                        overrides[k] = "" if v == "" else str(v)
                    else:
                        if v not in [None, ""]:
                            overrides[k] = str(v)

                return self._start_kubernetes_container(
                    cluster,
                    searchinfo,
                    model,
                    mode,
                    repo,
                    image_name,
                    runtime,
                    container_stanza,
                    environment_vars,
                    conn_content,
                    overrides,
                )
            else:
                raise ValueError(f"Unsupported cluster type: {cluster}")

        except Exception as e:
            logger.exception("Failed to start container: %s", str(e))
            return {"error": str(e)}

    # 🐳 NEW: docker-specific container start
    def _start_docker_container(
        self,
        model,
        mode,
        repo,
        image_name,
        runtime,
        container_stanza,
        environment_vars,
        conn_content,
    ):
        """
        Starts a container on Docker using docker-py client.
        """
        import time
        from docker.types import LogConfig

        devFlag = model == "__dev__"

        docker_log_config = None
        docker_network = conn_content.get("docker_network", "")
        docker_logging_endpoint_hostname = conn_content.get(
            "docker_logging_endpoint_hostname", ""
        )
        if docker_logging_endpoint_hostname:
            docker_logging_splunk_token = conn_content.get("docker_logging_splunk_token", "")
            if docker_logging_splunk_token:
                docker_log_config = LogConfig(
                    type="splunk",
                    config={
                        "splunk-token": docker_logging_splunk_token,
                        "splunk-url": docker_logging_endpoint_hostname,
                    },
                )

        docker_ports = {"5000/tcp": None}
        if mode == "DEV":
            docker_ports = {
                "8888/tcp": "8888" if devFlag else None,
                "6006/tcp": "6006" if devFlag else None,
                "6000/tcp": "6060" if devFlag else None,
                "4040/tcp": "4040" if devFlag else None,
                "5000/tcp": "5000" if devFlag else None,
            }

        c = self.docker_client.containers.run(
            repo + image_name,
            labels={"mltk_container": "", "mltk_model": model},
            runtime=runtime,
            detach=True,
            ports=docker_ports,
            volumes={
                "mltk-container-data": {"bind": "/srv", "mode": "rw"},
                "mltk-container-app": {"bind": "/srv/backup/app", "mode": "ro"},
                "mltk-container-notebooks": {"bind": "/srv/backup/notebooks", "mode": "ro"},
            },
            remove=True,
            log_config=docker_log_config,
            environment=environment_vars,
            network=docker_network,
        )

        endpoint_hostname = conn_content.get("endpoint_hostname", "")
        endpoint_hostname_external = (
            conn_content.get("endpoint_hostname_external", "") or endpoint_hostname
        )

        # Wait for ports
        timeout, retries = 60, 0
        while retries < timeout:
            inspect = self.docker_api_client.inspect_container(c.id)
            try:
                api_port = inspect["NetworkSettings"]["Ports"]["5000/tcp"][0]["HostPort"]
                if mode == "DEV":
                    jupyter_port = inspect["NetworkSettings"]["Ports"]["8888/tcp"][0][
                        "HostPort"
                    ]
                    tensorboard_port = inspect["NetworkSettings"]["Ports"]["6006/tcp"][0][
                        "HostPort"
                    ]
                    spark_port = inspect["NetworkSettings"]["Ports"]["4040/tcp"][0]["HostPort"]
                    mlflow_port = inspect["NetworkSettings"]["Ports"]["6000/tcp"][0]["HostPort"]
                break
            except Exception:
                logger.info(
                    "Port 5000 not bound yet, retry %s for container_id=%s", retries, c.id
                )
                time.sleep(1)
                retries += 1

        # Build URLs
        api_url = f"http://{endpoint_hostname}:{api_port}"
        api_url_external = f"http://{endpoint_hostname_external}:{api_port}"
        jupyter_url = (
            f"http://{endpoint_hostname_external}:{jupyter_port}" if mode == "DEV" else ""
        )
        tensorboard_url = (
            f"http://{endpoint_hostname_external}:{tensorboard_port}" if mode == "DEV" else ""
        )
        spark_url = f"http://{endpoint_hostname_external}:{spark_port}" if mode == "DEV" else ""
        mlflow_url = (
            f"http://{endpoint_hostname_external}:{mlflow_port}" if mode == "DEV" else ""
        )

        container_stanza.submit(
            {
                "id": c.id,
                "mode": mode,
                "cluster": "docker",
                "image": image_name,
                "runtime": runtime,
                "api_url": api_url,
                "api_url_external": api_url_external,
                "jupyter_url": jupyter_url,
                "tensorboard_url": tensorboard_url,
                "spark_url": spark_url,
                "mlflow_url": mlflow_url,
            }
        )
        container_stanza.refresh()

        logger.info(
            "Started Docker container model=%s id=%s url_external=%s",
            model,
            c.id,
            api_url_external,
        )

        return {
            "container_id": c.id,
            "mode": mode,
            "cluster": "docker",
            "image": image_name,
            "runtime": runtime,
            "api_url": api_url,
            "api_url_external": api_url_external,
            "jupyter_url": jupyter_url,
            "tensorboard_url": tensorboard_url,
            "spark_url": spark_url,
            "mlflow_url": mlflow_url,
        }

    # ☸️ NEW: kubernetes-specific container start
    def _start_kubernetes_container(
        self,
        cluster,
        searchinfo,
        model,
        mode,
        repo,
        image_name,
        runtime,
        container_stanza,
        environment_vars,
        conn_content,
        overrides=None,
    ):
        k8s = K8SUtils.from_service(self.service, searchinfo, cluster)
        connection_name = get_connection_name(searchinfo, cluster)
        settings = read_connection_data(searchinfo, cluster, connection_name)
        overrides = overrides or {}
        for key, val in overrides.items():
            # hpa_enabled should override even when "0"
            if key == "hpa_enabled":
                settings[key] = str(val)
                continue

            # Allow replicas and cpu_threshold_percent to be explicitly cleared when val == ""
            if key in ["min_replicas", "max_replicas", "cpu_threshold_percent"]:
                settings[key] = "" if val == "" else str(val)
                continue

            # For all other fields, only override if non-empty
            if val not in [None, ""]:
                settings[key] = val
        deployment = k8s.create_deployment(
            runtime, model, repo + image_name, environment_vars, settings
        )
        k8s.create_service(deployment, model, mode)

        port_names = ["api"]
        if mode == "DEV":
            port_names = ["jupyter", "tensorboard", "api", "spark", "mlflow"]

        for port_name in port_names:
            if port_name == "api" and settings["in_cluster_mode"] == "1":
                continue
            if settings["service_type"] == "route":
                k8s.create_route(deployment, model, port_name)
            elif settings["service_type"] == "ingress":
                k8s.create_ingress(deployment, model, port_name)

        # Normalize HPA flag to boolean based on settings
        raw_hpa = str(settings.get("hpa_enabled", "")).lower()
        hpa_enabled = raw_hpa in ("1", "true", "yes")
        log_hpa_usage(hpa_enabled)
        logger.debug("The log hpa usage is: {}".format(log_hpa_usage))

        # Resolve CPU threshold with a safe integer fallback
        try:
            cpu_threshold_percent = int(settings.get("cpu_threshold_percent", 70))
        except (TypeError, ValueError):
            cpu_threshold_percent = 70
        if hpa_enabled:
            try:
                k8s.create_hpa(
                    deployment_name=k8s.get_clean_model(model),
                    namespace=settings["namespace"],
                    min_replicas=int(settings.get("min_replicas", 1)),
                    max_replicas=int(settings.get("max_replicas", 3)),
                    cpu_utilization=cpu_threshold_percent,
                )
                logger.info("HPA attached to deployment %s", k8s.get_clean_model(model))
            except Exception as e:
                logger.error("Failed to create HPA: %s", str(e))

        # Persist overrides along with standard fields
        stanza_payload = {
            "id": k8s.get_clean_model(model),
            "cluster": "kubernetes",
            "image": image_name,
            "runtime": runtime,
            "mode": mode,
        }
        # Save resource/HPA fields if available (including cpu_threshold_percent and hpa_enabled)
        for k in [
            "min_cpu",
            "max_cpu",
            "min_memory",
            "max_memory",
            "min_replicas",
            "max_replicas",
            "cpu_threshold_percent",
            "hpa_enabled",
        ]:
            if settings.get(k) not in [None, ""]:
                stanza_payload[k] = settings.get(k)
        container_stanza.submit(stanza_payload)
        container_stanza.refresh()

        try:
            urls = k8s.wait_for_all_urls(k8s.get_clean_model(model), port_names)

            # Determine health-based status from the primary API URL
            primary_api_url = urls.get("api")
            status = check_container_api_health(primary_api_url)

            url_payload = {
                "api_url": urls.get("api"),
                "jupyter_url": urls.get("jupyter"),
                "tensorboard_url": urls.get("tensorboard"),
                "spark_url": urls.get("spark"),
                "mlflow_url": urls.get("mlflow"),
                "status": status,
            }
            container_stanza.submit(url_payload)
            container_stanza.refresh()
        except TimeoutError as e:
            logger.warning("Some URLs could not be resolved within timeout: %s", str(e))

        logger.info("Started Kubernetes deployment model=%s image=%s", model, image_name)

        return {
            "container_id": container_stanza.id,
        }

    def stop_container(self, request: dict, path_parts, searchinfo) -> dict:
        try:
            params_raw = request.get("payload", "{}")
            params = json.loads(params_raw)
            payload = params.get("payload", {})

            model = payload.get("model", "")

            stanza_name = f"{model}"
            stanza = self.container_stanzas[stanza_name]

            container_id = stanza.content.get("id", "")
            cluster = stanza.content.get("cluster", "docker")

            if container_id:
                if cluster == "docker":
                    try:
                        c = self.docker_client.containers.get(container_id)
                        c.stop()
                        logger.info("Stopped Docker container: %s", container_id)
                    except docker.errors.NotFound:
                        logger.warning(
                            "Docker container %s already removed; skipping stop", container_id
                        )
                    except Exception as e:
                        logger.error(
                            "Failed to stop Docker container %s: %s", container_id, str(e)
                        )
                        raise
                elif cluster == "kubernetes":
                    k8s = K8SUtils.from_service(self.service, searchinfo, cluster)
                    connection_name = get_connection_name(searchinfo, cluster)
                    settings = read_connection_data(searchinfo, cluster, connection_name)
                    if settings.get("hpa_enabled"):
                        try:
                            k8s.delete_hpa(
                                deployment_name=container_id,
                                namespace=k8s.settings.get("namespace", "default"),
                            )
                            logger.info("HPA deleted for deployment %s", container_id)
                        except Exception as e:
                            logger.error("Failed to delete HPA: %s", str(e))
                    k8s.delete_deployment(container_id)
                    logger.info("Stopped Kubernetes deployment: %s", container_id)

                logger.debug(
                    "AITKContainer STOP on cluster=%s model=%s container_id=%s",
                    cluster,
                    model,
                    container_id,
                )

            # Clean up stanza
            if "__dev__" in stanza_name:
                # For dev stanzas, keep the stanza but clear runtime/URL and resource/HPA fields
                self.container_stanzas[stanza_name].submit(
                    {
                        "id": "",
                        "mode": "",
                        "api_url": "",
                        "jupyter_url": "",
                        "tensorboard_url": "",
                        "mlflow_url": "",
                        "spark_url": "",
                        "status": "",
                        "min_cpu": "",
                        "max_cpu": "",
                        "min_memory": "",
                        "max_memory": "",
                        "min_replicas": "",
                        "max_replicas": "",
                        "cpu_threshold_percent": "",
                        "hpa_enabled": "",
                    }
                )
            else:
                self.container_stanzas[stanza_name].delete()

            return {"container_id": container_id, "status": "stopped"}

        except Exception as e:
            logger.exception("Failed to stop container: %s", str(e))
            return {"error": "Failed to stop container."}

    def get_container_logs(self, request: dict, searchinfo) -> dict:
        params_raw = request.get("payload", "{}")
        params = json.loads(params_raw)
        payload = params.get("payload", {})
        model = payload["model"] if "model" in payload else ''
        stanza_name = "%s" % (model)
        entries = []
        if stanza_name in self.container_stanzas:
            stanza = self.container_stanzas[stanza_name]
            container_id = stanza["id"]
            cluster = stanza["cluster"]
            if container_id:
                if cluster == "docker":
                    c = self.docker_client.containers.get(container_id)
                    logs = c.logs(timestamps=True)
                    logs = logs.decode('utf-8')
                    for line in logs.split("\n"):
                        entries.append(
                            {
                                "_time": str(line[:30]),
                                "log": str(line[31:]),
                            }
                        )
                elif cluster == "kubernetes":
                    k8s = K8SUtils.from_service(self.service, searchinfo, cluster)
                    entries = k8s.get_logs(container_id)
        return {
            "entries": entries,
        }

    def configure_details(self, request: dict, path_parts):
        try:
            params_raw = request.get("payload", "{}")
            payload = json.loads(params_raw)
            params = payload

            # figure out which container type
            self.container_type = params.get("container_type", "docker")

            # settings dict to be filled
            settings = {}

            #
            # 🚀 Common fields (shared between Docker and Kubernetes)
            #
            api_token = params.get("api_token", "")
            if not api_token:
                import random, string

                api_token = "".join(
                    random.choices(string.ascii_uppercase + string.digits, k=64)
                )

            settings["api_token"] = api_token
            settings["jupyter_passwd"] = params.get("jupyter_passwd", "")
            for key in [
                "olly_otel_endpoint",
                "olly_splunk_access_token",
                "olly_otel_service_name",
                "olly_enabled",
                "container_enable_https",
                "splunk_access_token",
                "splunk_access_host",
                "splunk_access_port",
                "splunk_access_enabled",
                "splunk_hec_enabled",
                "splunk_hec_token",
                "splunk_hec_url",
                "endpoint_cert_check_hostname",
                "endpoint_cert_filename_or_path",
            ]:
                if key in params:
                    settings[key] = params.get(key, "")

            #
            # 🐳 Docker-specific settings
            #
            if self.container_type == "docker":
                docker_url = params.get("docker_url", "").strip("/")
                if not docker_url:
                    raise ApplicationError("Missing docker_url for Docker connection")

                if not self.create_docker_client(docker_url).ping():
                    raise splunk.RESTException(400, "Could not ping Docker")

                settings["docker_url"] = docker_url
                settings["endpoint_hostname"] = params.get("endpoint_hostname", "")
                settings["endpoint_hostname_external"] = params.get(
                    "endpoint_hostname_external", ""
                )
                settings["docker_network"] = params.get("docker_network", "")
                settings["docker_logging_endpoint_hostname"] = params.get(
                    "docker_logging_endpoint_hostname", ""
                )
                settings["docker_logging_splunk_token"] = params.get(
                    "docker_logging_splunk_token", ""
                )

            #
            # ☸️ Kubernetes-specific settings
            #
            elif self.container_type == "kubernetes":
                settings["image_pull_secrets"] = params.get("image_pull_secrets", "None")
                settings["in_cluster_mode"] = params.get("in_cluster_mode", "0")

                if params.get("is_kubernetes", False):
                    auth_mode = params.get("auth_mode")

                    # Hardcoded auth_mode secret fields based on provided JSON
                    auth_mode_secrets = {
                        "cert-key": ["client_cert", "client_key", "cluster_ca"],
                        "user-token": ["user_token"],
                        "user-login": ["cluster_ca", "user_password"],
                        "aws-iam": [
                            "aws_cluster_name",
                            "aws_access_key_id",
                            "aws_secret_access_key",
                            "aws_region_name",
                        ],
                        "service-account": ["service_account_token"],
                    }

                    if auth_mode in auth_mode_secrets:
                        # Decode stored passwords into a temporary dict
                        decoded_settings = {}
                        decode_passwords(self.service, decoded_settings)
                        for field in auth_mode_secrets[auth_mode]:
                            if params.get(
                                field
                            ) == DEFAULT_ACCESS_TOKEN and decoded_settings.get(field):
                                params[field] = decoded_settings[field]
                k8s = K8SUtils(params, container_type="kubernetes")

                if params.get("is_kubernetes", False):
                    auth_mode = params.get("auth_mode")

                    # Hardcoded auth_mode secret fields based on provided JSON
                    auth_mode_secrets = {
                        "cert-key": ["client_cert", "client_key", "cluster_ca"],
                        "user-token": ["user_token"],
                        "user-login": ["cluster_ca", "user_password"],
                        "aws-iam": [
                            "aws_cluster_name",
                            "aws_access_key_id",
                            "aws_secret_access_key",
                            "aws_region_name",
                        ],
                        "service-account": ["service_account_token"],
                    }

                    if auth_mode in auth_mode_secrets:
                        # Decode stored passwords into a temporary dict
                        decoded_settings = {}
                        decode_passwords(self.service, decoded_settings)

                        for field in auth_mode_secrets[auth_mode]:
                            if not params.get(field) and decoded_settings.get(field):
                                params[field] = decoded_settings[field]
                                logger.debug(
                                    f"Populated missing Kubernetes secret '{field}' for auth_mode '{auth_mode}'"
                                )

                if not k8s.is_enabled(params):
                    raise ApplicationError("Kubernetes config not enabled")

                k8s.validate_cluster(params)

                for k in kubernetes_fields:
                    if k in params:
                        settings[k] = params[k]

                for k, v in params.items():
                    if k not in settings:
                        settings[k] = v

                # ensure required volume exists
                k8s.ensure_volume("2Gi")

            else:
                raise ApplicationError(f"Unknown container_type: {self.container_type}")

            #
            # 🔐 Encode secrets (tokens, passwords, etc.)
            #

            encode_passwords(self.service, settings)

            return settings

        except ApplicationError:
            # Pass through explicit application-level errors as-is so the UI sees a concise message
            raise
        except Exception as e:
            # Log full traceback server-side, but return a concise, user-facing message.
            # For AWS IAM auth, botocore.exceptions.ClientError is the most common failure type.
            logger.exception("Unexpected error in configure_details: %s", str(e))

            if isinstance(e, ClientError):
                # Surface only the primary ClientError message (no Python stack trace or
                # low-level signing details like Canonical String / String-to-Sign) to
                # the caller/UI.
                full_msg = str(e)

                # AWS adds additional diagnostic sections starting with
                # "The Canonical String for this request"; trim everything from there on.
                marker = "The Canonical String for this request"
                idx = full_msg.find(marker)
                if idx != -1:
                    cleaned_msg = full_msg[:idx].rstrip()
                else:
                    cleaned_msg = full_msg

                raise ApplicationError(cleaned_msg)

            # For all other unexpected errors, also wrap in ApplicationError so that
            # the UI does not receive a giant traceback string.
            raise ApplicationError(
                "An unexpected error occurred during configuration. Please check the server logs for details."
            )

    def get_configure_details(self):
        # Fetch the current connection stanza
        settings = self.connection().content

        # Decrypt any encoded passwords
        decode_passwords(self.service, settings)

        # Build the return payload
        data = {
            "docker_url": settings.get("docker_url", ""),
            "endpoint_hostname": settings.get("endpoint_hostname", ""),
            "endpoint_hostname_external": settings.get("endpoint_hostname_external", ""),
            "docker_network": settings.get("docker_network", ""),
            "docker_logging_endpoint_hostname": settings.get(
                "docker_logging_endpoint_hostname", ""
            ),
            "docker_logging_splunk_token": settings.get("docker_logging_splunk_token", ""),
            "olly_otel_endpoint": settings.get("olly_otel_endpoint", ""),
            "olly_splunk_access_token": settings.get("olly_splunk_access_token", ""),
            "olly_otel_service_name": settings.get("olly_otel_service_name", ""),
            "olly_enabled": settings.get("olly_enabled", ""),
            "endpoint_cert_filename_or_path": settings.get(
                "endpoint_cert_filename_or_path", ""
            ),
            "endpoint_cert_check_hostname": settings.get("endpoint_cert_check_hostname", ""),
            "container_enable_https": settings.get("container_enable_https", ""),
            "splunk_access_token": settings.get("splunk_access_token", ""),
            "splunk_access_host": settings.get("splunk_access_host", ""),
            "splunk_access_port": settings.get("splunk_access_port", ""),
            "splunk_access_enabled": settings.get("splunk_access_enabled", ""),
            "splunk_hec_enabled": settings.get("splunk_hec_enabled", ""),
            "splunk_hec_token": settings.get("splunk_hec_token", ""),
            "splunk_hec_url": settings.get("splunk_hec_url", ""),
            "jupyter_passwd": settings.get("jupyter_passwd", ""),
            "api_token": settings.get("api_token", ""),
            # "in_cluster_mode": settings.get("in_cluster_mode", "0"),
            # "image_pull_secrets": settings.get("image_pull_secrets", ""),
        }

        if self.container_type == "kubernetes":
            data["in_cluster_mode"] = settings.get("in_cluster_mode", "0")
            data["image_pull_secrets"] = settings.get("image_pull_secrets", "")

        # Include any Kubernetes-specific fields
        for k in kubernetes_fields:
            data[k] = settings.get(k, "")

        # Return instead of sending response directly
        return data
