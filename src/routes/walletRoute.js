/** @format */

const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const amount = require("../validation/transactionSchema")
const {
  getWallet,
  transferMoney,
  topUpWallet,
} = require('../controllers/walletController');

router.get('/balance', auth ,getWallet);
router.post('/topup', validate(amount), auth, topUpWallet);
router.post('/transfer', auth, validate(amount), transferMoney);

module.exports = router;
