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

const tbAccountsSchema = new mongoose.Schema(
  {
    account_name: {
      type: String,
      required: true,
    },
    account_number: {
      type: String,
      required: true,
    },
    acc_no: {
      type: String,
      required: true,
    },
  },
  { _id: false } // Exclude _id field
);

const notificationSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  company_no: {
    type: String,
  },
  heading: {
    type: String,
  },
  body: {
    type: String,
  },
  type: {
    type: String,
  },
  unique_id: {
    type: String,
  },
  status: {
    type: String,
  },
});

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
  tbaccounts: [tbAccountsSchema],
  notifications: [notificationSchema],
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
