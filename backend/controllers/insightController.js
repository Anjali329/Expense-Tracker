const pool = require("../config/db");

const getSummary = async (req, res) => {
  try {
    // Total Income
    const incomeResult = await pool.query(`
      SELECT COALESCE(SUM(amount),0) AS total
      FROM transactions
      WHERE category = 'Income'
    `);

    // Total Expense
    const expenseResult = await pool.query(`
      SELECT COALESCE(SUM(amount),0) AS total
      FROM transactions
      WHERE category != 'Income'
    `);

    // Category Spend
    const categorySpend = await pool.query(`
      SELECT
        category,
        SUM(amount) AS total
      FROM transactions
      WHERE category != 'Income'
      GROUP BY category
      ORDER BY total DESC
    `);

    // Monthly Spend
    const monthlySpend = await pool.query(`
      SELECT
        TO_CHAR(date, 'YYYY-MM') AS month,
        SUM(amount) AS total
      FROM transactions
      GROUP BY month
      ORDER BY month
    `);

    res.json({
      totalIncome: incomeResult.rows[0].total,
      totalExpense: expenseResult.rows[0].total,
      categorySpend: categorySpend.rows,
      monthlySpend: monthlySpend.rows,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to generate insights",
    });
  }
};

module.exports = {
  getSummary,
};