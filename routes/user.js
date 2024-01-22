const express = require('express');
const z = require('zod');
const jwt = require('jsonwebtoken');
const { User } = require('../db');
const { JWT_SECRET } = require('../config');
const router = express.Router();

const userSignUpSchema = z.object({
  username: z.string().email().min(3),
  firstName: z.string().min(3),
  lastName: z.string().min(1),
  password: z.string().min(6),
});

router.post('/signup', async (req, res) => {
  const user = userSignUpSchema.safeParse(req.body);
  if (user.success) {
    const userExist = await User.findOne({ username: user?.data?.username });
    if (!userExist) {
      const newUser = await User.create(user.data);
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
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
      console.log(userExist);
      const token = jwt.sign({ userId: userExist._id }, JWT_SECRET);
      res.status(200).json({ token: token });
    } else {
      console.log(userExist);
      res.status(411).json({ message: 'Error while logging in' });
    }
  } else {
    console.log(user.error);
    res.status(411).json({ message: 'Error while logging in' });
  }
});

module.exports = router;
