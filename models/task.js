const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('journal', taskSchema);
