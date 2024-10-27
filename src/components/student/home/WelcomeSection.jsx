// src/components/home/WelcomeSection.jsx
import React from "react";

const WelcomeSection = () => {
  return (
    <div className="flex items-center space-x-4 p-6 bg-white shadow-md rounded-md my-6">
      {/* Avatar người dùng */}
      <img 
        src="https://th.bing.com/th/id/OIP.i3OCpdwqxkglpt9oOMDLzwHaHa?w=190&h=190&c=7&r=0&o=5&dpr=1.6&pid=1.7" 
        alt="User Avatar" 
        className="h-16 w-16 rounded-full object-cover" 
      />
      
      {/* Phần chào mừng và liên kết */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900">Chào mừng Hoài trở lại!</h3>
        <a href="#" className="text-purple-600 underline text-sm">Thêm nghề nghiệp và sở thích</a>
      </div>
    </div>
  );
};

export default WelcomeSection;
