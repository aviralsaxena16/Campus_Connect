import express from 'express';
import User from '../model/User.js';
import cloudinary from '../config/cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const router = express.Router();

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profile_pics',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => `user-${req.auth.userId}-${Date.now()}`, // Unique filename
  },
});

const upload = multer({ storage });

// Fixed route with middleware
router.post('/uploadImage', upload.single('image'), async (req, res) => { // <-- Add middleware here
  if (!req.auth?.userId) return res.status(401).json({ message: 'Unauthorized' });

  // File is now available in req.file (from multer)
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  // Update user with Cloudinary URL
  const updatedUser = await User.findOneAndUpdate(
    { id: req.auth.userId },
    { imageUrl: req.file.path }, // Cloudinary URL is in req.file.path
    { new: true }
  );

  if (!updatedUser) return res.status(404).json({ message: 'User not found' });
  res.json({ success: true, user: updatedUser, imageUrl: req.file.path });
});

export default router;
