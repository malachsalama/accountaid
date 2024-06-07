const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/userAuth");

const {
  fetchNotifications,
  approveLpo,
} = require("../controllers/notifications");

router.get(
  "/notifications/fetchnotifications",
  authenticateToken,
  fetchNotifications
);
router.get("/notification/approvelpo", authenticateToken, approveLpo);
module.exports = router;
