const { Router } = require('express');

const {
    getQuestion,
    listQuestions,
    createQuestion,
    deleteQuestion,
    updateQuestion,
    getStatistics,
} = require('../controllers/question');

const {
    validateBody,
    validateParams,
    validateQuery,
} = require('../middlewares/validateRequest');

const authentication = require('../middlewares/authentication');
const validateAccessPermission = require('../middlewares/validateAccessPermission');

const {
    validateUuidSchema,
    paginatedSchema,
} = require('../helpers/validators/genericSchema');

const {
    createQuestionSchema,
    updateQuestionSchema,
} = require('../helpers/validators/questionSquema');

const routes = Router();

routes.get(
    '/questions/:id/statistics',
    authentication,
    validateAccessPermission(['super admin', 'student']),
    getStatistics,
);

routes.get(
    '/questions/:id',
    authentication,
    validateAccessPermission(['super admin']),
    validateParams(validateUuidSchema),
    getQuestion,
);

routes.get(
    '/questions',
    authentication,
    validateAccessPermission(['super admin']),
    validateQuery(paginatedSchema),
    listQuestions,
);

routes.post(
    '/questions',
    authentication,
    validateAccessPermission(['super admin']),
    validateBody(createQuestionSchema),
    createQuestion,
);

routes.delete(
    '/questions/:id',
    authentication,
    validateAccessPermission(['super admin']),
    validateParams(validateUuidSchema),
    deleteQuestion,
);

routes.patch(
    '/questions/:id',
    authentication,
    validateAccessPermission(['super admin']),
    validateParams(validateUuidSchema),
    validateBody(updateQuestionSchema),
    updateQuestion,
);

module.exports = routes;
