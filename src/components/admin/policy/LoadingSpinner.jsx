import React from "react";

export const LoadingSpinner = ({ size = "default", message = "Đang tải dữ liệu..." }) => {
  const sizeMap = {
    small: "h-8 w-8",
    default: "h-12 w-12",
    large: "h-16 w-16",
  };

  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse flex flex-col items-center">
        <div className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-1 mb-4">
          <div className="bg-gray-800 rounded-full p-2">
            <svg
              className={`animate-spin ${sizeMap[size]} text-purple-400`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
        <div className="text-purple-400 text-lg font-medium">{message}</div>
      </div>
    </div>
  );
};
export default LoadingSpinner;