import React, { useState, useEffect } from "react";
import NavBar from "../../../components/student/common/NavBar";
import Footer from "../../../components/student/common/Footer";
import ProfileInfo from "../../../components/student/profile/ProfileInfo";
import ChangePassword from "../../../components/student/profile/ChangePassword";
import { User, Lock, ChevronRight } from 'lucide-react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavBar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-[90px]">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <a href="/student/home" className="hover:text-blue-600 transition-colors duration-200 mt-[50px]">
            Trang chủ
          </a>
          <ChevronRight className="w-4 h-4 mt-[50px]" />
          <span className="text-gray-700 font-medium mt-[50px]">Quản lý hồ sơ</span>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Quản lý Hồ Sơ
          </h1>
          <p className="mt-2 text-gray-600">
            Cập nhật thông tin cá nhân và bảo mật tài khoản của bạn
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 border-b">
            <button
              className={`group flex items-center space-x-2 py-3 px-6 font-medium rounded-lg transition-all duration-300
                ${activeTab === "info"
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
              onClick={() => setActiveTab("info")}
            >
              <User className={`w-5 h-5 ${
                activeTab === "info" ? "text-blue-600" : "text-gray-400"
              } group-hover:scale-110 transition-transform duration-300`} />
              <span>Thông Tin</span>
            </button>
            
            <button
              className={`group flex items-center space-x-2 py-3 px-6 font-medium rounded-lg transition-all duration-300
                ${activeTab === "changePassword"
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
              onClick={() => setActiveTab("changePassword")}
            >
              <Lock className={`w-5 h-5 ${
                activeTab === "changePassword" ? "text-blue-600" : "text-gray-400"
              } group-hover:scale-110 transition-transform duration-300`} />
              <span>Đổi Mật Khẩu</span>
            </button>
          </div>

          {/* Content Section with Animation */}
          <div className="transition-all duration-300 transform">
            {activeTab === "info" && (
              <div className="animate-fadeIn">
                <ProfileInfo />
              </div>
            )}
            {activeTab === "changePassword" && (
              <div className="animate-fadeIn">
                <ChangePassword />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add margin bottom for footer */}
      <div className="mt-20">
        <Footer />
      </div>

      {/* Custom Animation Keyframes */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;