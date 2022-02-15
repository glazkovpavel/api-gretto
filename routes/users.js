const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { updateUser, getUser, getUserId, getUsers } = require('../controllers/users');
const { methodValidator } = require('../middlewares/methodValidator');

users.get('/users/me', getUser);

users.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUserId);

users.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    surname: Joi.string().required().min(2).max(30),
    username: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    avatar: Joi.string().custom(methodValidator),
  }),
}), updateUser);

users.post('/users', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    surname: Joi.string().min(2).max(30),
  }),
}), getUsers)

module.exports = { users };
