/** @format */

const Wallet = require('../models/wallet');
const User = require('../models/user');
const Transaction = require('../models/transaction');

const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    res.status(200).json({ balance: wallet.balance, walletId: wallet._id });
  } catch (err) {
      console.error(err)
    res.status(500).json({ error: err.message });
  }
};

const topUpWallet = async (req, res) => {
  const user = req.user; 
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid top-up amount' });
  }

  try {
    const wallet = await Wallet.findOne({ user: user._id });
    wallet.balance += amount ;
    await wallet.save();

    await Transaction.create({
      sender: user._id,
      receiver: user._id,
      amount,
      type: 'top-up',
      timestamp: new Date(),
    });

    res
      .status(200)
      .json({ message: 'Wallet topped up', balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const transferMoney = async (req, res) => {
  const { receiverEmail, amount } = req.body;

  try {
    const sender = req.user;
    const receiver = await User.findOne({ email: receiverEmail }).populate(
      'wallet'
    );

    if (!receiver)
      return res.status(404).json({ message: 'Receiver not found' });
    if (sender._id.equals(receiver._id))
      return res.status(400).json({ message: 'Cannot send money to self' });

    const senderWallet = await Wallet.findOne({ user: sender._id });
    const receiverWallet = receiver.wallet;

    if (senderWallet.balance < amount)
      return res.status(400).json({ message: 'Insufficient balance' });

    // Update balances
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    await senderWallet.save();
    await receiverWallet.save();

    // Create transactions
    await Transaction.create([
      { sender: sender._id, receiver: receiver._id, amount, type: 'transfer' },
    ]);

    res.status(200).json({ message: 'Transfer successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getWallet, transferMoney, topUpWallet };