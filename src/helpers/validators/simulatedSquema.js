const yup = require('yup');
const { pt } = require('yup-locales');
const { setLocale } = require('yup');

setLocale(pt);

const createSimulatedSchema = yup.object().shape({
  userId: yup.string()
    .uuid('Formato não corresponde a um uuid')
    .required('É necessário fornecer o identificador do usuário.'),

  quantityQuestions: yup.number()
    .positive('Informe um número maior que zero')
    .required('Quantidade de questões é obrigatório'),

  categories: yup.array().of(
    yup.object().shape({
      id: yup.string().uuid('Selecione uma categoria válida'),
    }).required(),
  ),
});

module.exports = {
  createSimulatedSchema,
};
