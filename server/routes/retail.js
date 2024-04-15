const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/userAuth");

const { addRetailName, getRetailNames } = require("../controllers/admin");
const {
  createLpo,
  fetchLpoData,
  autocomplete,
  getLpoNo,
  generateLpo,
  getAllLposByCompany,
  fetchLpoDataForReceive,
} = require("../controllers/retail");

router.post("/retail/retailnames", addRetailName);
router.get("/retail/retailnames", getRetailNames);

router.post("/retail/createlpo", authenticateToken, createLpo);
router.get("/retail/createlpo", authenticateToken, fetchLpoData);
router.get("/retail/fetchLpoDataForReceive", authenticateToken, fetchLpoDataForReceive);
router.post("/retail/generatelpo", authenticateToken, generateLpo);
router.get("/retail/lpos/:company_no", authenticateToken, getAllLposByCompany);

router.get("/retail/autocomplete", autocomplete);
router.get("/retail/lpo_no", getLpoNo);

module.exports = router;
