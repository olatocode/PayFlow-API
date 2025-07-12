/** @format */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: ['name is required', true] },
  phone_no: { type: String, required: ['phone_no is required', true] },
  email: {
    type: String,
    unique: true,
    required: ['email is require', true],
  },
  password: { type: String, required: ['password is require', true] },
  isDeleted: { type: Boolean, default: false },
  deletedAt: {
    type: Date,
    default: null,
  },
  refreshToken: String,
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
});

// Password hashing
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export default mongoose.model('User', userSchema);
