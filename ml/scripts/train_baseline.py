import pandas as pd

from sklearn.model_selection import train_test_split

from sklearn.feature_extraction.text import TfidfVectorizer

from sklearn.linear_model import LogisticRegression

from sklearn.naive_bayes import MultinomialNB

from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    classification_report
)

df = pd.read_csv("data/processed/cleaned_expense_transactions.csv")

print(df.head())

print("\nDataset Shape:")
print(df.shape)

print("\nColumn Names:")
print(df.columns)

# Features (Input)
X = df["clean_description"]

# Target (Output)
y = df["Category"]

print("\nFirst 5 Text Descriptions:")
print(X.head())

print("\nFirst 5 Categories:")
print(y.head())

# Convert text into TF-IDF features
vectorizer = TfidfVectorizer()

X = vectorizer.fit_transform(X)

print("\nTF-IDF Matrix Shape:")
print(X.shape)

print("\nNumber of Unique Words:")
print(len(vectorizer.get_feature_names_out()))

print("\nFirst 20 Words in Vocabulary:")
print(vectorizer.get_feature_names_out()[:20])

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("\nTraining Data Shape:")
print(X_train.shape)

print("\nTesting Data Shape:")
print(X_test.shape)

print("\nTraining Labels:")
print(y_train.shape)

print("\nTesting Labels:")
print(y_test.shape)

# -----------------------------
# Logistic Regression Model
# -----------------------------

print("\n==============================")
print("Training Logistic Regression...")
print("==============================")

lr_model = LogisticRegression(max_iter=1000)

lr_model.fit(X_train, y_train)

print("Model Training Completed!")

# ==============================
# Train Naive Bayes
# ==============================

print("\n==============================")
print("Training Naive Bayes...")
print("==============================")

nb_model = MultinomialNB()

nb_model.fit(X_train, y_train)

print("Naive Bayes Training Completed!")

# Predictions
nb_predictions = nb_model.predict(X_test)

# Accuracy
nb_accuracy = accuracy_score(y_test, nb_predictions)

print("\nNaive Bayes Accuracy:")
print(f"{nb_accuracy:.4f}")

# Classification Report
print("\nNaive Bayes Classification Report:")
print(classification_report(y_test, nb_predictions))

# Confusion Matrix
print("\nNaive Bayes Confusion Matrix:")
print(confusion_matrix(y_test, nb_predictions))

# -----------------------------
# Predict on Test Data
# -----------------------------

lr_predictions = lr_model.predict(X_test)

print("\nFirst 20 Predictions:")
print(lr_predictions[:20])

print("\nFirst 20 Actual Categories:")
print(y_test.iloc[:20].values)

# -----------------------------
# Calculate Accuracy
# -----------------------------

accuracy = accuracy_score(y_test, lr_predictions)

print("\nLogistic Regression Accuracy:")
print(f"{accuracy:.4f}")

# -----------------------------
# Classification Report
# -----------------------------

print("\nClassification Report:")
print(classification_report(y_test, lr_predictions))

# -----------------------------
# Confusion Matrix
# -----------------------------

cm = confusion_matrix(y_test, lr_predictions)

print("\nConfusion Matrix:")
print(cm)

print("\nCategory Order:")
print(lr_model.classes_)