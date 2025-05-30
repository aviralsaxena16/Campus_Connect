// routes/chatRoutes.js
import express from 'express';
import Chat from '../model/chatModel.js';

const router = express.Router();

router.post('/getChannels', async (req, res) => {
  const channels = await Chat.find({ isChannel: true });
  res.json({ success: true, channels });
});

router.post('/getChats', async (req, res) => {
  const chats = await Chat.find({ isChannel: false });
  res.json({ success: true, chats });
});

export default router;
