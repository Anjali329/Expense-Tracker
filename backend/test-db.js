const pool = require("./config/db");

async function test() {
  try {
    console.log("Connecting...");

    const result = await pool.query("SELECT NOW()");

    console.log("✅ Database Connected Successfully");
    console.log(result.rows);

    await pool.end();

    console.log("Connection Closed");
  } catch (err) {
    console.error("Database Error:");
    console.error(err);
  }
}

test();