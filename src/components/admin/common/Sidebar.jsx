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
  DollarSign,
} from "lucide-react";
import { ChalkboardTeacher } from "phosphor-react";

const MENU_GROUPS = [
  {
    label: "MAIN MENU",
    items: [
      {
        name: "Overview",
        icon: BarChart2,
        color: "#6366f1",
        subItems: [
          {
            name: "Dashboard",
            icon: LayoutDashboard,
            href: "/admin",
            color: "#6366f1"
          },
          {
            name: "Quick Stats",
            icon: LineChart,
            href: "/admin/quick-stats",
            color: "#818CF8"
          },
          {
            name: "Recent Activity",
            icon: Clock,
            href: "/admin/recent-activity", 
            color: "#4F46E5"
          }
        ]
      },
      {
        name: "Statistics",
        icon: TrendingUp,
        color: "#6EE7B7",
        subItems: [
          {
            name: "Sales Table",
            icon: BarChart,
            href: "/admin/statistics",
            color: "#6EE7B7"
          },
          {
            name: "Sale By Instructors",
            icon: Users,
            href: "/admin/sale-by-instructor",
            color: "#34D399"
          },
        
          {
            name: "Statistics Reviews",
            icon: Activity,
            href: "/admin/statistics/performance",
            color: "#10B981"
          },
          {
            name: "Reports",
            icon: FileText,
            href: "/admin/statistics/reports",
            color: "#059669"
          }
        ]
      },
      {
        name: "Revenue Management",
        icon: BarChart2,
        color: "#60A5FA", // xanh dương
        subItems: [
          {
            name: "Revenue Overview",
            icon: LineChart,
            href: "/admin/revenue",
            color: "#60A5FA"
          },
          {
            name: "Admin Revenue Dashboard",
            icon: Users,
            href: "/admin/revenue-dashboard",
            color: "#3B82F6"
          },
          {
            name: "Instructor Revenue",
            icon: DollarSign,
            href: "/admin/instructor-revenue",
            color: "#2563EB"
          },
          {
            name: "Instructor Sales",
            icon: TrendingUp,
            href: "/admin/instructor-sales",
            color: "#1D4ED8"
          },
          {
            name: "Sharing Policies",
            icon: FileText,
            href: "/admin/revenue-policy",
            color: "#2563EB"
          },
          {
            name: "Payout Reports",
            icon: Archive,
            href: "/admin/revenue/payouts",
            color: "#1D4ED8"
          }
        ]
      },
      
      { 
        name: "Notifications", 
        icon: Bell, 
        color: "#F59E0B",
        subItems: [
          {
            name: "All Notifications",
            icon: Inbox,
            href: "/admin/notification",
            color: "#F59E0B"
          },
          {
            name: "Create Notification",
            icon: Mail,
            href: "/admin/add-notification",
            color: "#EF4444"
          },
          // {
          //   name: "System",
          //   icon: AlertTriangle,
          //   href: "/admin/notification/system",
          //   color: "#3B82F6"
          // },
          // {
          //   name: "Archive",
          //   icon: Archive,
          //   href: "/admin/notification/archive",
          //   color: "#6366f1"
          // },
          // {
          //   name: "Settings",
          //   icon: Settings,
          //   href: "/admin/notification/settings",
          //   color: "#8B5CF6"
          // }
        ]
      }
    ]
  },
  {
    label: "COURSE MANAGEMENT",
    items: [
      { 
        name: "Courses", 
        icon: BookOpen, 
        color: "#8B5CF6",
        subItems: [
          { 
            name: "All Courses", 
            icon: ListFilter, 
            href: "/admin/courses",
            color: "#8B5CF6"
          },
          // { 
          //   name: "Add Course", 
          //   icon: PlusSquare, 
          //   href: "/admin/courses/add",
          //   color: "#10B981"
          // },
          { 
            name: "Course Reviews", 
            icon: MessageSquare, 
            href: "/admin/courses/reviews",
            color: "#EC4899"
          },
          { 
            name: "Sections", 
            icon: FolderTree, 
            href: "/admin/courses/sections",
            color: "#6366f1"
          },
          { 
            name: "Lectures", 
            icon: Video, 
            href: "/admin/courses/lectures",
            color: "#8B5CF6"
          }
        ]
      },
      { 
        name: "Categories", 
        icon: Layers, 
        color: "#F97316", 
        subItems: [
          {
            name: "All Categories",
            icon: ListFilter,
            href: "/admin/category",
            color: "#F97316"
          },
          {
            name: "Add Category",
            icon: FolderPlus,
            href: "/admin/category/add",
            color: "#10B981"
          }
        ]
      },
      {
        name: "Promotions",
        icon: Tag,
        color: "#EC4899",
        subItems: [
          {
            name: "Discount Usage",
            icon: Ticket,
            href: "/admin/discount-usage",
            color: "#F59E0B"
          },
          {
            name: "Discounts",
            icon: Percent,
            href: "/admin/discounts",
            color: "#EC4899"
          },
          {
            name: "Add Promotion",
            icon: PlusCircle,
            href: "/admin/promotions/add",
            color: "#10B981"
          }
        ]
      }
    ]
  },
  {
    label: "USER MANAGEMENT",
    items: [
      { 
        name: "Users", 
        icon: Users, 
        color: "#EC4899",
        subItems: [
          { 
            name: "Students", 
            icon: GraduationCap, 
            href: "/admin/student",
            color: "#EC4899"
          },
          { 
            name: "Instructors", 
            icon: ChalkboardTeacher, 
            href: "/admin/instructor",
            color: "#EC4899"
          },
          { 
            name: "Add User", 
            icon: Plus, 
            href: "/admin/add-user",
            color: "#10B981"
          },
        ]
      }
    ]
  },
  {
    label: "COMMUNICATION",
    items: [
      { 
        name: "Messages", 
        icon: MessageCircle, 
        color: "#6EE7B7",
        subItems: [
          {
            name: "Chat",
            icon: MessagesSquare,
            href: "/admin/chat",
            color: "#6EE7B7"
          },
          {
            name: "Announcements",
            icon: Megaphone,
            href: "/admin/announcements",
            color: "#F59E0B"
          },
          {
            name: "Support",
            icon: HeadphonesIcon,
            href: "/admin/support",
            color: "#EC4899"
          }
        ]
      }
    ]
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
            name: "General",
            icon: Sliders,
            href: "/admin/settings/general",
            color: "#64748b"
          },
          {
            name: "Appearance",
            icon: Palette,
            href: "/admin/settings/appearance",
            color: "#8B5CF6"
          },
          {
            name: "Security",
            icon: Shield,
            href: "/admin/settings/security",
            color: "#10B981"
          }
        ]
      },
    ]
  }
];

const UserProfile = ({ isOpen }) => (
  <motion.div 
    className="flex items-center p-4 mb-6 bg-gray-700 bg-opacity-50 rounded-lg"
    initial={false}
    animate={{ 
      height: isOpen ? "auto" : "64px",
      transition: { duration: 0.2 }
    }}
  >
    <div className="flex-shrink-0">
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
        <User size={20} className="text-white" />
      </div>
    </div>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="ml-3 overflow-hidden"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
        >
          <p className="text-sm font-medium text-white">Admin User</p>
          <p className="text-xs text-gray-400">admin@example.com</p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const MenuItem = ({ item, isOpen, isActive, isSubmenuOpen, onToggleSubmenu }) => {
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isParentOfActive = item.subItems?.some(subItem => 
    window.location.pathname === subItem.href
  );

  return (
    <div className="relative">
      <motion.div
        className={`flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer
          ${(isActive || isParentOfActive) ? 
            'bg-gray-700 bg-opacity-70 shadow-lg' : 
            'hover:bg-gray-700 hover:bg-opacity-50'
          }`}
        onClick={hasSubItems ? onToggleSubmenu : undefined}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <item.icon 
          size={20} 
          style={{ 
            color: item.color,
            minWidth: "20px"
          }}
        />
        <AnimatePresence>
          {isOpen && (
            <motion.span
              className="ml-3 text-gray-200 whitespace-nowrap overflow-hidden"
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
            animate={{ rotate: isSubmenuOpen ? 180 : 0 }}
          >
            <ChevronDown size={16} className="text-gray-400" />
          </motion.div>
        )}
        {isActive && isOpen && !hasSubItems && (
          <motion.div
            className="ml-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ChevronRight size={16} className="text-gray-400" />
          </motion.div>
        )}
      </motion.div>

      {/* Submenu */}
      {hasSubItems && (
        <AnimatePresence>
          {isSubmenuOpen && isOpen && (
            <motion.div
              className="mt-1 ml-4 pl-4 border-l border-gray-700"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {item.subItems.map((subItem) => (
                <Link key={subItem.href} to={subItem.href}>
                  <motion.div
                    className={`flex items-center p-2 text-sm font-medium rounded-lg transition-all duration-200
                      ${window.location.pathname === subItem.href ? 
                        'bg-gray-700 bg-opacity-70' : 
                        'hover:bg-gray-700 hover:bg-opacity-50'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <subItem.icon 
                      size={18} 
                      style={{ 
                        color: subItem.color,
                        minWidth: "18px"
                      }}
                    />
                    <span className="ml-3 text-gray-300">
                      {subItem.name}
                    </span>
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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
        width: isSidebarOpen ? 256 : 80,
        transition: { duration: 0.3, ease: "easeInOut" }
      }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-lg flex flex-col border-r border-gray-700/50">
        {/* Header - Fixed */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.h1
                  className="text-xl font-bold text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  Dashboard
                </motion.h1>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <Menu size={20} className="text-gray-400" />
            </motion.button>
          </div>

          {/* User Profile - Fixed */}
          <UserProfile isOpen={isSidebarOpen} />
        </div>

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <nav className="space-y-6 p-4">
            {MENU_GROUPS.map((group, groupIndex) => (
              <div key={group.label}>
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.h2
                      className="px-4 text-xs font-semibold text-gray-400 mb-2"
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
                            isSubmenuOpen={openSubmenuIndex === `${groupIndex}-${itemIndex}`}
                            onToggleSubmenu={() => toggleSubmenu(`${groupIndex}-${itemIndex}`)}
                          />
                        </Link>
                      ) : (
                        <MenuItem
                          item={item}
                          isOpen={isSidebarOpen}
                          isActive={false}
                          isSubmenuOpen={openSubmenuIndex === `${groupIndex}-${itemIndex}`}
                          onToggleSubmenu={() => toggleSubmenu(`${groupIndex}-${itemIndex}`)}
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
        <div className="p-4 border-t border-gray-700/50">
          <motion.button
            className="w-full flex items-center p-3 text-sm font-medium text-red-400 rounded-lg transition-colors hover:bg-red-400/10"
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={20} className="text-red-400" />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  className="ml-3"
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