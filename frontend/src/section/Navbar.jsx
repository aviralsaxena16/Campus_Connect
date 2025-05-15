import React from 'react';
import { Search } from 'lucide-react';
import Logout from '../components/Logout';

const Navbar = () => {
  return (
    <div className="p-1">
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
        <form className="flex items-center space-x-2">
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

        {/* Right: Search Icon */}
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
          <Search />
        </div>
        <div className="ml-4">
          <Logout />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
