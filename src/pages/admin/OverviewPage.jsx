import { Zap } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../../components/admin/common/Header";
import StatCard from "../../components/admin/common/StatCard";
import SalesOverviewChart from "../../components/admin/overview/SalesOverviewChart";
import CategoryDistributionChart from "../../components/admin/overview/CategoryDistributionChart";
import SalesChannelChart from "../../components/admin/overview/SalesChannelChart";
import { GraduationCap } from "lucide-react";
import { ChalkboardTeacher } from "phosphor-react";
import { BookOpen } from "lucide-react";
import CoursesDistributionChart from "../../components/admin/overview/CoursesDistributionChart";
const OverviewPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Sales"
            icon={Zap}
            value="$12,345"
            color="#6366F1"
          />
          <StatCard
            name="New Student"
            icon={GraduationCap}
            value="1,234"
            color="#8B5CF6"
          />
          <StatCard
            name="New Instructor"
            icon={ChalkboardTeacher}
            value="567"
            color="#EC4899"
          />
          <StatCard
            name="Total Courses"
            icon={BookOpen}
            value="2,401"
            color="#10B981"
          />
        </motion.div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-2">
            {/* Đưa SalesOverviewChart vào hàng riêng */}
            <SalesOverviewChart />
          </div>

          {/* Đưa CategoryDistributionChart và CoursesDistributionChart vào cùng hàng */}
          <div className="lg:col-span-1">
            <CategoryDistributionChart />
          </div>
          <div className="lg:col-span-1">
            <CoursesDistributionChart />
          </div>
          <div className="lg:col-span-2">
          {/* Đưa SalesOverviewChart vào hàng riêng */}
          <SalesChannelChart />
        </div>
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
