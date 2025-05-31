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
        <Header title="Mã Giảm Giá" />
        
        <div className="flex flex-col items-center">
          {/* Beautiful Tab Navigation */}
          <div className="mb-8 mt-12">
            <div className="bg-gray-800/50 backdrop-blur-sm p-1.5 rounded-2xl inline-flex shadow-2xl border border-gray-700/50">
              <button
                className={`
                  relative px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 min-w-[200px]
                  ${activeTab === "admin"
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25 transform scale-105"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                  }
                `}
                onClick={() => handleTabChange("admin")}
              >
                <span className="relative z-10">Discount Admin</span>
                {activeTab === "admin" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl blur-md opacity-50"></div>
                )}
              </button>

              <button
                className={`
                  relative px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 min-w-[200px]
                  ${activeTab === "instructor"
                    ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/25 transform scale-105"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                  }
                `}
                onClick={() => handleTabChange("instructor")}
              >
                <span className="relative z-10">Discount Instructor</span>
                {activeTab === "instructor" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl blur-md opacity-50"></div>
                )}
              </button>
            </div>

            {/* Tab Indicator Line */}
            <div className="mt-6 flex justify-center space-x-8">
              <div className={`transition-all duration-300 ${
                activeTab === "admin" 
                  ? "w-20 h-1 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full shadow-lg shadow-indigo-500/50" 
                  : "w-12 h-1 bg-gray-700 rounded-full"
              }`}></div>
              <div className={`transition-all duration-300 ${
                activeTab === "instructor" 
                  ? "w-20 h-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full shadow-lg shadow-purple-500/50" 
                  : "w-12 h-1 bg-gray-700 rounded-full"
              }`}></div>
            </div>
          </div>

          {/* Tab Content */}
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