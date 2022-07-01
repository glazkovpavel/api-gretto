const mongoose = require('mongoose');
const  {v4}  = require("uuid");
const uuidv4 = v4

const MESSAGE_TYPES = {
  TYPE_TEXT: "text",
};

const readByRecipientSchema = new mongoose.Schema(
  {
    _id: false,
    readByUserId: String,
    readAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: false,
  }
);

const chatMessageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    roomId: {
      type: String,
    },
    message: {
      type: mongoose.Schema.Types.Mixed,

    },
    type: {
      type: String,
      default: () => MESSAGE_TYPES.TYPE_TEXT,
    },
    postedByUser: {
      type: String,
    },
    readByRecipients: [readByRecipientSchema],
  },
  {
    timestamps: true,
    collection: "chatmessages",
  }
);

module.exports = mongoose.model("ChatMessageNew", chatMessageSchema);
