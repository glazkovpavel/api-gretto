const chat = require('express').Router();
// controllers
const {
  getRecentConversation,
  getConversationByRoomId,
  markConversationReadByRoomId,
  initiate,
  postMessage} = require('../../controllers/chat/chatRoom.js');

chat
  .get('/chat', getRecentConversation)
  .get('/chat/:roomId', getConversationByRoomId)
  .post('/chat/initiate', initiate)
  .post('/chat/:roomId/message', postMessage)
  .put('/chat/:roomId/mark-read', markConversationReadByRoomId)

module.exports = { chat };
