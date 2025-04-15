import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OtpInput = ({ onComplete, isLoading, error, setError }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); 
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };
  
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();

    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs[5].current.focus();
    }
  };
  
 
  useEffect(() => {
    if (error && setError) {
     
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  useEffect(() => {
  
    if (otp.some(digit => digit !== '') && error && setError) {
      setError(null);
    }
  }, [otp, error, setError]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
    >

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-16 left-0 right-0 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md mx-auto max-w-sm z-50 text-center"
          >
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md mx-auto px-8 pt-8 pb-6 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-headingColor">Enter Verification Code</h3>
          <p className="text-sm text-textColor mt-1">We've sent a 6-digit code to your email</p>
        </div>
        
        <div className="flex justify-center flex-wrap gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : null}
              className={`w-10 h-12 border-2 rounded-md text-center text-xl font-bold focus:border-cartNumBg focus:ring-1 focus:ring-cartNumBg ${
                error ? 'border-red-500 animate-shake' : ''
              }`}
              disabled={isLoading}
              maxLength={1}
              autoFocus={index === 0}
            />
          ))}
        </div>
        
        {/* Optional inline error message */}
        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
        
        <div className="mt-4 text-center">
          <button
            className="px-6 py-2 bg-cartNumBg text-white rounded-full font-medium hover:bg-orange-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
            disabled={otp.some(digit => digit === '') || isLoading}
            onClick={() => onComplete(otp.join(''))}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OtpInput;
