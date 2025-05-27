import React,{useState,useEffect,useRef} from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useChat } from '../../context/ChatContext'
import { useSocket } from '../../context/SocketContext'
import { useUser } from '@clerk/clerk-react'

const chatWindow = () => {

  
const socket = useSocket();
const { selectedChat, isChannel } = useChat();
const { user } = useUser();

  return (
    <div>Hello guys</div>
  )
}

export default chatWindow