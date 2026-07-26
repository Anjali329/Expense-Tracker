const express = require("express");
const router = express.Router();
const multer = require("multer");

const { uploadCSV } = require("../controllers/uploadController");
const authMiddleware = require("../middleware/authMiddleware");

// Store uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Protected Upload Route
router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  uploadCSV
);

module.exports = router;