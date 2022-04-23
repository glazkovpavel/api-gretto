// controllers
import deleteController from '../../controllers/chat/delete.js';

const remove = require('express').Router();

remove
  .delete('/room/:roomId', deleteController.deleteRoomById)
  .delete('/message/:messageId', deleteController.deleteMessageById)

module.exports = { remove };
