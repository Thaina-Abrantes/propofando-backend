const yup = require('yup');
const { pt } = require('yup-locales');
const { setLocale } = require('yup');

setLocale(pt);

const createQuestionSchema = yup.object().shape({
  title: yup.string()
    .max(200)
    .required('Título é obrigatório'),

  description: yup.string()
    .max(1620)
    .required('Descrição da questão é obrigatório'),

  categoryId: yup.string()
    .uuid('Selecione uma categoria válida')
    .required('Categoria é obrigatório'),

  image: yup.string(),

  explanationVideo: yup.string(),

  explanationText: yup.string()
    .max(1620),

  alternatives: yup.array().of(
    yup.object().shape({
      option: yup.string(),
      description: yup.string().required('Adicione uma descrição para a alternativa'),
      correct: yup.boolean(),
    }).required(),
  ).required(),
});

const updateQuestionSchema = yup.object().shape({
  title: yup.string()
    .max(200),

  description: yup.string()
    .max(1620),

  categoryId: yup.string()
    .uuid(),

  image: yup.string().nullable(),

  explanationVideo: yup.string().nullable(),

  explanationText: yup.string().max(1620),

  alternatives: yup.array().of(
    yup.object().shape({
      option: yup.string(),
      description: yup.string(),
      correct: yup.boolean(),
    }),
  ),
});

module.exports = {
  createQuestionSchema,
  updateQuestionSchema,
};
