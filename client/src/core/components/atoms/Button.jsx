import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = "button", 
  disabled = false,
  variant = "primary", // primary, secondary, outline, google
  className = "",
  fullWidth = false,
  icon: Icon = null
}) => {
  
  const baseStyles = "flex items-center justify-center gap-2 rounded-full py-3 font-medium transition-all duration-300 ease-in-out";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-cartNumBg to-red-500 text-white hover:shadow-lg hover:shadow-red-300/40",
    secondary: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-300/40",
    outline: "border-2 border-gray-300 text-textColor hover:bg-gray-100",
    google: "bg-white border border-gray-300 text-textColor hover:bg-gray-50 shadow-md"
  };
  
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};

export default Button;
