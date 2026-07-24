const pool = require("../config/db");

// Add Transaction
const addTransaction = async (req, res) => {

    try {

        const { description, amount, category } = req.body;

        const userId = req.user.id;

        if (!description || !amount || !category) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });

        }

        await pool.query(

            `INSERT INTO transactions
            (user_id, description, amount, category)
            VALUES ($1,$2,$3,$4)`,

            [userId, description, amount, category]

        );

        res.status(201).json({

            success: true,
            message: "Transaction Added"

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};

// Get Transactions

const getTransactions = async (req, res) => {

    try {

        const userId = req.user.id;

        const result = await pool.query(

            "SELECT * FROM transactions WHERE user_id=$1 ORDER BY created_at DESC",

            [userId]

        );

        res.json({

            success: true,

            transactions: result.rows

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};

module.exports = {

    addTransaction,

    getTransactions

};