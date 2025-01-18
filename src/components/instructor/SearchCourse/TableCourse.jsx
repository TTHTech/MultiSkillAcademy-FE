import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const TableCourse = ({ courses }) => {
  const [visibleColumns, setVisibleColumns] = useState(["courseId", "images", "title", "price"]);
  const [showColumnControls, setShowColumnControls] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const columns = [
    { key: "courseId", label: "ID" },
    { key: "images", label: "Hình ảnh" },
    { key: "title", label: "Tiêu đề" },
    { key: "categoryName", label: "Danh mục" },
    { key: "price", label: "Giá" },
    { key: "language", label: "Ngôn ngữ" },
    { key: "level", label: "Trình độ" },
    { key: "status", label: "Trạng thái" },
    { key: "rating", label: "Đánh giá" },
    { key: "createdAt", label: "Ngày tạo" },
    { key: "updatedAt", label: "Ngày cập nhật" },
  ];

  const toggleColumnVisibility = (key) => {
    setVisibleColumns((prev) =>
      prev.includes(key)
        ? prev.filter((column) => column !== key)
        : [...prev, key]
    );
  };

  const totalPages = Math.ceil(courses.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentCourses = courses.slice(startIndex, endIndex);

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
        Danh sách khóa học
      </h1>

      <button
        onClick={() => setShowColumnControls(!showColumnControls)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {showColumnControls
          ? "Ẩn tùy chọn hiển thị cột"
          : "Hiện tùy chọn hiển thị cột"}
      </button>

      {showColumnControls && (
        <div className="mb-4 bg-white p-4 rounded-md shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-2 border-b border-gray-200 pb-1">
            Tùy chọn nội dung hiển thị
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {columns.map((column) => (
              <label
                key={column.key}
                className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(column.key)}
                  onChange={() => toggleColumnVisibility(column.key)}
                  className="rounded text-blue-500 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-gray-700 text-sm">{column.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200 shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              {columns
                .filter((column) => visibleColumns.includes(column.key))
                .map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-left"
                  >
                    {column.label}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentCourses.map((course) => (
              <tr key={course.courseId} className="hover:bg-gray-100">
                {columns
                  .filter((column) => visibleColumns.includes(column.key))
                  .map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-2 border border-gray-300 text-center relative group"
                    >
                      {column.key === "courseId" ? (
                        <div
                          className="cursor-pointer text-gray-700 hover:text-blue-500 truncate flex items-center justify-start"
                          style={{ maxWidth: "100px" }}
                          onClick={() => {
                            navigator.clipboard.writeText(course[column.key]);
                            toast.success("ID copied: " + course[column.key], {
                              position: "top-right",
                              autoClose: 2000,
                              hideProgressBar: true,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              theme: "light",
                            });
                          }}
                        >
                          <span>
                            {course[column.key].length > 6
                              ? `${course[column.key].slice(0, 5)}...`
                              : course[column.key]}
                          </span>
                          <span className="absolute left-0 top-full bg-gray-700 text-white text-xs rounded px-2 py-1 hidden group-hover:block whitespace-nowrap">
                            {course[column.key]}
                          </span>
                        </div>
                      ) : column.key === "images" ? (
                        <Link to={`/instructor/courses/${course.courseId}`}>
                          <img
                            src={course.images[0]}
                            alt={course.title}
                            className="w-24 h-auto mx-auto rounded-md shadow"
                          />
                        </Link>
                      ) : column.key === "title" ? (
                        <Link
                          to={`/instructor/courses/${course.courseId}`}
                          className="text-blue-500 hover:underline"
                        >
                          {course.title}
                        </Link>
                      ) : column.key === "price" ? (
                        course.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                      ) : column.key === "createdAt" ||
                        column.key === "updatedAt" ? (
                        new Date(course[column.key]).toLocaleDateString("vi-VN")
                      ) : (
                        course[column.key]
                      )}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md shadow hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="px-3 py-1 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md shadow hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableCourse;
