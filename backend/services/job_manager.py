import uuid
import threading

class JobManager:
    def __init__(self):
        self.jobs = {}
        self.lock = threading.Lock()

    def create_job(self) -> str:
        job_id = str(uuid.uuid4())
        with self.lock:
            self.jobs[job_id] = {
                "status": "pending",
                "result": None
            }
        return job_id

    def update_job(self, job_id: str, status: str, result: dict = None):
        with self.lock:
            if job_id in self.jobs:
                self.jobs[job_id]["status"] = status
                if result is not None:
                    self.jobs[job_id]["result"] = result

    def get_job(self, job_id: str) -> dict:
        with self.lock:
            return self.jobs.get(job_id)

job_manager = JobManager()
