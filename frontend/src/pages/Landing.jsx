import React, { useEffect } from 'react';
import bg from '../assets/bg.png';
import Login from '../components/Login';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const Landing = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { isLoaded, user } = useUser();

  useEffect(() => {
    const registerUser = async () => {
      if (isSignedIn && isLoaded) {
        const userData = {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          imageUrl: user.imageUrl || '',
        };

        console.log('Sending user data to backend:', userData);

        try {
          const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/user/register`, userData, {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          });

          console.log('Registration handled:', response.data);
          navigate('/home');
        } catch (err) {
          console.error('Error registering user:', err.response?.data || err.message);
        }
      }
    };

    registerUser();
  }, [isSignedIn, isLoaded, user, navigate]);

  if (!isSignedIn) {
    return (
      <div
        className="relative h-screen w-full bg-cover bg-center flex justify-center items-center"
        style={{
          backgroundImage:
            `url(https://png.pngtree.com/thumb_back/fw800/background/20190828/pngtree-80-style-background-with-geometric-colorful-shapes-image_307997.jpg)`,
        }}
      >
        <SignedOut>
          <Login />
        </SignedOut>

        {/* Signature Footer */}
        <div className="absolute bottom-4 right-4 text-sm text-white bg-black/40 px-3 py-1 rounded-full shadow-lg font-mono tracking-wide">
          Made by Aviral Saxena 🚀
        </div>
      </div>
    );
  }

  return null;
};

export default Landing;
