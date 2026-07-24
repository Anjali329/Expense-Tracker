const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

    addTransaction,

    getTransactions

} = require("../controllers/transactionController");

router.post("/", authMiddleware, addTransaction);

router.get("/", authMiddleware, getTransactions);

module.exports = router;