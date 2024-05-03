const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/userAuth");

const {
  createCreditor,
  getAccountNo,
  getAllCreditors,
  tbAccounts,
  fetchTbAccounts,
} = require("../controllers/accounts");

router.post("/accounts/createcreditor", authenticateToken, createCreditor);
router.post("/accounts/tbaccounts", authenticateToken, tbAccounts);
router.get("/accounts/tbaccounts", authenticateToken, fetchTbAccounts);
router.get("/accounts/creditors", getAllCreditors);
router.get("/accounts/account_no", getAccountNo);

module.exports = router;
