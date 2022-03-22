const { Router } = require('express');

const { createQuestion, deleteQuestion } = require('../controllers/question');

const { 
    validateBody,
    validateParams,
    validateQuery 
} = require('../middlewares/validateRequest');

const authentication = require('../middlewares/authentication');
const validateAccessPermission = require('../middlewares/validateAccessPermission');


const routes = Router();


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

module.exports = routes;
