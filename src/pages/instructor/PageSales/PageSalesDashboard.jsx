import React, { useEffect, useState } from "react";
import axios from "axios";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const PageSalesDashboard = () => {
  // Lấy token và userId từ localStorage
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  
  // State lưu tổng số khóa học và tổng doanh số
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        // Gọi API với endpoint được xây dựng theo userId
        const response = await axios.get(
          `${baseUrl}/api/instructor/dashboard/total-sales/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Giả sử dữ liệu trả về là mảng chứa các DTO của khóa học
        const data = response.data;

        // Tính tổng số khóa học dựa trên số lượng phần tử trong mảng
        setTotalCourses(data.length);

        // Tính tổng doanh số: cộng dồn trường totalSales của từng khóa học
        const salesSum = data.reduce((acc, course) => acc + course.totalSales, 0);
        setTotalSales(salesSum);
      } catch (err) {
        console.error("Error fetching sales dashboard data:", err);
      }
    };

    fetchSalesData();
  }, [token, userId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold">Total Courses</h2>
          <p className="text-3xl">{totalCourses}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold">Total Sales</h2>
          <p className="text-3xl">${totalSales.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default PageSalesDashboard;
