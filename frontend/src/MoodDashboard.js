import "./MoodDashboard.css";
import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale,
} from "chart.js";
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale
);

function MoodDashboard() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/history")
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error(err));
  }, []);

  const normalizeEmotion = (emotion) => {
    if (!emotion) return "neutral";
    const e = emotion.toLowerCase();
    if (["joy","happy","excited","surprise"].includes(e)) return "happy";
    if (["sad","sadness"].includes(e)) return "sad";
    if (["fear","scary"].includes(e)) return "fear";
    if (["angry","anger"].includes(e)) return "angry";
    return "neutral";
  };

  const yCategories = ["angry","fear","sad","neutral","happy"];

  const processed = history
    .map(e => ({ ...e, date: e.date ? new Date(e.date) : new Date(e.time) }))
    .filter(e => !isNaN(e.date));

  processed.sort((a,b) => a.date - b.date);

  const filteredHistory = processed.filter((entry, i, arr) => {
    if (i === 0) return true;
    const diff = (entry.date - arr[i - 1].date) / (1000 * 60);
    return diff >= 10;
  });

  const moodCounts = history.reduce((acc, entry) => {
    const emo = normalizeEmotion(entry.emotion);
    acc[emo] = (acc[emo] || 0) + 1;
    return acc;
  }, {});

  const lineData = {
    labels: filteredHistory.map(e => e.date),
    datasets: [
      {
        label: "Emotion Trend",
        data: filteredHistory.map(e => normalizeEmotion(e.emotion)),
        borderColor: "blue",
        backgroundColor: "lightblue",
        tension: 0.4,
        pointRadius: 4,
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    scales: {
      x: { type: "time" },
      y: { type: "category", labels: yCategories }
    }
  };

  const pieData = {
  labels: Object.keys(moodCounts),
  datasets: [
    {
      data: Object.values(moodCounts),
      backgroundColor: [
        "#ff6b6b", // angry
        "#ffd93d", // fear
        "#6c5ce7", // sad
        "#b2bec3", // neutral
        "#55efc4"  // happy
      ],
      borderWidth: 1,
    },
  ],
  };


  const mostFrequentMood =
    Object.keys(moodCounts).reduce((a, b) =>
      moodCounts[a] > moodCounts[b] ? a : b, "") || "N/A";

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Mood Dashboard</h2>

      <div className="chart-card">
        <h3>Emotion Trend</h3>
        <Line data={lineData} options={lineOptions} />
      </div>

      <div className="chart-card">
        <h3>Emotion Distribution</h3>
        <Pie data={pieData} />
      </div>

      <div className="summary-box">
        <p>Total Entries: {history.length}</p>
        <p>Most Frequent Mood: {mostFrequentMood}</p>
      </div>
    </div>
  );
}

export default MoodDashboard;
