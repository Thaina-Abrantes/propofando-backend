const { Router } = require('express');
require('express-async-errors');
const { globalErrorHandler } = require('../controllers/error');

const routes = Router();

const userRoutes = require('./user.routes');
const loginRoutes = require('./login.routes');
const categoriesRoutes = require('./category.routes');

routes.use(userRoutes);
routes.use(loginRoutes);
routes.use(categoriesRoutes);

routes.use(globalErrorHandler)

module.exports = routes;
