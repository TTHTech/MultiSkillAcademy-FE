import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader, Plus, X, Edit, Trash2, ChevronLeft, ChevronRight, Check, AlertTriangle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

// Animation styles
const animationStyles = `
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.98);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease-out;
}

.animate-scaleIn {
  animation: scaleIn 0.4s ease-out;
}

.hover\\:scale-101:hover {
  transform: scale(1.01);
}
`;

// Number of categories shown per page
const ITEMS_PER_PAGE = 5;

const CategoryTable = () => {
  // Inject animation styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = animationStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    status: "Active",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Đang tải danh mục...");

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Không tìm thấy token");
        return;
      }

      const response = await axios.get(
        `${baseUrl}/api/admin/categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCategories(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
      toast.error("Không thể tải danh mục");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(
    (category) =>
      category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);

  const currentCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleViewCategory = (category) => {
    setEditingCategory(category);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCategorySubmit = async () => {
    if (!newCategory.name.trim() || !newCategory.description.trim()) {
      toast.error("Tên và mô tả là bắt buộc!");
      return;
    }

    setLoadingMessage("Đang thêm danh mục...");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Không tìm thấy token");
        toast.error("Xác thực thất bại. Vui lòng đăng nhập lại.");
        return;
      }

      const response = await axios.post(
        `${baseUrl}/api/admin/categories`,
        newCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCategories([response.data, ...categories]);
      setShowAddCategoryForm(false);
      setNewCategory({ name: "", description: "", status: "Active" });
      toast.success("Thêm danh mục thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);

      if (error.response && error.response.status === 400) {
        toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.");
      } else {
        toast.error("Lỗi khi thêm danh mục. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCategorySubmit = async () => {
    if (
      !editingCategory?.name?.trim() ||
      !editingCategory?.description?.trim()
    ) {
      toast.error("Tên và mô tả là bắt buộc!");
      return;
    }

    setLoadingMessage("Đang cập nhật danh mục...");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Không tìm thấy token");
        return;
      }

      if (!editingCategory?.categoryId) {
        console.error("Thiếu ID danh mục!");
        return;
      }

      const response = await axios.put(
        `${baseUrl}/api/admin/categories/update/${editingCategory.categoryId}`,
        editingCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCategories(
        categories.map((category) =>
          category.categoryId === editingCategory.categoryId
            ? response.data
            : category
        )
      );
      setEditingCategory(null);
      toast.success("Cập nhật danh mục thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      toast.error("Lỗi khi cập nhật danh mục!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    setLoadingMessage("Đang xóa danh mục...");
    setIsLoading(true);

    const confirmation = window.confirm(
      "Bạn có chắc chắn muốn xóa danh mục này không?"
    );
    if (!confirmation) {
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Không tìm thấy token");
        return;
      }

      await axios.delete(
        `${baseUrl}/api/admin/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCategories(
        categories.filter((category) => category.categoryId !== categoryId)
      );
      if (editingCategory?.categoryId === categoryId) setEditingCategory(null);
      toast.success("Xóa danh mục thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      toast.error("Lỗi khi xóa danh mục. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAction = () => {
    setIsLoading(false);
    setShowAddCategoryForm(false);
    setEditingCategory(null);
  };

  // PageButton Component
  const PageButton = ({ page, currentPage, onClick }) => (
    <button
      onClick={onClick}
      className={`w-8 h-8 mx-1 rounded-md flex items-center justify-center transition-all text-sm ${
        currentPage === page 
          ? "bg-blue-600 text-white shadow-md" 
          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
      }`}
    >
      {page}
    </button>
  );

  return (
    <div>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-slate-900/70 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-slate-800 p-6 rounded-md flex flex-col items-center shadow-xl border border-slate-700/50 animate-scaleIn">
            <Loader className="animate-spin text-blue-400 mb-4" size={28} />
            <span className="text-slate-300 text-sm">{loadingMessage}</span>
          </div>
        </div>
      )}

      <motion.div
        className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md rounded-md p-6 border border-slate-700/40 mb-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Header with title and actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1.5 h-8 bg-blue-500 rounded-r mr-3" />
            <h2 className="text-xl font-semibold text-white">Quản lý danh mục</h2>
          </div>
          <div className="flex items-center">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Tìm kiếm danh mục..."
                className="w-full bg-slate-800/80 text-slate-200 placeholder-slate-400 rounded-md pl-9 pr-3 py-2 border border-slate-700/70 focus:outline-none focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                onChange={handleSearch}
                value={searchTerm}
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-500 text-white ml-3 p-2 rounded-md transition-all"
              onClick={() => setShowAddCategoryForm(true)}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Edit Category Form */}
        {editingCategory ? (
          <div className="bg-slate-800/50 rounded-md p-5 backdrop-blur-sm border border-slate-700/30 animate-fadeIn">
            <div className="flex items-center mb-5">
              <div className="w-1.5 h-8 bg-blue-500 rounded-r mr-3" />
              <h3 className="text-lg font-semibold text-white">Chi tiết danh mục</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Tên:</label>
                <input
                  type="text"
                  name="name"
                  value={editingCategory.name}
                  className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  onChange={(e) =>
                    setEditingCategory((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Mô tả:</label>
                <textarea
                  name="description"
                  value={editingCategory.description}
                  className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all min-h-[120px]"
                  onChange={(e) =>
                    setEditingCategory((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Trạng thái:</label>
                <select
                  name="status"
                  value={editingCategory.status}
                  className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  onChange={(e) =>
                    setEditingCategory((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                >
                  <option value="Active">Hoạt động</option>
                  <option value="Inactive">Không hoạt động</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4 mt-6 border-t border-slate-700/30">
              <button
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-md transition-all font-medium text-sm transform hover:scale-101 flex items-center justify-center gap-2"
                onClick={handleUpdateCategorySubmit}
              >
                <Edit size={16} />
                <span>Cập nhật danh mục</span>
              </button>
              <button
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-md transition-all font-medium text-sm transform hover:scale-101 flex items-center justify-center gap-2"
                onClick={handleCancelAction}
              >
                <X size={16} />
                <span>Hủy</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Categories List */}
            <div className="space-y-3">
              {currentCategories.length > 0 ? (
                currentCategories.map((category) => (
                  <div
                    key={category.categoryId}
                    className="bg-slate-800/40 p-4 rounded-md border border-slate-700/30 flex justify-between items-center hover:bg-slate-800/60 transition-all duration-300"
                  >
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-1">{category.name}</h3>
                      <p className="text-slate-300 mb-3">{category.description}</p>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          category.status === "Active"
                            ? "bg-green-100/10 text-green-400 border border-green-500/30" 
                            : "bg-yellow-100/10 text-yellow-400 border border-yellow-500/30"
                        }`}
                      >
                        {category.status === "Active" ? (
                          <Check className="mr-1.5" size={14} />
                        ) : (
                          <AlertTriangle className="mr-1.5" size={14} />
                        )}
                        {category.status === "Active" ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        className="px-3 py-2 bg-blue-600/80 hover:bg-blue-500 text-white rounded-md transition-all duration-200 text-sm flex items-center gap-1.5 shadow-sm"
                        onClick={() => handleViewCategory(category)}
                      >
                        <Edit size={16} />
                        <span>Sửa</span>
                      </button>
                      <button
                        className="px-3 py-2 bg-red-600/80 hover:bg-red-500 text-white rounded-md transition-all duration-200 text-sm flex items-center gap-1.5 shadow-sm"
                        onClick={() => handleDeleteCategory(category.categoryId)}
                      >
                        <Trash2 size={16} />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-slate-800/20 rounded-md border border-slate-700/20">
                  <p className="text-slate-300 text-sm">
                    {searchTerm ? "Không tìm thấy danh mục phù hợp với từ khóa tìm kiếm." : "Không có danh mục nào."}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredCategories.length > ITEMS_PER_PAGE && (
              <div className="flex justify-between items-center mt-6">
                <button
                  className="bg-blue-600/80 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2"
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                  <span className="text-sm">Trước</span>
                </button>

                <div className="flex items-center">
                  {(() => {
                    const pages = [];

                    if (totalPages <= 7) {
                      for (let i = 1; i <= totalPages; i++) {
                        pages.push(
                          <PageButton
                            key={i}
                            page={i}
                            currentPage={currentPage}
                            onClick={() => handlePageChange(i)}
                          />
                        );
                      }
                    } else {
                      // First page
                      pages.push(
                        <PageButton
                          key={1}
                          page={1}
                          currentPage={currentPage}
                          onClick={() => handlePageChange(1)}
                        />
                      );

                      // Add dots if needed
                      if (currentPage > 3) {
                        pages.push(<span key="dots-start" className="px-2 py-2 text-slate-300">…</span>);
                      }

                      // Pages around current
                      for (let i = Math.max(2, currentPage - 2); i <= Math.min(currentPage + 2, totalPages - 1); i++) {
                        pages.push(
                          <PageButton
                            key={i}
                            page={i}
                            currentPage={currentPage}
                            onClick={() => handlePageChange(i)}
                          />
                        );
                      }

                      // Add dots if needed
                      if (currentPage < totalPages - 2) {
                        pages.push(<span key="dots-end" className="px-2 py-2 text-slate-300">…</span>);
                      }

                      // Last page
                      if (totalPages > 1) {
                        pages.push(
                          <PageButton
                            key={totalPages}
                            page={totalPages}
                            currentPage={currentPage}
                            onClick={() => handlePageChange(totalPages)}
                          />
                        );
                      }
                    }

                    return pages;
                  })()}
                </div>

                <button
                  className="bg-blue-600/80 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2"
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <span className="text-sm">Sau</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

        {/* Add Category Modal */}
        {showAddCategoryForm && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-slate-900/70 backdrop-blur-sm z-50 animate-fadeIn">
            <div className="bg-slate-800 p-6 rounded-md w-full max-w-md border border-slate-700/50 shadow-xl animate-scaleIn">
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center">
                  <div className="w-1.5 h-8 bg-blue-500 rounded-r mr-3" />
                  <h3 className="text-lg font-semibold text-white">Thêm danh mục mới</h3>
                </div>
                <button
                  className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-all"
                  onClick={() => setShowAddCategoryForm(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Tên:</label>
                  <input
                    type="text"
                    name="name"
                    value={newCategory.name}
                    className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                    onChange={handleAddCategoryChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Mô tả:</label>
                  <textarea
                    name="description"
                    value={newCategory.description}
                    className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all min-h-[120px]"
                    onChange={handleAddCategoryChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Trạng thái:</label>
                  <select
                    name="status"
                    value={newCategory.status}
                    className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                    onChange={handleAddCategoryChange}
                  >
                    <option value="Active">Hoạt động</option>
                    <option value="Inactive">Không hoạt động</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 mt-6 border-t border-slate-700/30">
                <button
                  className="flex-1 bg-green-600/80 hover:bg-green-500 text-white px-4 py-2.5 rounded-md transition-all font-medium text-sm transform hover:scale-101 flex items-center justify-center gap-2"
                  onClick={handleAddCategorySubmit}
                >
                  <Plus size={16} />
                  <span>Thêm danh mục</span>
                </button>
                <button
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-md transition-all font-medium text-sm transform hover:scale-101"
                  onClick={handleCancelAction}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CategoryTable;