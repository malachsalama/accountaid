const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRE } = require("../config/config");

const createToken = (user) => {
  return jwt.sign(user, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.redirect("/api/auth/user/login");
    return res.status(401).json({ error: "Authorization token required" });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);

    req.user = decodedToken;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = { createToken, authenticateToken };
