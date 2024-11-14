const mongoose = require('mongoose');

const todoListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const TodoList = mongoose.model('todoList', todoListSchema);

module.exports = TodoList;