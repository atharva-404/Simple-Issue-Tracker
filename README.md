# Simple Issue Tracker (FastAPI + Angular)

A simple issue tracker web application with a **FastAPI backend** and **Angular frontend**.  
Users can **view, search, filter, sort, create, and update issues**.

---

## Project Structure


issue-tracker/
├── backend/ # FastAPI backend
├── frontend/ # Angular frontend (standalone components)
└── README.md # This file

---

## Backend

- Developed with **FastAPI**.  
- Provides REST API endpoints for managing issues:

| Endpoint        | Description |
|-----------------|-------------|
| `GET /health`   | Returns server status |
| `GET /issues`   | List issues with search, filters, sorting, pagination |
| `GET /issues/{id}` | Get a single issue by ID |
| `POST /issues`  | Create a new issue |
| `PUT /issues/{id}` | Update an existing issue |

- See `backend/README.md` for detailed instructions to run the backend.  
- Backend default URL: `http://localhost:8000`

---

## Frontend

- Developed with **Angular** (standalone components).  
- Connects to backend API to display and manage issues.

### Prerequisites

- Node.js and npm  
- Angular CLI (install globally if not installed):


```bash
npm install -g @angular/cli


Setup & Run
Navigate to frontend folder:

bash
Copy code
cd frontend
Install dependencies:

bash
Copy code
npm install
Start Angular development server:

bash
Copy code
ng serve
Open your browser:

arduino
Copy code
http://localhost:4200
Ensure the backend is running at http://localhost:8000 before using the frontend.

Features
Issues List Table: id, title, status, priority, assignee,updatedAt.

Search & Filters: Search by title, filter by status, priority, or assignee.

Sorting & Pagination: Sort by clicking headers, navigate pages with Prev/Next buttons.

Create / Edit Issue: Add or update issues using a form.

Issue Detail Drawer: Click a row to view full issue details.


Notes

Frontend uses HttpClientModule for API calls.

API URL is configured in api.service.ts. 
Change if backend is on a different host/port.

Designed for local development; production deployment may require CORS adjustments.

