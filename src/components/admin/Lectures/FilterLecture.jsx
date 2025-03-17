
import { useState, useEffect } from "react";

const FilterLecture = ({ onFilter }) => {
  const [lectureId, setLectureId] = useState("");
  const [title, setTitle] = useState("");
  const [courseName, setCourseName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    onFilter(lectureId, title, courseName, sectionName, status);
  }, [lectureId, title, courseName, sectionName, status, onFilter]);

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <input
        type="text"
        placeholder="Tìm theo ID lecture..."
        value={lectureId}
        onChange={(e) => setLectureId(e.target.value)}
        className="flex-1 p-3 rounded-md border border-gray-400 bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
      />
      <input
        type="text"
        placeholder="Tìm theo tiêu đề lecture..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 p-3 rounded-md border border-gray-400 bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
      />
      <input
        type="text"
        placeholder="Tìm theo tên khóa học..."
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        className="flex-1 p-3 rounded-md border border-gray-400 bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
      />
      <input
        type="text"
        placeholder="Tìm theo tên section..."
        value={sectionName}
        onChange={(e) => setSectionName(e.target.value)}
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

export default FilterLecture;
