export default function ResultCard({ result, loading }) {
  if (loading) {
    return (
      <div className="result-card">
        <div className="loading-wrap">
          <div className="loading-orb" />
          <p>Reflecting on your words...</p>
        </div>
      </div>
    )
  }

  if (!result) return null

  const confidencePct = Math.round((result.confidence || 0) * 100)

  return (
    <div className="result-card">
      <div className="result-top">
        <div className="mood-emoji">{result.emoji || '🙂'}</div>
        <div className="mood-info">
          <h3>{result.mood || 'Unknown'}</h3>
          <div className="confidence-bar">
            <div className="confidence-fill" style={{ width: `${confidencePct}%` }} />
          </div>
          <div className="confidence-label">Confidence: {confidencePct}%</div>
        </div>
      </div>

      <div className="result-section">
        <h4>Emotional Summary</h4>
        <p>{result.summary}</p>
      </div>

      <div className="result-section">
        <h4>Personalized Advice</h4>
        <p>{result.advice}</p>
      </div>

      {result.suggestions && result.suggestions.length > 0 && (
        <div className="result-section">
          <h4>Wellness Suggestions</h4>
          <div className="suggestions-list">
            {result.suggestions.map((s, i) => (
              <div className="suggestion-item" key={i}>
                <span>🌿</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
