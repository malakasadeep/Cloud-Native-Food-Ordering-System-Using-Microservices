import React, { useState } from "react";
import { 
  FiHome, 
  FiUsers, 
  FiShoppingBag, 
  FiMap, 
  FiSettings, 
  FiTruck,
  FiActivity,
  FiBarChart2,
  FiLogOut
} from "react-icons/fi";

const AdminSidebar = ({ isOpen, setActiveContent, onSignOut }) => {
  const [active, setActive] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", title: "Dashboard", icon: <FiHome /> },
    { id: "orders", title: "Orders", icon: <FiShoppingBag /> },
    { id: "restaurants", title: "Restaurants", icon: <FiHome /> },
    { id: "users", title: "Users", icon: <FiUsers /> },
    { id: "drivers", title: "Delivery Partners", icon: <FiTruck /> },
    { id: "analytics", title: "Analytics", icon: <FiBarChart2 /> },
    { id: "tracking", title: "Live Tracking", icon: <FiMap /> },
    { id: "settings", title: "Settings", icon: <FiSettings /> }
  ];

  const handleMenuClick = (id) => {
    setActive(id);
    setActiveContent(id);
  };

  return (
    <aside className={`bg-white shadow-md w-64 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed md:static h-full z-10`}>
      <div className="p-4">
        {/* Logo or brand name */}
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>
      
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`flex items-center w-full px-3 py-3 rounded-md transition-all duration-200 ${
                  active === item.id
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                }`}
                onClick={() => handleMenuClick(item.id)}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.title}</span>
                {item.id === "orders" && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    5
                  </span>
                )}
              </button>
            </li>
          ))}
          
          <li className="mt-auto">
            <button
              onClick={onSignOut}
              className="flex items-center p-4 text-red-600 w-full hover:bg-gray-100"
            >
              <FiLogOut className="mr-3" />
              Sign Out
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
