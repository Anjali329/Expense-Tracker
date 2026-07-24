const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);

// Connect to PostgreSQL
pool.connect()
  .then(() => {
    console.log("✅ Database Connected");
  })
  .catch((err) => {
    console.error(err);
  });

// Test Route
app.get("/ping", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running!"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});