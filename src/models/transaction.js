/** @format */

import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: ['amount is require', true] },
  type: { type: String, enum: ['transfer', 'top-up'] },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Transaction', transactionSchema);
