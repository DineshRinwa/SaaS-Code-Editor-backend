const express = require("express");
const Snippet = require("../models/snippetModel");
const router = express.Router();
const { requireAuth } = require('@clerk/express');


// Ensure Clerk has the required keys
if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
  console.error("❌ Clerk API keys are missing! Check your .env file.");
  process.exit(1);
}
 
// Get All Snippets
router.get("/", async (req, res) => {
  try {
    const data = await Snippet.find(); // Get All Snippet

    // If no snippets exist
    if (data.length === 0) {
      return res.status(404).json({ message: "No snippets found" });
    }

    // Return all snippets
    return res.status(200).json({ message: "Get All Snippet", data });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Get One Snippet
router.get("/:id", async (req, res) => {
  try {
    const snippetId = req.params.id;
    const data = await Snippet.findById(snippetId);

    if (!data) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    // Return snippet
    return res.status(200).json({ message: "Get Snippet", data });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});


// Create Snippet
router.post("/",  requireAuth(), async (req, res) => {
  const { title, language, code, user } = req.body;
  const userId = req.auth.userId;
  

  try {
    // Validate required fields
    if (!title || !language || !code || !user)
      return res
        .status(400)
        .json({ message: "Title, language, user and code are required" });

    // Create snippet
    const snippet = await Snippet.create({
      userId,
      user,
      title,
      language,
      code,
    });

    return res.status(201).json({
      message: "Snippet created successfully",
      snippet: {
        id: snippet._id,
        userId: snippet.userId,
        user : snippet.user,
        title: snippet.title,
        language: snippet.language,
        code: snippet.code,
        createdAt: snippet.createdAt,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});


// Delete Snippet
router.delete("/:id",  requireAuth(), async (req, res) => {
  const snippetId = req.params.id;
  const userId = req.auth.userId;

  try {
    // Find the snippet
    const snippet = await Snippet.findById(snippetId);
    if (!snippet) return res.status(404).json({ message: "Snippet not Found" });

    // Check ownership
    if (snippet.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this snippet" });
    }

    // Delete snippet
    await snippet.deleteOne();

    return res
      .status(200)
      .json({
        message: "Snippet deleted successfully",
        data: { id: snippetId },
      });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = router;