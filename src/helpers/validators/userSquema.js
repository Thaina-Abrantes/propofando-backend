const yup = require('yup');
const { pt } = require('yup-locales');
const { setLocale } = require('yup');
setLocale(pt);

const createUserSchema = yup.object().shape({
  name: yup.string()
    .required(),

  email: yup.string()
    .email()
    .required(),

  password: yup.string(),
});

const validateEmailSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required(),
});

module.exports = {
  createUserSchema,
  validateEmailSchema,
};
