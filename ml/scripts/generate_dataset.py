import os
import random
from datetime import datetime, timedelta

import pandas as pd

# ======================================================
# PROJECT PATHS
# ======================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ASSETS_DIR = os.path.join(BASE_DIR, "dataset_assets")

OUTPUT_DIR = os.path.join(BASE_DIR, "data", "raw")

os.makedirs(OUTPUT_DIR, exist_ok=True)

# ======================================================
# CATEGORIES
# ======================================================

CATEGORIES = [
    "food",
    "shopping",
    "travel",
    "bills",
    "healthcare",
    "entertainment",
    "fuel",
    "education",
    "rent",
    "investment",
    "income",
    "other"
]

# ======================================================
# AMOUNT RANGES
# ======================================================

AMOUNT_RANGES = {
    "food": (100, 1500),
    "shopping": (300, 25000),
    "travel": (100, 8000),
    "bills": (300, 12000),
    "healthcare": (200, 15000),
    "entertainment": (100, 5000),
    "fuel": (200, 5000),
    "education": (500, 100000),
    "rent": (5000, 50000),
    "investment": (1000, 200000),
    "income": (10000, 250000),
    "other": (50, 10000)
}

# ======================================================
# PAYMENT METHODS
# ======================================================

PAYMENT_METHODS = [
    "UPI",
    "Credit Card",
    "Debit Card",
    "Cash",
    "Net Banking",
    "Wallet"
]

# ======================================================
# LOAD DESCRIPTIONS
# ======================================================

def load_descriptions():

    descriptions = {}

    for category in CATEGORIES:

        file_path = os.path.join(
            ASSETS_DIR,
            f"{category}.txt"
        )

        with open(file_path, "r", encoding="utf-8") as f:

            descriptions[category] = [
                line.strip()
                for line in f
                if line.strip()
            ]

    return descriptions

# ======================================================
# GENERATE TRANSACTION ID
# ======================================================

def generate_transaction_id(index):

    return f"TXN{index:06d}"

# ======================================================
# RANDOM DATE
# ======================================================

def random_date():

    start = datetime(2024, 1, 1)
    end = datetime(2026, 7, 1)

    total_days = (end - start).days

    random_days = random.randint(0, total_days)

    return (start + timedelta(days=random_days)).strftime("%Y-%m-%d")

# ======================================================
# RANDOM AMOUNT
# ======================================================

def random_amount(category):

    low, high = AMOUNT_RANGES[category]

    return round(random.uniform(low, high), 2)

# ======================================================
# RANDOM PAYMENT METHOD
# ======================================================

def random_payment_method():

    return random.choice(PAYMENT_METHODS)


# ======================================================
# DESCRIPTION VARIATIONS
# ======================================================

def description_variation(description):

    options = [

        description,

        description.upper(),

        f"UPI {description.upper()}",

        f"POS {description.upper()}",

        f"{description.upper()} #{random.randint(1000,9999)}",

        f"{description.upper()} PUNE",

        f"{description.upper()} INDIA",

        f"{description.upper()} ONLINE"

    ]

    return random.choice(options)


# ======================================================
# GENERATE ONE TRANSACTION
# ======================================================

def generate_transaction(index, descriptions):

    # Random category
    category = random.choice(CATEGORIES)

    # Random description from that category
    description = random.choice(descriptions[category])

    # Apply variation
    description = description_variation(description)

    transaction = {
        "Transaction_ID": generate_transaction_id(index),
        "Date": random_date(),
        "Description": description,
        "Amount": random_amount(category),
        "Payment_Method": random_payment_method(),
        "Category": category.capitalize()
    }

    return transaction

# ======================================================
# GENERATE DATASET
# ======================================================

def generate_dataset(num_rows=10000):

    descriptions = load_descriptions()

    transactions = []

    for i in range(1, num_rows + 1):

        transaction = generate_transaction(i, descriptions)

        transactions.append(transaction)

    df = pd.DataFrame(transactions)

    return df
# ======================================================
# MAIN
# ======================================================

if __name__ == "__main__":

    print("\nGenerating Dataset...\n")

    df = generate_dataset(10000)

    output_file = os.path.join(
        OUTPUT_DIR,
        "expense_transactions.csv"
    )

    df.to_csv(output_file, index=False)

    print("Dataset Generated Successfully!")

    print(f"\nSaved to:\n{output_file}")

    print("\nFirst 10 Rows:\n")

    print(df.head(10))

    print("\nDataset Shape:")

    print(df.shape)