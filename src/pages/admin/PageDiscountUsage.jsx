import DiscountAdminUsageList from "../../components/admin/discounts/DiscountUsageAdmin/discountUsageAdminList";
import Header from "../../components/admin/common/Header";
import DiscountInstructorUsageList from "../../components/admin/discounts/DiscountUsageInstructor/discountUsageInstructorList";
import { useState } from "react";

const PageDiscountUsage = () => {
  const [activeTab, setActiveTab] = useState("admin");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <div className="container mx-auto px-4">
        <Header title="Mã Giảm Giá Đã Sử Dụng" />
        <div className="flex flex-col items-center p-6 min-h-screen">
          <div className="flex space-x-6 mb-6 text-2xl font-bold">
            <button
              className={`px-8 py-4 rounded-t-lg focus:outline-none transition-colors duration-200 ${
                activeTab === "admin"
                  ? "bg-gray-800 border-b-4 border-blue-500 text-blue-400"
                  : "bg-gray-700 border-b-4 border-transparent text-gray-300 hover:text-white hover:border-blue-300"
              }`}
              onClick={() => handleTabChange("admin")}
            >
              Discount Usage Admin
            </button>
            <button
              className={`px-8 py-4 rounded-t-lg focus:outline-none transition-colors duration-200 ${
                activeTab === "instructor"
                  ? "bg-gray-800 border-b-4 border-blue-500 text-blue-400"
                  : "bg-gray-700 border-b-4 border-transparent text-gray-300 hover:text-white hover:border-blue-300"
              }`}
              onClick={() => handleTabChange("instructor")}
            >
              Discount Usage Instructor
            </button>
          </div>

          <div className="w-full bg-gray-800 p-4">
            {activeTab === "admin" && <DiscountAdminUsageList />}
            {activeTab === "instructor" && <DiscountInstructorUsageList />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageDiscountUsage;
