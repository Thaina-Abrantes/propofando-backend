const { Router } = require('express');

const { 
    getUsers, 
    createUser,
 } = require('../controllers/user');

const {
    validateBody,
  } = require('../middlewares/validateRequest');

const { createUserSchema } = require('../helpers/validators/userSquema');

const routes = Router();

routes.get(
    '/users',
     getUsers,
);

routes.post(
    '/users',
    validateBody(createUserSchema),
    createUser,
);

module.exports = routes;
