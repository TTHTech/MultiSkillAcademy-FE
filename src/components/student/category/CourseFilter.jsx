import React, { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { IoFilterOutline } from "react-icons/io5";

const CourseFilter = ({ onFilter }) => {
  const [level, setLevel] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [rating, setRating] = useState("");
  const LEVEL_LABELS = {
    Beginner: "Cơ bản",
    Intermediate: "Trung cấp",
    Advanced: "Nâng cao",
  };
  const handleLevelClick = (selectedLevel) => {
    setLevel(level === selectedLevel ? "" : selectedLevel);
    onFilter({
      level: level === selectedLevel ? "" : selectedLevel,
      priceRange,
      rating,
    });
  };

  const renderStars = (minRating) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <span key={index} className="transition-transform hover:scale-110">
          {index < minRating ? (
            <FaStar className="text-yellow-400 w-4 h-4" />
          ) : (
            <FaRegStar className="text-yellow-400 w-4 h-4" />
          )}
        </span>
      ));
  };

  const handlePriceRangeClick = (range) => {
    const newPriceRange = priceRange === range ? "" : range;
    setPriceRange(newPriceRange);
    onFilter({ level, priceRange: newPriceRange, rating });
  };

  const handleRatingClick = (minRating) => {
    const newRating =
      rating === minRating.toString() ? "" : minRating.toString();
    setRating(newRating);
    onFilter({ level, priceRange, rating: newRating });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full max-w-xs">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
        <IoFilterOutline className="text-gray-600 w-5 h-5" />
        <h2 className="text-lg font-semibold text-gray-800">Bộ lọc tìm kiếm</h2>
      </div>

      {/* Level Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Mức độ</h3>
        <div className="space-y-2">
          {["Beginner", "Intermediate", "Advanced"].map((levelOption) => (
            <button
              key={levelOption}
              onClick={() => handleLevelClick(levelOption)}
              className={`w-full px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium
                ${
                  level === levelOption
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100"
                }`}
            >
              {LEVEL_LABELS[levelOption]}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Khoảng giá</h3>
        <div className="space-y-2">
          {[
            { range: "100000-200000", label: "100.000đ - 200.000đ" },
            { range: "200000-300000", label: "200.000đ - 300.000đ" },
            { range: "300000-400000", label: "300.000đ - 400.000đ" },
            { range: "400000-500000", label: "400.000đ - 500.000đ" },
            { range: "500000-600000", label: "500.000đ - 600.000đ" },
          ].map(({ range, label }) => (
            <button
              key={range}
              onClick={() => handlePriceRangeClick(range)}
              className={`w-full px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium
                ${
                  priceRange === range
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Đánh giá</h3>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5, 3.0].map((minRating) => (
            <button
              key={minRating}
              onClick={() => handleRatingClick(minRating)}
              className={`w-full px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2
                ${
                  rating === minRating.toString()
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100"
                }`}
            >
              <div className="flex gap-0.5">{renderStars(minRating)}</div>
              <span className="text-sm font-medium ml-1">
                {minRating.toFixed(1)}+ sao
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseFilter;
