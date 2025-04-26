import React, { useState, useEffect, useRef } from "react";
import { MdShoppingBasket } from "react-icons/md";
import { motion } from "framer-motion";
import Logo from "../../../assets/img/logo.png";
import { Link } from "react-router-dom";
import { User, Store, LogOut, Menu as MenuIcon } from "lucide-react"; 
import { useCart } from "../../contexts/CartContext";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../features/customerAuth/actions/customerAction";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const { toggleCart } = useCart();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    
    const storedCartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
    setCartItems(storedCartItems);
  }, []);

  useEffect(() => {
    const updateCartItems = () => {
      const items = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
      setCartItems(items);
    };

    window.addEventListener('cartUpdated', updateCartItems);
    
    updateCartItems();
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartItems);
    };
  }, []);

  const handleSignIn = () => {
    navigate("/customer-auth");
  };

  const handleSignOut = () => {
    dispatch(logout(navigate));
    setIsUserMenuOpen(false);
  };

  const handleBecomeSeller = () => {
    console.log("Become a Seller clicked");
  };

  return (
    <header className="fixed z-50 w-screen p-3 px-4 md:p-6 md:px-16 bg-primary">
      {/* desktop & tablet */}
      <div className="hidden md:flex w-full h-full items-center justify-between">
        <Link to={"/"} className="flex items-center gap-2">
          <img src={Logo} className="w-8 object-cover" alt="logo" />
          <p className="text-headingColor text-xl font-bold"> YumExpress</p>
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
            <Link to={"/login"}>
            <li className="text-lg text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer">
              Become a Seller
            </li>
            </Link>
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

          {/* Conditional rendering based on authentication status */}
          {!isAuthenticated ? (
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(40, 40, 40, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-transparent to-transparent border border-orange-500 text-orange-500 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 transition-all duration-300 ease-in-out"
              onClick={handleSignIn}
            >
              <User size={18} strokeWidth={2} />
              <span>Sign In</span>
            </motion.button>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer overflow-hidden border-2 border-orange-500"
                //onClick={toggleUserMenu}
                onClick={handleSignOut}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="user profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-orange-300 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* User dropdown menu */}
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-12 right-0 bg-white shadow-xl rounded-lg py-2 min-w-[180px] z-50"
                  
                >
                  <ul>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                      <User size={16} strokeWidth={2} />
                      <span>Profile</span>
                    </li>
                    <li 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-red-500"
                      onClick={handleSignOut}
                    >
                      <LogOut size={16} strokeWidth={2} />
                      <span>Sign Out</span>
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* mobile */}
      <div className="flex items-center justify-between md:hidden w-full h-full">
        {/* Left: Menu button */}
        <div className="flex items-center">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="flex items-center p-2 rounded-full bg-transparent border border-headingColor text-headingColor"
            onClick={toggleMobileMenu}
          >
            <MenuIcon size={22} strokeWidth={2} />
          </motion.button>
          {/* Mobile menu dropdown */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-16 left-2 bg-white shadow-xl rounded-lg py-2 min-w-[160px] z-50"
            >
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Home</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Menu</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">About Us</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Become a Seller</li>
              </ul>
            </motion.div>
          )}
        </div>

        {/* Center: Logo */}
        <Link to={"/"} className="flex items-center gap-2">
          <img src={Logo} className="w-8 object-cover" alt="logo" />
          <p className="text-headingColor text-xl font-bold"> City</p>
        </Link>

        {/* Right: Cart and Profile */}
        <div className="flex items-center gap-2">
          {/* Cart button */}
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

          {/* Profile button */}
          {!isAuthenticated ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="flex items-center p-2 rounded-full bg-transparent border border-headingColor text-headingColor"
              onClick={handleSignIn}
            >
              <User size={16} strokeWidth={2} />
            </motion.button>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer overflow-hidden border-2 border-orange-500"
                onClick={toggleUserMenu}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="user profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-orange-300 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Mobile user dropdown menu */}
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-10 right-0 bg-white shadow-xl rounded-lg py-2 min-w-[150px] z-50"
                >
                  <ul>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                      <User size={14} strokeWidth={2} />
                      <span>Profile</span>
                    </li>
                    <li 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-red-500"
                      onClick={handleSignOut}
                    >
                      <LogOut size={14} strokeWidth={2} />
                      <span>Sign Out</span>
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
