const express = require("express");
const router = express.Router();

const { userSignUp, userLogin } = require("../controllers/authentication");
const { editVariables, fetchNotifications } = require("../controllers/admin");
const { authenticateToken } = require("../middleware/userAuth");

router.post("/user/signup", userSignUp);
router.post("/user/login", userLogin);
router.post("/edit-variables", editVariables);
router.get("/fetchNotifications", authenticateToken, fetchNotifications);

module.exports = router;
