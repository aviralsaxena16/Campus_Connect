import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Message from '../model/MessageModel.js';
import cloudinary from '../config/cloudinary.js';
import User from '../model/User.js';

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'CampusConnectChats',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    public_id: (req, file) => `chat-${Date.now()}`,
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { sender, chatId } = req.body;
    const mongoUser = await User.findOne({ id: sender});
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    if (!sender || !chatId) {
      return res.status(400).json({ error: "Missing sender or chatId" });
    }

    // Process file
    const fileUrl = req.file.path;

    // Save message
    const message = await Message.create({
      sender:mongoUser._id,
      type: 'image',
      fileUrl,
      content: fileUrl,
      chat: chatId,
    });

    res.json({ success: true, message });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
