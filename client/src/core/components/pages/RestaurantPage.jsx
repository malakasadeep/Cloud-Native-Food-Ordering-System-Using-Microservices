import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import RestaurentSidebar from '../organisms/RestaurentSidebar';

// Import page components (you will need to create these)
import Dashboard from './restaurant/Dashboard';
import Menus from './restaurant/Menus';
import Orders from './restaurant/Orders';
import Delivery from './restaurant/Delivery';
import Profile from './restaurant/Profile';
import { logout } from '../../../features/customerAuth/actions/customerAction';
import { useDispatch, useSelector } from 'react-redux';

const RestaurantPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const { user } = useSelector((state) => state.auth);
  const handleSignOut = () => {
      dispatch(logout(navigate));
      
    };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <RestaurentSidebar onSignOut={handleSignOut} />
      
      <div className="flex-1 p-6 ml-64 transition-all duration-300 lg:ml-64 md:ml-64 sm:ml-16">
        <div className="bg-white p-5 rounded-lg shadow-sm mb-5">
          <h1 className="text-2xl font-semibold text-gray-800">Welcome to Your Restaurant Dashboard</h1>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm min-h-[calc(100vh-180px)]">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/menus" element={<Menus />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;
