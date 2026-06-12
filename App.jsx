import { useEffect, useState } from 'react'
import Header from './Header.jsx'
import JournalForm from './JournalForm.jsx'
import ResultCard from './ResultCard.jsx'
import History from './History.jsx'

const STORAGE_KEY = 'moodmind_entries'
const THEME_KEY = 'moodmind_theme'

export default function App() {
  const [entry, setEntry] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)

    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch {
        setHistory([])
      }
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem(THEME_KEY, next)
  }

  const saveHistory = (newHistory) => {
    setHistory(newHistory)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
  }

  const handleAnalyze = async () => {
    if (entry.trim().length < 5) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: entry }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.detail || 'Failed to analyze entry. Please try again.')
      }

      const data = await res.json()
      setResult(data)

      const newEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        mood: data.mood,
        emoji: data.emoji,
        preview: entry.length > 140 ? entry.slice(0, 140) + '...' : entry,
      }
      saveHistory([newEntry, ...history])
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id) => {
    saveHistory(history.filter((h) => h.id !== id))
  }

  return (
    <>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <div className="page">
        <JournalForm
          entry={entry}
          setEntry={setEntry}
          onAnalyze={handleAnalyze}
          loading={loading}
          error={error}
        />

        <ResultCard result={result} loading={loading} />

        <History entries={history} onDelete={handleDelete} />

        <footer className="footer" id="about">
          MoodMind AI — A calm space for your thoughts. Your entries are stored only on your device.
        </footer>
      </div>
    </>
  )
}
