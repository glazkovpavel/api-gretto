const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  date: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  }
});

module.exports = mongoose.model('journal', journalSchema);
