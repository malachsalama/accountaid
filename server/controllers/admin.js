const Department = require("../models/department");

// Adding a department
async function addDepartment(req, res) {
  try {
    const { department, department_no, designation } = req.body;

    // Check if the department name already exists
    const existingDepartment = await Department.findOne({ department });

    if (existingDepartment) {
      return res.status(400).json({ error: "Department already exists" });
    }

    const newDepartment = new Department({
      department,
      department_no,
      designation,
    });

    // Save the department to the database
    await newDepartment.save();

    res.status(201).json({ message: "Department added successfully" });
  } catch (error) {
    console.error("Error adding department:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllDepartments(req, res) {
  try {
    const departments = await Department.find({}, "department");
    res.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { addDepartment, getAllDepartments };
