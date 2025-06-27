import { useContext, createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useUser } from "@clerk/clerk-react";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useUser(); // ✅ Moved inside the component
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;

    const newSocket = io(import.meta.env.VITE_API_BASE_URL, {
      query: {
        userId: user.id, // ✅ Clerk user ID
      },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
