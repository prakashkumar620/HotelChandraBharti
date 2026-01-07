const jwt = require("jsonwebtoken");

// User Authentication Middleware
const userAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "No token provided. Please login" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.email = decoded.email;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Admin Authentication Middleware
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "No token provided. Please login as admin" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.adminId;
    req.adminEmail = decoded.email;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid admin token" });
  }
};

module.exports = { userAuth, adminAuth };
