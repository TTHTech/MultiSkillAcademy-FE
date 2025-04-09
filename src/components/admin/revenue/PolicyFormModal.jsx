import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import ModalPortal from "./ModalPortal";

const PolicyFormModal = ({
  isOpen,
  onClose,
  policy,
  formMode,
  onSubmit,
  presets,
  showPresets,
  setShowPresets,
  applyPreset
}) => {
  const [formData, setFormData] = useState(policy);

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

  // Update form data when policy changes
  useEffect(() => {
    setFormData(policy);
  }, [policy]);

  if (!isOpen) return null;

  // Helper functions for date handling
  function formatDateForDisplay(dateArray) {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) return "";
    const [year, month, day] = dateArray;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  function parseDateFromInput(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    return formatDateForApi(date);
  }

  function formatDateForApi(date) {
    if (!date) return null;
    // Format to [YYYY, MM, DD, HH, MM] array format that backend expects
    const year = date.getFullYear();
    const month = date.getMonth() + 1;  // JS months are 0-indexed
    const day = date.getDate();
    return [year, month, day, 0, 0];
  }

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format the policy data to match API expectations
    const policyToSend = {
      id: formData.id,
      name: formData.name,
      instructorReferredRate: formData.instructorReferredRate,
      platformReferredRate: formData.platformReferredRate,
      ratingBonusThreshold: Number(formData.ratingBonusThreshold),
      ratingBonusPercentage: Number(formData.ratingBonusPercentage),
      maxRefundRate: Number(formData.maxRefundRate),
      validFrom: formData.validFrom,
      validTo: formData.validTo,
      active: formData.active
    };
    
    onSubmit(policyToSend);
  };

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
          onClose();
        }
      }}
    >
      <motion.div
        style={{
          width: '100%',
          maxWidth: '800px',
          backgroundColor: '#1f2937',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: '1px solid #374151',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: '0 1rem',
          position: 'relative',
          zIndex: 10000
        }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">
            {formMode === "create" ? "Tạo chính sách mới" : "Chỉnh sửa chính sách"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 mb-2">Tên chính sách</label>
              <input
                type="text"
                name="name"
                value={formData.name}
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
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-2">Không có mẫu nào khả dụng</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-gray-300 mb-2">Tỷ lệ giảng viên (%)</label>
              <input
                type="text"
                name="instructorReferredRate.default"
                value={formData.instructorReferredRate?.default * 100 || ""}
                onChange={(e) => {
                  const value = e.target.value === '' ? '' : Number(e.target.value) / 100;
                  setFormData({
                    ...formData,
                    instructorReferredRate: {
                      ...formData.instructorReferredRate,
                      default: value
                    }
                  });
                }}
                className="bg-gray-700 text-white w-full p-2 rounded-lg"
                min="0"
                max="100"
                required
                onClick={(e) => e.target.select()}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Điểm đánh giá tối thiểu</label>
              <input
                type="text"
                name="ratingBonusThreshold"
                value={formData.ratingBonusThreshold || ""}
                onChange={handleInputChange}
                className="bg-gray-700 text-white w-full p-2 rounded-lg"
                min="0"
                max="5"
                step="0.1"
                required
                onClick={(e) => e.target.select()}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Thưởng đánh giá cao (%)</label>
              <input
                type="text"
                name="ratingBonusPercentage"
                value={formData.ratingBonusPercentage * 100 || ""}
                onChange={(e) => {
                  const value = e.target.value === '' ? '' : Number(e.target.value) / 100;
                  setFormData({
                    ...formData,
                    ratingBonusPercentage: value
                  });
                }}
                className="bg-gray-700 text-white w-full p-2 rounded-lg"
                min="0"
                max="100"
                required
                onClick={(e) => e.target.select()}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Tỷ lệ hoàn tiền tối đa (%)</label>
              <input
                type="text"
                name="maxRefundRate"
                value={formData.maxRefundRate * 100 || ""}
                onChange={(e) => {
                  const value = e.target.value === '' ? '' : Number(e.target.value) / 100;
                  setFormData({
                    ...formData,
                    maxRefundRate: value
                  });
                }}
                className="bg-gray-700 text-white w-full p-2 rounded-lg"
                min="0"
                max="100"
                required
                onClick={(e) => e.target.select()}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Ngày bắt đầu hiệu lực</label>
              <input
                type="date"
                value={formatDateForDisplay(formData.validFrom)}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    validFrom: parseDateFromInput(e.target.value)
                  });
                }}
                className="bg-gray-700 text-white w-full p-2 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Ngày kết thúc hiệu lực</label>
              <input
                type="date"
                value={formatDateForDisplay(formData.validTo)}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    validTo: parseDateFromInput(e.target.value)
                  });
                }}
                className="bg-gray-700 text-white w-full p-2 rounded-lg"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-300 mb-2">Phần trăm nền tảng theo doanh thu</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-400">0-10tr VND</label>
                  <input
                    type="text"
                    value={formData.platformReferredRate?.["0-10000000"] * 100 || ""}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value) / 100;
                      setFormData({
                        ...formData,
                        platformReferredRate: {
                          ...formData.platformReferredRate,
                          "0-10000000": value
                        }
                      });
                    }}
                    className="bg-gray-700 text-white w-full p-2 rounded-lg"
                    min="0"
                    max="100"
                    required
                    onClick={(e) => e.target.select()}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">10tr-50tr VND</label>
                  <input
                    type="text"
                    value={formData.platformReferredRate?.["10000000-50000000"] * 100 || ""}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value) / 100;
                      setFormData({
                        ...formData,
                        platformReferredRate: {
                          ...formData.platformReferredRate,
                          "10000000-50000000": value
                        }
                      });
                    }}
                    className="bg-gray-700 text-white w-full p-2 rounded-lg"
                    min="0"
                    max="100"
                    required
                    onClick={(e) => e.target.select()}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Trên 50tr VND</label>
                  <input
                    type="text"
                    value={formData.platformReferredRate?.["50000000-infinity"] * 100 || ""}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value) / 100;
                      setFormData({
                        ...formData,
                        platformReferredRate: {
                          ...formData.platformReferredRate,
                          "50000000-infinity": value
                        }
                      });
                    }}
                    className="bg-gray-700 text-white w-full p-2 rounded-lg"
                    min="0"
                    max="100"
                    required
                    onClick={(e) => e.target.select()}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Trạng thái</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active || false}
                  onChange={handleInputChange}
                  className="mr-2 h-5 w-5"
                />
                <span className="text-white">Hoạt động</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
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
    </div>
  );

  // Use the portal to render outside of component hierarchy
  return (
    <ModalPortal isOpen={isOpen}>
      {modalContent}
    </ModalPortal>
  );
};

export default PolicyFormModal;