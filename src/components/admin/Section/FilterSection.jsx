import { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { IoOptionsOutline } from "react-icons/io5";

const FilterSection = ({ onFilter }) => {
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    onFilter(searchText, searchText, searchText, status);
  }, [searchText, status, onFilter]);

  return (
    <div className="bg-gray-800 rounded-xl p-5 mb-6 shadow-lg border border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
        <IoOptionsOutline className="mr-2 text-blue-400" />
        Bộ lọc
      </h2>
      
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search input */}
        <div className="relative flex-1 group">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors duration-200">
            <FaSearch />
          </div>
          <input
            type="text"
            placeholder="Tìm theo ID, tiêu đề hoặc tên khóa học..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-12 p-4 rounded-lg border-2 border-gray-700 bg-gray-900 text-white placeholder-gray-400
                      focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40
                      hover:border-gray-600 transition-all duration-200 text-sm font-medium"
          />
        </div>
        
        {/* Status filter */}
        <div className="relative w-full lg:w-64">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            <FaFilter />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full pl-12 p-4 pr-10 rounded-lg border-2 border-gray-700 bg-gray-900 text-white
                     appearance-none cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 
                     focus:ring-blue-500/40 hover:border-gray-600 transition-all duration-200
                     text-sm font-medium"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Tags/Quick filters - optional enhancement */}
      <div className="flex flex-wrap gap-2 mt-4">
        <button 
          onClick={() => {setSearchText(""); setStatus("all");}}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 flex items-center"
        >
          Đặt lại bộ lọc
        </button>
        {status !== "all" && (
          <div className="px-3 py-1 text-xs bg-gray-700 text-white rounded-full flex items-center">
            Trạng thái: {status === "active" ? "Đang hoạt động" : "Không hoạt động"}
          </div>
        )}
        {searchText && (
          <div className="px-3 py-1 text-xs bg-gray-700 text-white rounded-full flex items-center">
            Tìm kiếm: {searchText}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSection;