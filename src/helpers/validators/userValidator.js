const Joi = require('joi');
const { messages } = require('joi-translation-pt-br');
const { joiErrorToJavaScriptError } = require('./helper')

function validateUser({ firstName, lastName, age }) {
    const schema = Joi.object().keys({
        firstName: Joi.string()
            .required(),

        lastName: Joi.string()
            .required(),

        age: Joi.number()
            .integer()
            .min(18)
            .required(),
    });
    const validation = schema.validate({ firstName, lastName, age }, { messages })
    if (validation.error) throw joiErrorToJavaScriptError(validation.error)
}

module.exports = { validateUser }