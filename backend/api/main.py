from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Dict, Optional
from uuid import UUID, uuid4
from backend.workflows.main_workflow import OSINTWorkflow
from backend.models.models import IntelligenceReport

app = FastAPI(title="Autonomous OSINT & BI Agent API")

# In-memory storage for simplicity (Production would use Redis/SQL)
results_cache: Dict[UUID, IntelligenceReport] = {}
jobs_status: Dict[UUID, str] = {}

class AnalyzeRequest(BaseModel):
    target: str

@app.post("/analyze", response_model=Dict[str, str])
async def analyze_target(request: AnalyzeRequest, background_tasks: BackgroundTasks):
    job_id = uuid4()
    jobs_status[job_id] = "processing"
    
    # Run orchestration in background
    background_tasks.add_task(run_workflow, job_id, request.target)
    
    return {"job_id": str(job_id), "status": "Initiated"}

@app.get("/results/{job_id}", response_model=IntelligenceReport)
async def get_results(job_id: UUID):
    if job_id not in results_cache:
        status = jobs_status.get(job_id, "NotFound")
        raise HTTPException(status_code=404, detail=f"Job {status}")
    return results_cache[job_id]

async def run_workflow(job_id: UUID, target: str):
    workflow = OSINTWorkflow()
    try:
        report = await workflow.run(target)
        results_cache[job_id] = report
        jobs_status[job_id] = "completed"
    except Exception as e:
        jobs_status[job_id] = f"Error: {str(e)}"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
