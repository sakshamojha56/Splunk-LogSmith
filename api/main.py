"""
FastAPI service — the main entry point.
Exposes /analyze (agent loop) and /generate-ta (TA download).
"""
import os
import asyncio
import tempfile
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

from agent.orchestrator import run_agent
from agent.mcp_client import health_check
from ta_builder.builder import build_ta, get_ta_preview

app = FastAPI(
    title="Splunk Agentic Log Analyzer",
    description="Agentic field extraction pipeline using Splunk MCP Server + Gemini AI",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve frontend static files at root
_FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.isdir(_FRONTEND_DIR):
    app.mount("/ui", StaticFiles(directory=_FRONTEND_DIR, html=True), name="frontend")


@app.get("/")
async def root():
    """Redirect root to the frontend UI."""
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/ui/index.html")

# In-memory job store (for demo; use Redis in prod)
jobs: dict = {}


class AnalyzeRequest(BaseModel):
    log_sample: str = Field(..., description="A raw log line sample to analyze")
    index: str = Field(default="main", description="Splunk index to pull real examples from")
    search_terms: str = Field(default="*", description="Additional SPL search terms to filter examples")
    sourcetype: str = Field(default="custom_logs", description="Sourcetype for the generated TA")
    ta_name: str = Field(default="TA_auto_extracted", description="Name for the generated Technology Add-on")


class AnalyzeResponse(BaseModel):
    job_id: str
    status: str
    fields: list = []
    ta_preview: dict = {}
    error: Optional[str] = None


@app.get("/health")
async def health():
    """Check connectivity to Splunk and MCP Server."""
    status = await health_check()
    return {
        "service": "Splunk Agentic Log Analyzer",
        "version": "1.0.0",
        **status,
    }


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest, background_tasks: BackgroundTasks):
    """
    Trigger the agentic extraction pipeline.
    Runs the full loop: MCP fetch → Gemini propose → iterate validate → PII classify.
    """
    import uuid
    job_id = str(uuid.uuid4())
    jobs[job_id] = {"status": "running", "progress": [], "result": None}

    def on_progress(step: str, data: dict):
        jobs[job_id]["progress"].append({"step": step, **data})

    async def run():
        try:
            result = await run_agent(
                log_sample=req.log_sample,
                index=req.index,
                search_terms=req.search_terms,
                on_progress=on_progress,
            )
            ta_preview = get_ta_preview(req.sourcetype, result["fields"])
            jobs[job_id]["status"] = "done"
            jobs[job_id]["result"] = result
            jobs[job_id]["ta_preview"] = ta_preview
            jobs[job_id]["sourcetype"] = req.sourcetype
            jobs[job_id]["ta_name"] = req.ta_name
        except Exception as e:
            jobs[job_id]["status"] = "error"
            jobs[job_id]["error"] = str(e)

    background_tasks.add_task(run)

    return AnalyzeResponse(job_id=job_id, status="running")


@app.get("/jobs/{job_id}")
async def get_job(job_id: str):
    """Poll job status and results."""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    job = jobs[job_id]
    return {
        "job_id": job_id,
        "status": job["status"],
        "progress": job.get("progress", []),
        "fields": job.get("result", {}).get("fields", []) if job.get("result") else [],
        "ta_preview": job.get("ta_preview", {}),
        "error": job.get("error"),
    }


@app.get("/generate-ta/{job_id}")
async def generate_ta(job_id: str):
    """
    Generate and download the TA .tar.gz for a completed analysis job.
    """
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")

    job = jobs[job_id]
    if job["status"] != "done":
        raise HTTPException(status_code=400, detail=f"Job not complete (status: {job['status']})")

    fields = job["result"]["fields"]
    sourcetype = job.get("sourcetype", "custom_logs")
    ta_name = job.get("ta_name", "TA_auto_extracted")

    with tempfile.TemporaryDirectory() as tmpdir:
        ta_path = build_ta(ta_name=ta_name, sourcetype=sourcetype, fields=fields, output_dir=tmpdir)
        # Copy to a stable location
        stable_path = f"/tmp/{ta_name}.tar.gz"
        import shutil
        shutil.copy2(ta_path, stable_path)

    return FileResponse(
        path=stable_path,
        filename=f"{ta_name}.tar.gz",
        media_type="application/gzip",
    )


@app.post("/analyze-sync")
async def analyze_sync(req: AnalyzeRequest):
    """
    Synchronous analyze endpoint (waits for completion).
    Use for testing/demo; prefer /analyze for production.
    """
    try:
        result = await run_agent(
            log_sample=req.log_sample,
            index=req.index,
            search_terms=req.search_terms,
        )
        ta_preview = get_ta_preview(req.sourcetype, result["fields"])
        return {
            "status": "done",
            "fields": result["fields"],
            "ta_preview": ta_preview,
            "index": req.index,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api.main:app", host="0.0.0.0", port=8080, reload=True)
