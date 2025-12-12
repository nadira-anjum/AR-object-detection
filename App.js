import React, { useState } from "react";
import VideoPanel from "./VideoPanel";
import InfoPanel from "./InfoPanel";
import HistoryPanel from "./HistoryPanel";

export default function App() {
  const [selectedObject, setSelectedObject] = useState(null);
  const [history, setHistory] = useState([]);

  return (
    <div className="app">
      <header className="topbar">AR Object Detection System</header>

      <main className="main-layout">
        <section className="left">
          <VideoPanel
            onSelect={setSelectedObject}
            onHistoryUpdate={setHistory}
          />
        </section>

        <section className="right">
          <InfoPanel selected={selectedObject} />
          <HistoryPanel history={history} />
        </section>
      </main>

      <footer className="footer">
        CMS22301 – Advanced Computer Vision – 2025/26
      </footer>
    </div>
  );
}
