import { useState, useRef, useCallback } from "react";
import "./UploadPage.css";

export default function UploadPage({ onResult }) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview]   = useState(null);
  const [file, setFile]         = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const inputRef = useRef();

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPG, PNG, WEBP).");
      return;
    }
    setError("");
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) { setError("Please select an image first."); return; }
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/predict`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onResult({ ...data, imagePreviewLocal: preview });
    } catch (err) {
      setError(err.message || "Detection failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => { setPreview(null); setFile(null); setError(""); };

  return (
    <div className="upload-page fade-up">
      {/* Hero */}
      <div className="upload-hero">
        <div className="hero-tag">AI-Powered Diagnosis</div>
        <h1 className="section-title">Orange Leaf Disease<br />Detection System</h1>
        <p className="section-sub">
          Upload a photo of an orange leaf to instantly identify diseases and get treatment recommendations.
        </p>
      </div>

      <div className="upload-layout">
        {/* Drop Zone */}
        <div className="upload-card card">
          {!preview ? (
            <div
              className={`dropzone ${dragOver ? "drag-over" : ""}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current.click()}
            >
              <div className="drop-icon">🍃</div>
              <p className="drop-title">Drop your leaf image here</p>
              <p className="drop-sub">or click to browse files</p>
              <div className="drop-formats">
                <span>JPG</span><span>PNG</span><span>WEBP</span>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={e => handleFile(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="preview-area">
              <div className="preview-toolbar">
                <span className="preview-filename">{file?.name}</span>
                <button className="clear-btn" onClick={clearImage}>✕ Clear</button>
              </div>
              <div className="preview-img-wrap">
                <img src={preview} alt="leaf preview" className="preview-img" />
                <div className="preview-overlay">
                  <div className="scan-line" />
                </div>
              </div>
            </div>
          )}

          {error && <div className="error-msg">⚠️ {error}</div>}

          <button
            className="btn btn-primary detect-btn"
            onClick={handleSubmit}
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <div className="spinner" />
                Analyzing leaf…
              </>
            ) : (
              <>🔬 Analyze Disease</>
            )}
          </button>
        </div>

        {/* Info cards */}
        <div className="info-panel">
          <h3 className="info-heading">Detectable Diseases</h3>
          {DISEASE_CARDS.map(d => (
            <div key={d.name} className="disease-chip" style={{ borderLeftColor: d.color }}>
              <span className="disease-chip-icon">{d.icon}</span>
              <div>
                <div className="disease-chip-name">{d.name}</div>
                <div className="disease-chip-desc">{d.desc}</div>
              </div>
            </div>
          ))}

          <div className="tip-box">
            <div className="tip-title">📸 Tips for best results</div>
            <ul>
              <li>Use clear, well-lit photos</li>
              <li>Focus on the leaf surface</li>
              <li>Avoid blurry or dark images</li>
              <li>Capture the affected area clearly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const DISEASE_CARDS = [
  { name: "Healthy",         icon: "🟢", desc: "No disease detected",       color: "#22c55e" },
  { name: "Citrus Canker",   icon: "🔴", desc: "Bacterial leaf infection",   color: "#ef4444" },
  { name: "Black Spot",      icon: "🟣", desc: "Fungal leaf spots",          color: "#f59e0b" },
  { name: "Greening Disease",icon: "🤢", desc: "HLB — most severe disease",  color: "#8b5cf6" },
];
