// routes/messageRoutes.js
import express from 'express';
import Message from '../model/MessageModel.js';
const router = express.Router();

router.get('/messages/:chatId', async (req, res) => {
  const { chatId } = req.params;
  const messages = await Message.find({ chat: chatId})
    .populate('sender')
    .sort({ createdAt: 1 });
  res.json(messages);
});

export default router;
