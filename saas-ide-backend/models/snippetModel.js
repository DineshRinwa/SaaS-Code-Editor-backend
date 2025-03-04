const mongoose = require("mongoose");

const snippetSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },

    userId : {
      type: String,
      required : true
    },

    title: {
      type: String,
      required: true
    },

    language: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments" }],
  },
  { timestamps: true }
);

// Create Model
const Snippet = mongoose.model("Snippet", snippetSchema);
module.exports = Snippet;