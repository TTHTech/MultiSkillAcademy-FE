import React from 'react';

const Logo = ({ className = "" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 80 35" // Điều chỉnh viewBox để phù hợp với kích thước lớn hơn
      className={className || "h-auto"}
    >
      <defs>
        <linearGradient id="msaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#3366CC"}}/>
          <stop offset="100%" style={{stopColor:"#2250B0"}}/>
        </linearGradient>
        
        <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#FF6B41"}}/>
          <stop offset="100%" style={{stopColor:"#FF5722"}}/>
        </linearGradient>
        
        <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#FF8A65"}}/>
          <stop offset="100%" style={{stopColor:"#FF7043"}}/>
        </linearGradient>
        
        <filter id="navDropShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.2"/>
        </filter>
      </defs>
      
      {/* Làm các phần tử cân đối hơn khi hiển thị lớn */}
      <g filter="url(#navDropShadow)">
        <text x="28" y="22" fontFamily="Arial, sans-serif" fontSize="18"
              fontWeight="900" letterSpacing="-0.5" textAnchor="start" fill="url(#msaGradient)">MSA</text>
      </g>
      
      {/* Tam giác và hình tròn được điều chỉnh vị trí */}
      <path d="M13,8 L21,18 L13,28" fill="url(#triangleGradient)" filter="url(#navDropShadow)"/>
      
      <circle cx="13" cy="30" r="3.5" fill="url(#circleGradient)" filter="url(#navDropShadow)"/>
    </svg>
  );
};

export default Logo;