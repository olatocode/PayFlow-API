/** @format */

const Joi = require('joi');
const amount = Joi.object({
  receiverEmail: Joi.string().required(false).messages({
  }),

  amount: Joi.number().strict().required().messages({
    'any.required': 'Amount is required',
    'number.base': 'Amount must be a number',
  }),
});

module.exports = amount;
