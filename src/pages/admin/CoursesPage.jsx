import { motion } from "framer-motion";

import Header from "../../components/admin/common/Header";
import StatCard from "../../components/admin/common/StatCard";

import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../../components/admin/overview/CategoryDistributionChart";
import SalesTrendChart from "../../components/admin/courses/SalesTrendChart";
import ProductsTable from "../../components/admin/courses/CoursesTable";
import AcceptedCoursesTable from "../../components/admin/courses/AcceptedCoursesTable";
import ClockCoursesTable from "../../components/admin/courses/ClockCoursesTable";
import OverviewCards from "../../components/admin/courses/OverviewCards";
const ProductsPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Courses" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
      <OverviewCards /> 

        <ProductsTable />
        <AcceptedCoursesTable />
        <ClockCoursesTable />

        {/* CHARTS 
        <div className="grid grid-col-1 lg:grid-cols-2 gap-8">
          <SalesTrendChart />
          <CategoryDistributionChart />
        </div>*/}
      </main>
    </div>
  );
};
export default ProductsPage;
