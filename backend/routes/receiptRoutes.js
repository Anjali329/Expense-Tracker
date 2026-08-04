const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadReceipt");
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/receiptController");

router.post(

    "/",

    auth,

    upload.single("receipt"),

    controller.uploadReceipt

);

module.exports = router;