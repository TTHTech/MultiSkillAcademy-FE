import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, X } from "lucide-react";

// Import các component đã tách
import PolicyTable from "./PolicyTable";
import PolicyFormModal from "./PolicyFormModal";

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

// Delete confirmation modal
const DeleteConfirmationModal = ({ isOpen, policy, onCancel, onConfirm }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <motion.div
        className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h3 className="text-xl font-bold text-white mb-4">Xác nhận xóa</h3>
        <p className="text-gray-300 mb-6">
          Bạn có chắc chắn muốn xóa chính sách "{policy.name || 'Không tên'}"? Thao tác này không thể hoàn tác.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Xóa
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Toast notification component
const ToastNotification = ({ type, message, onClose }) => {
  return (
    <div className={`fixed bottom-4 right-4 ${type === "success" ? "bg-green-500" : "bg-red-500"} text-white p-4 rounded-lg shadow-lg z-50`}>
      <p>{message}</p>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-white"
      >
        <X size={16} />
      </button>
    </div>
  );
};

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
  const [toast, setToast] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [policyCount, setPolicyCount] = useState(0);
  const policiesPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [currentPolicy, setCurrentPolicy] = useState({
    id: null,
    name: "",
    percentage: "",
    minCoursePrice: "",
    maxCoursePrice: "",
    active: false,
    instructorReferredRate: { default: 0.7 },
    platformReferredRate: {
      "0-10000000": 0.5,
      "10000000-50000000": 0.6,
      "50000000-infinity": 0.7
    },
    ratingBonusThreshold: 4.5,
    ratingBonusPercentage: 0.05,
    maxRefundRate: 0.05,
    validFrom: formatDateForApi(new Date()),
    validTo: formatDateForApi(addOneYear(new Date()))
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState(null);

  const [presets, setPresets] = useState([]);
  const [showPresets, setShowPresets] = useState(false);

  // Initial data load - run only once
  useEffect(() => {
    fetchPolicies(1); // Start with page 1
    fetchPresets();
  }, []);

  // Error handling function
  const handleAuthError = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    
    // Redirect to login page
    window.location.href = "/login";
  };

  // Hàm hiển thị toast message
  const showToast = (type, message) => {
    setToast({ type, message });
    // Tự động ẩn toast sau 3 giây
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Fetch policies with pagination
  const fetchPolicies = async (page = currentPage) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError();
        throw new Error("No token found, please login again.");
      }

      // Đảm bảo page bắt đầu từ 1 cho UI nhưng API bắt đầu từ 0
      const apiPage = Math.max(0, page - 1);
      
      // Gọi API lấy phần tử theo trang
      const response = await fetch(
        `http://localhost:8080/api/admin/revenue-policies?page=${apiPage}&size=${policiesPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        
        // Kiểm tra lỗi xác thực
        if (response.status === 401 || response.status === 403) {
          handleAuthError();
          throw new Error("Session expired. Please login again.");
        }
        
        throw new Error(`Failed to fetch policies: ${response.status}`);
      }

      // Lấy dữ liệu JSON từ response
      let data;
      try {
        data = await response.json();
        console.log("API response:", data);
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        throw new Error("Invalid response format from server");
      }
      
      // Xử lý các định dạng response khác nhau
      if (data && data.content && Array.isArray(data.content)) {
        // Spring Data có định dạng Page object
        setPolicies(data.content);
        setFilteredPolicies(data.content);
        
        // Sử dụng thông tin phân trang từ API
        if (data.totalElements !== undefined) {
          setPolicyCount(data.totalElements);
        }
        
        // Sử dụng totalPages từ API
        if (data.totalPages !== undefined) {
          setTotalPages(Math.max(1, data.totalPages));
        } else if (data.totalElements !== undefined) {
          const calculatedTotalPages = Math.ceil(data.totalElements / policiesPerPage);
          setTotalPages(Math.max(1, calculatedTotalPages));
        } else {
          setTotalPages(1);
        }
        
        // API page bắt đầu từ 0
        setCurrentPage(data.number !== undefined ? data.number + 1 : page);
      } 
      else if (Array.isArray(data)) {
        // Trường hợp API trả về mảng - điều này có thể là toàn bộ dữ liệu
        console.log(`API returned an array with ${data.length} items`);
        
        // Lưu toàn bộ dữ liệu
        setPolicies(data);
        
        // Tổng số phần tử là độ dài của mảng
        const totalItems = data.length;
        setPolicyCount(totalItems);
        
        // Tính toán lại số trang
        const calculatedTotalPages = Math.ceil(totalItems / policiesPerPage);
        console.log(`Calculated total pages: ${calculatedTotalPages}`);
        setTotalPages(Math.max(1, calculatedTotalPages));
        
        // Phân trang dữ liệu ở client-side
        const startIndex = (page - 1) * policiesPerPage;
        const endIndex = Math.min(startIndex + policiesPerPage, data.length);
        const paginatedData = data.slice(startIndex, endIndex);
        setFilteredPolicies(paginatedData);
        
        setCurrentPage(page);
      } 
      else {
        console.warn("API response format not recognized:", data);
        setPolicies([]);
        setFilteredPolicies([]);
        setTotalPages(1);
        setCurrentPage(1);
        setPolicyCount(0);
      }
      
    } catch (error) {
      console.error("Error fetching policies:", error);
      setError(error.message);
      showToast("error", `Lỗi khi tải dữ liệu: ${error.message}`);
      // Set empty defaults to prevent rendering errors
      setPolicies([]);
      setFilteredPolicies([]);
      setTotalPages(1);
      setPolicyCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch presets
  const fetchPresets = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError();
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
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        
        // Kiểm tra lỗi xác thực
        if (response.status === 401 || response.status === 403) {
          handleAuthError();
          throw new Error("Session expired. Please login again.");
        }
        
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
        handleAuthError();
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
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        
        // Kiểm tra lỗi xác thực
        if (response.status === 401 || response.status === 403) {
          handleAuthError();
          throw new Error("Session expired. Please login again.");
        }
        
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

    console.log(`Chuyển đến trang ${page} / ${totalPages}`);
    
    // Cập nhật state page trước
    setCurrentPage(page);
    
    // Luôn gọi API để fetch dữ liệu trang mới
    fetchPolicies(page);
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    // Safety check
    if (!policies || !Array.isArray(policies)) {
      setFilteredPolicies([]);
      setTotalPages(0);
      return;
    }
    
    if (term === "") {
      // Nếu xóa điều kiện tìm kiếm, quay lại trang 1 và lấy dữ liệu từ API
      setCurrentPage(1);
      fetchPolicies(1);
    } else {
      // Lọc tất cả policies theo điều kiện tìm kiếm
      const allFiltered = policies.filter((policy) => {
        return policy.name && policy.name.toLowerCase().includes(term);
      });
      
      // Tính toán số trang mới dựa trên kết quả tìm kiếm
      const totalFilteredItems = allFiltered.length;
      const newTotalPages = Math.max(1, Math.ceil(totalFilteredItems / policiesPerPage));
      
      // Cập nhật số lượng phần tử
      setPolicyCount(totalFilteredItems);
      
      // Luôn về trang 1 khi thay đổi điều kiện tìm kiếm
      setCurrentPage(1);
      setTotalPages(newTotalPages);
      
      // Lấy kết quả của trang đầu tiên
      const firstPageResults = allFiltered.slice(0, policiesPerPage);
      setFilteredPolicies(firstPageResults);
      
      console.log(`Search results: ${totalFilteredItems} items, ${newTotalPages} pages`);
    }
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
      percentage: "",
      minCoursePrice: "",
      maxCoursePrice: "",
      active: false,
      instructorReferredRate: { default: 0.7 },
      platformReferredRate: {
        "0-10000000": 0.5,
        "10000000-50000000": 0.6,
        "50000000-infinity": 0.7
      },
      ratingBonusThreshold: 4.5,
      ratingBonusPercentage: 0.05,
      maxRefundRate: 0.05,
      validFrom: formatDateForApi(new Date()),
      validTo: formatDateForApi(addOneYear(new Date()))
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

  // Handle form submission
  const handleFormSubmit = async (formPolicy) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError();
        throw new Error("No token found, please login again.");
      }

      const url = formMode === "create" 
        ? "http://localhost:8080/api/admin/revenue-policies"
        : `http://localhost:8080/api/admin/revenue-policies/${formPolicy.id}`;
      
      const method = formMode === "create" ? "POST" : "PUT";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formPolicy),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        
        // Kiểm tra lỗi xác thực
        if (response.status === 401 || response.status === 403) {
          handleAuthError();
          throw new Error("Session expired. Please login again.");
        }
        
        throw new Error(`Failed to ${formMode} policy: ${errorText}`);
      }

      // Hiển thị thông báo thành công
      showToast("success", formMode === "create" ? "Tạo chính sách thành công" : "Cập nhật chính sách thành công");

      // Refresh policies - for create go to page 1, for edit stay on current page
      if (formMode === "create") {
        fetchPolicies(1);
      } else {
        fetchPolicies(currentPage);
      }
      closeModal();
    } catch (error) {
      console.error(`Error ${formMode}ing policy:`, error);
      setError(error.message);
      showToast("error", `Lỗi: ${error.message}`);
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
        handleAuthError();
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
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        
        // Kiểm tra lỗi xác thực
        if (response.status === 401 || response.status === 403) {
          handleAuthError();
          throw new Error("Session expired. Please login again.");
        }
        
        throw new Error(`Failed to delete policy. Status: ${response.status}`);
      }

      // Hiển thị thông báo thành công
      showToast("success", "Xóa chính sách thành công");

      // Refresh policies and reset state - keep on current page if possible
      fetchPolicies(currentPage);
      setShowDeleteConfirm(false);
      setPolicyToDelete(null);
    } catch (error) {
      console.error("Error deleting policy:", error);
      setError(error.message);
      showToast("error", `Lỗi: ${error.message}`);
    }
  };

  // Apply preset to form
  const applyPreset = (preset) => {
    if (!preset) return;
    
    setCurrentPolicy({
      ...currentPolicy,
      name: preset.name || "",
      instructorReferredRate: preset.instructorReferredRate || { default: 0.7 },
      platformReferredRate: preset.platformReferredRate || {
        "0-10000000": 0.5,
        "10000000-50000000": 0.6,
        "50000000-infinity": 0.7
      },
      ratingBonusThreshold: preset.ratingBonusThreshold || 4.5,
      ratingBonusPercentage: preset.ratingBonusPercentage || 0.05,
      maxRefundRate: preset.maxRefundRate || 0.05,
      validFrom: preset.validFrom || formatDateForApi(new Date()),
      validTo: preset.validTo || formatDateForApi(addOneYear(new Date())),
    });
    setShowPresets(false);
  };

  // Helper functions for date handling
  function formatDateForApi(date) {
    if (!date) return null;
    // Format to [YYYY, MM, DD, HH, MM] array format that backend expects
    const year = date.getFullYear();
    const month = date.getMonth() + 1;  // JS months are 0-indexed
    const day = date.getDate();
    return [year, month, day, 0, 0];
  }

  function addOneYear(date) {
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() + 1);
    return newDate;
  }

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

      {/* Table Component */}
      <PolicyTable 
        policies={filteredPolicies}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onEdit={openEditModal}
        onDelete={confirmDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        policyCount={policyCount}
      />

      {/* Form Modal Component */}
      {isModalOpen && (
        <PolicyFormModal
          isOpen={isModalOpen}
          onClose={closeModal}
          policy={currentPolicy}
          formMode={formMode}
          onSubmit={handleFormSubmit}
          presets={presets}
          showPresets={showPresets}
          setShowPresets={setShowPresets}
          applyPreset={applyPreset}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && policyToDelete && (
        <DeleteConfirmationModal
          isOpen={showDeleteConfirm}
          policy={policyToDelete}
          onCancel={cancelDelete}
          onConfirm={handleDelete}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </motion.div>
  );
};

export default AdminRevenuePolicyTableWithErrorBoundary;