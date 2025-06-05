import React, { useState } from "react";
import PageSearchCourse from "./PageSearchCourse/PageSearchCourse";
import PageCourses from "./PageCourses/PageCourses";
import { FaTable, FaThLarge } from "react-icons/fa";

const CombinedCoursesPage = () => {
  const [viewMode, setViewMode] = useState("search");

  const toggleView = () => {
    setViewMode((prev) => (prev === "search" ? "list" : "search"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-100">
      <div className="flex justify-between items-center px-8 py-6 bg-white shadow-md rounded-b-xl">
        <h2 className="text-3xl font-bold text-gray-800">
        </h2>
        <button
          onClick={toggleView}
          className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition duration-300 shadow-md"
        >
          {viewMode === "search" ? (
            <>
              <FaThLarge className="text-xl" />
              <span>Chuyển sang dạng thẻ</span>
            </>
          ) : (
            <>
              <FaTable className="text-xl" />
              <span>Chuyển sang dạng bảng</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-6 px-4 md:px-8 pb-8">
        {viewMode === "search" ? <PageSearchCourse /> : <PageCourses />}
      </div>
    </div>
  );
};

export default CombinedCoursesPage;
