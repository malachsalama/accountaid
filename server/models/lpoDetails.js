const mongoose = require("mongoose");

const lpoSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    unique_id: {
      type: String,
    },
    lpo_no: {
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
    lpo_no: {
      type: String,
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

const Lpo = mongoose.model("lpo_detail", lpoSchema);

module.exports = Lpo;
