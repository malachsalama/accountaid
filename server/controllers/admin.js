const Company = require("../models/company");
const RetailName = require("../models/retailname");

// Adding a department
async function addDepartment(req, res) {
  try {
    const { department, department_no, designations } = req.body;
    const { company_no } = req.query;

    // Check if the department name already exists for the given company
    const existingCompany = await Company.findOne({ company_no });

    if (!existingCompany) {
      return res.status(404).json({ error: "Company not found" });
    }

    const existingDepartment = existingCompany.departments.find(
      (dept) => dept.department === department
    );

    if (existingDepartment) {
      return res.status(400).json({ error: "Department already exists" });
    }

    // Create a new department object
    const newDepartment = {
      department,
      department_no,
      designations,
    };

    // Update the company document with the new department
    existingCompany.departments.push(newDepartment);
    await existingCompany.save();

    res.status(201).json({ message: "Department added successfully" });
  } catch (error) {
    console.error("Error adding department:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Fetch all departments for a specific company
async function getAllDepartments(req, res) {
  try {
    const { company_no } = req.query;

    // Find the company by company_no
    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    const departments = company.departments.map(
      (department) => department.department
    );
    res.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Fetch all designations for a specific company and department
async function getDesignations(req, res) {
  try {
    const { company_no, department } = req.query;

    // Find the company by company_no
    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Find the department within the company
    const selectedDepartment = company.departments.find(
      (dept) => dept.department === department
    );

    if (!selectedDepartment) {
      return res.status(404).json({ error: "Department not found" });
    }

    // Extract designations from the selected department
    const designations = selectedDepartment.designations || [];

    res.json(designations);
  } catch (error) {
    console.error("Error fetching designations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Add retail name
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

// Fetch all retail names
async function getRetailNames(req, res) {
  try {
    const retailNames = await RetailName.find({}, "retailname");
    res.json(retailNames);
  } catch (error) {
    console.error("Error fetching retailnames:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Edit variables
async function editVariables(req, res) {
  const { company_no, vat, markup_price } = req.body;

  try {
    const existingCompany = await Company.findOne({ company_no });

    if (!existingCompany) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Update the variables array with the new values
    existingCompany.variables.push({ vat, markup_price });

    await existingCompany.save();

    res.status(200).json({ message: "Variables updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  addDepartment,
  getAllDepartments,
  addRetailName,
  getRetailNames,
  getDesignations,
  editVariables,
};
