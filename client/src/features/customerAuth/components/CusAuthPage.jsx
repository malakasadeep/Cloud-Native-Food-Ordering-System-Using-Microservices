import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'react-lottie';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CustomerAuthForm from '../../../core/components/organisms/Customer/CusromerAuthForm';
import OtpInput from '../../../core/components/atoms/OtpInput/OtpInput';
import foodDeliveryAnimation from '../../../assets/lottie/cus.json'; 
import { sendEmailOtp, verifyEmailOtp } from '../actions/customerAction';
import { toast } from 'react-toastify';

const CusAuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Lottie animation options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: foodDeliveryAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const handleEmailSubmit = async (email) => {
    setLoading(true);
    setUserEmail(email);
    
    try {
      const result = await dispatch(sendEmailOtp(email));
      
      if (result.success) {
        setIsOtpSent(true);
        toast.success("Verification code sent to your email");
      } else {
        toast.error(result.message || "Failed to send verification code");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp) => {
    setVerifyLoading(true);
    
    try {
      const result = await dispatch(verifyEmailOtp({email: userEmail, otp}, navigate));
      
      if (result.success) {
        toast.success("Email verified successfully!");
        // Navigation to home is handled in the action
      } else {
        toast.error(result.message || "Invalid verification code");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
      console.error(error);
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none bg-gradient-to-br from-orange-50 to-red-50">
        <motion.div 
          className="absolute top-0 left-0 w-96 h-96 bg-red-200 rounded-full filter blur-3xl opacity-20"
          animate={{
            x: [0, 30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full filter blur-3xl opacity-20"
          animate={{
            x: [0, -30, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-200 rounded-full filter blur-3xl opacity-10"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      {/* Main content container */}
      <div className="flex-grow flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto relative z-10">
        
        {/* Left column - Content and Animation (now first on all screen sizes) */}
        <motion.div 
          className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0 text-center lg:text-left order-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-headingColor mb-6">
            <span className="block">Delicious Food</span>
            <span className="block mt-2 text-cartNumBg">Delivered to You</span>
          </h1>
          
          <p className="text-lg text-textColor mb-8 max-w-lg mx-auto lg:mx-0">
            Discover the fastest and easiest way to get your favorite meals delivered right to your doorstep. Login now to explore thousands of restaurants!
          </p>

          {/* Lottie Animation - Hidden on mobile, visible on sm screens and up */}
          <div className="w-full max-w-md mx-auto hidden sm:block lg:mx-0">
            <Lottie 
              options={defaultOptions}
              height={240}
              width="100%"
            />
          </div>
        </motion.div>
        
        {/* Right column - Auth Form or OTP Input */}
        <div className="lg:w-1/2 w-full max-w-md lg:max-w-none order-2">
          {isOtpSent ? (
            <OtpInput 
              onComplete={handleVerifyOtp} 
              isLoading={verifyLoading} 
            />
          ) : (
            <CustomerAuthForm 
              onEmailSubmit={handleEmailSubmit}
              isLoading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CusAuthPage;
