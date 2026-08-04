function parseReceipt(text) {

    let merchant = null;
    let amount = null;
    let date = null;

    // Split OCR text into individual lines
    const lines = text
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);

    // Merchant: first non-empty line
    const ignoreWords = [
        "student copy",
        "tax invoice",
        "invoice",
        "receipt",
        "cash memo",
        "gstin"
    ];

for (const line of lines) {

    const lower = line.toLowerCase();

    const shouldIgnore = ignoreWords.some(word =>
        lower.includes(word)
    );

    if (!shouldIgnore && line.length > 3) {
        merchant = line;
        break;
    }
}

    // Amount
    const amountRegex = /\d+\.\d{2}/;

    const amountMatch = text.match(amountRegex);

    if (amountMatch) {
        amount = amountMatch[0];
    }

    // Date
    const dateRegex = /\d{2}[\/\-]\d{2}[\/\-]\d{4}/;

    const dateMatch = text.match(dateRegex);

    if (dateMatch) {
        date = dateMatch[0];
    }

    return {

        merchant,
        amount,
        date

    };

}

module.exports = parseReceipt;