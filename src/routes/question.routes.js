const { Router } = require('express');

const { 
    getQuestion, 
    listQuestions,
    createQuestion, 
    deleteQuestion, 
    updateQuestion
} = require('../controllers/question');

const { 
    validateBody,
    validateParams,
    validateQuery 
} = require('../middlewares/validateRequest');

const authentication = require('../middlewares/authentication');
const validateAccessPermission = require('../middlewares/validateAccessPermission');

const { validateUuidSchema } = require('../helpers/validators/userSquema');
const { createQuestionSchema } = require('../helpers/validators/questionSquema');


const routes = Router();

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
    updateQuestion,
);

module.exports = routes;
