const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    allUserIds: [{
      type: String,
    }],
    chatInitiator: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "chatrooms",
  }
);

module.exports = mongoose.model("ChatRoomNew", chatRoomSchema);
