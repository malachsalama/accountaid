const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/userAuth");

const { createLpo, fetchLpoData} = require("../controllers/lpo");

router.post("/retail/createlpo", authenticateToken, createLpo);

router.get("/retail/createlpo", fetchLpoData);


module.exports = router;
