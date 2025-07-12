/** @format */

import Joi from 'joi';
const amount = Joi.object({

  phone_no: Joi.string().messages({
  }),

  amount: Joi.number().strict().required().messages({
    'any.required': 'Amount is required',
    'number.base': 'Amount must be a number',
  }),
});

export default amount;
