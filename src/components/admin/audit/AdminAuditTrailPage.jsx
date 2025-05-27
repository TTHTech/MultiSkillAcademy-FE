import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield,
  Search,
  Filter,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  User,
  Activity,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  FileText,
  Database,
  Settings,
  ArrowUpDown,
  X,
  Loader,
  AlertTriangle
} from "lucide-react";
import Toast from "../revenue/Toast";
import ErrorBoundary from "../revenue/ErrorBoundary";

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

// Constants
const ITEMS_PER_PAGE = 20;

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

// Detail Modal Component
const AuditDetailModal = ({ log, onClose }) => {
  if (!log) return null;

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionTypeBadge = (actionType) => {
    const actionConfig = {
      'CREATE': { color: 'bg-green-900/50 text-green-300 border-green-500/30', icon: CheckCircle },
      'UPDATE_STATUS': { color: 'bg-blue-900/50 text-blue-300 border-blue-500/30', icon: Info },
      'PROCESS': { color: 'bg-purple-900/50 text-purple-300 border-purple-500/30', icon: Settings },
      'DELETE': { color: 'bg-red-900/50 text-red-300 border-red-500/30', icon: XCircle },
      'EXPORT': { color: 'bg-orange-900/50 text-orange-300 border-orange-500/30', icon: Download },
      'VIEW_DETAIL': { color: 'bg-gray-900/50 text-gray-300 border-gray-500/30', icon: Eye },
      'VIEW_LIST': { color: 'bg-gray-900/50 text-gray-300 border-gray-500/30', icon: FileText },
      'BATCH_APPROVE': { color: 'bg-emerald-900/50 text-emerald-300 border-emerald-500/30', icon: CheckCircle },
      'BATCH_CANCEL': { color: 'bg-red-900/50 text-red-300 border-red-500/30', icon: XCircle }
    };

    const config = actionConfig[actionType] || { color: 'bg-gray-900/50 text-gray-300 border-gray-500/30', icon: Activity };
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} border`}>
        <Icon className="w-3 h-3 mr-1" />
        {actionType}
      </span>
    );
  };

  const getEntityIcon = (entityName) => {
    switch (entityName) {
      case 'Payment': return <Database className="h-4 w-4 text-green-400" />;
      case 'User': return <User className="h-4 w-4 text-blue-400" />;
      case 'Instructor': return <User className="h-4 w-4 text-purple-400" />;
      default: return <Database className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <motion.div
        className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-600/50"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            <FileText className="mr-2 h-6 w-6 text-blue-400" />
            Chi tiết Audit Log
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 bg-slate-700 hover:bg-slate-600 rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <label className="text-slate-400 text-sm">ID</label>
              <p className="text-white font-medium">{log.id || 'N/A'}</p>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg">
              <label className="text-slate-400 text-sm">Thời gian</label>
              <p className="text-white font-medium">{formatDateTime(log.timestamp)}</p>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg">
              <label className="text-slate-400 text-sm">User</label>
              <p className="text-white font-medium">{log.username}</p>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg">
              <label className="text-slate-400 text-sm">IP Address</label>
              <p className="text-white font-medium">{log.ipAddress || 'N/A'}</p>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg">
              <label className="text-slate-400 text-sm">Action Type</label>
              <div className="mt-1">{getActionTypeBadge(log.actionType)}</div>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg">
              <label className="text-slate-400 text-sm">Entity</label>
              <div className="flex items-center mt-1">
                {getEntityIcon(log.entityName)}
                <span className="ml-2 text-white font-medium">{log.entityName}</span>
                {log.entityId && (
                  <span className="ml-1 text-slate-400">#{log.entityId}</span>
                )}
              </div>
            </div>
          </div>

          {(log.oldValue || log.newValue) && (
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <label className="text-slate-400 text-sm">Changes</label>
              <div className="mt-2 space-y-1">
                {log.oldValue && (
                  <div className="bg-red-900/20 border border-red-500/30 p-2 rounded text-sm">
                    <span className="text-red-400 font-medium">Old Value:</span>
                    <span className="text-red-300 ml-2">{log.oldValue}</span>
                  </div>
                )}
                {log.newValue && (
                  <div className="bg-green-900/20 border border-green-500/30 p-2 rounded text-sm">
                    <span className="text-green-400 font-medium">New Value:</span>
                    <span className="text-green-300 ml-2">{log.newValue}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {log.comment && (
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <label className="text-slate-400 text-sm">Comment</label>
              <p className="text-white mt-1">{log.comment}</p>
            </div>
          )}

          {log.userAgent && (
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <label className="text-slate-400 text-sm">User Agent</label>
              <p className="text-white mt-1 text-xs break-all">{log.userAgent}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AdminAuditTrailPage = () => {
  // Inject animation styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = animationStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  // States
  const [allAuditLogs, setAllAuditLogs] = useState([]);
  const [filteredAuditLogs, setFilteredAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    username: "",
    actionType: "",
    entityName: "",
    entityId: "",
    ipAddress: "",
    startDate: "",
    endDate: "",
    search: ""
  });

  // UI states
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState("desc");
  const [exportLoading, setExportLoading] = useState(false);

  // Toast helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Auth helpers
  const handleAuthError = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch audit logs
  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError();
        return;
      }

      const response = await fetch(
        `${baseUrl}/api/admin/audit-trail`,
        { headers: getAuthHeaders() }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          handleAuthError();
          return;
        }
        throw new Error(`Failed to fetch audit logs: ${response.status}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setAllAuditLogs(data);
        setFilteredAuditLogs(data);
      } else if (data.content) {
        setAllAuditLogs(data.content);
        setFilteredAuditLogs(data.content);
      } else {
        setAllAuditLogs([]);
        setFilteredAuditLogs([]);
      }

    } catch (error) {
      console.error("Error fetching audit logs:", error);
      setError(error.message);
      showToast("error", `Lỗi khi tải audit logs: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Frontend filtering
  const applyFilters = () => {
    let filtered = [...allAuditLogs];

    // Text search in comment
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(log => 
        (log.comment && log.comment.toLowerCase().includes(searchTerm)) ||
        (log.username && log.username.toLowerCase().includes(searchTerm)) ||
        (log.actionType && log.actionType.toLowerCase().includes(searchTerm)) ||
        (log.entityName && log.entityName.toLowerCase().includes(searchTerm)) ||
        (log.oldValue && log.oldValue.toLowerCase().includes(searchTerm)) ||
        (log.newValue && log.newValue.toLowerCase().includes(searchTerm))
      );
    }

    // Username filter
    if (filters.username.trim()) {
      filtered = filtered.filter(log => 
        log.username && log.username.toLowerCase().includes(filters.username.toLowerCase())
      );
    }

    // Action type filter
    if (filters.actionType) {
      filtered = filtered.filter(log => log.actionType === filters.actionType);
    }

    // Entity name filter
    if (filters.entityName) {
      filtered = filtered.filter(log => log.entityName === filters.entityName);
    }

    // Entity ID filter
    if (filters.entityId.trim()) {
      filtered = filtered.filter(log => 
        log.entityId && log.entityId.toString().includes(filters.entityId)
      );
    }

    // IP address filter
    if (filters.ipAddress.trim()) {
      filtered = filtered.filter(log => 
        log.ipAddress && log.ipAddress.includes(filters.ipAddress)
      );
    }

    // Date range filter
    if (filters.startDate) {
      const startDate = new Date(filters.startDate + 'T00:00:00');
      filtered = filtered.filter(log => new Date(log.timestamp) >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate + 'T23:59:59');
      filtered = filtered.filter(log => new Date(log.timestamp) <= endDate);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'timestamp') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredAuditLogs(filtered);
    setCurrentPage(1);
  };

  // Apply filters when filters change
  useEffect(() => {
    if (allAuditLogs.length > 0) {
      applyFilters();
    }
  }, [filters, sortBy, sortDirection, allAuditLogs]);

  // Export audit logs
  const handleExportAuditLogs = async () => {
    try {
      setExportLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${baseUrl}/api/admin/audit-trail/export`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          handleAuthError();
          return;
        }
        throw new Error(`Export failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `AuditTrail_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast("success", "Xuất audit trail thành công!");
    } catch (error) {
      console.error("Export error:", error);
      showToast("error", `Lỗi khi xuất audit trail: ${error.message}`);
    } finally {
      setExportLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  const clearFilters = () => {
    setFilters({
      username: "",
      actionType: "",
      entityName: "",
      entityId: "",
      ipAddress: "",
      startDate: "",
      endDate: "",
      search: ""
    });
  };

  // Format datetime
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Get action type badge
  const getActionTypeBadge = (actionType) => {
    const actionConfig = {
      'CREATE': { color: 'bg-green-900/50 text-green-300 border-green-500/30', icon: CheckCircle },
      'UPDATE_STATUS': { color: 'bg-blue-900/50 text-blue-300 border-blue-500/30', icon: Info },
      'PROCESS': { color: 'bg-purple-900/50 text-purple-300 border-purple-500/30', icon: Settings },
      'DELETE': { color: 'bg-red-900/50 text-red-300 border-red-500/30', icon: XCircle },
      'EXPORT': { color: 'bg-orange-900/50 text-orange-300 border-orange-500/30', icon: Download },
      'VIEW_DETAIL': { color: 'bg-gray-900/50 text-gray-300 border-gray-500/30', icon: Eye },
      'VIEW_LIST': { color: 'bg-gray-900/50 text-gray-300 border-gray-500/30', icon: FileText },
      'BATCH_APPROVE': { color: 'bg-emerald-900/50 text-emerald-300 border-emerald-500/30', icon: CheckCircle },
      'BATCH_CANCEL': { color: 'bg-red-900/50 text-red-300 border-red-500/30', icon: XCircle }
    };

    const config = actionConfig[actionType] || { color: 'bg-gray-900/50 text-gray-300 border-gray-500/30', icon: Activity };
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} border`}>
        <Icon className="w-3 h-3 mr-1" />
        {actionType}
      </span>
    );
  };

  // Get entity icon
  const getEntityIcon = (entityName) => {
    switch (entityName) {
      case 'Payment': return <Database className="h-4 w-4 text-green-400" />;
      case 'User': return <User className="h-4 w-4 text-blue-400" />;
      case 'Instructor': return <User className="h-4 w-4 text-purple-400" />;
      default: return <Database className="h-4 w-4 text-gray-400" />;
    }
  };

  // Show detail modal
  const showLogDetail = (log) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  // Pagination
  const totalPages = Math.ceil(filteredAuditLogs.length / ITEMS_PER_PAGE);
  const currentLogs = filteredAuditLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Load data on mount
  useEffect(() => {
    fetchAuditLogs();
  }, []);

  // Show loading state
  if (loading && allAuditLogs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <Loader className="animate-spin text-blue-400 mb-4" size={28} />
          <p className="text-slate-300 text-sm">Đang tải audit trail...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-900/10 border border-red-900/30 text-red-300 rounded-md p-4 flex items-center">
        <AlertTriangle className="text-red-400 mr-3" size={20} />
        <div>
          <h3 className="font-medium text-base mb-1">Error</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md rounded-md p-6 border border-slate-700/40 space-y-6"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center">
          <div className="w-1.5 h-8 bg-blue-500 rounded-r mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-white mb-1 flex items-center">
              <Shield className="mr-3 h-7 w-7 text-blue-400" />
              Audit Trail
            </h1>
            <p className="text-slate-400">Theo dõi tất cả hoạt động trong hệ thống</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportAuditLogs}
            disabled={exportLoading}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-lg disabled:opacity-50 transform hover:scale-101"
          >
            {exportLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export
          </button>

          <button
            onClick={fetchAuditLogs}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-lg transform hover:scale-101"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm">Tổng logs</p>
              <p className="text-blue-400 font-bold text-xl">{allAuditLogs.length}</p>
              <p className="text-blue-300 text-xs mt-1">
                {totalPages > 0 ? `${totalPages} trang` : 'Không có dữ liệu'}
              </p>
            </div>
            <Shield className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-emerald-500/30 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-300 text-sm">Đã lọc</p>
              <p className="text-emerald-400 font-bold text-xl">
                {filteredAuditLogs.length}
              </p>
              <p className="text-emerald-300 text-xs mt-1">
                Trang {currentPage}/{totalPages || 1}
              </p>
            </div>
            <Activity className="h-8 w-8 text-emerald-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600/20 to-violet-600/20 border border-purple-500/30 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm">Users</p>
              <p className="text-purple-400 font-bold text-xl">
                {new Set(filteredAuditLogs.map(log => log.username)).size}
              </p>
              <p className="text-purple-300 text-xs mt-1">
                Unique users
              </p>
            </div>
            <User className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-300 text-sm">Critical</p>
              <p className="text-orange-400 font-bold text-xl">
                {filteredAuditLogs.filter(log => 
                  ['EXPORT', 'DELETE', 'BATCH_APPROVE', 'BATCH_CANCEL'].includes(log.actionType)
                ).length}
              </p>
              <p className="text-orange-300 text-xs mt-1">
                Actions quan trọng
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-600/20 to-slate-600/20 border border-gray-500/30 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Bộ lọc</p>
              <p className="text-gray-400 font-bold text-xl">
                {Object.values(filters).filter(f => f !== '').length}
              </p>
              <p className="text-gray-300 text-xs mt-1">
                Đang áp dụng
              </p>
            </div>
            <Filter className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-600/50 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Bộ lọc nâng cao
          </h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              {showAdvancedFilters ? 'Ẩn bộ lọc' : 'Hiện thêm bộ lọc'}
            </button>
            <button
              onClick={clearFilters}
              className="text-red-400 hover:text-red-300 text-sm transition-colors"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        </div>

        {/* Quick Action Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-slate-400 mr-2">Quick filters:</span>
          <button
            onClick={() => handleFilterChange('actionType', 'EXPORT')}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              filters.actionType === 'EXPORT' 
                ? 'bg-orange-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Exports
          </button>
          <button
            onClick={() => handleFilterChange('actionType', 'DELETE')}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              filters.actionType === 'DELETE' 
                ? 'bg-red-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Deletes
          </button>
          <button
            onClick={() => {
              handleFilterChange('actionType', 'BATCH_APPROVE');
              handleFilterChange('entityName', 'Payment');
            }}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              filters.actionType === 'BATCH_APPROVE' 
                ? 'bg-green-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Batch Payments
          </button>
          <button
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              handleFilterChange('startDate', today);
              handleFilterChange('endDate', today);
            }}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              filters.startDate === new Date().toISOString().split('T')[0] 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Hôm nay
          </button>
          <button
            onClick={() => {
              const startDate = new Date();
              startDate.setDate(startDate.getDate() - 7);
              const endDate = new Date();
              handleFilterChange('startDate', startDate.toISOString().split('T')[0]);
              handleFilterChange('endDate', endDate.toISOString().split('T')[0]);
            }}
            className="px-3 py-1 rounded-full text-xs bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            7 ngày qua
          </button>
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm kiếm trong logs..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <input
            type="text"
            placeholder="Username"
            value={filters.username}
            onChange={(e) => handleFilterChange('username', e.target.value)}
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 transition-all"
          />

          <select
            value={filters.actionType}
            onChange={(e) => handleFilterChange('actionType', e.target.value)}
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="">Tất cả actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE_STATUS">UPDATE_STATUS</option>
            <option value="PROCESS">PROCESS</option>
            <option value="DELETE">DELETE</option>
            <option value="EXPORT">EXPORT</option>
            <option value="VIEW_DETAIL">VIEW_DETAIL</option>
            <option value="VIEW_LIST">VIEW_LIST</option>
            <option value="BATCH_APPROVE">BATCH_APPROVE</option>
            <option value="BATCH_CANCEL">BATCH_CANCEL</option>
            <option value="UPLOAD_ATTACHMENT">UPLOAD_ATTACHMENT</option>
            <option value="DELETE_ATTACHMENT">DELETE_ATTACHMENT</option>
          </select>

          <select
            value={filters.entityName}
            onChange={(e) => handleFilterChange('entityName', e.target.value)}
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="">Tất cả entities</option>
            <option value="Payment">Payment</option>
            <option value="User">User</option>
            <option value="Instructor">Instructor</option>
            <option value="Course">Course</option>
            <option value="AuditLog">AuditLog</option>
          </select>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 animate-fadeIn"
            >
              <div className="border-t border-slate-600/50 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Entity ID"
                    value={filters.entityId}
                    onChange={(e) => handleFilterChange('entityId', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 transition-all"
                  />

                  <input
                    type="text"
                    placeholder="IP Address"
                    value={filters.ipAddress}
                    onChange={(e) => handleFilterChange('ipAddress', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 transition-all"
                  />

                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 transition-all"
                      title="Từ ngày"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 transition-all"
                      title="Đến ngày"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Display */}
        {Object.values(filters).some(filter => filter !== '') && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-600/50">
            <span className="text-sm text-slate-400">Bộ lọc đang áp dụng:</span>
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-900/30 text-blue-300 border border-blue-500/30"
                >
                  {key}: {value}
                  <button
                    onClick={() => handleFilterChange(key, '')}
                    className="ml-1 hover:text-blue-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Audit Logs Table */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-sm rounded-xl border border-slate-600/50 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-slate-900/50 text-slate-300">
              <tr>
                <th 
                  className="py-3 px-4 cursor-pointer hover:bg-slate-700/30 transition-colors"
                  onClick={() => handleSort('timestamp')}
                >
                  <div className="flex items-center">
                    Thời gian
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                    {sortBy === 'timestamp' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:bg-slate-700/30 transition-colors"
                  onClick={() => handleSort('username')}
                >
                  <div className="flex items-center">
                    User
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                    {sortBy === 'username' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Changes</th>
                <th className="py-3 px-4">Comment</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.length > 0 ? (
                currentLogs.map((log, index) => (
                  <motion.tr 
                    key={log.id || index}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <td className="py-3 px-4 text-slate-300">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-slate-400 mr-2" />
                        {formatDateTime(log.timestamp)}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-medium mr-3">
                          {log.username?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white font-medium">{log.username}</div>
                          {log.ipAddress && (
                            <div className="text-slate-400 text-xs">{log.ipAddress}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {getActionTypeBadge(log.actionType)}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {getEntityIcon(log.entityName)}
                        <span className="ml-2 text-slate-300">{log.entityName}</span>
                        {log.entityId && (
                          <span className="ml-1 text-slate-400 text-xs">#{log.entityId}</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="max-w-xs">
                        {log.oldValue && log.newValue ? (
                          <div className="text-xs">
                            <div className="text-red-400 truncate">- {log.oldValue}</div>
                            <div className="text-green-400 truncate">+ {log.newValue}</div>
                          </div>
                        ) : log.newValue ? (
                          <div className="text-green-400 text-xs truncate">{log.newValue}</div>
                        ) : (
                          <span className="text-slate-500 text-xs">No changes</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="max-w-xs truncate text-slate-300 text-xs">
                        {log.comment || '-'}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => showLogDetail(log)}
                        className="text-blue-400 hover:text-blue-300 transition-colors p-1 hover:bg-blue-500/10 rounded"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    <div className="flex flex-col items-center">
                      <Shield size={48} className="text-slate-500 mb-4" />
                      <p>Không có audit logs nào được tìm thấy.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredAuditLogs.length > ITEMS_PER_PAGE && (
          <div className="flex justify-between items-center p-6 border-t border-slate-700/50">
            <div className="text-sm text-slate-400">
              Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredAuditLogs.length)} của {filteredAuditLogs.length} logs
            </div>

            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                className="bg-blue-600/80 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2"
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
                <span className="text-sm">Previous</span>
              </button>

              {/* Page Numbers */}
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

              {/* Next Button */}
              <button
                className="bg-blue-600/80 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2"
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <span className="text-sm">Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedLog && (
          <AuditDetailModal 
            log={selectedLog} 
            onClose={() => {
              setShowDetailModal(false);
              setSelectedLog(null);
            }} 
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </motion.div>
  );
};

const AdminAuditTrailPageWithErrorBoundary = () => {
  return (
    <ErrorBoundary>
      <AdminAuditTrailPage />
    </ErrorBoundary>
  );
};

export default AdminAuditTrailPageWithErrorBoundary;