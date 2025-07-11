import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Save,
  AlertCircle,
  Info,
  Plus,
  Trash2,
  DollarSign,
  Percent,
  Calendar,
  Star,
  Gift,
  Shield,
  TrendingUp,
  Settings
} from "lucide-react";

const PolicyForm = ({ policy, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    policyType: 'STANDARD',
    category: 'REGULAR',
    instructorReferredRate: { default: 0.9 },
    platformReferredRate: { default: 0.5 },
    ratingBonusThreshold: 4.5,
    ratingBonusPercentage: 0.05,
    maxRefundRate: 0.05,
    eventBonusPercentage: 0,
    minRevenueForBonus: 0,
    priority: 1,
    validFrom: new Date().toISOString().slice(0, 16),
    validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    active: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [tieredRates, setTieredRates] = useState([
    { min: 0, max: 10000000, rate: 0.5 }
  ]);

  useEffect(() => {
    if (policy) {
      setFormData({
        ...policy,
        validFrom: policy.validFrom ? new Date(policy.validFrom).toISOString().slice(0, 16) : formData.validFrom,
        validTo: policy.validTo ? new Date(policy.validTo).toISOString().slice(0, 16) : formData.validTo,
        instructorReferredRate: policy.instructorReferredRate || { default: 0.9 },
        platformReferredRate: policy.platformReferredRate || { default: 0.5 }
      });

      // Parse tiered rates if policy type is TIERED
      if (policy.policyType === 'TIERED' && policy.platformReferredRate) {
        const rates = [];
        Object.entries(policy.platformReferredRate).forEach(([key, value]) => {
          if (key !== 'default') {
            const [min, max] = key.split('-');
            rates.push({
              min: parseFloat(min),
              max: max === 'infinity' ? Infinity : parseFloat(max),
              rate: value
            });
          }
        });
        if (rates.length > 0) {
          setTieredRates(rates.sort((a, b) => a.min - b.min));
        }
      }
    }
  }, [policy]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (type === 'number') {
      newValue = parseFloat(value) || 0;
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleRateChange = (type, key, value) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: numValue
      }
    }));
  };

  const addTieredRate = () => {
    const lastRate = tieredRates[tieredRates.length - 1];
    setTieredRates([
      ...tieredRates,
      { min: lastRate.max, max: lastRate.max + 10000000, rate: 0.5 }
    ]);
  };

  const updateTieredRate = (index, field, value) => {
    const newRates = [...tieredRates];
    newRates[index][field] = field === 'rate' ? parseFloat(value) || 0 : parseFloat(value) || 0;
    setTieredRates(newRates);
  };

  const removeTieredRate = (index) => {
    if (tieredRates.length > 1) {
      setTieredRates(tieredRates.filter((_, i) => i !== index));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên chính sách là bắt buộc';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }

    if (formData.instructorReferredRate.default < 0 || formData.instructorReferredRate.default > 1) {
      newErrors.instructorRate = 'Tỷ lệ phải từ 0 đến 1';
    }

    if (formData.ratingBonusThreshold < 0 || formData.ratingBonusThreshold > 5) {
      newErrors.ratingThreshold = 'Ngưỡng đánh giá phải từ 0 đến 5';
    }

    if (new Date(formData.validFrom) >= new Date(formData.validTo)) {
      newErrors.validTo = 'Ngày kết thúc phải sau ngày bắt đầu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      // Build platform rates for TIERED policy
      let platformRates = formData.platformReferredRate;
      if (formData.policyType === 'TIERED') {
        platformRates = {};
        tieredRates.forEach((tier, index) => {
          const key = `${tier.min}-${tier.max === Infinity ? 'infinity' : tier.max}`;
          platformRates[key] = tier.rate;
        });
      }

      const dataToSave = {
        ...formData,
        platformReferredRate: platformRates,
        validFrom: new Date(formData.validFrom).toISOString(),
        validTo: new Date(formData.validTo).toISOString()
      };

      await onSave(dataToSave);
    } catch (error) {
      console.error('Error saving policy:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            {policy?.id ? 'Chỉnh sửa chính sách' : 'Tạo chính sách mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-700 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Info size={20} className="mr-2 text-blue-400" />
              Thông tin cơ bản
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tên chính sách <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-600 border ${
                    errors.name ? 'border-red-500' : 'border-gray-500'
                  } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="VD: Chính sách Chuẩn 2025"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Độ ưu tiên
                </label>
                <input
                  type="number"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mô tả <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full px-3 py-2 bg-gray-600 border ${
                  errors.description ? 'border-red-500' : 'border-gray-500'
                } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Mô tả chi tiết về chính sách..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Loại chính sách
                </label>
                <select
                  name="policyType"
                  value={formData.policyType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="STANDARD">Chuẩn</option>
                  <option value="TIERED">Chia theo bậc</option>
                  <option value="EVENT">Sự kiện</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Danh mục
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="REGULAR">Thường xuyên</option>
                  <option value="HOLIDAY">Ngày lễ</option>
                  <option value="SEASONAL">Theo mùa</option>
                  <option value="SPECIAL_EVENT">Sự kiện đặc biệt</option>
                </select>
              </div>
            </div>
          </div>

          {/* Revenue Sharing Rates */}
          <div className="bg-gray-700 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <DollarSign size={20} className="mr-2 text-green-400" />
              Tỷ lệ chia sẻ doanh thu
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tỷ lệ cho giảng viên (học viên do GV giới thiệu)
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={formData.instructorReferredRate.default * 100}
                  onChange={(e) => handleRateChange('instructorReferredRate', 'default', e.target.value / 100)}
                  min="0"
                  max="100"
                  step="1"
                  className={`w-32 px-3 py-2 bg-gray-600 border ${
                    errors.instructorRate ? 'border-red-500' : 'border-gray-500'
                  } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
                <span className="ml-2 text-gray-300">%</span>
              </div>
              {errors.instructorRate && (
                <p className="mt-1 text-sm text-red-400">{errors.instructorRate}</p>
              )}
            </div>

            {formData.policyType === 'TIERED' ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tỷ lệ cho giảng viên (học viên từ nền tảng) - Theo bậc
                </label>
                <div className="space-y-2">
                  {tieredRates.map((tier, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="number"
                        value={tier.min}
                        onChange={(e) => updateTieredRate(index, 'min', e.target.value)}
                        className="w-32 px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
                        placeholder="Từ"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="number"
                        value={tier.max === Infinity ? '' : tier.max}
                        onChange={(e) => updateTieredRate(index, 'max', e.target.value || Infinity)}
                        className="w-32 px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
                        placeholder="Đến"
                      />
                      <span className="text-gray-400">:</span>
                      <input
                        type="number"
                        value={tier.rate * 100}
                        onChange={(e) => updateTieredRate(index, 'rate', e.target.value / 100)}
                        min="0"
                        max="100"
                        step="1"
                        className="w-24 px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
                      />
                      <span className="text-gray-300">%</span>
                      {tieredRates.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTieredRate(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTieredRate}
                    className="mt-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm flex items-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Thêm bậc
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tỷ lệ cho giảng viên (học viên từ nền tảng)
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={formData.platformReferredRate.default * 100}
                    onChange={(e) => handleRateChange('platformReferredRate', 'default', e.target.value / 100)}
                    min="0"
                    max="100"
                    step="1"
                    className="w-32 px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-gray-300">%</span>
                </div>
              </div>
            )}
          </div>

          {/* Bonus Settings */}
          <div className="bg-gray-700 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Gift size={20} className="mr-2 text-yellow-400" />
              Thưởng và ưu đãi
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ngưỡng đánh giá để nhận thưởng
                </label>
                <div className="flex items-center">
                  <Star className="text-yellow-400 mr-2" size={20} />
                  <input
                    type="number"
                    name="ratingBonusThreshold"
                    value={formData.ratingBonusThreshold}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className={`w-24 px-3 py-2 bg-gray-600 border ${
                      errors.ratingThreshold ? 'border-red-500' : 'border-gray-500'
                    } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                  <span className="ml-2 text-gray-300">/ 5.0</span>
                </div>
                {errors.ratingThreshold && (
                  <p className="mt-1 text-sm text-red-400">{errors.ratingThreshold}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  % Thưởng đánh giá cao
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    name="ratingBonusPercentage"
                    value={formData.ratingBonusPercentage * 100}
                    onChange={(e) => setFormData(prev => ({ ...prev, ratingBonusPercentage: (e.target.value / 100) }))}
                    min="0"
                    max="100"
                    step="1"
                    className="w-24 px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-gray-300">%</span>
                </div>
              </div>

              {(formData.policyType === 'EVENT' || formData.category !== 'REGULAR') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      % Thưởng sự kiện
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        name="eventBonusPercentage"
                        value={formData.eventBonusPercentage * 100}
                        onChange={(e) => setFormData(prev => ({ ...prev, eventBonusPercentage: (e.target.value / 100) }))}
                        min="0"
                        max="100"
                        step="1"
                        className="w-24 px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-gray-300">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Doanh thu tối thiểu cho thưởng sự kiện
                    </label>
                    <input
                      type="number"
                      name="minRevenueForBonus"
                      value={formData.minRevenueForBonus}
                      onChange={handleChange}
                      min="0"
                      step="1000000"
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {formData.minRevenueForBonus > 0 ? formatCurrency(formData.minRevenueForBonus) : 'Không yêu cầu'}
                    </p>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tỷ lệ hoàn trả tối đa
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    name="maxRefundRate"
                    value={formData.maxRefundRate * 100}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxRefundRate: (e.target.value / 100) }))}
                    min="0"
                    max="100"
                    step="1"
                    className="w-24 px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-gray-300">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Validity Period */}
          <div className="bg-gray-700 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Calendar size={20} className="mr-2 text-purple-400" />
              Thời gian hiệu lực
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ngày bắt đầu
                </label>
                <input
                  type="datetime-local"
                  name="validFrom"
                  value={formData.validFrom}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ngày kết thúc
                </label>
                <input
                  type="datetime-local"
                  name="validTo"
                  value={formData.validTo}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-600 border ${
                    errors.validTo ? 'border-red-500' : 'border-gray-500'
                  } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
                {errors.validTo && (
                  <p className="mt-1 text-sm text-red-400">{errors.validTo}</p>
                )}
              </div>
            </div>

            {!policy?.id && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 bg-gray-600 border-gray-500 rounded focus:ring-purple-500"
                />
                <label htmlFor="active" className="ml-2 text-sm text-gray-300">
                  Kích hoạt ngay sau khi tạo
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-t border-gray-700 p-6 bg-gray-800 rounded-b-xl">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {policy?.id ? 'Cập nhật' : 'Tạo mới'}
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PolicyForm;