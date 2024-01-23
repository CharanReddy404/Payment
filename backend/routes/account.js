const express = require('express');
const { authMiddleware } = require('../middleware');
const { User, Account } = require('../db');
const { default: mongoose } = require('mongoose');

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
    const session = await mongoose.startSession();

    session.startTransaction();
    const { to, amount } = req.body;
    const toAccount = await Account.findOne({ userId: to }).session(session);
    if (!toAccount) {
      res.status(400).json({
        message: 'Invalid account',
      });
    }
    const fromAccount = await Account.findOne({ userId: req.userId }).session(
      session
    );
    if (fromAccount.balance < amount) {
      res.status(400).json({
        message: 'Insufficient balance',
      });
    }
    fromAccount.balance -= amount;
    toAccount.balance += amount;

    await fromAccount.save().session(session);
    await toAccount.save().session(session);

    await session.commitTransaction();

    res.status(200).json({
      message: 'Transfer successful',
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: 'Something went wrong',
    });
  }
});

module.exports = router;