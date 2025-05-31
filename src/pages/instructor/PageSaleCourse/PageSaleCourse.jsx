import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/instructor/Sidebar/Sidebar";
import ChartSales7Day from "./ChartSales7Day";
import ChartOne from "./ChartOne";
import { CalendarDaysIcon } from "lucide-react";
import TableSalesCourse from "./TableSalesCourse";

const SalesDashboard = () => {
  const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
  const userId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");

  const [open, setOpen] = useState(true);
  const [dailySales, setDailySales] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [yearlySales, setYearlySales] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/instructor/dashboard/sales-course/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) throw new Error("Failed to fetch sales data");

        const data = await response.json();
        setDailySales(data.dailySalesLast7Days);
        setMonthlySales(data.monthlySales);
        setYearlySales(data.yearlySales);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    fetchSalesData();
  }, [baseUrl, userId, token]);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar open={open} setOpen={setOpen} className="h-full lg:w-64" />
      <div
        className={`flex-1 p-6 transition-margin duration-300 ${
          open ? "ml-72" : "ml-16"
        }`}
      >
        <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarDaysIcon className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Danh số khóa học
            </h1>
          </div>
        </header>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="col-span-1 xl:col-span-2">
            <div className="dark:bg-gray-800">
              <ChartOne monthlySales={monthlySales} />
            </div>
          </div>
          <div className="col-span-1">
            <div className="dark:bg-gray-800">
              <ChartSales7Day dailySalesLast7Days={dailySales} />
            </div>
          </div>
        </div>
        <TableSalesCourse />
      </div>
    </div>
  );
};

export default SalesDashboard;
