const {getTodos, createTodo, deleteTodoById} = require("../controllers/todo");
const {celebrate, Joi} = require("celebrate");
const todo = require('express').Router();

todo.get('/todos', getTodos);

todo.post('/todo', celebrate({
  body: Joi.object().keys({
    title: Joi.string().required(),
    isCompleted: Joi.boolean().required(),
  }),
}), createTodo);

todo.delete('/todo/:todoId', celebrate({
  params: Joi.object().keys({
    spaceId: Joi.string().required().length(24).hex(),
  }),
}), deleteTodoById);

module.exports = { todo };
