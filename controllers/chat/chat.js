const ChatRoomNew = require("../../models/chat/chatRoomNew");
const BadRequestErr = require("../../errors/bad-request-err");
const {invalidDataErrorText,
  invalidUserIdErrorText,
  movieIdNotFoundErrorText,
  forbiddenErrorText,
} = require("../../errors/error-text");
const NotFoundError = require("../../errors/not-found-err");
const ForbiddenErr = require("../../errors/forbidden-err");

// Добавляем новый чат в рабочее пространство
module.exports.createChatInRoom = (req, res, next) => {
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
      }
      return next(err);
    })
    .catch(next);
}

// Удаляем чат из рабочего пространства
module.exports.deleteChatInRoom = (req, res, next) => {
  const  chatDelete  = req.body.chat;
  const  _id  = req.params.roomId;
  const chatInitiator = req.user._id;
  ChatRoomNew.findById(_id).select('+chatInitiator')
    .then((chat) => {
      if (!chat) {
        throw new NotFoundError(movieIdNotFoundErrorText);
      } else if (chat.chatInitiator.toString() === chatInitiator) {
        ChatRoomNew.findByIdAndUpdate({_id},
          {$pull: {"chats": {"_id": chatDelete.id}}},
          { upsert: true, new: true }).select('-chatInitiator')
          .then((deletedChat) => res.status(200).send(deletedChat));
      } else {
        throw new ForbiddenErr(forbiddenErrorText);
      }
    })
    .catch(next);
}

