const { Router } = require('express');

const { login } = require('../controllers/login');

const { validateBody } = require('../middlewares/validateRequest');

const { loginSchema } = require('../helpers/validators/loginSchema');

const routes = Router();

routes.post('/login',
 validateBody(loginSchema), 
 login);

module.exports = routes;
