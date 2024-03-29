const ChatRoomNew = require("../../models/chat/chatRoomNew");
const ChatMessageNew = require("../../models/chat/chatMessageNew");
const Chat = require("../../models/chat/chat");
const BadRequestErr = require("../../errors/bad-request-err");
const {invalidDataErrorText, invalidUserIdErrorText,
  movieIdNotFoundErrorText,
  forbiddenErrorTextDeleteOwner,
  forbiddenErrorText
} = require("../../errors/error-text");
const NotFoundError = require("../../errors/not-found-err");
const ForbiddenErr = require("../../errors/forbidden-err");

module.exports.postMessage = (req, res, next) => {
  const { roomId } = req.params;
  const message = {
    messageText: req.body.messageText,
  };
  const postedByUser = req.user._id;
  const readByRecipients = { readByUserId: postedByUser }
  ChatMessageNew.create({roomId, message, postedByUser, readByRecipients})
    .then((post) => {
      const aggregate = ChatMessageNew.aggregate(
        [
          // get post where _id = post._id
          { $match: { _id: post._id } },
          // do a join on another table called users, and
          // get me a user whose _id = postedByUser
          {
            $lookup: {
              from: 'users',
              localField: 'postedByUser',
              foreignField: '_id',
              as: 'postedByUser',
            }
          },
          { $unwind: '$postedByUser' },
          // do a join on another table called chatrooms, and
          // get me a chatroom whose _id = roomId
          {
            $lookup: {
              from: 'chatrooms',
              localField: 'roomId',
              foreignField: '_id',
              as: 'chatRoomInfo',
            }
          },
          { $unwind: '$chatRoomInfo' },
          { $unwind: '$chatRoomInfo.userIds' },
          // do a join on another table called users, and
          // get me a user whose _id = userIds
          {
            $lookup: {
              from: 'users',
              localField: 'chatRoomInfo.userIds',
              foreignField: '_id',
              as: 'chatRoomInfo.userProfile',
            }
          },
          { $unwind: '$chatRoomInfo.userProfile' },
          // group data
          {
            $group: {
              _id: '$chatRoomInfo._id',
              postId: { $last: '$_id' },
              roomId: { $last: '$chatRoomInfo._id' },
              message: { $last: '$message' },
              type: { $last: '$type' },
              postedByUser: { $last: '$postedByUser' },
              readByRecipients: { $last: '$readByRecipients' },
              chatRoomInfo: { $addToSet: '$chatRoomInfo.userProfile' },
              createdAt: { $last: '$createdAt' },
              updatedAt: { $last: '$updatedAt' },
            }
          }
        ])
      res.status(200).send({ success: true, post: aggregate[0], message: post });
      global.io.sockets.in(roomId).emit('new message', { message: post });
      }
    )


};

module.exports.createRoom = (req, res, next) => {
  const {title} = req.body;
  const chatInitiator = req.user._id;

  ChatRoomNew.create({ chatInitiator, title})
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

  ChatRoomNew.findOne({roomId})
    .then((room) => res.status(200).send(room))
    .catch(next)
}

module.exports.getChatByUserId = (req, res, next) => {
  const userId = req.user._id;
    Chat.find({userId})
    .then((chats) => {
      ChatRoomNew.find({userId})
        .populate('chats')
        .then((rooms) => {
          //const roomIds = rooms.map(room => room._id);
          return res.status(200).send({chats, rooms})
        })
        .catch(next)
      }
    )
    .catch(next)

}

// Добавляем id чата в room
module.exports.addChatInRoom = (req, res, next) => {
  const _id = req.params.roomId;
  const idChat = req.body.chat._id;

  ChatRoomNew.findByIdAndUpdate({_id}, {$addToSet: {chats: idChat}}, { upsert: true, new: true })
    .populate('chats')
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestErr(invalidDataErrorText);
      } else if (err.name === 'CastError') {
        throw new BadRequestErr(invalidUserIdErrorText);
      }
      return next(err);
    })

    .catch(next);

};

// Удаляем id чата из room
module.exports.deleteChatInRoom = (req, res, next) => {
  const _id = req.params.roomId;
  const idChat = req.body.chat._id;

  ChatRoomNew.findByIdAndUpdate({_id}, {$pull: {chats: idChat}}, { upsert: true, new: true })
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestErr(invalidDataErrorText);
      } else if (err.name === 'CastError') {
        throw new BadRequestErr(invalidUserIdErrorText);
      }
      return next(err);
    })

    .catch(next);
};

module.exports.getChatRoomsByUserId = (req, res, next) => {
  const userId = req.user._id;
  const options = {
    page: parseInt(req.query.page) || 0,
    limit: parseInt(req.query.limit) || 10,
  };
  ChatRoomNew.find({ allUserIds: { $all: [userId] } })
    .populate('chats')
    .then((rooms) => {
      //const roomIds = rooms.map(room => room._id);
      Chat.find({userId})
        .then((chats) => {
          const roomAllChat = {
            _id: '0',
            chats: chats,
            title: 'Все чаты',
            updatedAt: 0,
          }
          rooms.unshift(roomAllChat)
          res.status(200).json(rooms);
        })
      /**
       * @param {Array} roomIds - chat room ids
       * @param {{ page, limit }} options - pagination options
       * @param {String} currentUserOnlineId - user id
       */
      const recentConversation = ChatMessageNew.aggregate([
        { $match: { roomId: { $in: roomIds } } },
        {
          $group: {
            _id: 'roomId',
            title: 'title',
            title2: {$last: 'title'},
            messageId: { $last: '$_id' },
            roomId: { $last: 'roomId' },
            message: { $last: '$message' },
            type: { $last: '$type' },
            postedByUser: { $last: '$postedByUser' },
            createdAt: { $last: '$createdAt' },
            readByRecipients: { $last: '$readByRecipients' },
          }
        },
        { $sort: { createdAt: -1 } },
        // do a join on another table called users, and
        // get me a user whose _id = postedByUser
        {
          $lookup: {
            from: 'user',
            localField: 'postedByUser',
            foreignField: '_id',
            as: 'postedByUser',
          }
        },
        { $unwind: "$postedByUser" },
        // do a join on another table called chatrooms, and
        // get me room details
        {
          $lookup: {
            from: 'chatrooms',
            localField: '_id',
            foreignField: '_id',
            as: 'roomInfo',
          }
        },
        { $unwind: "$roomInfo" },
        { $unwind: "$roomInfo.userIds" },
        // do a join on another table called users
        {
          $lookup: {
            from: 'users',
            localField: 'roomInfo.userIds',
            foreignField: '_id',
            as: 'roomInfo.userProfile',
          }
        },
        { $unwind: "$readByRecipients" },
        // do a join on another table called users
        {
          $lookup: {
            from: 'users',
            localField: 'readByRecipients.readByUserId',
            foreignField: '_id',
            as: 'readByRecipients.readByUser',
          }
        },

        {
          $group: {
            _id: '$roomInfo._id',
            messageId: { $last: '$messageId' },
            roomId: { $last: 'roomId' },
            message: { $last: '$message' },
            type: { $last: '$type' },
            postedByUser: { $last: '$postedByUser' },
            readByRecipients: { $addToSet: '$readByRecipients' },
            roomInfo: { $addToSet: '$roomInfo.userProfile' },
            createdAt: { $last: '$createdAt' },
          },
        },
        // apply pagination
        { $skip: options.page * options.limit },
        { $limit: options.limit },
      ])

    }
    )
    .catch(next)

}

module.exports.markConversationReadByRoomId = (req, res, next) => {
    const {roomId} = req.params;
  const currentUserOnlineId = req.user._id;
  ChatRoomNew.findOne({_id: roomId})
    .then((roomId) => {
      ChatRoomNew.updateMany(
        {
          roomId,
          'readByRecipients.readByUserId': { $ne: currentUserOnlineId }
        },
        {
          $addToSet: {
            readByRecipients: { readByUserId: currentUserOnlineId }
          }
        },
        {
          multi: true
        }
      )
        .then((result) => res.status(200).json({success: true, data: result}))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new BadRequestErr(invalidDataErrorText);
          }
          return next(err);
        })
        .catch(next);
    })



}


