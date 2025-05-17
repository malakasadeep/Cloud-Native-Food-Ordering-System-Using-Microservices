import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import HomeContainer from "./HomeContainer";
import RowContainer from "./RowContainer";
import MenuContainer from "./MenuContainer";
import CartContainer from "./CartContainer";
import RestaurantCard from "../molecules/RestaurantCard";
import partnerService from "../../../features/partnersManagement/services/partnerServices";

const MainContainer = () => {
  const [scrollValue, setScrollValue] = useState(0);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await partnerService.getAllRestaurants();
        if (response.success) {
          // Filter restaurants that are available
          const availableRestaurants = response.data.filter(
            (restaurant) => restaurant.restaurant?.availability
          );
          setRestaurants(availableRestaurants);
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
    const container = document.querySelector(".restaurant-container");
    if (container) {
      container.scrollLeft += scrollValue;
    }
  }, [scrollValue]);
  
  return (
    <div className="w-full h-auto flex flex-col items-center justify-center">
      <HomeContainer />

      <section className="w-full my-6">
        <div className="w-full flex items-center justify-between">
          <p className="text-2xl font-semibold capitalize text-headingColor relative before:absolute before:rounded-lg before:content before:w-32 before:h-1 before:-bottom-2 before:left-0 before:bg-gradient-to-tr from-orange-400 to-orange-600 transition-all ease-in-out duration-100">
            Top Rated Restaurants
          </p>

          <div className="hidden md:flex gap-3 items-center">
            <motion.div
              whileTap={{ scale: 0.75 }}
              className="w-8 h-8 rounded-lg bg-orange-300 hover:bg-orange-500 cursor-pointer hover:shadow-lg flex items-center justify-center"
              onClick={() => setScrollValue(-200)}
            >
              <MdChevronLeft className="text-lg text-white" />
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.75 }}
              className="w-8 h-8 rounded-lg bg-orange-300 hover:bg-orange-500 cursor-pointer transition-all duration-100 ease-in-out hover:shadow-lg flex items-center justify-center"
              onClick={() => setScrollValue(200)}
            >
              <MdChevronRight className="text-lg text-white" />
            </motion.div>
          </div>
        </div>
        
        {/* Restaurant Container */}
        <div className="w-full flex items-center gap-3 my-12 scroll-smooth overflow-x-scroll scrollbar-none restaurant-container">
          {loading ? (
            <p className="text-center w-full">Loading restaurants...</p>
          ) : restaurants && restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))
          ) : (
            <p className="text-center w-full">No restaurants available</p>
          )}
        </div>
      </section>

      <MenuContainer />

      {/* CartContainer visibility is controlled by CartContext */}
      <CartContainer />
    </div>
  );
};

export default MainContainer;
