const ChatRoomModel = require('../../models/chat/chatRoom.js');
const ChatMessageModel = require('../../models/chat/chatMessage.js');
const ChatRoomNew = require("../../models/chat/chatRoomNew");

// Удаление рабочего пространства
  module.exports.deleteRoomById = async (req, res) => {
    try {
      const { roomId } = req.params;
      // сделать удаление чатов из БД
      const room = await ChatRoomNew.remove({ _id: roomId });
      const messages = await ChatMessageModel.remove({ chatRoomId: roomId })
      return res.status(200).json({
        success: true,
        message: "Operation performed succesfully",
        deletedRoomsCount: room.deletedCount,
        deletedMessagesCount: messages.deletedCount,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  };

  module.exports.deleteMessageById = async (req, res) => {
    try {
      const { messageId } = req.params;
      const message = await ChatMessageModel.remove({ _id: messageId });
      return res.status(200).json({
        success: true,
        deletedMessagesCount: message.deletedCount,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  };
