from datasets import load_dataset
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

print("Loading dataset...")
dataset = load_dataset("dair-ai/emotion")

# Extract training data
train_texts = dataset["train"]["text"]
train_labels_raw = dataset["train"]["label"]

# Map numeric labels to emotion names
label_map = {
    0: "sadness",
    1: "joy",
    2: "love",
    3: "anger",
    4: "fear",
    5: "surprise"
}

train_labels = [label_map[label] for label in train_labels_raw]

print("Vectorizing text...")
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(train_texts)

print("Training model...")
model = MultinomialNB()
model.fit(X, train_labels)

print("Saving model...")
with open("emotion_model.pkl", "wb") as f:
    pickle.dump((model, vectorizer), f)

print("✔ emotion_model.pkl CREATED SUCCESSFULLY!")
