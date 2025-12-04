
import React from 'react';

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12", onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative flex items-center justify-center select-none cursor-pointer ${className}`}
    >
      <img 
        src="https://cdn-icons-png.flaticon.com/512/2996/2996962.png" // Replace with your actual logo URL
        alt="Azim National School Logo" 
        className="w-full h-full object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
};
