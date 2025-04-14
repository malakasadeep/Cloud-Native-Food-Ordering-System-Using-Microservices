import React, { createContext, useState, useContext } from "react";

// Create a context for cart management
const CartContext = createContext();

// Custom provider component
export const CartProvider = ({ children }) => {
  // State to track if cart is open or closed
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Function to toggle cart visibility
  const toggleCart = () => {
    setIsCartOpen(prevState => !prevState);
  };
  
  // Values shared with consuming components
  const value = {
    isCartOpen,
    toggleCart,
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
