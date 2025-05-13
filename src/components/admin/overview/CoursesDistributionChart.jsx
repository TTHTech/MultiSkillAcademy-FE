import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState, useMemo } from "react";
import {
  Loader2,
  RefreshCcw,
  PieChart as PieChartIcon,
  AlertCircle,
} from "lucide-react";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const API_URL = `${baseUrl}/api/admin/stats`;

// Distinct professional colors for different courses
const DISTINCT_COLORS = [
  "#f97316", // Orange
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
  "#10b981", // Emerald
  "#ef4444", // Red
  "#ec4899", // Pink
  "#0ea5e9", // Sky
  "#6366f1", // Indigo
  "#14b8a6", // Teal
  "#a855f7", // Purple
  "#84cc16", // Lime
  "#06b6d4", // Cyan
  "#dc2626", // Bright Red
  "#7c3aed", // Violet Darker
  "#0d9488", // Teal Darker
  "#0284c7", // Sky Darker
  "#ea580c", // Orange Darker
  "#a21caf", // Fuchsia
  "#15803d", // Green Darker
];

// Animations configuration
const ANIMATIONS = {
  container: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" },
  },
  chart: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { delay: 0.2, duration: 0.5, ease: "easeOut" },
  },
};

// Loading Spinner Component with enhanced styling
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-full py-12 space-y-3">
    <div className="p-3 bg-blue-500/10 rounded-full">
      <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
    </div>
    <p className="text-slate-400 text-sm">Loading revenue data...</p>
  </div>
);

// Error Message Component with enhanced styling
const ErrorDisplay = ({ message, onRetry }) => (
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

// Empty State Component with enhanced styling
const EmptyState = ({ onRefresh }) => (
  <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400">
    <div className="p-4 bg-slate-800/50 rounded-full mb-4 border border-slate-700">
      <PieChartIcon className="w-10 h-10 text-slate-500" />
    </div>
    <p className="text-slate-300 font-medium mb-1">No revenue data available</p>
    <p className="text-slate-500 text-sm mb-4">
      Course revenue distribution data not found
    </p>
    <button
      onClick={onRefresh}
      className="px-4 py-2 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors text-sm flex items-center gap-2"
    >
      <RefreshCcw size={14} />
      Refresh Data
    </button>
  </div>
);

// Custom Tooltip Component with enhanced styling
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const data = payload[0];
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-xl border border-blue-900/30 backdrop-blur-md">
      <h3 className="text-slate-200 font-semibold mb-2 text-sm">{data.name}</h3>
      <div className="flex items-center text-white font-medium space-x-2 mb-1">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: data.payload.color }}
        />
        <span className="font-mono text-lg">{data.value.toFixed(1)}%</span>
      </div>
      <p className="text-slate-400 text-xs">of total course revenue</p>
    </div>
  );
};

// Side Legend component with single-line entries
const SideLegend = ({ data }) => {
  return (
    <div className="h-full flex flex-col overflow-y-auto pr-1">
      <h3 className="text-sm font-semibold text-slate-200 mb-3 sticky top-0 bg-slate-800/70 py-1">
        Course Revenue
      </h3>
      <div className="space-y-2.5">
        {data.map((item, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="min-w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-slate-300 truncate max-w-[65%]">
              {item.name}
            </span>
            <span className="text-xs text-slate-400 font-mono ml-auto">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CoursesRevenueChart = () => {
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCourseData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch revenue data (${response.status})`);
      }

      const data = await response.json();

      // Transform data and assign distinct colors based on index
      const transformedData = Object.entries(data.courseRevenuePercentage)
        .map(([name, value], index) => ({
          name,
          value: parseFloat(value.toFixed(1)),
          // Assign color from the distinct colors array (cycle through if more courses than colors)
          color: DISTINCT_COLORS[index % DISTINCT_COLORS.length],
        }))
        .sort((a, b) => b.value - a.value);

      setCourseData(transformedData);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  // Memoized chart configuration
  const chartConfig = useMemo(
    () => ({
      customLabel: ({ name, value, index }) => {
        // Show percentages for all segments
        return `${value}%`;
      },
    }),
    []
  );

  return (
    <motion.div
      className="w-full rounded-xl border border-blue-900/30 bg-slate-900 bg-opacity-90 backdrop-blur-md p-6 shadow-xl"
      {...ANIMATIONS.container}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <PieChartIcon className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Phân Phối Doanh Thu Khóa Học
            </h2>
            <p className="text-slate-400 text-xs">
              Phân Tích Phần Trăm Doanh Thu Theo Khóa Học
            </p>
          </div>
        </div>

        {!loading && !error && (
          <button
            onClick={() => fetchCourseData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 shadow-sm self-end sm:self-auto"
          >
            <RefreshCcw
              size={14}
              className={`text-blue-400 ${refreshing ? "animate-spin" : ""}`}
            />
            <span className="text-slate-200 text-xs font-medium">
              {refreshing ? "Refreshing..." : "Refresh Data"}
            </span>
          </button>
        )}
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-blue-900/20 p-3">
        {loading && <LoadingSpinner />}
        {error && (
          <ErrorDisplay message={error} onRetry={() => fetchCourseData(true)} />
        )}

        {!loading && !error && courseData.length > 0 && (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-72"
            {...ANIMATIONS.chart}
          >
            {/* Legend on the left (2/5 of width) */}
            <div className="lg:col-span-2 h-full bg-slate-800/70 rounded-lg p-3 border border-slate-700/50">
              <SideLegend data={courseData} />
            </div>

            {/* Chart in the middle (3/5 of width) */}
            <div className="lg:col-span-3 h-full flex items-center justify-center">
              <div className="w-full h-full max-w-md mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={courseData}
                      cx="50%"
                      cy="50%"
                      labelLine={{ stroke: "#475569", strokeWidth: 1 }}
                      outerRadius={courseData.length > 10 ? 70 : 80}
                      innerRadius={40}
                      paddingAngle={3}
                      dataKey="value"
                      label={chartConfig.customLabel}
                      minAngle={7}
                    >
                      {courseData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="#0f172a"
                          strokeWidth={1}
                          className="transition-all duration-300 hover:opacity-90 hover:brightness-110"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {!loading && !error && courseData.length === 0 && (
          <EmptyState onRefresh={() => fetchCourseData(true)} />
        )}
      </div>
    </motion.div>
  );
};

export default CoursesRevenueChart;
