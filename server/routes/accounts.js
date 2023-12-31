const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/userAuth");

const {
  createCreditor,
  getAccountNo,
  getAllCreditors,
} = require("../controllers/accounts");

router.post("/accounts/createcreditor", authenticateToken, createCreditor);
router.get("/accounts/creditors", getAllCreditors);
router.get("/accounts/account_no", getAccountNo);

module.exports = router;
