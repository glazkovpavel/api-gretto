const ChatMessageNew = require("../../models/chat/chatMessageNew");

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
        res.status(200).send({ success: true, post: aggregate, message: post });
        global.io.sockets.in(roomId).emit('new message', { message: post });
      }
    )
    .catch(next);
};

module.exports.getMessageByRoomId = (req, res, next) => {
  //const roomId  = req.params.roomId;
  ChatMessageNew.find({roomId: req.params.roomId})
    .then((messages) => res.send(messages))
    .catch((err) => next(err))
    .catch(next)

}
