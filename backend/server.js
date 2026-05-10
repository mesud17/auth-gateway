const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const verifyToken = require("./authMiddleware");
const db = require("./db");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

// ================= REGISTER =================
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
    );

    const token = jwt.sign(
      {
        userId: result.insertId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    res.status(201).json({
      message: "User registered successfully!",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error during registration",
    });
  }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = users[0];
    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }
    // BLOCKED USER CHECK
    if (user.status === "blocked") {
      return res.status(403).json({
        message: "Your account has been blocked",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    res.json({
      message: "Login successful!",
      token,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error during login",
    });
  }
});

// ================= PROFILE =================
app.get("/profile", verifyToken, async (req, res) => {
  try {
    const [users] = await db.execute(
      "SELECT id, username, email, role, status, created_at FROM users WHERE id = ?",
      [req.user.userId],
    );
    res.json({
      message: "Welcome to your protected profile!",
      user: users[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching profile",
    });
  }
});
// ================= ADMIN : GET ALL USERS =================
app.get("/admin/users", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }
    const [users] = await db.execute(
      "SELECT id, username, email, role, status, created_at FROM users ORDER BY id DESC",
    );
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching users",
    });
  }
});
// ================= ADMIN : BLOCK USER =================
app.put("/admin/block/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }
    const userId = req.params.id;
    await db.execute("UPDATE users SET status = 'blocked' WHERE id = ?", [
      userId,
    ]);
    res.json({ message: "User blocked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error blocking user",
    });
  }
});
// ================= ADMIN : UNBLOCK USER =================
app.put("/admin/unblock/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }
    const userId = req.params.id;
    await db.execute("UPDATE users SET status = 'active' WHERE id = ?", [
      userId,
    ]);
    res.json({
      message: "User unblocked successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error unblocking user",
    });
  }
});
// ================= ADMIN : DELETE USER =================
app.delete("/admin/delete/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }
    const userId = req.params.id;
    await db.execute("DELETE FROM users WHERE id = ?", [userId]);
    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting user",
    });
  }
});

// ================= SERVER =================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
