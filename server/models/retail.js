const mongoose = require("mongoose");

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
    type: String,
    required: true,
  },

  acc_no: {
    type: String,
  },

  invoice_no: {
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
    type: String,
  },

  received_at: {
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
});

const Supplier = mongoose.model("lpo", supplierSchema);

module.exports = Supplier;
