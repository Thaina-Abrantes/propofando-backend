const { Router } = require('express');
require('express-async-errors');
const { globalErrorHandler } = require('../controllers/error');

const routes = Router();

const userRoutes = require('./user.routes');
const loginRoutes = require('./login.routes');
const questionRoutes = require('./question.routes');

routes.use(userRoutes);
routes.use(loginRoutes);
routes.use(questionRoutes);

routes.use(globalErrorHandler)

module.exports = routes;
