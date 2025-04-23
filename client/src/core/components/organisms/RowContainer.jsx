import React, { useRef, useEffect, useState } from "react";
import NotFound from "../../../assets/img/NotFound.svg";
import FoodCard from "../molecules/FoodCard";
import menuService from "../../../features/restaurentManageent/services/menuservice";

const RowContainer = ({ flag, scrollValue, filter }) => {
  const rowContainer = useRef();
  const [items, setItems] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodItems = async () => {
      setLoading(true);
      try {
        const response = await menuService.getAllMenus();
        if (response.success) {
          setFoodItems(response.data);
        } else {
          console.error("Failed to fetch menu items:", response.message);
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  // Filter food items when either foodItems or filter changes
  useEffect(() => {
    if (filter && foodItems.length > 0) {
      if (filter.toLowerCase() === "all") {
        // If filter is "All", show all food items
        setFilteredItems(foodItems);
      } else {
        // Otherwise filter by category
        const filtered = foodItems.filter(
          (item) => item && item.categoryName && item.categoryName.toLowerCase() === filter.toLowerCase()
        );
        setFilteredItems(filtered);
      }
    } else {
      setFilteredItems(foodItems);
    }
  }, [foodItems, filter]);

  useEffect(() => {
    const cartItems = localStorage.getItem('cartItems') 
      ? JSON.parse(localStorage.getItem('cartItems')) 
      : [];
    setItems(cartItems);
  }, []);

  const addToCart = (item) => {
    const cartItems = localStorage.getItem('cartItems') 
      ? JSON.parse(localStorage.getItem('cartItems')) 
      : [];

    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item._id);
    
    let updatedItems;
    if (existingItemIndex !== -1) {
      updatedItems = [...cartItems];
      updatedItems[existingItemIndex].qty += 1;
    } else {
      updatedItems = [...cartItems, { ...item, qty: 1 }];
    }

    localStorage.setItem("cartItems", JSON.stringify(updatedItems));

    setItems(updatedItems);
    
    // Dispatch event to notify other components about cart updates
    window.dispatchEvent(new Event('cartUpdated'));
    
    console.log("Added to cart:", item.title);
  };

  return (
    <div
      ref={rowContainer}
      className={`w-full flex items-center gap-3  my-12 scroll-smooth  ${
        flag
          ? "overflow-x-scroll scrollbar-none"
          : "overflow-x-hidden flex-wrap justify-center"
      }`}
    >
      {loading ? (
        <p className="text-xl text-headingColor font-semibold my-2">Loading...</p>
      ) : filteredItems && filteredItems.length > 0 ? (
        filteredItems.map((item) => (
          <FoodCard key={item?._id} item={item} addToCart={addToCart} />
        ))
      ) : (
        <div className="w-full flex flex-col items-center justify-center">
          <img src={NotFound} className="h-340" alt="Not Found" />
          <p className="text-xl text-headingColor font-semibold my-2">
            Items Not Available
          </p>
        </div>
      )}
    </div>
  );
};

export default RowContainer;
