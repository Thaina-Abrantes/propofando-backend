const { Router } = require('express');

const { getUsers, createUser } = require('../controllers/user');

const routes = Router();

routes.get("/users", getUsers);
routes.post("/users", createUser);

module.exports = routes;
