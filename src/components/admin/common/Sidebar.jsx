import { BarChart2, Menu, TrendingUp, Star } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GraduationCap, BookOpen, LogOut, Plus, Layers } from "lucide-react";
import { ChalkboardTeacher } from "phosphor-react";

const SIDEBAR_ITEMS = [
  { name: "Overview", icon: BarChart2, color: "#6366f1", href: "/admin" },
  { name: "Courses", icon: BookOpen, color: "#8B5CF6", href: "/admin/courses" },
  { name: "Student", icon: GraduationCap, color: "#EC4899", href: "/admin/student" },
  { name: "Instructor", icon: ChalkboardTeacher, color: "#EC4899", href: "/admin/instructor" },
  { name: "Add New User", icon: Plus, color: "#10B981", href: "/admin/add-user" },
  { name: "Category", icon: Layers, color: "#F97316", href: "/admin/category" },
  { name: "Statistics", icon: TrendingUp, color: "#6EE7B7", href: "/admin/statistics" },
  { name: "Logout", icon: LogOut, color: "#EF4444", href: "/logout" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
      style={{ maxHeight: "100vh", overflowY: "auto" }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <div key={item.href}>
              {item.name === "Logout" ? (
                <motion.div
                  className={`flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 cursor-pointer ${
                    location.pathname === item.href ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                  onClick={handleLogout}
                >
                  <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap text-white"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <Link to={item.href}>
                  <motion.div
                    className={`flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 ${
                      location.pathname === item.href ? "bg-gray-700" : "hover:bg-gray-700"
                    }`}
                  >
                    <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          className="ml-4 whitespace-nowrap text-white"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2, delay: 0.3 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
