const { Router } = require('express');

const { 
    listCategories,
    createCategory
 } = require('../controllers/category');

const { validateBody, validateParams } = require('../middlewares/validateRequest');
const authentication = require('../middlewares/authentication');
const validateAccessPermission = require('../middlewares/validateAccessPermission');

const { createCategorySchema, validateUuidSchema } = require('../helpers/validators/categorySquema');

const routes = Router();


routes.get(
    '/categories',
    authentication,
    validateAccessPermission(['super admin']),
    listCategories,
);

routes.post(
    '/categories',
    authentication,
    validateAccessPermission(['super admin']),
    validateBody(createCategorySchema),
    createCategory,
);


module.exports = routes;
