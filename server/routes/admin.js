const express = require("express");
const router = express.Router();

const { userSignUp, userLogin } = require("../controllers/authentication");
const { editVariables } = require("../controllers/admin");

router.post("/user/signup", userSignUp);
router.post("/user/login", userLogin);
router.post("/edit-variables", editVariables);

module.exports = router;
