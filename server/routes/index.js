const express = require("express");
const router = express.Router();

const accountRoutes = require("./accounts");
const depRoutes = require("./department");
const designationRoutes = require("./designation");
const pdfRoutes = require("./pdf");
const retailRoutes = require("./retail");
const accountAidRoutes = require("./accountaid");
const userRoutes = require("./user");

router.use("/auth", accountRoutes);
router.use("/auth", depRoutes);
router.use("/auth", designationRoutes);
router.use("/auth", pdfRoutes);
router.use("/auth", retailRoutes);
router.use("/auth", accountAidRoutes);
router.use("/auth", userRoutes);

module.exports = router;
