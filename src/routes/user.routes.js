const { Router } = require('express');

const { 
    getUser,
    listUsers, 
    createUser,
    deleteUser,
    updateUser,
    recoveryPassword,
    redefinePassword,
 } = require('../controllers/user');

const { 
    validateBody,
    validateParams,
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
    '/users/recovery', 
    validateBody(validateEmailSchema),
    recoveryPassword,
);

routes.post(
    '/users/redefine-password/:token', 
    validateParams(validateTokenSquema),
    validateBody(validateUpdatePasswordSquema),
    redefinePassword,
);

module.exports = routes;
