const {getTodos, createTodo, deleteTodoById, updateTodo} = require("../controllers/todo");
const {celebrate, Joi} = require("celebrate");
const todo = require('express').Router();

todo.get('/todos', getTodos);

todo.post('/todo', celebrate({
  body: Joi.object().keys({
    titleList: Joi.string(),
    list: Joi.array().items({
      titleTodo: Joi.string(),
      isCompleted: Joi.boolean(),
    }),

  }),
}), createTodo);

todo.patch('/todo', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().required().length(24).hex(),
    titleList: Joi.string(),
    list: Joi.array().items({
      titleTodo: Joi.string(),
      isCompleted: Joi.boolean(),
      _id: Joi.string().length(24).hex(),
    }),
  }),
}), updateTodo);

todo.delete('/todo/:todoId', celebrate({
  params: Joi.object().keys({
    todoId: Joi.string().required().length(24).hex(),
  }),
}), deleteTodoById);

module.exports = { todo };
