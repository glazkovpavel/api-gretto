const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  titleList: {
    type: String,
  },
  list: [{
    titleTodo: {
  type: String,
},
  isCompleted: {
  type: Boolean,
}
}],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  }
});

module.exports = mongoose.model('todo', todoSchema);
