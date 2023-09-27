const express = require("express");
const router = express.Router();

const { addDepartment } = require("../controllers/admin");

router.post("/department/", addDepartment);

module.exports = router;
