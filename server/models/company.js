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
      type: [String],
      required: true,
    },
  },
  { _id: false }
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
  { _id: false }
);

const creditorSchema = new mongoose.Schema(
  {
    acc_no: {
      type: String,
    },
    name: {
      type: String,
    },
    company: {
      type: String,
      required: true,
    },
    kra_pin: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone_no: {
      type: String,
    },
  },
  { _id: false }
);

const variablesSchema = new mongoose.Schema(
  {
    company_no: {
      type: String,
    },
    vat: {
      type: Number,
    },
    markup_price: {
      type: Number,
    },
  },
  { _id: false }
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
  departments: [departmentSchema],
  tbaccounts: [tbAccountsSchema],
  creditors: [creditorSchema],
  variables: [variablesSchema],
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
