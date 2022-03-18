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

const validateUuidSchema = yup.object().shape({
  id: yup.string()
    .uuid()
    .required(),
});

const validateEmailSchema = yup.object().shape({
  email: yup.string()
    .email()
    .required(),
});

const validateUpdatePasswordSquema = yup.object().shape({
  password: yup.string()
    .required(),

  passwordConfirmation: yup.string()
    .required()
    .oneOf([yup.ref('password'), null], 'Certifique-se de que as senhas são iguais.'),
});

const validateTokenSquema = yup.object().shape({
  token: yup.string()
    .uuid()
    .required()
})

module.exports = {
  createUserSchema,
  validateUuidSchema,
  validateEmailSchema,
  validateUpdatePasswordSquema,
  validateTokenSquema,
}

