const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/userAuth");

const { addRetailName, getRetailNames } = require("../controllers/admin");
const { createLpo, fetchLpoData } = require("../controllers/lpo");

router.use(authenticateToken);

router.post("/retail/retailnames", addRetailName);
router.get("/retail/retailnames", getRetailNames);

router.post("/retail/createlpo", createLpo);
router.get("/retail/createlpo", fetchLpoData);

module.exports = router;
