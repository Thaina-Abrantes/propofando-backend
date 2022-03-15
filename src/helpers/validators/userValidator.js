const Joi = require('joi');
const { messages } = require('joi-translation-pt-br');
const { joiErrorToJavaScriptError } = require('./helper');

function validateUser({ fullName, email }) {
    const schema = Joi.object().keys({
        fullName: Joi.string()
            .required(),

        email: Joi.string()
            .required(),
    });
    const validation = schema.validate({ fullName, email }, { messages })
    if (validation.error) throw joiErrorToJavaScriptError(validation.error)
}

module.exports = { validateUser }