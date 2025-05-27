/** @format */
const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  refreshAccessToken,
} = require('../controllers/authController');
const validate = require('../middlewares/validate');
const user = require('../validation/userSchema');

router.post('/auth/register', validate(user), register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.post('/auth/refresh', refreshAccessToken);

module.exports = router;
