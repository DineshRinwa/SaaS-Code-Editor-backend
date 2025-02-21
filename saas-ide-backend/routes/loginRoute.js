const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { generateTokens, setTokensInCookies } = require("../utils/authUtils");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Step 1: Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });


    // Step 2: Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Generate Token
    const { accessToken, refreshToken } = generateTokens(user);

    // Store in Database
    user.refreshToken = refreshToken;
    await user.save();

    // Set tokens in cookies
    setTokensInCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;