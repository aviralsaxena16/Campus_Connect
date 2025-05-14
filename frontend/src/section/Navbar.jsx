import React from 'react';
import { Search } from 'lucide-react';
import Logout from '../components/Logout';

const Navbar = () => {
  return (
    <div className="p-1">
      <nav className="bg-indigo-500 mx-6 mt-3 rounded-lg h-16 flex items-center justify-between px-4">
        {/* Left: Search Input */}
        <form className="flex items-center space-x-2">
          <div className="flex items-center bg-white rounded px-2 py-1">
            <span className="text-gray-500">@</span>
            <input
              type="text"
              className="ml-2 outline-none"
              placeholder="Search User"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
        </form>

        {/* Center: Title */}
        <h1 className="!text-white text-2xl font-semibold text-center text-shadow-cyan-500">Campus Connect</h1>

        {/* Right: Search Icon */}
        <div className="text-white cursor-pointer">
          <Search />
        </div>
        <Logout/>
      </nav>
    </div>
  );
};

export default Navbar;
