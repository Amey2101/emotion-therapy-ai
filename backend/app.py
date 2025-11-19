from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from utils.responses import get_emotion_response
from datetime import datetime
import json
import pickle
import os

app = FastAPI()

# -------------------------
# CORS for React frontend
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Paths
# -------------------------
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # backend root
MODEL_PATH = os.path.join(BASE_DIR, "model", "emotion_model.pkl")
LOG_PATH = os.path.join(BASE_DIR, "mood_log.json")

# -------------------------
# Helper: Save mood to JSON log
# -------------------------
def save_mood(emotion):
    # Load existing log
    try:
        with open(LOG_PATH, "r") as f:
            data = json.load(f)
    except:
        data = []

    # Append new entry
    data.append({
        "emotion": emotion,
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

    # Save back to file
    with open(LOG_PATH, "w") as f:
        json.dump(data, f, indent=4)

# -------------------------
# Load ML model + vectorizer
# -------------------------
with open(MODEL_PATH, "rb") as f:
    model, vectorizer = pickle.load(f)

# -------------------------
# Pydantic model for input
# -------------------------
class UserInput(BaseModel):
    text: str

# -------------------------
# Analyze endpoint
# -------------------------
@app.post("/analyze")
def analyze(user_input: UserInput):
    text = user_input.text
    vector = vectorizer.transform([text])
    emotion = model.predict(vector)[0]

    # ✅ Save detected emotion
    save_mood(emotion)

    response = get_emotion_response(emotion)
    
    return {"emotion": emotion, "response": response}

# -------------------------
# History endpoint
# -------------------------
@app.get("/history")
def history():
    try:
        with open(LOG_PATH, "r") as f:
            data = json.load(f)
    except:
        data = []
    return data
