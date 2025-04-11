import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Routers from './routes/Routers'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ClerkProvider } from '@clerk/clerk-react'
import {neobrutalism } from '@clerk/themes'
import { AuthProvider } from './context/AuthContext'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}



const App = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <AuthProvider>

    <BrowserRouter>

    <Routers/>
    </BrowserRouter>
    </AuthProvider>
    </ClerkProvider>
    
  )
}

export default App