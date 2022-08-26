const chat = require('express').Router();
// controllers
const {
  createRoom,
  getChatRoomByRoomId,
  getChatRoomsByUserId,
  getChatByUserId,
  addChatInRoom,
  deleteChatInRoom,
  markConversationReadByRoomId
} = require('../../controllers/chat/chatRoomNew.js');
const {
  createChatInRoom,
  deleteChat,
  addUserInChat,
  deleteUserInChat,
} = require("../../controllers/chat/chat");

const { postMessage, getMessageByRoomId } = require('../../controllers/chat/chatMessage');

chat
  .get('/chatRooms', getChatRoomsByUserId)
  .get('/chat', getChatByUserId)
  .get('/chat/:roomId', getChatRoomByRoomId)
  .get('/chat-message/:roomId', getMessageByRoomId)
  .post('/chat/initiate', createRoom)
  .post('/chat', createChatInRoom)
  .post('/chat-message/:roomId', postMessage)
  .patch('/chat-delete', deleteChat)
  .patch('/chat-add-user', addUserInChat)
  .patch('/chat-delete-user', deleteUserInChat)
  .patch('/add-chat/:roomId', addChatInRoom)
  .patch('/delete-chat/:roomId', deleteChatInRoom)
  .put('/chat/:roomId/mark-read', markConversationReadByRoomId) //пометить беседу как прочитанную по RoomId

module.exports = { chat };
