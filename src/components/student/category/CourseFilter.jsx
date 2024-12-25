import React, { useState } from 'react';
import { FaStar, FaRegStar, FaCheck, FaRegCheckCircle } from 'react-icons/fa';

const CourseFilter = ({ onFilter }) => {
  const [level, setLevel] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [rating, setRating] = useState('');

  // Function to handle level change
  const handleLevelClick = (selectedLevel) => {
    setLevel(level === selectedLevel ? '' : selectedLevel); // Toggle the selected level
    onFilter({ level: level === selectedLevel ? '' : selectedLevel, priceRange, rating });
  };

  // Function to render the stars based on rating
  const renderStars = (minRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= minRating ? (
          <FaStar key={i} className="text-yellow-400" style={{ fontSize: '20px' }} />
        ) : (
          <FaRegStar key={i} className="text-yellow-400" style={{ fontSize: '20px' }} />
        )
      );
    }
    return stars;
  };

  // Toggle the selected price range
  const handlePriceRangeClick = (range) => {
    const newPriceRange = priceRange === range ? '' : range;
    setPriceRange(newPriceRange);
    onFilter({ level, priceRange: newPriceRange, rating });
  };

  // Toggle the selected rating
  const handleRatingClick = (minRating) => {
    const newRating = rating === minRating.toString() ? '' : minRating.toString();
    setRating(newRating);
    onFilter({ level, priceRange, rating: newRating });
  };

  return (
    <div className="flex flex-col items-center space-y-4 mb-6">
      {/* Level Filter */}
      <div className="flex flex-col items-center space-y-2 w-full max-w-xs">
        <label className="text-gray-700">Mức độ</label>
        <div className="flex flex-col space-y-2 w-full">
          {['Beginner', 'Intermediate', 'Advanced'].map((levelOption) => (
            <div
              key={levelOption}
              onClick={() => handleLevelClick(levelOption)}
              className={`flex items-center cursor-pointer px-4 py-2 rounded-md ${level === levelOption ? 'bg-blue-600 text-white' : 'bg-transparent text-blue-600 border-2 border-blue-600'}`}
            >
              {level === levelOption ? <FaCheck className="mr-2" /> : <FaRegCheckCircle className="mr-2" />}
              <span className={level === levelOption ? 'text-white' : 'text-blue-600'}>
                {levelOption}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="flex flex-col items-center space-y-2 w-full max-w-xs">
        <label className="text-gray-700">Khoảng giá</label>
        <div className="flex flex-col space-y-2 w-full">
          {['100000-200000', '200000-300000', '300000-400000', '400000-500000', '500000-600000'].map((range) => (
            <div
              key={range}
              onClick={() => handlePriceRangeClick(range)}
              className={`flex items-center cursor-pointer px-4 py-2 rounded-md ${priceRange === range ? 'bg-blue-600 text-white' : 'bg-transparent text-blue-600 border-2 border-blue-600'}`}
            >
              {priceRange === range ? <FaCheck className="mr-2" /> : <FaRegCheckCircle className="mr-2" />}
              <span className={priceRange === range ? 'text-white' : 'text-blue-600'}>
                {range.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="flex flex-col items-center space-y-2 w-full max-w-xs">
        <label className="text-gray-700">Đánh giá sao</label>
        <div className="flex flex-col space-y-2 w-full">
          {[3, 3.5, 4, 4.5].map((minRating) => (
            <div
              key={minRating}
              onClick={() => handleRatingClick(minRating)}
              className={`flex items-center cursor-pointer px-4 py-2 rounded-md ${rating === minRating.toString() ? 'bg-blue-600 text-white' : 'bg-transparent text-blue-600 border-2 border-blue-600'}`}
            >
              {rating === minRating.toString() ? <FaCheck className="mr-2" /> : <FaRegCheckCircle className="mr-2" />}
              <div className="flex items-center">
                {renderStars(minRating)}
                <span className={`ml-2 text-sm ${rating === minRating.toString() ? 'text-white' : 'text-blue-600'}`}>
                  {minRating} sao trở lên
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseFilter;
