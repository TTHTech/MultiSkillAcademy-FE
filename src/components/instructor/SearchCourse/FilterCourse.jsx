import { useState, useEffect } from "react";

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
  const languages = [
    "English",
    "Vietnamese",
    "Chinese",
    "Spanish",
    "French",
    "German",
    "Japanese",
    "Korean",
    "Russian",
    "Portuguese",
    "Italian",
    "Arabic",
    "Hindi",
    "Bengali",
    "Swedish",
    "Dutch",
    "Greek",
    "Hebrew",
    "Turkish",
    "Thai",
  ];
  const levels = ["Beginner", "Intermediate", "Advanced"];
  const statuses = [
    "Active",
    "Inactive",
    "Pending",
    "Processing",
    "Unsent",
    "Declined",
  ];
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found in localStorage");
        }

        const response = await fetch(
          "http://localhost:8080/api/instructor/categories",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFilter = {
      ...filter,
      createdAt: filter.createdAt
        ? new Date(filter.createdAt).toISOString()
        : "",
      updatedAt: filter.updatedAt
        ? new Date(filter.updatedAt).toISOString()
        : "",
    };
    onFilter(updatedFilter);
  };

  const clearFilters = () => {
    const resetFilter = {
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
    };
    setFilter(resetFilter);
    onFilter(resetFilter);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 p-8 bg-white shadow-lg rounded-xl border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
        Tìm kiếm khóa học
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-base font-semibold text-gray-800 mb-2">
            ID khóa học
          </label>
          <input
            type="text"
            name="courseId"
            value={filter.courseId}
            onChange={handleChange}
            placeholder="Nhập ID khóa học"
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          />
        </div>
        <div>
          <label className="block text-base font-semibold text-gray-800 mb-2">
            Tiêu đề
          </label>
          <input
            type="text"
            name="title"
            value={filter.title}
            onChange={handleChange}
            placeholder="Nhập tiêu đề"
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          />
        </div>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-2">
              Danh mục
            </label>
            <select
              name="categoryName"
              value={filter.categoryName}
              onChange={handleChange}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            >
              <option value="">Chọn Danh Mục</option>
              {categories.map((categorie) => (
                <option key={categorie} value={categorie}>
                  {categorie}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-2">
              Giá tối đa
            </label>
            <input
              type="number"
              name="price"
              value={filter.price}
              onChange={handleChange}
              placeholder="Nhập giá tối đa"
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-2">
              Ngôn ngữ
            </label>
            <select
              name="language"
              value={filter.language}
              onChange={handleChange}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            >
              <option value="">Chọn ngôn ngữ</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-2">
              Trình độ
            </label>
            <select
              name="level"
              value={filter.level}
              onChange={handleChange}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            >
              <option value="">Chọn trình độ</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-2">
              Trạng thái
            </label>
            <select
              name="status"
              value={filter.status}
              onChange={handleChange}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            >
              <option value="">Chọn trạng thái</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-8">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-base text-blue-600 hover:text-blue-800 focus:outline-none transition duration-200 ease-in-out"
        >
          {showAdvanced ? "Ẩn tìm kiếm nâng cao" : "Tìm kiếm nâng cao"}
        </button>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={clearFilters}
            className="px-6 py-3 bg-gray-100 text-gray-800 text-base rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
          >
            Xóa bộ lọc
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white text-base rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out"
          >
            Áp dụng bộ lọc
          </button>
        </div>
      </div>
    </form>
  );
};
export default FilterCourse;
