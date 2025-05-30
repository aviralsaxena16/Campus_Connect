// routes/userRoutes.js
import express from 'express';
import User from '../model/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const userData = req.body;
    if (!userData?.id || !userData?.email) {
      return res.status(400).json({ message: 'Missing id or email' });
    }

    const existingUser = await User.findOne({ id: userData.id });
    if (existingUser) {
      return res.status(200).json({ message: 'User exists', user: existingUser });
    }

    const newUser = await User.create(userData);
    return res.status(201).json({ message: 'User registered', user: newUser });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/getUser', async (req, res) => {
  if (!req.auth?.userId) return res.status(401).json({ message: 'Unauthorized' });
  const user = await User.findOne({ id: req.auth.userId });
  if (!user) return res.status(404).json({ success: false });
  res.json({ success: true, person: user });
});

router.put('/updateUser', async (req, res) => {
  if (!req.auth?.userId) return res.status(401).json({ message: 'Unauthorized' });

  const updatedUser = await User.findOneAndUpdate(
    { id: req.auth.userId },
    req.body,
    { new: true }
  );
  if (!updatedUser) return res.status(404).json({ message: 'User not found' });
  res.json({ success: true, user: updatedUser });
});

export default router;
