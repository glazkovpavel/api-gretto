const mongoose = require('mongoose');

const workSpaceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
    unique: true,
  },
  list: [{
    titleList: {
      type: String,
    },
    idList: {
      type: String,
      required: true,
      unique: true,
    },
    card: [{
      titleCard: {
        type: String,
        required: true,
      },
      idCard: {
        type: String,
        required: true,
        unique: true,
      },
      importantCard : {
        type: Boolean,
        required: true,
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
