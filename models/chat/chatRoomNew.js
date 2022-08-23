const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    chatInitiator: {
      type: String,
    },
    chats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
      }
    ]
  },
  {
    timestamps: true,
    collection: "chatrooms",
  }
);

module.exports = mongoose.model("ChatRoomNew", chatRoomSchema);
