import { useState, useEffect } from "react";

const FilterSection = ({ onFilter }) => {
  const [sectionId, setSectionId] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    onFilter(sectionId, sectionName, courseName, status);
  }, [sectionId, sectionName, courseName, status, onFilter]);

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <input
        type="text"
        placeholder="Tìm theo ID section..."
        value={sectionId}
        onChange={(e) => setSectionId(e.target.value)}
        className="flex-1 p-3 rounded-md border border-gray-400 bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
      />
      <input
        type="text"
        placeholder="Tìm theo tiêu đề section..."
        value={sectionName}
        onChange={(e) => setSectionName(e.target.value)}
        className="flex-1 p-3 rounded-md border border-gray-400 bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
      />
      <input
        type="text"
        placeholder="Tìm theo tên khóa học..."
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        className="flex-1 p-3 rounded-md border border-gray-400 bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="flex-1 p-3 rounded-md border border-gray-400 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
      >
        <option value="all">Tất cả trạng thái</option>
        <option value="active">Đang hoạt động</option>
        <option value="inactive">Không hoạt động</option>
      </select>
    </div>
  );
};

export default FilterSection;