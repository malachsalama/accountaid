const mongoose = require("mongoose");

const creditorSchema = new mongoose.Schema({
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
  acc_no: {
    type: String,
  },
});

const logsSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
    },
    action: {
      type: String,
    },
    unique_id: {
      type: String,
    },
    doc_type: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Creditor = mongoose.model("creditor", creditorSchema);
const Logs = mongoose.model("log", logsSchema);

module.exports = { Creditor, Logs };
