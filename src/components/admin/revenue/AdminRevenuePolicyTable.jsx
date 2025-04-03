import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit, Trash, Check, X, ChevronDown, ChevronUp } from "lucide-react";

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-4 rounded-lg my-4">
          <h2 className="text-lg font-bold">Đã xảy ra lỗi</h2>
          <p className="text-sm">{this.state.error?.message || 'Không thể hiển thị component này'}</p>
          <button 
            className="mt-3 bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Tải lại trang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main component wrapper with error boundary
const AdminRevenuePolicyTableWithErrorBoundary = () => {
  return (
    <ErrorBoundary>
      <AdminRevenuePolicyTable />
    </ErrorBoundary>
  );
};

// Main component
const AdminRevenuePolicyTable = () => {
  console.log("Rendering AdminRevenuePolicyTable component");

  // Safe state initialization
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const policiesPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [currentPolicy, setCurrentPolicy] = useState({
    id: null,
    name: "",
    description: "",
    percentage: 0,
    minCoursePrice: 0,
    maxCoursePrice: 0,
    active: false,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState(null);

  const [presets, setPresets] = useState([]);
  const [showPresets, setShowPresets] = useState(false);

  // Initial data load
  useEffect(() => {
    fetchPolicies();
    fetchPresets();
  }, []);

  // Fetch policies with pagination
  const fetchPolicies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found, please login again.");
      }

      const response = await fetch(
        `http://localhost:8080/api/admin/revenue-policies?page=${currentPage - 1}&size=${policiesPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Failed to fetch policies: ${response.status}`);
      }

      const data = await response.json();
      
      // Safety check
      if (!Array.isArray(data)) {
        console.warn("API response is not an array:", data);
        setPolicies([]);
        setFilteredPolicies([]);
        setTotalPages(1);
      } else {
        setPolicies(data);
        setFilteredPolicies(data);
        
        // Calculate total pages - usually this would come from a header or metadata
        // This is a fallback
        const count = data.length > 0 && data[0].totalCount ? data[0].totalCount : data.length;
        setTotalPages(Math.max(1, Math.ceil(count / policiesPerPage)));
      }
    } catch (error) {
      console.error("Error fetching policies:", error);
      setError(error.message);
      // Set empty defaults to prevent rendering errors
      setPolicies([]);
      setFilteredPolicies([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch presets
  const fetchPresets = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found, please login again.");
      }

      const response = await fetch(
        "http://localhost:8080/api/admin/revenue-policies/presets",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch policy presets.");
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setPresets(data);
      } else {
        console.warn("Preset data is not an array:", data);
        setPresets([]);
      }
    } catch (error) {
      console.error("Error fetching presets:", error);
      setPresets([]);
    }
  };

  // Fetch single policy by ID
  const fetchPolicyById = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found, please login again.");
      }

      const response = await fetch(
        `http://localhost:8080/api/admin/revenue-policies/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch policy details.");
      }

      const data = await response.json();
      setCurrentPolicy(data);
    } catch (error) {
      console.error("Error fetching policy details:", error);
      setError(error.message);
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchPolicies(); // Re-fetch with new page number
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    // Safety check
    if (!policies || !Array.isArray(policies)) {
      setFilteredPolicies([]);
      return;
    }
    
    const filtered = policies.filter((policy) => {
      const nameMatch = policy.name && policy.name.toLowerCase().includes(term);
      const descMatch = policy.description && policy.description.toLowerCase().includes(term);
      return nameMatch || descMatch;
    });
    
    setFilteredPolicies(filtered);
    setCurrentPage(1);
  };

  // Handle sorting
  const handleSort = (field) => {
    const newDirection = field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    
    // Safety check
    if (!filteredPolicies || !Array.isArray(filteredPolicies)) return;
    
    const sorted = [...filteredPolicies].sort((a, b) => {
      // Handle null/undefined values
      if (a[field] === undefined) return newDirection === "asc" ? -1 : 1;
      if (b[field] === undefined) return newDirection === "asc" ? 1 : -1;
      
      return newDirection === "asc"
        ? a[field] > b[field] ? 1 : -1
        : a[field] < b[field] ? 1 : -1;
    });
    
    setFilteredPolicies(sorted);
  };

  // Modal handlers
  const openCreateModal = () => {
    setCurrentPolicy({
      id: null,
      name: "",
      description: "",
      percentage: 0,
      minCoursePrice: 0,
      maxCoursePrice: 0,
      active: false,
    });
    setFormMode("create");
    setIsModalOpen(true);
  };

  const openEditModal = (policy) => {
    if (!policy || !policy.id) return;
    fetchPolicyById(policy.id);
    setFormMode("edit");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentPolicy({
      ...currentPolicy,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found, please login again.");
      }

      const url = formMode === "create" 
        ? "http://localhost:8080/api/admin/revenue-policies"
        : `http://localhost:8080/api/admin/revenue-policies/${currentPolicy.id}`;
      
      const method = formMode === "create" ? "POST" : "PUT";
      
      // Ensure numeric fields are sent as numbers
      const policyToSend = {
        ...currentPolicy,
        percentage: Number(currentPolicy.percentage),
        minCoursePrice: Number(currentPolicy.minCoursePrice),
        maxCoursePrice: Number(currentPolicy.maxCoursePrice)
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(policyToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to ${formMode} policy: ${errorText}`);
      }

      // Refresh policies
      fetchPolicies();
      closeModal();
    } catch (error) {
      console.error(`Error ${formMode}ing policy:`, error);
      setError(error.message);
    }
  };

  // Delete handlers
  const confirmDelete = (policy) => {
    setPolicyToDelete(policy);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setPolicyToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleDelete = async () => {
    if (!policyToDelete || !policyToDelete.id) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found, please login again.");
      }

      const response = await fetch(
        `http://localhost:8080/api/admin/revenue-policies/${policyToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete policy. Status: ${response.status}`);
      }

      // Refresh policies and reset state
      fetchPolicies();
      setShowDeleteConfirm(false);
      setPolicyToDelete(null);
    } catch (error) {
      console.error("Error deleting policy:", error);
      setError(error.message);
    }
  };

  // Activate handler
  const handleActivate = async (id) => {
    if (!id) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found, please login again.");
      }

      const response = await fetch(
        `http://localhost:8080/api/admin/revenue-policies/${id}/activate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to activate policy.");
      }

      // Refresh policies
      fetchPolicies();
    } catch (error) {
      console.error("Error activating policy:", error);
      setError(error.message);
    }
  };

  // Preset handlers
  const applyPreset = (preset) => {
    if (!preset) return;
    
    setCurrentPolicy({
      ...currentPolicy,
      name: preset.name || "",
      description: preset.description || "",
      percentage: preset.percentage || 0,
      minCoursePrice: preset.minCoursePrice || 0,
      maxCoursePrice: preset.maxCoursePrice || 0,
    });
    setShowPresets(false);
  };

  // Derived values with safety checks
  const currentPolicies = filteredPolicies && Array.isArray(filteredPolicies)
    ? filteredPolicies.slice(
        (currentPage - 1) * policiesPerPage,
        currentPage * policiesPerPage
      )
    : [];

  // Loading state
  if (loading && (!policies || policies.length === 0)) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Đang tải...</div>
      </div>
    );
  }

  // Error state
  if (error && (!policies || policies.length === 0)) {
    return (
      <div className="bg-red-500 text-white p-4 rounded-lg">
        <p>Lỗi: {error}</p>
        <button 
          className="mt-2 bg-white text-red-500 px-3 py-1 rounded"
          onClick={() => {
            setError(null);
            fetchPolicies();
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Chính sách doanh thu</h2>
        <button
          onClick={openCreateModal}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Thêm chính sách mới
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Tìm kiếm chính sách..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-white">
          <thead className="text-xs uppercase bg-gray-700 text-white">
            <tr>
              <th 
                className="py-3 px-4 cursor-pointer" 
                onClick={() => handleSort("id")}
              >
                ID
                {sortField === "id" && (
                  sortDirection === "asc" 
                    ? <ChevronUp size={14} className="inline ml-1" /> 
                    : <ChevronDown size={14} className="inline ml-1" />
                )}
              </th>
              <th 
                className="py-3 px-4 cursor-pointer" 
                onClick={() => handleSort("name")}
              >
                Tên
                {sortField === "name" && (
                  sortDirection === "asc" 
                    ? <ChevronUp size={14} className="inline ml-1" /> 
                    : <ChevronDown size={14} className="inline ml-1" />
                )}
              </th>
              <th className="py-3 px-4">Mô tả</th>
              <th 
                className="py-3 px-4 cursor-pointer" 
                onClick={() => handleSort("percentage")}
              >
                Phần trăm
                {sortField === "percentage" && (
                  sortDirection === "asc" 
                    ? <ChevronUp size={14} className="inline ml-1" /> 
                    : <ChevronDown size={14} className="inline ml-1" />
                )}
              </th>
              <th className="py-3 px-4">Phạm vi giá</th>
              <th 
                className="py-3 px-4 cursor-pointer" 
                onClick={() => handleSort("active")}
              >
                Trạng thái
                {sortField === "active" && (
                  sortDirection === "asc" 
                    ? <ChevronUp size={14} className="inline ml-1" /> 
                    : <ChevronDown size={14} className="inline ml-1" />
                )}
              </th>
              <th className="py-3 px-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentPolicies.length > 0 ? (
              currentPolicies.map((policy) => (
                <tr key={policy.id || `policy-${Math.random()}`} className="border-b border-gray-600">
                  <td className="py-3 px-4">{policy.id || 'N/A'}</td>
                  <td className="py-3 px-4">{policy.name || 'Chưa đặt tên'}</td>
                  <td className="py-3 px-4">
                    {policy.description
                      ? (policy.description.length > 50
                        ? `${policy.description.substring(0, 50)}...`
                        : policy.description)
                      : 'Không có mô tả'}
                  </td>
                  <td className="py-3 px-4">{policy.percentage || 0}%</td>
                  <td className="py-3 px-4">
                    ${policy.minCoursePrice || 0} - ${policy.maxCoursePrice || 0}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        policy.active
                          ? "bg-green-500 text-white"
                          : "bg-gray-500 text-gray-200"
                      }`}
                    >
                      {policy.active ? "Đang hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex space-x-2">
                    <button
                      onClick={() => openEditModal(policy)}
                      className="text-blue-400 hover:text-blue-300"
                      title="Sửa"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => confirmDelete(policy)}
                      className="text-red-400 hover:text-red-300"
                      title="Xóa"
                    >
                      <Trash size={18} />
                    </button>
                    {!policy.active && (
                      <button
                        onClick={() => handleActivate(policy.id)}
                        className="text-green-400 hover:text-green-300"
                        title="Kích hoạt"
                      >
                        <Check size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-400">
                  Không tìm thấy chính sách nào. Tạo mới để bắt đầu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Luôn hiển thị */}
      <div className="flex justify-between mt-4">
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-600 disabled:text-gray-400"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trước
        </button>

        <div className="flex items-center">
          {(() => {
            // Nếu không có trang nào, vẫn hiển thị trang 1
            const pages = [];
            const displayedTotalPages = Math.max(1, totalPages || 1);
            const maxVisiblePages = 5;
            
            if (displayedTotalPages <= maxVisiblePages) {
              // Show all pages if total is small
              for (let i = 1; i <= displayedTotalPages; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-4 py-2 mx-1 rounded-lg ${
                      currentPage === i
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {i}
                  </button>
                );
              }
            } else {
              // Show limited pages with first/last and ellipsis
              const showFirst = currentPage > 2;
              const showLast = currentPage < displayedTotalPages - 1;
              const startPage = Math.max(1, currentPage - 1);
              const endPage = Math.min(displayedTotalPages, startPage + 2);
              
              if (showFirst) {
                pages.push(
                  <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className="px-4 py-2 mx-1 rounded-lg bg-gray-700 text-gray-300"
                  >
                    1
                  </button>
                );
                
                if (startPage > 2) {
                  pages.push(
                    <span key="left-dots" className="px-4 py-2">
                      ...
                    </span>
                  );
                }
              }
              
              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-4 py-2 mx-1 rounded-lg ${
                      currentPage === i
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {i}
                  </button>
                );
              }
              
              if (showLast) {
                if (endPage < displayedTotalPages - 1) {
                  pages.push(
                    <span key="right-dots" className="px-4 py-2">
                      ...
                    </span>
                  );
                }
                
                pages.push(
                  <button
                    key={displayedTotalPages}
                    onClick={() => handlePageChange(displayedTotalPages)}
                    className="px-4 py-2 mx-1 rounded-lg bg-gray-700 text-gray-300"
                  >
                    {displayedTotalPages}
                  </button>
                );
              }
            }
            
            return pages;
          })()}
        </div>

        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-600 disabled:text-gray-400"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Tiếp
        </button>
      </div>

      {/* Form chỉnh sửa/tạo mới hiển thị ở giữa trang */}
      {isModalOpen && (
        <motion.div
          className="bg-gray-800 rounded-xl p-6 mb-6 w-full border border-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">
            {formMode === "create" ? "Tạo chính sách mới" : "Chỉnh sửa chính sách"}
          </h3>

          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 mb-2">Tên chính sách</label>
                <input
                  type="text"
                  name="name"
                  value={currentPolicy.name || ""}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white w-full p-2 rounded-lg"
                  required
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setShowPresets(!showPresets)}
                  className="bg-blue-600 text-white p-2 rounded-lg w-full"
                >
                  Sử dụng mẫu có sẵn
                </button>
              </div>

              {showPresets && (
                <div className="col-span-2 bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-bold mb-2">Chọn mẫu</h4>
                  {presets && Array.isArray(presets) && presets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {presets.map((preset) => (
                        <div
                          key={preset.id || `preset-${Math.random()}`}
                          onClick={() => applyPreset(preset)}
                          className="bg-gray-600 p-3 rounded-lg cursor-pointer hover:bg-gray-500"
                        >
                          <p className="font-bold text-white">{preset.name || "Mẫu không tên"}</p>
                          <p className="text-sm text-gray-300">{preset.percentage || 0}%</p>
                          <p className="text-xs text-gray-400">
                            ${preset.minCoursePrice || 0} - ${preset.maxCoursePrice || 0}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-2">Không có mẫu nào khả dụng</p>
                  )}
                </div>
              )}

              <div className="col-span-2">
                <label className="block text-gray-300 mb-2">Mô tả</label>
                <textarea
                  name="description"
                  value={currentPolicy.description || ""}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white w-full p-2 rounded-lg min-h-20"
                  rows="3"
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Phần trăm (%)</label>
                <input
                  type="number"
                  name="percentage"
                  value={currentPolicy.percentage || 0}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white w-full p-2 rounded-lg"
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Trạng thái</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="active"
                    checked={currentPolicy.active || false}
                    onChange={handleInputChange}
                    className="mr-2 h-5 w-5"
                  />
                  <span className="text-white">Hoạt động</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Giá tối thiểu ($)
                </label>
                <input
                  type="number"
                  name="minCoursePrice"
                  value={currentPolicy.minCoursePrice || 0}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white w-full p-2 rounded-lg"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Giá tối đa ($)
                </label>
                <input
                  type="number"
                  name="maxCoursePrice"
                  value={currentPolicy.maxCoursePrice || 0}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white w-full p-2 rounded-lg"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                {formMode === "create" ? "Tạo chính sách" : "Cập nhật"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && policyToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <motion.div
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">Xác nhận xóa</h3>
            <p className="text-gray-300 mb-6">
              Bạn có chắc chắn muốn xóa chính sách "{policyToDelete.name || 'Không tên'}"? Thao tác này không thể hoàn tác.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Xóa
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Error notification */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="absolute top-2 right-2 text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default AdminRevenuePolicyTableWithErrorBoundary;