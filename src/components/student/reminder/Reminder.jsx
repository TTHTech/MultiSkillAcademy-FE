import { useEffect, useState } from "react";
import StudyReminderList from "./StudyReminderList";
import { ChevronRight, ChevronLeft, Search, Bell, BellOff, X, Filter, AlertTriangle, BookOpen, Loader2 } from "lucide-react";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const Reminder = () => {
  const userId = Number(localStorage.getItem("userId"));
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("none");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const itemsPerPage = 6;
  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = () => setRefresh((prev) => !prev);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${baseUrl}/api/student/reminders/user/${userId}`
        );
        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu");
        }
        const data = await response.json();
        setReminders(data);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReminders();
  }, [userId, refresh]);

  const filteredReminders = reminders
    .filter((reminder) =>
      reminder.nameCourse.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "active") return b.active - a.active;
      if (sortBy === "inactive") return a.active - b.active;
      return 0;
    });

  const totalPages = Math.ceil(filteredReminders.length / itemsPerPage);
  const displayedReminders = filteredReminders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
  };

  const handleClose = (e) => {
    if (e.target.id === "overlay") {
      setSelectedCourse(null);
    }
    triggerRefresh();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  const renderEmptyState = () => (
    <div className="py-12 px-6 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
      <div className="mx-auto w-16 h-16 bg-indigo-50 flex items-center justify-center rounded-full mb-4">
        <Bell className="w-8 h-8 text-indigo-300" />
      </div>
      <h3 className="text-lg font-medium text-gray-700 mb-2">Không tìm thấy nhắc nhở</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        {searchTerm 
          ? `Không tìm thấy khóa học nào phù hợp với từ khóa "${searchTerm}"`
          : "Bạn chưa có nhắc nhở học tập nào. Tạo nhắc nhở mới để theo dõi việc học của bạn."}
      </p>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50">
      <AlertTriangle className="flex-shrink-0 w-5 h-5 mr-2" />
      <span className="font-medium">{error}</span>
    </div>
  );

  const renderLoadingState = () => (
    <div className="py-12 flex justify-center items-center">
      <div className="text-center">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-500 mx-auto mb-3" />
        <p className="text-gray-500">Đang tải nhắc nhở...</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <a
          href="/student/home"
          className="hover:text-indigo-600 transition-colors duration-200"
        >
          Trang chủ
        </a>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-700 font-medium">
          Nhắc nhở học tập
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Nhắc nhở học tập
              </h1>
              <p className="text-gray-500 text-sm">
                Quản lý các lời nhắc nhở giúp bạn duy trì việc học đều đặn
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên khóa học..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSortBy(sortBy === "active" ? "none" : "active")}
                className={`px-4 py-2.5 rounded-lg border flex items-center gap-2 transition-colors ${
                  sortBy === "active" 
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Đang hoạt động</span>
              </button>
              <button
                onClick={() => setSortBy(sortBy === "inactive" ? "none" : "inactive")}
                className={`px-4 py-2.5 rounded-lg border flex items-center gap-2 transition-colors ${
                  sortBy === "inactive" 
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <BellOff className="h-4 w-4" />
                <span className="hidden sm:inline">Không hoạt động</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error ? (
            renderErrorState()
          ) : loading ? (
            renderLoadingState()
          ) : displayedReminders.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {displayedReminders.map((reminder) => (
                <div
                  key={reminder.courseId}
                  onClick={() => handleSelectCourse(reminder)}
                  className="p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 bg-white cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center">
                    <div className="bg-indigo-50 p-3 rounded-lg mr-4">
                      <BookOpen className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {reminder.nameCourse}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Nhấp để xem chi tiết các nhắc nhở
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 sm:mt-0">
                    <div className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                      <Bell className="h-4 w-4 mr-1.5" />
                      Hoạt động: {reminder.active}
                    </div>
                    <div className="flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-sm font-medium">
                      <BellOff className="h-4 w-4 mr-1.5" />
                      Không hoạt động: {reminder.inactive}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && displayedReminders.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
                className="flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium text-gray-700"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Trước
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                // Tính toán các trang để hiển thị
                let pageToShow;
                
                if (totalPages <= 5) {
                  pageToShow = idx + 1;
                } else if (currentPage <= 3) {
                  pageToShow = idx + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageToShow = totalPages - 4 + idx;
                } else {
                  pageToShow = currentPage - 2 + idx;
                }
                
                if (pageToShow > 0 && pageToShow <= totalPages) {
                  return (
                    <button
                      key={pageToShow}
                      onClick={() => setCurrentPage(pageToShow)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                        currentPage === pageToShow
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {pageToShow}
                    </button>
                  );
                }
                return null;
              })}
              
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || loading}
                className="flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium text-gray-700"
              >
                Sau
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Course Details */}
      {selectedCourse && (
        <div
          id="overlay"
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4 z-50"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-indigo-600 mr-2" />
                <h2 className="text-lg font-semibold text-indigo-800">
                  {selectedCourse.nameCourse}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-1.5 rounded-full hover:bg-indigo-100 transition-colors"
              >
                <X className="h-5 w-5 text-indigo-600" />
              </button>
            </div>
            
            <div className="overflow-auto flex-1 p-6">
              <StudyReminderList
                courseId={selectedCourse.courseId}
                nameCourse={selectedCourse.nameCourse}
                triggerMainRefresh={triggerRefresh}
              />
            </div>
            
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminder;