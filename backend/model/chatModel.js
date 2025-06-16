import mongoose from "mongoose";
import User from "./User.js";
const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    name: String,
    isChannel: { type: Boolean, default: false }, // ✅ Add this
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isOnline: { type: Boolean, default: false },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    profilePic: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fin.pinterest.com%2Fpin%2F983051424935305872%2F&psig=AOvVaw0Kr5qygAWlNpcJwCG1Nusb&ust=1747674596414000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNCbl6_BrY0DFQAAAAAdAAAAABAE",
    },
  },
  { timestamps: true }
);


const Chat = mongoose.model("Chat", chatModel);

export default Chat