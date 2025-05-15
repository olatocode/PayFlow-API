/** @format */
const express = require('express');
const router = express.Router();


const {
  registerUser,
  login,
  logout,
  refreshAccessToken,
} = require('../controllers/authController');

router.post('/auth/register', registerUser);
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.post('/auth/refresh', refreshAccessToken);

module.exports = router;
