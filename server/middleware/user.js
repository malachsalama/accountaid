const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Check the user's role from the decoded token
    const userRole = decodedToken.role;

    // Check if the user is a superadmin or admin
    if (userRole === "superadmin" || userRole === "admin") {
      req.user = decodedToken;
      next();
    } else {
      return res.status(403).json({ error: "Forbidden" });
    }
  });
};

module.exports = authenticateToken;
