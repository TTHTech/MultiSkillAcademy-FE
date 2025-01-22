import { motion } from "framer-motion";

import Header from "../../components/admin/common/Header";
// import StatCard from "../../components/admin/common/StatCard";

// import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";

import SalesInstructorTable from "../../components/admin/sales/SalesInstructorTable";
import OverviewCards from "../../components/admin/overview/OverviewCards";
const SaleByInstructorPage = () => {
    return (
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Instructor" />
  
        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          {/* STATS */}
          <OverviewCards /> {/* Use the OverviewCards component */}
  
          <SalesInstructorTable />
        </main>
      </div>
    );
  };
  
  export default SaleByInstructorPage;
  
