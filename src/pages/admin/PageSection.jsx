import { useState, useEffect, useCallback } from "react";
import TableSection from "../../components/admin/Section/TableSection";
import FilterSection from "../../components/admin/Section/FilterSection";
import Header from "../../components/admin/common/Header";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const PageSection = () => {
  const [sections, setSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const sectionsPerPage = 12;
  const token = localStorage.getItem("token");
  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = () => setRefresh((prev) => !prev);

  useEffect(() => {
    const fetchSections = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/admin/section`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Lỗi fetch dữ liệu");
        }
        const data = await response.json();
        setSections(data);
        setFilteredSections(data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, [token, refresh]);

  const handleFilter = useCallback(
    (id, title, courseName, status) => {
      let filtered = sections;
      const searchText = id;
      if (searchText) {
        const lowerSearch = searchText.toLowerCase();
        filtered = filtered.filter(
          (section) =>
            section.sectionId.toString().toLowerCase().includes(lowerSearch) ||
            section.title.toLowerCase().includes(lowerSearch) ||
            section.courseName.toLowerCase().includes(lowerSearch)
        );
      }
      if (status !== "all") {
        filtered = filtered.filter((section) =>
          status === "active"
            ? section.status === true
            : section.status === false
        );
      }
      setFilteredSections(filtered);
      setCurrentPage(1);
    },
    [sections]
  );

  const totalPages = Math.ceil(filteredSections.length / sectionsPerPage);
  const indexOfLastSection = currentPage * sectionsPerPage;
  const indexOfFirstSection = indexOfLastSection - sectionsPerPage;
  const currentSections = filteredSections.slice(
    indexOfFirstSection,
    indexOfLastSection
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    let pageNumbers = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const left = [1, 2, 3];
      const right = [totalPages - 2, totalPages - 1, totalPages];
      let middle = [];
      if (currentPage > 3 && currentPage < totalPages - 2) {
        middle = [currentPage - 1, currentPage, currentPage + 1];
      } else if (currentPage <= 3) {
        middle = [4, 5];
      } else {
        middle = [totalPages - 4, totalPages - 3];
      }
      let allPages = [...new Set([...left, ...middle, ...right])].sort(
        (a, b) => a - b
      );
      for (let i = 0; i < allPages.length; i++) {
        if (i > 0 && allPages[i] - allPages[i - 1] > 1) {
          pageNumbers.push("...");
        }
        pageNumbers.push(allPages[i]);
      }
    }
    return (
      <div className="flex flex-col items-center space-y-4 mt-6">
        <div className="text-sm text-gray-400">
          Hiển thị <span className="font-medium text-white">{indexOfFirstSection + 1}</span>
          {" - "}
          <span className="font-medium text-white">
            {Math.min(indexOfLastSection, filteredSections.length)}
          </span>{" "}
          trong tổng số{" "}
          <span className="font-medium text-white">{filteredSections.length}</span> section
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="px-2 py-2 rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors duration-200"
            title="Trang đầu tiên"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
          </button>
          
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors duration-200 flex items-center"
          >
            <FaChevronLeft className="mr-1" size={12} />
            <span className="text-sm">Prev</span>
          </button>
          
          {pageNumbers.map((page, index) =>
            page === "..." ? (
              <span
                key={index}
                className="px-4 py-2 text-gray-400"
              >
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            )
          )}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-2 rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors duration-200 flex items-center"
          >
            <span className="text-sm">Next</span>
            <FaChevronRight className="ml-1" size={12} />
          </button>
          
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-2 py-2 rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors duration-200"
            title="Trang cuối cùng"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <Header title="Quản Lý Chương" />
        
        <div className="mt-6">
          <FilterSection onFilter={handleFilter} />
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-400">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <>
              <div className="bg-gray-800 rounded-xl p-5 mb-6 shadow-lg border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Danh sách Sections</h2>
                  <div className="text-sm text-gray-400">
                    Tổng số: <span className="text-white font-medium">{filteredSections.length}</span> sections
                  </div>
                </div>
                
                <TableSection
                  sections={currentSections}
                  triggerRefresh={triggerRefresh}
                />
              </div>
              
              {filteredSections.length > 0 ? (
                renderPagination()
              ) : (
                <div className="bg-gray-800 rounded-xl p-8 flex flex-col items-center justify-center border border-gray-700">
                  <svg
                    className="w-16 h-16 text-gray-600 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <p className="text-gray-400 text-lg font-medium">Không có dữ liệu</p>
                  <p className="text-gray-500 text-sm mt-1 text-center">
                    Không tìm thấy section nào phù hợp với bộ lọc hiện tại. Vui lòng thử lại với các điều kiện khác.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageSection;