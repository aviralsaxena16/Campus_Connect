import React,{useState,useEffect,useRef} from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useChat } from '../../context/ChatContext'
import { useSocket } from '../../context/SocketContext'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'

 // or wherever you keep it


const ChatWindow = () => {

  
const socket = useSocket();
const { selectedChat, isChannel } = useChat();
const { isLoaded, user } = useUser();

if (!isLoaded) return <div>Loading...</div>; // or a spinner

const [newMessage,setNewMessage]=useState('')
const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Join selected room (channel or DM)
  useEffect(() => {
  if (selectedChat) {
    // Fetch messages from backend (API)
    axios.get(`/api/messages/${selectedChat._id}?isChannel=${isChannel}`)
      .then(res => {
        setMessages(res.data); // Store in context/state
        socket.emit("joinRoom", selectedChat._id); // Join room
      });
  }
}, [selectedChat]);


  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('messageReceived', handleMessage);

    return () => {
      socket.off('messageReceived', handleMessage);
    };
  }, [socket, setMessages]);

  // Handle sending message
  const handleSendMessage = () => {
    console.log('Message sent')

  // if (!newMessage.trim() || !selectedChat || !user) return;
    const messageData = {
      content: newMessage,
      sender: { _id: user.id, name: user.fullName },
      ...(isChannel ? { channelId: selectedChat._id } : { chatId: selectedChat._id }),
    };
    console.log("📨 New message received:");
    console.log(messageData)
    socket.emit('newMessage', messageData);
  setNewMessage('');
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };


 return (
  <div className="flex flex-col h-full p-4">
    
    {/* Top: Header with channel/user name and profile picture */}
    <div className="flex items-center border-b pb-2 mb-2">
      <img
        src={selectedChat?.profilePic || '/default-avatar.png'} // You may update this
        alt="Avatar"
        className="w-10 h-10 rounded-full mr-3"
      />
      <h2 className="text-lg font-semibold">
        {selectedChat?.name || selectedChat?.chatName || 'Chat'}
      </h2>
    </div>

    {/* Middle: Messages */}
    <div className="flex-1 overflow-y-auto space-y-2">
      {Array.isArray(messages) && messages.map((msg) => (
        <div
          key={msg._id}
          className={`p-2 rounded-lg max-w-xs ${
            msg.sender?._id === user.id
              ? 'bg-blue-500 text-white self-end ml-auto'
              : 'bg-gray-200 text-black self-start mr-auto'
          }`}
        >
          <div className="text-sm">{msg.sender?.name || 'User'}</div>
          <div className="text-md">{msg.content}</div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>

    {/* Bottom: Message input */}
    <div className="mt-4 flex">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        className="flex-1 border rounded px-3 py-2"
        placeholder="Type a message..."
      />
      <button
        onClick={handleSendMessage}
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Send
      </button>
    </div>
  </div>
);

}

export default ChatWindow