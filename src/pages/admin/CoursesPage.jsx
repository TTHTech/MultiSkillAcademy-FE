import React, { useState } from "react";
import { motion } from "framer-motion";
import { Layers, CheckCircle, Clock } from "lucide-react";
import Header from "../../components/admin/common/Header";
import OverviewCards from "../../components/admin/courses/OverviewCards";
import ProductsTable from "../../components/admin/courses/CoursesTable";
import AcceptedCoursesTable from "../../components/admin/courses/AcceptedCoursesTable";
import LockCoursesTable from "../../components/admin/courses/LockCoursesTable";

const ProductsPage = () => {
  const [activeTab, setActiveTab] = useState("productsTable");

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Courses" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <OverviewCards />

        <div className="flex justify-center space-x-8 mt-8">
          <button
            className={`flex items-center px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-105 ${
              activeTab === "productsTable" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setActiveTab("productsTable")}
          >
            <Layers className="mr-2" size={20} /> Pending Courses
          </button>
          <button
            className={`flex items-center px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-105 ${
              activeTab === "acceptedCoursesTable" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setActiveTab("acceptedCoursesTable")}
          >
            <CheckCircle className="mr-2" size={20} /> Accepted Courses
          </button>
          <button
            className={`flex items-center px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-105 ${
              activeTab === "clockCoursesTable" ? "bg-yellow-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setActiveTab("clockCoursesTable")}
          >
            <Clock className="mr-2" size={20} /> Lock Courses
          </button>
        </div>

        <div className="mt-8">
          {activeTab === "productsTable" && <ProductsTable />}
          {activeTab === "acceptedCoursesTable" && <AcceptedCoursesTable />}
          {activeTab === "clockCoursesTable" && <LockCoursesTable />}
        </div>
      </main>
    </div>
  );
};

export default ProductsPage;
