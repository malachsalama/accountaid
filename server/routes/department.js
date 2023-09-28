const express = require("express");
const router = express.Router();

const { addDepartment, getAllDepartments } = require("../controllers/admin");

router.post("/departments", addDepartment);
router.get("/departments", getAllDepartments);

module.exports = router;
