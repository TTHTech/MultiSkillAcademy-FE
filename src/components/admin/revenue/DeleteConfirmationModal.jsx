// src/components/admin/revenue/DeleteConfirmationModal.jsx
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Trash2, Shield } from "lucide-react";

const DeleteConfirmationModal = ({ 
  isOpen, 
  item, 
  itemType = "policy",
  onCancel, 
  onConfirm,
  loading = false,
  customTitle,
  customMessage,
  confirmText = "Xóa",
  cancelText = "Hủy"
}) => {
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  // Get item type specific content
  const getItemTypeContent = () => {
    switch (itemType) {
      case "policy":
        return {
          title: customTitle || "Xác nhận xóa chính sách",
          message: customMessage || `Bạn có chắc chắn muốn xóa chính sách "${item?.name || 'Không tên'}"?`,
          warning: "Thao tác này sẽ xóa vĩnh viễn chính sách và không thể hoàn tác.",
          icon: Shield,
          iconColor: "text-red-500",
          iconBg: "bg-red-600/20 border-red-500/30"
        };
      case "revenue":
        return {
          title: customTitle || "Xác nhận xóa doanh thu",
          message: customMessage || `Bạn có chắc chắn muốn xóa dữ liệu doanh thu của "${item?.instructorName || 'giảng viên này'}"?`,
          warning: "Thao tác này sẽ xóa vĩnh viễn dữ liệu doanh thu và không thể hoàn tác.",
          icon: Trash2,
          iconColor: "text-red-500",
          iconBg: "bg-red-600/20 border-red-500/30"
        };
      case "instructor":
        return {
          title: customTitle || "Xác nhận xóa giảng viên",
          message: customMessage || `Bạn có chắc chắn muốn xóa giảng viên "${item?.firstName} ${item?.lastName}"?`,
          warning: "Thao tác này sẽ xóa vĩnh viễn tất cả dữ liệu liên quan đến giảng viên này.",
          icon: Trash2,
          iconColor: "text-red-500",
          iconBg: "bg-red-600/20 border-red-500/30"
        };
      default:
        return {
          title: customTitle || "Xác nhận xóa",
          message: customMessage || "Bạn có chắc chắn muốn thực hiện thao tác này?",
          warning: "Thao tác này không thể hoàn tác.",
          icon: AlertTriangle,
          iconColor: "text-red-500",
          iconBg: "bg-red-600/20 border-red-500/30"
        };
    }
  };

  const content = getItemTypeContent();
  const IconComponent = content.icon;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          
          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md mx-4 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-b border-red-500/20 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full ${content.iconBg} border flex items-center justify-center mr-3`}>
                    <IconComponent className={`h-5 w-5 ${content.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{content.title}</h3>
                </div>
                
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700/50 disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              {/* Main message */}
              <p className="text-gray-300 mb-4 leading-relaxed">
                {content.message}
              </p>

              {/* Warning */}
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-300 text-sm font-medium mb-1">Cảnh báo</p>
                    <p className="text-yellow-200 text-sm">{content.warning}</p>
                  </div>
                </div>
              </div>

              {/* Item details if available */}
              {item && (
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700/50">
                  <h4 className="text-white font-medium mb-3">Chi tiết mục cần xóa:</h4>
                  <div className="space-y-2 text-sm">
                    {item.name && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tên:</span>
                        <span className="text-white font-medium">{item.name}</span>
                      </div>
                    )}
                    {item.instructorName && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Giảng viên:</span>
                        <span className="text-white font-medium">{item.instructorName}</span>
                      </div>
                    )}
                    {item.firstName && item.lastName && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Họ tên:</span>
                        <span className="text-white font-medium">{item.firstName} {item.lastName}</span>
                      </div>
                    )}
                    {item.id && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">ID:</span>
                        <span className="text-white font-medium">{item.id}</span>
                      </div>
                    )}
                    {item.type && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Loại:</span>
                        <span className="text-white font-medium">{item.type}</span>
                      </div>
                    )}
                    {item.status && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Trạng thái:</span>
                        <span className={`font-medium ${
                          item.status === 'active' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {item.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-gray-800/50 border-t border-gray-700/50 px-6 py-4">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="px-4 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed border border-gray-600 hover:border-gray-500"
                >
                  {cancelText}
                </button>
                
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center min-w-[80px] justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xóa...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      {confirmText}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;