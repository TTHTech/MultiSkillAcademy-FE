import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/instructor/Sidebar/Sidebar";
import { CalendarDaysIcon } from "lucide-react";
import TableSalesCourse from "./TableSalesCourse";
import InstructorRevenueTable from "./InstructorRevenueTable";
const SalesDashboard = () => {
  const [open, setOpen] = useState(true);
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
              Doanh thu
            </h1>
          </div>
        </header>
        <div className="mt-8 space-y-4">
          <InstructorRevenueTable />
          <TableSalesCourse />
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
