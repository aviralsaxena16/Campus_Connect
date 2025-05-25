import { Children } from "react";
import { createContext,useContext,useState} from "react";

const ChatContext=createContext()

export const ChatProvider=({children})=>{
    const [selectedChat,setSelectedChat]=useState(null)
    const [isChannel,setIsChannel]=useState(null)

    return (
    <ChatContext.Provider value={{ selectedChat, setSelectedChat, isChannel, setIsChannel }}>
      {children}
    </ChatContext.Provider>
    )

}

export const useChat=()=> useContext(ChatContext)
