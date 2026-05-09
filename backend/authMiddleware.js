const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    // Get the token from the request header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    try {
        // 2. Verify the token using our secret key
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Add the user data to the request object so the next function can use it
        req.user = verified;
        
        // 4. Move to the next function/route
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or Expired Token" });
    }
};

module.exports = verifyToken;