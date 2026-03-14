import { useState } from "react";
import "./Navbar.css";

const NAV_ITEMS = [
  { id: "upload",   label: "Detect",   icon: "🔍" },
  { id: "diseases", label: "Diseases", icon: "🌿" },
  { id: "history",  label: "History",  icon: "📋" },
];

const STATUS_MAP = {
  ready:    { dot: "#22c55e", label: "Model Ready" },
  demo:     { dot: "#f59e0b", label: "Demo Mode" },
  offline:  { dot: "#ef4444", label: "Offline" },
  checking: { dot: "#94a3b8", label: "Connecting…" },
};

export default function Navbar({ activePage, setActivePage, backendStatus, chatOpen, setChatOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const st = STATUS_MAP[backendStatus] || STATUS_MAP.checking;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <div className="navbar-brand" onClick={() => setActivePage("upload")}>
          <div className="brand-icon">🍊</div>
          <div className="brand-text">
            <span className="brand-name">OrangeAI</span>
            <span className="brand-sub">Disease Detector</span>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="navbar-links">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-link ${activePage === item.id ? "active" : ""}`}
              onClick={() => setActivePage(item.id)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Right */}
        <div className="navbar-right">
          <div className="status-badge">
            <span className="status-dot" style={{ background: st.dot }} />
            <span className="status-label">{st.label}</span>
          </div>
          <button className={`chat-btn ${chatOpen ? "active" : ""}`} onClick={() => setChatOpen(!chatOpen)}>
            <span>{chatOpen ? "✕" : "💬"}</span>
            <span>Assistant</span>
          </button>

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`mobile-link ${activePage === item.id ? "active" : ""}`}
              onClick={() => { setActivePage(item.id); setMenuOpen(false); }}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
          <button className="mobile-link" onClick={() => { setChatOpen(!chatOpen); setMenuOpen(false); }}>
            💬 AI Assistant
          </button>
        </div>
      )}
    </nav>
  );
}
