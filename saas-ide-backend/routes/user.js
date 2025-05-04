const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const saltRounds = 10; // 🔐 Number of salt rounds for bcrypt

const User = require("../models/userModel");
const { generateTokens, setTokensInCookies } = require("../utils/authUtils");

// 📝 Route: POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 📌 1. Basic input check
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    // 📧 2. Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    // 🔐 3. Validate password strength
    const passwordRegex = /^(?=.*[0-9]).{8,}$/; // At least 8 chars, includes number
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include at least one number (0-9).",
      });
    }

    // 🔎 4. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    // 🔑 5. Hash password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 👤 6. Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // 🛡️ 7. Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(newUser);

    // 🍪 8. Set tokens as HTTP-only cookies
    setTokensInCookies(res, accessToken, refreshToken);

    // 🎉 9. Respond to client
    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error(
      "❌ Signup error:",
      process.env.NODE_ENV === "production" ? err : err.message
    );
    return res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
});

// 📝 Route: POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 🔍 Validate input
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // 🔐 Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // 🔐 Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // 🔑 Generate tokens using the correct user
    const { accessToken, refreshToken } = generateTokens(user);

    // 🍪 Set cookies
    setTokensInCookies(res, accessToken, refreshToken);

    // 📦 Send response
    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
});


// 📝 Route: POST /api/auth/logout
router.post("/logout", async (req, res) => {
  try {
    // 🍪 1. Clear authentication cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // 🎉 2. Respond to client
    return res.status(200).json({
      message: "Logged out successfully.",
    });
  } catch (err) {
    console.error(
      "❌ Logout error:",
      process.env.NODE_ENV === "production" ? err : err.message
    );
    return res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
});

module.exports = router;
