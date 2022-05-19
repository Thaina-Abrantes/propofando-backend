const yup = require('yup');
const { pt } = require('yup-locales');
const { setLocale } = require('yup');

setLocale(pt);

const createSimulatedSchema = yup.object().shape({
  name: yup.string().required('É necessário fornecer um nome para o simulado.'),

  userId: yup.string()
    .uuid('Formato não corresponde a um uuid')
    .required('É necessário fornecer o identificador do usuário.'),

  quantityQuestions: yup.number()
    .positive('Informe um número maior que zero')
    .required('Quantidade de questões é obrigatório'),

  categories: yup.array(),
});

const simulatedIdSchema = yup.object().shape({
  simulatedId: yup.string()
    .uuid('Formato não corresponde a um uuid')
    .required('É necessário fornecer o identificador do simulado.'),
});

const answerSimulatedSchema = yup.object().shape({
  id: yup.string()
    .uuid('Formato não corresponde a um uuid'),

  alternativeId: yup.string()
    .uuid('Formato não corresponde a um uuid'),
});

module.exports = {
  createSimulatedSchema,
  simulatedIdSchema,
  answerSimulatedSchema,
};
