export default function JournalForm({ entry, setEntry, onAnalyze, loading, error }) {
  return (
    <section className="hero" id="journal">
      <h1>What did today feel like?</h1>
      <p>Write freely. MoodMind AI reflects the emotions beneath your words.</p>

      <div className="journal-card">
        <label htmlFor="journal-entry">Today's Entry</label>
        <textarea
          id="journal-entry"
          placeholder="Start writing about your day, your thoughts, or how you're feeling right now..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          maxLength={2000}
        />
        <div className="actions-row">
          <span className="char-count">{entry.length} / 2000</span>
          <button
            className="analyze-btn"
            onClick={onAnalyze}
            disabled={loading || entry.trim().length < 5}
          >
            {loading ? 'Analyzing...' : '✨ Analyze My Mood'}
          </button>
        </div>
        {error && <div className="error-msg">{error}</div>}
      </div>
    </section>
  )
}
