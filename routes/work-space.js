
const workSpace = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createWorkSpace, updateWorkSpace } = require('../controllers/work-space');

//workSpace.get('/movies', getMovies);

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

workSpace.patch('/work-space', celebrate({
  body: Joi.object().keys({
    id: Joi.string().required(),
    title: Joi.string().required(),
    list: [{
      idList: Joi.string().required(),
      titleList: Joi.string().required(),
      card: [{
        idCard: Joi.string().required(),
        titleCard: Joi.string().required(),
        importantCard: Joi.boolean().required(),
      }]
    }]
  }),
}), updateWorkSpace );

// workSpace.delete('/movies/:movieId', celebrate({
//   params: Joi.object().keys({
//     movieId: Joi.string().required().length(24).hex(),
//   }),
// }), deleteMovieById);

module.exports = { workSpace };
