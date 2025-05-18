import mongoose from "mongoose"
import User from "./User"

const MessageModel= mongoose.schema(
    {chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
  timestamp: { type: Date, default: Date.now },}
)

const Message=new mongoose.model('Message',MessageModel)

export default Message