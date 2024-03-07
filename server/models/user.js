const mongoose = require("mongoose");

// Define the User Schema
const userSchema = new mongoose.Schema({
  company_no: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  phone_no: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  department_no: {
    type: Number,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
