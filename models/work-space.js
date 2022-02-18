const mongoose = require('mongoose');

const workSpaceSchema = new mongoose.Schema({
  title: {
    type: String
  },
  _id: {
    type: String,
    unique: true,
  },
  list: [{
    titleList: {
      type: String,
    },
    _id: {
      type: String,
      unique: true,
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
  }]
});

module.exports = mongoose.model('workSpace', workSpaceSchema);
