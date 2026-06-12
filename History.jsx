export default function History({ entries, onDelete }) {
  return (
    <section className="history-section" id="history">
      <div className="section-heading">
        <h2>Your Mood Journey</h2>
        <p>A gentle timeline of how you've been feeling</p>
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">Your reflections will appear here once you analyze an entry.</div>
      ) : (
        <div className="history-grid">
          {entries.map((item) => (
            <div className="history-card" key={item.id}>
              <button
                className="delete-btn"
                onClick={() => onDelete(item.id)}
                aria-label="Delete entry"
                title="Delete entry"
              >
                ✕
              </button>
              <div className="history-top">
                <span className="history-emoji">{item.emoji}</span>
                <span className="history-date">{formatDate(item.date)}</span>
              </div>
              <div className="history-mood">{item.mood}</div>
              <div className="history-preview">{item.preview}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
