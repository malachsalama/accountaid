const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
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

const Supplier = mongoose.model("creditor", supplierSchema);

module.exports = Supplier ;
