const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { updateUser, getUser, getUserId } = require('../controllers/users');
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
    username: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    avatar: Joi.string().required().custom(methodValidator),
  }),
}), updateUser);

module.exports = { users };
