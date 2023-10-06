const mongoose = require("mongoose");

const retailNameSchema = new mongoose.Schema({
  retailname: {
    type: String,
    required: true,
  },
});

const RetailName = mongoose.model("RetailName", retailNameSchema);

module.exports = RetailName;
