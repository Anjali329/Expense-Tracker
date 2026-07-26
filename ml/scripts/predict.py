import joblib
import sys
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(
    os.path.join(BASE_DIR, "../models/expense_classifier.joblib")
)

vectorizer = joblib.load(
    os.path.join(BASE_DIR, "../models/tfidf_vectorizer.joblib")
)

THRESHOLD = 0.70

description = sys.argv[1]

description_vector = vectorizer.transform([description])

probabilities = model.predict_proba(description_vector)[0]

best_index = probabilities.argmax()

confidence = probabilities[best_index]

predicted_category = model.classes_[best_index]

if confidence < THRESHOLD:
    predicted_category = "Needs Review"

print(f"{predicted_category}|{confidence}")