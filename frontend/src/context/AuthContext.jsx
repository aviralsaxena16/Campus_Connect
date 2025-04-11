import React,{createContext,useContext} from 'react'
import { useClerk } from '@clerk/clerk-react'

const AuthContext=createContext(null)
export const AuthProvider=({children})=>{
    const {isSignedIn}=useClerk()

    return(
        <AuthContext.Provider value={{isSignedIn}}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth=()=> useContext(AuthContext)