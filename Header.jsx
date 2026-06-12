export default function Header({ theme, toggleTheme }) {
  return (
    <header className="header">
      <div className="logo">Mood<span>Mind</span> AI</div>
      <nav className="nav">
        <div className="nav-links">
          <a href="#journal">Journal</a>
          <a href="#history">History</a>
          <a href="#about">About</a>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          title="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </nav>
    </header>
  )
}
