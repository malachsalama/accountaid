const express = require("express");
const router = express.Router();
const userRoutes = require("./user");
const depRoutes = require("./department");
const retailRoutes = require("./retail");

router.use("/auth", userRoutes);
router.use("/auth", depRoutes);
router.use("/auth", retailRoutes);

module.exports = router;
