import React, { useState } from "react";
import { FiMenu, FiSearch, FiSettings, FiLogOut } from "react-icons/fi";

const AdminHeader = ({ toggleSidebar, showSettings, onSignOut }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 md:px-6">
      {/* Site Title */}
      <div className="flex items-center">
        <h1 className="text-red-600 text-2xl font-bold">Food<span className="text-orange-500">Delivery</span></h1>
      </div>

      {/* Search and Menu */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
          >
            <FiMenu className="text-gray-700 text-xl" />
          </button>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 transform origin-top-right transition-all duration-200 ease-out scale-100">
              <button
                onClick={() => {
                  showSettings();
                  setShowDropdown(false);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
              >
                <FiSettings className="mr-2" />
                Settings
              </button>
              <button
                onClick={() => {
                  onSignOut();
                  setShowDropdown(false);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
              >
                <FiLogOut className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
