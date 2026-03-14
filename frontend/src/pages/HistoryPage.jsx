import { useState } from "react";
import "./HistoryPage.css";

const COLOR_MAP = {
  Healthy: "#22c55e", Citrus_Canker: "#ef4444",
  Black_Spot: "#f59e0b", Greening_Disease: "#8b5cf6",
};
const ICON_MAP = {
  Healthy: "🌿", Citrus_Canker: "🔴", Black_Spot: "🟡", Greening_Disease: "🤢",
};

export default function HistoryPage({ history, setResult, clearHistory }) {
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClear = () => {
    if (confirmClear) {
      clearHistory();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  if (!history.length) {
    return (
      <div className="history-empty fade-up">
        <div className="empty-icon">📋</div>
        <h2>No History Yet</h2>
        <p>Your detection results will appear here after analyzing leaf images.</p>
        <p className="history-persist-note">✓ History is saved in your browser — it survives page refreshes</p>
      </div>
    );
  }

  // Summary counts
  const summary = history.reduce((acc, h) => {
    acc[h.predicted_class] = (acc[h.predicted_class] || 0) + 1;
    return acc;
  }, {});

  // Average confidence
  const avgConf = (history.reduce((s, h) => s + (h.confidence || 0), 0) / history.length).toFixed(1);

  return (
    <div className="history-page fade-up">

      {/* Header */}
      <div className="history-header">
        <div>
          <h1 className="section-title">Detection History</h1>
          <p className="section-sub">
            {history.length} scan{history.length !== 1 ? "s" : ""} saved
            &nbsp;·&nbsp; avg confidence {avgConf}%
            &nbsp;·&nbsp; <span className="persist-badge">✓ saved in browser</span>
          </p>
        </div>
        <button
          className={`clear-history-btn ${confirmClear ? "confirm" : ""}`}
          onClick={handleClear}
          title="Clear all history"
        >
          {confirmClear ? "⚠️ Tap again to confirm" : "🗑 Clear All"}
        </button>
      </div>

      {/* Summary chips */}
      <div className="history-summary">
        {Object.entries(summary).map(([cls, cnt]) => (
          <div key={cls} className="summary-chip" style={{ borderColor: COLOR_MAP[cls] }}>
            <span className="chip-icon">{ICON_MAP[cls] || "🍊"}</span>
            <span className="summary-cls">{cls.replace(/_/g, " ")}</span>
            <span className="summary-cnt" style={{ background: COLOR_MAP[cls] + "22", color: COLOR_MAP[cls] }}>
              {cnt}
            </span>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="history-list">
        {history.map((item, i) => (
          <div
            key={item.id || i}
            className="history-card card"
            onClick={() => setResult(item)}
          >
            <div className="hcard-index">{i + 1}</div>
            <div className="hcard-left" style={{ borderLeftColor: COLOR_MAP[item.predicted_class] }}>
              <div className="hcard-icon">{ICON_MAP[item.predicted_class] || "🍊"}</div>
              <div className="hcard-info">
                <div className="hcard-disease" style={{ color: COLOR_MAP[item.predicted_class] }}>
                  {item.predicted_class.replace(/_/g, " ")}
                </div>
                <div className="hcard-time">{new Date(item.timestamp).toLocaleString()}</div>
                {item.mode && (
                  <div className="hcard-mode">{item.mode}</div>
                )}
              </div>
            </div>
            <div className="hcard-right">
              <div className="hcard-confidence" style={{ color: COLOR_MAP[item.predicted_class] }}>
                {Number(item.confidence).toFixed(1)}%
              </div>
              <div className="hcard-label">confidence</div>
            </div>
            <div className="hcard-arrow">›</div>
          </div>
        ))}
      </div>

      <p className="history-footer-note">
        History is stored in your browser's localStorage — it persists across page refreshes and browser restarts.
      </p>
    </div>
  );
}
