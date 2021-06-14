const Joi = require('joi');


const loginRequestSchema = Joi.object({
    username: Joi.string()
        .required(),
    password: Joi.string()
        .required()
})

const sendMessageRequestSchema = Joi.object({
    recipient: Joi.string()
        .required(),
    message: Joi.string()
        .required()
})

module.exports = {
    loginRequestSchema,
    sendMessageRequestSchema
}