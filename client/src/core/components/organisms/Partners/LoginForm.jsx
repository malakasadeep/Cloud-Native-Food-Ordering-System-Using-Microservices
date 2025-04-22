import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TextField from '../../atoms/TextField';
import Button from '../../atoms/Button';
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';

const LoginForm = ({ onSubmit, title = "Business Login" }) => {
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Validation state
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  // Touched fields tracking
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  // Form validity state
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    console.log('Input change:', e.target.name, e.target.value);
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched(prevTouched => ({
        ...prevTouched,
        [name]: true,
      }));
    }
  };

  // Handle field blur
  const handleBlur = (field) => {
    setTouched(prevTouched => ({
      ...prevTouched,
      [field]: true,
    }));
  };

  // Validate email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Validate password
  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  // Validate form on input change
  useEffect(() => {
    const emailError = touched.email ? validateEmail(formData.email) : errors.email;
    const passwordError = touched.password ? validatePassword(formData.password) : errors.password;
    
    setErrors({
      email: emailError,
      password: passwordError,
    });
    
    setIsFormValid(!emailError && !passwordError && formData.email && formData.password);
  }, [formData, touched]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation
    setTouched({
      email: true,
      password: true,
    });
    
    // Final validation check
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (!emailError && !passwordError) {
      console.log('Form submitted with:', formData);
      setIsLoading(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors({
        email: emailError,
        password: passwordError,
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-headingColor">{title}</h2>
        <p className="text-lighttextGray mt-2">Welcome back! Please sign in to continue</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Use direct input elements to debug if TextField has issues */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={() => handleBlur('email')}
              className="pl-10 py-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cartNumBg focus:border-cartNumBg"
              placeholder="Enter your email address"
              required
            />
          </div>
          {touched.email && errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={() => handleBlur('password')}
              className="pl-10 py-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cartNumBg focus:border-cartNumBg"
              placeholder="Enter your password"
              required
            />
          </div>
          {touched.password && errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-cartNumBg focus:ring-cartNumBg border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-textColor">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="text-cartNumBg hover:underline">
              Forgot your password?
            </a>
          </div>
        </div>
        
        <div className="pt-2">
          <Button 
            type="submit" 
            fullWidth 
            disabled={!isFormValid || isLoading}
            loading={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </div>
        
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-gray-300 w-full"></div>
          <p className="text-center text-sm text-gray-500 bg-white px-4 absolute">Or continue with</p>
        </div>
        
        <Button
          variant="google"
          fullWidth
          icon={FaGoogle}
          onClick={() => console.log("Google sign-in")}
          disabled={isLoading}
        >
          Sign in with Google
        </Button>
        
        <p className="text-center text-sm text-textColor mt-4">
          Don't have an account?{' '}
          <a href="#" className="text-cartNumBg hover:underline font-medium">
            Create Account
          </a>
        </p>
      </form>
    </motion.div>
  );
};

export default LoginForm;
