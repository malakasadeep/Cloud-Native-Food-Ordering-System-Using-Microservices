import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'react-lottie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

import RegistrationForm from '../../../core/components/organisms/Partners/RegistrationForm';
import partnerService from '../services/partnerServices';

import deliveryAnimation from '../../../assets/lottie/del.json';

const RegistrationPage = () => {
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: deliveryAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const handleRegistration = async (formData) => {
    setLoading(true);
    
    try {
      // Transform form data to match backend schema
      const userData = {
        email: formData.personalDetails.email,
        role: formData.userType === 'restaurant' ? 'restaurant_owner' : 'delivery_rider',
        firstname: formData.personalDetails.firstName,
        lasttname: formData.personalDetails.lastName, 
        mobile: `${formData.personalDetails.countryCode}${formData.personalDetails.mobile}`,
        nic: formData.personalDetails.nic,
      };

      // Add role-specific fields
      if (formData.userType === 'restaurant') {
        userData.restaurant = {
          name: formData.restaurantDetails.name,
          address: formData.restaurantDetails.address,
          city: formData.restaurantDetails.city,
          location: {
            lat: formData.location.latitude,
            lng: formData.location.longitude
          },
          openingTime: formData.restaurantDetails.openingTime,
          closingTime: formData.restaurantDetails.closingTime,
          coverImageURL: formData.restaurantDetails.coverImageURL
        };
      } else if (formData.userType === 'rider') {
        userData.vehicleType = formData.riderDetails.vehicleType;
        userData.vehicleNo = formData.riderDetails.vehicleNumber;
        userData.licenseImageURL = formData.riderDetails.licenseImageURL;
        userData.currentLocation = {
          lat: formData.location.latitude,
          lng: formData.location.longitude
        };
      }
      
      console.log('Submitting user data to backend:', userData);
      
      // Call the partner service register function
      const response = await partnerService.register(userData);
      
      if (response.success) {
        // Show modal instead of just a toast
        setShowSuccessModal(true);
        
        // Still show toast for additional notification
        toast.success('Registration submitted successfully!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(response.message || 'Registration failed. Please try again.', {
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
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Success Modal Component
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Thank You for Registering!</h3>
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">
              Your request has been submitted successfully.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Our admin team will validate your details, and once approved, 
              you will receive your login password via email.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-red-600 text-white text-base font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              OK
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
     
      <ToastContainer />
      
      {/* Show success modal if registration is successful */}
      {showSuccessModal && <SuccessModal />}
      
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="lg:w-1/3 flex flex-col items-center justify-between bg-gradient-to-tr to-red-700 from-orange-200 text-white pt-8"
      >
        <div className="w-full max-w-md text-center px-4">
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">
            Join Food Express
          </h1>
          <p className="text-lg mb-8 opacity-90">
            Partner with us to grow your business or start your journey as a delivery rider
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 bg-white bg-opacity-20 p-5 rounded-xl"
          >
            <p>Register your restaurant or sign up as a delivery partner to access our platform's features and reach more customers.</p>
          </motion.div>
          
          <div className="mt-6">
            <p className="text-white text-opacity-90">Already have an account?</p>
            <Link 
              to="/login" 
              className="inline-block mt-2 px-6 py-2 bg-white text-red-600 font-medium rounded-md hover:bg-gray-100 transition-colors duration-300"
            >
              Login Here
            </Link>
          </div>
        </div>
        
     
        <div className="w-full mt-auto">
          <Lottie 
            options={defaultOptions} 
            height={280}
            width="100%" 
            className="mx-auto"
          />
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="lg:w-2/3 flex items-center justify-center p-4 lg:p-6 bg-gray-50 overflow-y-auto max-h-screen"
      >
        <div className="w-full py-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Partner Registration</h2>
          <RegistrationForm onSubmit={handleRegistration} isLoading={loading} />
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationPage;
