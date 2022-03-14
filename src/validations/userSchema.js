const Joi = require('joi');

const createUserSchema = Joi.object().keys({
  name: Joi.string()
    .alphanum()
    .required(),

  email: Joi.string()
    .email()
    .strict()
    .required(),

  password: Joi.string()
    .strict()
    .required(),
});

module.exports = {
  createUserSchema,
};
