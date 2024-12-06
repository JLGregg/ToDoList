const Joi = require('joi');

// Used for server side validation
module.exports.todoSchema = Joi.object({
  todo: Joi.object({
    title: Joi.string().required(),
    isCompleted: Joi.boolean().required()
  }).required()
});