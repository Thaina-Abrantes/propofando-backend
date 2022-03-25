const yup = require('yup');
const { pt } = require('yup-locales');
const { setLocale } = require('yup');
setLocale(pt);

const createCategorySchema = yup.object().shape({
  name: yup.string()
    .required(),
});

module.exports = {
  createCategorySchema,
};
