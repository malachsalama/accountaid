const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/userAuth");

const {
  createCreditor,
  getAccountNo,
  getAllCreditors,
  tbAccounts,
  fetchTbAccounts,
  deleteCreditor,
  deleteTbAccount,
} = require("../controllers/accounts");

router.post("/accounts/createcreditor", authenticateToken, createCreditor);
router.delete(
  "/accounts/creditors/:creditorId",
  authenticateToken,
  deleteCreditor
);
router.post("/accounts/tbaccounts", authenticateToken, tbAccounts);
router.get("/accounts/tbaccounts", authenticateToken, fetchTbAccounts);
router.delete(
  "/accounts/tbaccounts/:tbaccountId",
  authenticateToken,
  deleteTbAccount
);
router.get("/accounts/creditors", getAllCreditors);
router.get("/accounts/account_no", getAccountNo);

module.exports = router;
