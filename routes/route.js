const routes = require('express').Router();
const { authorization } = require('./authorization');
const auth = require('../middlewares/auth');
const { users } = require('./users');
const { workSpace } = require('./work-space')
const { journal } = require('./journal')
const { tasks } = require('./task')

const wrong = require('./wrong-requests');

routes.use('/', authorization);

routes.use(auth);

routes.use('/', users);
routes.use('/', workSpace);
routes.use('/', tasks);
routes.use('/', journal);
routes.use('*', wrong);

module.exports = { routes };
