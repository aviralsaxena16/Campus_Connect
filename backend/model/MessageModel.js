import mongoose from "mongoose"
import User from "./User.js"
import Chat from "./chatModel.js"

const MessageModel= mongoose.Schema(
    {chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['text', 'image'], default: 'text' },
  fileUrl: String,
  content: String,
  timestamp: { type: Date, default: Date.now },}
)

const Message=new mongoose.model('Message',MessageModel)

export default Message