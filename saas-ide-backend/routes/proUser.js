const authMiddleware = require("../middleware/auth");
const User = require("../models/userModel");
const express = require("express");
const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User Not Found" });

    // Check if user is already Pro
    if (user.isPro) {
      return res.status(400).json({ message: "User is already a Pro member" });
    }

    // Upgrade user to Pro
    user.isPro = true;
    user.proSince = new Date();
    await user.save();

    return res.status(200).json({
      message: "User become pro",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPro: user.isPro,
        proSince: user.proSince,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to upgrade user to Pro",
      error: error.message,
    });
  }
});

module.exports = router;