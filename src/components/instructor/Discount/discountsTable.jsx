import { useEffect, useState } from "react";
import axios from "axios";
import ViewDetail from "./ViewDetail";
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
  const userId = Number(localStorage.getItem("userId"));

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
          `${baseUrl}/api/instructor/discounts/list-discounts/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDiscounts(response.data);
      } catch (err) {
        setError("Không thể tải danh sách Discounts.");
      } finally {
        setLoading(false);
      }
    };
    fetchDiscounts();
  }, [token, refresh, userId]);
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
    <div className="p-6 bg-white rounded-lg shadow-lg mt-4">
      {editingDiscountId ? (
        <ViewDetail
          discountId={editingDiscountId}
          onCancel={() => setEditingDiscountId(null)}
          triggerRefresh={triggerRefresh}
        />
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Danh sách Discounts
          </h2>
          <div className="w-full flex flex-col sm:flex-row items-center gap-4 mb-6 px-4">
            <input
              type="text"
              placeholder="Tìm theo mã discount..."
              value={searchCode}
              onChange={(e) => {
                setSearchCode(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:max-w-md px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm"
            />
            <select
              value={searchStatus}
              onChange={(e) => {
                setSearchStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:max-w-xs px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="INACTIVE">Không hoạt động</option>
              <option value="PENDING">Đang chờ duyệt</option>
              <option value="DECLINED">Bị từ chối</option>
            </select>
          </div>

          {loading ? (
            <p className="text-gray-800 text-sm">Đang tải dữ liệu...</p>
          ) : error ? (
            <p className="text-red-600 text-sm">{error}</p>
          ) : (
            <>
              <table className="w-full text-gray-800 border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="py-3 px-4 border-r border-gray-300 text-sm">
                      STT
                    </th>
                    <th className="py-3 px-4 border-r border-gray-300 text-sm">
                      Tên
                    </th>
                    <th className="py-3 px-4 border-r border-gray-300 text-sm">
                      Mã
                    </th>
                    <th className="py-3 px-4 border-r border-gray-300 text-sm">
                      Giá trị
                    </th>
                    <th className="py-3 px-4 border-r border-gray-300 text-sm">
                      Ngày bắt đầu
                    </th>
                    <th className="py-3 px-4 border-r border-gray-300 text-sm">
                      Ngày kết thúc
                    </th>
                    <th className="py-3 px-4 border-r border-gray-300 text-sm">
                      Trạng thái
                    </th>
                    <th className="py-3 px-4 text-sm">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDiscounts.map((discount, index) => {
                    const serialNumber =
                      (currentPage - 1) * pageSize + index + 1;
                    return (
                      <tr
                        key={discount.discountId}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="py-3 px-4 border-r border-gray-300 text-center text-sm">
                          {serialNumber}
                        </td>
                        <td className="py-3 px-4 border-r border-gray-300 text-sm">
                          {discount.name}
                        </td>
                        <td className="py-3 px-4 border-r border-gray-300 text-sm">
                          {discount.code}
                        </td>
                        <td className="py-3 px-4 border-r border-gray-300 text-center text-sm">
                          {discount.discountType === "PERCENTAGE"
                            ? `${discount.value}%`
                            : `${discount.value} VND`}
                        </td>
                        <td className="py-3 px-4 border-r border-gray-300 text-center text-sm">
                          {new Date(...discount.startDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>
                        <td className="py-3 px-4 border-r border-gray-300 text-center text-sm">
                          {new Date(...discount.endDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>
                        <td className="py-3 px-4 border-r border-gray-300 text-center text-sm">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              discount.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {discount.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-sm">
                          <button
                            onClick={() =>
                              setEditingDiscountId(discount.discountId)
                            }
                            className="bg-yellow-400 text-gray-900 px-4 py-1 rounded hover:bg-yellow-500 transition-colors text-xs"
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-4 flex justify-center items-center space-x-2">
                {getPaginationItems().map((item, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      typeof item === "number" && handlePageChange(item)
                    }
                    className={`px-3 py-1 rounded text-sm ${
                      item === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                    disabled={item === "..."}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
export default DiscountsTable;
