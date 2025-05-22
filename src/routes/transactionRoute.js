/** @format */

const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getTransactions } = require('../controllers/transactionController');

router.get('/', auth, getTransactions);

module.exports = router;
