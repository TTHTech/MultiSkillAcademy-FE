import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const InstructorRevenueTable = () => {
  const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
  const userId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");

  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(revenues.length / itemsPerPage);
  const currentData = revenues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const mapPaymentStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "Chưa thanh toán";
      case "PARTIAL":
        return "Thanh toán một phần";
      case "PAID":
        return "Đã thanh toán";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatCurrency = (value) => {
    if (value == null) return "-";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("vi-VN") +
      " " +
      date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    );
  };

  useEffect(() => {
    const fetchRevenues = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${baseUrl}/api/instructor/dashboard/sales-revenues/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Lỗi khi tải dữ liệu (${response.status})`);
        }
        const data = await response.json();
        setRevenues(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenues();
  }, [baseUrl, userId, token]);
  const exportToExcel = () => {
    const headers = [
      "Thời gian",
      "Doanh thu tổng (VND)",
      "GV giới thiệu (VND)",
      "Nền tảng giới thiệu (VND)",
      "GV hưởng (VND)",
      "Nền tảng hưởng (VND)",
      "Thưởng (VND)",
      "Đã thanh toán (VND)",
      "Còn lại (VND)",
      "Trạng thái",
      "Ngày thanh toán",
    ];
    const dataNumbers = revenues.map((item) => [
      `${item.month.toString().padStart(2, "0")}/${item.year}`,
      item.totalRevenue, // number
      item.instructorReferredRevenue, // number
      item.platformReferredRevenue, // number
      item.instructorShare, // number
      item.platformShare, // number
      item.ratingBonus, // number
      item.paidAmount, // number
      item.remainingAmount, // number
      mapPaymentStatus(item.paymentStatus), // TEXT
      formatDateTime(item.lastPaymentDate), // TEXT
    ]);
    const worksheetData = [headers, ...dataNumbers];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    worksheet["!cols"] = [
      { wch: 12 }, // Thời gian
      { wch: 18 }, // Doanh thu tổng
      { wch: 18 }, // GV giới thiệu
      { wch: 20 }, // Nền tảng giới thiệu
      { wch: 15 }, // GV hưởng
      { wch: 15 }, // Nền tảng hưởng
      { wch: 12 }, // Thưởng
      { wch: 15 }, // Đã thanh toán
      { wch: 12 }, // Còn lại
      { wch: 15 }, // Trạng thái
      { wch: 18 }, // Ngày thanh toán
    ];
    headers.forEach((_, colIndex) => {
      const cellRef = XLSX.utils.encode_cell({ c: colIndex, r: 0 });
      if (!worksheet[cellRef]) return;

      worksheet[cellRef].s = {
        font: {
          name: "Arial",
          sz: 12,
          bold: true,
          color: { rgb: "FFFFFFFF" },
        },
        fill: {
          fgColor: { rgb: "4F81BD" },
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
        border: {
          top: { style: "thin", color: { rgb: "CCCCCC" } },
          bottom: { style: "thin", color: { rgb: "CCCCCC" } },
          left: { style: "thin", color: { rgb: "CCCCCC" } },
          right: { style: "thin", color: { rgb: "CCCCCC" } },
        },
      };
    });
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let row = 1; row <= range.e.r; ++row) {
      for (let col = 1; col <= 8; ++col) {
        const cellAddress = XLSX.utils.encode_cell({ c: col, r: row });
        const cell = worksheet[cellAddress];
        if (!cell) continue;
        cell.t = "n";
        cell.z = '#,##0"₫"';
        cell.s = {
          ...(cell.s || {}),
          alignment: { horizontal: "right", vertical: "center" },
        };
      }
    }
    worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Doanh thu GV");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, "Instructor_Revenue.xlsx");
  };
  return (
    <div className="p-6 min-h-[300px]">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Báo cáo doanh thu giảng viên theo tháng
          </h2>
          <button
            onClick={exportToExcel}
            className="mt-4 sm:mt-0 px-5 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition shadow-sm"
          >
            Xuất Excel
          </button>
        </div>

        {loading && (
          <div className="text-center py-8 text-gray-500 text-lg">
            Đang tải dữ liệu...
          </div>
        )}

        {error && (
          <div className="text-red-600 bg-red-100 border border-red-300 p-4 rounded mb-4">
            Có lỗi xảy ra: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {currentData.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                Không có dữ liệu.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentData.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-700">
                        Thời gian:
                      </span>
                      <span className="text-gray-800">
                        {`${item.month.toString().padStart(2, "0")}/${
                          item.year
                        }`}
                      </span>
                    </div>

                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-700">
                        Doanh thu tổng:
                      </span>
                      <span className="text-gray-800">
                        {formatCurrency(item.totalRevenue)}
                      </span>
                    </div>

                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-700">
                        GV giới thiệu:
                      </span>
                      <span className="text-gray-800">
                        {formatCurrency(item.instructorReferredRevenue)}
                      </span>
                    </div>

                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-700">
                        Nền tảng giới thiệu:
                      </span>
                      <span className="text-gray-800">
                        {formatCurrency(item.platformReferredRevenue)}
                      </span>
                    </div>

                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-700">
                        GV hưởng:
                      </span>
                      <span className="text-green-700 font-medium">
                        {formatCurrency(item.instructorShare)}
                      </span>
                    </div>

                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-700">
                        Nền tảng hưởng:
                      </span>
                      <span className="text-gray-800">
                        {formatCurrency(item.platformShare)}
                      </span>
                    </div>

                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-700">
                        Thưởng:
                      </span>
                      <span className="text-gray-800">
                        {formatCurrency(item.ratingBonus)}
                      </span>
                    </div>

                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-700">
                        Đã thanh toán:
                      </span>
                      <span className="text-gray-800">
                        {formatCurrency(item.paidAmount)}
                      </span>
                    </div>

                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-700">
                        Còn lại:
                      </span>
                      <span className="text-red-600 font-semibold">
                        {formatCurrency(item.remainingAmount)}
                      </span>
                    </div>

                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-700">
                        Trạng thái:
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        item.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-700"
                          : item.paymentStatus === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.paymentStatus === "PARTIAL"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                      >
                        {mapPaymentStatus(item.paymentStatus)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">
                        Ngày thanh toán:
                      </span>
                      <span className="text-gray-800">
                        {formatDateTime(item.lastPaymentDate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {revenues.length > itemsPerPage && (
              <div className="flex justify-center items-center space-x-2 mt-6">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-md border ${
                        currentPage === page
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InstructorRevenueTable;