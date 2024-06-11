const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/userAuth");

const { addRetailName, getRetailNames } = require("../controllers/admin");
const {
  fetchLpoData,
  autocomplete,
  generateLpo,
  getAllLposByCompany,
  fetchLpoDataForReceive,
  postLpoDetails,
  closeLpo,
  updateStockAndEntries,
  deleteLpo,
  updateLpo,
  checkInvoiceNumber,
  fetchStock,
} = require("../controllers/retail");

router.post("/retail/retailnames", addRetailName);

router.post("/retail/generatelpo", authenticateToken, generateLpo);

router.post("/retail/postlpodetails", authenticateToken, postLpoDetails);
router.post(
  "/retail/update-stock-and-entries",
  authenticateToken,
  updateStockAndEntries
);

router.post("/retail/closelpo", authenticateToken, closeLpo);
router.patch("/retail/updatelpo/:lpo_no", authenticateToken, updateLpo);

router.get("/retail/lpos/:company_no", authenticateToken, getAllLposByCompany);
router.get("/retail/check-invoice-number", checkInvoiceNumber);
router.get("/retail/retailnames", getRetailNames);

router.get("/retail/generatelpo", authenticateToken, fetchLpoData);
router.get(
  "/retail/fetchLpoDataForReceive",
  authenticateToken,
  fetchLpoDataForReceive
);
router.get("/retail/autocomplete", autocomplete);
router.get("/retail/fetchstock", authenticateToken, fetchStock);

router.delete("/retail/lpos/:lpoId", authenticateToken, deleteLpo);

module.exports = router;
