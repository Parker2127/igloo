import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`} data-testid="logo-igloo">
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Igloo dome with sketchy style */}
          <path
            d="M6 24 C6 24, 6 16, 16 12 C26 16, 26 24, 26 24 Z"
            stroke="hsl(120 25% 45%)"
            strokeWidth="2"
            fill="hsl(120 15% 85%)"
            strokeDasharray="1,1"
            opacity="0.9"
          />
          
          {/* Door entrance */}
          <path
            d="M12 24 L12 20 C12 18, 14 18, 16 18 C18 18, 20 18, 20 20 L20 24"
            stroke="hsl(120 25% 45%)"
            strokeWidth="2"
            fill="white"
            strokeDasharray="1,1"
          />
          
          {/* Building blocks sketch lines */}
          <path
            d="M8 20 L24 20"
            stroke="hsl(120 25% 45%)"
            strokeWidth="1"
            strokeDasharray="2,2"
            opacity="0.5"
          />
          <path
            d="M10 16 L22 16"
            stroke="hsl(120 25% 45%)"
            strokeWidth="1"
            strokeDasharray="2,2"
            opacity="0.5"
          />
          
          {/* Property management hint - small windows */}
          <circle
            cx="10"
            cy="18"
            r="1"
            fill="hsl(120 25% 45%)"
            opacity="0.6"
          />
          <circle
            cx="22"
            cy="18"
            r="1"
            fill="hsl(120 25% 45%)"
            opacity="0.6"
          />
        </svg>
      </div>
      
      {/* Brand Text */}
      {showText && (
        <span 
          className={`${textSizeClasses[size]} font-bold igloo-name`}
          data-testid="text-app-name"
        >
          igloo
        </span>
      )}
    </div>
  );
};