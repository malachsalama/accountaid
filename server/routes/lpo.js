const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/user");

const { createLpo, fetchLpoData} = require("../controllers/lpo");

router.post("/retail/createlpo", createLpo);
router.get("/retail/createlpo", fetchLpoData);

module.exports = router;
