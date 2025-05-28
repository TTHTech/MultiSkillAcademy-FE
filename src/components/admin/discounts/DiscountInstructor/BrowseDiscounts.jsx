import { useEffect, useState } from "react";
import axios from "axios";
import EditDiscount from "./editDiscountInstructor";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const BrowseDiscounts = () => {
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
  const toDate = (isoString) => {
    const normalized = isoString.replace(/\.(\d{3})\d+/, ".$1");
    return new Date(normalized);
  };

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
          `${baseUrl}/api/admin/discounts/instructor/pending`,
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
    <div className="overflow-x-auto p-6 bg-gray-800 rounded-lg shadow-lg mt-4">
      {editingDiscountId ? (
        <EditDiscount
          discountId={editingDiscountId}
          onCancel={() => setEditingDiscountId(null)}
          triggerRefresh={triggerRefresh}
        />
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4 text-white">
            Danh sách Discounts cần duyệt
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
              className="w-full sm:max-w-md px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loading ? (
            <p className="text-white">Đang tải dữ liệu...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <table className="w-full text-white border-collapse">
                <thead>
                  <tr className="bg-gray-700 border-b border-gray-600">
                    <th className="py-3 px-4 border-r border-gray-600">STT</th>
                    <th className="py-3 px-4 border-r border-gray-600">Tên</th>
                    <th className="py-3 px-4 border-r border-gray-600">Mã</th>
                    <th className="py-3 px-4 border-r border-gray-600">
                      Giá trị
                    </th>
                    <th className="py-3 px-4 border-r border-gray-600">
                      Ngày bắt đầu
                    </th>
                    <th className="py-3 px-4 border-r border-gray-600">
                      Ngày kết thúc
                    </th>
                    <th className="py-3 px-4 border-r border-gray-600">
                      Trạng thái
                    </th>
                    <th className="py-3 px-4">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDiscounts.map((discount, index) => {
                    const serialNumber =
                      (currentPage - 1) * pageSize + index + 1;
                    return (
                      <tr
                        key={discount.discountId}
                        className="hover:bg-gray-700 transition-colors duration-200"
                      >
                        <td className="py-3 px-4 border-r border-gray-600 text-center">
                          {serialNumber}
                        </td>
                        <td className="py-3 px-4 border-r border-gray-600">
                          {discount.name}
                        </td>
                        <td className="py-3 px-4 border-r border-gray-600">
                          {discount.code}
                        </td>
                        <td className="py-3 px-4 border-r border-gray-600 text-center">
                          {discount.discountType === "PERCENTAGE"
                            ? `${discount.value}%`
                            : `${discount.value} VND`}
                        </td>
                        <td className="py-3 px-4 border-r border-gray-600 text-center">
                          {toDate(discount.startDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>
                        <td className="py-3 px-4 border-r border-gray-600 text-center">
                          {toDate(discount.endDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>
                        <td className="py-3 px-4 border-r border-gray-600 text-center">
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${
                              discount.status === "ACTIVE"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          >
                            {discount.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() =>
                              setEditingDiscountId(discount.discountId)
                            }
                            className="bg-yellow-500 text-white px-4 py-1 rounded mr-2 hover:bg-yellow-600 transition-colors"
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-4 flex justify-center items-center space-x-2 text-white">
                {getPaginationItems().map((item, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      typeof item === "number" && handlePageChange(item)
                    }
                    className={`px-3 py-1 rounded ${
                      item === currentPage
                        ? "bg-blue-600"
                        : "bg-gray-600 hover:bg-gray-500"
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

export default BrowseDiscounts;
