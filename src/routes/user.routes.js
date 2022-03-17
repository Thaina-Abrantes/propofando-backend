const { Router } = require('express');

const { 
    getUsers, 
    createUser,
    passwordResetEmail,
 } = require('../controllers/user');

const { validateBody } = require('../middlewares/validateRequest');
const authentication = require('../middlewares/authentication');
const validateAccessPermission = require('../middlewares/validateAccessPermission');

const { 
    createUserSchema,
    validateEmailSchema,
} = require('../helpers/validators/userSquema');

const routes = Router();

routes.get(
    '/users',
     getUsers,
);

routes.post(
    '/users',
    authentication,
    validateAccessPermission(['super admin']),
    validateBody(createUserSchema),
    createUser,
);

routes.post(
    '/users/recovery', 
    validateBody(validateEmailSchema),
    passwordResetEmail,
);

module.exports = routes;
