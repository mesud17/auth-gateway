const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('./authMiddleware');
const db = require('./db');
require('dotenv').config();
const cors = require('cors');
app.use(cors()); // This allows the frontend to talk to the backend

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// --- REGISTRATION ROUTE ---
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // 1. Check if user already exists
        const existingUser = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Hash the password (Salt rounds = 10)
        // Never store the actual password!
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Insert into database
        await db.execute(
            'INSERT INTO users (username,email,password) VALUES (?,?,?)',
            [username,email, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during registration" });
    }
});

// --- LOGIN ROUTE ---
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find user by email
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // 2. Compare entered password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // 3. Create a JWT Token
        // We put the user's ID in the "payload"
        const token = jwt.sign(
            { userId: user.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.json({ 
            message: "Login successful!", 
            token: token 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login" });
    }
});

// --- PROTECTED ROUTE ---
// Notice how verifyToken is placed before the (req, res) function
app.get('/profile', verifyToken, async (req, res) => {
    try {
        // Since verifyToken added req.user, we have the ID!
        const [users] = await db.execute(
            'SELECT id, email, created_at FROM users WHERE id = ?', 
            [req.user.userId]
        );
        
        res.json({
            message: "Welcome to your protected profile!",
            user: users[0]
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile" });
    }
});

const PORT =  5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));