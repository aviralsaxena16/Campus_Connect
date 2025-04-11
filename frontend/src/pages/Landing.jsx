import React,{useState} from 'react'
import bg from '../assets/bg.png';
import Login from '../components/Login';
import { SignedIn,SignedOut } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const Landing = () => {
  const {isSignedIn}=useAuth()
  const navigate=useNavigate()

  
  if (!isSignedIn){
   return(
    <div
    className="h-screen w-full bg-cover bg-center justify-center items-center flex "
    style={{ backgroundImage: `url(${bg})` }}>
      <SignedOut>
      <Login/>
      </SignedOut>
  </div>)}
  else{
    navigate('/home')
}
}

export default Landing