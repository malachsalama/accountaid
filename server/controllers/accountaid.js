const Company = require("../models/company");

async function RegCompany(req, res) {
  const { company_name, company_no, kra_pin, email, phone_no } = req.body;

  try {
    const existingCompany = await Company.findOne({ company_no });

    if (existingCompany) {
      return res.status(400).json({ error: "Company already exists" });
    }

    const newCompany = new Company({
      company_name,
      company_no,
      kra_pin,
      email,
      phone_no,
    });

    await newCompany.save();

    res.status(201).json({ message: "Company added successfully" });
  } catch (error) {
    console.error("Error adding new company", error);
    res.status(500).json("Internal server error");
  }
}

async function getAllCompanies(req, res) {
  try {
    const companies = await Company.find({});
    res.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { RegCompany, getAllCompanies };
