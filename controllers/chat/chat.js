const ChatRoomNew = require("../../models/chat/chatRoomNew");
const BadRequestErr = require("../../errors/bad-request-err");
const {invalidDataErrorText,
  userIdNotFoundText,
  invalidUserIdErrorText,
  duplicateEmailErrorText
} = require("../../errors/error-text");
const NotFoundError = require("../../errors/not-found-err");
const ConflictErr = require("../../errors/conflict-err");

// Добавляем новый чат в рабочее пространство
module.exports.updateChatRoom = (req, res, next) => {
  const  chat  = req.body;
  const  _id  = req.params.roomId;
  const chatInitiator = req.user._id;
  chat.chatInitiator = chatInitiator;
  chat.users = [...chat.users, chatInitiator];
  ChatRoomNew.findByIdAndUpdate({_id}, {$addToSet: {chats: chat}}, { upsert: true, new: true })
    .then((chats) => {
      return res.status(200).send(chats);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestErr(invalidDataErrorText);
      } else if (err.name === 'CastError') {
        throw new BadRequestErr(invalidUserIdErrorText);
      } else if (err.codeName === 'DuplicateKey') {
        throw new ConflictErr(duplicateEmailErrorText);
      }
      return next(err);
    })
    .catch(next);
}
