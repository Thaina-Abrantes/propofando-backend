const { Router } = require('express');

const {
  createSimulated,
  answerSimulated,
  consultAnswers,
  listSimulated,
  getRandomQuestions,
  finishSimulated,
} = require('../controllers/simulated');

const { validateParams } = require('../middlewares/validateRequest');
const authentication = require('../middlewares/authentication');
const validateAccessPermission = require('../middlewares/validateAccessPermission');

// const { createCategorySchema } = require('../helpers/validators/categorySquema');
const { validateUuidSchema, validateUuidSchemaListQuestions } = require('../helpers/validators/genericSchema');

const routes = Router();
routes.get(
  '/simulated/:simulatedId/user/:userId',
  authentication,
  validateAccessPermission(['super admin', 'student']),
  validateParams(validateUuidSchemaListQuestions),
  getRandomQuestions,
);

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

routes.patch(
  '/simulated/finish',
  finishSimulated,
);

routes.patch(
  '/simulated',
  answerSimulated,
);

routes.get(
  '/simulated/:id',
  listSimulated,
);

module.exports = routes;
