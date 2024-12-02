import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/admin/stats";  // Thay đổi URL API của bạn nếu cần

const CoursesRevenueChart = () => {
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch course revenue percentage from API
  const fetchCourseData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch course revenue data.");
      }

      const data = await response.json();
      console.log("Fetched course revenue data:", data);

      // Prepare course revenue data for PieChart
      const transformedData = Object.entries(data.courseRevenuePercentage).map(([name, value]) => ({
        name,
        value,
      }));

      setCourseData(transformedData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B", "#FF6347", "#FFD700", "#32CD32", "#8B0000", "#00BFFF"];

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">Course Revenue Distribution</h2>

      <div className="h-80">
        {/* Loading and Error handling */}
        {loading && <p className="text-gray-100">Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        <ResponsiveContainer width={"100%"} height={"100%"}>
          <PieChart>
            <Pie
              data={courseData}
              cx={"50%"}
              cy={"50%"}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {courseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CoursesRevenueChart;
