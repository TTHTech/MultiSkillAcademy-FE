import { BarChart2, Menu, TrendingUp, Star  } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, LogOut, Plus, Layers } from "lucide-react"; // Thêm icon "Plus" cho Add New User
import { ChalkboardTeacher } from "phosphor-react";

// Cập nhật danh sách các mục trong Sidebar
const SIDEBAR_ITEMS = [
  { name: "Overview", icon: BarChart2, color: "#6366f1", href: "/admin" },
  { name: "Courses", icon: BookOpen, color: "#8B5CF6", href: "/admin/courses" },
  { name: "Student", icon: GraduationCap, color: "#EC4899", href: "/admin/student" },
  { name: "Instructor", icon: ChalkboardTeacher, color: "#EC4899", href: "/admin/instructor" },
  { name: "Add New User", icon: Plus, color: "#10B981", href: "/admin/add-user" },
  { name: "Category", icon: Layers, color: "#F97316", href: "/admin/category" }, // Mục Category
  // { name: "Review", icon: Star , color: "#FBBF24", href: "/admin/review" }, // Cập nhật href cho logout để xử lý logic bên dưới  
  { name: "Sales", icon: TrendingUp , color: "#6EE7B7", href: "/admin/sales" }, // Mục Sales
  { name: "Logout", icon: LogOut, color: "#EF4444", href: "/logout" }, // Cập nhật href cho logout để xử lý logic bên dưới
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Hàm xử lý logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token khỏi localStorage
    navigate("/login"); // Chuyển hướng người dùng về trang đăng nhập
  };

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0    ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
      // Thêm thuộc tính cuộn và giới hạn chiều cao
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
                  className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2 cursor-pointer"
                  onClick={handleLogout} // Gọi hàm handleLogout khi người dùng nhấn vào Logout
                >
                  <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap text-white" // Màu chữ vàng
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
                    className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2"
                  >
                    <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          className="ml-4 whitespace-nowrap text-white" // Màu chữ vàng
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
