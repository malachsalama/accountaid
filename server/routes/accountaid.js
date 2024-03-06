const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/userAuth");

const { RegCompany, getAllCompanies } = require("../controllers/accountaid");

router.post("/superadmin/reg-company", authenticateToken, RegCompany);
router.get("/superadmin/all-companies", authenticateToken, getAllCompanies);

module.exports = router;
