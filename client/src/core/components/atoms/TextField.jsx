import React from 'react';
import { motion } from 'framer-motion';

const TextField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon: Icon = null,
  required = false,
  fullWidth = true,
  className = ""
}) => {
  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-textColor mb-1">
          {label} {required && <span className="text-cartNumBg">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        
        <motion.input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          whileFocus={{ scale: 1.01 }}
          className={`
            w-full rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} 
            py-3 px-4 text-textColor focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
            ${Icon ? 'pl-10' : ''}
            transition-all duration-200
          `}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default TextField;
