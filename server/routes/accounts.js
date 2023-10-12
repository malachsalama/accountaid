const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/user");

const { createSupplier } = require("../controllers/accounts");

// router.use(authenticateToken);

router.post("/createsupplier", createSupplier);

module.exports = router;
