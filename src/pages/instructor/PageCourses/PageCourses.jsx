import { useState, useEffect } from "react";
import Sidebar from "../../../components/instructor/Sidebar/Sidebar";
import ListCard from "../../../components/instructor/Card/ListCoursesCard";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const userId = localStorage.getItem("userId");

const PageCourses = () => {
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // pagination state
  const [pendingPage, setPendingPage] = useState(1);
  const [approvedPage, setApprovedPage] = useState(1);
  const [unsentPage, setUnsentPage] = useState(1);
  const [declinedPage, setDeclinedPage] = useState(1);
  const [inactivePage, setInactivePage] = useState(1);

  const coursesPerPage = 8;

  // Fetch data with loading & error handling
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(`${baseUrl}/api/instructor/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!resp.ok) throw new Error(`Status ${resp.status}`);
        const data = await resp.json();
        setCourses(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (userId && localStorage.getItem("token")) {
      fetchCourses();
    } else {
      setLoading(false);
      setError("Chưa có thông tin đăng nhập.");
    }
  }, []);

  // Filter courses by status
  const filterCourses = (status) =>
    courses.filter((course) => {
      if (status === "pending")
        return !course.status || course.status === "Pending";
      if (status === "approved")
        return ["Active", "Processing"].includes(course.status);
      if (status === "unsent") return course.status === "Unsent";
      if (status === "declined") return course.status === "Declined";
      if (status === "inactive") return course.status === "Inactive";
      return false;
    });

  // Pagination helper
  const paginate = (list, page) => {
    const start = (page - 1) * coursesPerPage;
    return list.slice(start, start + coursesPerPage);
  };

  // Tabs config
  const tabs = [
    {
      key: "pending",
      label: "Chưa Duyệt",
      page: pendingPage,
      setPage: setPendingPage,
    },
    {
      key: "approved",
      label: "Đã Duyệt",
      page: approvedPage,
      setPage: setApprovedPage,
    },
    {
      key: "inactive",
      label: "Bị Khóa",
      page: inactivePage,
      setPage: setInactivePage,
    },
    {
      key: "unsent",
      label: "Chưa Gửi",
      page: unsentPage,
      setPage: setUnsentPage,
    },
    {
      key: "declined",
      label: "Bị Từ Chối",
      page: declinedPage,
      setPage: setDeclinedPage,
    },
  ];

  // Precompute lists
  const lists = Object.fromEntries(
    tabs.map(({ key }) => [key, filterCourses(key)])
  );

  // Generate pagination numbers
  const pagesCount = (key) => Math.ceil(lists[key].length / coursesPerPage);

  return (
    <section
      className={`flex-1 duration-300 font-semibold text-gray-900 ${
        open ? "ml-72" : "ml-16"
      } bg-gradient-to-b from-gray-100 to-blue-100 min-h-screen`}
    >
      <Sidebar open={open} setOpen={setOpen} />

      <div className="p-4 space-y-6">
        {/* Tabs */}
        <div className="flex justify-center space-x-4 py-4">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                // reset pages
                tabs.forEach(({ setPage }) => setPage(1));
              }}
              className={`px-6 py-2 rounded-full font-medium text-lg transition-all duration-300 ${
                activeTab === key
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6">
          {loading ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500"></div>
                <p className="mt-4 text-blue-500 text-xl font-bold">
                  Loading...
                </p>
              </div>
            </div>
          ) : error ? (
            <p className="text-center text-red-500">Lỗi: {error}</p>
          ) : lists[activeTab].length === 0 ? (
            <p className="text-center text-gray-500">Không có khóa học</p>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <ListCard
                courses={paginate(
                  lists[activeTab],
                  tabs.find((t) => t.key === activeTab).page
                )}
              />
              {/* Pagination */}
              <div className="flex justify-center space-x-2 mt-6">
                {Array.from(
                  { length: pagesCount(activeTab) },
                  (_, i) => i + 1
                ).map((pg) => (
                  <button
                    key={pg}
                    onClick={() =>
                      tabs.find((t) => t.key === activeTab).setPage(pg)
                    }
                    className={`px-4 py-2 rounded-full text-lg font-semibold transition-all duration-300 ${
                      tabs.find((t) => t.key === activeTab).page === pg
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-blue-300"
                    }`}
                  >
                    {pg}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageCourses;
