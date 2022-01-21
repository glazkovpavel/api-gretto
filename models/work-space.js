const mongoose = require('mongoose');

const workSpaceSchema = new mongoose.Schema({
  title: {
    type: String
  },
  id: {
    type: String,
    unique: true,
  },
  list: [{
    titleList: {
      type: String,
    },
    idList: {
      type: String,
      unique: true,
    },
    card: [{
      titleCard: {
        type: String,
      },
      idCard: {
        type: String,
        unique: true,
      },
      importantCard : {
        type: Boolean,
      }}]}],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('workSpace', workSpaceSchema);
