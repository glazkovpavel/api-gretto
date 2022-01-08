const routes = require('express').Router();
const { authorization } = require('./authorization');
const auth = require('../middlewares/auth');
const { users } = require('./users');
const wrong = require('./wrong-requests');

routes.use('/', authorization);

routes.use(auth);

routes.use('/', users);
routes.use('*', wrong);

module.exports = { routes };
