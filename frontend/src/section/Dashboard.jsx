import React from 'react'
import { useUser } from '@clerk/clerk-react';
import socket from '../socket';
import { useEffect } from 'react';

const Dashboard = () => {
    const {user}=useUser()
    useEffect(() => {
        if (user) {
          socket.emit("register", user.id);
        }
      }, [user]);

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard