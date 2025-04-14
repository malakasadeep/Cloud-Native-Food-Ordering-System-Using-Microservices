import React, { useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import { motion } from "framer-motion";

const CartItem = ({ item, setFlag, flag }) => {
  const [qty, setQty] = useState(item.qty);

  const updateQty = (action, id) => {
    // Get current cart items
    const cartItems = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];
      
    if (action === "add") {
      setQty(qty + 1);
      
      // Update quantity in cart
      const updatedCartItems = cartItems.map(cartItem => {
        if (cartItem.id === id) {
          return { ...cartItem, qty: cartItem.qty + 1 };
        }
        return cartItem;
      });
      
      // Save to local storage
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      setFlag(flag + 1);
      
    } else {
      if (qty === 1) {
        // Remove item from cart
        const filteredItems = cartItems.filter(cartItem => cartItem.id !== id);
        localStorage.setItem("cartItems", JSON.stringify(filteredItems));
        setFlag(flag + 1);
        
      } else {
        setQty(qty - 1);
        
        // Decrease quantity in cart
        const updatedCartItems = cartItems.map(cartItem => {
          if (cartItem.id === id) {
            return { ...cartItem, qty: cartItem.qty - 1 };
          }
          return cartItem;
        });
        
        // Save to local storage
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        setFlag(flag + 1);
      }
    }
    
    // Notify other components that cart has been updated
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className="w-full p-1 px-2 rounded-lg bg-cartItem flex items-center gap-2">
      <img
        src={item?.imageURL}
        className="w-20 h-20 max-w-[60px] rounded-full object-contain"
        alt=""
      />

      {/* name section */}
      <div className="flex flex-col gap-2">
        <p className="text-base text-gray-50">{item?.title}</p>
        <p className="text-sm block text-gray-300 font-semibold">
          $ {parseFloat(item?.price) * qty}
        </p>
      </div>

      {/* button section */}
      <div className="group flex items-center gap-2 ml-auto cursor-pointer">
        <motion.div
          whileTap={{ scale: 0.75 }}
          onClick={() => updateQty("remove", item?.id)}
        >
          <BiMinus className="text-gray-50 " />
        </motion.div>

        <p className="w-5 h-5 rounded-sm bg-cartBg text-gray-50 flex items-center justify-center">
          {qty}
        </p>

        <motion.div
          whileTap={{ scale: 0.75 }}
          onClick={() => updateQty("add", item?.id)}
        >
          <BiPlus className="text-gray-50 " />
        </motion.div>
      </div>
    </div>
  );
};

export default CartItem;
