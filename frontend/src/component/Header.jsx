import React, { useState } from 'react';
import { Menu, User, LogOut, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import uberlogo from '../assets/uber-logo.svg';

const Header = ({ userProfile, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="absolute top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center p-4">
        <img className="w-24" src={uberlogo} alt="Uber" />
        
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 rounded-full bg-white shadow-md"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute right-4 top-16 bg-white rounded-lg shadow-xl py-2 w-48">
          <div className="border-b px-4 py-2">
            <p className="font-semibold">{userProfile?.fullname?.firstname} {userProfile?.fullname?.lastname}</p>
            <p className="text-sm text-gray-600">{userProfile?.email}</p>
          </div>
          
          <Link 
            to="/profile" 
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
          >
            <User size={20} />
            <span>Profile</span>
          </Link>
          
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;