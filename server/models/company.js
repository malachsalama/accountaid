const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
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
});

const tbAccountsSchema = new mongoose.Schema({
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
});

const creditorSchema = new mongoose.Schema({
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
});

const variablesSchema = new mongoose.Schema({
  company_no: {
    type: String,
  },
  vat: {
    type: Number,
  },
  markup_price: {
    type: Number,
  },
});

const notificationsSchema = new mongoose.Schema({
  heading: {
    type: String,
  },
  body: {
    type: String,
  },
  date: {
    type: Date,
  },
  status: {
    type: Number,
  },
  type: {
    type: String,
  },
  user_id: {
    type: String,
  },
  username: {
    type: String,
  },
  unique_id: {
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
  departments: [departmentSchema],
  tbaccounts: [tbAccountsSchema],
  creditors: [creditorSchema],
  variables: [variablesSchema],
  notifications: [notificationsSchema],
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
