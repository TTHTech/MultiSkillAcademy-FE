import EditDiscount from "./editDiscount";
import DiscountUsage from "./DiscountUsage";
import { useState } from "react";

const PageDiscountUsage = ({ discountId, onCancel, triggerRefresh }) => {
  const [activeTab, setActiveTab] = useState("editDiscount");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <div className="container mx-auto px-4">
      <button
        onClick={onCancel}
        className="mb-4 bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white font-semibold px-6 py-2 rounded shadow-md transition-all duration-200 text-sm"
      >
        &larr; Quay lại danh sách Discount
      </button>
        <div className="flex flex-col items-center p-4 min-h-screen">
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-6 py-2 rounded-t-md focus:outline-none transition-colors duration-200 ${
                activeTab === "editDiscount"
                  ? "bg-blue-600 border-b-4 border-blue-800 text-white"
                  : "bg-blue-100 border-b-4 border-transparent text-blue-600 hover:text-blue-800 hover:border-blue-400"
              }`}
              onClick={() => handleTabChange("editDiscount")}
            >
              Discount Edit
            </button>
            <button
              className={`px-6 py-2 rounded-t-md focus:outline-none transition-colors duration-200 ${
                activeTab === "discountUsage"
                  ? "bg-blue-600 border-b-4 border-blue-800 text-white"
                  : "bg-blue-100 border-b-4 border-transparent text-blue-600 hover:text-blue-800 hover:border-blue-400"
              }`}
              onClick={() => handleTabChange("discountUsage")}
            >
              Discount Usage
            </button>
          </div>

          {/* Nội dung tab */}
          <div className="w-full bg-white p-4">
            {activeTab === "editDiscount" && (
              <EditDiscount
                discountId={discountId}
                onCancel={onCancel}
                triggerRefresh={triggerRefresh}
              />
            )}
            {activeTab === "discountUsage" && (
              <DiscountUsage discountId={discountId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageDiscountUsage;
