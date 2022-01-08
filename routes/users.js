const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { updateUser, getUser, getUserId, updateAvatar } = require('../controllers/users');
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
    email: Joi.string().required().email(),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
users.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(methodValidator),
  }),
}), updateAvatar);

module.exports = { users };
