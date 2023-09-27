const express = require("express");
const router = express.Router();
const userRoutes = require("./user");
const depRoutes = require("./department");

router.use("/auth", userRoutes);
router.use("/auth", depRoutes);

module.exports = router;
