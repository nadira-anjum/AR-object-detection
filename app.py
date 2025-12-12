from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import time

app = Flask(__name__)
CORS(app)  # Allow React frontend to communicate

# Folder to store detection logs
LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)

@app.route("/")
def home():
    return jsonify({
        "status": "Backend is running",
        "endpoints": ["/log"]
    })

# -------------------------------------------------------
# LOG DETECTIONS FROM FRONTEND
# -------------------------------------------------------
@app.route("/log", methods=["POST"])
def log_detection():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"status": "error", "message": "No data received"}), 400

        timestamp = int(time.time())
        filename = f"log_{timestamp}.json"
        filepath = os.path.join(LOG_DIR, filename)

        with open(filepath, "w") as f:
            json.dump(data, f, indent=4)

        return jsonify({
            "status": "success",
            "message": "Detection log saved",
            "file": filename
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# -------------------------------------------------------
# RUN SERVER
# -------------------------------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
