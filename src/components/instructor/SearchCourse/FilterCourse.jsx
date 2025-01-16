import React, { useState } from "react";

const FilterCourse = ({ onFilter }) => {
  const [filter, setFilter] = useState({
    courseId: "",
    title: "",
    categoryName: "",
    price: "",
    language: "",
    level: "",
    status: "",
    rating: "",
    createdAt: "",
    updatedAt: "",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFilter = {
      ...filter,
      createdAt: filter.createdAt ? new Date(filter.createdAt).toISOString() : "",
      updatedAt: filter.updatedAt ? new Date(filter.updatedAt).toISOString() : "",
    };
    onFilter(updatedFilter);
  };

  const clearFilters = () => {
    setFilter({
      courseId: "",
      title: "",
      categoryName: "",
      price: "",
      language: "",
      level: "",
      status: "",
      rating: "",
      createdAt: "",
      updatedAt: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 p-8 bg-white shadow-xl rounded-lg border border-gray-300"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Tìm kiếm khóa học
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-gray-700 font-medium mb-2">ID khóa học</label>
          <input
            type="text"
            name="courseId"
            value={filter.courseId}
            onChange={handleChange}
            placeholder="Nhập ID khóa học"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Tiêu đề</label>
          <input
            type="text"
            name="title"
            value={filter.title}
            onChange={handleChange}
            placeholder="Nhập tiêu đề"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {[
            { label: "Danh mục", name: "categoryName", type: "text", placeholder: "Nhập danh mục" },
            { label: "Giá tối đa", name: "price", type: "number", placeholder: "Nhập giá tối đa" },
            { label: "Ngôn ngữ", name: "language", type: "text", placeholder: "Nhập ngôn ngữ" },
            { label: "Trình độ", name: "level", type: "text", placeholder: "Nhập trình độ" },
            { label: "Trạng thái", name: "status", type: "text", placeholder: "Nhập trạng thái" },
            { label: "Đánh giá tối thiểu", name: "rating", type: "number", placeholder: "Nhập đánh giá tối thiểu" },
            { label: "Ngày tạo", name: "createdAt", type: "date", placeholder: "" },
            { label: "Ngày cập nhật", name: "updatedAt", type: "date", placeholder: "" },
          ].map((input, index) => (
            <div key={index}>
              <label className="block text-gray-700 font-medium mb-2">{input.label}</label>
              <input
                type={input.type}
                name={input.name}
                value={filter[input.name]}
                onChange={handleChange}
                placeholder={input.placeholder}
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-8">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300"
        >
          {showAdvanced ? "Ẩn tìm kiếm nâng cao" : "Tìm kiếm nâng cao"}
        </button>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={clearFilters}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300"
          >
            Xóa bộ lọc
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Áp dụng bộ lọc
          </button>
        </div>
      </div>
    </form>
  );
};

export default FilterCourse;