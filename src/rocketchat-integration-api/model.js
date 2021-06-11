const Joi = require('joi');


const requestSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .required(),
    password: Joi.string()
        .alphanum()
        .required(),
    recipient: Joi.string()
        .alphanum()
        .required(),
    message: Joi.string()
        .required(),
    taskId: Joi.string()
        .regex(/^[a-z]{4}\d{4}$/)
        .required()
});


module.exports = requestSchema