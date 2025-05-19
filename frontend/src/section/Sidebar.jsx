import React, {useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios'

const Sidebar = () => {
  const [tab, setTab] = useState(0)
  const [chats, setChats] = useState([])
  const { getToken } = useAuth();
  const [channels, setChannels] = useState([])

  useEffect(() => {
    const getChannels = async() => {
      try {
        const token = await getToken();
        const response = await axios.post(
          'http://localhost:3000/getChannels',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setChannels(response.data.channels);
        }
      }
      catch (error) {
        console.error('Error fetching Channels:', error);
      }
    }

    getChannels()
    const getChats = async() => {
      try {
        const token = await getToken();
        const res = await axios.post(
          'http://localhost:3000/getChats',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          setChats(res.data.chats);
        }
      }
      catch (error) {
        console.error('Error fetching Chats', error);
      }
    }
    getChats()
  }, [getToken])

  return (
    <div className="sidebar-container">
      <div className="tab-buttons">
        <Button 
          onClick={() => setTab(0)} 
          className={`neo-button channel-button ${tab === 0 ? 'active' : ''}`}
        >
          Channels
        </Button>
        <Button 
          onClick={() => setTab(1)} 
          className={`neo-button personal-button ${tab === 1 ? 'active' : ''}`}
        >
          Personal
        </Button>
      </div>

      <div className="chat-list">
        {(tab === 0 ? channels : chats).map((item, index) => (
          <div key={item?._id || index} className="chat-item">
            <div className="avatar">
              {item?.profilePic ? (
                <img src={item.profilePic} alt={item.chatName || item.name || 'Chat'} />
              ) : (
                <div className="avatar-placeholder">
                  {(item?.chatName?.[0] || item?.name?.[0] || 'C').toUpperCase()}
                </div>
              )}
            </div>
            <div className="chat-details">
              <h3>{item?.chatName || item?.name || 'Unnamed Chat'}</h3>
              {item?.latestMessage && (
                <p>{item.latestMessage.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .sidebar-container {
          background-color: white;
          border: 3px solid black;
          border-radius: 10px;
          padding: 16px;
          width: 100%;
          max-width: 350px;
          box-shadow: 5px 5px 0px rgba(0, 0, 0, 0.9);
          margin: 10px;
        }
        
        .tab-buttons {
          display: flex;
          margin-bottom: 20px;
        }
        
        .neo-button {
          padding: 8px 20px;
          border: 3px solid black !important;
          font-weight: bold !important;
          font-size: 18px;
          margin-right: 10px;
          box-shadow: 3px 3px 0px black;
          transition: all 0.2s ease;
          border-radius: 0 !important;
        }
        
        .neo-button:active {
          box-shadow: 0px 0px 0px black;
          transform: translate(3px, 3px);
        }
        
        .channel-button {
          background-color: #0dc977 !important;
          color: black !important;
        }
        
        .personal-button {
          background-color: #ff3d3d !important;
          color: black !important;
        }
        
        .chat-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .chat-item {
          display: flex;
          align-items: center;
          padding: 12px;
          background: white;
          border: 2px solid black;
          border-radius: 8px;
          box-shadow: 3px 3px 0px black;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .chat-item:hover {
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0px black;
        }
        
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid black;
          overflow: hidden;
          margin-right: 12px;
          background-color: #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .avatar-placeholder {
          font-weight: bold;
          font-size: 20px;
          color: black;
        }
        
        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .chat-details h3 {
          margin: 0;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        
        .chat-details p {
          margin: 0;
          font-size: 14px;
          color: #666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }
      `}</style>
    </div>
  )
}

export default Sidebar
