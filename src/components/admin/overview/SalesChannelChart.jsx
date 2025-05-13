import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from "recharts";
import { useState, useEffect, useMemo } from "react";
import { Loader2, RefreshCcw, TrendingUp, AlertCircle, BarChart3 } from "lucide-react";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

// Constants
const API_URL = `${baseUrl}/api/admin/stats`;

// Enhanced professional color palette
const COLORS = {
  primary: "#3b82f6",    // Blue
  secondary: "#6366f1",  // Indigo
  tertiary: "#0ea5e9",   // Sky
  accent1: "#10b981",    // Emerald
  accent2: "#8b5cf6",    // Violet
  accent3: "#f59e0b",    // Amber
  accent4: "#0d9488"     // Teal
};

// Array form for easy mapping
const COLOR_ARRAY = Object.values(COLORS);

const ANIMATIONS = {
  container: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  chart: {
    initial: { opacity: 0, scale: 0.97 },
    animate: { opacity: 1, scale: 1 },
    transition: { delay: 0.2, duration: 0.4, ease: "easeOut" }
  }
};

// Enhanced Components
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-full py-12 space-y-3">
    <div className="p-3 bg-blue-500/10 rounded-full">
      <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
    </div>
    <p className="text-slate-400 text-sm">Loading category data...</p>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center h-full py-12 space-y-4">
    <div className="p-3 bg-red-500/10 rounded-full">
      <AlertCircle className="w-8 h-8 text-red-400" />
    </div>
    <p className="text-red-300 text-sm font-medium">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors text-sm shadow-sm flex items-center gap-2"
    >
      <RefreshCcw size={14} />
      Try Again
    </button>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-xl border border-blue-900/30 backdrop-blur-md">
      <h3 className="text-slate-200 font-semibold mb-2 text-sm">{label}</h3>
      {payload.map((item, index) => (
        <div key={index} className="flex items-center space-x-3 mt-1">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.fill }}
          />
          <p className="text-slate-300 font-medium">
            Revenue: <span className="text-white font-mono ml-1">{item.value.toFixed(2)}%</span>
          </p>
        </div>
      ))}
    </div>
  );
};

const EmptyState = ({ onRefresh }) => (
  <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400">
    <div className="p-4 bg-slate-800/50 rounded-full mb-4 border border-slate-700">
      <BarChart3 className="w-10 h-10 text-slate-500" />
    </div>
    <p className="text-slate-300 font-medium mb-1">No category data available</p>
    <p className="text-slate-500 text-sm mb-4">No revenue distribution data found for the current period</p>
    <button
      onClick={onRefresh}
      className="px-4 py-2 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors text-sm flex items-center gap-2"
    >
      <RefreshCcw size={14} />
      Refresh Data
    </button>
  </div>
);

const SalesChannelChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSalesData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data (${response.status})`);
      }

      const data = await response.json();

      if (!data.categoryRevenuePercentage || typeof data.categoryRevenuePercentage !== 'object') {
        throw new Error("Invalid data format received");
      }

      // Transform and sort data
      const transformedData = Object.entries(data.categoryRevenuePercentage)
        .map(([name, value], index) => ({
          name,
          value: parseFloat(value.toFixed(2)),
          fill: COLOR_ARRAY[index % COLOR_ARRAY.length]
        }))
        .sort((a, b) => b.value - a.value);

      setSalesData(transformedData);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  // Memoize chart configurations
  const chartConfig = useMemo(() => ({
    yAxisDomain: [0, Math.max(...(salesData.length ? salesData.map(item => item.value) : [0])) + 10],
    barSize: 36
  }), [salesData]);

  return (
    <motion.div
      className="w-full rounded-xl border border-blue-900/30 bg-slate-900 bg-opacity-90 backdrop-blur-md p-8 shadow-xl"
      {...ANIMATIONS.container}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Doanh Thu Theo Doanh Mục
            </h2>
          </div>
          <p className="text-slate-400 text-sm ml-10">
            Phân Phối Doanh Thu Theo Danh Mục Sản Phẩm
          </p>
        </div>

        {!loading && !error && (
          <button
            onClick={() => fetchSalesData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 shadow-sm"
          >
            <RefreshCcw 
              size={16}
              className={`text-blue-400 ${refreshing ? 'animate-spin' : ''}`}
            />
            <span className="text-slate-200 text-sm font-medium">
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </span>
          </button>
        )}
      </div>

      <div className="h-96 p-4 bg-slate-800/50 rounded-xl border border-blue-900/20">
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} onRetry={() => fetchSalesData(true)} />}
        
        {!loading && !error && salesData.length > 0 && (
          <motion.div className="h-full" {...ANIMATIONS.chart}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={salesData} 
                barSize={chartConfig.barSize}
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#334155" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="name"
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={{ stroke: '#334155' }}
                  dy={5}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={{ stroke: '#334155' }}
                  domain={chartConfig.yAxisDomain}
                  unit="%"
                  width={50}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: 15 }}
                  formatter={(value) => (
                    <span className="text-slate-300 text-sm font-medium">{value}</span>
                  )}
                  iconSize={10}
                  iconType="circle"
                />
                <Bar 
                  dataKey="value"
                  name="Revenue Percentage"
                  radius={[4, 4, 0, 0]}
                >
                  {salesData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.fill}
                      className="transition-all duration-200 hover:opacity-90 hover:brightness-110"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {!loading && !error && salesData.length === 0 && (
          <EmptyState onRefresh={() => fetchSalesData(true)} />
        )}
      </div>
    </motion.div>
  );
};

export default SalesChannelChart;