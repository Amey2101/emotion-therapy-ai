import json
import os
import random

RESPONSES_DIR = os.path.join(os.path.dirname(__file__), "..", "responses")

def get_emotion_response(emotion):
    filename = os.path.join(RESPONSES_DIR, f"{emotion.lower()}.json")
    
    if not os.path.exists(filename):
        filename = os.path.join(RESPONSES_DIR, "neutral.json")
    
    with open(filename, "r", encoding="utf-8") as f:
        responses = json.load(f)
    
    return random.choice(responses)
