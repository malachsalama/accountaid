const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/userAuth");

const {
  createCreditor,
  updateCreditorLedger,
  getGRNNo,
  getAccountNo,
  getCreditors,
  tbAccounts,
  fetchTbAccounts,
  deleteCreditor,
  deleteTbAccount,
} = require("../controllers/accounts");

router.post("/accounts/createcreditor", authenticateToken, createCreditor);
router.put(
  "/accounts/updatecreditorledger/:creditor_name",
  authenticateToken,
  updateCreditorLedger
);
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
router.get("/accounts/creditors", getCreditors);
router.get("/accounts/account_no", getAccountNo);
router.get("/accounts/grn_no", getGRNNo);

module.exports = router;
