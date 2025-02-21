const express = require("express");
const Comment = require("../models/commentModel");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.post("/:id", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const snippetId = req.params.id;

    // Validate input
    if (!text)
      return res.status(404).json({ message: "Please enter a comment!" });

    // Create comment
    const comment = await Comment.create({
      user: req.user.id,
      snippet: snippetId,
      text,
    });

    return res.status(201).json({
      message: "Comment Create Sucessfully",
      comment: {
        id: comment._id,
        user: comment.user,
        snippet: comment.snippet,
        text: comment.text,
        createdAt: comment.createdAt,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const commentId = req.params.id;

    // Find comment
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not Found" });

    // Check ownership
    if (comment.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
    }

    // Delete comment
    await comment.deleteOne();

    // Send success response
    return res.status(200).json({ message: "Comment deleted successfully" });

  } catch (error) {
    res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
  }
});

module.exports = router;