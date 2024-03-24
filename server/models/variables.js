const mongoose = require("mongoose");

const variablesSchema = new mongoose.Schema({
  company_no: {
    type: String,
  },
  vat: {
    type: Number,
  },
});

const Variables = mongoose.model("variable", variablesSchema);

module.exports = Variables;
