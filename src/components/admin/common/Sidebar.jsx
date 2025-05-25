import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart2,
  Menu,
  TrendingUp,
  BookOpen,
  LogOut,
  Plus,
  Layers,
  GraduationCap,
  ChevronRight,
  Settings,
  User,
  ChevronDown,
  Users,
  Bell,
  ListFilter,
  PlusSquare,
  MessageSquare,
  FolderTree,
  Video,
  Tag,
  Percent,
  Ticket,
  PlusCircle,
  MessageCircle,
  MessagesSquare,
  Megaphone,
  Shield,
  Sliders,
  Palette,
  HeadphonesIcon,
  FolderPlus,
  Inbox,
  AlertTriangle,
  Mail,
  Archive,
  BarChart,
  Activity,
  FileText,
  LayoutDashboard,
  Clock,
  LineChart,
  BadgePercent,
  DollarSign,
  UserCircle2,
  Tag as TagIcon,
  Gift as GiftIcon,
  Ticket as TicketIcon,
  Percent as PercentIcon,
  BadgePercent as BadgePercentIcon,
  PlusCircle as PlusCircleIcon,
  CheckCircle,
  Lock,
} from "lucide-react";
import { ChalkboardTeacher } from "phosphor-react";

// Animation styles
const animationStyles = `
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}

.animate-pulse-slow {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}
`;

const MENU_GROUPS = [
  {
    label: "Menu Chính",
    items: [
      {
        name: "Tổng Quan",
        icon: BarChart2,
        color: "#4f46e5",
        subItems: [
          {
            name: "Bảng Thống Kê",
            icon: LayoutDashboard,
            href: "/admin",
            color: "#4f46e5",
          },
          /**{
            name: "Thống Kê Nhanh",
            icon: LineChart,
            href: "/admin/quick-stats",
            color: "#818cf8",
          },
          {
            name: "Hoạt Động Gần Đây",
            icon: Clock,
            href: "/admin/recent-activity",
            color: "#4f46e5",
          },**/
        ],
      },
      {
        name: "Thống Kê",
        icon: TrendingUp,
        color: "#10b981",
        subItems: [
          /**{
            name: "Bảng Doanh Số",
            icon: BarChart,
            href: "/admin/statistics",
            color: "#10b981",
          },**/
          {
            name: "Doanh Số Theo Giảng Viên",
            icon: Users,
            href: "/admin/sale-by-instructor",
            color: "#34d399",
          },

          {
            name: "Thống Kê Đánh Giá",
            icon: Activity,
            href: "/admin/statistics-review",
            color: "#10b981",
          },
          {
            name: "Thống kê khóa học",
            icon: FileText,
            href: "/admin/statistics-courses",
            color: "#059669",
          },
        ],
      },
      {
        name: "Quản Lý Doanh Thu",
        icon: BarChart2,
        color: "#3b82f6",
        subItems: [
          {
            name: "Thanh Toán Doanh Thu",
            icon: DollarSign,
            href: "/admin/payments",
            color: "#3b82f6",
          },
          {
            name: "Tổng Quan Doanh Thu",
            icon: Users,
            href: "/admin/revenue-dashboard",
            color: "#3b82f6",
          },
          {
            name: "Doanh Thu Giảng Viên",
            icon: DollarSign,
            href: "/admin/instructor-revenue",
            color: "#2563eb",
          },
          /**{
            name: "Báo Cáo Doanh Số Giảng Viên",
            icon: TrendingUp,
            href: "/admin/instructor-sales",
            color: "#1d4ed8",
          },**/
          {
            name: "Chính Sách Doanh Thu",
            icon: FileText,
            href: "/admin/revenue-policy",
            color: "#2563eb",
          },
          {
            name: "Báo Cáo Thanh Toán",
            icon: Archive,
            href: "/admin/revenue/payouts",
            color: "#1d4ed8",
          },
        ],
      },

      {
        name: "Thông Báo",
        icon: Bell,
        color: "#f59e0b",
        subItems: [
          {
            name: "Tất Cả Thông Báo",
            icon: Inbox,
            href: "/admin/notification",
            color: "#f59e0b",
          },
          {
            name: "Tạo Thông Báo",
            icon: Mail,
            href: "/admin/add-notification",
            color: "#ef4444",
          },
        ],
      },
    ],
  },
  {
    label: "Quản Lý Khóa Học",
    items: [
      {
        name: "Khóa Học",
        icon: BookOpen,
        color: "#8b5cf6",
        subItems: [
          {
            name: "Tất Cả Khóa Học",
            icon: ListFilter,
            href: "/admin/courses",
            color: "#8b5cf6",
          },
          {
            name: "Khóa Học Đã Duyệt",
            icon: CheckCircle,
            href: "/admin/courses/approved",
            color: "#22c55e", // xanh lá
          },
          {
            name: "Khóa Học Chờ Duyệt",
            icon: Clock,
            href: "/admin/courses/pending",
            color: "#eab308", // vàng
          },
          {
            name: "Khóa Học Bị Khóa",
            icon: Lock,
            href: "/admin/courses/locked",
            color: "#ef4444", // đỏ
          },
          {
            name: "Đánh Giá Khóa Học",
            icon: MessageSquare,
            href: "/admin/courses/reviews",
            color: "#ec4899",
          },
          {
            name: "Chương",
            icon: FolderTree,
            href: "/admin/courses/sections",
            color: "#4f46e5",
          },
          {
            name: "Bài Giảng",
            icon: Video,
            href: "/admin/courses/lectures",
            color: "#8b5cf6",
          },
        ],
      },
      {
        name: "Danh Mục",
        icon: Layers,
        color: "#f97316",
        subItems: [
          {
            name: "Tất Cả Danh Mục",
            icon: ListFilter,
            href: "/admin/category",
            color: "#f97316",
          },
        ],
      },
      {
        name: "Mã Giảm Giá",
        icon: TagIcon,
        color: "#ec4899",
        subItems: [
          {
            name: "Sử Dụng Mã Giảm Giá",
            icon: TicketIcon,
            href: "/admin/discount-usage",
            color: "#f59e0b",
          },
          {
            name: "Danh Sách Mã Giảm Giá",
            icon: PercentIcon,
            href: "/admin/discounts",
            color: "#ec4899",
          },
          {
            name: "Duyệt Mã Giảm Giá",
            icon: BadgePercentIcon,
            href: "/admin/browsed-discounts",
            color: "#6366f1",
          },
          {
            name: "Thêm Mã Giảm Giá",
            icon: PlusCircleIcon,
            href: "/admin/discount/add",
            color: "#10b981",
          },
        ],
      },
      {
        name: "Khuyến Mãi",
        icon: GiftIcon,
        color: "#3b82f6",
        subItems: [
          {
            name: "Sử Dụng Khuyến Mãi",
            icon: TicketIcon,
            href: "/admin/promotions-usage",
            color: "#f59e0b",
          },
          {
            name: "Danh Sách Khuyến Mãi",
            icon: PercentIcon,
            href: "/admin/promotions",
            color: "#3b82f6",
          },
          {
            name: "Thêm Khuyến Mãi",
            icon: PlusCircleIcon,
            href: "/admin/promotions/add",
            color: "#10b981",
          },
        ],
      },
      {
        name: "Báo Cáo",
        icon: AlertTriangle,
        color: "#f97316",
        subItems: [
          {
            name: "Báo Cáo Đánh Giá Khóa Học",
            icon: MessageCircle,
            href: "/admin/report/review-course",
            color: "#f97316",
          },
          // {
          //   name: "Báo Cáo Khóa Học",
          //   icon: Ticket,
          //   href: "/admin/report/course",
          //   color: "#10b981",
          // },
        ],
      },
    ],
  },
  {
    label: "Quản Lý Người Dùng",
    items: [
      {
        name: "Người Dùng",
        icon: Users,
        color: "#ec4899",
        subItems: [
          {
            name: "Danh Sách Học Viên",
            icon: GraduationCap,
            href: "/admin/student",
            color: "#ec4899",
          },
          {
            name: "Danh Sách Giảng Viên",
            icon: ChalkboardTeacher,
            href: "/admin/instructor",
            color: "#ec4899",
          },
          {
            name: "Thêm Người Dùng",
            icon: Plus,
            href: "/admin/add-user",
            color: "#10b981",
          },
        ],
      },
    ],
  },
  {
    label: "Truyền Thông",
    items: [
      {
        name: "Tin Nhắn",
        icon: MessageCircle,
        color: "#10b981",
        subItems: [
          {
            name: "Trò Chuyện",
            icon: MessagesSquare,
            href: "/admin/chat",
            color: "#10b981",
          },
          /**{
            name: "Thông Báo Nội Bộ",
            icon: Megaphone,
            href: "/admin/announcements",
            color: "#f59e0b",
          },
          {
            name: "Hỗ Trợ",
            icon: HeadphonesIcon,
            href: "/admin/support",
            color: "#ec4899",
          },**/
        ],
      },
    ],
  },
  {
    label: "Quản Trị",
    items: [
      {
        name: "Cài Đặt",
        icon: Settings,
        color: "#64748b",
        subItems: [
          {
            name: "Hồ Sơ Quản Trị Viên",
            icon: UserCircle2,
            href: "/admin/profile-admin",
            color: "#64748b",
          },
          /**{
            name: "Chung",
            icon: Sliders,
            href: "/admin/settings/general",
            color: "#64748b",
          },
          {
            name: "Giao Diện",
            icon: Palette,
            href: "/admin/settings/appearance",
            color: "#8b5cf6",
          },
          {
            name: "Bảo Mật",
            icon: Shield,
            href: "/admin/settings/security",
            color: "#10b981",
          },**/
        ],
      },
    ],
  },
];

const UserProfile = ({ isOpen, formData }) => (
  <motion.div
    className="flex items-center p-4 mb-4 bg-slate-700/40 hover:bg-slate-700/60 rounded-lg transition-colors border border-slate-600/30 shadow-sm"
    initial={false}
    animate={{
      height: isOpen ? "auto" : "64px",
      transition: { duration: 0.2 },
    }}
  >
    <div className="flex-shrink-0">
      {formData.profileImagePreview ? (
        <img
          src={formData.profileImagePreview}
          alt="Profile Preview"
          className="w-10 h-10 rounded-full object-cover shadow-md"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 animate-gradient flex items-center justify-center shadow-md">
          <User size={20} className="text-white" />
        </div>
      )}
    </div>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="ml-3 overflow-hidden"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
        >
          <p className="text-sm font-medium text-white">
            {formData.firstName} {formData.lastName}
          </p>
          <p className="text-xs text-slate-300">{formData.email}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const MenuItem = ({
  item,
  isOpen,
  isActive,
  isSubmenuOpen,
  onToggleSubmenu,
}) => {
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isParentOfActive = item.subItems?.some(
    (subItem) => window.location.pathname === subItem.href
  );

  return (
    <div className="relative">
      <motion.div
        className={`flex items-center p-2.5 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer
          ${
            isActive || isParentOfActive
              ? "bg-slate-700/60 border border-slate-600/30 shadow-sm"
              : "hover:bg-slate-700/40 border border-transparent"
          }`}
        onClick={hasSubItems ? onToggleSubmenu : undefined}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div
          className={`p-1.5 rounded-md ${
            isActive || isParentOfActive ? "bg-slate-600/40" : "bg-slate-700/30"
          }`}
        >
          <item.icon
            size={18}
            style={{
              color: item.color,
              minWidth: "18px",
            }}
          />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.span
              className="ml-3 text-slate-200 whitespace-nowrap overflow-hidden"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
            >
              {item.name}
            </motion.span>
          )}
        </AnimatePresence>
        {isOpen && hasSubItems && (
          <motion.div
            className="ml-auto"
            animate={{ rotate: isSubmenuOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={16} className="text-slate-400" />
          </motion.div>
        )}
        {isActive && isOpen && !hasSubItems && (
          <motion.div
            className="ml-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </motion.div>
        )}
      </motion.div>

      {/* Submenu */}
      {hasSubItems && (
        <AnimatePresence>
          {isSubmenuOpen && isOpen && (
            <motion.div
              className="mt-1 ml-3 pl-3 border-l border-slate-600/40"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {item.subItems.map((subItem) => (
                <Link key={subItem.href} to={subItem.href}>
                  <motion.div
                    className={`flex items-center p-2 text-sm font-medium rounded-md transition-all duration-200
                      ${
                        window.location.pathname === subItem.href
                          ? "bg-slate-700/60 border border-slate-600/30"
                          : "hover:bg-slate-700/40 border border-transparent"
                      }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div
                      className={`p-1 rounded-md ${
                        window.location.pathname === subItem.href
                          ? "bg-slate-600/40"
                          : "bg-slate-700/30"
                      }`}
                    >
                      <subItem.icon
                        size={16}
                        style={{
                          color: subItem.color,
                          minWidth: "16px",
                        }}
                      />
                    </div>
                    <span className="ml-3 text-slate-300 text-xs">
                      {subItem.name}
                    </span>
                    {window.location.pathname === subItem.href && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-green-500"></div>
                    )}
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const Sidebar = () => {
  // Inject animation styles
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = animationStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    profileImageFile: null,
    profileImagePreview: "",
  });
  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/admin/profile/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setFormData((prev) => ({
          ...prev,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          dateOfBirth: data.dateOfBirth
            ? `${data.dateOfBirth[0]}-${String(data.dateOfBirth[1]).padStart(
                2,
                "0"
              )}-${String(data.dateOfBirth[2]).padStart(2, "0")}`
            : "",
          profileImagePreview: data.profileImageUrl || "",
        }));
      });
    setMounted(true);
    return () => setMounted(false);
  }, [token, userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleSubmenu = (index) => {
    setOpenSubmenuIndex(openSubmenuIndex === index ? null : index);
  };

  return (
    <motion.div
      className="relative z-10 h-screen sticky top-0"
      initial={false}
      animate={{
        width: isSidebarOpen ? 240 : 76,
        transition: { duration: 0.3, ease: "easeInOut" },
      }}
    >
      <div className="h-full bg-slate-800/80 backdrop-blur-lg flex flex-col border-r border-slate-700/30 shadow-lg">
        {/* Header - Fixed */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-5">
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-1.5 h-7 bg-blue-500 rounded-r mr-2"></div>
                  <h1 className="text-lg font-semibold text-white tracking-wide">
                    ADMIN PORTAL
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md bg-slate-700/50 hover:bg-slate-700/70 transition-colors"
            >
              <Menu size={18} className="text-slate-300" />
            </motion.button>
          </div>

          {/* User Profile - Fixed */}
          <UserProfile isOpen={isSidebarOpen} formData={formData} />
        </div>

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent px-2">
          <nav className="space-y-6 pb-4">
            {MENU_GROUPS.map((group, groupIndex) => (
              <div key={group.label} className="pt-2 first:pt-0">
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.h2
                      className="px-4 text-xs font-semibold text-blue-400 mb-2 tracking-wider"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {group.label}
                    </motion.h2>
                  )}
                </AnimatePresence>
                <div className="space-y-1">
                  {group.items.map((item, itemIndex) => (
                    <div key={item.href || item.name}>
                      {item.href ? (
                        <Link to={item.href}>
                          <MenuItem
                            item={item}
                            isOpen={isSidebarOpen}
                            isActive={location.pathname === item.href}
                            isSubmenuOpen={
                              openSubmenuIndex === `${groupIndex}-${itemIndex}`
                            }
                            onToggleSubmenu={() =>
                              toggleSubmenu(`${groupIndex}-${itemIndex}`)
                            }
                          />
                        </Link>
                      ) : (
                        <MenuItem
                          item={item}
                          isOpen={isSidebarOpen}
                          isActive={false}
                          isSubmenuOpen={
                            openSubmenuIndex === `${groupIndex}-${itemIndex}`
                          }
                          onToggleSubmenu={() =>
                            toggleSubmenu(`${groupIndex}-${itemIndex}`)
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Logout Button - Fixed */}
        <div className="p-4 border-t border-slate-700/30">
          <motion.button
            className="w-full flex items-center p-2.5 text-sm font-medium text-white rounded-md transition-colors bg-red-600/20 hover:bg-red-600/30 border border-red-600/30"
            onClick={handleLogout}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="p-1.5 rounded-md bg-red-600/30">
              <LogOut size={16} className="text-red-400" />
            </div>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  className="ml-3 text-red-300"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                >
                  Đăng Xuất
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
