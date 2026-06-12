import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import JournalRequest, MoodAnalysis
from ai_service import analyze_mood

load_dotenv()

app = FastAPI(
    title="MoodMind AI API",
    description="AI-powered mood journaling and emotional insight API.",
    version="1.0.0",
)

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "service": "MoodMind AI API"}


@app.get("/api/health")
def health():
    return {"status": "healthy"}


@app.post("/api/analyze", response_model=MoodAnalysis)
async def analyze(payload: JournalRequest):
    text = payload.text.strip()
    if len(text) < 5:
        raise HTTPException(status_code=400, detail="Journal entry is too short to analyze.")

    try:
        result = await analyze_mood(text)
        return result
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to analyze your entry. Please try again.")
