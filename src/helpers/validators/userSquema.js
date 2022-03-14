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

  password: yup.string()
    .strict()
    .required(),
});

module.exports = {
  createUserSchema,
};
