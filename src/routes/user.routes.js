const { Router } = require('express');

const { 
    getUsers, 
    createUser,
    passwordResetEmail,
    updatePassword,
 } = require('../controllers/user');

const { validateBody, validateQuery } = require('../middlewares/validateRequest');
const authentication = require('../middlewares/authentication');
const validateAccessPermission = require('../middlewares/validateAccessPermission');

const { 
    createUserSchema,
    validateEmailSchema,
    validateTokenSquema,
    validateUpdatePasswordSquema,
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
    '/users/recovery-password', 
    validateBody(validateEmailSchema),
    passwordResetEmail,
);

routes.post(
    '/users/update-password', 
    validateQuery(validateTokenSquema),
    validateBody(validateUpdatePasswordSquema),
    updatePassword,
);

module.exports = routes;
