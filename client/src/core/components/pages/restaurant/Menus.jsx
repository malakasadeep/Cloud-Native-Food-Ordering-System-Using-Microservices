import React, { useState, useEffect } from 'react';
import { PlusCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import AddMenuPopup from '../../../../features/restaurentManageent/components/AddMenuPopup';
import MenuTable from '../../../../features/restaurentManageent/components/MenuTable';
import { useSelector } from 'react-redux';
import menuService from '../../../../features/restaurentManageent/services/menuservice';
import { motion, AnimatePresence } from 'framer-motion';

function Menus() {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger state
  const { user } = useSelector((state) => state.auth);
  
  const handleAddMenuItem = async (menuItem) => {
    try {
      setLoading(true);
      
      // Add restaurant ID to the menu item
      const menuData = {
        ...menuItem,
        restaurantId: user?._id
      };
      
      const response = await menuService.addMenu(menuData);
      
      if (response.success) {
        showNotification('success', 'Menu item added successfully');
        setIsAddMenuOpen(false);
        setRefreshTrigger(prev => prev + 1); // Trigger refresh after successful add
      } else {
        showNotification('error', response.message || 'Failed to add menu item');
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      showNotification('error', 'An error occurred while adding the menu item');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditMenuItem = (item) => {
    // Implement edit functionality
    console.log('Edit menu item:', item);
    // You could open a modal/popup with the item data pre-filled
  };

  const handleDeleteMenuItem = async (itemId) => {
    // Implement delete functionality
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        // Here you would call an API to delete the item
        // const response = await menuService.deleteMenuItem(itemId);
        
        // For now, just show a success notification
        showNotification('success', 'Menu item deleted successfully');
      } catch (error) {
        console.error('Error deleting menu item:', error);
        showNotification('error', 'Failed to delete menu item');
      }
    }
  };
  
  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message
    });
    
    // Hide notification after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  return (
    <div className="p-4 relative">
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-50 p-4 rounded-md shadow-md flex items-center ${
              notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="mr-2" size={18} />
            ) : (
              <AlertTriangle className="mr-2" size={18} />
            )}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Menu Items</h1>
        
        <button 
          onClick={() => setIsAddMenuOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          disabled={loading}
        >
          <PlusCircle size={18} />
          <span>Add New Item</span>
        </button>
      </div>
      
      {/* MenuTable component replaces the previous grid display */}
      <MenuTable 
        restaurantId={user?._id} 
        onEdit={handleEditMenuItem} 
        onDelete={handleDeleteMenuItem}
        refreshTrigger={refreshTrigger} // Pass refresh trigger to table component
      />
      
      {/* Add Menu Popup */}
      <AddMenuPopup 
        isOpen={isAddMenuOpen} 
        onClose={() => setIsAddMenuOpen(false)} 
        onSubmit={handleAddMenuItem}
        resturentid={user?._id}
      />
    </div>
  );
}

export default Menus;