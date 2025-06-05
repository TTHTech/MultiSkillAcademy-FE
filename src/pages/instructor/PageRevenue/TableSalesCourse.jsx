import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const TableSalesCourse = () => {
  const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
  const userId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${baseUrl}/api/instructor/dashboard/course-sales/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCourses(res.data);
        setError("");
      } catch (err) {
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [baseUrl, userId, token]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const dataWithRevenue = useMemo(() => {
    return courses.map((c) => ({
      ...c,
      revenue: c.price * c.enrollments,
    }));
  }, [courses]);

  const filteredData = useMemo(() => {
    return dataWithRevenue.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [dataWithRevenue, search]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];
      if (sortOrder === "asc") return valueA - valueB;
      return valueB - valueA;
    });
  }, [filteredData, sortField, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <h2 className="text-2xl font-bold">Thống kê doanh thu từng khóa học</h2>
          <div className="flex gap-2">
            <input
              type="text"
              className="border px-3 py-2 rounded-md w-64"
              placeholder="Tìm kiếm khóa học..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <select
              className="border px-3 py-2 rounded-md"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 15, 20].map((n) => (
                <option key={n} value={n}>
                  {n} dòng
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-blue-600 font-medium">
            Đang tải dữ liệu...
          </div>
        ) : error ? (
          <div className="text-red-600 font-medium">{error}</div>
        ) : sortedData.length === 0 ? (
          <div className="text-gray-600">Không tìm thấy khóa học nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-3">Ảnh</th>
                  <th className="px-4 py-3">Khóa học</th>
                  <th
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("revenue")}
                  >
                    Doanh thu {sortField === "revenue" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((c, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 border-b border-gray-100"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={c.imageURL}
                        alt={c.title}
                        className="h-16 w-24 object-cover rounded-md shadow"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{c.title}</td>
                    <td className="px-4 py-3 text-blue-700 font-semibold">
                      {formatCurrency(c.priceRevenues)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableSalesCourse;
