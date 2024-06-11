const mongoose = require("mongoose");

// Define the schema for invoices
const invoiceSchema = new mongoose.Schema({
  invoice_no: {
    type: String,
    required: true,
  },
  total_value: {
    type: Number,
  },
  date_created: {
    type: Date,
  },
});

// Define the schema for receipts
const receiptSchema = new mongoose.Schema({
  receipt_no: {
    type: String,
    required: true,
  },
  total_value: {
    type: Number, // Net value + VAT
  },
  date_created: {
    type: Date,
  },
  invoices: [invoiceSchema], // Embed invoices schema for reports
});

const creditorSchema = new mongoose.Schema({
  acc_no: {
    type: String,
  },
  name: {
    type: String,
  },
  creditor_name: {
    type: String,
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
  ledger: {
    invoices: [invoiceSchema], // Add invoices array
    receipts: [receiptSchema], // Add receipts array
  },
});

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
    type: Number,
    required: true,
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
  department: {
    type: String,
  },
});

const stockSchema = new mongoose.Schema({
  unique_id: {
    type: String,
    required: true,
  },
  company_no: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date_received: {
    type: Date,
    required: true,
  },
});

const entriesSchema = new mongoose.Schema({
  account_name: {
    type: String,
    required: true,
  },
  account_number: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  usd_rate: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  narration: {
    type: String,
    required: true,
  },
  doc_ref: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const productSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  unique_id: {
    type: String,
  },
  company_no: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const lpoSchema = new mongoose.Schema({
  supplier: {
    type: String,
  },
  supplierName: {
    type: String,
  },
  kra_pin: {
    type: String,
  },
  usd_rate: {
    type: Number,
  },
  lpo_no: {
    type: String,
  },
  netTotal: {
    type: Number,
  },
  TBAccount_name: {
    type: String,
  },
  grn_no: {
    type: String,
  },
  ret_no: {
    type: String,
  },
  session: {
    type: String,
  },
  returned_at: {
    type: Date,
  },
  date_received: {
    type: Date,
    default: Date.now,
  },
  expense_type: {
    type: String,
  },
  date_created: {
    type: Date,
  },
  vat: {
    type: String,
  },
  vatVariable: {
    type: Number,
  },
  status: {
    type: Number,
  },
  products: [productSchema],
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
  stock: [stockSchema],
  entries: [entriesSchema],
  lpos: [lpoSchema],
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
