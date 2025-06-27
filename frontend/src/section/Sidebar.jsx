import React, { useState, useEffect, useMemo } from 'react';
import Button from 'react-bootstrap/Button';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { useChat } from '../../context/ChatContext';

const Sidebar = ({ search }) => {
  const [tab, setTab] = useState(0); 
  const [chats, setChats] = useState([]);
  const [channels, setChannels] = useState([]);
  const { getToken } = useAuth();
  const { setSelectedChat, setIsChannel } = useChat();

  const searchTerm = (search || '').trim().toLowerCase();
  const isSearching = searchTerm.length > 0;

  useEffect(() => {
    const getChannels = async () => {
      try {
        const token = await getToken();
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/chat/getChannels`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setChannels(response.data.channels);
        }
      } catch (error) {
        console.error('Error fetching Channels:', error);
      }
    };

    const getChats = async () => {
      try {
        const token = await getToken();
        const res = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/chat/getChats`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          setChats(res.data.chats);
        }
      } catch (error) {
        console.error('Error fetching Chats', error);
      }
    };

    getChannels();
    getChats();
  }, [getToken]);

  // Filtered combined list when searching
  const filteredList = useMemo(() => {
    const allItems = [...channels, ...chats];
    return allItems.filter(item => {
      const itemName = (item?.chatName || item?.name || '').toLowerCase();
      return itemName.includes(searchTerm);
    });
  }, [channels, chats, searchTerm]);

  // Non-search mode: separate tabs
  const listToRender = isSearching
    ? filteredList
    : tab === 0
      ? channels
      : chats;

  return (
    <div className="sidebar-container">
      {/* Tabs only if NOT searching */}
      {!isSearching && (
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
      )}

      {/* Chat list */}
      <div className="chat-scroll-container">
        <div className="chat-list">
          {listToRender.length === 0 ? (
            <div className="empty-state">
              {isSearching ? 'No matching results.' : 'No items found.'}
            </div>
          ) : (
            listToRender.map((item, index) => {
              // Determine if the item is a chat (has isOnline property)
              const isChat = typeof item.isOnline !== 'undefined';

              return (
                <div
                  key={item?._id ?? `item-${index}`}
                  onClick={() => {
                    setSelectedChat(item);
                    setIsChannel(tab === 0); // 0 => channels, 1 => DMs
                  }}
                  className="chat-item"
                >
                  <div className="avatar" style={{ position: 'relative' }}>
                    {item?.profilePic ? (
                      <img src={item.profilePic} alt={item.chatName || item.name || 'Chat'} />
                    ) : (
                      <div className="avatar-placeholder" onClick={() => { setSelectedChat(item) }}>
                        {(item?.chatName?.[0] || item?.name?.[0] || 'C').toUpperCase()}
                      </div>
                    )}
                    {/* Show online indicator for chats only */}
                    {tab===1 && item.isOnline && (
                      <span className="online-dot" title="Online"></span>
                    )}
                  </div>
                  <div className="chat-details">
                    <h3>
                      {item?.chatName || item?.name || 'Unnamed Chat'}
                      {/* Show inline dot for chat name (optional, remove if not needed) */}
                      {tab===1 && item.isOnline && (
                        <span className="online-dot-inline" title="Online"></span>
                      )}
                    </h3>
                    {item?.latestMessage && (
                      <p>{item.latestMessage.content}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Styles remain unchanged except for the online-dot */}
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
          height: 80vh;
          display: flex;
          flex-direction: column;
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
          padding-right: 8px;
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
          position: relative;
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
        .empty-state {
          text-align: center;
          padding: 20px;
          color: #666;
          font-style: italic;
        }
        .chat-scroll-container {
          padding:10px;
          flex: 1;
          overflow-y: auto;
          border: 2px solid black;
          border-radius: 6px;
          margin-top: 12px;
        }
        .chat-scroll-container::-webkit-scrollbar {
          width: 12px;
          background-color: white;
          border-left: 2px solid black;
        }
        .chat-scroll-container::-webkit-scrollbar-thumb {
          background: #00FF66;
          border: 2px solid black;
          border-radius: 0;
        }
        .chat-scroll-container::-webkit-scrollbar-track {
          background: white;
        }

        /* ONLINE DOT */
        .online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: #00FF66;
          border: 2px solid black;
          border-radius: 50%;
          box-shadow: 0 0 0 1px white;
        }
        /* Optional: Inline dot next to name
        .online-dot-inline {
          display: inline-block;
          margin-left: 6px;
          width: 10px;
          height: 10px;
          background: #00FF66;
          border: 1.5px solid black;
          border-radius: 50%;
          vertical-align: middle;
        }
        */
      `}</style>
    </div>
  );
};

export default Sidebar;
