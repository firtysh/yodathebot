const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ["user", "assistant"],
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
},{ _id: false });

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messages: [chatMessageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = {Chat}
