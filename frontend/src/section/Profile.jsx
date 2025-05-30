import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { FaEdit, FaSave, FaTimes, FaUpload } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [tempUser, setTempUser] = useState({});
  const { getToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // <-- Loading state
    // const [pic,setPic]=useState(null)

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = await getToken();
        const response = await axios.post(
          'http://localhost:3000/user/getUser',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
            setUser(response.data.person);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false); 
      }
    };
    getProfile();
  }, [getToken,isEditing]);

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setTempUser({ ...user });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      const token = await getToken();
      const response = await axios.put(
        'http://localhost:3000/user/updateUser',
        { ...tempUser },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setUser(response.data.user);
        // setPic(response.data.user.imageUrl)
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = await getToken();
      const response = await axios.post(
        'http://localhost:3000/upload/uploadImage',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setUser(response.data.user);
        // setPic(response.data.user.imageUrl)
        console.log(response.data.user);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const neoInputStyle = {
    border: '3px solid #000',
    borderRadius: '8px',
    padding: '0.5rem',
    marginBottom: '0.5rem',
    boxShadow: '3px 3px 0 #000',
    width: '100%',
    fontFamily: 'Inter, Arial, sans-serif'
  };

  const neoButtonStyle = {
    border: '3px solid #000',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    boxShadow: '3px 3px 0 #000',
    cursor: 'pointer',
    fontWeight: '600',
    margin: '0.5rem'
  };
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
          <div style={{ position: 'relative' }}>
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
            {isEditing && (
              <label style={{
                ...neoButtonStyle,
                position: 'absolute',
                bottom: '10px',
                right: '-10px',
                background: '#40d39c',
                padding: '0.3rem 0.5rem'
              }}>
                <FaUpload />
                <input
                  type="file"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  accept="image/*"
                />
              </label>
            )}
          </div>

          <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
            <button
              onClick={handleEditToggle}
              style={{
                ...neoButtonStyle,
                background: isEditing ? '#ff4444' : '#40d39c',
                padding: '0.5rem'
              }}
            >
              {isEditing ? <FaTimes size={18} /> : <FaEdit size={18} />}
            </button>
          </div>

          {isEditing ? (
            <div>
              <input
                type="text"
                value={tempUser.firstName || ''}
                onChange={(e) => setTempUser({ ...tempUser, firstName: e.target.value })}
                placeholder="First Name"
                style={neoInputStyle}
              />
              <input
                type="text"
                value={tempUser.lastName || ''}
                onChange={(e) => setTempUser({ ...tempUser, lastName: e.target.value })}
                placeholder="Last Name"
                style={neoInputStyle}
              />
              <input
                type="email"
                value={tempUser.email || ''}
                onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
                placeholder="Email"
                style={neoInputStyle}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleSave}
                  style={{
                    ...neoButtonStyle,
                    background: '#40d39c'
                  }}
                >
                  <FaSave /> Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 style={{
                fontSize: '1.3rem',
                margin: '0 0 0.5rem 0',
                fontWeight: 800,
                letterSpacing: '0.5px',
                color: '#000',
              }}>
                {`${user.firstName} ${user.lastName}`}
              </h1>
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
          )}
        </>
      ) : (
        <p style={{ color: '#000', fontWeight: 600 }}>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
