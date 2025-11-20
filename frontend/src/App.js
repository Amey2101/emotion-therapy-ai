import "./App.css";
import MoodDashboard from "./MoodDashboard";
import React, { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeEmotion = async () => {
    if (!text.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      setResult({ emotion: "error", response: "Server not reachable." });
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">
      <h1 className="chat-title">Emotion Therapy AI</h1>

      <textarea
        className="chat-textarea"
        rows="5"
        placeholder="Type your thoughts here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button className="chat-button" onClick={analyzeEmotion}>
        Analyze Emotion
      </button>

      {loading && <p className="loading-text">Analyzing...</p>}

      {result && (
        <div className="result-box">
          <p><strong>Detected Emotion:</strong> {result.emotion}</p>
          <p><strong>Response:</strong> {result.response}</p>
        </div>
      )}

      <div className="dashboard-wrapper">
        <MoodDashboard />
      </div>
    </div>
  );
}

export default App;
