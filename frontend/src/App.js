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
      const response = await fetch("https://emotion-therapy-ai.onrender.com/analyze", {
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

      <button className = "chat-button" onClick={analyzeEmotion}>
        Analyze Emotion
      </button>

      {loading && <p className="loading-text">Analyzing...</p>}

      {result && (
        <div className="result-box">
          <p><strong>Detected Emotion:</strong> {result.emotion}</p>
          <p><strong>Response:</strong> {result.response}</p>
        </div>
      )}

      {/* ---- Mood Dashboard ---- */}
      <div className="dashboard-wrapper">
        <MoodDashboard />
      </div>
    </div>
  );

}

/*const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    marginTop: "15px",
    padding: "10px 20px",
    fontSize: "1rem",
    borderRadius: "6px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  loading: {
    marginTop: "15px",
    fontStyle: "italic",
  },
  resultBox: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#f1f1f1",
    textAlign: "left",
  },
};*/

export default App;
