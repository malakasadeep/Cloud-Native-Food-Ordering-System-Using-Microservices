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
} from "react-icons/fi";

const AdminSidebar = ({ isOpen, setActiveContent }) => {
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
    <div 
      className={`h-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-0 overflow-hidden"
      }`}
    >
      <div className="py-6 flex flex-col h-full">
        <div className="px-6 mb-8">
          <h2 className="text-xl font-bold text-red-600">Admin<span className="text-orange-500">Panel</span></h2>
        </div>

        <nav className="flex-1 px-3">
          <ul className="space-y-1">
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
          </ul>
        </nav>

        <div className="px-6 py-4 mt-auto">
          <div className="flex items-center p-4 bg-orange-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
              A
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@fooddelivery.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
