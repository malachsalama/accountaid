const jwt = require("jsonwebtoken");
const {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRE,
  JWT_REFRESH_EXPIRE,
} = require("../config/config");
const UserToken = require("../models/userToken");

const createToken = async (user) => {
  try {
    const payload = {
      user_id: user.user_id,
      username: user.username,
      department: user.department,
    };
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
    });

    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRE,
    });

    await UserToken.findOneAndDelete({
      user_id: user.user_id,
    });

    await new UserToken({ user_id: user.user_id, token: refreshToken }).save();
    return Promise.resolve({ accessToken, refreshToken });
  } catch (error) {
    return Promise.reject(error);
  }
};

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded; // Set req.user to the decoded payload

    if (decoded.user_id) {
      next();
    } else {
      // It's a refresh token, validate it against the database
      const userToken = await UserToken.findOne({
        user_id: decoded.user_id,
        token,
      });

      if (!userToken) {
        return res.status(403).json({ error: "Invalid refresh token" });
      }

      // If you need information from the userToken, you can access it as userToken
      req.refreshToken = userToken;

      next();
    }
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = { createToken, authenticateToken };
