const workSpace = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createWorkSpace, getWorkSpace, deleteSpaceById, updateWorkSpace, deleteUserWorkSpace } = require('../controllers/work-space');

workSpace.get('/work-space', getWorkSpace);

workSpace.post('/work-space', celebrate({
  body: Joi.object().keys({
    _id: Joi.string(),
    title: Joi.string(),
    holder: Joi.string(),
    list: Joi.array().items({
      _id: Joi.string(),
      titleList: Joi.string(),
      card: Joi.array().items({
        _id: Joi.string(),
        titleCard: Joi.string(),
        importantCard: Joi.boolean(),
      })}
    ),
    owner: Joi.array()
  })}), createWorkSpace );

workSpace.delete('/work-space/:spaceId', celebrate({
  params: Joi.object().keys({
    spaceId: Joi.string().required().length(11).hex(),
  }),
}), deleteSpaceById);

workSpace.patch('/work-space/:_id',celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().length(11).hex(),
  }),
  body: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  })}), updateWorkSpace );

workSpace.patch('/work-space-delete/:_id',celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().length(11).hex(),
  }),
  body: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  })}), deleteUserWorkSpace );

module.exports = { workSpace };
