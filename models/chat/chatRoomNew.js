const mongoose = require('mongoose');
const  {v4}  = require("uuid");
const uuidv4 = v4

const chatSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
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

const chatRoomSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    title: {
      type: String,
    },
    kind: {
      type: Number,
    },
    userIds: [{
      type: String,
    }],
    chatInitiator: {
      type: String,
    },
    chats: [chatSchema]
  },
  {
    timestamps: true,
    collection: "chatrooms",
  }
);

module.exports = mongoose.model("ChatRoomNew", chatRoomSchema);
