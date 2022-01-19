const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  card: {
    titleCard: {
      type: String,
      //required: true,
    },
    idCard: {
      type: String,
      //required: true,
      //unique: true,
    },
    importantCard : {
      type: Boolean,
      //required: true,
    }
  }
});

const listSchema = new mongoose.Schema({
  list: {
    titleList: {
      type: String,
    },
    idList: {
      type: String,
      //required: true,
      //unique: true,
    },
    card: [cardSchema]}
});

const workSpaceSchema = new mongoose.Schema({
  titleSpace: {
    type: String,
    //required: true,
  },
  idSpace: {
    type: String,
    //required: true,
    //unique: true,
  },
  list: [listSchema],
  //owner: {
    //type: mongoose.Schema.Types.ObjectId,
    //ref: 'user',
    //required: true,
  //},
  createdAt: {
    type: Date,
    default: Date.now,
  }
});


module.exports = mongoose.model('workSpace', workSpaceSchema);
