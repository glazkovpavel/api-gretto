const chat = require('express').Router();
// controllers
const {
  createRoom,
  getChatRoomByRoomId,
  postMessage,
  getChatRoomsByUserId,
  markConversationReadByRoomId} = require('../../controllers/chat/chatRoomNew.js');
const {updateChatRoom} = require("../../controllers/chat/chat");

chat
  .get('/chat', getChatRoomsByUserId)
  .get('/chat/:roomId', getChatRoomByRoomId)
  .post('/chat/initiate', createRoom)
  .post('/chat/:roomId/message', postMessage)
  .patch('/chat/:roomId', updateChatRoom)
  .put('/chat/:roomId/mark-read', markConversationReadByRoomId) //пометить беседу как прочитанную по RoomId

module.exports = { chat };
