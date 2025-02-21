const User = require("../models/userModel");
const express = require("express");
const bcrypt = require("bcryptjs");
const { generateTokens, setTokensInCookies } = require("../utils/authUtils");

const router = express.Router();
const saltRounds = 10;

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    // Check if user already exists
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await User.create({ name, email, password: hashPassword });

    if (newUser) {
      // Generate Tokens
      const { accessToken, refreshToken } = generateTokens(newUser);

      // Store Refresh Token in Database
      newUser.refreshToken = refreshToken;
      await newUser.save();

      // Set tokens in cookies
      setTokensInCookies(res, accessToken, refreshToken);

      // Send response
      return res.status(201).json({
        message: "User Register Successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;