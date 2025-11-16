from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import os

app = FastAPI()

# Correct model path (backend → project root → model/)
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "emotion_model.pkl")

# Load model + vectorizer
with open(MODEL_PATH, "rb") as f:
    model, vectorizer = pickle.load(f)

class UserInput(BaseModel):
    text: str

RESPONSES = {
    "anger": "I hear your frustration. Want to talk about what's upsetting you?",
    "disgust": "It seems something really bothered you. I'm here to listen.",
    "fear": "Things can feel overwhelming — you're not alone.",
    "joy": "That's amazing! I'm happy for you!",
    "neutral": "Thanks for sharing. Tell me more.",
    "sadness": "I'm sorry you're feeling this way. You're not alone — I'm here with you.",
    "surprise": "That sounds unexpected! How do you feel about it?"
}

@app.post("/analyze")
def analyze(user_input: UserInput):
    text = user_input.text
    vector = vectorizer.transform([text])
    emotion = model.predict(vector)[0]
    response = RESPONSES.get(emotion, "I'm here to listen, however you're feeling.")
    
    return {"emotion": emotion, "response": response}
