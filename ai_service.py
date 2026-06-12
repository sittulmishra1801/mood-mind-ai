import json
import os
import re
import logging

import google.generativeai as genai

from schemas import MoodAnalysis

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

logging.basicConfig(level=logging.INFO)

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    logging.info("Gemini API key found — using model %s", GEMINI_MODEL)
else:
    logging.info("No GEMINI_API_KEY set — backend will use fallback analysis")

SYSTEM_PROMPT = """You are MoodMind AI, a compassionate and emotionally intelligent journaling assistant.

Analyze the user's journal entry and respond ONLY with a valid JSON object (no markdown, no code fences, no extra text) using EXACTLY this structure:

{
  "mood": "<a single primary mood word, e.g. Happy, Anxious, Calm, Stressed, Hopeful, Sad, Excited, Frustrated, Content, Lonely>",
  "emoji": "<a single emoji that best represents this mood>",
  "confidence": <a number between 0 and 1 representing your confidence in this mood detection>,
  "summary": "<a warm, empathetic 2-3 sentence summary of the emotions detected in the entry, written in second person ('You seem...')>",
  "advice": "<2-3 sentences of gentle, personalized, actionable advice based on the entry>",
  "suggestions": ["<short wellness suggestion 1>", "<short wellness suggestion 2>", "<short wellness suggestion 3>"]
}

Be warm, non-judgmental, and supportive. Keep the tone calm and therapeutic, like a thoughtful wellness companion."""


def _extract_json(text: str) -> dict:
    """Extract a JSON object from the model's text response."""
    cleaned = text.strip()
    cleaned = re.sub(r"^```(json)?", "", cleaned).strip()
    cleaned = re.sub(r"```$", "", cleaned).strip()

    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if not match:
        raise ValueError("No JSON object found in model response")

    return json.loads(match.group(0))


def _fallback_analysis(journal_text: str) -> MoodAnalysis:
    """A simple offline fallback if Gemini is unavailable or misconfigured.

    This fallback uses a small keyword-based heuristic to return a
    friendly MoodAnalysis when the external API cannot be used.
    """
    text = journal_text.lower()

    if any(word in text for word in ["happy", "excited", "great", "wonderful", "amazing"]):
        mood = "Happy"
        emoji = "😊"

    elif any(word in text for word in ["stress", "deadline", "pressure", "overwhelmed"]):
        mood = "Stressed"
        emoji = "😟"

    elif any(word in text for word in ["sad", "lonely", "hurt", "cry"]):
        mood = "Sad"
        emoji = "😢"

    elif any(word in text for word in ["angry", "frustrated", "annoyed"]):
        mood = "Frustrated"
        emoji = "😠"

    elif any(word in text for word in ["calm", "peaceful", "relaxed"]):
        mood = "Calm"
        emoji = "😌"

    else:
        mood = "Reflective"
        emoji = "🪶"

    return MoodAnalysis(
        mood=mood,
        emoji=emoji,
        confidence=0.78,
        summary=f"You seem to be feeling {mood.lower()} based on the thoughts you shared today.",
        advice="Take a few moments to reflect on your emotions and be kind to yourself.",
        suggestions=[
            "Go for a short walk.",
            "Practice deep breathing.",
            "Write down three positive things from today.",
        ],
    )


async def analyze_mood(journal_text: str) -> MoodAnalysis:
    if not GEMINI_API_KEY:
        return _fallback_analysis(journal_text)

    try:
        model = genai.GenerativeModel(
            model_name=GEMINI_MODEL,
            system_instruction=SYSTEM_PROMPT,
        )

        response = model.generate_content(
            f"Journal entry:\n\n{journal_text}",
            generation_config={
                "temperature": 0.7,
                "response_mime_type": "application/json",
            },
        )

        data = _extract_json(response.text)

        return MoodAnalysis(
            mood=str(data.get("mood", "Reflective")),
            emoji=str(data.get("emoji", "🪶")),
            confidence=float(data.get("confidence", 0.5)),
            summary=str(data.get("summary", "")),
            advice=str(data.get("advice", "")),
            suggestions=[str(s) for s in data.get("suggestions", [])][:5],
        )
    except Exception as e:
        logging.exception("Gemini analysis failed — returning fallback analysis")
        return _fallback_analysis(journal_text)
