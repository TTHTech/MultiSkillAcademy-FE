import { FaSearch } from "react-icons/fa";

const FilterReview = ({ filters, setFilters }) => {
  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setFilters({
      ...filters,
      courseTitle: searchValue,
      username: searchValue,
    });
  };

  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm theo tên khóa học hoặc học viên"
          value={filters.courseTitle}
          onChange={handleSearchChange}
          className="w-full pl-10 p-3 rounded-md border border-gray-500 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
        />
      </div>
      <select
        value={filters.rating}
        onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
        className="flex-shrink-0 p-3 rounded-md border border-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
      >
        <option value="">Tất cả đánh giá</option>
        <option value="5">5 sao</option>
        <option value="4">4 sao</option>
        <option value="3">3 sao</option>
        <option value="2">2 sao</option>
        <option value="1">1 sao</option>
      </select>
    </div>
  );
};

export default FilterReview;
