const Joi = require('joi');

module.exports.enquirySchema = Joi.object({
    enquiry: Joi.object({
        name: Joi.string().required(),
        email: Joi.number().required(),
        number: Joi.string().required(),
        enquiry: Joi.string().required(),
    }).required()
});