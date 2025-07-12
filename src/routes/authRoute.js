/** @format */
import express from 'express';
const router = express.Router();

import {
  register,
  login,
  logout,
  refreshAccessToken,
} from '../controllers/authController.js';
import validate from '../middlewares/validate.js';
import user from '../validation/userSchema.js';
import { loginLimiter } from '../middlewares/rateLimiter.js';

router.post('/auth/register', validate(user), register);
router.post('/auth/login', loginLimiter, login);
router.post('/auth/logout', logout);
router.post('/auth/refresh', refreshAccessToken);

export default router;
