// routes/uploadRoutes.js
import express from 'express';
import User from '../model/User.js';
import cloudinary from '../config/cloudinary.js';
const router = express.Router();

router.post('/uploadImage', async (req, res) => {
  if (!req.auth?.userId) return res.status(401).json({ message: 'Unauthorized' });

  const file = req.files.image;
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: 'profile_pics',
  });

  const updatedUser = await User.findOneAndUpdate(
    { id: req.auth.userId },
    { imageUrl: result.secure_url },
    { new: true }
  );

  if (!updatedUser) return res.status(404).json({ message: 'User not found' });
  res.json({ success: true, user: updatedUser, imageUrl: result.secure_url });
});

export default router;
