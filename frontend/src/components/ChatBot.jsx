import { useState, useRef, useEffect } from "react";
import "./ChatBot.css";

const QUICK_PROMPTS = [
  "What is Citrus Canker?",
  "How to prevent Black Spot?",
  "Symptoms of Greening Disease",
  "Tips for healthy oranges",
];

export default function ChatBot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Hi! I'm your Orange Disease AI Assistant. I can help you understand orange leaf diseases, treatments, and prevention. Ask me anything or upload a leaf image!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { role: "user", text: userText, time: now }]);
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { role: "bot", text: data.reply || "Sorry, I couldn't process that.", time: now },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "bot", text: "⚠️ Backend offline. Make sure Flask server is running on port 5000.", time: now },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n• /g, "<br/>• ")
      .replace(/\n/g, "<br/>");
  };

  return (
    <div className={`chatbot-panel ${isOpen ? "open" : ""}`}>
      {/* Header */}
      <div className="chat-header">
        <div className="chat-avatar">🍊</div>
        <div className="chat-header-info">
          <div className="chat-name">Orange AI Assistant</div>
          <div className="chat-status">
            <span className="online-dot" /> Online
          </div>
        </div>
        <button className="chat-close" onClick={onClose}>✕</button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`msg-wrap ${msg.role}`}>
            {msg.role === "bot" && <div className="msg-avatar">🤖</div>}
            <div className="msg-bubble">
              <div
                className="msg-text"
                dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
              />
              <div className="msg-time">{msg.time}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="msg-wrap bot">
            <div className="msg-avatar">🤖</div>
            <div className="msg-bubble typing">
              <div className="typing-dots">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="quick-prompts">
        {QUICK_PROMPTS.map((q, i) => (
          <button key={i} className="quick-btn" onClick={() => sendMessage(q)}>
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <input
          ref={inputRef}
          className="chat-input"
          placeholder="Ask about diseases, treatments…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button
          className="send-btn"
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
