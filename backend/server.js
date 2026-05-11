const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const verifyToken = require("./authMiddleware");
const adminOnly = require("./adminMiddleware");
const db = require("./db");
require("dotenv").config();

const app = express();

// ================= CORS =================
// Restrict to your frontend origin only
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Serve uploaded profile images as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= RATE LIMITING =================
// Limit login attempts to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: "Too many login attempts. Please try again later." },
});

// ================= MULTER CONFIG =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Only allow image uploads, max 2MB
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
    cb(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// ================= REGISTER =================
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Input validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters" });
  }

  try {
    const [existingUser] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    // Create a JWT token with the user's ID as the payload
    const token = jwt.sign(
      { userId: result.insertId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "User registered successfully!", token });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// ================= LOGIN =================
app.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const [users] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const user = users[0];

    // Use a generic message to avoid leaking whether an email exists
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (user.status === "blocked") {
      return res.status(403).json({ message: "Your account has been blocked" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful!", token, role: user.role });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ================= PROFILE =================
app.get("/profile", verifyToken, async (req, res) => {
  try {
    const [users] = await db.execute(
      `SELECT id, username, email, role, status, profile_image
       FROM users WHERE id = ?`,
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// ================= PROFILE UPDATE =================
app.put(
  "/update-profile",
  verifyToken,
  upload.single("profile_image"),
  async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const userId = req.user.userId;

      // Input validation
      if (!username || !email) {
        return res
          .status(400)
          .json({ message: "Username and email are required" });
      }

      // Check if email is already taken by a different user
      const [emailCheck] = await db.execute(
        "SELECT id FROM users WHERE email = ? AND id != ?",
        [email, userId]
      );
      if (emailCheck.length > 0) {
        return res.status(400).json({ message: "Email is already in use" });
      }

      const [users] = await db.execute(
        "SELECT * FROM users WHERE id = ?",
        [userId]
      );
      const currentUser = users[0];

      let updatedPassword = currentUser.password;
      if (password && password.trim() !== "") {
        if (password.length < 8) {
          return res
            .status(400)
            .json({ message: "Password must be at least 8 characters" });
        }
        updatedPassword = await bcrypt.hash(password, 10);
      }

      // Use new image if uploaded, otherwise keep existing
      const finalImage = req.file
        ? req.file.filename
        : currentUser.profile_image;

      await db.execute(
        `UPDATE users SET username = ?, email = ?, password = ?, profile_image = ? WHERE id = ?`,
        [username, email, updatedPassword, finalImage, userId]
      );

      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Error updating profile" });
    }
  }
);

// ================= ADMIN ROUTES =================
// All admin routes use both verifyToken and adminOnly middleware

app.get("/admin/users", verifyToken, adminOnly, async (req, res) => {
  try {
    const [users] = await db.execute(
      "SELECT id, username, email, role, status, created_at FROM users ORDER BY id ASC"
    );
    res.json(users);
  } catch (error) {
    console.error("Admin fetch users error:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

app.put("/admin/block/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    // Prevent admin from blocking themselves
    if (req.params.id == req.user.userId) {
      return res.status(400).json({ message: "You cannot block your own account" });
    }
    await db.execute("UPDATE users SET status = 'blocked' WHERE id = ?", [
      req.params.id,
    ]);
    res.json({ message: "User blocked successfully" });
  } catch (error) {
    console.error("Block user error:", error);
    res.status(500).json({ message: "Error blocking user" });
  }
});

app.put("/admin/unblock/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    await db.execute("UPDATE users SET status = 'active' WHERE id = ?", [
      req.params.id,
    ]);
    res.json({ message: "User unblocked successfully" });
  } catch (error) {
    console.error("Unblock user error:", error);
    res.status(500).json({ message: "Error unblocking user" });
  }
});

app.delete("/admin/delete/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id == req.user.userId) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }
    await db.execute("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

// ================= MULTER ERROR HANDLER =================
// Catches file upload errors (wrong type, too large) cleanly
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});