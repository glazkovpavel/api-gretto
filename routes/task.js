const tasks = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getTask, createTask, deleteTaskById, updateTask } = require('../controllers/task');


tasks.get('/tasks/:dateId', celebrate({
  params: Joi.object().keys({
    dateId: Joi.string().required(),
  }),
}), getTask);

tasks.post('/tasks', celebrate({
  body: Joi.object().keys({
    title: Joi.string().required(),
    date: Joi.string().required().length(10),
  }),
}), createTask);

tasks.patch('/tasks/:taskId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
  body: Joi.object().keys({
    _id: Joi.string().required().length(24).hex(),
    title: Joi.string().required(),
    date: Joi.string().required().length(10),
  }),
}), updateTask);

tasks.delete('/tasks/:taskId', celebrate({
  params: Joi.object().keys({
    taskId: Joi.string().required().length(24).hex(),
  }),
}), deleteTaskById);

module.exports = { tasks };
