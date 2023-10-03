const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/user");

const { userSignUp, userLogin } = require("../controllers/authentication");

router.post("/user/signup", authenticateToken, userSignUp);
router.post("/user/login", authenticateToken, userLogin);

module.exports = router;
