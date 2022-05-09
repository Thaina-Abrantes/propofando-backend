const { Router } = require('express');

const {
    getUser,
    listUsers,
    createUser,
    deleteUser,
    updateUser,
    recoveryPassword,
    redefinePassword,
    reportProblem,
    listUserPaginated,
    top3Hits,
    top3AnsweredIncorrectly,
 } = require('../controllers/user');

const {
    validateBody,
    validateParams,
} = require('../middlewares/validateRequest');

const authentication = require('../middlewares/authentication');
const validateAccessPermission = require('../middlewares/validateAccessPermission');

const {
    createUserSchema,
    validateEmailSchema,
    validateTokenSquema,
    validateUpdatePasswordSquema,
} = require('../helpers/validators/userSquema');

const { validateUuidSchema, reportProblemSchema } = require('../helpers/validators/genericSchema');

const routes = Router();

routes.get(
    '/users/paginated',
    authentication,
    validateAccessPermission(['super admin']),
    listUserPaginated,
);

routes.get(
    '/users/:id',
    authentication,
    validateAccessPermission(['super admin']),
    validateParams(validateUuidSchema),
    getUser,
);

routes.get(
    '/users/:id/top-3-hits',
    authentication,
    validateAccessPermission(['super admin', 'student']),
    validateParams(validateUuidSchema),
    top3Hits,
);

routes.get(
    '/users/:id/top-3-errors',
    authentication,
    validateAccessPermission(['super admin', 'student']),
    validateParams(validateUuidSchema),
    top3AnsweredIncorrectly,
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
    recoveryPassword,
);

routes.post(
    '/users/redefine-password/:token',
    validateParams(validateTokenSquema),
    validateBody(validateUpdatePasswordSquema),
    redefinePassword,
);

routes.post(
    '/users/report-problem',
    authentication,
    validateAccessPermission(['student']),
    validateBody(reportProblemSchema),
    reportProblem,
);

module.exports = routes;
