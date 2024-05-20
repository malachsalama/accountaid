const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/userAuth");

const { addRetailName, getRetailNames } = require("../controllers/admin");
const {
  fetchLpoData,
  autocomplete,
  getLpoNo,
  generateLpo,
  getAllLposByCompany,
  fetchLpoDataForReceive,
  postLpoDetails,
  closeLpo,
  deleteLpo,
} = require("../controllers/retail");

router.post("/retail/retailnames", addRetailName);
router.get("/retail/retailnames", getRetailNames);

router.get("/retail/generatelpo", authenticateToken, fetchLpoData);
router.get(
  "/retail/fetchLpoDataForReceive",
  authenticateToken,
  fetchLpoDataForReceive
);
router.post("/retail/generatelpo", authenticateToken, generateLpo);
router.post("/retail/postlpodetails", authenticateToken, postLpoDetails);
router.get("/retail/lpos/:company_no", authenticateToken, getAllLposByCompany);
router.delete("/retail/lpos/:lpoId", authenticateToken, deleteLpo);
router.post("/retail/closelpo", authenticateToken, closeLpo);

router.get("/retail/autocomplete", autocomplete);
router.get("/retail/lpo_no", getLpoNo);

module.exports = router;
