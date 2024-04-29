const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    department_no: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    designations: {
      type: [String], // Array of strings to store multiple designations
      required: true,
    },
  },
  { _id: false } // Exclude _id field
);

const companySchema = new mongoose.Schema({
  company_name: {
    type: String,
    required: true,
  },
  company_no: {
    type: String,
    required: true,
  },
  kra_pin: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone_no: {
    type: String,
    required: true,
  },
  departments: [departmentSchema], // Reference departmentSchema
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
