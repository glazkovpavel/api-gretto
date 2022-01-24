const journal = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getJournal, createJournal } = require('../controllers/journal');

journal.get('/journal/:journalDate',celebrate({
  params: Joi.object().keys({
    journalDate: Joi.string().required()
  })}), getJournal);

journal.post('/journal/', celebrate({
  body: Joi.object().keys({
    text: Joi.string(),
    date: Joi.string()
  })}), createJournal);

module.exports = { journal };
