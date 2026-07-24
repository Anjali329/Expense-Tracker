import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer


def clean_text(text):
    text = str(text).lower()                    # Lowercase
    text = re.sub(r'\d+', '', text)             # Remove numbers
    text = re.sub(r'[^a-zA-Z\s]', ' ', text)    # Remove special characters
    text = re.sub(r'\s+', ' ', text).strip()    # Remove extra spaces
    return text


def extract_merchant(text):
    words = text.split()

    if len(words) > 0:
        return words[0]

    return ""

def extract_merchant(text):
    ignore = {"upi", "pos", "atm", "neft", "imps", "rtgs"}

    words = text.split()

    for word in words:
        if word not in ignore:
            return word

    return ""

df = pd.read_csv("data/raw/expense_transactions.csv")

df["clean_description"] = df["Description"].apply(clean_text)
print(df[["Description","clean_description"]].head(10))

df["merchant"] = df["clean_description"].apply(extract_merchant)
print(df[["clean_description", "merchant"]].head(10))

df["Date"] = pd.to_datetime(df["Date"])
df["day_of_week"] = df["Date"].dt.dayofweek
print(df[["Date", "day_of_week"]].head())

vectorizer = TfidfVectorizer(max_features=100)

tfidf_matrix = vectorizer.fit_transform(df["clean_description"])
print("TF-IDF Shape:", tfidf_matrix.shape)
print(vectorizer.get_feature_names_out()[:10])

# Create TF-IDF vectorizer

print("TF-IDF Matrix Shape:", tfidf_matrix.shape)

print("\nSample Features:")
print(vectorizer.get_feature_names_out()[:20])

numeric_features = df[["Amount", "day_of_week"]]

print("\nNumeric Features:")

print(numeric_features.head())

print(df.head())

print(df.columns)

df.to_csv(
    "data/processed/cleaned_expense_transactions.csv",
    index=False
)

print("Cleaned dataset saved successfully!")