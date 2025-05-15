import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = await getToken();
        const response = await axios.post(
          'http://localhost:3000/getUser',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setUser(response.data.person);
        } else {
          console.error('Failed to fetch user:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    getProfile();
  }, [getToken]);

  return (
    <div
      className="neo-brutal-profile"
      style={{
        minWidth: '260px',
        background: '#fff01f',
        border: '4px solid #000',
        borderRadius: '18px',
        boxShadow: '8px 8px 0 #000',
        padding: '2rem 1.5rem 1.5rem 1.5rem',
        color: '#222',
        fontFamily: 'Inter, Arial, sans-serif',
        position: 'relative'
      }}
    >
      {user ? (
        <>
          <img
            src={user.imageUrl}
            alt={`${user.firstName} ${user.lastName}`}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '18px',
              border: '3px solid #000',
              marginBottom: '0.75rem',
              boxShadow: '4px 4px 0 #000'
            }}
          />
          <h1 style={{
            fontSize: '1.3rem',
            margin: '0 0 0.5rem 0',
            fontWeight: 800,
            letterSpacing: '0.5px',
            color: '#000'
          }}>{`${user.firstName} ${user.lastName}`}</h1>
          <p style={{
            fontWeight: 600,
            margin: '0 0 0.25rem 0',
            color: '#000'
          }}>Email: <span style={{ color: '#222' }}>{user.email}</span></p>
          <p style={{
            fontWeight: 600,
            margin: 0,
            color: '#000'
          }}>Campus ID: <span style={{ color: '#222' }}>{user.campusId}</span></p>
        </>
      ) : (
        <p style={{ color: '#000', fontWeight: 600 }}>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
