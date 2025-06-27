import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { clerkMiddleware } from '@clerk/express';
import http from 'http';
import { Server } from 'socket.io';

// Models
import User from './model/User.js';
import Message from './model/MessageModel.js';
// Routes
import userRoutes from './routes/user.routes.js';
import messageRoutes from './routes/message.routes.js';
import chatRoutes from './routes/chat.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import uploaderRoutes from './routes/uploader.routes.js';

const app = express();
const server = http.createServer(app);
export default app;

// ✅ Allowed origins (from .env)
const allowedOrigins = [
  process.env.FRONTEND_DEV_URL,
  process.env.FRONTEND_URL,
];

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  },
});

io.on('connection', (socket) => {
  const id = socket.handshake.query.userId;

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`✅ ${socket.id} joined room: ${roomId}`);
  });

  if (id) {
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

// ✅ Express middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(express.json());

// ✅ Clerk middleware
if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
  throw new Error('Clerk keys missing');
}
app.use(clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
}));

// ✅ Routes
app.use('/message', messageRoutes);
app.use('/upload', uploadRoutes);
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/uploader', uploaderRoutes);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ DB error:', err));

// ✅ Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
