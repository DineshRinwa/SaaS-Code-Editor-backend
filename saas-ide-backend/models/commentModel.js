const mongoose = require("mongoose");
const Snippet = require("./snippetModel");

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    snippet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Snippet",
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);

// Create Comment Model
const Comments = mongoose.model("Comments", commentSchema);
module.exports = Comments;