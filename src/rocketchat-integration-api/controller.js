const Joi = require('joi');

const requestSchema = require("./model");


const openTaskNotification = (req, res, next) => {
    const data = req.body;
    console.log(data);

    const validationResult = requestSchema. validate(data);
    console.log(validationResult)
    if (validationResult.error) {
        res.status(422).json({
            status: 'error',
            message: 'Invalid request data',
            data: validationResult.value
        });
    } else {

        res.status(501).json({
            message: 'Not implemented yet'
        });
    }
};

module.exports = {
    openTaskNotification
}