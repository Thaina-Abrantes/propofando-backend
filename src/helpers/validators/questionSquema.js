const yup = require('yup');
const { pt } = require('yup-locales');
const { setLocale } = require('yup');
setLocale(pt);

const createQuestionSchema = yup.object().shape({
  title: yup.string()
    .max(200)
    .required(),

  description: yup.string()
    .max(1620)
    .required(),

  categoryId: yup.string()
    .uuid()
    .required(),

  image: yup.string(),

  explanationVideo: yup.string(),
  
  explanationText: yup.string()
    .max(1620),

  alternatives: yup.array().of(
    yup.object().shape({
      description : yup.string().required(), 
      correct: yup.boolean()
    }).required()
  ).required(),
});

const updateQuestionSchema = yup.object().shape({
  title: yup.string()
    .max(200),

  description: yup.string()
    .max(1620),
  
  categoryId: yup.string()
    .uuid()
    .required(),

  image: yup.string(),

  explanationVideo: yup.string(),
  
  explanationText: yup.string().max(1620),

  alternatives: yup.array().of(
    yup.object().shape({
      description : yup.string(), 
      correct: yup.boolean()
    })
  ),
});

module.exports = {
  createQuestionSchema,
  updateQuestionSchema,
}

