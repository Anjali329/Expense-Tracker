const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const { spawnSync } = require("child_process");

const pool = require("../config/db");

const uploadCSV = async (req, res) => {
  console.log(`📤 Upload started: ${req.file?.originalname}`);
  try {

    // Check Login
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Check CSV
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No CSV file uploaded"
      });
    }

    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())

      .on("data", (data) => {

        if (results.length >= 10) return;

        
        const normalized = {

          date:
            data["Date"] ||
            data["Txn Date"] ||
            data["Transaction Date"] ||
            data["transaction_date"] ||
            data["Date "] ||
            "",

          description:
            data["Description"] ||
            data["Narration"] ||
            data["Remarks"] ||
            data["merchant_category"] ||
            data["clean_description"] ||
            "",

          amount:
            data["Amount"] ||
            data["Debit"] ||
            data["Withdrawal Amt."] ||
            data["transaction_amount"] ||
            0
        };

        const pythonResult = spawnSync(
          "python",
          [
            path.join(process.cwd(), "../ml/scripts/predict.py"),
            normalized.description
          ],
          {
            cwd: process.cwd()
          }
        );

        

        const output = pythonResult.stdout.toString().trim();

        if (output) {

          const [category, confidence] = output.split("|");

          normalized.category = category;
          normalized.confidence = Number(confidence);

        } else {

          normalized.category = "Unknown";
          normalized.confidence = 0;

        }

        results.push(normalized);

      })

      .on("end", async () => {

        try {

          console.log(`✅ CSV Parsed Successfully (${results.length} rows)`);

          for (const transaction of results) {

            await pool.query(
              `
              INSERT INTO transactions
              (user_id, description, amount, category, confidence, date)
              VALUES ($1,$2,$3,$4,$5,$6)
              `,
              [
                req.user.id,
                transaction.description,
                transaction.amount,
                transaction.category,
                transaction.confidence,
                transaction.date || null
              ]
            );

          }

          console.log(`✅ ${results.length} transactions saved into database.`);
          res.status(200).json({
            success: true,
            message: "CSV Parsed Successfully",
            totalRows: results.length,
            data: results
          });

        } catch (err) {

          console.error("Database Error:", err);

          res.status(500).json({
            success: false,
            message: "Database Error"
          });

        }

      });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }
};

module.exports = {
  uploadCSV
};