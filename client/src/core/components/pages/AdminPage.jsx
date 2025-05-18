import React, { useState } from "react";
import AdminHeader from "../organisms/AdminHeader";
import AdminSidebar from "../organisms/AdminSidebar";
import MainMap from "../molecules/MainMap";
import { FiUsers, FiShoppingBag, FiSettings, FiActivity } from "react-icons/fi";
import PendingRequests from "../../../features/partnersManagement/components/PendingRequests";
import AdminOrderPage from "./AdminOrderPage";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../organisms/AdminHeader';
import AdminSidebar from '../organisms/AdminSidebar';
import MainMap from '../molecules/MainMap';
import { FiUsers, FiShoppingBag, FiSettings, FiActivity, FiLogOut } from 'react-icons/fi';
import PendingRequests from '../../../features/partnersManagement/components/PendingRequests';
import { logout } from '../../../features/customerAuth/actions/customerAction';
import { useDispatch } from 'react-redux';

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeContent, setActiveContent] = useState("dashboard");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const showSettings = () => {
    setSidebarOpen(true);
    setActiveContent("settings");
  };

  const renderContent = () => {
    switch (activeContent) {
      case "dashboard":
        return <DashboardContent />;
      case "orders":
        return <AdminOrderPage />;
      case "tracking":
        return (
          <div className="p-6 h-[calc(100vh-80px)]">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Live Tracking
            </h2>
            <div className="h-[calc(100vh-180px)]">
              <MainMap />
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              {activeContent.charAt(0).toUpperCase() + activeContent.slice(1)}
            </h2>
            <p className="text-gray-600">
              Content for {activeContent} goes here...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <AdminHeader toggleSidebar={toggleSidebar} showSettings={showSettings} />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar
          isOpen={sidebarOpen}
          setActiveContent={setActiveContent}
        />
        <main className="flex-1 overflow-y-auto transition-all duration-300">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const DashboardContent = () => {
  // Sample statistics data
  const stats = [
    {
      id: 1,
      title: "Total Orders",
      value: "1,254",
      icon: <FiShoppingBag className="text-orange-500" />,
      change: "+12.5%",
      color: "bg-orange-100",
    },
    {
      id: 2,
      title: "Active Users",
      value: "3,879",
      icon: <FiUsers className="text-red-500" />,
      change: "+8.2%",
      color: "bg-red-100",
    },
    {
      id: 3,
      title: "Conversion Rate",
      value: "25.8%",
      icon: <FiActivity className="text-green-500" />,
      change: "+3.1%",
      color: "bg-green-100",
    },
    {
      id: 4,
      title: "Avg. Order Value",
      value: "$24.50",
      icon: <FiSettings className="text-blue-500" />,
      change: "+5.4%",
      color: "bg-blue-100",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`${stat.color} rounded-lg p-6 shadow-sm transition-transform hover:scale-105 duration-300`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold mt-2 text-gray-800">
                  {stat.value}
                </p>
                <span className="text-green-600 text-xs font-medium mt-1 inline-block">
                  {stat.change} from last month
                </span>
              </div>
              <div className="p-3 rounded-full bg-white bg-opacity-50">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className=" p-6  h-80">
          <h3 className="text-lg font-medium mb-4 text-gray-700">
            Pending Partner Requests
          </h3>
          <PendingRequests />
        </div>
        <div className=" p-6  h-[580px]">
          <h3 className="text-lg font-medium mb-4 text-gray-700">
            Map Overview
          </h3>
          <MainMap />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;