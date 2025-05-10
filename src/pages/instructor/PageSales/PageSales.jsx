import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import Sidebar from "../../../components/instructor/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import PageSalesCourse from "./PageSalesCourse";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { AiFillFileExcel, AiFillFilePdf } from "react-icons/ai";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const InstructorDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [open, setOpen] = useState(true);
  const userId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");
  const [selectedCourseItem, setSelectedCourseItem] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/instructor/dashboard/total-sales/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSalesData(response.data);
      } catch (err) {
        setError("Không thể tải dữ liệu doanh thu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [token, userId]);

  const chartData = {
    labels: salesData.map((item) => item.courseName),
    datasets: [
      {
        label: "Doanh Thu Các Khóa Học",
        data: salesData.map((item) => item.totalSales),
        borderColor: "#4caf50",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "#66bb6a");
          gradient.addColorStop(1, "#c8e6c9");
          return gradient;
        },
        pointBackgroundColor: "#4caf50",
        pointBorderColor: "#ffffff",
        pointHoverRadius: 7,
        pointRadius: 5,
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            family: "'Roboto', sans-serif",
          },
          color: "#374151",
        },
      },
      title: {
        display: true,
        // text: "Doanh Thu Các Khóa Học",
        font: {
          size: 20,
          weight: "bold",
          family: "'Roboto', sans-serif",
        },
        color: "#1f2937",
      },
      tooltip: {
        backgroundColor: "rgba(31, 41, 55, 0.9)",
        titleFont: { size: 14, family: "'Roboto', sans-serif" },
        bodyFont: { size: 12, family: "'Roboto', sans-serif" },
        footerFont: { size: 10, family: "'Roboto', sans-serif" },
        callbacks: {
          label: (tooltipItem) => {
            return `Doanh thu: ${tooltipItem.raw.toLocaleString()} VND`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#374151",
          font: {
            size: 12,
            family: "'Roboto', sans-serif",
          },
        },
      },
      y: {
        grid: {
          color: "#e5e7eb",
          borderDash: [5, 5],
        },
        ticks: {
          color: "#374151",
          font: {
            size: 12,
            family: "'Roboto', sans-serif",
          },
        },
      },
    },
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = salesData.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(salesData.length / itemsPerPage);

  const exportToExcel = () => {
    const worksheetData = [
      ["Mã Khóa Học", "Tên Khóa Học", "Tổng Doanh Thu (VND)", "Số lượt mua"],
      ...salesData.map((item) => [
        item.courseId,
        item.courseName,
        Math.floor(item.totalSales).toLocaleString() + " VND",
        item.salesSummary,
      ]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    const columnWidths = [
      { wch: 15 }, // Mã Khóa Học
      { wch: 40 }, // Tên Khóa Học
      { wch: 20 }, // Tổng Doanh Thu
      { wch: 15 }, // Số lượt mua
    ];
    worksheet["!cols"] = columnWidths;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Doanh Thu");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(data, "DoanhThu_KhoaHoc.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("COURSE REVENUE REPORT", doc.internal.pageSize.width / 2, 15, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const today = new Date().toLocaleDateString();
    doc.text(`Export Date: ${today}`, 14, 25);

    const tableColumn = [
      "Course ID",
      "Course Name",
      "Total Revenue (VND)",
      "Purchases",
    ];
    const tableRows = salesData.map((item) => [
      item.courseId,
      item.courseName,
      item.totalSales.toLocaleString() + " VND",
      item.salesSummary,
    ]);

    doc.autoTable({
      startY: 35,
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
      headStyles: {
        fillColor: [0, 112, 192],
        textColor: 255,
        fontSize: 12,
        fontStyle: "bold",
      },
      bodyStyles: { fontSize: 11 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      styles: { cellPadding: 4, font: "helvetica" },
    });
    doc.save("Course_Revenue_Report.pdf");
  };
  return (
    <section
      className={`m-3 text-xl text-gray-900 font-semibold duration-300 flex-1 bg-gradient-to-b from-gray-100 to-gray-100 min-h-screen ${
        open ? "ml-72" : "ml-16"
      }`}
    >
      <Sidebar open={open} setOpen={setOpen} className="h-full lg:w-64" />

      <div className="flex-1 bg-gray-100 overflow-hidden">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {selectedCourseItem ? (
            <PageSalesCourse
              courseItem={selectedCourseItem}
              onClose={() => setSelectedCourseItem(null)}
            />
          ) : (
            <>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
                Doanh Thu Các Khóa Học
              </h1>
              <div className="flex justify-end space-x-2 mb-2">
                <button
                  onClick={exportToExcel}
                  className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
                >
                  <AiFillFileExcel className="text-xl" />
                  Xuất Excel
                </button>
                <button
                  onClick={exportToPDF}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                >
                  <AiFillFilePdf className="text-xl" />
                  Xuất PDF
                </button>
              </div>
              {loading ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500"></div>
                    <p className="mt-4 text-blue-500 text-xl font-bold">
                      Loading...
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500">{error}</div>
              ) : (
                <>
                  <div className="mb-8 h-96">
                    <Line data={chartData} options={chartOptions} />
                  </div>

                  <div className="overflow-x-auto shadow-lg rounded-lg">
                    <table className="min-w-full border-collapse bg-white rounded-lg">
                      <thead className="bg-gradient-to-r from-blue-700 to-blue-500 text-white">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium uppercase tracking-wider text-sm">
                            Mã Khóa Học
                          </th>
                          <th className="px-4 py-2 text-left font-medium uppercase tracking-wider text-sm">
                            Tên Khóa Học
                          </th>
                          <th className="px-4 py-2 text-right font-medium uppercase tracking-wider text-sm">
                            Tổng Doanh Thu
                          </th>
                          <th className="px-4 py-2 text-right font-medium uppercase tracking-wider text-sm">
                            Số lượt mua
                          </th>
                          <th className="px-4 py-2 text-center font-medium uppercase tracking-wider text-sm">
                            Chi Tiết
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.map((item, index) => (
                          <tr
                            key={index}
                            className={`border-b transition-colors duration-200 ${
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            } hover:bg-blue-100`}
                          >
                            <td className="px-4 py-2 text-gray-800 text-sm">
                              {item.courseId}
                            </td>
                            <td className="px-4 py-2 text-gray-800 text-sm">
                              {item.courseName}
                            </td>
                            <td className="px-4 py-2 text-right text-green-600 font-semibold text-sm">
                              {Math.floor(item.totalSales).toLocaleString()} ₫
                            </td>
                            <td className="px-4 py-2 text-right text-gray-800 font-semibold text-sm">
                              {item.salesSummary}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button
                                onClick={() => setSelectedCourseItem(item)}
                                className="px-3 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors duration-200"
                              >
                                Chi tiết
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <button
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
                        currentPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-blue-600"
                      }`}
                    >
                      Trang trước
                    </button>
                    <span className="text-gray-700">
                      Trang {currentPage} / {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
                        currentPage === totalPages
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-blue-600"
                      }`}
                    >
                      Trang sau
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default InstructorDashboard;
