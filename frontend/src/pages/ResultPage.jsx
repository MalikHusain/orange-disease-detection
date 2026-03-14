import "./ResultPage.css";

const SEVERITY_CLASS = {
  None:     "badge-none",
  Medium:   "badge",
  High:     "badge-high",
  Critical: "badge-critical",
};

const SEVERITY_EMOJI = {
  None: "✅", Medium: "⚠️", High: "🔴", Critical: "🚨"
};

export default function ResultPage({ result, setPage }) {
  if (!result) {
    return (
      <div className="result-empty fade-up">
        <div className="empty-icon">🍃</div>
        <h2>No Results Yet</h2>
        <p>Upload a leaf image to see disease analysis.</p>
        <button className="btn btn-primary" onClick={() => setPage("upload")}>
          🔍 Start Detection
        </button>
      </div>
    );
  }

  const { predicted_class, confidence, all_probabilities, disease_info, timestamp, imagePreviewLocal } = result;
  const isHealthy = predicted_class === "Healthy";
  const severityBadge = SEVERITY_CLASS[disease_info?.severity] || "badge";

  const sortedProbs = Object.entries(all_probabilities || {})
    .sort((a, b) => b[1] - a[1]);

  const COLOR_MAP = {
    Healthy:          "#22c55e",
    Citrus_Canker:    "#ef4444",
    Black_Spot:       "#f59e0b",
    Greening_Disease: "#8b5cf6",
  };

  return (
    <div className="result-page fade-up">
      {/* Header */}
      <div className="result-header">
        <button className="back-btn btn btn-ghost" onClick={() => setPage("upload")}>
          ← New Analysis
        </button>
        <div className="result-meta">
          Analyzed on {new Date(timestamp).toLocaleString()}
        </div>
      </div>

      <div className="result-grid">
        {/* Main Result Card */}
        <div className={`result-main card ${isHealthy ? "result-healthy" : "result-disease"}`}>
          <div className="result-verdict">
            <div className="verdict-icon">{isHealthy ? "🌿" : "⚕️"}</div>
            <div className="verdict-text">
              <div className="verdict-label">Detection Result</div>
              <div className="verdict-name">{predicted_class.replace(/_/g, " ")}</div>
            </div>
            <div className={`badge ${severityBadge}`}>
              {SEVERITY_EMOJI[disease_info?.severity]} {disease_info?.severity}
            </div>
          </div>

          <div className="confidence-bar-section">
            <div className="confidence-row">
              <span>Confidence</span>
              <span className="confidence-value">{confidence.toFixed(1)}%</span>
            </div>
            <div className="confidence-track">
              <div
                className="confidence-fill"
                style={{
                  width: `${confidence}%`,
                  background: `linear-gradient(90deg, ${COLOR_MAP[predicted_class]}, ${COLOR_MAP[predicted_class]}99)`
                }}
              />
            </div>
          </div>

          {disease_info?.description && (
            <p className="disease-desc">{disease_info.description}</p>
          )}
        </div>

        {/* Preview */}
        {imagePreviewLocal && (
          <div className="result-preview card">
            <div className="preview-label">Analyzed Image</div>
            <img src={imagePreviewLocal} alt="analyzed leaf" className="result-img" />
            <div className="result-prediction-badge" style={{ background: COLOR_MAP[predicted_class] }}>
              {predicted_class.replace(/_/g, " ")} — {confidence.toFixed(1)}%
            </div>
          </div>
        )}

        {/* Symptoms */}
        {disease_info?.symptoms?.length > 0 && (
          <div className="detail-card card">
            <h3 className="detail-title">🔍 Symptoms Observed</h3>
            <ul className="symptom-list">
              {disease_info.symptoms.map((s, i) => (
                <li key={i}><span className="bullet" />  {s}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Treatments */}
        {disease_info?.treatment?.length > 0 && (
          <div className="detail-card treatment-card card">
            <h3 className="detail-title">💊 Recommended Treatments</h3>
            <ol className="treatment-list">
              {disease_info.treatment.map((t, i) => (
                <li key={i}>
                  <span className="step-num">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Probability Bars */}
        <div className="probs-card card">
          <h3 className="detail-title">📊 All Class Probabilities</h3>
          <div className="prob-bars">
            {sortedProbs.map(([cls, prob]) => (
              <div key={cls} className={`prob-row ${cls === predicted_class ? "prob-row-active" : ""}`}>
                <span className="prob-label">{cls.replace(/_/g, " ")}</span>
                <div className="prob-track">
                  <div
                    className="prob-fill"
                    style={{
                      width: `${prob}%`,
                      background: cls === predicted_class
                        ? `linear-gradient(90deg, ${COLOR_MAP[cls]}, ${COLOR_MAP[cls]}bb)`
                        : "#e7e5e4"
                    }}
                  />
                </div>
                <span className="prob-pct">{prob.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="result-actions">
        <button className="btn btn-primary" onClick={() => setPage("upload")}>
          🔍 Analyze Another Leaf
        </button>
        <button className="btn btn-secondary" onClick={() => setPage("history")}>
          📋 View History
        </button>
      </div>
    </div>
  );
}
