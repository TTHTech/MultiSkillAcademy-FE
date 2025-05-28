import { useState } from "react";

const ITEMS_PER_PAGE = 9;

const DiscountUsageSummaryList = ({ discountUsages, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPageWithData, setCurrentPageWithData] = useState(1);
  const [currentPageWithoutData, setCurrentPageWithoutData] = useState(1);

  // Helper to parse both ISO strings and array date formats
  const toDate = (input) => {
    if (typeof input === "string") {
      const normalized = input.replace(/\.(\d{3})\d+/, ".$1");
      return new Date(normalized);
    }
    const [y, m, d, h = 0, min = 0, s = 0, micro = 0] = input.map(Number);
    const ms = Math.round(micro / 1000);
    return new Date(y, m - 1, d, h, min, s, ms);
  };

  // Pre-process data to compute isActive
  const now = new Date();
  const processedDiscounts = discountUsages.map((d) => ({
    ...d,
    isActive: toDate(d.startDate) <= now && toDate(d.endDate) >= now,
  }));

  // Filter by search term and status
  const filteredDiscounts = processedDiscounts.filter((d) => {
    const codeMatch = d.discountCode.toLowerCase().includes(searchTerm.toLowerCase());
    let statusMatch = true;
    if (statusFilter === "active") statusMatch = d.isActive;
    else if (statusFilter === "expired") statusMatch = !d.isActive;
    return codeMatch && statusMatch;
  });

  // Separate with/without usage data
  const discountsWithData = filteredDiscounts.filter(
    (d) => d.usageCount > 0 || d.totalDiscountAmount > 0
  );
  const discountsWithoutData = filteredDiscounts.filter(
    (d) => d.usageCount === 0 && d.totalDiscountAmount === 0
  );

  // Pagination
  const totalPagesWithData = Math.ceil(discountsWithData.length / ITEMS_PER_PAGE);
  const totalPagesWithoutData = Math.ceil(discountsWithoutData.length / ITEMS_PER_PAGE);

  const currentDiscountsWithData = discountsWithData.slice(
    (currentPageWithData - 1) * ITEMS_PER_PAGE,
    currentPageWithData * ITEMS_PER_PAGE
  );
  const currentDiscountsWithoutData = discountsWithoutData.slice(
    (currentPageWithoutData - 1) * ITEMS_PER_PAGE,
    currentPageWithoutData * ITEMS_PER_PAGE
  );

  const generatePageNumbers = (currentPage, totalPages) => {
    const pages = [];
    if (totalPages === 0) return pages;
    pages.push(1);
    if (currentPage - 1 > 1) pages.push(currentPage - 1);
    if (currentPage !== 1 && currentPage !== totalPages) pages.push(currentPage);
    if (currentPage + 1 < totalPages) pages.push(currentPage + 1);
    if (totalPages > 1) pages.push(totalPages);
    return Array.from(new Set(pages)).sort((a, b) => a - b);
  };

  const pageNumbersWithData = generatePageNumbers(currentPageWithData, totalPagesWithData);
  const pageNumbersWithoutData = generatePageNumbers(currentPageWithoutData, totalPagesWithoutData);

  return (
    <div className="mb-6">
      {/* Search & Filter Controls */}
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Tìm kiếm theo discount code..."
          className="w-full p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPageWithData(1);
            setCurrentPageWithoutData(1);
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPageWithData(1);
            setCurrentPageWithoutData(1);
          }}
          className="p-2 rounded-md bg-gray-700 text-white"
        >
          <option value="all">Tất cả</option>
          <option value="active">Còn hạn</option>
          <option value="expired">Hết hạn</option>
        </select>
      </div>

      {/* Discounts with Data */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-4">Discount đã được sử dụng</h3>
        {discountsWithData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currentDiscountsWithData.map((d) => (
                <div
                  key={d.discountId || d.discountCode}
                  className="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors shadow-md"
                  onClick={() => onSelect(d)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold text-white text-lg">{d.discountName}</div>
                    {d.isActive ? (
                      <span className="bg-green-500 text-white px-2 py-1 text-xs font-bold rounded-full">Còn hạn</span>
                    ) : (
                      <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-full">Hết hạn</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-300 mb-1">Mã: {d.discountCode}</div>
                  <div className="text-sm text-gray-300 mb-1">Số người sử dụng: {d.usageCount}</div>
                  <div className="text-sm text-gray-300">Tổng số tiền giảm: {d.totalDiscountAmount}</div>
                  <div className={`text-sm font-semibold ${
                    d.status === "ACTIVE"
                      ? "text-green-500"
                      : d.status === "DECLINED"
                      ? "text-gray-400"
                      : d.status === "INACTIVE"
                      ? "text-red-500"
                      : d.status === "PENDING"
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}>
                    {d.status === "ACTIVE" && "Đang hoạt động"}
                    {d.status === "DECLINED" && "Bị từ chối"}
                    {d.status === "INACTIVE" && "Không hoạt động"}
                    {d.status === "PENDING" && "Đang chờ xét duyệt"}
                  </div>
                </div>
              ))}
            </div>
            {totalPagesWithData > 1 && (
              <div className="mt-4 flex justify-center space-x-2">
                {pageNumbersWithData.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPageWithData(page)}
                    className={`px-3 py-1 rounded-md ${
                      page === currentPageWithData
                        ? "bg-blue-500 text-white"
                        : "bg-gray-600 text-gray-200 hover:bg-gray-500"
                    }`}>
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-300">Không có discount nào có dữ liệu.</p>
        )}
      </div>

      {/* Discounts without Data */}
      {discountsWithoutData.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Discount chưa được sử dụng</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {currentDiscountsWithoutData.map((d) => (
              <div
                key={d.discountId || d.discountCode}
                className="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors shadow-md"
                onClick={() => onSelect(d)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-white text-lg">{d.discountName}</div>
                  {d.isActive ? (
                    <span className="bg-green-500 text-white px-2 py-1 text-xs font-bold rounded-full">Còn hạn</span>
                  ) : (
                    <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-full">Hết hạn</span>
                  )}
                </div>
                <div className="text-sm text-gray-300 mb-1">Mã: {d.discountCode}</div>
                <div className="text-sm text-gray-300 mb-1">Số người sử dụng: {d.usageCount || 0}</div>
                <div className="text-sm text-gray-300">Tổng số tiền giảm: {d.totalDiscountAmount || 0}</div>
                <div className={`text-sm font-semibold ${
                  d.status === "ACTIVE"
                    ? "text-green-500"
                    : d.status === "DECLINED"
                    ? "text-gray-400"
                    : d.status === "INACTIVE"
                    ? "text-red-500"
                    : d.status === "PENDING"
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}>
                  {d.status === "ACTIVE" && "Đang hoạt động"}
                  {d.status === "DECLINED" && "Bị từ chối"}
                  {d.status === "INACTIVE" && "Không hoạt động"}
                  {d.status === "PENDING" && "Đang chờ xét duyệt"}
                </div>
              </div>
            ))}
          </div>
          {totalPagesWithoutData > 1 && (
            <div className="mt-4 flex justify-center space-x-2">
              {pageNumbersWithoutData.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPageWithoutData(page)}
                  className={`px-3 py-1 rounded-md ${
                    page === currentPageWithoutData
                      ? "bg-blue-500 text-white"
                      : "bg-gray-600 text-gray-200 hover:bg-gray-500"
                  }`}>
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiscountUsageSummaryList;