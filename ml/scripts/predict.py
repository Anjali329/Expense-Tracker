import joblib
import sys
import json
from pathlib import Path

# -----------------------------
# Get project root (ml folder)
# -----------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# -----------------------------
# Model file paths
# -----------------------------
MODEL_PATH = BASE_DIR / "models" / "expense_classifier.joblib"
VECTORIZER_PATH = BASE_DIR / "models" / "tfidf_vectorizer.joblib"

# -----------------------------
# Load trained model
# -----------------------------
model = joblib.load(MODEL_PATH)

# -----------------------------
# Load TF-IDF vectorizer
# -----------------------------
vectorizer = joblib.load(VECTORIZER_PATH)

# -----------------------------
# Read description from command line
# -----------------------------
if len(sys.argv) < 2:
    print(json.dumps({
        "success": False,
        "message": "No description provided."
    }))
    sys.exit()

description = sys.argv[1]

# -----------------------------
# Convert text into TF-IDF features
# -----------------------------
X = vectorizer.transform([description])

# -----------------------------
# Predict category
# -----------------------------
prediction = model.predict(X)[0]

# -----------------------------
# Predict confidence
# -----------------------------
confidence = None

if hasattr(model, "predict_proba"):
    confidence = max(model.predict_proba(X)[0])

# -----------------------------
# Return JSON output
# -----------------------------
print(json.dumps({
    "success": True,
    "category": prediction,
    "confidence": round(float(confidence), 4) if confidence is not None else None
}))