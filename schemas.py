from pydantic import BaseModel, Field
from typing import List


class JournalRequest(BaseModel):
    text: str = Field(..., min_length=5, max_length=4000)


class MoodAnalysis(BaseModel):
    mood: str
    emoji: str
    confidence: float
    summary: str
    advice: str
    suggestions: List[str]
