import React from "react";

export default function HistoryPanel({ history }) {
  return (
    <div className="history-panel">
      <h3>Detection History</h3>
      {history.length === 0 && <p>No detections yet.</p>}

      {history.map((entry, i) => (
        <div key={i} className="history-item">
          <strong>{entry.time}</strong>
          <ul>
            {entry.items.map((obj, j) => (
              <li key={j}>
                {obj.class}
                {obj.class === "person" && obj.activity
                  ? ` – ${obj.activity}`
                  : ""}{" "}
                – {Math.round(obj.score * 100)}%
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
