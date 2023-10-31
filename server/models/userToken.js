const mongoose = require("mongoose");

const userTokenSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 30 * 86400, // 30 days
  },
});

const UserToken = mongoose.model("UserToken", userTokenSchema);

module.exports = UserToken;
