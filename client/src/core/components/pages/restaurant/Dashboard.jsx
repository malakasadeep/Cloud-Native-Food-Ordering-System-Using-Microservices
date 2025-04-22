import React from 'react';
import { FaUtensils, FaShoppingBag, FaTruck, FaStar, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
  // Sample data - in a real app, this would come from an API
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

  return (
    <div className="dashboard">
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
  );
};

export default Dashboard;
