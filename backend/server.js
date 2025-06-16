import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { clerkMiddleware } from '@clerk/express';
import fileUpload from 'express-fileupload';
import http from 'http';
import { Server } from 'socket.io';

// Models
import User from './model/User.js';
import Message from './model/MessageModel.js';
// Routes
import userRoutes from './routes/user.routes.js'
import messageRoutes from './routes/message.routes.js'
import chatRoutes from './routes/chat.routes.js'
import uploadRoutes from './routes/upload.routes.js'

import cloudinary from './config/cloudinary.js';

const app = express();
const server = http.createServer(app);
export default app
// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  // console.log(`🔌 Client connected: ${socket.id}`);
  const id = socket.handshake.query.userId
  // console.log('our id',id)
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`✅ ${socket.id} joined room: ${roomId}`);
  });

  if (id) {
    // console.log('execute')
   User.findOneAndUpdate({ id }, { isOnline: true }).exec();
  }
  socket.on('newMessage', async (messageData) => {
    try {
      const { sender, content, chatId, channelId } = messageData;
      const mongoUser = await User.findOne({ id: sender._id });
      if (!mongoUser) throw new Error('User not found');

      const message = await Message.create({
        sender: mongoUser._id,
        content,
        chat: chatId || channelId,
      });

      io.to(chatId || channelId).emit('messageReceived', message);
    } catch (err) {
      console.error("❌ Error in newMessage:", err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
    if (id) {
      User.findOneAndUpdate({ id }, { isOnline: false }).exec();
    }
  });
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

// Clerk middleware
if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
  throw new Error('Clerk keys missing');
}
app.use(clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
}));

// Routes
app.use('/message', messageRoutes);
app.use('/upload', uploadRoutes);
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);

// DB Connect
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://aviralsaxena2006:WVYis3UqHDMsZVLC@cluster0.elh7l9d.mongodb.net/campus_connect?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ DB error:', err));

// Start server
server.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
