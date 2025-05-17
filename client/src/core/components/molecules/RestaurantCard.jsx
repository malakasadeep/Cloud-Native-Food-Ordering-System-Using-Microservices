import React from "react";
import { MdStar, MdLocationPin } from "react-icons/md";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  // Generate random rating between 3.5 and 5.0
  const rating = (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);
  
  // Check restaurant availability
  const isAvailable = restaurant?.restaurant?.availability !== false;
  
  // Create a wrapper component based on availability
  const CardWrapper = ({ children }) => {
    if (isAvailable) {
      return (
        <Link 
          to={`/restaurant-details/${restaurant._id}`}
          className="w-275 h-[220px] min-w-[275px] md:w-300 md:min-w-[300px] bg-cardOverlay rounded-lg p-2 my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col cursor-pointer transition-all duration-200 relative"
        >
          {children}
        </Link>
      );
    }
    
    return (
      <div className="w-275 h-[220px] min-w-[275px] md:w-300 md:min-w-[300px] bg-cardOverlay rounded-lg p-2 my-12 backdrop-blur-lg flex flex-col cursor-not-allowed transition-all duration-200 relative">
        {children}
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center group">
          <div className="bg-red-600 text-white px-3 py-1 rounded-md font-medium">
            Closed
          </div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-black bg-opacity-70 rounded-lg transition-all duration-200">
            <p className="text-white font-medium text-center px-4">
              Restaurant is currently closed
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <CardWrapper>
      <div className="w-full h-32 overflow-hidden rounded-lg">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={restaurant?.restaurant?.coverImageURL || "https://via.placeholder.com/300x150?text=Restaurant"}
          alt={restaurant?.restaurant?.name || "Restaurant"}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full flex flex-col items-start p-2">
        <p className="text-headingColor font-bold text-lg line-clamp-1">
          {restaurant?.restaurant?.name || "Restaurant Name"}
        </p>
        
        <div className="flex items-center gap-1 mt-1">
          <MdLocationPin className="text-red-500" />
          <p className="text-sm text-textColor line-clamp-1">
            {restaurant?.restaurant?.address || "Restaurant Address"}
          </p>
        </div>
        
        <div className="flex items-center justify-between w-full mt-2">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded">
              <p className="text-sm font-semibold text-green-700">{rating}</p>
              <MdStar className="text-yellow-500" />
            </div>
            <p className="text-xs text-gray-500">(25+ ratings)</p>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="bg-gradient-to-br from-red-500 to-orange-500 px-3 py-1 rounded-full text-white text-xs"
          >
            View Menu
          </motion.button>
        </div>
      </div>
    </CardWrapper>
  );
};

export default RestaurantCard;
