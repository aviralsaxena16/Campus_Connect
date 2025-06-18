# 🏫 Campus Connect – Real-time Chat Platform for IIT Bhilai

Campus Connect is a real-time chat application designed specifically for students of IIT Bhilai. It facilitates seamless communication through public channels and private messages, supporting media sharing and online presence—perfect for connecting with peers across hostels, clubs, and academics.


<img src="https://github.com/aviralsaxena16/Campus_Connect/blob/main/frontend/public/ss1.png?raw=true" width="500px">
<img src="https://github.com/aviralsaxena16/Campus_Connect/blob/main/frontend/public/ss2.png?raw=true" width="500px">


## 🚀 Features

- 💬 **Channel-Based Communication** – Join topic-specific public channels like Clubs, Hostels, and Coding Help.
- 🔒 **Direct Messaging (DM)** – One-on-one chats with any user of the platform.
- 🖼️ **Image & File Sharing** – Upload and share media using Cloudinary integration.
- 👤 **User Profiles** – View and edit basic profile information within the app.
- 🟢 **Online/Offline Status** – See who’s currently online in real time.
- 🔔 **Real-Time Messaging** – Instant message delivery via WebSockets (Socket.IO).

## 🧑‍💻 Tech Stack

- **Frontend**: React.js, Tailwind CSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Real-Time Engine**: Socket.IO  
- **Authentication**: Clerk  
- **Media Upload**: Cloudinary  
- **Deployment**: Vercel / Render

## 🏗️ Architecture

- MERN stack base with scalable REST APIs
- WebSocket-powered messaging layer for real-time communication
- Secure media storage and access via Cloudinary
- Modular codebase with clean separation of frontend/backend logic

## 🛠️ Setup Instructions

```bash
# Clone the repository
git clone https://github.com/aviralsaxena16/Campus_Connect.git
cd Campus_Connect

# Install dependencies
npm install

# Add environment variables
# Example: .env file
# MONGODB_URI=your_mongodb_connection_string
# CLOUDINARY_CLOUD_NAME=xxx
# CLOUDINARY_API_KEY=xxx
# CLOUDINARY_API_SECRET=xxx
# CLERK_API_KEY=xxx

# Run the app
npm run dev
