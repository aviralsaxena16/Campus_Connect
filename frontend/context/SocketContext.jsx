import {useContext,createContext,useRef,useEffect} from 'react'
import { io } from 'socket.io-client'

const SocketContext=createContext(null)

export const SocketProvider = () => {
    const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3000');
    return () => socketRef.current.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket=()=> useContext(SocketContext)