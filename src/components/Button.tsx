import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'number' | 'operator' | 'function' | 'memory' | 'special';
  className?: string;
  disabled?: boolean;
  size?: 'normal' | 'wide' | 'tall';
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'number',
  className = '',
  disabled = false,
  size = 'normal'
}) => {
  const baseClasses = "h-12 rounded-xl font-semibold transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border";
  
  const variantClasses = {
    number: "bg-gray-800/90 hover:bg-gray-700/90 text-white shadow-lg hover:shadow-xl border-gray-600/50 hover:border-gray-500/50",
    operator: "bg-orange-600/90 hover:bg-orange-500/90 text-white shadow-lg hover:shadow-xl border-orange-500/50 hover:border-orange-400/50",
    function: "bg-blue-600/90 hover:bg-blue-500/90 text-white shadow-lg hover:shadow-xl border-blue-500/50 hover:border-blue-400/50",
    memory: "bg-amber-600/90 hover:bg-amber-500/90 text-white shadow-lg hover:shadow-xl border-amber-500/50 hover:border-amber-400/50",
    special: "bg-purple-600/90 hover:bg-purple-500/90 text-white shadow-lg hover:shadow-xl border-purple-500/50 hover:border-purple-400/50"
  };

  const sizeClasses = {
    normal: "col-span-1",
    wide: "col-span-2",
    tall: "row-span-2"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;