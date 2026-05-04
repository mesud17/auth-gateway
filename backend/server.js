const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// --- REGISTRATION ROUTE ---
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if user already exists
        const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Hash the password (Salt rounds = 10)
        // Never store the actual password!
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Insert into database
        await db.execute(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during registration" });
    }
});

const PORT =  5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));