import { useEffect, useState } from "react";
import axios from "axios";
import EditDiscount from "./editDiscountAdmin";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const DiscountsTable = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [editingDiscountId, setEditingDiscountId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = () => setRefresh((prev) => !prev);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [searchCode, setSearchCode] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const getPaginationItems = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/admin/discounts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDiscounts(response.data);
      } catch (err) {
        setError("Không thể tải danh sách mã giảm giá.");
      } finally {
        setLoading(false);
      }
    };
    fetchDiscounts();
  }, [token, refresh]);

  const filteredDiscounts = discounts.filter((discount) => {
    const codeMatch = discount.code
      .toLowerCase()
      .includes(searchCode.toLowerCase());
    const statusMatch = searchStatus ? discount.status === searchStatus : true;
    return codeMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredDiscounts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentDiscounts = filteredDiscounts.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 mt-6 border border-gray-700">
      {editingDiscountId ? (
        <EditDiscount
          discountId={editingDiscountId}
          onCancel={() => setEditingDiscountId(null)}
          triggerRefresh={triggerRefresh}
        />
      ) : (
        <>
          {/* Header Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Quản lý mã giảm giá
            </h2>
            <p className="text-gray-400 text-lg">
              Danh sách các mã giảm giá được tạo bởi quản trị viên
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Tìm kiếm mã giảm giá
              </label>
              <input
                type="text"
                placeholder="Nhập mã giảm giá..."
                value={searchCode}
                onChange={(e) => {
                  setSearchCode(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-5 py-3 rounded-xl bg-gray-700 border-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-base"
              />
            </div>
            <div className="lg:w-80">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Lọc theo trạng thái
              </label>
              <select
                value={searchStatus}
                onChange={(e) => {
                  setSearchStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-5 py-3 rounded-xl bg-gray-700 border-2 border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-base cursor-pointer"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Ngừng hoạt động</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-300 text-lg">Đang tải dữ liệu...</span>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900/50 border-b border-gray-700">
                      <th className="py-4 px-6 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                        STT
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Tên mã giảm giá
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Mã
                      </th>
                      <th className="py-4 px-6 text-center text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Giá trị
                      </th>
                      <th className="py-4 px-6 text-center text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Ngày bắt đầu
                      </th>
                      <th className="py-4 px-6 text-center text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Ngày kết thúc
                      </th>
                      <th className="py-4 px-6 text-center text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="py-4 px-6 text-center text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                    {currentDiscounts.map((discount, index) => {
                      const serialNumber = (currentPage - 1) * pageSize + index + 1;
                      return (
                        <tr
                          key={discount.discountId}
                          className="hover:bg-gray-700/50 transition-colors duration-150"
                        >
                          <td className="py-4 px-6 text-sm font-medium text-gray-300">
                            {serialNumber}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-200 font-medium">
                            {discount.name}
                          </td>
                          <td className="py-4 px-6 text-sm">
                            <span className="font-mono text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
                              {discount.code}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-900/30 text-indigo-300 border border-indigo-700/50">
                              {discount.discountType === "PERCENTAGE"
                                ? `${discount.value}%`
                                : `${discount.value.toLocaleString()} VND`}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-400 text-center">
                            {new Date(...discount.startDate).toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric"
                            })}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-400 text-center">
                            {new Date(...discount.endDate).toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric"
                            })}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                discount.status === "ACTIVE"
                                  ? "bg-green-900/30 text-green-400 border border-green-700/50"
                                  : "bg-gray-700 text-gray-400 border border-gray-600"
                              }`}
                            >
                              {discount.status === "ACTIVE" ? "Hoạt động" : "Ngừng"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => setEditingDiscountId(discount.discountId)}
                              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 shadow-lg"
                            >
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Chi tiết
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-8 flex justify-center items-center">
                <nav className="flex items-center space-x-2">
                  {getPaginationItems().map((item, index) => (
                    <button
                      key={index}
                      onClick={() => typeof item === "number" && handlePageChange(item)}
                      disabled={item === "..."}
                      className={`
                        ${item === currentPage
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                          : item === "..."
                          ? "text-gray-600 cursor-default"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
                        }
                        px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                        ${item !== "..." && item !== currentPage && "hover:border-gray-500"}
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500
                      `}
                    >
                      {item}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Results Summary */}
              <div className="mt-4 text-center text-sm text-gray-500">
                Hiển thị {startIndex + 1} - {Math.min(startIndex + pageSize, filteredDiscounts.length)} trong tổng số {filteredDiscounts.length} mã giảm giá
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DiscountsTable;