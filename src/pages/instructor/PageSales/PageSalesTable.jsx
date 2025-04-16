import React, { useEffect, useState } from "react";
import axios from "axios";

const PageSalesTable = () => {
  // Lấy token và userId từ localStorage
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  
  // State lưu danh sách dữ liệu của các khóa học
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        // Gọi API với endpoint cụ thể cho dữ liệu bảng bán hàng
        const response = await axios.get(
          `http://localhost:8080/api/instructor/dashboard/total-sales/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Set dữ liệu trả về vào state
        setSalesData(response.data);
      } catch (err) {
        console.error("Error fetching sales table data:", err);
      }
    };

    fetchSalesData();
  }, [token, userId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sales Details</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 border-b">Course ID</th>
            <th className="py-2 border-b">Course Name</th>
            <th className="py-2 border-b">Total Sales</th>
            <th className="py-2 border-b">Sales Summary (Enrollments)</th>
          </tr>
        </thead>
        <tbody>
          {salesData && salesData.length > 0 ? (
            salesData.map((course) => (
              <tr key={course.courseId}>
                <td className="py-2 border-b text-center">{course.courseId}</td>
                <td className="py-2 border-b text-center">{course.courseName}</td>
                <td className="py-2 border-b text-center">${course.totalSales.toFixed(2)}</td>
                <td className="py-2 border-b text-center">{course.salesSummary}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-2 text-center">
                No Sales Data Available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PageSalesTable;
