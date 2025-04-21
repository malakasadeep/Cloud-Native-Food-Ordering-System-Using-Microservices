import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'react-lottie';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { login } from '../actions/partnerActions';
import LoginForm from '../../../core/components/organisms/Partners/LoginForm';

// Import a food delivery animation - you'll need to add this file to your project
import deliveryAnimation from '../../../assets/lottie/del.json'; // Add this animation file

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Lottie animation options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: deliveryAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // Handle login form submission
  const handleLogin = async (formData) => {
    setLoading(true);
    
    try {
      const result = await dispatch(login(formData, navigate));
      
      if (result.success) {
        toast.success('Login successful! Redirecting...', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        // Navigation is handled in the login action
      } else {
        toast.error(result.message || 'Login failed. Please check your credentials.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Add Toast Container */}
      <ToastContainer />
      
      {/* Left side - Info and Animation */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="lg:w-1/3 flex flex-col items-center justify-between bg-gradient-to-tr to-red-700 from-orange-200 text-white pt-8"
      >
        <div className="w-full max-w-md text-center">
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">
            Food Express Partners
          </h1>
          <p className="text-lg mb-8 opacity-90">
            Manage your business efficiently and grow with our platform
          </p>
          
          {/* Common description - Moved up */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 bg-white bg-opacity-20 p-5 rounded-xl"
          >
            <p>Access your account to manage orders, track deliveries, and grow your business with our platform.</p>
          </motion.div>
        </div>
        
        {/* Animation - Now at bottom */}
        <div className="w-full mt-auto">
          <Lottie 
            options={defaultOptions} 
            height={280}
            width="100%" 
            className="mx-auto"
          />
        </div>
      </motion.div>
      
      {/* Right side - Login Form */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="lg:w-2/3 flex items-center justify-center p-6 lg:p-12 bg-gray-50"
      >
        <div className="w-full max-w-md">
          <LoginForm 
            onSubmit={handleLogin} 
            title="Partner Login"
            isLoading={loading}
          />
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Need help? <a href="#" className="text-red-500 hover:underline">Contact support</a></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
