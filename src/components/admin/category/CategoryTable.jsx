import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

// Số lượng category hiển thị mỗi trang
const ITEMS_PER_PAGE = 10;

const CategoryTable = () => {
  const [categories, setCategories] = useState([]); // Lưu trữ danh sách category
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [editingCategory, setEditingCategory] = useState(null); // Category đang xem
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false); // Hiển thị form thêm category mới
  const [newCategory, setNewCategory] = useState({ name: "", description: "" }); // Dữ liệu category mới

  // Dữ liệu mẫu
  const sampleCategories = [
    {
      id: 1,
      name: "Web Development",
      description: "Learn how to build modern web applications.",
    },
    {
      id: 2,
      name: "Data Science",
      description: "Master data analysis, machine learning, and AI.",
    },
  ];

  // Cập nhật categories khi dữ liệu mẫu được set
  useEffect(() => {
    setCategories(sampleCategories);
  }, []);

  // Lọc category theo từ khóa tìm kiếm
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính toán tổng số trang cho categories
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);

  // Lấy các category hiển thị trên trang hiện tại
  const currentCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setCurrentPage(1); // Quay lại trang đầu khi tìm kiếm
  };

  const handleViewCategory = (category) => {
    setEditingCategory(category); // Hiển thị chi tiết category
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCategorySubmit = () => {
    const newCategoryData = { ...newCategory, id: categories.length + 1 };
    setCategories([...categories, newCategoryData]);
    setShowAddCategoryForm(false);
    setNewCategory({ name: "", description: "" });
  };

  const handleUpdateCategorySubmit = () => {
    const updatedCategories = categories.map((category) =>
      category.id === editingCategory.id ? editingCategory : category
    );
    setCategories(updatedCategories);
    setEditingCategory(null); // Đóng form chỉnh sửa
  };

  const handleDeleteCategory = (categoryId) => {
    const confirmation = window.confirm("Are you sure you want to delete this category?");
    if (confirmation) {
      setCategories(categories.filter((category) => category.id !== categoryId));
      if (editingCategory?.id === categoryId) setEditingCategory(null); // Clear the editing category if it's deleted
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Categories</h2>
        <div className="flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded-lg ml-4"
            onClick={() => setShowAddCategoryForm(true)}
          >
            <span className="text-xl">+</span>
          </button>
        </div>
      </div>

      {editingCategory ? (
        // Form chi tiết category, có thể chỉnh sửa
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Category Details</h3>

          <div className="mb-4">
            <label className="text-gray-400">Name:</label>
            <input
              type="text"
              name="name"
              value={editingCategory.name}
              className="w-full p-2 bg-gray-600 text-white rounded-lg"
              onChange={(e) =>
                setEditingCategory((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-400">Description:</label>
            <textarea
              name="description"
              value={editingCategory.description}
              className="w-full p-2 bg-gray-600 text-white rounded-lg"
              onChange={(e) =>
                setEditingCategory((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex justify-between">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={handleUpdateCategorySubmit}
            >
              Update
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              onClick={() => setEditingCategory(null)} // Đặt lại category đang chỉnh sửa
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <table className="table-auto w-full text-left text-gray-100">
          <thead>
            <tr className="border-b bg-gray-700">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((category, index) => (
              <tr key={category.id} className="border-b bg-gray-800">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{category.name}</td>
                <td className="py-2 px-4">{category.description}</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                    onClick={() => handleViewCategory(category)}
                  >
                    View
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-lg ml-2"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        >
          Prev
        </button>
        <span className="self-center text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
          onClick={() =>
            handlePageChange(Math.min(currentPage + 1, totalPages))
          }
        >
          Next
        </button>
      </div>

      {/* Add Category Form (Popup) */}
      {showAddCategoryForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-700 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Add New Category</h3>

            <div className="mb-4">
              <label className="text-gray-400">Category Name:</label>
              <input
                type="text"
                name="name"
                value={newCategory.name}
                className="w-full p-2 bg-gray-600 text-white rounded-lg"
                onChange={handleAddCategoryChange}
              />
            </div>

            <div className="mb-4">
              <label className="text-gray-400">Description:</label>
              <textarea
                name="description"
                value={newCategory.description}
                className="w-full p-2 bg-gray-600 text-white rounded-lg"
                onChange={handleAddCategoryChange}
              />
            </div>

            <div className="flex justify-between">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={handleAddCategorySubmit}
              >
                Add
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setShowAddCategoryForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CategoryTable;
