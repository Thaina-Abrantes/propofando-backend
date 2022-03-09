const { Router } = require('express');
require('express-async-errors');
const { globalErrorHandler } = require('./controllers/error');

const { getUsers, createUser } = require('./controllers/user')

const { exampleMiddleware } = require('./middlewares/example')

const routes = Router();

routes.get("/", exampleMiddleware, (request, response) => {
    const name = request.cookies?.user.name;
    return response.status(200).json({ message: `hi ${name} \u1F600 ` });
});

routes.get("/users", getUsers);

routes.post("/users", createUser);

routes.use(globalErrorHandler)

module.exports = routes;
