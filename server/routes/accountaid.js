const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/userAuth");

const {
  RegCompany,
  getAllCompanies,
  userPayload,
} = require("../controllers/accountaid");

router.post("/accountaid/reg-company", authenticateToken, RegCompany);
router.get("/accountaid/all-companies", authenticateToken, getAllCompanies);
router.get("/accountaid/userpayload", authenticateToken, userPayload);

module.exports = router;
