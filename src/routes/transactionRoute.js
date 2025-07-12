/** @format */

import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';
import { getTransactions } from '../controllers/transactionController.js';

router.get('/history', auth, getTransactions);

export default router;
