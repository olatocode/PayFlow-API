/** @format */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: ['name is required', true] },
  email: {
    type: String,
    unique: true,
    required: ['email is require', true],
  },
  password: { type: String, required: ['password is require', true] },
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

module.exports = mongoose.model('User', userSchema);
