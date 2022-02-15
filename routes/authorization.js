const authorization = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login, getUsername} = require('../controllers/users');

authorization.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    surname: Joi.string().required().min(2).max(30),
    username: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

authorization.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

authorization.post('/username', celebrate({
  body: Joi.object().keys({
    username: Joi.string().required().min(2).max(30),
  }),
}), getUsername);

module.exports = { authorization };
