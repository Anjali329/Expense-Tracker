const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
addTransaction,
getTransactions,
updateTransactionCategory
}
=require("../controllers/transactionController");

router.post("/", authMiddleware, addTransaction);

router.get("/", authMiddleware, getTransactions);

router.patch(
"/:id",
updateTransactionCategory
);

module.exports = router;