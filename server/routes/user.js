const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/user");

const { userSignUp, userLogin } = require("../controllers/authentication");

router.post("/user/signup", userSignUp);
router.post("/user/login", userLogin);

module.exports = router;
