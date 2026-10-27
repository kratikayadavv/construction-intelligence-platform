# Multimodal Construction Intelligence Platform

An AI-powered construction decision-support app with a React/Vite frontend and FastAPI backend, using Google Gemini for multimodal analysis.

## Features

- **Safety monitoring:** analyze site photos for PPE and site hazards.
- **Crack analysis:** classify visible cracks and provide preliminary repair guidance.
- **Property valuation:** estimate property values in INR.
- **Project planning:** generate phases, budgets, and risk registers.
- **Daily site assistant:** combine weather context with activity advisories.
- **Knowledge chat:** ask construction-related questions.
- **History:** review previous analyses.

## Tech stack

- Frontend: React, Vite, Axios, React Router
- Backend: Python, FastAPI, Pydantic, SQLAlchemy (async), SQLite
- AI: Google Gemini SDK
- Weather: Open-Meteo API
- Tests: pytest, pytest-asyncio, httpx

## Quick start

### 1. Backend

Python 3.10+ is recommended.

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and set `GEMINI_API_KEY` to your own key. Never commit your real `.env` file.

Start the API:

```bash
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The Vite dev server proxies `/api` requests to the backend on port 8000.

For production, copy `frontend/.env.production.example` to `.env.production` and set `VITE_API_URL` to your deployed API URL.

## Tests

```bash
cd backend
pytest tests/ -v
```

## Deployment

A Render blueprint is included in `render.yaml`. Configure `GEMINI_API_KEY` as a secret in the hosting provider and set the allowed frontend origins appropriately before deploying.

## Security

- Do not commit API keys or real environment files.
- Keep user uploads, local databases, virtual environments, and dependency/build folders out of version control.
- AI-generated safety and structural assessments are preliminary and should be verified by qualified professionals.
