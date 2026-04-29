const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authentication token missing" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userType = payload.role === "librarian" ? "librarian" : "member";

    req.user = payload;
    req.userType = userType;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };
