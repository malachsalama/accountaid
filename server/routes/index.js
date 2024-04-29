const express = require("express");
const router = express.Router();

const accountRoutes = require("./accounts");
const departmentRoutes = require("./department");
const pdfRoutes = require("./pdf");
const retailRoutes = require("./retail");
const accountAidRoutes = require("./accountaid");
const adminRoutes = require("./admin");

router.use("/auth", accountRoutes);
router.use("/auth", departmentRoutes);
router.use("/auth", pdfRoutes);
router.use("/auth", retailRoutes);
router.use("/auth", accountAidRoutes);
router.use("/auth", adminRoutes);

module.exports = router;
