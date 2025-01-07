import React, { useState } from "react";
import { motion } from "framer-motion";
import { Table, User, Star } from "lucide-react";
import OverviewCards from "../../components/admin/overview/OverviewCards";
import SalesTable from "../../components/admin/sales/SalesTable";
import SalesInstructorTable from "../../components/admin/sales/SalesInstructorTable";
import ReviewTable from "../../components/admin/sales/ReviewTable"; // Import the ReviewTable component

const SalesPage = () => {
  const [activeTab, setActiveTab] = useState("salesTable");

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <header className="bg-gray-700 py-4 px-6 shadow-lg">
        <h1 className="text-xl text-white font-bold">Sales Management</h1>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <OverviewCards />

        <div className="flex justify-center space-x-8 mt-8">
          <button
            className={`flex items-center px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-105 ${
              activeTab === "salesTable" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setActiveTab("salesTable")}
          >
            <Table className="mr-2" size={20} /> Sales Table
          </button>
          <button
            className={`flex items-center px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-105 ${
              activeTab === "salesInstructorTable" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setActiveTab("salesInstructorTable")}
          >
            <User className="mr-2" size={20} /> Sales by Instructor
          </button>
          <button
            className={`flex items-center px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-105 ${
              activeTab === "reviewTable" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setActiveTab("reviewTable")}
          >
            <Star className="mr-2" size={20} /> Reviews
          </button>
        </div>

        <div className="mt-8">
          {activeTab === "salesTable" && <SalesTable />}
          {activeTab === "salesInstructorTable" && <SalesInstructorTable />}
          {activeTab === "reviewTable" && <ReviewTable />} {/* Add the ReviewTable component */}
        </div>
      </main>
    </div>
  );
};

export default SalesPage;
