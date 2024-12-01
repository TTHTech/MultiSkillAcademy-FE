import { motion } from "framer-motion";

import Header from "../../components/admin/common/Header";
import StatCard from "../../components/admin/common/StatCard";

import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";

import CategoryTable from "../../components/admin/category/CategoryTable";

const CategoryPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Categories" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Categories"
            icon={Package}
            value={123} // Số lượng danh mục
            color="#6366F1"
          />
          <StatCard
            name="Top Category"
            icon={TrendingUp}
            value={12} // Chỉ số top category (ví dụ theo doanh thu)
            color="#10B981"
          />
          <StatCard
            name="Low Stock Categories"
            icon={AlertTriangle}
            value={5} // Số lượng category có số lượng thấp
            color="#F59E0B"
          />
          <StatCard
            name="Total Revenue"
            icon={DollarSign}
            value={"$1,234,567"} // Doanh thu từ các category
            color="#EF4444"
          />
        </motion.div>

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
