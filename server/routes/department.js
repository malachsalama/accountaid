const express = require("express");
const router = express.Router();

const { addDepartment } = require("../controllers/department");

router.post("/department/", addDepartment);

module.exports = router;
