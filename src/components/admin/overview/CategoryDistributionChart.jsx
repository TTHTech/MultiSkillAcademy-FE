import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useEffect, useState, useMemo } from "react";
import { Loader2 } from "lucide-react";

const API_URL = "http://localhost:8080/api/admin/stats";

// Constants
const COLORS = {
  primary: "#6366F1",    // Indigo
  secondary: "#8B5CF6",  // Purple
  accent: "#EC4899",     // Pink
  success: "#10B981",    // Green
  warning: "#F59E0B",    // Orange
  info: "#3B82F6",       // Blue
  error: "#EF4444"       // Red
};

const ANIMATIONS = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

// Custom Components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
    <span className="ml-2 text-gray-300">Loading data...</span>
  </div>
);

const ErrorMessage = ({ message }) => (
  <motion.div 
    className="flex flex-col items-center justify-center h-full text-center"
    {...ANIMATIONS}
  >
    <p className="text-red-400 mb-2">⚠️ Error loading data</p>
    <p className="text-gray-400 text-sm">{message}</p>
  </motion.div>
);

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const data = payload[0];
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
      <p className="text-gray-200 font-medium">{data.name}</p>
      <p className="text-gray-400">
        Count: <span className="text-gray-200">{data.value}</span>
      </p>
      <p className="text-gray-400">
        Percentage: <span className="text-gray-200">
          {((data.value / data.payload.totalValue) * 100).toFixed(1)}%
        </span>
      </p>
    </div>
  );
};

const CategoryDistributionChart = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategoryData = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform and calculate total
      const total = Object.values(data.categoryDistribution).reduce((a, b) => a + b, 0);
      const transformedData = Object.entries(data.categoryDistribution).map(([name, value]) => ({
        name,
        value,
        totalValue: total
      }));

      setCategoryData(transformedData);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching category data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  // Memoize the chart configuration
  const chartConfig = useMemo(() => ({
    label: ({ name, percent }) => (
      `${name} (${(percent * 100).toFixed(1)}%)`
    ),
    legendFormatter: (value) => (
      <span className="text-gray-300">{value}</span>
    )
  }), []);

  return (
    <motion.div
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg"
      initial={ANIMATIONS.initial}
      animate={ANIMATIONS.animate}
      transition={ANIMATIONS.transition}
    >
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Category Distribution
        </h2>
        {!loading && !error && (
          <button 
            onClick={fetchCategoryData}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            ↻ Refresh
          </button>
        )}
      </header>

      <div className="h-80">
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        
        {!loading && !error && categoryData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={chartConfig.label}
              >
                {categoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={Object.values(COLORS)[index % Object.values(COLORS).length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={chartConfig.legendFormatter} />
            </PieChart>
          </ResponsiveContainer>
        )}

        {!loading && !error && categoryData.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400">
            No data available
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CategoryDistributionChart;