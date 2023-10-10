const mongoose = require("mongoose");

const lpoSchema = new mongoose.Schema({
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

const Lpo = mongoose.model("lpo", lpoSchema);

module.exports = Lpo;
