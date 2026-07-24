import pandas as pd

from sklearn.model_selection import train_test_split

from sklearn.feature_extraction.text import TfidfVectorizer

from sklearn.linear_model import LogisticRegression

from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    f1_score
)

import joblib

# ==========================================
# Load Dataset
# ==========================================

df = pd.read_csv("data/processed/cleaned_expense_transactions.csv")
# If your file name is processed_expense_transactions.csv,
# replace the above line accordingly.

print(df.head())

print("\nDataset Loaded Successfully!")

# ==========================================
# Input and Output
# ==========================================

x = df["clean_description"]
y = df["Category"]

# ==========================================
# TF-IDF Vectorization
# ==========================================

vectorizer = TfidfVectorizer()

X = vectorizer.fit_transform(x)

# ==========================================
# Train-Test Split
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# ==========================================
# Logistic Regression
# ==========================================

print("\n===================================")
print("Training Logistic Regression...")
print("===================================")

lr = LogisticRegression(max_iter=1000)

lr.fit(X_train, y_train)

print("Logistic Regression Training Completed!")

lr_predictions = lr.predict(X_test)

lr_accuracy = accuracy_score(y_test, lr_predictions)

print("\nLogistic Regression Accuracy")
print(lr_accuracy)

# ==========================================
# Random Forest
# ==========================================

print("\n===================================")
print("Training Random Forest...")
print("===================================")

rf = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

rf.fit(X_train, y_train)

print("Random Forest Training Completed!")

rf_predictions = rf.predict(X_test)

rf_accuracy = accuracy_score(y_test, rf_predictions)

print("\nRandom Forest Accuracy")
print(rf_accuracy)

# ==========================================
# Model Comparison
# ==========================================

print("\n===================================")
print("Model Comparison")
print("===================================")

print(f"Logistic Regression Accuracy : {lr_accuracy:.4f}")
print(f"Random Forest Accuracy       : {rf_accuracy:.4f}")

# ==========================================
# Weighted F1 Scores
# ==========================================

lr_f1 = f1_score(
    y_test,
    lr_predictions,
    average="weighted"
)

rf_f1 = f1_score(
    y_test,
    rf_predictions,
    average="weighted"
)

print("\n===================================")
print("Weighted F1 Scores")
print("===================================")

print(f"Logistic Regression : {lr_f1:.4f}")
print(f"Random Forest       : {rf_f1:.4f}")

# ==========================================
# Category-wise F1 Scores
# ==========================================

print("\n===================================")
print("Logistic Regression Classification Report")
print("===================================")

print(classification_report(y_test, lr_predictions))

print("\n===================================")
print("Random Forest Classification Report")
print("===================================")

print(classification_report(y_test, rf_predictions))

# ==========================================
# Select Best Model
# ==========================================

if rf_f1 > lr_f1:
    best_model = rf
    print("\n✅ Best Model Selected: Random Forest")
else:
    best_model = lr
    print("\n✅ Best Model Selected: Logistic Regression")

# ==========================================
# Save Best Model
# ==========================================

joblib.dump(best_model, "models/expense_classifier.joblib")
joblib.dump(vectorizer, "models/tfidf_vectorizer.joblib")

print("\n===================================")
print("Best Model Saved Successfully!")
print("===================================")

print("Saved:")
print("- models/expense_classifier.joblib")
print("- models/tfidf_vectorizer.joblib")