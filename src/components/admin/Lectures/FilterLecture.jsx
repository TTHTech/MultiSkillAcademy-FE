import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const FilterLecture = ({ onFilter }) => {
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    onFilter(searchText, searchText, searchText, searchText, status);
  }, [searchText, status, onFilter]);

  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm theo ID, tiêu đề, tên khóa học hoặc section..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full pl-10 p-3 rounded-md border border-gray-500 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
        />
      </div>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="flex-shrink-0 p-3 rounded-md border border-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
      >
        <option value="all">Tất cả trạng thái</option>
        <option value="active">Đang hoạt động</option>
        <option value="inactive">Không hoạt động</option>
      </select>
    </div>
  );
};

export default FilterLecture;
