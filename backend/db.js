const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// optional test
pool.getConnection((err, conn) => {
  if (err) {
    console.log("❌ DB connection failed:", err);
  } else {
    console.log("✅ DB connected");
    conn.release();
  }
});

module.exports = pool;