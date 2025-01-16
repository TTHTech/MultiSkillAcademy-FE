import React, { useState } from "react";
import { Link } from "react-router-dom";

const TableCourse = ({ courses }) => {
  const [visibleColumns, setVisibleColumns] = useState(["images", "title"]);
  const [showColumnControls, setShowColumnControls] = useState(false);

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

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Danh sách khóa học
      </h1>

      <button
        onClick={() => setShowColumnControls(!showColumnControls)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
      >
        {showColumnControls
          ? "Ẩn tùy chọn hiển thị cột"
          : "Hiện tùy chọn hiển thị cột"}
      </button>

      {showColumnControls && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Tùy chọn nội dung hiển thị
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {columns.map((column) => (
              <label key={column.key} className="flex items-center space-x-2">
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
                    className="px-4 py-2 border border-gray-300 text-gray-700"
                  >
                    {column.label}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {courses.map((course) => (
              <tr key={course.courseId} className="hover:bg-gray-100">
                {columns
                  .filter((column) => visibleColumns.includes(column.key))
                  .map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-2 border border-gray-300 text-center"
                    >
                      {column.key === "images" ? (
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
    </div>
  );
};

export default TableCourse;
