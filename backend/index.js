import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './model/User.js';

const app = express();

// ✅ Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors({
  origin: 'http://localhost:5173', // Frontend origin
  methods: ['GET', 'POST', 'PUT'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Connect to MongoDB
mongoose.connect('mongodb+srv://aviralsaxena2006:WVYis3UqHDMsZVLC@cluster0.elh7l9d.mongodb.net/campus_connect?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// ✅ Root endpoint
app.get('/', (req, res) => {
  res.send('API is working 🚀');
});

// ✅ Register endpoint
app.post('/register', async (req, res) => {
  try {
    console.log('Incoming request:', req.body); // Log incoming body

    const userData = req.body;

    // Basic validation
    if (!userData?.id || !userData?.email) {
      return res.status(400).json({ message: 'Invalid user data: Missing id or email' });
    }

    // Check for existing user by ID
    const existingUserById = await User.findOne({ id: userData.id });
    if (existingUserById) {
      return res.status(400).json({ message: 'User already registered with this ID' });
    }

    // Check for existing user by email
    const existingUserByEmail = await User.findOne({ email: userData.email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'User already registered with this email' });
    }

    // Save user
    const newUser = await User.create(userData);
    console.log('New user registered:', newUser);

    return res.status(201).json({ message: 'Success', user: newUser });
  } catch (err) {
    console.error('Error in /register:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// ✅ Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
