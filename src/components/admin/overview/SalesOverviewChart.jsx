import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// API URL
const API_URL = "http://localhost:8080/api/admin/stats";

const SalesOverviewChart = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [salesData, setSalesData] = useState([]); // To store fetched sales data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch sales data from API
  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sales data.");
      }

      const data = await response.json();
      console.log("Fetched sales data:", data); // Check the structure of the data
      setSalesData(data.revenueByDate); // Assuming sales data is in revenueByDate
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Fetch sales data when the component mounts
  useEffect(() => {
    fetchSalesData();
  }, []);

  // Filter data by selected month
  const filterDataByMonth = (month) => {
    if (!month || !salesData) return [];  // If no month or no data, return empty
    return Object.entries(salesData)
      .filter(([date]) => new Date(date).toLocaleString("default", { month: "short" }) === month)
      .map(([date, sales]) => ({
        name: date,
        sales: sales,
      }));
  };

  const filteredData = filterDataByMonth(selectedMonth);

  // Handle default data to show when no data is available for selected month
  const defaultData = [
    { name: 'Jan', sales: 0 },
    { name: 'Feb', sales: 0 },
    { name: 'Mar', sales: 0 },
    { name: 'Apr', sales: 0 },
    { name: 'May', sales: 0 },
    { name: 'Jun', sales: 0 },
    { name: 'Jul', sales: 0 },
    { name: 'Aug', sales: 0 },
    { name: 'Sep', sales: 0 },
    { name: 'Oct', sales: 0 },
    { name: 'Nov', sales: 0 },
    { name: 'Dec', sales: 0 },
  ];

  // If no filtered data, show default data
  const dataToDisplay = filteredData.length > 0 ? filteredData : defaultData;

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">Sales Overview</h2>

      <div className="mb-4">
        {/* Date Picker to select month */}
        <DatePicker
          selected={selectedMonth ? new Date(`${selectedMonth} 1, 2024`) : null}
          onChange={(date) => setSelectedMonth(date ? date.toLocaleString('default', { month: 'short' }) : null)}
          dateFormat="MMM"
          showMonthYearPicker
          placeholderText="Select a month"
          className="p-2 rounded-lg bg-gray-700 text-gray-200"
        />
      </div>

      <div className="h-80">
        {/* Loading and Error handling */}
        {loading && <p className="text-gray-100">Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {/* If no data to show, display a message */}
        {filteredData.length === 0 && !loading && !error && (
          <p className="text-gray-400">No data available for the selected month.</p>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataToDisplay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesOverviewChart;
