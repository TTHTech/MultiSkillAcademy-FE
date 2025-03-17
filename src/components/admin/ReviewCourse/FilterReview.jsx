const FilterReview = ({ filters, setFilters }) => {
  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-4">
      <input
        type="text"
        placeholder="Tìm theo tên khóa học"
        value={filters.courseTitle}
        onChange={(e) =>
          setFilters({ ...filters, courseTitle: e.target.value })
        }
        className="flex-1 p-3 rounded-md border border-gray-500 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
      />
      <input
        type="text"
        placeholder="Tìm theo tên học viên"
        value={filters.username}
        onChange={(e) => setFilters({ ...filters, username: e.target.value })}
        className="flex-1 p-3 rounded-md border border-gray-500 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
      />
      <select
        value={filters.rating}
        onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
        className="p-3 rounded-md border border-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
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
