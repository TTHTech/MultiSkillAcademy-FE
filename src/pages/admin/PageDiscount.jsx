import { useState } from "react";
import DiscountsAdminTable from "../../components/admin/discounts/DiscountAdmin/discountsAdminTable";
import DiscountsInstructorTable from "../../components/admin/discounts/DiscountInstructor/discountsInstructorTable";
import Header from "../../components/admin/common/Header";

const PageCreateDiscounts = () => {
  const [activeTab, setActiveTab] = useState("admin");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <div className="container mx-auto px-4">
        <Header title="Discount" />
        <div className="flex flex-col items-center">
          <div className="flex space-x-6 mb-6 text-3xl font-bold">
            <button
              className={`px-6 py-3 focus:outline-none transition-colors duration-200 ${
                activeTab === "admin"
                  ? "border-b-4 border-blue-400 text-blue-400"
                  : "border-b-4 border-gray-600 text-gray-300 hover:text-white"
              }`}
              onClick={() => handleTabChange("admin")}
            >
              Discount Admin
            </button>
            <button
              className={`px-6 py-3 focus:outline-none transition-colors duration-200 ${
                activeTab === "instructor"
                  ? "border-b-4 border-blue-400 text-blue-400"
                  : "border-b-4 border-gray-600 text-gray-300 hover:text-white"
              }`}
              onClick={() => handleTabChange("instructor")}
            >
              Discount Instructor
            </button>
          </div>

          <div className="w-full">
            {activeTab === "admin" && <DiscountsAdminTable />}
            {activeTab === "instructor" && <DiscountsInstructorTable />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageCreateDiscounts;
