from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import json
import os

DATA_FILE = os.path.join(os.path.dirname(__file__), "data.json")

app = FastAPI(title="Simple Issue Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def now_iso():
    return datetime.utcnow().isoformat() + "Z"

def load_data():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w") as f:
            json.dump({"issues": [], "next_id": 1}, f)
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

class IssueIn(BaseModel):
    title: str
    description: Optional[str] = ""
    status: Optional[str] = "open"
    priority: Optional[str] = "medium"
    assignee: Optional[str] = ""

class Issue(IssueIn):
    id: int
    createdAt: str
    updatedAt: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/issues", response_model=List[Issue])
def list_issues(
    q: Optional[str] = Query(None, description="search in title"),
    status: Optional[str] = None,
    priority: Optional[str] = None,
    assignee: Optional[str] = None,
    sortBy: Optional[str] = "updatedAt",
    sortDir: Optional[str] = "desc",
    page: int = 1,
    pageSize: int = 10,
):
    data = load_data()
    issues = data["issues"]

    # filter
    if q:
        issues = [i for i in issues if q.lower() in i["title"].lower()]
    if status:
        issues = [i for i in issues if i.get("status") == status]
    if priority:
        issues = [i for i in issues if i.get("priority") == priority]
    if assignee:
        issues = [i for i in issues if i.get("assignee") == assignee]

    # sort
    reverse = sortDir.lower() == "desc"
    try:
        issues.sort(key=lambda x: x.get(sortBy) or "", reverse=reverse)
    except Exception:
        pass

    # pagination
    start = (page - 1) * pageSize
    end = start + pageSize
    return issues[start:end]

@app.get("/issues/{issue_id}", response_model=Issue)
def get_issue(issue_id: int):
    data = load_data()
    for i in data["issues"]:
        if i["id"] == issue_id:
            return i
    raise HTTPException(status_code=404, detail="Issue not found")

@app.post("/issues", response_model=Issue, status_code=201)
def create_issue(issue_in: IssueIn):
    data = load_data()
    nid = data.get("next_id", 1)
    issue = issue_in.dict()
    issue_record = {
        "id": nid,
        **issue,
        "createdAt": now_iso(),
        "updatedAt": now_iso(),
    }
    data["issues"].append(issue_record)
    data["next_id"] = nid + 1
    save_data(data)
    return issue_record

@app.put("/issues/{issue_id}", response_model=Issue)
def update_issue(issue_id: int, issue_in: IssueIn):
    data = load_data()
    for idx, i in enumerate(data["issues"]):
        if i["id"] == issue_id:
            updated = i.copy()
            payload = issue_in.dict()
            for k,v in payload.items():
                updated[k] = v
            updated["updatedAt"] = now_iso()
            data["issues"][idx] = updated
            save_data(data)
            return updated
    raise HTTPException(status_code=404, detail="Issue not found")