const express = require("express");
const router = express.Router();

const {
  getDesignations,
  addDepartment,
  getAllDepartments,
} = require("../controllers/admin");

router.post("/add-department", addDepartment);
router.get("/departments", getAllDepartments);

router.get("/designations", getDesignations);

module.exports = router;
