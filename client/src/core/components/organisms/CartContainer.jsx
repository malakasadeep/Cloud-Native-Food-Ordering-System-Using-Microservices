import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { RiRefreshFill } from "react-icons/ri";
import { motion } from "framer-motion";
import EmptyCart from "../../../assets/img/emptyCart.svg";
import CartItem from "./../molecules/CartItem";
import { useCart } from "../../contexts/CartContext";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import orderService from "../../../features/restaurentManageent/services/orderservice";

const stripePromise = loadStripe(
  "pk_test_51RD6tEGd3xGfzgsURpAHakH87YSP2ed1ncxqHAWGJVLfPT5uMXNks1BvvRDRwZG18xu03dSQv8PPZP1FBTiONntb00ns5UWWHU"
);

const CartContainer = () => {
  const { isCartOpen, toggleCart } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [flag, setFlag] = useState(1);
  const [tot, setTot] = useState(0);
  const { user } = useSelector((state) => state.auth);

  // Load initial cart items and user
  useEffect(() => {
    const items = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];
    setCartItems(items);
  }, []);

  // Listen for cart updates from other components
  useEffect(() => {
    const updateCartItems = () => {
      const items = localStorage.getItem("cartItems")
        ? JSON.parse(localStorage.getItem("cartItems"))
        : [];
      setCartItems(items);
    };

    // Listen for cart updates
    window.addEventListener("cartUpdated", updateCartItems);

    return () => {
      window.removeEventListener("cartUpdated", updateCartItems);
    };
  }, []);

  // Calculate total price
  useEffect(() => {
    const totalPrice = cartItems.reduce(
      (acc, item) => acc + item.qty * item.price,
      0
    );
    setTot(totalPrice);
  }, [cartItems, flag]);

  // Clear all items from cart
  const clearCart = () => {
    localStorage.setItem("cartItems", JSON.stringify([]));
    setCartItems([]);

    // Dispatch event to notify other components
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Update cart items when flag changes (triggered by CartItem component)
  useEffect(() => {
    const items = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];
    setCartItems(items);
  }, [flag]);

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    // Send cart items to backend
    const response = await axios.post(
      "http://localhost:80/api/orders/api/v1/orders/create-checkout-session",
      { cartItems, deliveryAddress: user?.address || "No address found" }
    );

    // Redirect user to Stripe Checkout page
    const result = await stripe.redirectToCheckout({
      sessionId: response.data.id,
    });

    if (result.error) {
      alert(result.error.message);
    }
  };

  // Using isCartOpen from context for visibility
  return (
    <motion.div
      initial={{ opacity: 0, x: 200 }}
      animate={{
        opacity: isCartOpen ? 1 : 0,
        x: isCartOpen ? 0 : 200,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 right-0 w-full md:w-375 h-screen bg-white drop-shadow-md flex flex-col z-[101] ${
        isCartOpen ? "visible" : "invisible"
      }`}
    >
      <div className="w-full flex items-center justify-between p-4 cursor-pointer">
        <motion.div whileTap={{ scale: 0.75 }} onClick={toggleCart}>
          <MdOutlineKeyboardBackspace className="text-textColor text-3xl" />
        </motion.div>
        <p className="text-textColor text-lg font-semibold">Cart</p>

        <motion.p
          whileTap={{ scale: 0.75 }}
          className="flex items-center gap-2 p-1 px-2 my-2 bg-gray-100 rounded-md hover:shadow-md cursor-pointer text-textColor text-base"
          onClick={clearCart}
        >
          Clear <RiRefreshFill />
        </motion.p>
      </div>

      {/* bottom section */}
      {cartItems && cartItems.length > 0 ? (
        <div className="w-full h-full bg-cartBg rounded-t-[2rem] flex flex-col">
          {/* cart Items section */}
          <div className="w-full h-340 md:h-42 px-6 py-10 flex flex-col gap-3 overflow-y-scroll scrollbar-none">
            {/* cart Item */}
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                setFlag={setFlag}
                flag={flag}
              />
            ))}
          </div>

          {/* cart total section */}
          <div className="w-full flex-1 bg-cartTotal rounded-t-[2rem] flex flex-col items-center justify-evenly px-8 py-2">
            <div className="w-full flex items-center justify-between">
              <p className="text-gray-400 text-lg">Sub Total</p>
              <p className="text-gray-400 text-lg">Rs. {tot}</p>
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="text-gray-400 text-lg">Delivery</p>
              <p className="text-gray-400 text-lg">Rs. 250</p>
            </div>

            <div className="w-full border-b border-gray-600 my-2"></div>

            <div className="w-full flex items-center justify-between">
              <p className="text-gray-200 text-xl font-semibold">Total</p>
              <p className="text-gray-200 text-xl font-semibold">
                Rs.{tot + 250}
              </p>
            </div>

            {user ? (
              <motion.button
                whileTap={{ scale: 0.8 }}
                type="button"
                className="w-full p-2 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 text-gray-50 text-lg my-2 hover:shadow-lg"
                onClick={handleCheckout} //Navigate to checkout page
              >
                Check Out
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.8 }}
                type="button"
                className="w-full p-2 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 text-gray-50 text-lg my-2 hover:shadow-lg"
              >
                <Link to={"/customer-auth"}>Login to check out</Link>
              </motion.button>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6">
          <img src={EmptyCart} className="w-300" alt="" />
          <p className="text-xl text-textColor font-semibold">
            Add some items to your cart
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default CartContainer;
