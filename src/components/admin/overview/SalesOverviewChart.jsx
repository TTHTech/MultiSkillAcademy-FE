import React, { useEffect, useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, TrendingUp, DollarSign, LineChart as ChartIcon, ChevronDown, AlertCircle } from 'lucide-react';

const API_URL = "http://localhost:8080/api/admin/stats";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const YEARS = (() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 6 }, (_, i) => currentYear - i);
})();

// Enhanced loading skeleton with more professional appearance
const LoadingSkeleton = () => (
  <div className="w-full rounded-lg border border-blue-900/30 bg-slate-900 bg-opacity-90 backdrop-blur-md p-8 shadow-xl">
    <div className="animate-pulse">
      <div className="h-8 w-64 bg-slate-800 rounded mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="h-28 bg-slate-800 rounded-lg"></div>
        <div className="h-28 bg-slate-800 rounded-lg"></div>
        <div className="h-28 bg-slate-800 rounded-lg"></div>
      </div>
      <div className="h-96 w-full bg-slate-800 rounded-lg"></div>
    </div>
  </div>
);

// Enhanced stat card with better typography and visual hierarchy
const StatCard = ({ icon: Icon, title, value, trend, color = "blue" }) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-600/20",
      border: "border-blue-600/30",
      icon: "text-blue-400",
      trend: "text-emerald-400"
    },
    purple: {
      bg: "bg-indigo-600/20",
      border: "border-indigo-600/30",
      icon: "text-indigo-400",
      trend: "text-emerald-400"
    },
    teal: {
      bg: "bg-teal-600/20",
      border: "border-teal-600/30",
      icon: "text-teal-400",
      trend: "text-emerald-400"
    }
  };

  const classes = colorClasses[color];

  return (
    <div className={`${classes.bg} rounded-xl p-6 border ${classes.border} shadow-lg backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-300 text-sm font-medium tracking-wide">{title}</span>
        <Icon className={`w-5 h-5 ${classes.icon}`} />
      </div>
      <div className="text-3xl font-bold text-white mb-3 tracking-tight">{value}</div>
      {trend && (
        <div className="flex items-center text-sm">
          <TrendingUp className="w-4 h-4 mr-1 text-emerald-400" />
          <span className={classes.trend}>{trend}</span>
        </div>
      )}
    </div>
  );
};

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

  // Dropdown component with better styling
  const Dropdown = ({ isOpen, onToggle, value, options, onSelect, icon: Icon, placeholder }) => (
    <div className="relative">
      <button
        className="flex items-center px-4 py-2.5 text-white bg-slate-800/80 border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-md hover:bg-slate-700/80 transition-colors"
        onClick={onToggle}
      >
        {Icon && <Icon className="w-4 h-4 mr-2 text-blue-400" />}
        <span className="text-sm font-medium mr-2">{value || placeholder}</span>
        <ChevronDown className="w-4 h-4 text-blue-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-48 mt-2 bg-slate-800 border border-blue-500/30 rounded-lg shadow-xl backdrop-blur-md">
          <div className="py-1 max-h-64 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-blue-600/20 hover:text-white transition-colors"
                onClick={() => {
                  onSelect(option);
                  onToggle();
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="w-full rounded-xl border border-blue-900/30 bg-slate-900 bg-opacity-90 backdrop-blur-md p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <ChartIcon className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Sales Overview</h2>
        </div>
        
        <div className="flex gap-3">
          <Dropdown
            isOpen={isYearSelectOpen}
            onToggle={() => {
              setIsYearSelectOpen(!isYearSelectOpen);
              setIsMonthSelectOpen(false);
            }}
            value={selectedYear.toString()}
            options={YEARS.map(year => year.toString())}
            onSelect={(year) => setSelectedYear(parseInt(year))}
            placeholder="Select Year"
          />

          <Dropdown
            isOpen={isMonthSelectOpen}
            onToggle={() => {
              setIsMonthSelectOpen(!isMonthSelectOpen);
              setIsYearSelectOpen(false);
            }}
            value={selectedMonth || "All Months"}
            options={["All Months", ...MONTHS]}
            onSelect={(month) => setSelectedMonth(month === "All Months" ? "" : month)}
            icon={Calendar}
            placeholder="Select Month"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={DollarSign}
          title="Total Sales"
          value={`$${stats.total.toLocaleString()}`}
          trend={stats.growth}
          color="blue"
        />
        <StatCard 
          icon={TrendingUp}
          title="Average Sales"
          value={`$${stats.avg}`}
          color="purple"
        />
        <StatCard 
          icon={Calendar}
          title="Period"
          value={selectedMonth ? `${selectedMonth} ${selectedYear}` : `${selectedYear}`}
          color="teal"
        />
      </div>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-5 mb-6 text-red-300 bg-red-500/10 rounded-lg border border-red-500/30 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="font-medium">{error}</span>
          </motion.div>
        ) : processedData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16 text-slate-400 border border-dashed border-slate-700 rounded-lg bg-slate-800/50"
          >
            <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-500 opacity-50" />
            <p className="text-lg font-medium">No data available for the selected period</p>
            <p className="text-sm text-slate-500 mt-2">Try selecting a different time frame</p>
          </motion.div>
        ) : (
          <motion.div
            className="h-96 p-4 bg-slate-800/50 rounded-xl border border-blue-900/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#334155" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickLine={{ stroke: '#334155' }}
                  axisLine={{ stroke: '#334155' }}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickLine={{ stroke: '#334155' }}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={(value) => `$${value}`}
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    borderColor: "#3b82f6",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    fontFamily: "system-ui, sans-serif"
                  }}
                  itemStyle={{ color: "#f1f5f9", fontWeight: 500 }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
                  labelStyle={{ color: "#94a3b8", marginBottom: "0.5rem", fontWeight: 400 }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: 15 }} 
                  formatter={() => (
                    <span style={{ color: "#f1f5f9", fontWeight: 500 }}>Revenue</span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ 
                    fill: "#1e40af", 
                    strokeWidth: 2, 
                    stroke: "#3b82f6",
                    r: 5,
                  }}
                  activeDot={{ 
                    r: 8, 
                    strokeWidth: 2,
                    stroke: "#60a5fa",
                    fill: "#2563eb"
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