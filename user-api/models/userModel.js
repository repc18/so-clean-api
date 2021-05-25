const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  address: String,
  email: String,
  password: String,
  phone: String,
  paymentMethod: String,
  area: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
