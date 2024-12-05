import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import Sidebar from "../../components/instructor/Sidebar/Sidebar";
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

// Đăng ký các plugin của Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const InstructorDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 8; // Số khóa học mỗi trang
  const [open, setOpen] = useState(true); // Quản lý trạng thái Sidebar

  const token = localStorage.getItem("token"); // Lấy token từ localStorage

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/instructor/dashboard/total-sales/2",
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
  }, [token]);

  // Cấu hình dữ liệu cho biểu đồ
  const chartData = {
    labels: salesData.map((item) => item.courseName), // Tên các khóa học
    datasets: [
      {
        label: "Doanh thu",
        data: salesData.map((item) => item.totalSales), // Doanh thu của các khóa học
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
        fill: true, // Làm đầy vùng dưới đường biểu đồ
        tension: 0.3, // Làm đường cong mượt hơn
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
        text: "Doanh Thu Các Khóa Học",
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

  // Tính toán dữ liệu hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = salesData.slice(startIndex, startIndex + itemsPerPage);

  // Tính tổng số trang
  const totalPages = Math.ceil(salesData.length / itemsPerPage);

  return (
    <section
      className={`m-3 text-xl text-gray-900 font-semibold duration-300 flex-1 bg-gradient-to-b from-gray-100 to-gray-100 min-h-screen ${
        open ? "ml-72" : "ml-16"
      }`}
    >
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} className="h-full lg:w-64" />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 overflow-hidden">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
            Doanh Thu Các Khóa Học
          </h1>

          {/* Hiển thị trạng thái */}
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div>
              {/* Hiển thị biểu đồ */}
              <div className="mb-8 h-96">
                <Line data={chartData} options={chartOptions} />
              </div>

              {/* Danh sách khóa học */}
              <div className="overflow-x-auto shadow-md rounded-md">
                <table className="min-w-full table-auto bg-white">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Mã Khóa Học</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Tên Khóa Học</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Tổng Doanh Thu</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Số lượt mua</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-100 transition"
                      >
                        <td className="px-4 py-2">{item.courseId}</td>
                        <td className="px-4 py-2">{item.courseName}</td>
                        <td className="px-4 py-2">{item.totalSales.toLocaleString()}</td>
                        <td className="px-4 py-2">{item.salesSummary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
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
                    currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                  }`}
                >
                  Trang sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default InstructorDashboard;
