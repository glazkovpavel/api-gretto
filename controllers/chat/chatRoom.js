// utils
const {makeValidation} = require('@withvoid/make-validation');// models
const { ChatRoomModel, CHAT_ROOM_TYPES } = require('../../models/chat/chatRoom');
const {ChatMessageModel} = require('../../models/chat/chatMessage.js');
const {userSchema} = require('../../models/user.js');


module.exports.initiate = async (req, res, next) => {
  try {
    const validation = makeValidation(types => ({
      payload: req.body,
      checks: {
        userIds: {
          type: types.array,
          options: {unique: true, empty: false, stringOnly: true}
        },
        type: {type: types.enum, options: {enum: CHAT_ROOM_TYPES}},
      }
    }));
    if (!validation.success) return res.status(400).json({...validation});

    const {userIds, type} = req.body;
    const chatInitiator = req.user._id;
    const allUserIds = [...userIds, chatInitiator];
    const chatRoom = await ChatRoomModel.initiateChat(allUserIds, type, chatInitiator);
    return res.status(200).json({success: true, chatRoom});
  } catch (error) {
    return res.status(500).send({error: error.message})
  }
};
module.exports.postMessage = async (req, res) => {
    try {
      const { roomId } = req.params;
      const messagePayload = {
        messageText: req.body.messageText,
      };
      const currentLoggedUser = req.user._id;
      const post = await ChatMessageModel.createPostInChatRoom(roomId, messagePayload, currentLoggedUser);
      global.io.sockets.in(roomId).emit('new message', { message: post });
      return res.status(200).json({ success: true, post });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  };
module.exports.getRecentConversation = async (req, res) => {
    try {
      const currentLoggedUser = req.userId;
      const options = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10,
      };
      const rooms = await ChatRoomModel.getChatRoomsByUserId(currentLoggedUser);
      const roomIds = rooms.map(room => room._id);
      const recentConversation = await ChatMessageModel.getRecentConversation(
        roomIds, options, currentLoggedUser
      );
      return res.status(200).json({ success: true, conversation: recentConversation });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  };
module.exports.getConversationByRoomId = async (req, res) => {
    try {
      const { roomId } = req.params;
      const room = await ChatRoomModel.getChatRoomByRoomId(roomId)
      if (!room) {
        return res.status(400).json({
          success: false,
          message: 'No room exists for this id',
        })
      }
      const users = await userSchema.getUserByIds(room.userIds);
      const options = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10,
      };
      const conversation = await ChatMessageModel.getConversationByRoomId(roomId, options);
      return res.status(200).json({
        success: true,
        conversation,
        users,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  };
  module.exports.markConversationReadByRoomId = async (req, res, next) => {
    try {
      const {roomId} = req.params;
      const room = await ChatRoomModel.getChatRoomByRoomId(roomId)
      if (!room) {
        return res.status(400).json({
          success: false,
          message: 'No room exists for this id',
        })
      }

      const currentLoggedUser = req.userId;
      const result = await ChatMessageModel.markMessageRead(roomId, currentLoggedUser);
      return res.status(200).json({success: true, data: result});
    } catch (error) {
      console.log(error);
      return res.status(500).json({success: false, error});
    }
  }
