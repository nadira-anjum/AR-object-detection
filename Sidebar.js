import React from "react";

export default function Sidebar(){
  return (
    <div className="sidebar">
      <h2>Overview</h2>
      <p className="muted">This demo detects 5 target classes (person, cell phone, bottle, keyboard, cup) using COCO-SSD running in your browser. It overlays glowing boxes and labels in realtime.</p>

      <h3>How to use</h3>
      <ol>
        <li>Allow camera access</li>
        <li>Point camera at objects</li>
        <li>Click Screenshot to save a snapshot</li>
      </ol>

      <h3>Project Requirements</h3>
      <ul>
        <li>Real-time object detection (3–5 objects)</li>
        <li>AR overlay + user interaction</li>
        <li>Activity detection for persons (see history)</li>
      </ul>
    </div>
  );
}
