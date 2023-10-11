const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/userAuth");

const { userSignUp, userLogin } = require("../controllers/authentication");

router.post("/user/signup", userSignUp);
router.post("/user/login", userLogin);

module.exports = router;
