const mongoose = require('mongoose');

const workSpaceSchema = new mongoose.Schema({
  title: {
    type: String
  },
  _id: {
    type: String,
  },
  list: [{
    titleList: {
      type: String,
    },
    _id: {
      type: String,
    },
    card: [{
      titleCard: {
        type: String,
      },
      _id: {
        type: String,
      },
      importantCard : {
        type: Boolean,
      }}]}],
  owner: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
    required: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  }
});

module.exports = mongoose.model('workSpace', workSpaceSchema);
