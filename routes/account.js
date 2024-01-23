const express = require('express');
const { authMiddleware } = require('../middleware');
const { User, Account } = require('../db');

const router = express.Router();

router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (user) {
      const account = await Account.findOne({ userId: user._id });
      res.status(200).json({ balance: account.balance / 100 });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'something went wrong' });
  }
});

router.post('/transfer', authMiddleware, async (req, res) => {
  try {
    const { to, amount } = req.body;
    const receiverAccount = await Account.findOne({ userId: to });
    if (!receiverAccount) {
      res.status(400).json({
        message: 'Invalid account',
      });
    }
    const senderAccount = await Account.findOne({ userId: req.userId });
    if (senderAccount.balance < amount) {
      res.status(400).json({
        message: 'Insufficient balance',
      });
    }
    senderAccount.balance -= amount;
    receiverAccount.balance += amount;

    await senderAccount.save();
    await receiverAccount.save();

    res.status(200).json({
      message: 'Transfer successful',
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: 'Invalid account',
    });
  }
});

module.exports = router;
