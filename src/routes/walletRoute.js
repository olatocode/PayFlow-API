/** @format */

import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import amount from "../validation/transactionSchema.js"
import {
  getWallet,
  transferMoney,
  topUpWallet,
} from '../controllers/walletController.js';

router.get('/balance', auth ,getWallet);
router.post('/topup', validate(amount), auth, topUpWallet);
router.post('/transfer', auth, validate(amount), transferMoney);

export default router;
