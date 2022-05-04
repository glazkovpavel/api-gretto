const chat = require('express').Router();
// controllers
const {
  getRecentConversation,
  getConversationByRoomId,
  initiate} = require('../../controllers/chat/chatRoom.js');

const {
  createRoom,
  getChatRoomByRoomId,
  postMessage,
  getChatRoomsByUserId,
  markConversationReadByRoomId} = require('../../controllers/chat/chatRoomNew.js');

chat
  .get('/chat', getChatRoomsByUserId)
  .get('/chat/:roomId', getChatRoomByRoomId)
  .post('/chat/initiate', createRoom)
  .post('/chat/:roomId/message', postMessage)
  .put('/chat/:roomId/mark-read', markConversationReadByRoomId) //пометить беседу как прочитанную по RoomId

module.exports = { chat };
