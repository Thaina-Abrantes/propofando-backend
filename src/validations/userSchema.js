const yup = require('yup');

const createUserSchema = yup.object().shape({
  firstName: yup
    .string()
    .strict()
    .required(),

  lastName: yup
    .string()
    .strict()
    .required(),
    
  age: yup
    .number()
    .required()
});

module.exports = {
  createUserSchema,
};
