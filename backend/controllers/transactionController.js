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
    console.log("Decoded User:", req.user);

    const userId = req.user.id;

    console.log("User ID:", userId);

    console.log("========== DEBUG ==========");
console.log("User ID:", userId);

const allTransactions = await pool.query(`
  SELECT id, user_id, description
  FROM transactions
`);

console.log("All Transactions:");
console.table(allTransactions.rows);

const result = await pool.query(
  `
  SELECT *
  FROM transactions
  WHERE user_id = $1
  ORDER BY created_at DESC
  `,
  [userId]
);

console.log("Filtered Transactions:");
console.table(result.rows);
console.log("==========================");

    res.json({
      success: true,
      transactions: result.rows,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateTransactionCategory = async(req,res)=>{

    try{

        const {id}=req.params;
        const {category}=req.body;


        // 1. Get old category

        const oldData = await pool.query(
            `
            SELECT category
            FROM transactions
            WHERE id=$1
            `,
            [id]
        );


        if(oldData.rows.length===0){

            return res.status(404).json({
                message:"Transaction not found"
            });

        }



        const oldCategory =
        oldData.rows[0].category;



        // 2. Update transaction category

        await pool.query(
            `
            UPDATE transactions
            SET category=$1
            WHERE id=$2
            `,
            [
                category,
                id
            ]
        );



        // 3. Store feedback

        await pool.query(
            `
            INSERT INTO category_feedback
            (
                transaction_id,
                old_category,
                corrected_category
            )

            VALUES($1,$2,$3)

            `,
            [
                id,
                oldCategory,
                category
            ]
        );



        res.json({

            message:
            "Category updated and feedback stored"

        });


    }
    catch(error){

        console.log(error);

        res.status(500).json({
            message:"Server error"
        });

    }

}



module.exports={
    updateTransactionCategory
}

module.exports = {

    addTransaction,

    getTransactions , 

    updateTransactionCategory

};