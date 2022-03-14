const Joi = require('joi');
const { messages } = require('joi-translation-pt-br');
const { joiErrorToJavaScriptError } = require('./helper')

function validateUser({ name, email, password }) {
    const schema = Joi.object().keys({
        name: Joi.string()
        .strict()
        .required(),
    
        email: Joi.string()
            .email()
            .required(),
        
        password: Joi.string()
            .strict()
            .required(),
    });
    const validation = schema.validate({ name, email, password }, { messages });
    if (validation.error) throw joiErrorToJavaScriptError(validation.error)
}

module.exports = { validateUser }