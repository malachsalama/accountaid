const mongoose = require("mongoose");

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

const supplierSchema = new mongoose.Schema({
  supplier: {
    type: String,
  },
  supplierName: {
    type: String,
  },
  company_no: {
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
    required: true,
  },
  netTotal: {
    type: Number,
    required: false,
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
    required: true,
  },
  vat: {
    type: String,
    required: true,
  },
  vatVariable: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  products: [productSchema],
});

const Supplier = mongoose.model("lpo", supplierSchema);

module.exports = Supplier;
