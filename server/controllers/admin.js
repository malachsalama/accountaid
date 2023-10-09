const Department = require("../models/department");
const RetailName = require("../models/retailname");
const Designation = require("../models/designation");

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

// Add RetailName
async function addRetailName(req, res) {
  try {
    const { retailname } = req.body;

    // Check if the retailname already exists
    const existingretailname = await RetailName.findOne({ retailname });

    if (existingretailname) {
      return res.status(400).json({ error: "RetailName already exists" });
    }

    const addRetailName = new RetailName({
      retailname,
    });

    await addRetailName.save();
    res.status(201).json({ message: "ReatilName added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

// Add Designation
async function addDesignation(req, res) {
  try {
    const { designation } = req.body;

    // Check if the designation already exists
    const existingDesignation = await Designation.findOne({ designation });

    if (existingDesignation) {
      return res.status(400).json({ error: "Designation already exists" });
    }

    const addDesignation = new Designation({
      designation,
    });

    await addDesignation.save();
    res.status(201).json({ message: "Designation added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getDesignations(req, res) {
  try {
    const designations = await Designation.find({}, "designation");
    res.json(designations);
  } catch (error) {
    console.error("Error fetching designations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getRetailNames(req, res) {
  try {
    const retailNames = await RetailName.find({}, "retailname");
    res.json(retailNames);
  } catch (error) {
    console.error("Error fetching retailnames:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  addDepartment,
  getAllDepartments,
  addRetailName,
  getRetailNames,
  addDesignation,
  getDesignations,
};
