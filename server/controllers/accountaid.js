const Company = require("../models/company");
const bcrypt = require("bcrypt");
const User = require("../models/user");

async function RegCompany(req, res) {
  const {
    user_name,
    company_name,
    company_no,
    kra_pin,
    email,
    phone_no,
    password,
  } = req.body;

  try {
    const existingCompany = await Company.findOne({ company_no });

    if (existingCompany) {
      return res.status(400).json({ error: "Company already exists" });
    }

    // Hash the password before storing it in the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newCompany = new Company({
      company_name,
      company_no,
      kra_pin,
      email,
      phone_no,
    });

    await newCompany.save();

    const newUser = new User({
      username: user_name,
      company_no,
      phone_no,
      department: "Management",
      designation: "Admin",
      department_no: "2",
      user_id: user_name,
      password: hashedPassword,
    });

    await newUser.save();

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

async function userPayload(req, res) {
  try {
    // Extract user_id from the authenticated user
    const _id = req.user.user_id;

    // Find the user by user_id
    const user = await User.findOne({ _id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return only the necessary user information
    const userData = {
      user_id: user.user_id,
      username: user.username,
      department: user.department,
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { RegCompany, getAllCompanies, userPayload };
