// controllers
const {deleteMessageById, deleteRoomById} = require('../../controllers/chat/delete.js');

const remove = require('express').Router();

remove
  .delete('/room/:roomId', deleteRoomById)
  .delete('/message/:messageId', deleteMessageById)

module.exports = { remove };
