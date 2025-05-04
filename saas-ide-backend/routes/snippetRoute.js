const express = require("express");
const Snippet = require("../models/snippetModel");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

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
router.post("/", authMiddleware, async (req, res) => {
  const { title, language, code, name } = req.body;
  const userId = req.user.id;
  
  try {
    // Validate required fields
    if (!title || !language || !code || !name) {
      return res
        .status(400)
        .json({ message: "Title, language, code and Name are required" });
    }
    
    // Create snippet
    const snippet = await Snippet.create({
      userId,
      user: name,
      title,
      language,
      code,
    });
    
    return res.status(201).json({
      message: "Snippet created successfully",
      snippet: {
        id: snippet._id,
        userId: snippet.userId,
        user: snippet.user,
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
router.delete("/:id", authMiddleware, async (req, res) => {
  const snippetId = req.params.id;
  const userId = req.user.id;
  console.log(snippetId, userId);
  
  try {
    // Find the snippet
    const snippet = await Snippet.findById(snippetId);
    if (!snippet) return res.status(404).json({ message: "Snippet not Found" });
    console.log(snippet);
    
    // Check ownership - Convert ObjectIds to strings for comparison
    if (snippet.userId.toString() !== userId.toString()) {
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

