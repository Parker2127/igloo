import React, { useEffect, useState } from 'react';

export const AnimatedLoading: React.FC = () => {
  const [shouldShow, setShouldShow] = useState(true);

  // Show loading for minimum 1000ms to make it visible
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldShow(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col items-center space-y-6">
        
        {/* Simplified Animated Igloo Logo */}
        <div className="relative">
          <div className="w-20 h-20 relative animate-pulse">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              {/* Igloo dome */}
              <path
                d="M6 24 C6 24, 6 16, 16 12 C26 16, 26 24, 26 24 Z"
                stroke="hsl(120 25% 45%)"
                strokeWidth="2.5"
                fill="hsl(120 15% 85%)"
                strokeDasharray="1,1"
                opacity="0.9"
              />
              
              {/* Door entrance */}
              <path
                d="M12 24 L12 20 C12 18, 14 18, 16 18 C18 18, 20 18, 20 20 L20 24"
                stroke="hsl(120 25% 45%)"
                strokeWidth="2.5"
                fill="white"
                strokeDasharray="1,1"
              />
              
              {/* Building blocks */}
              <path
                d="M8 20 L24 20"
                stroke="hsl(120 25% 45%)"
                strokeWidth="1.5"
                strokeDasharray="2,2"
                opacity="0.6"
              />
              <path
                d="M10 16 L22 16"
                stroke="hsl(120 25% 45%)"
                strokeWidth="1.5"
                strokeDasharray="2,2"
                opacity="0.6"
              />
              
              {/* Windows */}
              <circle cx="10" cy="18" r="1.2" fill="hsl(120 25% 45%)" opacity="0.8" />
              <circle cx="22" cy="18" r="1.2" fill="hsl(120 25% 45%)" opacity="0.8" />
            </svg>
          </div>

          {/* Simple glow effect */}
          <div className="absolute inset-0 -z-10">
            <div className="w-24 h-24 -ml-2 -mt-2 bg-primary rounded-full opacity-20 animate-ping"></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl font-bold text-primary igloo-name">
              igloo
            </span>
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-75"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm">
            Loading...
          </p>
        </div>
      </div>
    </div>
  );
};