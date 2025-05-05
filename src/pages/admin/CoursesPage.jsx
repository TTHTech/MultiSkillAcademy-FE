import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, CheckCircle, Clock } from "lucide-react";
import Header from "../../components/admin/common/Header";
import OverviewCards from "../../components/admin/courses/OverviewCards";
import ProductsTable from "../../components/admin/courses/CoursesTable";
import AcceptedCoursesTable from "../../components/admin/courses/AcceptedCoursesTable";
import LockCoursesTable from "../../components/admin/courses/LockCoursesTable";

const ProductsPage = () => {
  const [activeTab, setActiveTab] = useState("productsTable");

  // Add animation variants for tab content
  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  // Add tab data for cleaner rendering
  const tabs = [
    {
      id: "productsTable",
      label: "Khóa học chờ duyệt",
      icon: <Layers className="mr-2" size={20} />,
      color: "bg-indigo-600",
      hoverColor: "hover:bg-indigo-700",
      component: <ProductsTable />
    },
    {
      id: "acceptedCoursesTable",
      label: "Khóa học đã duyệt",
      icon: <CheckCircle className="mr-2" size={20} />,
      color: "bg-emerald-600",
      hoverColor: "hover:bg-emerald-700",
      component: <AcceptedCoursesTable />
    },
    {
      id: "clockCoursesTable",
      label: "Khóa học bị khóa",
      icon: <Clock className="mr-2" size={20} />,
      color: "bg-amber-600",
      hoverColor: "hover:bg-amber-700",
      component: <LockCoursesTable />
    }
  ];

  // Get current active tab data
  const getActiveTabData = () => {
    return tabs.find(tab => tab.id === activeTab);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-700">
      <Header title="Quản lý khóa học" />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Animated overview cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <OverviewCards />
        </motion.div>

        {/* Enhanced Tab Navigation */}
        <div className="mt-8 border-b border-gray-700 relative">
          <div className="flex flex-wrap gap-2 sm:gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`relative flex items-center px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base transition-all duration-200 
                  ${activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Current tab indicator */}
        <div className="py-4 px-1">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${getActiveTabData().color} mr-2`}></div>
            <span className="text-sm text-gray-400">
              Đang xem:
              <span className="ml-1 text-white font-medium">{getActiveTabData().label}</span>
            </span>
          </div>
        </div>

        {/* Tab content with animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-2"
          >
            {tabs.find(tab => tab.id === activeTab).component}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ProductsPage;