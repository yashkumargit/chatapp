const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    room: { type: String, required: true }, // Room ID
    sender: { type: String, required: true }, // Sender name or ID
    message: { type: String, required: true }, // Message content
    timestamp: { type: Date, default: Date.now }, // Auto timestamp
  },
  { collection: "messages" }
);

module.exports = mongoose.model("Message", messageSchema);
