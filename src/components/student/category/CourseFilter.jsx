import React, { useState } from 'react';

const CourseFilter = ({ onFilter }) => {
  const [level, setLevel] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [rating, setRating] = useState('');

  const handleFilter = () => {
    onFilter({ level, priceRange, rating });
  };

  return (
    <div className="flex space-x-4 mb-6">
      <select
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        className="border px-3 py-2 rounded-md"
      >
        <option value="">Chọn mức độ</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>

      <select
        value={priceRange}
        onChange={(e) => setPriceRange(e.target.value)}
        className="border px-3 py-2 rounded-md"
      >
        <option value="">Chọn khoảng giá</option>
        <option value="1000000-1100000">1.000.000 - 1.100.000 VND</option>
        <option value="1100000-1200000">1.100.000 - 1.200.000 VND</option>
        <option value="1200000-1300000">1.200.000 - 1.300.000 VND</option>
        <option value="1300000-1400000">1.300.000 - 1.400.000 VND</option>
        <option value="1400000-1500000">1.400.000 - 1.500.000 VND</option>
      </select>

      <select
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="border px-3 py-2 rounded-md"
      >
        <option value="">Chọn đánh giá sao</option>
        <option value="3">Từ 3 sao trở lên</option>
        <option value="3.5">Từ 3.5 sao trở lên</option>
        <option value="4">Từ 4 sao trở lên</option>
        <option value="5">5 sao</option>
      </select>

      <button
        onClick={handleFilter}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Lọc
      </button>
    </div>
  );
};

export default CourseFilter;
