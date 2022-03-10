const Todo = require('../models/todo');
const BadRequestErr = require("../errors/bad-request-err");
const {invalidDataErrorText, movieIdNotFoundErrorText, forbiddenErrorText} = require("../errors/error-text");
const Task = require("../models/task");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenErr = require("../errors/forbidden-err");

module.exports.getTodos = (req, res, next) => {
  const owner = req.user._id;
  Todo.find({owner})
    .then((todos) => res.send(todos))
    .catch(next)
}

module.exports.createTodo = (req, res, next) => {
  const { title, isCompleted = false } = req.body;
  const owner = req.user._id;

  Todo.create({ title, isCompleted, owner })
    .then((todo) => res.status(201).send(todo))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestErr(invalidDataErrorText);
      }
      return next(err);
    })
    .catch(next);
}

module.exports.deleteTodoById = (req, res, next) => {
  const todo = {_id: req.params.todoId}

  Task.findOne(todo).select('+owner')
    .then((todo) => {
      if (!todo) {
        throw new NotFoundError(movieIdNotFoundErrorText);
      } else if (todo.owner.toString() !== req.user._id) {
        throw new ForbiddenErr(forbiddenErrorText);
      }

      Task.findByIdAndDelete(todo).select('-owner')
        .then((deletedTodo) => res.status(200).send(deletedTodo));
    })
    .catch(next);
}
