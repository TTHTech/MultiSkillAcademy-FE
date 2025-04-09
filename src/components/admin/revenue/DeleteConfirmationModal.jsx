import React, { useEffect } from "react";
import { motion } from "framer-motion";
import ModalPortal from "./ModalPortal";

const DeleteConfirmationModal = ({ isOpen, policy, onCancel, onConfirm }) => {
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

  if (!isOpen) return null;
  
  const modalContent = (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', 
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 9999
      }}
      onClick={(e) => {
        // Close on overlay click
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <motion.div
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: '#1f2937',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: '1px solid #374151',
          margin: '0 1rem',
          position: 'relative',
          zIndex: 10000
        }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
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

  // Use the portal to render outside of component hierarchy
  return (
    <ModalPortal isOpen={isOpen}>
      {modalContent}
    </ModalPortal>
  );
};

export default DeleteConfirmationModal;