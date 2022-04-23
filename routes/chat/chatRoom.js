import express from 'express';
// controllers
import chatRoom from '../../controllers/chat/chatRoom.js';

const chat = express.Router();

chat
  .get('/chat', chatRoom.getRecentConversation)
  .get('/chat/:roomId', chatRoom.getConversationByRoomId)
  .post('/chat/initiate', chatRoom.initiate)
  .post('/chat/:roomId/message', chatRoom.postMessage)
  .put('/chat/:roomId/mark-read', chatRoom.markConversationReadByRoomId)

module.exports = { chat };
