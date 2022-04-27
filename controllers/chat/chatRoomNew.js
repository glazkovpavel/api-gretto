const chatRoomNew = require("../../models/chat/chatRoomNew");
const BadRequestErr = require("../../errors/bad-request-err");
const {invalidDataErrorText} = require("../../errors/error-text");

module.exports.createRoom = (req, res, next) => {
  const {userIds, title} = req.body;
  const chatInitiator = req.user._id;
  const allUserIds = [...userIds, chatInitiator];

  chatRoomNew.create({allUserIds, chatInitiator, title})
    .then((chat) => res.status(201).send(chat))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestErr(invalidDataErrorText);
      }
      return next(err);
    })
    .catch(next);
}

module.exports.getChatRoomByRoomId = (req, res, next) => {
  const { roomId } = req.params;

  chatRoomNew.findOne({roomId})
    .then((room) => res.status(200).send(room))
    .catch(next)
}

module.exports.getChatRoomsByUserId = (req, res, next) => {
  const userId = req.user._id;

  chatRoomNew.find({ allUserIds: { $all: [userId] } })
    .then((rooms) => res.status(200).send(rooms))
    .catch(next)
}


