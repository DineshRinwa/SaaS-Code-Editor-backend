const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  isPro: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;