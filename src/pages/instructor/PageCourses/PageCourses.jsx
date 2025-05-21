import { useState, useEffect } from "react";
import Sidebar from "../../../components/instructor/Sidebar/Sidebar";
import ListCard from "../../../components/instructor/Card/ListCoursesCard";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const PageCourses = () => {
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Unified pagination state
  const [pageNumbers, setPageNumbers] = useState({
    pending: 1,
    approved: 1,
    unsent: 1,
    declined: 1,
    inactive: 1,
  });
  const coursesPerPage = 8;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(`${baseUrl}/api/instructor/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
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

    fetchCourses();
  }, []);

  const filterCourses = (status) => {
    switch (status) {
      case "pending":
        return courses.filter(
          (c) => !c.status || c.status === "Pending"
        );
      case "approved":
        return courses.filter(
          (c) => ["Active", "Processing"].includes(c.status)
        );
      case "unsent":
        return courses.filter((c) => c.status === "Unsent");
      case "declined":
        return courses.filter((c) => c.status === "Declined");
      case "inactive":
        return courses.filter((c) => c.status === "Inactive");
      default:
        return [];
    }
  };

  const paginate = (list, page) => {
    const start = (page - 1) * coursesPerPage;
    return list.slice(start, start + coursesPerPage);
  };

  const tabs = [
    { key: "pending", label: "Chưa Duyệt" },
    { key: "approved", label: "Đã Duyệt" },
    { key: "inactive", label: "Bị Khóa" },
    { key: "unsent", label: "Chưa Gửi" },
    { key: "declined", label: "Bị Từ Chối" },
  ];

  const lists = Object.fromEntries(
    tabs.map(({ key }) => [key, filterCourses(key)])
  );

  const handleTabClick = (key) => {
    setActiveTab(key);
    setPageNumbers((prev) => ({ ...prev, [key]: 1 }));
  };

  const currentList = lists[activeTab];
  const currentPage = pageNumbers[activeTab];
  const totalPages = Math.ceil(currentList.length / coursesPerPage);

  return (
    <section
      className={`flex-1 duration-300 font-semibold text-gray-900 ${
        open ? "ml-72" : "ml-16"
      } bg-gradient-to-b from-gray-100 to-blue-100 min-h-screen`}
    >
      <Sidebar open={open} setOpen={setOpen} />

      <div className="p-4 space-y-6">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-screen">
            <div className="relative flex flex-col items-center bg-white bg-opacity-90 p-6 rounded-2xl shadow-xl">
              <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-blue-600 font-semibold text-lg animate-pulse">
                Đang tải dữ liệu...
              </p>
            </div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500">Lỗi: {error}</p>
        ) : (
          <>
            <div className="flex justify-center space-x-4 py-4">
              {tabs.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleTabClick(key)}
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

            {currentList.length === 0 ? (
              <p className="text-center text-gray-500">Không có khóa học</p>
            ) : (
              <div className="mt-6 bg-white p-6 rounded-lg shadow-md space-y-4" key={activeTab}>
                {/* Key on container to force remount and clear stale state */}
                <ListCard courses={paginate(currentList, currentPage)} />
                <div className="flex justify-center space-x-2 mt-6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pg) => (
                      <button
                        key={pg}
                        onClick={() =>
                          setPageNumbers((prev) => ({ ...prev, [activeTab]: pg }))
                        }
                        className={`px-4 py-2 rounded-full text-lg font-semibold transition-all duration-300 ${
                          currentPage === pg
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-blue-300"
                        }`}
                      >
                        {pg}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PageCourses;