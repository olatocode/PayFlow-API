/** @format */

// middleware/loginLimiter.js
import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Limit each IP to 3 login requests per windowMs
  message: {
    message: 'Too many login attempts. Please try again in 5 minutes.',
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});
