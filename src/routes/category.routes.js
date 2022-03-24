const { Router } = require('express');

const { 
    createCategory,
    listCategories,
    listCategoriesPaginated,
    getCategory,
    deleteCategory,
    updateCategory,
 } = require('../controllers/category');

const { validateBody, validateParams } = require('../middlewares/validateRequest');
const authentication = require('../middlewares/authentication');
const validateAccessPermission = require('../middlewares/validateAccessPermission');

const { createCategorySchema, validateUuidSchema } = require('../helpers/validators/categorySquema');

const routes = Router();

routes.get(
    '/categories/paginated',
    authentication,
    validateAccessPermission(['super admin']),
    listCategoriesPaginated,
);

routes.get(
    '/categories/:id',
    authentication,
    validateAccessPermission(['super admin']),
    validateParams(validateUuidSchema),
    getCategory,
);

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

routes.delete(
    '/categories/:id',
    authentication,
    validateAccessPermission(['super admin']),
    validateParams(validateUuidSchema),
    deleteCategory,
);

routes.patch(
    '/categories/:id',
    authentication,
    validateAccessPermission(['super admin']),
    validateParams(validateUuidSchema),
    validateBody(createCategorySchema),
    updateCategory,
);

module.exports = routes;
