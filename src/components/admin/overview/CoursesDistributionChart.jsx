import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useEffect, useState, useMemo } from "react";
import { Loader2, RefreshCcw, DollarSign } from "lucide-react";

const API_URL = "http://localhost:8080/api/admin/stats";

// Color palette for different revenue ranges
const COLORS = {
  high: "#10B981",    // Green for high revenue
  medium: "#6366F1",  // Indigo for medium revenue
  low: "#8B5CF6",     // Purple for low revenue
  veryLow: "#EC4899", // Pink for very low revenue
  other: "#F59E0B"    // Orange for others
};

// Animations configuration
const CHART_ANIMATIONS = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-3">
    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    <span className="text-gray-300 text-sm">Loading revenue data...</span>
  </div>
);

// Error Message Component
const ErrorDisplay = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <span className="text-red-400 text-lg mb-2">⚠️</span>
    <p className="text-red-400 font-medium">{message}</p>
    <p className="text-gray-400 text-sm mt-2">Please try again later</p>
  </div>
);

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const data = payload[0];
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-gray-200 font-medium mb-2">{data.name}</h3>
      <div className="flex items-center text-gray-300 space-x-2">
        <DollarSign size={16} className="text-green-400" />
        <span className="font-mono">
          {(data.value).toFixed(2)}%
        </span>
      </div>
      <p className="text-gray-400 text-sm mt-1">
        of total revenue
      </p>
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
      
      // Transform and sort data by value
      const transformedData = Object.entries(data.courseRevenuePercentage)
        .map(([name, value]) => ({
          name,
          value: parseFloat(value),
          color: value > 25 ? COLORS.high : 
                 value > 15 ? COLORS.medium :
                 value > 10 ? COLORS.low :
                 value > 5 ? COLORS.veryLow : COLORS.other
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

  // Memoize chart configuration
  const chartConfig = useMemo(() => ({
    customLabel: ({ name, value }) => (
      `${name.length > 20 ? name.substring(0, 20) + '...' : name} (${value.toFixed(1)}%)`
    ),
    legendFormatter: (value) => (
      <span className="text-gray-300 text-sm">{value}</span>
    )
  }), []);

  return (
    <motion.div
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg relative"
      {...CHART_ANIMATIONS}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-100">
            Course Revenue Distribution
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Revenue percentage by course
          </p>
        </div>
        
        {!loading && !error && (
          <button
            onClick={() => fetchCourseData(true)}
            disabled={refreshing}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <RefreshCcw 
              size={20} 
              className={`text-gray-400 ${refreshing ? 'animate-spin' : 'hover:text-gray-200'}`}
            />
          </button>
        )}
      </div>

      <div className="h-80">
        {loading && <LoadingSpinner />}
        {error && <ErrorDisplay message={error} />}
        
        {!loading && !error && courseData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={courseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={60}
                paddingAngle={2}
                dataKey="value"
                label={chartConfig.customLabel}
              >
                {courseData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                formatter={chartConfig.legendFormatter}
                layout="vertical"
                align="right"
                verticalAlign="middle"
              />
            </PieChart>
          </ResponsiveContainer>
        )}

        {!loading && !error && courseData.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p>No revenue data available</p>
            <button
              onClick={() => fetchCourseData(true)}
              className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
            >
              Refresh data
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CoursesRevenueChart;