const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("./db");

const app = express();




app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));




app.use(express.json());




app.get("/", (req, res) => {
  res.send("API Running ✅");
});


app.post("/api/signup", async (req, res) => {
  try {
    console.log("SIGNUP HIT");

    const { name, email, password, role } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {

      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({ message: "DB error" });
      }

      if (result.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, role || "member"],
        (err) => {
          if (err) {
            console.log("INSERT ERROR:", err);
            return res.status(500).json({ message: "Insert error" });
          }

          res.json({ message: "Signup successful" });
        }
      );
    });

  } catch (error) {
    console.log("SERVER ERROR:", error);
    res.status(500).json({ message: "Server crash" });
  }
});


app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
    });
  });
});


app.get("/api/members", (req, res) => {
  db.query("SELECT id, name, email FROM users WHERE role='member'", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});


app.post("/api/tasks", (req, res) => {
  const { title, assigned_to } = req.body;

  db.query(
    "INSERT INTO tasks (title, assigned_to) VALUES (?, ?)",
    [title, assigned_to],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Task assigned" });
    }
  );
});


app.get("/api/tasks", (req, res) => {
  db.query(
    `SELECT tasks.*, users.name 
     FROM tasks 
     JOIN users ON tasks.assigned_to = users.id`,
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json(result);
    }
  );
});


app.get("/api/my-tasks/:id", (req, res) => {
  const userId = req.params.id;

  db.query(
    "SELECT * FROM tasks WHERE assigned_to = ?",
    [userId],
    (err, result) => {
      if (err) {
        console.log("❌ DB ERROR:", err); // 👈 SEE REAL ERROR
        return res.status(500).json({ error: err.message });
      }

      res.json(result || []);
    }
  );
});

app.put("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;

  db.query(
    "UPDATE tasks SET status=? WHERE id=?",
    [status, taskId],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Status updated" });
    }
  );
});





const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});