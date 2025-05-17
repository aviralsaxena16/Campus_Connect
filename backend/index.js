import 'dotenv/config'; // Add this at the top to load .env
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './model/User.js';
import http from 'http';
import { Server } from 'socket.io';
import { clerkMiddleware } from '@clerk/express';
import fileUpload from 'express-fileupload';
import cloudinary from './config/cloudinary.js';

const app = express();
const server = http.createServer(app);

// // Verify environment variables
if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
  throw new Error('Clerk keys missing in environment variables');
}

// Middleware setup
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Added Cookie header
}));

// Clerk middleware with explicit keys
app.use(clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
}));

app.use(fileUpload({ useTempFiles: true }));

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// [Keep existing Socket.IO connection handlers]

// MongoDB Connection (no changes needed)
mongoose.connect('mongodb+srv://aviralsaxena2006:WVYis3UqHDMsZVLC@cluster0.elh7l9d.mongodb.net/campus_connect?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => res.send('API is working 🚀'));

app.post('/register', async (req, res) => {
  try {
    const userData = req.body;
    
    if (!userData?.id || !userData?.email) {
      return res.status(400).json({ message: 'Invalid user data: Missing id or email' });
    }

    const existingUser = await User.findOne({ id: userData.id });
    if (existingUser) {
      return res.status(200).json({ message: 'User exists', user: existingUser });
    }

    const newUser = await User.create(userData);
    return res.status(201).json({ message: 'User registered', user: newUser });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/getUser', async (req, res) => {
  try {
    // Clerk auth is available via req.auth
    if (!req.auth?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const person = await User.findOne({ id: req.auth.userId }).select('-password');
    if (!person) return res.status(404).json({ message: 'User not found' });

    res.json({ success: true, person });
  } catch (error) {
    console.error('GetUser error:', error);
    res.status(400).json({ message: 'Request failed' });
  }
});


app.put('/updateUser', async (req, res) => {
  try {
    if (!req.auth?.userId) return res.status(401).json({ message: 'Unauthorized' });
    
    const updatedUser = await User.findOneAndUpdate(
      { id: req.auth.userId },
      req.body,
      { new: true }
    );
    
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Update failed' });
  }
});

// Image upload endpoint
app.post('/uploadImage', async (req, res) => {
  try {
    if (!req.auth?.userId) return res.status(401).json({message:'Unauthorised access'})
    
      
      const file = req.files.image; // file comes from frontend
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'profile_pics',
      });
    const updatedUser =await User.findOneAndUpdate({id: req.auth.userId},{ imageUrl: result.secure_url } , { new: true })
     
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    console.log(updatedUser)
    res.json({ success: true, user:updatedUser });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Update failed' });
  }
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
