const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },

    isPro: {
      type: Boolean,
      default: false,
    },

    proSince: {
      type: Date,
    },

    refreshToken: { type: String },
  },

  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create model
const User = mongoose.model("User", userSchema);
module.exports = User;