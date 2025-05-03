import React, { useState } from "react";
import { PlusCircle, AlertTriangle, CheckCircle } from "lucide-react";
import AddMenuPopup from "../../../../features/restaurentManageent/components/AddMenuPopup";
import EditMenuPopup from "../../../../features/restaurentManageent/components/EditMenuPopup";
import MenuTable from "../../../../features/restaurentManageent/components/MenuTable";
import { useSelector } from "react-redux";
import menuService from "../../../../features/restaurentManageent/services/menuservice";
import { motion, AnimatePresence } from "framer-motion";

function Menus() {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger state
  const { user } = useSelector((state) => state.auth);

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
const [itemToDelete, setItemToDelete] = useState(null);
const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);
const [isEditSuccessOpen, setIsEditSuccessOpen] = useState(false); // ✅ New state for edit success


  const handleAddMenuItem = async (menuItem) => {
    try {
      setLoading(true);

      // Add restaurant ID to the menu item
      const menuData = {
        ...menuItem,
        restaurantId: user?._id,
      };

      const response = await menuService.addMenu(menuData);

      if (response.success) {
        showNotification("success", "Menu item added successfully");
        setIsAddMenuOpen(false);
        setRefreshTrigger((prev) => prev + 1); // Trigger refresh after successful add
      } else {
        showNotification(
          "error",
          response.message || "Failed to add menu item"
        );
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
      showNotification("error", "An error occurred while adding the menu item");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle opening edit popup with item data
  const handleEditClick = (menuItem) => {
    setCurrentMenuItem(menuItem);
    setIsEditMenuOpen(true);
  };

  const handleEditMenuItem = async (updatedItem) => {
    try {
      setLoading(true);

      const response = await menuService.updateMenuItem(
        updatedItem._id,
        updatedItem
      );

      if (response.success) {
        setIsEditMenuOpen(false); 
        setIsEditSuccessOpen(true); // ✅ Show edit success popup
        setRefreshTrigger((prev) => prev + 1);
      } else {
        showNotification("error", response.message || "Failed to update menu item");
      }
    } catch (error) {
      console.error("Error updating menu item:", error);
      showNotification("error", "An error occurred while updating the menu item");
    } finally {
      setLoading(false);
    }
  };

  // When user clicks delete button
const handleDeleteMenuItem = (itemId) => {
  setItemToDelete(itemId);
  setIsConfirmDeleteOpen(true); // Open the confirm popup
};

const handleConfirmDelete = async () => {
  try {
    setLoading(true);

    const response = await menuService.deleteMenu(itemToDelete);

    if (response.success) {
      setIsConfirmDeleteOpen(false);
      setIsDeleteSuccessOpen(true); // Show success popup
      setRefreshTrigger((prev) => prev + 1); // Refresh table
    } else {
      showNotification(
        "error",
        response.message || "Failed to delete menu item"
      );
      setIsConfirmDeleteOpen(false);
    }
  } catch (error) {
    console.error("Error deleting menu item:", error);
    showNotification(
      "error",
      "An error occurred while deleting the menu item"
    );
    setIsConfirmDeleteOpen(false);
  } finally {
    setLoading(false);
  }
};



  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message,
    });

    // Hide notification after 5 seconds
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
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
              notification.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {notification.type === "success" ? (
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
        onEdit={handleEditClick}
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

      {/* Edit Menu Popup */}
      <EditMenuPopup
        isOpen={isEditMenuOpen}
        onClose={() => setIsEditMenuOpen(false)}
        menuData={currentMenuItem}
        onUpdate={handleEditMenuItem}
        restaurantId={user?._id}
      />

      {/* Confirm Delete Popup */}
<AnimatePresence>
  {isConfirmDeleteOpen && (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-6">Are you sure you want to delete this menu item?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setIsConfirmDeleteOpen(false)}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>

{/* Delete Success Popup */}
<AnimatePresence>
  {isDeleteSuccessOpen && (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-green-100 p-6 rounded-lg shadow-lg w-80 text-center">
        <CheckCircle className="mx-auto mb-4 text-green-600" size={40} />
        <h2 className="text-lg font-bold mb-2">Deleted Successfully!</h2>
        <button
          onClick={() => setIsDeleteSuccessOpen(false)}
          className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
        >
          OK
        </button>
      </div>
    </motion.div>
  )}
</AnimatePresence>

{/* Edit Success Popup ✅ */}
<AnimatePresence>
        {isEditSuccessOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-green-100 p-6 rounded-lg shadow-lg w-80 text-center">
              <CheckCircle className="mx-auto mb-4 text-green-600" size={40} />
              <h2 className="text-lg font-bold mb-2">Updated Successfully!</h2>
              <button
                onClick={() => setIsEditSuccessOpen(false)}
                className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
              >
                OK
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Menus;
