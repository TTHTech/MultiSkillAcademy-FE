import { useState, useEffect, useCallback } from "react";
import TableSection from "../../components/admin/Section/TableSection";
import FilterSection from "../../components/admin/Section/FilterSection";
import Header from "../../components/admin/common/Header";

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
        const response = await fetch(
          "http://localhost:8080/api/admin/section",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
      <div className="flex items-center space-x-2 mt-4 justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-blue-500 text-white disabled:opacity-50"
        >
          Prev
        </button>
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-3 py-1 text-gray-700">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                page === currentPage
                  ? "bg-blue-700 text-white font-bold"
                  : "bg-blue-500 text-white"
              }`}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-blue-500 text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <div className="container mx-auto px-4">
        <Header title="Sections" />
        <div className="p-6">
          <FilterSection onFilter={handleFilter} />
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <>
              <TableSection
                sections={currentSections}
                triggerRefresh={triggerRefresh}
              />
              {filteredSections.length > 0 ? (
                renderPagination()
              ) : (
                <p className="mt-4 text-center text-gray-600">
                  Không có dữ liệu
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageSection;
