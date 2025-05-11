import React from 'react'
import { Navigate, useActionData } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Protected = ({children}) => {
  const {isSignedIn}=useAuth()
  if (!isSignedIn){
    return <Navigate to='/' replace />
  }
  return children
}

export default Protected