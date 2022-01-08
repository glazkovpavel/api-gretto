const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  text: {
    type: String,
  },
  date: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('journal', journalSchema);
