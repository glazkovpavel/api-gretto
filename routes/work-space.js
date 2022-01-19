
const workSpace = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createWorkSpace, updateWorkSpace } = require('../controllers/work-space');

//workSpace.get('/movies', getMovies);

workSpace.post('/work-space',  createWorkSpace );

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
