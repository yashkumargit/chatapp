const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Access Denied: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Access Denied: Token format invalid" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info
    next();

  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
