import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState, useMemo } from "react";
import { Loader2, RefreshCcw, PieChart as PieChartIcon, AlertCircle } from "lucide-react";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const API_URL = `${baseUrl}/api/admin/stats`;

// Vibrant distinctive colors for categories
const DISTINCT_COLORS = [
  "#ff7e1d", // Vibrant Orange
  "#4169ff", // Royal Blue
  "#9c19bc", // Purple
  "#08c79c", // Turquoise 
  "#fb3e7a", // Hot Pink
  "#ffb700", // Golden Yellow
  "#0fb7ef", // Cyan
  "#ff5252", // Coral Red
  "#4caf50", // Emerald Green
  "#7e57c2", // Deep Purple
  "#2196f3", // Bright Blue
  "#00bcd4", // Teal
  "#ff9800", // Amber
  "#e91e63", // Pink
  "#3f51b5", // Indigo
  "#009688", // Green
  "#cddc39", // Lime
  "#ff5722", // Deep Orange
  "#607d8b"  // Blue Gray
];

// Animations configuration
const ANIMATIONS = {
  container: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  chart: {
    initial: { opacity: 0, scale: 0.95, rotate: -5 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    transition: { delay: 0.2, duration: 0.7, ease: "easeOut" }
  }
};

// Loading Spinner Component with enhanced styling
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-full py-12 space-y-3">
    <div className="p-3 bg-blue-500/10 rounded-full">
      <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
    </div>
    <p className="text-slate-400 text-sm">Loading category data...</p>
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

// Enhanced Tooltip with more info and better styling
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const data = payload[0];
  const percentage = ((data.value / data.payload.totalValue) * 100).toFixed(1);
  
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-xl border border-blue-900/30 backdrop-blur-md max-w-xs">
      <div className="flex items-start gap-2 mb-2">
        <div 
          className="w-3 h-3 rounded-full mt-1" 
          style={{ backgroundColor: data.fill }}
        />
        <h3 className="text-slate-200 font-semibold text-sm break-words">{data.name}</h3>
      </div>
      
      <div className="space-y-1 mt-3">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-xs">Count:</span>
          <span className="text-white font-mono font-medium">{data.value}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-xs">Percentage:</span>
          <span className="text-white font-mono font-medium">{percentage}%</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-700">
          <div className="w-full bg-slate-700 rounded-full h-1.5">
            <div 
              className="h-1.5 rounded-full" 
              style={{ 
                width: `${percentage}%`,
                backgroundColor: data.fill
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Side Legend component
const SideLegend = ({ data, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="h-full flex flex-col overflow-y-auto pr-1">
      <h3 className="text-sm font-semibold text-slate-200 mb-3 sticky top-0 bg-slate-800/70 py-1">
        Category Distribution
      </h3>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div 
            key={`legend-${index}`} 
            className={`flex items-center gap-2 p-1.5 rounded-md transition-colors cursor-pointer
                      ${selectedCategory === item.name 
                        ? 'bg-slate-700/70 shadow-sm' 
                        : 'hover:bg-slate-700/40'}`}
            onClick={() => setSelectedCategory(
              selectedCategory === item.name ? null : item.name
            )}
          >
            <div 
              className="min-w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-slate-300 truncate max-w-[55%]">
              {item.name}
            </span>
            <span className="text-xs text-slate-400 font-mono ml-auto">
              {((item.value / item.totalValue) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Empty State Component with enhanced styling
const EmptyState = ({ onRefresh }) => (
  <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400">
    <div className="p-4 bg-slate-800/50 rounded-full mb-4 border border-slate-700">
      <PieChartIcon className="w-10 h-10 text-slate-500" />
    </div>
    <p className="text-slate-300 font-medium mb-1">No category data available</p>
    <p className="text-slate-500 text-sm mb-4">Category distribution data not found</p>
    <button
      onClick={onRefresh}
      className="px-4 py-2 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors text-sm flex items-center gap-2"
    >
      <RefreshCcw size={14} />
      Refresh Data
    </button>
  </div>
);

const CategoryDistributionChart = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategoryData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    setError(null);
    setLoading(true); // Set loading state to true when refreshing
    setCategoryData([]); // Clear existing data before fetching
    
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // Add cache busting parameter
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform and calculate total
      const total = Object.values(data.categoryDistribution).reduce((a, b) => a + b, 0);
      const transformedData = Object.entries(data.categoryDistribution)
        .map(([name, value], index) => ({
          name,
          value,
          totalValue: total,
          color: DISTINCT_COLORS[index % DISTINCT_COLORS.length]
        }))
        .sort((a, b) => b.value - a.value);

      // Short timeout to ensure UI refresh is visible
      setTimeout(() => {
        setCategoryData(transformedData);
        setLoading(false);
        if (showRefreshing) setRefreshing(false);
      }, 300);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching category data:", error);
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  // Filters data based on selection
  const filteredData = useMemo(() => {
    if (!selectedCategory) return categoryData;
    return categoryData.filter(item => item.name === selectedCategory);
  }, [categoryData, selectedCategory]);

  // Memoize the chart configuration
  const chartConfig = useMemo(() => ({
    label: (entry) => {
      const percentage = ((entry.value / entry.totalValue) * 100).toFixed(1);
      // Always show the percentage
      return `${percentage}%`;
    },
    onMouseEnter: (_, index) => {
      setSelectedCategory(categoryData[index].name);
    },
    onMouseLeave: () => {
      setSelectedCategory(null);
    }
  }), [categoryData]);

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
              Category Distribution
            </h2>
            <p className="text-slate-400 text-xs">
              Distribution of courses across categories
            </p>
          </div>
        </div>
        
        {!loading && !error && (
          <button
            onClick={() => fetchCategoryData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 shadow-sm relative overflow-hidden group"
          >
            <RefreshCcw 
              size={14} 
              className={`text-blue-400 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}
            />
            <span className="text-slate-200 text-xs font-medium">
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </span>
            
            {/* Button highlight effect */}
            <span className="absolute inset-0 w-full h-full bg-blue-500/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </button>
        )}
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-blue-900/20 p-3">
        {loading && <LoadingSpinner />}
        {error && <ErrorDisplay message={error} onRetry={() => fetchCategoryData(true)} />}
        
        {!loading && !error && categoryData.length > 0 && (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-72"
            {...ANIMATIONS.chart}
          >
            {/* Chart on the left (3/5 of width) */}
            <div className="lg:col-span-3 h-full flex items-center justify-center">
              <div className="w-full h-full max-w-md mx-auto">
                <ResponsiveContainer width="100%" height="100%" className="text-xs font-medium">
                  <PieChart>
                    <Pie
                      data={filteredData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      labelLine={{ stroke: '#475569', strokeWidth: 1 }}
                      outerRadius={85}
                      innerRadius={40}
                      paddingAngle={3}
                      dataKey="value"
                      label={chartConfig.label}
                      minAngle={7}
                      onMouseEnter={chartConfig.onMouseEnter}
                      onMouseLeave={chartConfig.onMouseLeave}
                      activeIndex={selectedCategory ? filteredData.findIndex(item => item.name === selectedCategory) : undefined}
                      activeShape={(props) => {
                        const RADIAN = Math.PI / 180;
                        const { cx, cy, midAngle, outerRadius, fill, value, name, totalValue } = props;
                        const sin = Math.sin(-RADIAN * midAngle);
                        const cos = Math.cos(-RADIAN * midAngle);
                        const sx = cx + (outerRadius + 10) * cos;
                        const sy = cy + (outerRadius + 10) * sin;
                        const mx = cx + (outerRadius + 40) * cos;
                        const my = cy + (outerRadius + 40) * sin;
                        const percentage = ((value / totalValue) * 100).toFixed(1);
                        
                        // Position floating tooltip away from the chart more
                        const tooltipX = cos >= 0 ? cx + 160 : cx - 160;
                        const tooltipY = cy - 50;
                        
                        return (
                          <g>
                            {/* Active sector with enhanced style */}
                            <motion.path
                              initial={{ scale: 1 }}
                              animate={{ scale: 1.05 }}
                              transition={{ duration: 0.3 }}
                              d={props.arc}
                              fill={fill}
                              stroke="#0f172a"
                              strokeWidth={2}
                              filter="url(#glow)"
                              opacity={0.9}
                            />
                            
                            {/* Floating tooltip box with dark background */}
                            <rect
                              x={tooltipX - 100}
                              y={tooltipY - 40}
                              width={200}
                              height={80}
                              rx={6}
                              fill="rgba(15, 23, 42, 0.95)"
                              stroke="#334155"
                              strokeWidth={1}
                              filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))"
                            />
                            
                            {/* Category name */}
                            <text 
                              x={tooltipX} 
                              y={tooltipY - 15} 
                              fill="#fff" 
                              textAnchor="middle"
                              dominantBaseline="central"
                              fontSize={13}
                              fontWeight="bold"
                            >
                              {name}
                            </text>
                            
                            {/* Count label */}
                            <text 
                              x={tooltipX} 
                              y={tooltipY + 10} 
                              fill="#94a3b8" 
                              textAnchor="middle"
                              dominantBaseline="central"
                              fontSize={11}
                            >
                              Count: {value.toFixed(0)}
                            </text>
                            
                            {/* Percentage */}
                            <text 
                              x={tooltipX} 
                              y={tooltipY + 30} 
                              fill="#fff" 
                              textAnchor="middle"
                              dominantBaseline="central"
                              fontSize={14}
                              fontWeight="bold"
                              fontFamily="monospace"
                            >
                              {percentage}%
                            </text>
                            
                            {/* Connecting line */}
                            <path 
                              d={`M${cx},${cy}L${sx},${sy}L${mx},${my}L${tooltipX - 50},${tooltipY}`} 
                              stroke="#fff" 
                              fill="none"
                              strokeWidth={1.5}
                              strokeDasharray="2 2"
                            />
                          </g>
                        );
                      }}
                    >
                      <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="2" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      
                      <AnimatePresence>
                        {filteredData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="#0f172a"
                            strokeWidth={1}
                            className="transition-all duration-300 hover:opacity-90 hover:brightness-110"
                          />
                        ))}
                      </AnimatePresence>
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Legend on the right (2/5 of width) */}
            <div className="lg:col-span-2 h-full bg-slate-800/70 rounded-lg p-3 border border-slate-700/50">
              <SideLegend 
                data={categoryData} 
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>
          </motion.div>
        )}

        {!loading && !error && categoryData.length === 0 && (
          <EmptyState onRefresh={() => fetchCategoryData(true)} />
        )}
      </div>
    </motion.div>
  );
};

export default CategoryDistributionChart;