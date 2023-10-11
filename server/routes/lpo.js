const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/userAuth");

const { createLpo } = require("../controllers/lpo");

router.post("/retail/createlpo", authenticateToken, createLpo);
// router.get("/designations", getDesignations);

module.exports = router;
