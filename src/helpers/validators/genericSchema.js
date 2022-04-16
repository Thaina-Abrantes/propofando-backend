const yup = require('yup');
const { pt } = require('yup-locales');
const { setLocale } = require('yup');

setLocale(pt);

const validateUuidSchema = yup.object().shape({
  id: yup.string()
    .uuid()
    .required(),
});

const paginatedSchema = yup.object().shape({
  page: yup.number().positive(),
  size: yup.number().positive(),
});

const reportProblemSchema = yup.object().shape({
    description: yup.string()
      .strict()
      .required(),
  });

module.exports = {
  validateUuidSchema,
  paginatedSchema,
  reportProblemSchema,
};
