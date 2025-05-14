import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './model/User.js';
import http from 'http'
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

app.use(express.json()); // Parse JSON bodies
app.use(cors({
  origin: 'http://localhost:5173', // Frontend origin
  methods: ['GET', 'POST', 'PUT'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // your frontend
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const users={}

io.on('connection',(socket)=>{
    
    socket.on("register", (userId) => {
      users[userId] = socket.id;
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });


    socket.on("disconnect", () => {
      for (let [id, sock] of Object.entries(users)) {
        if (sock === socket.id) {
          delete users[id];
          break;
        }
      }
      console.log("User disconnected");
    });
})

//  Connect to MongoDB
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
    console.log('Incoming request:', req.body);

    const userData = req.body;

    if (!userData?.id || !userData?.email) {
      return res.status(400).json({ message: 'Invalid user data: Missing id or email' });
    }

    // Check if user already exists by ID
    const existingUser = await User.findOne({ id: userData.id });

    if (existingUser) {
      console.log('User already registered. Skipping registration.');
      return res.status(200).json({ message: 'User already registered', user: existingUser });
    }

    // Register the new user
    const newUser = await User.create(userData);
    console.log('New user registered:', newUser);

    return res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    console.error('Error in /register:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// ✅ Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
