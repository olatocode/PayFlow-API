/** @format */

import Joi from 'joi';

const user = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
    'string.base': 'Name must be a string',
  }),

  phone_no: Joi.string().required().messages({
    'any.required': 'Phone number is required',
    'string.base': 'Phone number must be a string',
  }),

  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Email must be a valid email address',
  }),

  password: Joi.string().min(6).required().messages({
    'any.required': 'Password is required',
    'string.base': 'Password must be a string',
    'string.min': 'Password must be at least 6 characters long',
  }),
});

export default user;
