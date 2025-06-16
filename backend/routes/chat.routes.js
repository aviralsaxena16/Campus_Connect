// routes/chatRoutes.js
import express from 'express';
import Chat from '../model/chatModel.js';
import User from '../model/User.js';

const router = express.Router();

router.post('/getChannels', async (req, res) => {
  const channels = await Chat.find({ isChannel: true });
  res.json({ success: true, channels });
});


// Get or create all DM chats for current user
router.post('/getChats', async (req, res) => {
  
  try {
    const me = await User.findOne({ id: req.auth.userId });
    if (!me) return res.status(404).json({ success: false, message: "User not found" });

    const allOtherUsers = await User.find({ _id: { $ne: me._id } });

    // Create/fetch DM chats with all other users
    const dmChats = await Promise.all(
      allOtherUsers.map(async (otherUser) => {
        let existingChat = await Chat.findOne({
          isChannel: false,
          users: { $all: [me._id, otherUser._id], $size: 2 },
        });

        if (!existingChat) {
          existingChat = await Chat.create({
            chatName: `${otherUser.firstName} ${otherUser.lastName}`,
            isChannel: false,
            isOnline: otherUser.isOnline,
            profilePic:otherUser.imageUrl,
            users: [me._id, otherUser._id],
          });
        }
        await existingChat.populate('users', 'firstName lastName imageUrl isOnline id');
        return existingChat;
      })
    );

    // Populate and return
    const formattedChats = dmChats.map(chat => {
    // get the other person from the users array
    const otherUser = chat.users.find(u => u.id !== req.auth.userId);

    return {
      _id: chat._id,
      name: `${otherUser.firstName} ${otherUser.lastName}`,
      profilePic: otherUser.imageUrl,
      isOnline: otherUser.isOnline ?? false
    
    };
  });

    res.json({ success: true, chats: formattedChats });

  } catch (error) {
    console.error("DM chat fetch error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
