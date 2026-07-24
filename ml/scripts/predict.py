import joblib

# ==============================
# Load Model and Vectorizer
# ==============================

model = joblib.load("models/expense_classifier.joblib")
vectorizer = joblib.load("models/tfidf_vectorizer.joblib")

print("Model Loaded Successfully!")

# ==============================
# Confidence Threshold
# ==============================

THRESHOLD = 0.70

# ==============================
# User Input
# ==============================

description = input("\nEnter Transaction Description: ")

# ==============================
# Convert to TF-IDF
# ==============================

description_vector = vectorizer.transform([description])

# ==============================
# Prediction Probabilities
# ==============================

probabilities = model.predict_proba(description_vector)[0]

best_index = probabilities.argmax()

confidence = probabilities[best_index]

predicted_category = model.classes_[best_index]

# ==============================
# Final Output
# ==============================

print("\nPrediction Result")
print("----------------------------")

if confidence < THRESHOLD:
    print("Category   : Needs Review")
else:
    print(f"Category   : {predicted_category}")

print(f"Confidence : {confidence:.2%}")