import React, { useState, useEffect } from "react";
import { Search, Star, Calendar, X, ChevronDown, SlidersHorizontal } from "lucide-react";

const FilterReview = ({ filters, setFilters }) => {
  const [searchValue, setSearchValue] = useState(filters.courseTitle || "");
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Track applied filters for UI badges
  useEffect(() => {
    const newSelectedFilters = [];
    
    if (filters.rating) {
      newSelectedFilters.push({
        id: 'rating',
        label: `${filters.rating} sao`,
        value: filters.rating
      });
    }
    
    if (filters.dateRange) {
      newSelectedFilters.push({
        id: 'dateRange',
        label: filters.dateRange === 'recent' ? 'Gần đây' : 'Tất cả thời gian',
        value: filters.dateRange
      });
    }
    
    setSelectedFilters(newSelectedFilters);
  }, [filters]);

  // Handle search input with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    
    const timeoutId = setTimeout(() => {
      setFilters({
        ...filters,
        courseTitle: value,
        username: value,
      });
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  // Clear a specific filter
  const clearFilter = (filterId) => {
    const newFilters = { ...filters };
    
    if (filterId === 'rating') {
      newFilters.rating = '';
    } else if (filterId === 'dateRange') {
      newFilters.dateRange = '';
    } else if (filterId === 'search') {
      newFilters.courseTitle = '';
      newFilters.username = '';
      setSearchValue('');
    }
    
    setFilters(newFilters);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      courseTitle: '',
      username: '',
      rating: '',
      dateRange: ''
    });
    setSearchValue('');
  };

  // Handle date range selection
  const handleDateRange = (range) => {
    setFilters({
      ...filters,
      dateRange: range
    });
  };

  // Handle star rating selection
  const handleRatingChange = (e) => {
    setFilters({ 
      ...filters, 
      rating: e.target.value 
    });
  };

  // Check if any filters are applied
  const hasActiveFilters = selectedFilters.length > 0 || searchValue;

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden mb-6">
      {/* Main search and filter bar */}
      <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khóa học hoặc học viên..."
              value={searchValue}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-10 py-2.5 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            
            {searchValue && (
              <button 
                onClick={() => clearFilter('search')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Rating filter dropdown */}
          <div className="relative min-w-[140px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Star size={16} className="text-yellow-400" />
            </div>
            
            <select
              value={filters.rating}
              onChange={handleRatingChange}
              className="appearance-none block w-full pl-10 pr-10 py-2.5 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Tất cả đánh giá</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao trở lên</option>
              <option value="3">3 sao trở lên</option>
              <option value="2">2 sao trở lên</option>
              <option value="1">1 sao trở lên</option>
            </select>
            
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <ChevronDown size={16} />
            </div>
          </div>

          {/* Advanced filters toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-4 py-2.5 rounded-lg border border-gray-600 flex items-center gap-2 transition-all duration-200 
              ${isExpanded ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700'}`}
          >
            <SlidersHorizontal size={16} />
            <span>Bộ lọc</span>
            {selectedFilters.length > 0 && (
              <span className="flex items-center justify-center w-5 h-5 ml-1 text-xs font-medium rounded-full bg-blue-500 text-white">
                {selectedFilters.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expanded filters panel */}
      {isExpanded && (
        <div className="p-4 bg-gray-800 border-b border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date range filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <Calendar size={14} />
                Thời gian
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleDateRange('recent')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors 
                    ${filters.dateRange === 'recent' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  Gần đây
                </button>
                <button
                  onClick={() => handleDateRange('all')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors 
                    ${filters.dateRange === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  Tất cả thời gian
                </button>
              </div>
            </div>

            {/* Star Ratings with visual indicators */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <Star size={14} />
                Đánh giá sao
              </label>
              <div className="flex flex-col gap-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <input
                      id={`rating-${rating}`}
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={parseInt(filters.rating) === rating}
                      onChange={handleRatingChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`rating-${rating}`}
                      className={`flex items-center w-full cursor-pointer px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                        ${parseInt(filters.rating) === rating
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                      <div className="flex items-center">
                        {[...Array(rating)].map((_, i) => (
                          <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                        ))}
                        {[...Array(5 - rating)].map((_, i) => (
                          <Star key={i} size={14} className="text-gray-500" />
                        ))}
                        <span className="ml-2">{rating} sao trở lên</span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end mt-4 pt-3 border-t border-gray-700">
            <button
              onClick={clearAllFilters}
              disabled={!hasActiveFilters}
              className="px-4 py-2 rounded-md text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 mr-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Xóa bộ lọc
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}

      {/* Active filters badges */}
      {hasActiveFilters && (
        <div className="px-4 py-2 bg-gray-800 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400 mr-1">Bộ lọc đã chọn:</span>
          
          {searchValue && (
            <span className="inline-flex items-center py-1 pl-3 pr-2 rounded-full text-sm bg-blue-900/60 text-blue-200">
              Tìm kiếm: {searchValue.length > 15 ? `${searchValue.substring(0, 15)}...` : searchValue}
              <button 
                onClick={() => clearFilter('search')}
                className="ml-1 text-blue-200 hover:text-white"
              >
                <X size={14} />
              </button>
            </span>
          )}
          
          {selectedFilters.map(filter => (
            <span 
              key={filter.id}
              className="inline-flex items-center py-1 pl-3 pr-2 rounded-full text-sm bg-blue-900/60 text-blue-200"
            >
              {filter.label}
              <button 
                onClick={() => clearFilter(filter.id)}
                className="ml-1 text-blue-200 hover:text-white"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-400 hover:text-blue-300 ml-auto"
          >
            Xóa tất cả
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterReview;