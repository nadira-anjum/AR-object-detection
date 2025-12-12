// ------------------------------------------------------------
// ActivityDetection.js
// Simple heuristic-based activity recognition for a detected person.
// Uses bounding-box movement, size, and vertical location.
// ------------------------------------------------------------

function boxMovement(currentBox, previousBox) {
  if (!previousBox) return 0;
  const [x, y] = currentBox;
  const [px, py] = previousBox;
  return Math.sqrt((x - px) ** 2 + (y - py) ** 2);
}

// bbox = [x, y, width, height]
// prev = { bbox: [...] } or null
export default function estimateActivity(bbox, prev) {
  if (!bbox) return "unknown";

  const [x, y, width, height] = bbox;
  const movement = boxMovement([x, y], prev ? prev.bbox : null);

  const isClose = height > 300;   // big box → close to camera
  const isLow = y > 280;          // low in frame → likely sitting

  if (movement > 20) return "walking";
  if (isLow && movement < 5) return "sitting";
  if (isClose) return "close & talking";

  return "standing";
}
