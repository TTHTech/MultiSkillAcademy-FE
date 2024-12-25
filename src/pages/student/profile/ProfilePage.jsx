import React, { useState, useEffect } from "react";
import NavBar from "../../../components/student/common/NavBar"; // Giả sử NavBar được sử dụng
import Footer from "../../../components/student/common/Footer"; // Giả sử Footer được sử dụng
import ProfileInfo from "../../../components/student/profile/ProfileInfo"; // Component hiển thị thông tin học viên
import ChangePassword from "../../../components/student/profile/ChangePassword"; // Component đổi mật khẩu

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("info"); // Tab mặc định là "Thông tin"

  return (
    <div className="w-full h-full min-h-screen bg-white overflow-y-auto mt-[90px]">
      <NavBar />
      <div className="container mx-auto p-6 bg-white">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 pb-4">Quản lý Hồ Sơ</h1>

        {/* Tab Navigation */}
        <div className="mb-6 flex space-x-4 border-b">
          <button
            className={`py-2 px-4 font-semibold ${activeTab === "info" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-600"}`}
            onClick={() => setActiveTab("info")}
          >
            Thông Tin
          </button>
          <button
            className={`py-2 px-4 font-semibold ${activeTab === "changePassword" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-600"}`}
            onClick={() => setActiveTab("changePassword")}
          >
            Đổi Mật Khẩu
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "info" ? (
          <ProfileInfo />
        ) : activeTab === "changePassword" ? (
          <ChangePassword />
        ) : null}
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
