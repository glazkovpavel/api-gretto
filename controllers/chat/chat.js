const Chat = require("../../models/chat/chat");
const BadRequestErr = require("../../errors/bad-request-err");
const {
  invalidDataErrorText,
  invalidUserIdErrorText,
  movieIdNotFoundErrorText,
  forbiddenErrorText,
  forbiddenErrorTextDeleteOwner
} = require("../../errors/error-text");
const NotFoundError = require("../../errors/not-found-err");
const ForbiddenErr = require("../../errors/forbidden-err");
const ChatRoomNew = require("../../models/chat/chatRoomNew");

// Создаём чат
module.exports.createChatInRoom = (req, res, next) => {
  const chat = req.body;
  const chatInitiator = req.user._id;
  chat.chatInitiator = chatInitiator;
  chat.users = [...chat.users, chatInitiator];
  Chat.create(chat)
    .then((item) => res.status(201).send(item))
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

// Удаляем чат
module.exports.deleteChat = (req, res, next) => {
  const chatDelete  = req.body.chat;
  const chatInitiator = req.user._id;
  Chat.findById(chatDelete._id).select('+chatInitiator')
    .then((chat) => {
      if (!chat) {
        throw new NotFoundError(movieIdNotFoundErrorText);
      } else if (chat.chatInitiator.toString() === chatInitiator) {
        Chat.findByIdAndDelete({_id: chatDelete._id}).select('-chatInitiator')
          .then((deletedChat) => res.status(200).send(deletedChat));
      } else {
        throw new ForbiddenErr(forbiddenErrorText);
      }
    })
    .catch(next);
}

// Добавляем пользователя в чат

module.exports.addUserInChat = (req, res, next) => {
  const user = req.body.user;
  const chatAdd = req.body.chat;
  const chatInitiator = req.user._id;
  const _id = chatAdd._id;

  Chat.findById(_id)
    .then((chat) => {
      if (!chat) {
        throw new NotFoundError(movieIdNotFoundErrorText);
      } else if (chat.chatInitiator.toString() === chatInitiator || chat.kind === 0) {
        Chat.findByIdAndUpdate({_id}, {$addToSet: {users: user._id}}, { upsert: true, new: true })
          .then((item) => res.status(200).send(item));
      } else {
        throw new ForbiddenErr(forbiddenErrorText);
      }
    })
    .catch(next);
}

// Удаляем пользователя из чата
module.exports.deleteUserInChat = (req, res, next) => {
  const userDelete = req.body.user;
  const chatDelete = req.body.chat;
  const chatDeleteInitiator = req.user._id;
  const _id = chatDelete._id;

  Chat.findById(_id)
    .then((chat) => {
      if (!chat) {
        throw new NotFoundError(movieIdNotFoundErrorText);
      } else if (chat.chatInitiator.toString() === userDelete._id) {
        throw new ForbiddenErr(forbiddenErrorTextDeleteOwner);
      } else if (chat.chatInitiator.toString() === chatDeleteInitiator || chat.kind === 0) {
        Chat.findByIdAndUpdate({_id}, {$pull: {users: userDelete._id}}, { upsert: true, new: true })
          .then((item) => {
            ChatRoomNew.find({ chatInitiator: userDelete._id, chats: { $all: [_id] } })
              .then((deleteChat) => {
                if (deleteChat.length) {
                  deleteChat.forEach((chat) => {
                    ChatRoomNew.findByIdAndUpdate({_id: chat._id}, {$pull: {chats: [_id]}})
                      .then((res) => console.log(res))
                  })
                }
              })
            return res.status(200).send(item);
          });
      } else {
        throw new ForbiddenErr(forbiddenErrorText);
      }
    })
    .catch(next);
}
