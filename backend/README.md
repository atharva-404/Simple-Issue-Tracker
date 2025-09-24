# Backend (FastAPI) - Simple Issue Tracker

## Run
1. Create virtual env:
   python -m venv .venv
   source .venv/bin/activate   # on Windows: .venv\Scripts\activate
2. Install:
   pip install -r requirements.txt
3. Run:
   uvicorn main:app --reload --port 8000

API:
- GET /health
- GET /issues
- GET /issues/{id}
- POST /issues
- PUT /issues/{id}

Data persisted in `data.json` alongside `main.py`.