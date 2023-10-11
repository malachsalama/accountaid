const mongoose = require("mongoose");

const lpoSchema = new mongoose.Schema({
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
});

const Lpo = mongoose.model("lpo_detail", lpoSchema);

module.exports = Lpo;
