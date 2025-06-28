import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from '@clerk/clerk-react';
import axios from "axios"; // <-- Add this import

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { getToken } = useAuth();

  const [selectedChat, setSelectedChat] = useState(null);
  const [isChannel, setIsChannel] = useState(true);

  useEffect(() => {
    const getChannels = async () => {
      try {
        const token = await getToken();
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/chat/getChannels`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success && response.data.channels.length > 0) {
          setSelectedChat(response.data.channels[0]);
          setIsChannel(true);
        }
      } catch (error) {
        console.error('Error fetching Channels:', error);
      }
    };
    getChannels();
  }, [getToken]);

  return (
    <ChatContext.Provider value={{ selectedChat, setSelectedChat, isChannel, setIsChannel }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);