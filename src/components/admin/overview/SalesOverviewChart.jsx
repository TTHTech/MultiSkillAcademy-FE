import React, { useEffect, useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, TrendingUp, DollarSign, LineChart as ChartIcon } from 'lucide-react';

const API_URL = "http://localhost:8080/api/admin/stats";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const YEARS = (() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 6 }, (_, i) => currentYear - i);
})();

const LoadingSkeleton = () => (
  <div className="w-full rounded-lg border border-gray-700 bg-gray-800 bg-opacity-50 backdrop-blur-md p-6">
    <div className="animate-pulse">
      <div className="h-8 w-64 bg-gray-700 rounded mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="h-24 bg-gray-700 rounded"></div>
        <div className="h-24 bg-gray-700 rounded"></div>
        <div className="h-24 bg-gray-700 rounded"></div>
      </div>
      <div className="h-80 w-full bg-gray-700 rounded"></div>
    </div>
  </div>
);

const StatCard = ({ icon: Icon, title, value, trend }) => (
  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 border border-gray-600">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-400 text-sm">{title}</span>
      <Icon className="w-5 h-5 text-gray-400" />
    </div>
    <div className="text-2xl font-bold text-gray-100 mb-1">{value}</div>
    {trend && (
      <div className="flex items-center text-sm">
        <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
        <span className="text-green-500">{trend}</span>
      </div>
    )}
  </div>
);

const SalesOverviewChart = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMonthSelectOpen, setIsMonthSelectOpen] = useState(false);
  const [isYearSelectOpen, setIsYearSelectOpen] = useState(false);

  const fetchSalesData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch sales data');
      }

      const data = await response.json();
      setSalesData(data.revenueByDate || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const processedData = useMemo(() => {
    if (!salesData || Object.keys(salesData).length === 0) {
      return MONTHS.map(month => ({ name: month, sales: 0 }));
    }

    return Object.entries(salesData)
      .filter(([date]) => {
        const dateObj = new Date(date);
        const monthName = dateObj.toLocaleDateString('default', { month: 'short' });
        const year = dateObj.getFullYear();
        return (selectedMonth ? monthName === selectedMonth : true) && 
               year === selectedYear;
      })
      .map(([date, sales]) => ({
        name: selectedMonth 
          ? new Date(date).toLocaleDateString('default', { day: '2-digit' })
          : new Date(date).toLocaleDateString('default', { month: 'short' }),
        sales: Number(sales),
        fullDate: date,
      }))
      .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));
  }, [salesData, selectedMonth, selectedYear]);

  const stats = useMemo(() => {
    const total = processedData.reduce((sum, item) => sum + item.sales, 0);
    const avg = processedData.length ? total / processedData.length : 0;
    const prevPeriodData = processedData.slice(0, -1);
    const prevTotal = prevPeriodData.reduce((sum, item) => sum + item.sales, 0);
    const growth = prevTotal ? ((total - prevTotal) / prevTotal * 100).toFixed(1) : 0;

    return {
      total,
      avg: avg.toFixed(2),
      growth: `${growth}% vs prev. period`
    };
  }, [processedData]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="w-full rounded-lg border border-gray-700 bg-gray-800 bg-opacity-50 backdrop-blur-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ChartIcon className="w-6 h-6 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-100">Sales Overview</h2>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <button
              className="flex items-center px-3 py-1.5 text-gray-200 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => {
                setIsYearSelectOpen(!isYearSelectOpen);
                setIsMonthSelectOpen(false);
              }}
            >
              <span className="text-sm">{selectedYear}</span>
            </button>

            {isYearSelectOpen && (
              <div className="absolute right-0 z-10 w-24 mt-2 bg-gray-700 border border-gray-600 rounded-lg shadow-lg">
                <div className="py-1">
                  {YEARS.map((year) => (
                    <button
                      key={year}
                      className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-600"
                      onClick={() => {
                        setSelectedYear(year);
                        setIsYearSelectOpen(false);
                      }}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="flex items-center px-3 py-1.5 text-gray-200 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => {
                setIsMonthSelectOpen(!isMonthSelectOpen);
                setIsYearSelectOpen(false);
              }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">{selectedMonth || "All Months"}</span>
            </button>

            {isMonthSelectOpen && (
              <div className="absolute right-0 z-10 w-48 mt-2 bg-gray-700 border border-gray-600 rounded-lg shadow-lg">
                <div className="py-1">
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-600"
                    onClick={() => {
                      setSelectedMonth("");
                      setIsMonthSelectOpen(false);
                    }}
                  >
                    All Months
                  </button>
                  {MONTHS.map((month) => (
                    <button
                      key={month}
                      className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-600"
                      onClick={() => {
                        setSelectedMonth(month);
                        setIsMonthSelectOpen(false);
                      }}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          icon={DollarSign}
          title="Total Sales"
          value={`$${stats.total.toLocaleString()}`}
          trend={stats.growth}
        />
        <StatCard 
          icon={TrendingUp}
          title="Average Sales"
          value={`$${stats.avg}`}
        />
        <StatCard 
          icon={Calendar}
          title="Period"
          value={selectedMonth ? `${selectedMonth} ${selectedYear}` : `${selectedYear}`}
        />
      </div>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 mb-4 text-red-500 bg-red-500 bg-opacity-10 rounded-lg border border-red-500"
          >
            {error}
          </motion.div>
        ) : processedData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-10 text-gray-400"
          >
            No data available for the selected period
          </motion.div>
        ) : (
          <motion.div
            className="h-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#4B5563" 
                  className="opacity-50"
                />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af' }}
                  tickLine={{ stroke: '#4B5563' }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af' }}
                  tickLine={{ stroke: '#4B5563' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(31, 41, 55, 0.95)",
                    borderColor: "#4B5563",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                  }}
                  itemStyle={{ color: "#E5E7EB" }}
                  formatter={(value) => [`$${value}`, 'Sales']}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ 
                    fill: "#6366F1", 
                    strokeWidth: 2, 
                    r: 4,
                    strokeDasharray: "" 
                  }}
                  activeDot={{ 
                    r: 6, 
                    strokeWidth: 2,
                    stroke: "#818CF8"
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SalesOverviewChart;