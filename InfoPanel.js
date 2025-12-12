import React from "react";
import ThreeModel from "./ThreeModel";

const IDEAS = {
  person:
    "A person is detected. The system estimates their activity based on motion and position.",
  "cell phone":
    "Smart device detected, possibly used for communication or AR interaction.",
  bottle:
    "Bottle detected. Could be part of a health, hydration or tracking scenario.",
  cup:
    "Cup detected. Common everyday object used in many AR demos and UI overlays.",
  keyboard:
    "Keyboard detected. Represents workstation or productivity environment."
};

export default function InfoPanel({ selected }) {
  if (!selected) {
    return (
      <div className="info-panel">
        <h3>Object Info</h3>
        <p>Select an object by clicking on its AR bounding box.</p>
      </div>
    );
  }

  const idea = IDEAS[selected.class] || "No additional information available.";
  const confidence = Math.round((selected.score || 0) * 100);

  return (
    <div className="info-panel">
      <h3>{selected.class.toUpperCase()}</h3>

      <p>{idea}</p>

      {selected.class === "person" && selected.activity && (
        <p>
          <strong>Estimated Activity:</strong> {selected.activity}
        </p>
      )}

      <p>
        <strong>Confidence:</strong> {confidence}%
      </p>

      <div className="confidence">
        <div className="bar">
          <div className="fill" style={{ width: `${confidence}%` }} />
        </div>
      </div>

      <h4 style={{ marginTop: "20px" }}>3D Model Preview</h4>
      <p>This 3D model represents the detected object.</p>

      {/* ✅ THIS IS THE IMPORTANT FIX */}
      <ThreeModel objectClass={selected.class} />
    </div>
  );
}
