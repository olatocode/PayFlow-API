/** @format */

const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getWallet,
  transferMoney,
  topUpWallet,
} = require('../controllers/walletController');

router.get('/balance', auth, getWallet);
router.post('/topup', auth, topUpWallet);
router.post('/transfer', auth, transferMoney);

module.exports = router;
