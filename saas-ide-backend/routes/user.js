const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.post("/", async (req, res) => {
  try {
    const { clerkUserId, email, name } = req.body;

    const user = await User.findOneAndUpdate(
      { clerkUserId },
      { clerkUserId, email, name },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: 'User Add/Get successfully', user });
  } catch (error) {
    console.error("Error in user creation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;