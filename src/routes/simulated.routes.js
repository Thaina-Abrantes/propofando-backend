const { Router } = require('express');

const {
  createSimulated,
  consultAnswers,
} = require('../controllers/simulated');

const { validateParams } = require('../middlewares/validateRequest');
const authentication = require('../middlewares/authentication');
const validateAccessPermission = require('../middlewares/validateAccessPermission');

// const { createCategorySchema } = require('../helpers/validators/categorySquema');
const { validateUuidSchema } = require('../helpers/validators/genericSchema');

const routes = Router();

routes.get(
  '/simulated/:id/answers',
  authentication,
  validateAccessPermission(['super admin', 'student']),
  validateParams(validateUuidSchema),
  consultAnswers,
);

// Refactor: Aplicar middlawares
routes.post(
  '/simulated',
  createSimulated,
);

module.exports = routes;
