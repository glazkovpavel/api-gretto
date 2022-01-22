const journal = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getJournal, createJournal, updateJournal } = require('../controllers/journal');

journal.get('/journal', getJournal);

journal.post('/journal', celebrate({
  body: Joi.object().keys({
    text: Joi.string(),
    date: Joi.string()
  })}), createJournal );

journal.put('/journal', celebrate({
  body: Joi.object().keys({
    text: Joi.string(),
    date: Joi.string()
  })}), updateJournal );

module.exports = { journal };
