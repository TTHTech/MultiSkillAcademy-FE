import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X, ChevronDown, ChevronUp, BarChart2, Layers, DollarSign, FileText } from "lucide-react";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-4 rounded-lg my-4">
          <h2 className="text-lg font-bold">Đã xảy ra lỗi</h2>
          <p className="text-sm">{this.state.error?.message || 'Không thể hiển thị component này'}</p>
          <button 
            className="mt-3 bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Tải lại trang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main component wrapper with error boundary
const AdminRevenueDashboardWithErrorBoundary = () => {
  return (
    <ErrorBoundary>
      <AdminRevenueDashboard />
    </ErrorBoundary>
  );
};

// Main component
const AdminRevenueDashboard = () => {
  // States for dashboard overview
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // States for filtering
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(4); // Default to April

  // Mock color data for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Toast notification helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Initial data load for dashboard overview
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Error handling function
  const handleAuthError = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Fetch dashboard summary data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError();
        throw new Error("No token found, please login again.");
      }

      const response = await fetch(
        "http://localhost:8080/api/admin/revenue-reports/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        
        if (response.status === 401 || response.status === 403) {
          handleAuthError();
          throw new Error("Session expired. Please login again.");
        }
        
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error.message);
      showToast("error", `Lỗi khi tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch monthly revenue data for the dashboard
  const fetchMonthlyRevenue = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError();
        throw new Error("No token found, please login again.");
      }
      
      const response = await fetch(
        `http://localhost:8080/api/admin/revenue-reports/monthly?year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        
        if (response.status === 401 || response.status === 403) {
          handleAuthError();
          throw new Error("Session expired. Please login again.");
        }
        
        throw new Error(`Failed to fetch monthly revenue: ${response.status}`);
      }

      const data = await response.json();
      
      // Update dashboard data with monthly revenue
      setDashboardData(prevData => ({
        ...prevData,
        monthlyRevenue: data
      }));
    } catch (error) {
      console.error("Error fetching monthly revenue:", error);
      setError(error.message);
      showToast("error", `Lỗi khi tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle year selection
  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    
    // Refresh data based on new year
    fetchMonthlyRevenue();
  };

  // Handle month selection
  const handleMonthChange = (e) => {
    const month = parseInt(e.target.value);
    setSelectedMonth(month);
  };

  // Format to currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format percentage
  const formatPercent = (value) => {
    return value.toFixed(1) + "%";
  };

  // Get month name
  const getMonthName = (monthNumber) => {
    const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    return months[monthNumber - 1] || `Tháng ${monthNumber}`;
  };

  // Render dashboard summary
  const renderDashboardSummary = () => {
    if (!dashboardData) return <div>Loading dashboard data...</div>;
    
    // Prepare data for charts
    const monthlyData = Object.entries(dashboardData.monthlyRevenue || {})
      .map(([month, value]) => ({
        name: month.substring(5), // Get just month from YYYY-MM
        value: value / 1000000 // Convert to millions
      })).sort((a, b) => a.name.localeCompare(b.name));
    
    const sourceData = Object.entries(dashboardData.revenueBySource || {})
      .map(([source, value]) => ({
        name: source,
        value
      }));
    
    return (
      <div className="space-y-6">
        {/* Key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-600 bg-opacity-20 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Tổng doanh thu</h3>
            <p className="text-2xl font-bold text-blue-700">{formatCurrency(dashboardData.totalPlatformRevenue || 0)}</p>
          </div>
          <div className="bg-green-600 bg-opacity-20 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-green-600 mb-2">Thanh toán học viên</h3>
            <p className="text-2xl font-bold text-green-700">{formatCurrency(dashboardData.totalStudentPayments || 0)}</p>
          </div>
          <div className="bg-purple-600 bg-opacity-20 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-purple-600 mb-2">Chi trả giảng viên</h3>
            <p className="text-2xl font-bold text-purple-700">{formatCurrency(dashboardData.totalInstructorPayouts || 0)}</p>
          </div>
        </div>
        
        {/* Year selector */}
        <div className="flex justify-end">
          <select 
            value={selectedYear} 
            onChange={handleYearChange}
            className="bg-gray-700 text-white rounded-lg p-2"
          >
            <option value={2023}>2023</option>
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue Chart */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Doanh thu theo tháng (Triệu VNĐ)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <RechartsTooltip 
                    formatter={(value) => [`${value} Triệu VNĐ`, "Doanh thu"]}
                    labelFormatter={(label) => `Tháng ${label}`}
                  />
                  <Bar dataKey="value" fill="#8884d8" name="Doanh thu" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Revenue Source Distribution Chart */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Phân bổ doanh thu theo nguồn</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [`${(value * 100).toFixed(1)}%`, "Phần trăm"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Top instructors table */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Giảng viên có doanh thu cao nhất</h3>
            <div className="flex items-center space-x-2">
              <label className="text-gray-400">Tháng:</label>
              <select 
                value={selectedMonth} 
                onChange={handleMonthChange}
                className="bg-gray-700 text-white rounded-lg p-1"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i+1} value={i+1}>{getMonthName(i+1)}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-white">
              <thead className="text-xs uppercase bg-gray-700 text-white">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Giảng viên</th>
                  <th className="py-3 px-4">Tổng doanh thu</th>
                  <th className="py-3 px-4">Phần chia cho GV</th>
                  <th className="py-3 px-4">Tỷ lệ hiệu quả</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.topInstructors && dashboardData.topInstructors.length > 0 ? (
                  dashboardData.topInstructors.map((instructor) => (
                    <tr key={instructor.id} className="border-b border-gray-600">
                      <td className="py-3 px-4">{instructor.instructorId}</td>
                      <td className="py-3 px-4">{instructor.instructorFirstName} {instructor.instructorLastName}</td>
                      <td className="py-3 px-4">{formatCurrency(instructor.totalRevenue)}</td>
                      <td className="py-3 px-4">{formatCurrency(instructor.instructorShare)}</td>
                      <td className="py-3 px-4">{formatPercent(instructor.effectiveSharePercentage || 0)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-400">
                      Không có dữ liệu giảng viên.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading && !dashboardData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Đang tải...</div>
      </div>
    );
  }

  // Error state
  if (error && !dashboardData) {
    return (
      <div className="bg-red-500 text-white p-4 rounded-lg">
        <p>Lỗi: {error}</p>
        <button 
          className="mt-2 bg-white text-red-500 px-3 py-1 rounded"
          onClick={() => {
            setError(null);
            fetchDashboardData();
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Tổng quan doanh thu</h2>
      </div>

      {/* Main dashboard content */}
      <div>
        {renderDashboardSummary()}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 ${toast.type === "success" ? "bg-green-500" : "bg-red-500"} text-white p-4 rounded-lg shadow-lg z-50`}>
          <p>{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="absolute top-2 right-2 text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default AdminRevenueDashboardWithErrorBoundary;