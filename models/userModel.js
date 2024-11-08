const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  phonenumber: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("user", userSchema);
