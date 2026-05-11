const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const verifyToken = require("./authMiddleware");
const db = require("./db");
require("dotenv").config();

const app = express();
app.use(cors()); //middleware to enable CORS for all routes
app.use(express.json());

// Serve static files from the uploads folder
app.use("/uploads", express.static("uploads"));

// ================= MULTER CONFIG (ONLY DECLARE ONCE) =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ================= REGISTER =================
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
    );
    //create a JWT token with the user's ID as the payload, using a secret key from environment variables and setting an expiration time of 1 hour

    const token = jwt.sign(
      { userId: result.insertId },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    res.status(201).json({ message: "User registered successfully!", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration" });
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
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    if (user.status === "blocked") {
      return res.status(403).json({ message: "Your account has been blocked" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.json({ message: "Login successful!", token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ================= PROFILE =================
app.get("/profile", verifyToken, async (req, res) => {
  try {
    const [users] = await db.execute(
      `
      SELECT 
        id,
        username,
        email,
        role,
        status,
        profile_image
      FROM users
      WHERE id = ?
      `,
      [req.user.userId],
    );
    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.json({
      user: users[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching profile",
    });
  }
});

// ================= PROFILE UPDATE =================
app.put("/update-profile",verifyToken,upload.single("profile_image"), // Use the middleware here
  async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const userId = req.user.userId;
      let imagePath = null;

      if (req.file) {
        imagePath = req.file.filename;
      }
      const [users] = await db.execute("SELECT * FROM users WHERE id = ?", [
        userId,
      ]);
      const currentUser = users[0];
      let updatedPassword = currentUser.password;
      if (password && password.trim() !== "") {
        updatedPassword = await bcrypt.hash(password, 10);
      }
      const finalImage = imagePath || currentUser.profile_image;
      await db.execute(
        `UPDATE users SET username = ?, email = ?, password = ?, profile_image = ? WHERE id = ?`,
        [username, email, updatedPassword, finalImage, userId],
      );

      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error updating profile" });
    }
  },
);

// ================= ADMIN ROUTES =================
app.get("/admin/users", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    const [users] = await db.execute(
      "SELECT id, username, email, role, status, created_at FROM users ORDER BY id ASC",
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Admin routes for blocking, unblocking, and deleting users. Each route checks if the user has an admin role before performing the action. If the user is not an admin, a 403 Forbidden response is returned. If the action is successful, a success message is returned. If there's an error during the database operation, a 500 Internal Server Error response is returned with an error message.
app.put("/admin/block/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    await db.execute("UPDATE users SET status = 'blocked' WHERE id = ?", [
      req.params.id,
    ]);
    res.json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error blocking user" });
  }
});

app.put("/admin/unblock/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    await db.execute("UPDATE users SET status = 'active' WHERE id = ?", [
      req.params.id,
    ]);
    res.json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unblocking user" });
  }
});

app.delete("/admin/delete/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    await db.execute("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

// ================= SERVER =================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
