import React from 'react';

const Button = ({
  type = 'button',
  variant = 'primary',
  size = 'small',
  onClick,
  children,
  icon = null,
  className = '',
  disabled = false,
}) => {
  const baseStyles = 'rounded-lg flex items-center font-medium focus:outline-none transition-all duration-150 cursor-pointer';

  const variantStyles = {
    primary: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    secondary: 'bg-blue-500 hover:bg-blue-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    neutral: 'bg-gray-600 hover:bg-gray-800 text-white',
    ghost: 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700',
    
    none: '',
  };

  const sizeStyles = {
    small: 'text-xs px-3 py-1',
    medium: 'text-sm px-4 py-2',
    large: 'text-lg px-6 py-3',
  };
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const combinedClass = `${baseStyles} ${variantStyles[variant] || ''} ${sizeStyles[size] || ''} ${disabledStyles} ${className}`;

  return (
    <button
      type={type}
      className={combinedClass}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <i className={`mr-1 ${icon}`}></i>}
      {children}
    </button>
  );
};

export default Button;
