const express = require("express");
const { userSignUp, userLogin } = require("../controllers/user");

const router = express.Router();

router.post("/user/signup", userSignUp);
router.post("/user/login", userLogin);

module.exports = router;
