import { motion } from "framer-motion";

import Header from "../../components/admin/common/Header";
import StatCard from "../../components/admin/common/StatCard";

import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";

import CategoryTable from "../../components/admin/category/CategoryTable";
import OverviewCards from "../../components/admin/category/OverviewCards";
const CategoryPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Categories" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <OverviewCards /> 

        {/* Tables */}
        <CategoryTable />


        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;
