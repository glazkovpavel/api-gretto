const workSpace = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createWorkSpace, getWorkSpace, deleteSpaceById } = require('../controllers/work-space');

workSpace.get('/work-space', getWorkSpace);

workSpace.post('/work-space', celebrate({
  body: Joi.object().keys({
    id: Joi.string(),
    title: Joi.string(),
    list: Joi.array().items({
      idList: Joi.string(),
      titleList: Joi.string(),
      card: Joi.array().items({
        idCard: Joi.string(),
        titleCard: Joi.string(),
        importantCard: Joi.boolean(),
      })}
    )
  })}), createWorkSpace );

workSpace.delete('/work-space/:spaceId', celebrate({
  params: Joi.object().keys({
    spaceId: Joi.string().required().length(11).hex(),
  }),
}), deleteSpaceById);

module.exports = { workSpace };
