const express = require("express");
const router = express.Router();

const { userSignUp, userLogin } = require("../controllers/authentication");

router.post("/user/signup", userSignUp);
router.post("/user/login", userLogin);

module.exports = router;
