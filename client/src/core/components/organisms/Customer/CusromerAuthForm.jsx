import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, ChevronRight, User, Lock, AlertCircle, Chrome, Check } from 'lucide-react';

// Import atom components
import TextField from '../../atoms/TextField';
import Button from '../../atoms/Button';
import CountryCodeSelector from '../../atoms/CountryCodeSelector';

const CustomerAuthForm = ({ onEmailSubmit, isLoading }) => {
  const [authType, setAuthType] = useState(() => {
    // Try to get the last used auth type from localStorage
    return localStorage.getItem('preferredAuthType') || 'mobile';
  });
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+94');
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [internalLoading, setInternalLoading] = useState(false); // Added internal loading state

  // Save preferred auth type to localStorage
  useEffect(() => {
    localStorage.setItem('preferredAuthType', authType);
  }, [authType]);

  // Validate form inputs
  const validateInputs = () => {
    const newErrors = {};

    if (authType === 'mobile') {
      if (!mobileNumber) {
        newErrors.mobile = 'Mobile number is required';
      } else if (!/^\d{9,10}$/.test(mobileNumber)) {
        newErrors.mobile = 'Please enter a valid mobile number';
      }
    } else {
      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    
    if (!validateInputs()) return;

    setInternalLoading(true); // Use internal loading state instead of setIsLoading
    
    try {
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form submitted:', { 
        authType,
        mobileNumber: authType === 'mobile' ? countryCode + mobileNumber : null,
        email: authType === 'email' ? email : null
      });
      
      setIsSubmitted(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setIsSubmitted(false);
        if (authType === 'mobile') {
          setMobileNumber('');
        } else {
          setEmail('');
        }
      }, 2000);
      
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ form: 'Authentication failed. Please try again.' });
    } finally {
      setInternalLoading(false); // Use internal loading state
    }
  };

  const toggleAuthType = (type) => {
    setAuthType(type);
    setErrors({});  // Clear errors when switching
  };

  // Format mobile number as user types
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 10);
    setMobileNumber(value);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    
    setEmailError('');
    onEmailSubmit(email);
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative header accent */}
      <div className="h-2 bg-gradient-to-r from-cartNumBg to-red-500"></div>
      
      <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-red-50 to-orange-50">
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            className="text-2xl font-bold text-headingColor mb-1"
            variants={itemVariants}
          >
            Welcome Back
          </motion.h2>
          
          <motion.p 
            className="text-lighttextGray mb-6"
            variants={itemVariants}
          >
            {authType === 'mobile' ? 'Enter your mobile number to continue' : 'Enter your email to continue'}
          </motion.p>

          {isSubmitted ? (
            <motion.div 
              className="flex flex-col items-center justify-center py-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-green-600 font-medium">Authentication successful!</p>
            </motion.div>
          ) : (
            <form onSubmit={authType === 'email' ? handleSubmit : handleContinue}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={authType}
                  initial={{ opacity: 0, x: authType === 'mobile' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: authType === 'mobile' ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {authType === 'mobile' ? (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <div className="w-24">
                          <CountryCodeSelector 
                            value={countryCode} 
                            onChange={setCountryCode} 
                          />
                        </div>
                        <TextField 
                          type="tel"
                          placeholder="Mobile Number"
                          icon={Phone}
                          value={mobileNumber}
                          onChange={handleMobileChange}
                          error={errors.mobile}
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full px-3 py-2 border ${
                            emailError ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-cartNumBg focus:border-cartNumBg`}
                          placeholder="your@email.com"
                          disabled={isLoading}
                        />
                        {emailError && (
                          <p className="mt-1 text-sm text-red-600">{emailError}</p>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {errors.form && (
                <motion.div 
                  className="mt-4 bg-red-50 p-3 rounded-lg flex items-start gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <p className="text-sm text-red-600">{errors.form}</p>
                </motion.div>
              )}

              <motion.div 
                className="mt-6"
                variants={itemVariants}
              >
                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth 
                  icon={ChevronRight}
                  disabled={isLoading || internalLoading} // Consider both loading states
                >
                  {isLoading || internalLoading ? 'Please wait...' : 'Continue'}
                </Button>
              </motion.div>
            </form>
          )}

          <motion.div 
            className="flex items-center my-6"
            variants={itemVariants}
          >
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </motion.div>

          <motion.div 
            className="space-y-3"
            variants={itemVariants}
          >
            <Button 
              variant="outline" 
              fullWidth 
              icon={authType === 'mobile' ? Mail : Phone}
              onClick={() => toggleAuthType(authType === 'mobile' ? 'email' : 'mobile')}
              className="hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              {authType === 'mobile' ? 'Login with Email' : 'Login with Mobile'}
            </Button>
            
            <Button 
              variant="google" 
              fullWidth 
              icon={Chrome}
              className="hover:shadow-md transition-shadow"
            >
              Continue with Google
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div 
        className="px-8 py-4 bg-gray-50 text-center"
        variants={itemVariants}
      >
        <p className="text-sm text-textColor">
          By continuing, you agree to our <a href="#" className="text-blue-500 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default CustomerAuthForm;
