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
    // 1. Check if user already exists
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert user into database
    const [result] = await db.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
    );

    // 4. Create token immediately after registration
    const token = jwt.sign(
      { userId: result.insertId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // 5. Send response
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
    // 1. Find user by email
    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    const user = users[0];

    // 2. Check if user exists
    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    // 4. Create token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 5. Send token
    res.json({
      message: "Login successful!",
      token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error during login",
    });
  }
});

// ================= PROTECTED PROFILE =================
app.get("/profile", verifyToken, async (req, res) => {
  try {
    const [users] = await db.execute(
      "SELECT id, username, email, created_at FROM users WHERE id = ?",
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

// ================= SERVER =================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
