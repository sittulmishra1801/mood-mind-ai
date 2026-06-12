# MoodMind AI 🪶

An AI-powered mood journaling application. Write about your day and receive instant emotional insights, personalized advice, and wellness suggestions — powered by Gemini Flash.

## ✨ Features

- **Mood Journal** — write freely about your day
- **AI Mood Analysis** — primary mood, emoji, confidence score, emotional summary, personalized advice
- **Wellness Suggestions** — actionable, gentle recommendations
- **Mood History** — local timeline of past entries (stored in `localStorage`)
- **Dark Mode** — toggle with persistence
- **Fully Responsive** — mobile, tablet, desktop

No accounts, no databases, no payments — just a calm, private space to reflect.

## 🛠 Tech Stack

- **Frontend:** React (Vite)
- **Backend:** FastAPI
- **AI:** Gemini Flash (`google-generativeai`)
- **Storage:** Browser `localStorage` only

## 📁 Folder Structure

```
moodmind-ai/
├── backend/
│   ├── main.py            # FastAPI app & routes
│   ├── ai_service.py       # Gemini integration & prompt
│   ├── schemas.py          # Pydantic models
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── JournalForm.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   └── History.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Installation & Setup

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` and add your Gemini API key (get one free at https://aistudio.google.com/app/apikey):

```
GEMINI_API_KEY=your_actual_key_here
GEMINI_MODEL=gemini-2.0-flash
FRONTEND_ORIGIN=http://localhost:5173
```

Run the backend:

```bash
uvicorn main:app --reload --port 8000
```

> If `GEMINI_API_KEY` is not set, the backend will gracefully return a friendly fallback analysis instead of erroring out — useful for local UI development.

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173**, and API calls to `/api/*` are automatically proxied to `http://localhost:8000`.

## 🎨 Design

- **Background:** lavender pastel
- **Cards:** warm cream
- **Accents:** muted teal
- **Highlights:** soft purple
- **Headings:** Playfair Display (serif)
- **Body:** Inter (sans-serif)

A calm, premium journaling aesthetic with smooth fades, hover effects, and gentle loading animations.

## 🔒 Privacy

All journal entries and mood history are stored **only in your browser's localStorage**. Nothing is saved server-side. Clearing your browser data will erase your history.

## 📦 Production Build

```bash
cd frontend
npm run build
```

Serve the `dist/` folder with any static host, and run the FastAPI backend separately (e.g. with `uvicorn` behind nginx or a process manager like `pm2`/`systemd`).
