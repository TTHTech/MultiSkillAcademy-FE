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
import { Loader2, RefreshCcw, TrendingUp, AlertCircle } from "lucide-react";

// Constants
const API_URL = "http://localhost:8080/api/admin/stats";

const COLORS = {
  primary: "#6366F1",    // Indigo
  secondary: "#8B5CF6",  // Purple
  success: "#10B981",    // Green
  warning: "#F59E0B",    // Orange
  info: "#3B82F6",      // Blue
  extra1: "#EC4899",    // Pink
  extra2: "#14B8A6"     // Teal
};

const ANIMATIONS = {
  container: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  },
  chart: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { delay: 0.15, duration: 0.3 }
  }
};

// Components
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-2">
    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
    <p className="text-gray-400 text-xs">Loading sales data...</p>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center h-full space-y-3">
    <AlertCircle className="w-8 h-8 text-red-400" />
    <p className="text-red-400 text-sm font-medium">{message}</p>
    <button
      onClick={onRetry}
      className="px-3 py-1.5 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors text-xs"
    >
      Try Again
    </button>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700 text-xs">
      <h3 className="text-gray-200 font-medium mb-1">{label}</h3>
      {payload.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: item.fill }}
          />
          <p className="text-gray-300">
            Revenue: <span className="font-mono">{item.value.toFixed(2)}%</span>
          </p>
        </div>
      ))}
    </div>
  );
};

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
        .map(([name, value]) => ({
          name,
          value: parseFloat(value.toFixed(2)),
          fill: COLORS[Object.keys(COLORS)[Math.floor(Math.random() * Object.keys(COLORS).length)]]
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
    yAxisDomain: [0, Math.max(...salesData.map(item => item.value)) + 5],
    barSize: 30
  }), [salesData]);

  return (
    <motion.div
      className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg"
      {...ANIMATIONS.container}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-1.5">
            <TrendingUp className="text-blue-500" size={18} />
            <h2 className="text-lg font-semibold text-gray-100">
              Sales by Category
            </h2>
          </div>
          <p className="text-gray-400 text-xs mt-0.5">
            Revenue distribution across categories
          </p>
        </div>

        {!loading && !error && (
          <button
            onClick={() => fetchSalesData(true)}
            disabled={refreshing}
            className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RefreshCcw 
              size={16}
              className={`text-gray-400 ${refreshing ? 'animate-spin' : 'hover:text-gray-200'}`}
            />
          </button>
        )}
      </div>

      <div className="h-72">
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} onRetry={() => fetchSalesData(true)} />}
        
        {!loading && !error && salesData.length > 0 && (
          <motion.div className="h-full" {...ANIMATIONS.chart}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} barSize={chartConfig.barSize}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#374151" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="name"
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                  axisLine={{ stroke: '#4B5563' }}
                  tickLine={{ stroke: '#4B5563' }}
                  dy={5}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                  axisLine={{ stroke: '#4B5563' }}
                  tickLine={{ stroke: '#4B5563' }}
                  domain={chartConfig.yAxisDomain}
                  unit="%"
                  width={35}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                  formatter={(value) => <span className="text-gray-300 text-xs">{value}</span>}
                  iconSize={8}
                  iconType="circle"
                />
                <Bar 
                  dataKey="value"
                  radius={[3, 3, 0, 0]}
                >
                  {salesData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.fill}
                      className="transition-opacity duration-200 hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {!loading && !error && salesData.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
            <p>No sales data available</p>
            <button
              onClick={() => fetchSalesData(true)}
              className="mt-2 text-blue-400 hover:text-blue-300 text-xs"
            >
              Refresh data
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SalesChannelChart;