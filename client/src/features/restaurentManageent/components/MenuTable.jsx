import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Search,
  Info,
} from "lucide-react";
import menuService from "../services/menuservice";

const MenuTable = ({ restaurantId, onEdit, onDelete }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]); // Add state for categories

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch menu items
        const menuResponse = await menuService.getMenuByRestaurantId(
          restaurantId
        );
        if (menuResponse.success) {
          setMenuItems(menuResponse.data || []);
        } else {
          setError(menuResponse.message || "Failed to fetch menu items");
          return;
        }

        // Fetch categories
        const categoriesResponse = await menuService.getCategoryByRestaurantId(
          restaurantId
        );
        if (categoriesResponse.success) {
          // Check the response structure
          console.log("Categories response:", categoriesResponse);
          // Make sure we always set an array to categories
          const categoriesData = categoriesResponse.data || [];
          // If the data is not an array, handle accordingly
          setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } else {
          console.error(
            "Failed to fetch categories:",
            categoriesResponse.message
          );
          setCategories([]); // Ensure categories is always an array
        }
      } catch (err) {
        setError("An error occurred while fetching data");
        console.error(err);
        setCategories([]); // Ensure categories is always an array in case of error
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchData();
    }
  }, [restaurantId]);

  // Function to get category name from categoryId
  const getCategoryName = (categoryId) => {
    if (!Array.isArray(categories)) {
      console.error("Categories is not an array:", categories);
      return "Unknown Category";
    }

    const category = categories.find((cat) => cat && cat._id === categoryId);
    console.log("Category found:", category);

    return category ? category.categoryName : "Unknown Category";
  };

  // Handle availability toggle
  const handleAvailabilityToggle = async (id, currentStatus) => {
    // In a real application, you would update this in the backend
    // Here we're just updating the local state
    setMenuItems(
      menuItems.map((item) =>
        item._id === id ? { ...item, availability: !currentStatus } : item
      )
    );

    // Here you would make an API call to update the availability status
    // Example: await menuService.updateMenuAvailability(id, !currentStatus);
  };

  // Filtering based on search term
  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to prepare item for edit
  const handleEdit = (item) => {
    // Find the category information for this item
    const categoryData = categories.find((cat) => cat._id === item.categoryId);

    // Create a new object that includes both the menu item data and category info
    const enrichedItem = {
      ...item,
      categoryName: categoryData
        ? categoryData.categoryName
        : "Unknown Category",
    };

    // Pass the enriched item to the onEdit handler
    onEdit(enrichedItem);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-headingColor"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600">
        <p className="flex items-center">
          <Info className="mr-2" size={20} /> {error}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or description..."
            className="w-full px-4 py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-headingColor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-headingColor uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-headingColor uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-headingColor uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-headingColor uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-headingColor uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-headingColor uppercase tracking-wider">
                Availability
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-headingColor uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-12 w-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-headingColor font-medium">
                      {item.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-textColor max-w-xs truncate">
                      {item.description || "No description"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-headingColor font-medium">
                      ${item.price.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-textColor">
                      {item.categoryName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.availability}
                        onChange={() =>
                          handleAvailabilityToggle(item._id, item.availability)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cartNumBg"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-all"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(item._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-4 text-center text-sm text-textColor"
                >
                  No menu items found. Add some items to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredItems.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-textColor">
                Showing{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredItems.length)}
                </span>{" "}
                of <span className="font-medium">{filteredItems.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ${
                    currentPage === 1
                      ? "cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (number) =>
                      number === 1 ||
                      number === totalPages ||
                      (number >= currentPage - 1 && number <= currentPage + 1)
                  )
                  .map((number, index, array) => {
                    // Add ellipsis where needed
                    if (index > 0 && array[index - 1] !== number - 1) {
                      return (
                        <React.Fragment key={`ellipsis-${number}`}>
                          <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            ...
                          </span>
                          <button
                            onClick={() => paginate(number)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                              currentPage === number
                                ? "bg-headingColor text-white focus:z-20"
                                : "text-gray-900 hover:bg-gray-50"
                            }`}
                          >
                            {number}
                          </button>
                        </React.Fragment>
                      );
                    }
                    return (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                          currentPage === number
                            ? "bg-headingColor text-white focus:z-20"
                            : "text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {number}
                      </button>
                    );
                  })}

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ${
                    currentPage === totalPages
                      ? "cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuTable;
