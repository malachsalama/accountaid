const mongoose = require("mongoose");

const logsSchema = new mongoose.Schema(
  {
    company_no: {
      type: String,
    },
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

const Logs = mongoose.model("log", logsSchema);

module.exports = Logs;
