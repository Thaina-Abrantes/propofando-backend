const { Router } = require('express');

const {
  createSimulated,
  consultAnswers,
} = require('../controllers/simulated');

// const { validateBody, validateParams } = require('../middlewares/validateRequest');
const authentication = require('../middlewares/authentication');
const validateAccessPermission = require('../middlewares/validateAccessPermission');

// const { createCategorySchema } = require('../helpers/validators/categorySquema');
// const { validateUuidSchema } = require('../helpers/validators/genericSchema');

const routes = Router();

// Refactor: Aplicar middlawares
routes.post(
  '/simulated',
  createSimulated,
);

routes.post(
  '/simulated/answers/:id',
  authentication,
  validateAccessPermission(['super admin, student']),
  consultAnswers,
);

module.exports = routes;
