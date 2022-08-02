const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    kind: {
      type: Number,
    },
    users: [{
      type: String,
    }],
    chatInitiator: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "chat",
  }
);

module.exports = mongoose.model("Chat", chatSchema);
