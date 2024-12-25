import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { useState, useEffect } from "react";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const SalesChannelChart = () => {
  const [salesData, setSalesData] = useState([]);  // Lưu trữ dữ liệu doanh thu theo danh mục
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy dữ liệu doanh thu theo danh mục từ API
  const fetchCategoryRevenuePercentage = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch category revenue data");
      }

      const data = await response.json();
      console.log("Fetched category revenue data:", data);

      if (!data.categoryRevenuePercentage || typeof data.categoryRevenuePercentage !== 'object') {
        throw new Error("Invalid category revenue data received");
      }

      const transformedData = Object.entries(data.categoryRevenuePercentage).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)), // Làm tròn giá trị phần trăm
      }));

      setSalesData(transformedData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryRevenuePercentage();
  }, []);

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className='text-lg font-medium mb-4 text-gray-100'>Sales by Category</h2>

      <div className='h-80'>
        {/* Loading và Error Handling */}
        {loading && <p className='text-gray-100'>Loading...</p>}
        {error && <p className='text-red-500'>Error: {error}</p>}

        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
            <XAxis dataKey='name' stroke='#9CA3AF' />
            <YAxis stroke='#9CA3AF' />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
              formatter={(value) => `${value.toFixed(2)}%`} // Hiển thị phần trăm
            />
            <Legend />
            <Bar dataKey='value' fill='#8884d8'>
              {salesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesChannelChart;
