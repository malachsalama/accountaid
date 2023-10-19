const mongoose = require("mongoose");

const retailNameSchema = new mongoose.Schema({
  supplier: {
    type: String,
    required: true,
  },
});

const lpoSchema = new mongoose.Schema({
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
    required: true,
  },

  netTotal: {
    type: String,
    required: true,
  },

  acc_no: {
    type: String,
    required: true,
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
    required: true,
  },

  received_at: {
    type: String,
    required: true,
  },
});

const mongoose = require("mongoose");

const lpoDetailsSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    unique_id: {
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
    status: {
      type: Number,
      default: 1,
    },
  },
  { validateBeforeSave: false }
);

const LpoDetails = mongoose.model("lpo_detail", lpoDetailsSchema);

const Lpo = mongoose.model("Lpo", lpoSchema);
const RetailName = mongoose.model("RetailName", retailNameSchema);

module.exports = {RetailName, Lpo, LpoDetails};
