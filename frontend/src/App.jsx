import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import UploadPage from "./pages/UploadPage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";
import ChatBot from "./components/ChatBot";
import DiseasesPage from "./pages/DiseasesPage";
import "./App.css";

const HISTORY_KEY = "orangeai_history";

export default function App() {
  const [activePage, setActivePage] = useState("upload");
  const [result, setResult] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");

  // ── Load history from localStorage on first render ──────────
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ── Save history to localStorage whenever it changes ────────
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      // localStorage full or unavailable — fail silently
    }
  }, [history]);

  // ── Backend health check ─────────────────────────────────────
  useEffect(() => {
    fetch("http://localhost:5000/health")
      .then(r => r.json())
      .then(d => setBackendStatus(d.model_loaded ? "ready" : "demo"))
      .catch(() => setBackendStatus("offline"));
  }, []);

  const handleResult = (data) => {
    // Strip large image preview before saving to localStorage
    const { image_preview, imagePreviewLocal, ...saveable } = data;
    setResult(data);
    setHistory(prev => [saveable, ...prev].slice(0, 50));
    setActivePage("result");
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  return (
    <div className="app-root">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        backendStatus={backendStatus}
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
      />

      <main className="main-content">
        {activePage === "upload"   && <UploadPage onResult={handleResult} />}
        {activePage === "result"   && <ResultPage result={result} setPage={setActivePage} />}
        {activePage === "history"  && (
          <HistoryPage
            history={history}
            setResult={r => { setResult(r); setActivePage("result"); }}
            clearHistory={clearHistory}
          />
        )}
        {activePage === "diseases" && <DiseasesPage />}
      </main>

      <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
