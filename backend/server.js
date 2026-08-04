const express = require("express");
const cors = require("cors");

const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const insightRoutes = require("./routes/insightRoutes");
const receiptRoutes = require("./routes/receiptRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("Incoming Request:", req.method, req.url);
  next();
});



app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/upload", uploadRoutes);
app.use("/insights",insightRoutes);
app.use("/receipt", receiptRoutes);

app.get("/ping", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running!"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {

  console.log(`🚀 Server running on http://localhost:${PORT}`);

  try {

    await pool.query("SELECT NOW()");
    console.log("✅ Database Connected");

  } catch (err) {

    console.error("Database Connection Failed");
    console.error(err);

  }

});