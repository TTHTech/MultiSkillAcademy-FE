import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Calendar,
  Shield,
  TrendingUp,
  Gift,
  Star
} from "lucide-react";

const PolicyFilters = ({ filters, onFilterChange, totalElements }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      search: '',
      policyType: 'all',
      category: 'all',
      active: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setLocalFilters(defaultFilters);
    onFilterChange(defaultFilters);
    setShowAdvanced(false);
  };

  const hasActiveFilters = () => {
    return localFilters.search || 
           localFilters.policyType !== 'all' || 
           localFilters.category !== 'all' || 
           localFilters.active !== 'all';
  };

  return (
    <motion.div
      className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* Main Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search */}
        <div className="flex-1 w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mô tả..."
              value={localFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            {localFilters.search && (
              <button
                onClick={() => handleFilterChange('search', '')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={localFilters.active}
            onChange={(e) => handleFilterChange('active', e.target.value)}
            className="px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Không hoạt động</option>
            <option value="expired">Đã hết hạn</option>
          </select>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-4 py-2.5 ${showAdvanced ? 'bg-purple-700 text-white' : 'bg-gray-700 text-gray-300'} border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2`}
          >
            <Filter size={18} />
            Bộ lọc nâng cao
            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {hasActiveFilters() && (
            <button
              onClick={resetFilters}
              className="px-4 py-2.5 bg-red-900 text-red-200 border border-red-700 rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Policy Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <Shield size={16} className="mr-2 text-gray-400" />
                    Loại chính sách
                  </label>
                  <select
                    value={localFilters.policyType}
                    onChange={(e) => handleFilterChange('policyType', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Tất cả loại</option>
                    <option value="STANDARD">Chuẩn</option>
                    <option value="TIERED">Chia theo bậc</option>
                    <option value="EVENT">Sự kiện</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <Gift size={16} className="mr-2 text-gray-400" />
                    Danh mục
                  </label>
                  <select
                    value={localFilters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Tất cả danh mục</option>
                    <option value="REGULAR">Thường xuyên</option>
                    <option value="HOLIDAY">Ngày lễ</option>
                    <option value="SEASONAL">Theo mùa</option>
                    <option value="SPECIAL_EVENT">Sự kiện đặc biệt</option>
                  </select>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <TrendingUp size={16} className="mr-2 text-gray-400" />
                    Sắp xếp theo
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={localFilters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="createdAt">Ngày tạo</option>
                      <option value="name">Tên</option>
                      <option value="priority">Độ ưu tiên</option>
                      <option value="usageCount">Số lần sử dụng</option>
                      <option value="validFrom">Ngày bắt đầu</option>
                    </select>
                    <button
                      onClick={() => handleFilterChange('sortOrder', localFilters.sortOrder === 'asc' ? 'desc' : 'asc')}
                      className={`px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors ${
                        localFilters.sortOrder === 'desc' ? 'rotate-180' : ''
                      }`}
                    >
                      <ChevronDown size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Summary */}
      {(hasActiveFilters() || totalElements > 0) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          {localFilters.search && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-900 text-purple-200 border border-purple-700">
              Tìm kiếm: "{localFilters.search}"
              <button
                onClick={() => handleFilterChange('search', '')}
                className="ml-2 text-purple-300 hover:text-purple-100"
              >
                <X size={14} />
              </button>
            </span>
          )}
          
          {localFilters.policyType !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900 text-blue-200 border border-blue-700">
              Loại: {localFilters.policyType}
              <button
                onClick={() => handleFilterChange('policyType', 'all')}
                className="ml-2 text-blue-300 hover:text-blue-100"
              >
                <X size={14} />
              </button>
            </span>
          )}
          
          {localFilters.category !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-900 text-green-200 border border-green-700">
              Danh mục: {localFilters.category}
              <button
                onClick={() => handleFilterChange('category', 'all')}
                className="ml-2 text-green-300 hover:text-green-100"
              >
                <X size={14} />
              </button>
            </span>
          )}
          
          {localFilters.active !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-900 text-yellow-200 border border-yellow-700">
              Trạng thái: {localFilters.active === 'true' ? 'Hoạt động' : localFilters.active === 'false' ? 'Không hoạt động' : 'Hết hạn'}
              <button
                onClick={() => handleFilterChange('active', 'all')}
                className="ml-2 text-yellow-300 hover:text-yellow-100"
              >
                <X size={14} />
              </button>
            </span>
          )}
          
          <span className="text-gray-400 ml-auto">
            Tìm thấy <span className="font-semibold text-white">{totalElements}</span> chính sách
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default PolicyFilters;