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
    label: "MAIN MENU",
    items: [
      {
        name: "Overview",
        icon: BarChart2,
        color: "#4f46e5",
        subItems: [
          {
            name: "Dashboard",
            icon: LayoutDashboard,
            href: "/admin",
            color: "#4f46e5",
          },
          {
            name: "Quick Stats",
            icon: LineChart,
            href: "/admin/quick-stats",
            color: "#818cf8",
          },
          {
            name: "Recent Activity",
            icon: Clock,
            href: "/admin/recent-activity",
            color: "#4f46e5",
          },
        ],
      },
      {
        name: "Statistics",
        icon: TrendingUp,
        color: "#10b981",
        subItems: [
          {
            name: "Sales Table",
            icon: BarChart,
            href: "/admin/statistics",
            color: "#10b981",
          },
          {
            name: "Sale By Instructors",
            icon: Users,
            href: "/admin/sale-by-instructor",
            color: "#34d399",
          },

          {
            name: "Statistics Reviews",
            icon: Activity,
            href: "/admin/statistics/performance",
            color: "#10b981",
          },
          {
            name: "Reports",
            icon: FileText,
            href: "/admin/statistics/reports",
            color: "#059669",
          },
        ],
      },
      {
        name: "Revenue Management",
        icon: BarChart2,
        color: "#3b82f6",
        subItems: [
          {
            name: "Revenue Overview",
            icon: LineChart,
            href: "/admin/revenue",
            color: "#3b82f6",
          },
          {
            name: "Admin Revenue Dashboard",
            icon: Users,
            href: "/admin/revenue-dashboard",
            color: "#3b82f6",
          },
          {
            name: "Instructor Revenue",
            icon: DollarSign,
            href: "/admin/instructor-revenue",
            color: "#2563eb",
          },
          {
            name: "Instructor Sales",
            icon: TrendingUp,
            href: "/admin/instructor-sales",
            color: "#1d4ed8",
          },
          {
            name: "Sharing Policies",
            icon: FileText,
            href: "/admin/revenue-policy",
            color: "#2563eb",
          },
          {
            name: "Payout Reports",
            icon: Archive,
            href: "/admin/revenue/payouts",
            color: "#1d4ed8",
          },
        ],
      },

      {
        name: "Notifications",
        icon: Bell,
        color: "#f59e0b",
        subItems: [
          {
            name: "All Notifications",
            icon: Inbox,
            href: "/admin/notification",
            color: "#f59e0b",
          },
          {
            name: "Create Notification",
            icon: Mail,
            href: "/admin/add-notification",
            color: "#ef4444",
          },
        ],
      },
    ],
  },
  {
    label: "COURSE MANAGEMENT",
    items: [
      {
        name: "Courses",
        icon: BookOpen,
        color: "#8b5cf6",
        subItems: [
          {
            name: "All Courses",
            icon: ListFilter,
            href: "/admin/courses",
            color: "#8b5cf6",
          },
          {
            name: "Course Reviews",
            icon: MessageSquare,
            href: "/admin/courses/reviews",
            color: "#ec4899",
          },
          {
            name: "Sections",
            icon: FolderTree,
            href: "/admin/courses/sections",
            color: "#4f46e5",
          },
          {
            name: "Lectures",
            icon: Video,
            href: "/admin/courses/lectures",
            color: "#8b5cf6",
          },
        ],
      },
      {
        name: "Categories",
        icon: Layers,
        color: "#f97316",
        subItems: [
          {
            name: "All Categories",
            icon: ListFilter,
            href: "/admin/category",
            color: "#f97316",
          },
          {
            name: "Add Category",
            icon: FolderPlus,
            href: "/admin/category/add",
            color: "#10b981",
          },
        ],
      },
      {
        name: "Promotions",
        icon: Tag,
        color: "#ec4899",
        subItems: [
          {
            name: "Discount Usage",
            icon: Ticket,
            href: "/admin/discount-usage",
            color: "#f59e0b",
          },
          {
            name: "Discounts",
            icon: Percent,
            href: "/admin/discounts",
            color: "#ec4899",
          },
          {
            name: "Browse Discounts",
            icon: BadgePercent,
            href: "/admin/browsed-discounts",
            color: "#ec4899",
          },
          {
            name: "Add Discount",
            icon: PlusCircle,
            href: "/admin/discount/add",
            color: "#10b981",
          },
          {
            name: "Promotion Usage",
            icon: Ticket,
            href: "/admin/promotions-usage",
            color: "#f59e0b",
          },
          {
            name: "Promotions",
            icon: Percent,
            href: "/admin/promotions",
            color: "#ec4899",
          },
          {
            name: "Add Promotion",
            icon: PlusCircle,
            href: "/admin/promotions/add",
            color: "#10b981",
          },
        ],
      },
      {
        name: "Reports",
        icon: AlertTriangle,
        color: "#f97316",
        subItems: [
          {
            name: "Report Review Course",
            icon: MessageCircle,
            href: "/admin/report/review-course",
            color: "#f97316",
          },
          {
            name: "Report Course",
            icon: Ticket,
            href: "/admin/report/course",
            color: "#10b981",
          },
        ],
      },
    ],
  },
  {
    label: "USER MANAGEMENT",
    items: [
      {
        name: "Users",
        icon: Users,
        color: "#ec4899",
        subItems: [
          {
            name: "Students",
            icon: GraduationCap,
            href: "/admin/student",
            color: "#ec4899",
          },
          {
            name: "Instructors",
            icon: ChalkboardTeacher,
            href: "/admin/instructor",
            color: "#ec4899",
          },
          {
            name: "Add User",
            icon: Plus,
            href: "/admin/add-user",
            color: "#10b981",
          },
        ],
      },
    ],
  },
  {
    label: "COMMUNICATION",
    items: [
      {
        name: "Messages",
        icon: MessageCircle,
        color: "#10b981",
        subItems: [
          {
            name: "Chat",
            icon: MessagesSquare,
            href: "/admin/chat",
            color: "#10b981",
          },
          {
            name: "Announcements",
            icon: Megaphone,
            href: "/admin/announcements",
            color: "#f59e0b",
          },
          {
            name: "Support",
            icon: HeadphonesIcon,
            href: "/admin/support",
            color: "#ec4899",
          },
        ],
      },
    ],
  },
  {
    label: "ADMINISTRATION",
    items: [
      {
        name: "Settings",
        icon: Settings,
        color: "#64748b",
        subItems: [
          {
            name: "Profile Admin",
            icon: UserCircle2,
            href: "/admin/profile-admin",
            color: "#64748b",
          },
          {
            name: "General",
            icon: Sliders,
            href: "/admin/settings/general",
            color: "#64748b",
          },
          {
            name: "Appearance",
            icon: Palette,
            href: "/admin/settings/appearance",
            color: "#8b5cf6",
          },
          {
            name: "Security",
            icon: Shield,
            href: "/admin/settings/security",
            color: "#10b981",
          },
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
          <p className="text-sm font-medium text-white">{formData.firstName} {formData.lastName}</p>
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
    profileImagePreview: ""
  });
  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/admin/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setFormData(prev => ({
          ...prev,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          dateOfBirth: data.dateOfBirth
            ? `${data.dateOfBirth[0]}-${String(data.dateOfBirth[1]).padStart(2, '0')}-${String(data.dateOfBirth[2]).padStart(2, '0')}`
            : "",
          profileImagePreview: data.profileImageUrl || ""
        }));
      })
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
          <UserProfile isOpen={isSidebarOpen} formData={formData}/>
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
                  Logout
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
