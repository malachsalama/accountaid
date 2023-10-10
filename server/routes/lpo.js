const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/user");

const { createLpo } = require("../controllers/lpo");

router.post("/retail/createlpo", createLpo);
// router.get("/designations", getDesignations);

module.exports = router;
