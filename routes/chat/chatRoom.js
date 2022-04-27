const chat = require('express').Router();
// controllers
const {
  getRecentConversation,
  getConversationByRoomId,
  markConversationReadByRoomId,
  initiate,
  postMessage} = require('../../controllers/chat/chatRoom.js');

const {
  createRoom,
  getChatRoomByRoomId,
  getChatRoomsByUserId} = require('../../controllers/chat/chatRoomNew.js');

chat
  .get('/chat', getChatRoomsByUserId)
  .get('/chat/:roomId', getChatRoomByRoomId)
  .post('/chat/initiate', createRoom)
  .post('/chat/:roomId/message', postMessage)
  .put('/chat/:roomId/mark-read', markConversationReadByRoomId) //пометить беседу как прочитанную по RoomId

module.exports = { chat };
