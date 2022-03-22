const { Router } = require('express');

const { 
    getQuestion, 
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


const routes = Router();

routes.get(
    '/questions/:id',
    authentication,
    validateAccessPermission(['super admin', 'student']),
    getQuestion,
);

routes.post(
    '/questions',
    authentication,
    validateAccessPermission(['super admin']),
    createQuestion,
);

routes.delete(
    '/questions/:id',
    authentication,
    validateAccessPermission(['super admin']),
    deleteQuestion,
);

routes.patch(
    '/questions/:id',
    authentication,
    validateAccessPermission(['super admin']),
    updateQuestion,
);

module.exports = routes;
