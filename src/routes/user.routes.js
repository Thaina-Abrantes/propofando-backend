const { Router } = require('express');

const { 
    getUser,
    listUsers, 
    createUser,
    deleteUser,
    updateUser,
    passwordResetEmail,
    updatePassword,
 } = require('../controllers/user');

const { 
    validateBody,
    validateParams,
    validateQuery 
} = require('../middlewares/validateRequest');

const authentication = require('../middlewares/authentication');
const validateAccessPermission = require('../middlewares/validateAccessPermission');

const { 
    createUserSchema,
    validateUuidSchema,
    validateEmailSchema,
    validateTokenSquema,
    validateUpdatePasswordSquema,
} = require('../helpers/validators/userSquema');
 
const routes = Router();

routes.get(
    '/users/:id',
    authentication,
    validateAccessPermission(['super admin']),
    validateParams(validateUuidSchema),
    getUser,
);

routes.get(
    '/users',
    authentication,
    validateAccessPermission(['super admin']),
    listUsers,
);

routes.post(
    '/users',
    authentication,
    validateAccessPermission(['super admin']),
    validateBody(createUserSchema),
    createUser,
);

routes.delete(
    '/users/:id',
    authentication,
    validateAccessPermission(['super admin']),
    validateParams(validateUuidSchema),
    deleteUser,
);

routes.patch(
    '/users/:id',
    authentication,
    validateAccessPermission(['super admin']),
    validateParams(validateUuidSchema),
    validateBody(createUserSchema),
    updateUser,
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
