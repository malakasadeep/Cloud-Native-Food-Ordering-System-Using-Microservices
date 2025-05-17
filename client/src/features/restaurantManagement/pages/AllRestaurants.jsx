import React, { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import Header from "../../../core/components/organisms/Header";
import RestaurantCard from "../../../core/components/molecules/RestaurantCard";
import partnerService from "../../partnersManagement/services/partnerServices";

const AllRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await partnerService.getAllRestaurants();
        if (response.success) {
          const availableRestaurants = response.data.filter(
            (restaurant) => restaurant.restaurant?.availability
          );
          setRestaurants(availableRestaurants);
          setFilteredRestaurants(availableRestaurants);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    // Filter restaurants based on search term
    if (searchTerm.trim() === "") {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter(
        restaurant => {
          const restaurantName = restaurant.restaurant?.name || "";
          const cuisineType = restaurant.restaurant?.cuisineType || "";
          
          return restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 cuisineType.toLowerCase().includes(searchTerm.toLowerCase());
        }
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchTerm, restaurants]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="w-full h-auto min-h-screen flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="w-full flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-headingColor">
            All Restaurants
          </h2>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md w-full max-w-xs">
            <MdSearch className="text-xl text-gray-500" />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full outline-none border-none text-textColor"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading restaurants...</p>
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p>No restaurants found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRestaurants;
