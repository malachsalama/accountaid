const mongoose = require("mongoose");

const designationSchema = new mongoose.Schema({
  designation: {
    type: String,
    required: true,
  },
});

const Designation = mongoose.model("Designation", designationSchema);

module.exports = Designation;
