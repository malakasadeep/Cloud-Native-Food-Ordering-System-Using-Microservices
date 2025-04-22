import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaList, FaShoppingCart, FaTruck, FaUser, FaSignOutAlt, FaBars } from 'react-icons/fa';

const RestaurentSidebar = ({ onSignOut }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const menuItems = [
    {
      path: '/restaurant/dashboard',
      name: 'Dashboard',
      icon: <FaHome className="text-xl" />
    },
    {
      path: '/restaurant/menus',
      name: 'Menus',
      icon: <FaList className="text-xl" />
    },
    {
      path: '/restaurant/orders',
      name: 'Orders',
      icon: <FaShoppingCart className="text-xl" />
    },
    {
      path: '/restaurant/delivery',
      name: 'Delivery',
      icon: <FaTruck className="text-xl" />
    },
    {
      path: '/restaurant/profile',
      name: 'Profile',
      icon: <FaUser className="text-xl" />
    }
  ];

  return (
    <div className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-md transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <h2 className="m-0 text-2xl font-bold text-red-500">
          {isCollapsed ? 'R' : 'Restaurant'}
        </h2>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-transparent border-none text-gray-700 cursor-pointer text-lg focus:outline-none"
        >
          <FaBars />
        </button>
      </div>
      
      <div className="py-5 flex flex-col h-[calc(100%-70px)]">
        {menuItems.map((item, index) => (
          <NavLink 
            to={item.path} 
            key={index}
            className={({ isActive }) => 
              `flex items-center py-3 px-5 text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-red-500 hover:border-l-4 hover:border-red-500 ${
                isActive ? 'bg-gray-50 text-red-500 border-l-4 border-red-500 font-semibold' : ''
              } my-1`
            }
          >
            <div className="min-w-[30px]">{item.icon}</div>
            {!isCollapsed && <span className="ml-3">{item.name}</span>}
          </NavLink>
        ))}
        
        <div 
          onClick={onSignOut}
          className="flex items-center py-3 px-5 text-red-500 cursor-pointer transition-all duration-200 hover:bg-gray-50 mt-auto"
        >
          <div className="min-w-[30px]"><FaSignOutAlt className="text-xl" /></div>
          {!isCollapsed && <span className="ml-3">Sign Out</span>}
        </div>
      </div>
    </div>
  );
};

export default RestaurentSidebar;
