import React, { useState, useEffect } from "react";
import { MdShoppingBasket } from "react-icons/md";
import { motion } from "framer-motion";
import Logo from "../../assets/img/logo.png";
import { Link } from "react-router-dom";
import { User, Store } from "lucide-react"; // Import Lucide React icons
import { useCart } from "../utils/CartContext";

const Header = () => {
  const [cartItems, setCartItems] = useState([]);
  const { toggleCart } = useCart();

  useEffect(() => {
    // Get cart items from localStorage
    const storedCartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
    setCartItems(storedCartItems);
  }, []);

  // Listen for cart updates
  useEffect(() => {
    const updateCartItems = () => {
      const items = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
      setCartItems(items);
    };

    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartItems);
    
    // Initial load
    updateCartItems();
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartItems);
    };
  }, []);

  // Handlers for new buttons
  const handleSignIn = () => {
    console.log("Sign In clicked");
    // Add sign in logic here
  };

  const handleBecomeSeller = () => {
    console.log("Become a Seller clicked");
    // Add become a seller logic here
  };

  return (
    <header className="fixed z-50 w-screen p-3 px-4 md:p-6 md:px-16 bg-primary">
      {/* desktop & tablet */}
      <div className="hidden md:flex w-full h-full items-center justify-between">
        <Link to={"/"} className="flex items-center gap-2">
          <img src={Logo} className="w-8 object-cover" alt="logo" />
          <p className="text-headingColor text-xl font-bold"> City</p>
        </Link>

        <div className="flex items-center gap-8">
          <motion.ul
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            className="flex items-center gap-24 "
          >
            <li className="text-lg text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer">
              Home
            </li>
            <li className="text-lg text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer">
              Menu
            </li>
            <li className="text-lg text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer">
              About Us
            </li>
            <li className="text-lg text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer">
              Service
            </li>
          </motion.ul>

          <div className="relative flex items-center justify-center">
            <motion.div
              whileTap={{ scale: 0.6 }}
              className="w-10 h-10 rounded-full bg-orange-300 flex items-center justify-center cursor-pointer hover:shadow-md"
              onClick={toggleCart}
            >
              <MdShoppingBasket className="text-white text-xl" />
              {cartItems && cartItems.length > 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-cartNumBg flex items-center justify-center">
                  <p className="text-xs text-white font-semibold">
                    {cartItems.length}
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* New Sign In Button with animation */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-transparent border border-headingColor text-headingColor hover:bg-headingColor hover:text-white transition-all duration-300 ease-in-out"
            onClick={handleSignIn}
          >
            <User size={18} strokeWidth={2} />
            <span>Sign In</span>
          </motion.button>

          {/* Become a Seller Button with animation */}
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(40, 40, 40, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-transparent to-transparent border border-orange-500 text-orange-500 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 transition-all duration-300 ease-in-out"
            onClick={handleBecomeSeller}
          >
            <Store size={18} strokeWidth={2} />
            <span>Become a Seller</span>
          </motion.button>
        </div>
      </div>

      {/* mobile */}
      <div className="flex items-center justify-between md:hidden w-full h-full">
        <div className="relative flex items-center justify-center">
          <motion.div
            whileTap={{ scale: 0.6 }}
            className="w-8 h-8 rounded-full bg-orange-300 flex items-center justify-center cursor-pointer hover:shadow-md"
            onClick={toggleCart}
          >
            <MdShoppingBasket className="text-white text-xl" />
            {cartItems && cartItems.length > 0 && (
              <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-cartNumBg flex items-center justify-center">
                <p className="text-xs text-white font-semibold">
                  {cartItems.length}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        <Link to={"/"} className="flex items-center gap-2">
          <img src={Logo} className="w-8 object-cover" alt="logo" />
          <p className="text-headingColor text-xl font-bold"> City</p>
        </Link>

        <div className="flex items-center gap-2">
          {/* Mobile Sign In Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="flex items-center p-2 rounded-full bg-transparent border border-headingColor text-headingColor"
            onClick={handleSignIn}
          >
            <User size={16} strokeWidth={2} />
          </motion.button>

          {/* Mobile Become a Seller Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="flex items-center p-2 rounded-full bg-transparent border border-orange-500 text-orange-500"
            onClick={handleBecomeSeller}
          >
            <Store size={16} strokeWidth={2} />
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;
