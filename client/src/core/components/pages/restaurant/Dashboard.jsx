import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Clock, MapPin,  AlertCircle } from 'lucide-react';
import partnerService from '../../../../features/partnersManagement/services/partnerServices';
import { toast } from 'react-hot-toast';
import { FaUtensils, FaShoppingBag, FaTruck, FaStar, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
  const stats = [
    { id: 1, title: 'Total Orders', value: '128', icon: <FaShoppingBag />, color: 'bg-blue-500' },
    { id: 2, title: 'New Orders', value: '12', icon: <FaUtensils />, color: 'bg-green-500' },
    { id: 3, title: 'In Delivery', value: '8', icon: <FaTruck />, color: 'bg-yellow-500' },
    { id: 4, title: 'Rating', value: '4.8', icon: <FaStar />, color: 'bg-purple-500' },
  ];

  const recentOrders = [
    { id: '#ORD-5123', customer: 'John Smith', items: 3, total: '$42.50', status: 'Completed', date: '10 min ago' },
    { id: '#ORD-5122', customer: 'Sarah Johnson', items: 2, total: '$28.75', status: 'In Progress', date: '25 min ago' },
    { id: '#ORD-5121', customer: 'Mike Brown', items: 4, total: '$55.25', status: 'In Delivery', date: '45 min ago' },
    { id: '#ORD-5120', customer: 'Emily Davis', items: 1, total: '$18.00', status: 'Completed', date: '1 hour ago' },
  ];

  const popularItems = [
    { id: 1, name: 'Classic Cheeseburger', orders: 42, revenue: '$420.00' },
    { id: 2, name: 'Chicken Wings', orders: 38, revenue: '$380.00' },
    { id: 3, name: 'Margherita Pizza', orders: 35, revenue: '$525.00' },
    { id: 4, name: 'Caesar Salad', orders: 30, revenue: '$210.00' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'In Delivery': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  const { user } = useSelector((state) => state.auth);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        if (user && user._id) {
          const response = await partnerService.getRestaurantById(user._id);
          if (response.success && response.data) {
            setRestaurant(response.data);
            setIsAvailable(response.data.restaurant?.availability || false);
          } else {
            toast.error('Failed to load restaurant data');
          }
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
        toast.error('Something went wrong while loading restaurant data');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [user]);

  useEffect(() => {
    if (!restaurant || !restaurant.restaurant?.closingTime) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const [hours, minutes] = restaurant.restaurant.closingTime.split(':');
      const closingTime = new Date();
      closingTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
      
      if (closingTime < now) {
        closingTime.setDate(closingTime.getDate() + 1);
      }
      
      const diff = closingTime - now;
      
      const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hoursLeft}h ${minutesLeft}m`;
    };

    setTimeRemaining(calculateTimeRemaining());
    
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 60000);
    
    return () => clearInterval(interval);
  }, [restaurant]);

  const handleToggleAvailability = async () => {
    if (toggleLoading) return;
    
    setToggleLoading(true);
    const newAvailability = !isAvailable;
    
    try {
      if (user && user._id) {
        const response = await partnerService.updateRestaurentAvailability(user._id, newAvailability);
        if (response.success) {
          setIsAvailable(newAvailability);
          toast.success(`Restaurant is now ${newAvailability ? 'available' : 'unavailable'} for orders`);
          
          // Update local restaurant state
          setRestaurant(prev => ({
            ...prev,
            restaurant: {
              ...prev.restaurant,
              isAvailable: newAvailability
            }
          }));
        } else {
          toast.error(response.message || 'Failed to update availability');
        }
      }
    } catch (error) {
      console.error('Error updating restaurant availability:', error);
      toast.error('Something went wrong while updating availability');
    } finally {
      setToggleLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>;
  }

  if (!restaurant || !restaurant.restaurant) {
    return <div className="text-center p-8 bg-red-50 rounded-lg">
      <AlertCircle className="mx-auto text-red-500 mb-2" size={30} />
      <h2 className="text-xl font-bold text-red-700">Restaurant information not found</h2>
      <p className="text-red-600">Please complete your restaurant profile setup.</p>
    </div>;
  }

  const { name, address, openingTime, closingTime, coverImageURL } = restaurant.restaurant;

  return (
    <>
    <div className="space-y-6">
      <div className="relative h-64 rounded-xl overflow-hidden shadow-md">
        <img 
          src={coverImageURL || 'https://via.placeholder.com/800x300?text=Restaurant+Cover'} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="p-6 text-white">
            <h1 className="text-3xl font-bold">{name}</h1>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Restaurant Information</h2>
          
          <div className="flex items-center gap-2">
            <MapPin className="text-gray-500" size={20} />
            <span className="text-gray-700">{address}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="text-gray-500" size={20} />
            <span className="text-gray-700">Open: {openingTime} - {closingTime}</span>
          </div>

          {timeRemaining && (
            <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-2">
              <Clock className="text-blue-500" size={20} />
              <span className="font-medium text-blue-700">Closing in: {timeRemaining}</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Restaurant Availability</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Status</h3>
              <p className="text-sm text-gray-500">Toggle to change availability</p>
            </div>
            
            <button 
              onClick={handleToggleAvailability}
              disabled={toggleLoading}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isAvailable ? 'bg-green-500' : 'bg-gray-200'}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isAvailable ? 'translate-x-5' : 'translate-x-0'}`}>
              </span>
            </button>
          </div>
          
          <div className={`mt-4 p-3 rounded-lg ${isAvailable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <p className="font-medium flex items-center gap-2">
              <span className={`inline-block w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {isAvailable ? 'Your restaurant is open for orders' : 'Your restaurant is not accepting orders'}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div className="dashboard mt-10">
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white rounded-lg shadow-sm p-6 flex items-center">
              <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center text-white mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Revenue Overview</h3>
              <div className="text-sm font-medium text-blue-500 flex items-center">
                <FaChartLine className="mr-1" /> This Week
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              {/* Placeholder for chart - would use a chart library in a real app */}
              <p className="text-gray-500">Revenue Chart Visualization</p>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 h-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Items</h3>
            <div className="space-y-4">
              {popularItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.orders} orders</p>
                  </div>
                  <p className="font-semibold text-green-500">{item.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {order.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.customer}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.items}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.total}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
</>
  );
};

export default Dashboard;
