const Tesseract = require("tesseract.js");
const parseReceipt = require("../utils/ocrParser");
const predictCategory = require("../utils/mlPredict");
const pool = require("../config/db");

exports.uploadReceipt = async (req, res) => {

    try {

        // Check if image is uploaded
        if (!req.file) {

            return res.status(400).json({

                success: false,
                message: "No image uploaded"

            });

        }

        console.log("Uploaded File:", req.file.path);

        // OCR
        const result = await Tesseract.recognize(
            req.file.path,
            "eng"
        );

        console.log("✅ OCR Completed");

        // Parse OCR text
        const parsedData = parseReceipt(result.data.text);

        console.log("✅ Receipt Parsed");
        console.log(parsedData);

        // Predict category using ML model
        const prediction = predictCategory(
            parsedData.merchant || ""
        );

        console.log("✅ ML Prediction Completed");
        console.log(prediction);

        // Add prediction to parsedData
        parsedData.category = prediction.category;
        parsedData.confidence = prediction.confidence;

        // If OCR confidence is low, don't save automatically
        if (result.data.confidence < 60) {

            return res.status(200).json({

                success: true,
                manualEntryRequired: true,
                message: "OCR confidence is low. Please verify the details.",
                extractedText: result.data.text,
                ocrConfidence: result.data.confidence,
                parsedData

            });

        }

        // Save transaction into database
        console.log("✅ Saving into Database...");

        await pool.query(

            `INSERT INTO transactions
            (user_id, description, amount, category, confidence, date)
            VALUES ($1, $2, $3, $4, $5, $6)`,

            [

                req.user.id,
                parsedData.merchant,
                parsedData.amount || 0,
                parsedData.category,
                parsedData.confidence,
                parsedData.date || null

            ]

        );

        console.log("✅ Database Inserted Successfully");

        // Send success response
        res.status(200).json({

            success: true,

            extractedText: result.data.text,

            ocrConfidence: result.data.confidence,

            parsedData

        });

    } catch (error) {

        console.error("Receipt OCR Error:", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};