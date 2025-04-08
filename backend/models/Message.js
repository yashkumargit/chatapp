const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    room: {
      type: String,
      required: true,
      index: true, // 🔍 Optimizes room-based queries
    },
    sender: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "messages",
    timestamps: true, // ⏱ Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Message", messageSchema);
