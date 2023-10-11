const express = require("express");
const router = express.Router();
const userRoutes = require("./user");
const depRoutes = require("./department");
const retailRoutes = require("./retail");
const designationRoutes = require("./designation");

router.use("/auth", userRoutes);
router.use("/auth", depRoutes);
router.use("/auth", retailRoutes);
router.use("/auth", designationRoutes);

module.exports = router;
