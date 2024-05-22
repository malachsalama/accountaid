const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/userAuth");

const { userSignUp, userLogin } = require("../controllers/authentication");
const { editVariables, fetchNotifications } = require("../controllers/admin");

router.post("/user/signup", userSignUp);
router.post("/user/login", userLogin);
router.post("/edit-variables", editVariables);
router.get("/fetchnotifications", authenticateToken, fetchNotifications);

module.exports = router;
