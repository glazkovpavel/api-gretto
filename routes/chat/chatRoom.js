const chat = require('express').Router();
// controllers
const {
  createRoom,
  getChatRoomByRoomId,
  postMessage,
  getChatRoomsByUserId,
  markConversationReadByRoomId} = require('../../controllers/chat/chatRoomNew.js');
const {
  createChatInRoom,
  deleteChatInRoom,
  addUserInChat,
  deleteUserInChat
} = require("../../controllers/chat/chat");

chat
  .get('/chat', getChatRoomsByUserId)
  .get('/chat/:roomId', getChatRoomByRoomId)
  .post('/chat/initiate', createRoom)
  .post('/chat/:roomId/message', postMessage)
  .patch('/chat/:roomId', createChatInRoom)
  .patch('/chat-delete/:roomId', deleteChatInRoom)
  .patch('/chat-add-user', addUserInChat)
  .patch('/chat-delete-user', deleteUserInChat)
  .put('/chat/:roomId/mark-read', markConversationReadByRoomId) //пометить беседу как прочитанную по RoomId

module.exports = { chat };
