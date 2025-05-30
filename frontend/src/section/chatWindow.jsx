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
const [messages, setMessages] = useState(['']);
  const messagesEndRef = useRef(null);

  // Join selected room (channel or DM)
  useEffect(() => {
  if (selectedChat) {
    console.log(selectedChat._id)
    console.log(isChannel)
    // Fetch messages from backend (API)
    axios.get(`http://localhost:3000/message/messages/${selectedChat._id}?isChannel=${isChannel}`)
      .then(res => {
        setMessages(res.data); 
        console.log(messages)
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
      setMessages((prev) => {
  console.log("Previous messages:", prev);
  return [...(Array.isArray(prev) ? prev : []), msg];
});
    };

    socket.on('messageReceived', handleMessage);

    return () => {
      socket.off('messageReceived', handleMessage);
    };
  }, [socket, setMessages]);

  // Handle sending message
  const handleSendMessage = () => {
    // console.log('Message sent')

  // if (!newMessage.trim() || !selectedChat || !user) return;
    const messageData = {
      content: newMessage,
      sender: { _id: user.id || user._id , name: user.fullName },
      ...(isChannel ? { channelId: selectedChat._id } : { chatId: selectedChat._id }),
    };
    // console.log("📨 New message received:");
    console.log(messageData)
    socket.emit('newMessage', messageData);
  setNewMessage('');
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

return (
    <div className="flex flex-col h-full p-6 bg-white border-4 border-black rounded-xl shadow-[8px_8px_0_0_#000]">
      {/* Header */}
      <div className="flex items-center mb-4 border-b-4 border-black pb-3">
        <img
          src={selectedChat?.profilePic || '/default-avatar.png'}
          alt="Avatar"
          className="w-12 h-12 rounded-full border-4 border-black shadow-[4px_4px_0_0_#000] mr-4"
        />
        <h2 className="text-2xl font-extrabold tracking-tight text-black uppercase">
          {selectedChat?.name || selectedChat?.chatName || 'Chat'}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 px-2">
        {Array.isArray(messages) && messages.map((msg, idx) => {
          const isMe = msg.sender?._id === user.id;
          return (
            <div
              key={msg._id}
              className={`flex items-end ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <img
                  src={ msg.sender && msg.sender.imageUrl
        ? msg.sender.imageUrl
        : 'https://static.vecteezy.com/system/resources/previews/030/504/836/non_2x/avatar-account-flat-isolated-on-transparent-background-for-graphic-and-web-design-default-social-media-profile-photo-symbol-profile-and-people-silhouette-user-icon-vector.jpg'}
                  alt="Sender"
                  className="w-8 h-8 rounded-full border-2 border-black shadow-[2px_2px_0_0_#000] mr-2"
                />
              )}
              <div
                className={`
                  max-w-xs px-4 py-3
                  ${isMe
                    ? 'bg-[#00FF66] text-black border-4 border-black shadow-[4px_4px_0_0_#000] rounded-br-3xl rounded-tl-3xl rounded-bl-lg'
                    : 'bg-[#FFD600] text-black border-4 border-black shadow-[4px_4px_0_0_#000] rounded-bl-3xl rounded-tr-3xl rounded-br-lg'
                  }
                  font-bold
                  relative
                `}
              >
                <div className="text-xs mb-1 tracking-wide font-mono">{msg.sender && msg.sender.firstName ? msg.sender.firstName : 'User'}</div>
                <div className="text-base">{msg.content}</div>
                <div className="text-[10px] font-mono mt-1 text-right opacity-60">{/* timestamp here if needed */}</div>
              </div>
              {isMe && (
                <img
                  src={user.imageUrl || '/default-avatar.png'}
                  alt="Me"
                  className="w-8 h-8 rounded-full border-2 border-black shadow-[2px_2px_0_0_#000] ml-2"
                />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex items-center border-t-4 border-black pt-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 px-4 py-2 border-4 border-black rounded-lg shadow-[4px_4px_0_0_#000] font-bold text-black bg-[#F8F8F8] focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="ml-3 px-6 py-2 bg-[#00FF66] border-4 border-black rounded-lg shadow-[4px_4px_0_0_#000] text-black font-extrabold text-lg hover:bg-black hover:text-[#00FF66] transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow