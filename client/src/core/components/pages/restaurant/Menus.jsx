import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import AddMenuPopup from '../../../../features/restaurentManageent/components/AddMenuPopup';

function Menus() {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  
  // Sample categories - replace with actual data fetching
  const [categories, setCategories] = useState([
    { _id: '1', name: 'Appetizers' },
    { _id: '2', name: 'Main Course' },
    { _id: '3', name: 'Desserts' },
    { _id: '4', name: 'Beverages' }
  ]);
  
  const handleAddMenuItem = (menuItem) => {
    // Implement the logic to add the menu item
    console.log('New menu item:', menuItem);
    
    // Close the popup
    setIsAddMenuOpen(false);
  };

  return (
    <div className="p-4 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Menu Items</h1>
        
        <button 
          onClick={() => setIsAddMenuOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle size={18} />
          <span>Add New Item</span>
        </button>
      </div>
      
      {/* Content for displaying menu items would go here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Menu items would be mapped here */}
      </div>
      
      {/* Add Menu Popup */}
      <AddMenuPopup 
        isOpen={isAddMenuOpen} 
        onClose={() => setIsAddMenuOpen(false)} 
        onSubmit={handleAddMenuItem}
        categories={categories} 
      />
    </div>
  );
}

export default Menus;