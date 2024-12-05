import { motion } from "framer-motion";
import Header from "../../components/admin/common/Header";
import OverviewCards from "../../components/admin/instructor/OverviewCards"; // Import OverviewCards
import UsersTable from "../../components/admin/instructor/InstructorTable";

const UsersPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Instructor" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <OverviewCards /> {/* Use the OverviewCards component */}

        <UsersTable />
      </main>
    </div>
  );
};

export default UsersPage;
