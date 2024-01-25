const express = require('express');
const z = require('zod');
const jwt = require('jsonwebtoken');
const { User, Account } = require('../db');
const { JWT_SECRET } = require('../config');
const { authMiddleware } = require('../middleware');
const router = express.Router();

const userSignUpSchema = z.object({
  username: z.string().email().min(3),
  firstName: z.string().min(3),
  lastName: z.string().min(1),
  password: z.string().min(6),
});

router.post('/signup', async (req, res) => {
  const user = userSignUpSchema.safeParse(req.body);
  const balance = 1 + Math.floor(Math.random() * 100000);
  if (user.success) {
    const userExist = await User.findOne({ username: user?.data?.username });
    if (!userExist) {
      const newUser = await User.create(user.data);
      await Account.create({ userId: newUser._id, balance });
      const token = jwt.sign(
        {
          userId: newUser._id,
          username: newUser.username,
          fullName: newUser.firstName + ' ' + newUser.lastName,
        },
        JWT_SECRET
      );
      res
        .status(200)
        .json({ message: 'User created successfully', token: token });
    } else {
      res.status(411).json({
        message: 'Email already exist',
      });
    }
  } else {
    console.log(user.error);
    res.status(411).json({
      message: 'Incorrect inputs',
    });
  }
});

const userSignInSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});

router.post('/signin', async (req, res) => {
  const user = userSignInSchema.safeParse(req.body);
  if (user.success) {
    const userExist = await User.findOne({ username: user?.data?.username });
    if (userExist && userExist.password == user.data.password) {
      const token = jwt.sign(
        {
          userId: userExist._id,
          username: userExist.username,
          fullName: userExist.firstName + ' ' + userExist.lastName,
        },
        JWT_SECRET
      );
      res.status(200).json({ token: token });
    } else {
      res.status(411).json({ message: 'Invalid credentials' });
    }
  } else {
    console.log(user.error);
    res.status(411).json({ message: 'Error while logging in' });
  }
});

const userUpdateSchema = z.object({
  firstName: z.string().optional(),
  password: z.string().optional(),
  lastName: z.string().optional(),
});

router.put('/', authMiddleware, async (req, res) => {
  const user = userUpdateSchema.safeParse(req.body);
  try {
    if (user.success) {
      await User.updateOne({ _id: req.userId }, req.body);
      res.json({
        message: 'Updated successfully',
      });
    } else {
      res.status(411).json({
        message: 'Error while updating information',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(411).json({
      message: 'Error while updating information',
    });
  }
});

router.get('/bulk', async (req, res) => {
  try {
    const { filter = '' } = req.query;
    const users = await User.find({
      $or: [
        { firstName: { $regex: filter, $options: 'i' } },
        { lastName: { $regex: filter, $options: 'i' } },
        { username: { $regex: filter, $options: 'i' } },
      ],
    });

    res.status(200).json({
      users: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
