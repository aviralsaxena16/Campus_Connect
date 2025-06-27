import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useChat } from '../../context/ChatContext'
import { useSocket } from '../../context/SocketContext'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'

const ChatWindow = () => {
  const socket = useSocket();
  const { selectedChat, isChannel } = useChat();
  const { isLoaded, user } = useUser();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  if (!isLoaded) return <div>Loading...</div>;

  useEffect(() => {
    if (selectedChat) {
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/message/messages/${selectedChat._id}?isChannel=${isChannel}`)
        .then(res => {
          setMessages(res.data);
          socket.emit("joinRoom", selectedChat._id);
        });
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (msg) => {
      setMessages((prev) => [...(Array.isArray(prev) ? prev : []), msg]);
    };
    socket.on('messageReceived', handleMessage);
    return () => {
      socket.off('messageReceived', handleMessage);
    };
  }, [socket, setMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      content: newMessage,
      sender: { _id: user.id || user._id, name: user.fullName },
      ...(isChannel ? { channelId: selectedChat._id } : { chatId: selectedChat._id }),
    };

    socket.emit('newMessage', messageData);
    setNewMessage('');
  };

 const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("sender", user.id || user._id);
  formData.append("chatId", selectedChat._id);

  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/uploader/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      
      setMessages((prev) => [...prev, data.message]);
      socket.emit("newMessage", data.message);
    } else {
      alert("Image upload failed: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    alert("Upload failed");
    console.error("Upload failed", err);
  }
  // Reset file input (optional, to allow re-upload of the same file)
  e.target.value = "";
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <div className="flex flex-col h-[600px] p-6 bg-white border-4 border-black rounded-xl shadow-[8px_8px_0_0_#000]">
      {/* Header */}
      <div className="flex items-center mb-4 border-b-4 border-black pb-3">
        <img
          src={selectedChat?.profilePic || '/default-avatar.png'}
          alt="Avatar"
          className="w-12 h-12 rounded-full border-4 border-black shadow-[4px_4px_0_0_#000] mr-4"
        />
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-black uppercase">
            {selectedChat?.name || selectedChat?.chatName || 'Chat'}
          </h2>
          {!isChannel && selectedChat?.isOnline && (
            <div className="flex items-center mt-1">
              <span className="inline-block w-3 h-3 bg-[#00FF66] border-2 border-black rounded-full mr-2"></span>
              <span className="text-xs font-bold text-[#00FF66] drop-shadow-[1px_1px_0_#000]">Online</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 px-2 custom-scrollbar">
        {Array.isArray(messages) && messages.map((msg, idx) => {
          const isMe = msg.sender?._id === user.id;
          return (
            <div key={msg._id || idx} className={`flex items-end ${isMe ? 'justify-end' : 'justify-start'}`}>
              {!isMe && (
                <img
                  src={msg.sender?.imageUrl || 'https://static.vecteezy.com/system/resources/previews/030/504/836/non_2x/avatar-account-flat-isolated-on-transparent-background-for-graphic-and-web-design-default-social-media-profile-photo-symbol-profile-and-people-silhouette-user-icon-vector.jpg'}
                  alt="Sender"
                  className="w-8 h-8 rounded-full border-2 border-black shadow-[2px_2px_0_0_#000] mr-2"
                />
              )}
              <div className={`
                max-w-xs px-4 py-2
                ${isMe
                  ? 'bg-[#00FF66] text-black border-4 border-black shadow-[4px_4px_0_0_#000] rounded-br-3xl rounded-tl-3xl rounded-bl-lg'
                  : 'bg-[#FFD600] text-black border-4 border-black shadow-[4px_4px_0_0_#000] rounded-bl-3xl rounded-tr-3xl rounded-br-lg'}
                font-bold relative
              `}>
                <div className="text-xs mb-1 tracking-wide font-mono">{msg.sender?.firstName || 'User'}</div>
                <div className="text-base">
                  {
                    msg.content?.startsWith('http') && msg.content.includes('cloudinary.com')
                      ? <img src={msg.fileUrl} alt="uploaded" className="max-w-[200px] max-h-[200px] border-2 border-black mt-1" />
                      : msg.content
                  }
                </div>
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

      {/* Input & Image Upload */}
      <div className="mt-4 flex items-center border-t-4 border-black pt-3 gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtJo_E_vZ6gha9sFxpUzFkqG1FYoQvsy1ArQ&s" // Replace with an actual image icon if you like
            alt="Upload"
            className="w-10 h-10 border-4 border-black rounded-lg shadow-[4px_4px_0_0_#000] p-1"
          />
        </label>

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
          className="px-6 py-2 bg-[#00FF66] border-4 border-black rounded-lg shadow-[4px_4px_0_0_#000] text-black font-extrabold text-lg hover:bg-black hover:text-[#00FF66] transition"
        >
          Send
        </button>
      </div>

      {/* Custom Scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
          background: #fff;
          border-left: 2px solid #000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00FF66;
          border: 2px solid #000;
          border-radius: 0;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #fff;
        }
      `}</style>
    </div>
  );
}

export default ChatWindow;
