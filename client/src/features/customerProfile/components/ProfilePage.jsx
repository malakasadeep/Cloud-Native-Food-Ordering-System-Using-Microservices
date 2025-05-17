import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../customerAuth/actions/customerAction';
import { User, ShoppingBag, Clock, LogOut, Settings, Edit, Phone, Mail } from 'lucide-react';
import Header from '../../../core/components/organisms/Header';
import orderService from '../../restaurentManageent/services/orderservice';

const ProfilePage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/customer-auth');
    } else {
      fetchOrders();
    }
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getAllOrders();
      if (response.success) {
        // Filter orders for this user if needed
        setOrders(response.data?.orders || []);
      } else {
        setError(response.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('Error fetching your orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'PLACED': return 'bg-blue-100 text-blue-700';
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-700';
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
              <button className="text-blue-500 flex items-center text-sm">
                <Edit size={16} className="mr-1" /> Edit
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Name</h3>
                <p className="text-gray-800">{user?.name || 'Not provided'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                <p className="text-gray-800 flex items-center">
                  <Mail size={16} className="mr-2 text-gray-400" />
                  {user?.email || 'Not provided'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                <p className="text-gray-800 flex items-center">
                  <Phone size={16} className="mr-2 text-gray-400" />
                  {user?.mobile || 'Not provided'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
                <p className="text-gray-800">{user?.address || 'Not provided'}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>
              
              <div className="space-y-4">
                <button 
                  className="w-full md:max-w-xs flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                  onClick={() => navigate('/change-password')}
                >
                  <span className="font-medium text-gray-800">Change Password</span>
                  <Settings size={16} className="text-gray-500" />
                </button>

                <button 
                  className="w-full md:max-w-xs flex items-center justify-between p-4 rounded-lg bg-red-50 hover:bg-red-100 transition"
                  onClick={handleLogout}
                >
                  <span className="font-medium text-red-600">Logout</span>
                  <LogOut size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'orders':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Order History</h2>
            
            {loading ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your orders...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                <button 
                  onClick={() => navigate('/')}
                  className="px-6 py-2 bg-cartNumBg text-white rounded-full hover:bg-orange-600 transition"
                >
                  Browse Restaurants
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                      <h3 className="text-sm font-medium text-gray-800">
                        Order #{order._id.substring(order._id.length - 6)}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" /> 
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        {order.items?.length || 0} items
                      </div>
                      <div className="font-medium">
                        ${order.totalAmount?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        {order.deliveryAddress?.substring(0, 50) || 'No address provided'}
                        {order.deliveryAddress && order.deliveryAddress.length > 50 ? '...' : ''}
                      </div>
                      <button 
                        onClick={() => navigate(`/customer/order/confirmation?orderId=${order._id}`)}
                        className="text-sm text-blue-500 hover:text-blue-700"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-primary pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-wrap gap-6 items-center justify-between"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-cartNumBg flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{user?.name || 'Hello!'}</h1>
                <p className="text-gray-500">{user?.email || 'Unknown email'}</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
            >
              <LogOut size={18} className="mr-2" /> Logout
            </button>
          </motion.div>
          
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'profile' 
                  ? 'text-cartNumBg border-b-2 border-cartNumBg' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={16} className="inline mr-2" /> Profile
            </button>
            
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'orders' 
                  ? 'text-cartNumBg border-b-2 border-cartNumBg' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag size={16} className="inline mr-2" /> Orders
            </button>
          </div>
          
          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
