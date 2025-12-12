// --------------------------------------------------------
// VideoPanel.js (FINAL)
// - Starts webcam
// - Runs COCO-SSD for real-time detection
// - Draws AR overlays with EMOJI icons
// - Estimates person activity
// - Lets user click boxes to select an object
// - Sends detection history up to parent
// --------------------------------------------------------

import React, { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import estimateActivity from "./ActivityDetection";

const ALLOWED = ["person", "cell phone", "bottle", "cup", "keyboard"];

// Emoji icons per class
const ICONS = {
  person: "🧍",
  "cell phone": "📱",
  bottle: "🍼",
  cup: "🥤",
  keyboard: "⌨️"
};

export default function VideoPanel({ onSelect, onHistoryUpdate }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [model, setModel] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [showAR, setShowAR] = useState(true);

  const lastPersonRef = useRef(null);
  const detectionsRef = useRef([]);

  // ------------------ load model once ---------------------
  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const loaded = await cocoSsd.load();
      setModel(loaded);
      console.log("✅ COCO-SSD model loaded");
    };
    loadModel();
  }, []);

  // ------------------ camera start/stop -------------------
  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera not supported in this browser.");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
      audio: false
    });

    const video = videoRef.current;
    video.srcObject = stream;
    video.setAttribute("playsinline", true);

    await new Promise((resolve) => {
      video.onloadedmetadata = () => {
        // Force known resolution to avoid 0x0 errors
        video.width = 640;
        video.height = 480;
        video.play();
        resolve();
      };
    });

    console.log("🎥 Camera started at 640 x 480");
  };

  const stopCamera = () => {
    const video = videoRef.current;
    const stream = video.srcObject;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      video.srcObject = null;
    }
    console.log("🛑 Camera stopped");
  };

  // ------------------ detection loop ----------------------
  useEffect(() => {
    if (!detecting || !model) return;

    let rafId;

    const detectLoop = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // SAFETY: ensure video frame is valid
      if (
        !video ||
        video.readyState !== 4 ||
        video.videoWidth === 0 ||
        video.videoHeight === 0
      ) {
        rafId = requestAnimationFrame(detectLoop);
        return;
      }

      const predictions = await model.detect(video);
      const filtered = predictions.filter((p) => ALLOWED.includes(p.class));
      detectionsRef.current = filtered;

      // Add activity for people
      filtered.forEach((obj) => {
        if (obj.class === "person") {
          const activity = estimateActivity(obj.bbox, lastPersonRef.current);
          obj.activity = activity;
          lastPersonRef.current = { bbox: [...obj.bbox] };
        }
      });

      drawDetections(filtered, video, canvas);

      // Update history
      if (filtered.length > 0) {
        const record = {
          time: new Date().toLocaleTimeString(),
          items: filtered
        };
        onHistoryUpdate((prev) => [record, ...prev.slice(0, 20)]);
      }

      rafId = requestAnimationFrame(detectLoop);
    };

    detectLoop();

    return () => cancelAnimationFrame(rafId);
  }, [detecting, model, showAR, onHistoryUpdate]);

  // ------------------ drawing function --------------------
  const drawDetections = (items, video, canvas) => {
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!showAR) return;

    items.forEach((obj) => {
      const [x, y, w, h] = obj.bbox;
      const confidence = Math.round(obj.score * 100);
      const icon = ICONS[obj.class] || "";

      let label = `${icon} ${obj.class.toUpperCase()} • ${confidence}%`;

      if (obj.class === "person" && obj.activity) {
        label = `${icon} PERSON • ${obj.activity} • ${confidence}%`;
      }

      // Box
      ctx.strokeStyle = "#00e5ff";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#00e5ff";
      ctx.shadowBlur = 12;
      ctx.strokeRect(x, y, w, h);
      ctx.shadowBlur = 0;

      // Label background
      ctx.font = "14px Arial";
      const textWidth = ctx.measureText(label).width;
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(x, y - 24, textWidth + 12, 20);

      // Label text
      ctx.fillStyle = "#ffffff";
      ctx.fillText(label, x + 6, y - 8);
    });
  };

  // ------------------ canvas click select -----------------
  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const detections = detectionsRef.current;
    if (!detections || detections.length === 0) return;

    const clicked = detections.find((obj) => {
      const [x, y, w, h] = obj.bbox;
      return cx >= x && cx <= x + w && cy >= y && cy <= y + h;
    });

    if (clicked) onSelect(clicked);
  };

  // ------------------ button handlers --------------------
  const onStart = async () => {
    if (!model) {
      alert("Model is still loading. Please wait.");
      return;
    }
    await startCamera();
    setDetecting(true);
  };

  const onStop = () => {
    setDetecting(false);
    stopCamera();
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // ------------------ render -----------------------------
  return (
    <div className="video-panel">
      <div className="video-wrapper">
        <video ref={videoRef} muted autoPlay playsInline />
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
        />
      </div>

      <div className="controls">
        <button onClick={onStart} disabled={detecting}>
          Start Detection
        </button>
        <button onClick={onStop} disabled={!detecting}>
          Stop Detection
        </button>
        <button onClick={() => setShowAR((v) => !v)}>
          {showAR ? "Hide AR" : "Show AR"}
        </button>
      </div>
    </div>
  );
}
