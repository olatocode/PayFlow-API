/** @format */

const Transaction = require('../models/transaction');

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate('sender', 'email')
      .populate('receiver', 'email')
      .sort({ timestamp: -1 });

    res.status(200).json({ transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { getTransactions };
