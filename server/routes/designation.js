const express = require("express");
const router = express.Router();

const { addDesignation, getDesignations } = require("../controllers/admin");

router.post("/designations", addDesignation);
router.get("/designations", getDesignations);

module.exports = router;
