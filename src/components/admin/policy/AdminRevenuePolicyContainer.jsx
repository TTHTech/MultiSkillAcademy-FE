import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus,
  RefreshCw,
  Download,
  Gift,
  Zap
} from "lucide-react";
// Component imports - trong thực tế, các component này sẽ được import từ các file riêng
import PolicyList from './PolicyList';
import PolicyForm from './PolicyForm';
import PolicyPreview from './PolicyPreview';
import PolicyStatistics from './PolicyStatistics';
import PolicyFilters from './PolicyFilters';
import Toast from './Toast';
import ErrorBoundary from './ErrorBoundary';
import ActivePoliciesManager from './ActivePoliciesManager';


// Mock components để demo
// const PolicyList = ({ policies, loading, error, currentPage, totalPages, onPageChange, onEdit, onDelete, onToggleActivation, onDuplicate, onPreview, onViewStats }) => (
//   <div className="bg-gray-800 rounded-lg p-4">
//     <p className="text-white">PolicyList Component</p>
//   </div>
// );

// const PolicyForm = ({ policy, onClose, onSave }) => (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//     <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
//       <p className="text-white">PolicyForm Component</p>
//       <button onClick={onClose} className="mt-4 bg-gray-600 text-white px-4 py-2 rounded">Close</button>
//     </div>
//   </div>
// );

// const PolicyPreview = ({ policy, onClose, onApply }) => (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//     <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
//       <p className="text-white">PolicyPreview Component</p>
//       <button onClick={onClose} className="mt-4 bg-gray-600 text-white px-4 py-2 rounded">Close</button>
//     </div>
//   </div>
// );

// const PolicyStatistics = ({ policyId, policyName, onClose }) => (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//     <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
//       <p className="text-white">PolicyStatistics Component</p>
//       <button onClick={onClose} className="mt-4 bg-gray-600 text-white px-4 py-2 rounded">Close</button>
//     </div>
//   </div>
// );

// const PolicyFilters = ({ filters, onFilterChange, totalElements }) => (
//   <div className="bg-gray-800 rounded-lg p-4">
//     <p className="text-white">PolicyFilters Component</p>
//   </div>
// );

// const ActivePoliciesManager = ({ isOpen, onClose, policies, onTogglePolicy, onRefresh }) => (
//   isOpen ? (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
//         <p className="text-white">ActivePoliciesManager Component</p>
//         <button onClick={onClose} className="mt-4 bg-gray-600 text-white px-4 py-2 rounded">Close</button>
//       </div>
//     </div>
//   ) : null
// );

// const Toast = ({ type, message }) => (
//   <div className={`fixed bottom-4 right-4 ${type === 'success' ? 'bg-green-700' : 'bg-red-700'} text-white p-4 rounded-lg shadow-xl z-50`}>
//     {message}
//   </div>
// );

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   render() {
//     if (this.state.hasError) {
//       return <div className="text-red-400 p-4">Something went wrong.</div>;
//     }
//     return this.props.children;
//   }
// }

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const AdminRevenuePolicyContainer = () => {
  // States
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Dialog states
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showActiveManager, setShowActiveManager] = useState(false);
  
  // Selected items
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [editingPolicy, setEditingPolicy] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    policyType: 'all',
    category: 'all',
    active: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const itemsPerPage = 10;

  // Toast notification helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch policies
  const fetchPolicies = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      
      const params = new URLSearchParams({
        page: page - 1,
        size: itemsPerPage,
        sort: `${filters.sortBy},${filters.sortOrder}`
      });
      
      // Add filters
      if (filters.search) params.append('search', filters.search);
      if (filters.policyType !== 'all') params.append('policyType', filters.policyType);
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.active !== 'all') params.append('active', filters.active);
      
      const response = await fetch(
        `${baseUrl}/api/admin/revenue-policies?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        throw new Error(`Failed to fetch policies: ${response.status}`);
      }

      const data = await response.json();
      setPolicies(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching policies:", error);
      setError(error.message);
      showToast("error", `Lỗi khi tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch policy presets
  const fetchPresets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${baseUrl}/api/admin/revenue-policies/presets`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Error fetching presets:", error);
      showToast("error", "Không thể tải mẫu chính sách");
    }
    return [];
  };

  // Create policy
  const createPolicy = async (policyData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${baseUrl}/api/admin/revenue-policies`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(policyData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể tạo chính sách');
      }

      const newPolicy = await response.json();
      showToast("success", "Tạo chính sách thành công");
      setShowForm(false);
      fetchPolicies(currentPage);
      return newPolicy;
    } catch (error) {
      showToast("error", error.message);
      throw error;
    }
  };

  // Update policy
  const updatePolicy = async (id, policyData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${baseUrl}/api/admin/revenue-policies/${id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(policyData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể cập nhật chính sách');
      }

      const updatedPolicy = await response.json();
      showToast("success", "Cập nhật chính sách thành công");
      setShowForm(false);
      setEditingPolicy(null);
      fetchPolicies(currentPage);
      return updatedPolicy;
    } catch (error) {
      showToast("error", error.message);
      throw error;
    }
  };

  // Delete policy
  const deletePolicy = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chính sách này?')) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${baseUrl}/api/admin/revenue-policies/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể xóa chính sách');
      }

      showToast("success", "Xóa chính sách thành công");
      fetchPolicies(currentPage);
    } catch (error) {
      showToast("error", error.message);
    }
  };

  // Toggle policy activation
  const togglePolicyActivation = async (id, currentStatus) => {
    const action = currentStatus ? 'vô hiệu hóa' : 'kích hoạt';
    
    if (!window.confirm(`Bạn có chắc chắn muốn ${action} chính sách này?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${baseUrl}/api/admin/revenue-policies/${id}/toggle-activation`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ active: !currentStatus }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Không thể ${action} chính sách`);
      }

      showToast("success", `Đã ${action} chính sách thành công`);
      fetchPolicies(currentPage);
    } catch (error) {
      showToast("error", error.message);
    }
  };

  // Duplicate policy
  const duplicatePolicy = async (id, newName) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${baseUrl}/api/admin/revenue-policies/${id}/duplicate?newName=${encodeURIComponent(newName)}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể sao chép chính sách');
      }

      const newPolicy = await response.json();
      showToast("success", "Sao chép chính sách thành công");
      fetchPolicies(currentPage);
      return newPolicy;
    } catch (error) {
      showToast("error", error.message);
      throw error;
    }
  };

  // Apply policy
  const applyPolicy = async (request) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${baseUrl}/api/admin/revenue-policies/apply`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Không thể áp dụng chính sách');
      }

      showToast("success", result.message || "Áp dụng chính sách thành công");
      setShowPreview(false);
      fetchPolicies(currentPage);
      return result;
    } catch (error) {
      showToast("error", error.message);
      throw error;
    }
  };

  // Export policies
  const exportPolicies = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Tên,Loại,Danh mục,Trạng thái,Ngày tạo,Số lần sử dụng\n";
    
    policies.forEach(policy => {
      csvContent += `"${policy.name}",`;
      csvContent += `"${policy.policyType}",`;
      csvContent += `"${policy.category || 'N/A'}",`;
      csvContent += `"${policy.active ? 'Đang hoạt động' : 'Không hoạt động'}",`;
      csvContent += `"${new Date(policy.createdAt).toLocaleDateString('vi-VN')}",`;
      csvContent += `${policy.usageCount}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `chinh-sach-doanh-thu_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    
    showToast("success", "Đã xuất dữ liệu thành công");
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Initial load
  useEffect(() => {
    fetchPolicies();
  }, [filters]);

  // Handle preset selection
  const handlePresetSelect = async () => {
    const presets = await fetchPresets();
    
    // Show preset selection dialog
    const selectedPreset = await new Promise((resolve) => {
      const dialog = document.createElement('div');
      dialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      dialog.innerHTML = `
        <div class="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <h3 class="text-xl font-bold text-white mb-4">Chọn mẫu chính sách</h3>
          <div class="grid gap-4">
            ${presets.map((preset, index) => `
              <div class="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors" data-index="${index}">
                <h4 class="font-semibold text-white">${preset.name}</h4>
                <p class="text-gray-300 text-sm mt-1">${preset.description}</p>
              </div>
            `).join('')}
          </div>
          <button class="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500" onclick="this.parentElement.parentElement.remove()">
            Đóng
          </button>
        </div>
      `;
      
      dialog.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-index')) {
          const index = parseInt(e.target.getAttribute('data-index'));
          resolve(presets[index]);
          dialog.remove();
        } else if (e.target.closest('[data-index]')) {
          const index = parseInt(e.target.closest('[data-index]').getAttribute('data-index'));
          resolve(presets[index]);
          dialog.remove();
        }
      });
      
      document.body.appendChild(dialog);
    });
    
    if (selectedPreset) {
      setEditingPolicy(selectedPreset);
      setShowForm(true);
    }
  };

  return (
    <ErrorBoundary>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Quản lý Chính sách Doanh thu</h1>
              <p className="text-indigo-200 mt-1">Thiết lập và quản lý các chính sách chia sẻ doanh thu cho giảng viên</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowActiveManager(true)}
                className="bg-yellow-700 text-yellow-100 hover:bg-yellow-600 px-4 py-2 rounded-lg shadow-md flex items-center transition duration-200 text-sm font-medium"
              >
                <Zap size={16} className="mr-2" />
                Quản lý kích hoạt
              </button>
              <button
                onClick={handlePresetSelect}
                className="bg-gray-800 text-purple-300 hover:bg-gray-700 px-4 py-2 rounded-lg shadow-md flex items-center transition duration-200 text-sm font-medium border border-gray-700"
              >
                <Gift size={16} className="mr-2" />
                Mẫu có sẵn
              </button>
              <button
                onClick={exportPolicies}
                className="bg-gray-800 text-purple-300 hover:bg-gray-700 px-4 py-2 rounded-lg shadow-md flex items-center transition duration-200 text-sm font-medium border border-gray-700"
              >
                <Download size={16} className="mr-2" />
                Xuất CSV
              </button>
              <button
                onClick={() => fetchPolicies(currentPage)}
                className="bg-gray-800 text-purple-300 hover:bg-gray-700 px-4 py-2 rounded-lg shadow-md flex items-center transition duration-200 text-sm font-medium border border-gray-700"
              >
                <RefreshCw size={16} className="mr-2" />
                Làm mới
              </button>
              <button
                onClick={() => {
                  setEditingPolicy(null);
                  setShowForm(true);
                }}
                className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg shadow-md flex items-center transition duration-200 text-sm font-medium"
              >
                <Plus size={16} className="mr-2" />
                Tạo chính sách mới
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <PolicyFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          totalElements={totalElements}
        />

        {/* Policy List */}
        <PolicyList
          policies={policies}
          loading={loading}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => fetchPolicies(page)}
          onEdit={(policy) => {
            setEditingPolicy(policy);
            setShowForm(true);
          }}
          onDelete={deletePolicy}
          onToggleActivation={(policy) => togglePolicyActivation(policy.id, policy.active)}
          onDuplicate={(policy) => {
            const newName = prompt('Nhập tên cho bản sao:', `${policy.name} (Sao chép)`);
            if (newName) {
              duplicatePolicy(policy.id, newName);
            }
          }}
          onPreview={(policy) => {
            setSelectedPolicy(policy);
            setShowPreview(true);
          }}
          onViewStats={(policy) => {
            setSelectedPolicy(policy);
            setShowStatistics(true);
          }}
        />

        {/* Dialogs */}
        {showForm && (
          <PolicyForm
            policy={editingPolicy}
            onClose={() => {
              setShowForm(false);
              setEditingPolicy(null);
            }}
            onSave={(data) => {
              if (editingPolicy?.id) {
                return updatePolicy(editingPolicy.id, data);
              } else {
                return createPolicy(data);
              }
            }}
          />
        )}

        {showPreview && selectedPolicy && (
          <PolicyPreview
            policy={selectedPolicy}
            onClose={() => {
              setShowPreview(false);
              setSelectedPolicy(null);
            }}
            onApply={applyPolicy}
          />
        )}

        {showStatistics && selectedPolicy && (
          <PolicyStatistics
            policyId={selectedPolicy.id}
            policyName={selectedPolicy.name}
            onClose={() => {
              setShowStatistics(false);
              setSelectedPolicy(null);
            }}
          />
        )}

        {/* Active Policies Manager */}
        <ActivePoliciesManager
          isOpen={showActiveManager}
          onClose={() => setShowActiveManager(false)}
          policies={policies}
          onTogglePolicy={togglePolicyActivation}
          onRefresh={() => fetchPolicies(currentPage)}
        />

        {/* Toast */}
        {toast && <Toast type={toast.type} message={toast.message} />}
      </motion.div>
    </ErrorBoundary>
  );
};

export default AdminRevenuePolicyContainer;