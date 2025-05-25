import { useState, useRef, useEffect } from 'react';
import { User } from 'lucide-react';
import Logout from '../components/Logout';
import Profile from './Profile';

const Navbar = ({setSearch}) => {
  const [show, setShow] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShow(false);
      }
    };
    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [show]);

  return (
    <div className="p-1" style={{ position: 'relative' }}>
      <nav
        className="
          bg-[#ffcc00]  /* Vibrant yellow background */
          mx-6 mt-3 rounded-lg h-20 flex items-center justify-between px-6
          border-4 border-black
          shadow-[6px_6px_0_0_rgba(0,0,0,1)]
          relative
        "
        style={{
          fontFamily: "'Lexend Mega', 'Public Sans', sans-serif", // Neo-brutalism fonts
        }}
      >
        {/* Left: Search Input */}
        <form className="flex items-center space-x-2" onSubmit={(e) => e.preventDefault()}>
          <div
            className="
              flex items-center bg-white rounded-lg
              px-3 py-2 border-2 border-black
              shadow-[4px_4px_0_0_rgba(0,0,0,1)]
            "
          >
            <span className="text-black font-bold text-lg">@</span>
            
            
            <input
              type="text"
              className="
                ml-2 outline-none bg-transparent text-black
                font-semibold text-base
                placeholder:text-gray-500
              "
              placeholder="Search User"
              aria-label="Username"
              aria-describedby="basic-addon1"
              onChange={(e)=>setSearch(e.target.value)}
              style={{ width: '120px' }}
            />


          </div>
        </form>

        {/* Center: Title */}
        <h1
          className="
            text-black text-3xl font-extrabold text-center
            px-4 py-2
            border-2 border-black rounded-lg
            shadow-[4px_4px_0_0_rgba(0,0,0,1)]
            bg-[#40d39c]
            uppercase tracking-tight
          "
        >
          Campus Connect
        </h1>

        {/* Right: Search Icon (hidden for now) */}
        <div
          className="
            text-black cursor-pointer
            border-2 border-black rounded-full
            p-2 bg-white
            shadow-[4px_4px_0_0_rgba(0,0,0,1)]
            mr-2
            hover:bg-[#b9e2f8] transition
          "
        >
          {/* <Search /> */}
        </div>
        <div className="flex items-center ml-4 space-x-3" ref={dropdownRef}>
          <Logout />
          {/* User Icon Button */}
          <button
            className="
              border-2 border-black rounded-full
              bg-white p-2 ml-2
              shadow-[4px_4px_0_0_rgba(0,0,0,1)]
              hover:bg-[#40d39c] transition
              text-black
              flex items-center justify-center
            "
            aria-label="Profile"
            onClick={() => setShow((prev) => !prev)}
            type="button"
          >
            <User size={24} strokeWidth={3} />
          </button>
          {/* Profile Dropdown */}
          {show && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                zIndex: 100,
              }}
            >
              <Profile />
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
