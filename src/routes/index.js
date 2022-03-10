const { Router } = require('express');
require('express-async-errors');
const { globalErrorHandler } = require('../controllers/error');

const { exampleMiddleware } = require('../middlewares/example')

const routes = Router();

const userRoutes = require('./user.routes');

routes.get("/", exampleMiddleware, (request, response) => {
    const name = request.cookies?.user.name;
    return response.status(200).json({ message: `hi ${name} \u1F600 ` });
});

routes.use(userRoutes);

routes.use(globalErrorHandler)

module.exports = routes;
